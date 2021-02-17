//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt =  require("mongoose-encryption");

const app = express();

// console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

// const secret = "Thisisourlittlesecret.";

// userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
  console.log("Username is " + req.body.username);
  console.log("Password is " + req.body.password);
 const newUser = new User({
   email: req.body.username,
   password: req.body.password
 });

newUser.save(function(err){
  if(err){
    console.log(err);
  } else{
    res.render("secrets");
  }
});

});

app.post("/login", function(req, res){
  //Getting username and password from form
  const username = req.body.username;
  const password = req.body.password;

  //Check in our DB whether there is an existing user with a submitted email
  User.findOne({email: username}, function(err, foundUser){
    //Check whether there are no errors, if there are not then
    //Check whether the password entered matches the password in DB

    if(err){
      console.log(err);
    } else {
      if (foundUser){
        if (foundUser.password === password){
          res.render("secrets");
        }
      }
    }
  });

});

app.listen(3000,function(){
  console.log("Server started on port 3000");
});
