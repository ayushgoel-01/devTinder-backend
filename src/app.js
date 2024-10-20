const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');
const {validateSignUpData} = require('./utils/validation');
const validator = require('validator');
const bcrypt = require('bcrypt');

app.use(express.json());

app.post('/signup', async (req,res) =>{
    try{
        // validation of data
        validateSignUpData(req);

        // Encryption of password
        const {firstName,lastName,emailId,password} = req.body;
        const passwordHash = await bcrypt.hash(password,10);
        console.log(passwordHash);

        // creating new instance of the user model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        });
        await user.save();
        res.send("User added successfully");
    }
    catch(err){
        res.status(400).send("ERROR :" + err.message);
    }
});


app.post('/login', async(req,res) =>{
    try{
        const {emailId,password} = req.body;

        if(!validator.isEmail(emailId)){
            throw new Error("Enter an valid email");
        }

        const user = await User.findOne({emailId: emailId});
        if(!user){
            throw new Error("Invalid Credentials");
        }

        const isPasswordValid = await bcrypt.compare(password,user.password);
        if(isPasswordValid){
            res.send("Login Successfull");
        }
        else{
            throw new Error("Invalid Credentials");
        }
    }
    catch(err){
        res.status(400).send("ERROR :" + err.message);
    }
})


app.get('/user', async(req,res) =>{
    const userEmail = req.body.emailId;

    try{
        const user = await User.findOne({emailId: userEmail});
        if(!user){
            res.status(404).send("User not found");
        }
        else{
            res.send(user);
        }
    }
    catch(err){
        res.status(400).send("Something went wrong");
    }
});


app.get('/feed', async(req,res) =>{
    try{
        const users = await User.find({});
        res.send(users);
    }
    catch(err){
        res.status(400).send("Something went wrong");
    }
})


app.delete('/user', async(req,res) =>{
    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndDelete(userId);
        res.send("User deleted successfully");
    }
    catch(err){
        res.status(400).send("Something went wrong");
    }
})


app.patch('/user/:userId', async(req,res) =>{
    const userId = req.params?.userId;
    const data = req.body;

    try{
        const ALLOWED_UPDATES = ["photoUrl","about","gender","age","skills"];

        const isUpdateAllowed = Object.keys(data).every((k) =>
            ALLOWED_UPDATES.includes(k)
        );
        if(!isUpdateAllowed){
            throw new Error("Update not allowed");
        }

        if(data?.skills.length > 10){
            throw new Error("Skills can not be more than 10");
        }

        await User.findByIdAndUpdate({_id: userId}, data, {
            returnDocument: "after",
            runValidators: true,
        });
        res.send("User updated successfully");
    }
    catch(err){
        res.status(400).send("Update failed:"+ err.message);
    }
})


connectDB().then(() =>{
    console.log("Database connected");
    app.listen(3000, ()=>{
        console.log("Server is running on port 3000");
    });
}).catch(err=>{
    console.log("Database can not be connected: "+ err);
});