const mongoose= require("mongoose")

const Subject=new mongoose.Schema({
    Sname:{
        type:String,
        required:true
    },
    Scode:{
        type:String,
        required:true
    },
    QuestionBankMCQ:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"MCQ"
    },
    QuestionBankCode:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"Code"
    },
    
})

module.exports=mongoose.model("subject",Subject)