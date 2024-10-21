const express = require('express');
const authRouter = express.Router();
const {validateSignUpData} = require('../utils/validation');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const validator = require('validator');


authRouter.post('/signup', async (req,res) =>{
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


authRouter.post('/login', async(req,res) =>{
    try{
        const {emailId,password} = req.body;

        if(!validator.isEmail(emailId)){
            throw new Error("Enter an valid email");
        }

        const user = await User.findOne({emailId: emailId});
        if(!user){
            throw new Error("Invalid Credentials");
        }

        const isPasswordValid = await user.validatePassword(password);
        if(isPasswordValid){

            // get JWT Token from helper function (inside user schema)
            const token = await user.getJWT();

            res.cookie("token",token, {
                expires: new Date(Date.now() + 8 * 3600000),
            });

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

module.exports = authRouter;