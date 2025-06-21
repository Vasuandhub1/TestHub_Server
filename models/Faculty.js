const mongoose= require("mongoose")

const Faculty=new mongoose.Schema({
    Fname:{
        type:String,
        required:true
    },
    UserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    Branch:{
        type:String,
        required:true
    },
    Subject:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"Subject"
    },
    JoiningYear:{
        type:Date,
        required:true
    },
    Gender:{
        type:String,
        required:true
    },

    MCQTest:{
         type:[mongoose.Schema.Types.ObjectId],
        ref:"MCQ"
    },
    CodingTest:{
         type:[mongoose.Schema.Types.ObjectId],
        ref:"code"
    },
    FacultyEnroll:{
        type:String,
        required:true
    },
    DOB:{
        type:Date,
        required:true
    }
})

module.exports= mongoose.model("Faculty",Faculty)