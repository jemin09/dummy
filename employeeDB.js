let express=require("express");
let app=express();
app.use(express.json());
app.use(function(req,res,next){
  res.header("Access-Control-Allow-Origin","*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST,OPTIONS,PUT,PATCH,DELETE,HEAD"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept"
  );
  next();
});

var port=process.env.PORT||2410;
app.listen(port,()=>console.log(`Node app Listening on port ${port}`));

const {Client}=require('pg');
const client=new Client({
  user:"postgres",
  password:"Jesmin@12344",
  database:"postgres",
  port:"5432",
  host:"db.bjwyunrwkuwvgcbcillj.supabase.co",
  // host:"localhost",
  ssl:{rejectUnauthorized:false},
});

client.connect(function(res,error){
  console.log(`Connect!!!`);
});

app.get("/svr/employees",function(req,res){
  console.log("Inside /employee get api");
  let query=`SELECT * FROM empcompany`;
  client.query(query,function(err,result){
    if(err) {
      console.log(err);
      res.status(404).send("Error in fetchig data");
    }
      res.send(result.rows);
    client.end();
  })
});

app.post("/svr/employees",function(req,res,next){
  console.log("Inside /employee get api");
  var values=Object.values(req.body);
  console.log(values);
  let query=`INSERT INTO empcompany(empCode,name,department,designation,salary,gender)
    VALUES ($1,$2,$3,$4,$5,$6)`;
  client.query(query,values,function(err,result){
    if(err) {
      console.log(err);
      res.status(404).send("Error in uploading data");
    }
      console.log(result);
      res.send(`$(result.rowCount) insertion successful`);
    client.end();
  })
});

app.put("/svr/employees/:empCode",function(req,res,next){
  console.log("Inside put of employee");
  let empCode=req.params.empCode;  
  let body=req.body;
  let params=[
    body.name,body.department,
    body.designation,body.salary,body.gender,empCode
   ];
  const sql=`UPDATE employee SET name=$1,department=$2,designation=$3,salary=$4,gender=$5 WHERE empCode=$6`;
   connection.query(sql,params,function(err,result){
    if(err){
      console.log(err);
      res.status(404).send("Error in Updating data");
    }
    else if(result.affectedRows===0){
      res.status(404).send("No update happened");
    }
    else res.send("Update success");
  })
});