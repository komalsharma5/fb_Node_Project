const mongoose = require('mongoose')


const connectDB = () =>{
    mongoose.connect("mongodb+srv://sharmakomalweb:3qvcLD00F3ps0Zo0@cluster0.1darij1.mongodb.net/login_page")
    .then((data)=>{
        if(data){
            console.log("connected to database")
        }
        
    }).catch((error)=>{
        console.log("Error")
    })
}

module.exports = connectDB