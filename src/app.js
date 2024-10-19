const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');

app.use(express.json());

app.post('/signup', async (req,res) =>{
    const user = new User(req.body);
    try{
        await user.save();
        res.send("User added successfully");
    }
    catch(err){
        res.status(400).send("Error saving the user:" + err.message);
    }
});


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


app.patch('/user', async(req,res) =>{
    const userId = req.body.userId;
    const data = req.body;

    try{
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
    console.log("Database can not be connected");
});