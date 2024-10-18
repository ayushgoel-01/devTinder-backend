const mongoose = require('mongoose');

const connectDB = async () =>{
    await mongoose.connect("mongodb+srv://ayushgoel:Ayushgoel123@cluster0.ihyzv.mongodb.net/")
}

module.exports = connectDB;