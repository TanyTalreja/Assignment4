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


const exphbs= require('express-handlebars');



var HTTP_PORT = process.env.PORT || 8080;

datasrvc.initialize().then(() => {
    app.listen(HTTP_PORT, ()=>{
        console.log("Express http server started and listening on: ", HTTP_PORT);
    });
}).catch((err) => {
    console.log("IRRRORRRRR!!!!! ", err);
}) 


app.use(express.static(__dirname + '/public/css'));
//A4
app.use(bodyParser.urlencoded({extended : true}));

//ass5
app.use(function(req,res,next){     
    let route = req.baseUrl + req.path;     
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");     
    next(); 
}); 
 
app.engine('.hbs', exphbs({ 
    extname: ".hbs",
    defaultLayout: "main",
    helpers:{
        navLink: function(url, options){    
             return '<li' +          
            ((url == app.locals.activeRoute) ? ' class="active" ' : '') +  
            '><a href="' + url + '">' + options.fn(this) + '</a></li>'; } ,
        
            equal:(lvalue, rvalue, options)=>{
            if(arguments.length <3)
                throw new Error("Handlebars Helper");
            if (lvalue != rvalue){
                return options.inverse(this);
            }else{
                return options.fn(this);
            }
        }
    }
}));
app.set("view engine", ".hbs");





// setup a 'route' 

app.get("/", function(req,res){
    res.render("home");
});

//route for employees/add
app.get("/employees/add", function(req,res){
    res.render("addEmployee");
});


//route for images/add
app.get("/images/add", function(req,res){
    res.render("addImage");
});


// setup another route to listen on /about
app.get("/about", function(req, res){
    res.render("about");
});


//employee
app.get("/employees", function(req, res){


    if(req.query.status ){
        datasrvc.getEmployeesByStatus(req.query.status).then((data)=>{
            
            res.render("employees", {employees: data});
           
        }).catch(function(err){
            res.render("employees", {message: "no results"});
            })
    }
    
    
    else if(req.query.department){
        datasrvc.getEmployeesByDepartment(req.query.department).then(data=>{
            res.render("employees", {employees: data});
        }).catch(err=>{
            res.render("employees", {message: "no results"});
        }) }
        
        
        
        else if(req.query.manager){
            datasrvc.getEmployeesByManager(req.query.manager).then(data=>{
                res.render("employees", {employees: data});
            }).catch(err=>{ 
                res.render("employees", {message: "no results"});
        });

        }
        else {
            datasrvc.getAllEmployees().then(data=>{
                res.render("employees",  {employees:data});
            }).catch(
                err=>{ res.render("employees", {message: "no results"});}
            );
    }

 
});

app.get('/employee/:value', (req, res)=>{
    datasrvc.getEmployeeByNum(req.params.value).then(data=>
        {
        res.render("employee", {employee: data }); 
    })
    .catch((err)=>{ 
        res.render("employees", {message: "no results"});}); 

});


//department

app.get("/departments", function(req,res){
    datasrvc.getDepartments()
                    .then((data)=>{
                        res.render("departments", { departments: data });

                    })
                    .catch((error)=>{
                        
                        res.render("departments", {message: "no results"});
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
        res.render("images", {data:items});
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

app.post("/employee/update", function(req, res){
    console.log(req.body);
    dataService.updateEmployee(req.body).then(
        ()=>res.redirect('/employees')
    );
       
});

