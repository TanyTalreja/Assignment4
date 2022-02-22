const fs=require("fs");

var employees=[];
var departments=[];

//initializing the json files data
module.exports.initialize = function () {

    return new Promise((resolve, reject) => {
       
        try {

            fs.readFile('./data/employees.json', (err, data) => {
                if (err) throw err;
                employees = JSON.parse(data);
                console.log("employess loaded");
            })

            fs.readFile('./data/departments.json', (err, data) => {
                if (err) throw err;

                departments = JSON.parse(data);
                console.log("department laoded");
            })

        } catch (ex) {
                      console.log("error reading files");
                      reject("error reading files");
                     }
        console.log("successfully read");
        resolve("successfully read");
    })

    return promise;
};

//employees

module.exports.getAllEmployees = function(){
    var employ =[];
    return new Promise((resolve, reject)=>{
        for(var i=0; i<employees.length; i++){
            employ.push(employees[i]);
        }
        if(employ.length ==0)
            reject("No result");
        resolve(employ);
    });

};

//departments
module.exports.getDepartments=function(){
    return new Promise(function(resolve, reject){
        if(departments.length ==0){
            reject('No results returned!')
        }else{
            resolve(departments);
        }
     });

};

//managers
module.exports.getManagers=function(){
    var mngrs =[];
    return new Promise(function(resolve, reject){
        for(var i=0; i<employees.length; i++){
           if(employees[i].isManager ==true){
            mngrs.push(employees[i]);
           }
                
        }
        if(mngrs.length ==0)
            reject("No result returned");
        resolve(mngrs);
    });
};

//A4

module.exports.addEmployees = function( employeeData ){

    return new Promise(function(resolve, reject){
 
            if(employeeData.isManager == undefined)
                employeeData.isManager = false;
             else
                 employeeData.isManager = true;
            employeeData.employeeNum = (employees.length)+1;
            employees.push(employeeData);
            resolve("the data is up!");
        

    });
}

module.exports.getEmployeesByStatus=function(status){
    var empStat = [];
    return new Promise(function(resolve, reject){
        for(let i=0; i<employees.length; i++){
            if(employees[i].status ==status)
            empStat.push(employees[i]);
        }  
        
         if(empStat.length ===0)
                reject("No result returned");
        resolve(empStat);
    });
}

module.exports.getEmployeesByDepartment = function(department){
    var dept =[];
    return new Promise((resolve, reject)=>{
        for(let i=0; i<employees.length; i++){
            
            dept = dept.filter(employee=>{ return employee.department == department;});
            
        }
        if(dept.length === 0)
            reject("No result returned!");
        resolve(dept);
    });
    
}
module.exports.getEmployeesByManager = function(manager){
    var mngr =[];
    return new Promise((resolve, reject)=>{
        mngr = employees.filter(employee=>{return employee.employeeManagerNum==manager});
        if(mngr.length ===0)
            reject("No result returned!");
        resolve(mngr);
    });
}

module.exports.getEmployeeByNum = function(num){
    var empl;
    return new Promise((resolve, reject)=>{
        empl = employees.filter(element=>{return element.employeeNum==num});
            if(empl.length ==0)
                reject("No result returned!");
            resolve(empl);
    });
}

//ass5
module.exports.updateEmployee= function(employeeData){

    return new Promise((resolve, reject)=>{
        for(var i=0; i<employees.length; i++){
            if(employees[i].employeeNum == employeeData.employeeNum)
                employees[i] = employeeData;
        }
       
    });
}