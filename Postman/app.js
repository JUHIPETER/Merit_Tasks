var express = require("express");
var app = express();
var path = require("path");
var stud = [];
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

app.use(express.static('uploads'));

app.set('view engine', 'pug');
app.set('views','./views');

const multer  = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, __dirname+'/uploads')
    },
    filename: function (req, file, cb) {
        console.log("file in filename function::",file)
        var fileext = path.extname(file.originalname);
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix+fileext)
    }
})

const upload = multer({ storage: storage })


const { MongoClient,ObjectId} = require('mongodb');
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);


const dbName = 'delta';

----view---
    app.get("/students",(req,res)=>{
        MongoClient.connect(url,(err,con)=>{
        var db = con.db("delta")
        db.collection("students").find().toArray((err,data)=>{
        console.log(data);
        res.send(data)
        })
       
        })
       
       })

----insert -----
 app.post("/addstudent",upload.single("profilepic"),function(req,res){
    console.log("req.file",req.file);    
    req.body.profilePic = req.file.filename;
    console.log("req.body",req.body);
    MongoClient.connect(url,function(err,con){
        var db = con.db("delta");
        db.collection("students").insertOne(req.body,function(err,data){
            res.send(data);
        })
    })
})

-------delete-----

app.get("/deletestudent/:id",function(req,res){
    MongoClient.connect(url,function(err,con){
        var db = con.db("delta");
        db.collection("students").deleteOne({_id:ObjectId(req.params.id)},function(err,data){
            res.send(data)
          //  res.redirect("/studlist")
        })
    })
})

app.get("/studlist",function(req,res){
    MongoClient.connect(url,function(err,con){
        var db = con.db("delta");
        db.collection("students").find().toArray((err,data)=>{
            res.render("stud",{
                stud:data
        })
    })  
})
})
app.get("/studentdetails/:id",function(req,res){
    MongoClient.connect(url,function(err,con){
        var db = con.db("delta");
        db.collection("students").find({_id:ObjectId(req.params.id)})
        .toArray(function(err,data){
            res.render("profile",{details:data
         
        })
       
        })
    })
})

app.get("/addstudentweightform/:id",function(req,res){
    res.render("addweightform",{
        studentid:req.params.id
    })
 })

-----update new item----
 app.post("/addstudentweight",function(req,res){
    MongoClient.connect(url,function(err,con){
        console.log(req.body)
        var db = con.db("delta");
        db.collection("students").updateOne({_id:ObjectId(req.body.id)},
        {
            $push:{
                weightEntry:{
                    date:req.body.date,
                    weight:req.body.weight,
                    waist:req.body.waist
                }
            }
        },
        function(err,data){
            console.log(data)
           // res.redirect("/studlist")
           res.send(data)
        })
    })
})

----update existing items----

app.post("/addstudentupdate",upload.single("profilepic"),function(req,res){
    MongoClient.connect(url,function(err,con){
        req.body.profilePic = req.file.filename;
        console.log(req.body)
        var db = con.db("delta");
        db.collection("students").updateOne({_id:ObjectId(req.body.id)},
        {
            $set:{
                
                firstname:req.body.firstname,
                lastname:req.body.lastname,
                age:req.body.age,
                profilepic:req.body.profilepic
            }
        },
        function(err,data){
            console.log(data)
           // res.redirect("/studlist")
           res.send(data)
        })
    })
})


app.listen(7080,function(){console.log("listening on 7080")})