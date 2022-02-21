/*********************************************************************************
* WEB322 – Assignment 03
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Tanishq Talreja Student ID: 126460203 Date:17-02-22
*
* Online (Heroku) Link:https://arcane-brushlands-95060.herokuapp.com/ | https://git.heroku.com/arcane-brushlands-95060.git
*cite: https://www.flickr.com/photos/filicudi/2891898817 :for picture of error 404
********************************************************************************/   
var express = require("express");
var datasrvc=require("./data-service.js");
var app = express();
const multer = require("multer");
const bodyParser = require("body-parser");
const fs = require('fs');
var path = require("path");


var HTTP_PORT = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public/css'));
//A4
app.use(bodyParser.urlencoded({extended : true}));

// cinitializing and starting the server if no error found
datasrvc.initialize().then(() => {
    app.listen(HTTP_PORT, ()=>{
        console.log("Express http server started and listening on: ", HTTP_PORT);
    });
}).catch((err) => {
    console.log("IRRRORRRRR!!!!! ", err);
}) 


// setup a 'route' 

app.get("/", function(req,res){
    res.sendFile(path.join(__dirname,"/views/home.html"));
});

//route for employees/add
app.get("/employees/add", function(req,res){
    res.sendFile(path.join(__dirname,"/views/addEmployee.html"));
});


//route for images/add
app.get("/images/add", function(req,res){
    res.sendFile(path.join(__dirname,"/views/addImage.html"));
});


// setup another route to listen on /about
app.get("/about", function(req,res){
    res.sendFile(path.join(__dirname,"/views/about.html"));
});


//employee
app.get("/employees", function(req, res){


    if(req.query.status ){
        datasrvc.getEmployeesByStatus(req.query.status).then((data)=>{
            res.json(data);
           
        }).catch(function(err){
                res.json({message: err});
            })
    }
    
    
    else if(req.query.department){
        datasrvc.getEmployeesByDepartment(req.query.department).then(data=>{
            res.json(data);
        }).catch(err=>{
            res.json({message: err});
        }) }
        
        
        
        else if(req.query.manager){
            datasrvc.getEmployeesByManager(req.query.manager).then(data=>{
                res.json(data);
            }).catch(err=>{ res.json({message: err})});

        }
        else {
            datasrvc.getAllEmployees().then(data=>{
                res.json(data);
            }).catch(
                err=>{ res.json({message: err})}
            );
    }

 
});

app.get('/employee/:value', (req, res)=>{
    datasrvc.getEmployeeByNum(req.params.value).then(data=>{
        res.json(data);
    }).catch((err)=>{ 
        res.json( {err})});

});


//department

app.get("/departments", function(req,res){
    datasrvc.getDepartments()
                    .then((data)=>{
                        console.log("parsed department");
                        res.json(data);

                    })
                    .catch((error)=>{
                        
                        res.json(error);
                    })
});


//manager
app.get("/managers", function(req,res){
    datasrvc.getManagers()
                    .then((data)=>{
                        console.log("parsed managers");
                        res.json(data);

                    })
                    .catch((error)=>{
                        
                        res.json(error);
                    })
});

//error handling
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname,"/views/error.html"));
  });

//A$444
const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function(req, file, cb){
        cb(null, Date.now()+path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


app.post("/images/add", upload.single("imageFile"), function(req, res){
    res.redirect('/images');
} );


app.get("/images",  function(req, res){  
      
    fs.readdir("./public/images/uploaded", function(err, items){
       
        res.json( {"images": items});
   });
   
   
});


app.post("/employees/add", function(req, res){
    datasrvc.addEmployees(req.body).then(
       res.redirect('/employees')
       
   )
    .catch(function(err){
       res.json({message: err});
  });


});


