const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');

app.post('/signup', async (req,res) =>{
    const user = new User({
        firstName: "ram",
        lastName: "kumar",
        emailId: "ram@gmail.com",
        password: "ram123",
    });
    try{
        await user.save();
        res.send("User added successfully");
    }
    catch(err){
        res.status(400).send("Error saving the user:" + err.message);
    }
    
});

connectDB().then(() =>{
    console.log("Database connected");
    app.listen(3000, ()=>{
        console.log("Server is running on port 3000");
    });
}).catch(err=>{
    console.log("Database can not be connected");
});