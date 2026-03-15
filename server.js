const express = require('express');
const mysql = require('mysql2');
const app = express();
//const port = 3000;
const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
  console.log(`Server running on port ${PORT}`);
});
//app.use(express.json()); // essential for reading the body of the request (add place request)

//const cors = require('cors');
//app.use(cors());

// 1. Configure the connection
const db = mysql.createPool({
  host: 'localhost',      // WampServer runs on your local machine
  user: 'root',           // Default WampServer username
  password: '',           // Default WampServer password is empty
  database: 'buloka', // The name you chose earlier
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 2. Test the connection
db.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to WampServer:', err.message);
  } else {
    console.log('Connected to WampServer MySQL successfully!');
    connection.release(); // Always release the connection back to the pool
  }
});

// 2. Create an API Route to get all places
app.get('/api/place', (req, res) => {
  const sql = "SELECT * FROM place WHERE is_approved = 1";

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    // This sends the data as a JSON object to your browser
    res.json(results);
  });
});


//for addplace html
app.post('/api/place',(req,res)=> {
  const { 
          managerName,
          managerContact,
          placeName,
          locationName,
          ratingNumber } = req.body;

  const sql = "INSERT INTO place (managerName,managerContact,placeName,locationName,ratingNumber) VALUES (?,?,?,?,?)";
  
  db.query(sql,[managerName,managerContact,placeName,locationName,ratingNumber],(err,result)=>{
    if(err){
      console.error(err);
      return res.status(500).json({error:"Databse insertion failed"});
    }
    res.status(201).json({message:"Place added?",id:result.insertId});
  });
});


/* pending route */
app.get('/api/admin/pending',(req,res)=>{
  const sql = "SELECT * FROM place";
  db.query(sql,(err,results)=>{
    if(err) throw err;
    res.json(results);
  });
});

/*
//approve feature
app.put('/api/place/approve/:id',(req,res)=>{
  const placeId = req.params.id;

  //the sql command to change data base
  const sql = "UPDATE place SET is_approved = 1 WHERE id =?";

  db.query(sql,[placeId],(err,result)=>{
    if(err){
      console.error(err);
      return res.status(500).send("Server Error");
    }
    //response
    res.json({message:"successfully approved"});
  });
}); */

app.put('/api/place/status/:id',(req,res)=>{
  const {id} = req.params;
  const {is_approved} = req.body; //expecting 1 or 0

  const sql = "UPDATE place SET is_approved=? WHERE id=?";
  db.query(sql,[is_approved,id],(err,result)=>{
    if(err) return res.status(500).json(err);
    res.json({message:"Status update"});
  });
});
//edit feature
app.put('/api/place/edit/:id',(req,res)=>{
  const {id} = req.params;
  const {
          managerName,
          managerContact,
          placeName,
          locationName,
          ratingNumber 
  } = req.body;

  const sql = "UPDATE place SET  managerName = ?,managerContact= ?,placeName= ?,locationName= ?,ratingNumber = ? WHERE id = ?";
  db.query(sql,[managerName,managerContact,placeName,locationName,ratingNumber,id],(err,result)=>{
    if(err) return res.status(500).json(err);
    res.json({message:"Place update in json"});
  });
});

// 3. Start the Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`To see your data, visit: http://localhost:${port}/api/place`);
  console.log(`http://localhost:${port}/api/admin/pending`);
});
