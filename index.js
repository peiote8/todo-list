//Dependencias
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient, assert = require('assert');
const url = 'mongodb://localhost:27017';
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
const config = require('./config.json');
const util = require('./util.js');
const mongoose = util.getMongoose();
var t;
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

//render css
app.use(express.static("public"));

//Conectar a mongo
MongoClient.connect(url, { useNewUrlParser: true ,  useUnifiedTopology: true}, (err, client) => {

    if (err) throw err;

    const db = client.db("todo");
    /*
    db.listCollections().toArray().then((docs) => {

        console.log('Available collections:');
        docs.forEach((doc, idx, array) => { console.log(doc.name) });

    }).catch((err) => {

        console.log(err);
    }).finally(() => {

        client.close();
    });
    */
    t = findDocuments(db, function() {
        client.close();
    });
});


//Listas para almacenar tareas/completas
var task = [];
var complete = [];

//Ruta POST para añadir tarea
app.post("/addtask", function(req, res) {
    var newTask = req.body.newtask;
    //add the new task from the post route
    task.push(newTask);
    //Insert en mongo
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("todo");
        var myobj = { name: newTask};
        dbo.collection("task").insertOne(myobj, function(err, res) {
            if (err) throw err;
            db.close();
        });
    });
    res.redirect("/");
});

//Ruta POST para eliminar tarea
app.post("/removetask", function(req, res) {
    var completeTask = req.body.check;
    //check for the "typeof" the different completed task, then add into the complete task
    if (typeof completeTask === "string") {
        complete.push(completeTask);
        //check if the completed task already exits in the task when checked, then remove it
        task.splice(task.indexOf(completeTask), 1);
    } else if (typeof completeTask === "object") {
        for (var i = 0; i < completeTask.length; i++) {
            complete.push(completeTask[i]);
            task.splice(task.indexOf(completeTask[i]), 1);
        }
    }
    res.redirect("/");
});

//render ejs HTML
app.get("/", function(req, res) {
    res.render("index", { task: task, complete: complete });
});

//set app to listen on port 3000
app.listen(3000, function() {
    console.log("server is running on port 3000");
});


var findDocuments = function(db, callback) {
    // Get the documents collection
    var collection = db.collection('task');
    // Find some documents
    collection.find({}).toArray(function (err, docs) {
        assert.equal(err, null);
        return docs;
        //console.log("Found the following records");
        //console.log(docs[0]['name']);
        callback(docs);
    });
}