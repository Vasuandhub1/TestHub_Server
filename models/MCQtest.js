const mongoose = require("mongoose")
const { type } = require("node:os")

const MCQTest = new mongoose.Schema({
    TestName:{
        type:String,
        required:true
    },
    TestDescription:{
        type:String,
        required:true,
    },
    TestType:{
            type:String,
            required:true,
            default:"MCQ" 
        },
        TestStartTime:{
            type:Date,
            required:true
        },
        TestExpireTime:{
            type:Date,
            required:true
        },
        TotalMarks:{
            type:Number,
            required:true
        },
        AttemptTime:{
            type:Number,
            required:true
        },
        Questions:{
            type:[mongoose.Schema.Types.ObjectId],
            ref:"mcqs",
            required:true
        },
        StudentList:{
            type:[mongoose.Schema.Types.ObjectId],
            ref:"Student"
        },
        AttemptedTestStudentList:{
            type:[mongoose.Schema.Types.ObjectId],
            ref:"Student"
        },
        Faculty:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Faculty"
        },
        Section:{
            type:String,
            default:"All",
        },
        HideResult:{
            type:Boolean,
            default:false
        },
        Subject:{
            type:String,
            default:"All"
        },
        Branch:{
            type:String,
            default:"All"
        },
        Year:{
            type:String,
            default:"All"
        }
    
})

module.exports = mongoose.model("MCQTest",MCQTest)