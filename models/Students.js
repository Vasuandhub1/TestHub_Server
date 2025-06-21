const mongoose= require("mongoose")

const Student=new mongoose.Schema({
    Sname:{
        type:String,
        required:true
    },
    UserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    Enroll:{
        type:String,
        required:true
    },
    MCQtest:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"MCQ"
    },
    CodingTest:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"Code"
    },
    Year:{
        type:String,
        required:true
    },
    Section:{
        type:String,
        required:true
    },
    Branch:{
        type:String,
        required:true
    },
    Gender:{
        type:String,
        required:true
    },
    DOB:{
        type:Date,
        required:true
    }
})

module.exports= mongoose.model("students",Student)