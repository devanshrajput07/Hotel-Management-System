const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = 7000;

mongoose.connect("mongodb://localhost:27017/Hotel-Management-System")
.then(()=>console.log("MongoDb connected"))
.catch((err)=>console.log("MongoDb Error , err"));

//Schema

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,     
    }, 
    lastName:{
        type: String,
    },
    email:{
        type: String,
        required: true,
    },
    accounttype:{
        type: String,
        required: true,
    },
});

const User = mongoose.model("user",userSchema);

//Middleware
app.use(express.urlencoded({ extended: false }));

//Rest Api
  
  // Add a User
  app.post('/api/User', (req, res) => {
   
  });
  

const userData = await User.create({
    firstName:body.firstName, 
    lastName:body.lastName,
    email:body.email,
    accounttype:body.accounttype,
})

app.listen(PORT, () => console.log(`Server started at port:${PORT}`));