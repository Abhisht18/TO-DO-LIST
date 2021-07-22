const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://admin-abhisht:Popjohn123@cluster0.uu063.mongodb.net/ToDoDB", {useNewUrlParser: true, useUnifiedTopology: true});

mongoose.set('useFindAndModify', false);

const app = express(); // defining app
const port = process.env.PORT || 3000 ;
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

const todoSchema = new mongoose.Schema ({
    name : String
})

const ToDos = mongoose.model("Todo", todoSchema);

const intro = new ToDos({
    name : "Write something and click " + "ADD +" + "."
})
const intro2 = new ToDos({
    name : "Mark when completed and Trash it when not needed." 
})

let arr = [intro, intro2];

app.get("/", (req, res)=>{
    ToDos.find({}, function(err, todoss){
        if(todoss.length===0){
            ToDos.insertMany(arr, function(err){
                if(err){
                    console.log(err);
                }else{
                    console.log("Successfully Added");
                }
            })
        }
        res.render("fpage",{todoss : todoss});
    });
})

app.post("/", function(req,res){
    if(req.body.newTodo === ""){
        res.redirect("/");
    }
    else{
    const newT = new ToDos({
        name: req.body.newTodo
    });
    newT.save();
    res.redirect("/");
}
})

app.post("/delete", function(req, res){
    const item = req.body.checkbox;
    console.log(req.body);
    ToDos.findByIdAndRemove(item, function(err){
        if(!err){
            console.log("Successfully deleted");
            res.redirect("/"); 
        }
    });
})

app.listen(port,() => {
    console.log(`listening to the port at ${port}`);
});