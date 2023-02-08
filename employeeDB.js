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
var format = require('pg-format');
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

app.get("/svr/resetData",function(req,res){
  console.log(`in Deletion section`);
  //if we use delete for reset new id gonna start from the previous id
  // let sql="DELETE FROM mobiletbl ";
   //if we use delete for reset new id gonna start from start id
  let sql=`TRUNCATE TABLE empcompany`;
  console.log(`in Deletion section`);
  client.query(sql,function(err,result){
    if(err){
      console.log(err);
      res.status(404).send("Error in delete data");
    }
    else{
      console.log(`Deletion Success.Deleted ${result.affectedRows} rows`);
      let {employeeData}=require("./empData.js");
      // console.log("employeeData",employeeData);
      let arr=employeeData.map(st=>[
        st.empCode,
        st.name,
        st.department,
        st.designation,st.salary,st.gender
      ]);

      console.log("employeeData",arr);

      let sql2=`INSERT INTO empcompany(empcode,name,department,designation,salary,gender) VALUES %L`;
      // let sql1=`INSERT INTO empcompany(arr) VALUES ($1)`;
      client.query(format(sql2,arr),function(err,result){
        if(err){
          console.log(err);
          res.status(404).send("Error in inserting data");
        }   
        else res.send(`Reset Success.Inserted ${result.affectedRows} rows`);
      })
    }
  })
})


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
  console.log("values",values);
  let query=`INSERT INTO empcompany(empCode,name,department,designation,salary,gender)
    VALUES ($1,$2,$3,$4,$5,$6)`;
  client.query(query,values,function(err,result){
    if(err) {
      console.log(err);
      res.status(404).send("Error in uploading data");
    }
      console.log(result);
      res.send(`${result.rowCount} insertion successful`);
    client.end();
  })
});

app.put("/svr/employees/:empCode",function(req,res,next){
  console.log("Inside put of employee");
  let empCode=req.params.empCode;  
  console.log("Inside put of employee",empCode);
  let body=req.body;
  let params=[
    body.name,body.department,
    body.designation,body.salary,body.gender,empCode
   ];
  const sql=`UPDATE empcompany SET name=$1,department=$2,designation=$3,salary=$4,gender=$5 WHERE empCode=$6`;
   client.query(sql,params,function(err,result){
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

app.delete("/svr/employees/:empCode",function(req,res){
  let empCode=req.params.empCode;
  console.log("Inside delete of employee",empCode);
  let sql=`DELETE FROM empcompany WHERE empCode=$1`;
  client.query(sql,[empCode],function(err,result){
    if(err){
      console.log(err);
      res.status(404).send("Error in deleting data");
    }
    else if(result.affectedRows===0){
      res.status(404).send("No delete happened");
    }
    else res.send("delete success");
  })
});