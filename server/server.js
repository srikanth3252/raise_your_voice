require("dotenv").config();

const express = require("express");

const cors = require("cors");

const nodemailer = require("nodemailer");

const multer = require("multer");

const storage = multer.diskStorage(
    {
        destination:(req,file,cb)=>
          {
             cb(null,"uploads/");
          },
        filename:(req,file,cb)=>
          {
             cb(null,Date.now() + "-" + file.originalname);
          }
});

const upload = multer({storage});

const app = express();

app.use("/uploads", express.static("uploads"));

const db = require("./db");

const port = process.env.PORT || 2000;
/* MIDDLEWARE */

app.use(cors());

app.use(express.json());
/* NODEMAILER */

const transporter = nodemailer.createTransport({

    service:"gmail",

    auth:
    {
        user:"srikanth_bapatu@srmap.edu.in",

        pass:"ugco tzkr oxsb qewd"
    }
});



/* OTP STORE */

const store = {};



/* GENERATE OTP */

function generateotp()
{
    return Math.floor(100000 + Math.random() * 900000);
}



/* SEND OTP */

app.post("/send-otp", async (req,res)=>
{
      const { email: emailid } = req.body;

      const email = emailid?.trim().toLowerCase();

      if(!email)
      {
          return res.status(400).json({message:"Enter valid email"});
      }

      if(!email.endsWith("@srmap.edu.in"))
      {
          return res.status(400).json({message:"Only SRM AP mails allowed"});
      }

      const otp = generateotp();

      store[email] = otp;

      try
      {
          await transporter.sendMail({

              from:'"Srikanth" <srikanth_bapatu@srmap.edu.in>',

              to:email,

              subject:"OTP Verification",

              text:`Your OTP is ${otp}`
          });

          return res.status(200).json({message:"OTP sent successfully"});
      }
      catch(error)
      {
          return res.status(500).json({message:error.message});
      }
});



/* VERIFY OTP */

app.post("/verify-otp",(req,res)=>
{
      const {email,otp} = req.body;

      if(!otp)
      {
          return res.status(400).json({message:"OTP missing"});
      }
      if(Number(otp) === store[email])
      {
          return res.status(200).json({message:"OTP verified"});
      }
      else
      {
          return res.status(400).json({message:"Invalid OTP"});
      }
});

// insertusers data route

app.post("/insertusers",(req,res)=>
{
    const { email } = req.body;

    const checkQuery = "SELECT * FROM users WHERE email = ?";

    db.query(checkQuery,[email],(error,result)=>
    {
        if(error)
        {
            return res.status(500).json({message:error.message});
        }

        if(result.length > 0)
        {
            return res.status(200).json({
                message:"User already exists"
            });
        }

        const insertQuery = "INSERT INTO users(email) VALUES(?)";

        db.query(insertQuery,[email],(error,result)=>
        {
            if(error)
            {
                return res.status(500).json({message:error.message});
            }

            return res.status(200).json({
                message:"User inserted successfully"
            });
        });
    });
});

// route to store the complaints

app.post("/complaint", upload.single("proof"), (req,res)=>{

    console.log(req.body);
    console.log(req.file);
    const { title, complaintCategory, complaintDescription } = req.body;
    const filePath = req.file ? req.file.path : null;

    let email = req.body.email;   // send from frontend

    const query = "SELECT user_id FROM users WHERE email=?";

    db.query(query,[email],(error,result)=>
    {

        if(error)
        {
            return res.status(500).json({message:error.message});
        }
        if(result.length === 0)
        {
            return res.status(404).json({message:"User not found"});
        }
        let user_id = result[0].user_id;

        const sql = ` INSERT INTO complaints (user_id,title,category,description,proof) VALUES(?,?,?,?,?)`;

        db.query(sql,[user_id,title,complaintCategory,complaintDescription,filePath],(err,result)=>
        {
            if(err)
            {
                console.log(err);
                return res.status(500).json({message:"DB error"});
            }

             return res.json({ message:"Complaint raised successfully and complaint is inserted in database",  complaint_id: result.insertId});
        });

    });
});

// route to get the complaints from database;

app.get("/getcomplaints", (req, res) => 
{
    const query = `
        SELECT 
            c.*,
            COUNT(cl.complaint_id) AS totalLikes
        FROM complaints c
        LEFT JOIN complaint_likes cl
        ON c.complaint_id = cl.complaint_id
        GROUP BY c.complaint_id
    `;

    db.query(query, [], (error, result) => 
    {
        if (error) {
            return res.status(500).json({ message: error.message });
        }

        return res.json(result);
    });
});

// route for complaint_likes table
app.post("/likes", (req, res) => {
    const { email, complaint_id } = req.body;

    const getUser = "SELECT user_id FROM users WHERE email = ?";

    db.query(getUser, [email], (error, result) => {
        if (error) {
            return res.status(500).json({ message: error.message });
        }

        if (result.length === 0) {
            return res.json({ message: "User not found" });
        }

        const user_id = result[0].user_id;

        const checkLike = `
            SELECT * FROM complaint_likes 
            WHERE user_id = ? AND complaint_id = ?
        `;

        db.query(checkLike, [user_id, complaint_id], (err1, result1) => {
            if (err1) {
                return res.status(500).json({ message: err1.message });
            }

            if (result1.length > 0) {

                // 🔥 IMPORTANT: still return current likes
                const countLikes = `
                    SELECT COUNT(*) AS totalLikes 
                    FROM complaint_likes 
                    WHERE complaint_id = ?
                `;

                db.query(countLikes, [complaint_id], (err3, countResult) => {
                    if (err3) {
                        return res.status(500).json({ message: err3.message });
                    }

                    return res.json({
                        message: "Already liked",
                        totalLikes: countResult[0].totalLikes
                    });
                });

                return;
            }

            const insertLike = `
                INSERT INTO complaint_likes (complaint_id, user_id)
                VALUES (?, ?)
            `;

            db.query(insertLike, [complaint_id, user_id], (err2) => {
                if (err2) {
                    return res.status(500).json({ message: err2.message });
                }

                const countLikes = `
                    SELECT COUNT(*) AS totalLikes 
                    FROM complaint_likes 
                    WHERE complaint_id = ?
                `;

                db.query(countLikes, [complaint_id], (err3, countResult) => {
                    if (err3) {
                        return res.status(500).json({ message: err3.message });
                    }

                    return res.json({
                        message: "Like added successfully",
                        totalLikes: countResult[0].totalLikes
                    });
                });
            });
        });
    });
});

// routr to get the trending complaints

app.get("/gettrendingcomplaints",(req,res)=>
{
     const query = `
            SELECT 
                c.*,
            COUNT(cl.complaint_id) AS totalLikes
            FROM complaints c
            LEFT JOIN complaint_likes cl
            ON c.complaint_id = cl.complaint_id
            GROUP BY c.complaint_id
            ORDER BY totalLikes DESC
            LIMIT 10`;

     db.query(query,[],(error,result)=>
    {
         if (error)
         {
            return res.status(500).json({ message: error.message });
         }

         return res.json(result);
    });    
});


// route to get the total complaints(solved,reject,pending)

app.get("/totalcomplaints", (req, res) => {

    const query = `
        SELECT
            COUNT(*) AS totalcomplaints,
            SUM(LOWER(status) = 'resolved') AS totalresolvedcomplaints,
            SUM(LOWER(status) = 'pending') AS totalpendingcomplaints,
            SUM(LOWER(status) = 'rejected') AS totalrejectedcomplaints
        FROM complaints
    `;

    db.query(query, [], (error, result) => {

        if (error) {
            return res.status(500).json({
                message: error.message
            });
        }

        return res.status(200).json({
            message: "data is delivered from database",
            statisticstype:"Total Complaints",
            totalcomplaints: result[0].totalcomplaints,
            totalresolvedcomplaints: result[0].totalresolvedcomplaints,
            totalpendingcomplaints: result[0].totalpendingcomplaints,
            totalrejectedcomplaints: result[0].totalrejectedcomplaints
        });

    });
});

// route to get the todays complaints

app.get("/todayscomplaints",(req,res)=>
{
      const query = `
        SELECT
            COUNT(*) AS totalcomplaints,
            SUM(LOWER(status) = 'resolved') AS totalresolvedcomplaints,
            SUM(LOWER(status) = 'pending') AS totalpendingcomplaints,
            SUM(LOWER(status) = 'rejected') AS totalrejectedcomplaints
        FROM complaints
        WHERE DATE(created_at) = CURDATE()
    `;

    db.query(query, [], (error, result) => {

        if (error) {
            return res.status(500).json({
                message: error.message
            });
        }

        return res.status(200).json({
            message: "data is delivered from database",
            statisticstype:"Todays Complaints",
            totalcomplaints: result[0].totalcomplaints,
            totalresolvedcomplaints: result[0].totalresolvedcomplaints,
            totalpendingcomplaints: result[0].totalpendingcomplaints,
            totalrejectedcomplaints: result[0].totalrejectedcomplaints
        });

    });
});

// route to  getweekcomplaints from complaints table;

app.get("/Lastweekcomplaints",(req,res)=>
{
      const query = `
        SELECT
            COUNT(*) AS totalcomplaints,
            SUM(LOWER(status) = 'resolved') AS totalresolvedcomplaints,
            SUM(LOWER(status) = 'pending') AS totalpendingcomplaints,
            SUM(LOWER(status) = 'rejected') AS totalrejectedcomplaints
        FROM complaints
       WHERE YEARWEEK(created_at, 1) = YEARWEEK(CURDATE() - INTERVAL 1 WEEK, 1)
    `;

    db.query(query, [], (error, result) => {

        if (error) {
            return res.status(500).json({
                message: error.message
            });
        }

        return res.status(200).json({
            message: "data is delivered from database",
            statisticstype:"Last Week Complaints",
            totalcomplaints: result[0].totalcomplaints,
            totalresolvedcomplaints: result[0].totalresolvedcomplaints,
            totalpendingcomplaints: result[0].totalpendingcomplaints,
            totalrejectedcomplaints: result[0].totalrejectedcomplaints
        });

    });
});


// route to  getweekcomplaints from complaints table;

app.get("/Lastmonthcomplaints",(req,res)=>
{
      const query = `
        SELECT
            COUNT(*) AS totalcomplaints,
            SUM(LOWER(status) = 'resolved') AS totalresolvedcomplaints,
            SUM(LOWER(status) = 'pending') AS totalpendingcomplaints,
            SUM(LOWER(status) = 'rejected') AS totalrejectedcomplaints
        FROM complaints
        WHERE created_at >= DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m-01')
              AND created_at < DATE_FORMAT(CURDATE(), '%Y-%m-01')
    `;

    db.query(query, [], (error, result) => {

        if (error) {
            return res.status(500).json({
                message: error.message
            });
        }

        return res.status(200).json({
            message: "data is delivered from database",
            statisticstype:"Last Month Complaints",
            totalcomplaints: result[0].totalcomplaints,
            totalresolvedcomplaints: result[0].totalresolvedcomplaints,
            totalpendingcomplaints: result[0].totalpendingcomplaints,
            totalrejectedcomplaints: result[0].totalrejectedcomplaints
        });

    });
});

// route to  getparticularcomplaints from complaints table;

app.post("/particulardaycomplaints",(req,res)=>
{
   const{singledate}=req.body;
        
      const query = `
        SELECT
            COUNT(*) AS totalcomplaints,
            SUM(LOWER(status) = 'resolved') AS totalresolvedcomplaints,
            SUM(LOWER(status) = 'pending') AS totalpendingcomplaints,
            SUM(LOWER(status) = 'rejected') AS totalrejectedcomplaints
        FROM complaints
        WHERE DATE(created_at) = ?
    `;

    db.query(query, [singledate], (error, result) => {

        if (error) {
            return res.status(500).json({
                message: error.message
            });
        }

        return res.status(200).json({
            message: "data is delivered from database",
            statisticstype:"Particular Day Complaints",
            totalcomplaints: result[0].totalcomplaints,
            totalresolvedcomplaints: result[0].totalresolvedcomplaints,
            totalpendingcomplaints: result[0].totalpendingcomplaints,
            totalrejectedcomplaints: result[0].totalrejectedcomplaints
        });

    });
});


// route to  getcustomcomplaints from complaints table;

app.post("/customdatecomplaints",(req,res)=>
{
   const{startdate,enddate}=req.body;
        
      const query = `
        SELECT
            COUNT(*) AS totalcomplaints,
            SUM(LOWER(status) = 'resolved') AS totalresolvedcomplaints,
            SUM(LOWER(status) = 'pending') AS totalpendingcomplaints,
            SUM(LOWER(status) = 'rejected') AS totalrejectedcomplaints
        FROM complaints
       WHERE DATE(created_at) BETWEEN ? AND ?
    `;

    db.query(query, [startdate,enddate], (error, result) => {

        if (error) {
            return res.status(500).json({
                message: error.message
            });
        }

        return res.status(200).json({
            message: "data is delivered from database",
            statisticstype:"Custom Date Complaints",
            totalcomplaints: result[0].totalcomplaints,
            totalresolvedcomplaints: result[0].totalresolvedcomplaints,
            totalpendingcomplaints: result[0].totalpendingcomplaints,
            totalrejectedcomplaints: result[0].totalrejectedcomplaints
        });

    });
});


// get  particular complaint details

app.post("/get_exact_complaint",(req,res)=>
{
      const{complaint_id}=req.body;

      let query2=`SELECT
                 complaint_id,
                 title,
                 category,
                 description,
                 proof,
                 status,
                 created_at,
                        (
                            SELECT COUNT(*)
                            FROM complaint_likes
                            WHERE complaint_id = ?
                        ) AS totallikes
                FROM complaints
                WHERE complaint_id = ?;
                `;

        db.query(query2,[complaint_id,complaint_id],(error,result)=>
        {
              if(error)
              {
                return res.status(500).json({message:error.message});
              }
              return res.status(200).json({message:"data is deleverd from database for particular complaint",result:result[0]})
        });
});

//updaterole route

app.post("/updaterole",(req,res)=>
{
    const { email } = req.body;

    const query =
    "SELECT * FROM admins WHERE email=?";

    db.query(query,[email],(error,result)=>
    {
        if(error)
        {
            return res.status(500).json({message:error.message});
        }
        if(result.length > 0)
        {
            const query1 ="UPDATE users SET role=? WHERE email=?";

            db.query(query1, ["admin",email],(error,result1)=>
            {
                if(error)
                {
                    return res.status(500).json({message:error.message});
                }
                return res.status(200).json({message:"Admin login successfully",role:"admin"});
            });
        }
        else
        {
            return res.status(200).json({
                message:"User login successfully",
                role:"student"
            });
        }
    });
});


app.post("/updatecomplaintstatus",(req,res)=>
{
    console.log("REQUEST BODY:", req.body);
    const { complaint_id,status } = req.body;
    const query =
    "UPDATE complaints SET status=? WHERE complaint_id=?";

    db.query(query, [status,complaint_id],(error,result)=>
    {
        if(error)
        {
            return res.status(500).json({message:error.message});
        }

        return res.status(200).json({message:"Complaint status updated successfully"});
    });
});

/* SERVER */

app.listen(port,()=>
{
    console.log(`Server running on port ${port}`);
});