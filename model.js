const mongoose = require('mongoose')

const user_Schema = mongoose.Schema(
    {
        First_Name :{
            type:String,
            trim:true
        },
        Last_Name:{
            type:String,
            trim:true
        },
        Email:{
            type:String,
            trim:true
        },
        Password:{
            type:String,
            trim:true
        },
        MobileNo:{
            type:Number
        },
        isBlocked: {
            type: Boolean,
            default: false,  // By default, the account is not blocked
        },
    },
    {
        timestamps:true
    })

    const userModel = mongoose.model('user', user_Schema)

    module.exports = userModel