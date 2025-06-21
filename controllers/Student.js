const Student = require("../models/Students")
const {handelErr, handelSucess}=require("../utils/errHandler")
const User = require("../models/User")
const {createToken, getTokenData}=require("../utils/createToken")
const CodeTestResult = require("../models/CodeTestResult")
const Students = require("../models/Students")
const mongoose = require("mongoose")
const MCQTestResult = require("../models/MCQTestResult")


const StudentRegister = async(req,res,next)=>{
    try{
        // now get the data from the cookie 
        const {CreateStudent} = req.cookies
        const {Sname,Enroll,Year,Section,Branch,Gender,DOB} = req.body

        // now if we have the all the data 
        const TokenData = await getTokenData(CreateStudent)
        
        // check if the Student 
        const isStudent = await Student.findOne({userId:TokenData._id})
        if(isStudent){
            res.cookie("CreateStudent", "", { maxAge: 0, httpOnly: true });
            return next(handelErr(res,"Student is Already present",isStudent,401))
        }

        // now check if we get all the required data from the uer 
        if(Sname||Enroll||Year||Section||Branch||Gender||DOB){
            
           

            // now create the student 
            const isStudent = await Student.create({Sname,Enroll,Gender,Year,Section,Branch,DOB,UserId:TokenData._id})
            const isPresent = await User.findById(TokenData._id)
            // now craete the login token
            const data={email:isPresent.userEmail,
                name:isStudent.Sname,
                Enroll:isStudent.Enroll,
                section:isStudent.Section,
                branch:isStudent.Branch,
                DOB:isStudent.DOB
            }
           
            const payload={
                _id:isPresent._id,
                email:isPresent.email,
                role:isPresent.role,
                student_id:isStudent._id
            }
            const token = await createToken(payload,"2h")
            // now send the res
            res.cookie("Student",token,{expiresIn:"2h", httpOnly:true})
            // delete the prev cookie
            res.cookie("CreateStudent", "", { maxAge: 0, httpOnly: true });

            // now send the data to the user
            return next(handelSucess(res,"Student created sucessfully", data))

        } else{
            return next(handelErr(res,"please enter all the details","Fill all the filds",404))
        }
    }catch(err){
        return next(handelErr(res,err.message,err,404))
    }
}

const GetAllResults = async(req,res,next)=>{
    try{
        const {Student}=req.cookies
        if(Student){
            const Token = await getTokenData(Student)

            // now get all the test of the students 
            const results = await CodeTestResult.find({ StudentId: Token.student_id }).populate({
              path: "TestId",
              match: { HideResult: false },
              select: "TestStartTime TestName TestType",
            })
            .then(data => data.filter(result => result.TestId !== null)); 


            const MCQresults = await MCQTestResult.find({StudentId:Token.student_id}).populate({
              path: "TestId",
              match: { HideResult: false },
              select: "TestStartTime TestName TestType",
            })
            .then(data => data.filter(result => result.TestId !== null)); 

            return next(handelSucess(res,"Sucessful",{code:results,mcq:MCQresults}))
        }else{
            return next(handelErr(res,"Student Not found","",401))
        }
    }catch(err){
        return next(handelErr(res,err.message,err,404))
    }

}

const GetDashboardData=async(req,res,next)=>{
    try{
        const {Student} = req.cookies

        if(Student){
            const token = await getTokenData(Student)
           
            

            const data = await CodeTestResult.aggregate([
                {
                  $match: {
                    StudentId: new mongoose.Types.ObjectId(token.student_id) 
                  }
                },
                {
                  $group: {
                    _id: "$StudentId",
                    AverageTotalMarks: { $avg: "$TotalMarks" },
                    AverageObtainedMarks: {
                      $avg: "$TotalMarksObtained"
                    },
                    MaxMarks: { $max: "$TotalMarksObtained" },
                    TotalTest: { $sum: 1 }
                  }
                }
              ])
            const MCQdata = await MCQTestResult.aggregate([
                {
                  $match: {
                    StudentId: new mongoose.Types.ObjectId(token.student_id) 
                  }
                },
                {
                  $group: {
                    _id: "$StudentId",
                    AverageTotalMarks: { $avg: "$TotalMarks" },
                    AverageObtainedMarks: {
                      $avg: "$TotalMarksObtained"
                    },
                    MaxMarks: { $max: "$TotalMarksObtained" },
                    TotalTest: { $sum: 1 }
                  }
                }
              ])

               const results = await CodeTestResult.aggregate([
                {
                  $match: {
                    StudentId:new mongoose.Types.ObjectId(token.student_id)
                  }
                },
                {
                  $lookup:{
                    from: "tests",
                    localField: "TestId",
                    foreignField: "_id",
                    as: "Test"
                  }
                },
                {
                  $unwind: "$Test"
                },
                {
                  $match: {
                    "Test.HideResult": false
                  }
                },
                {
                  $project: {
                    date: "$Test.TestStartTime",
                    score: "$TotalMarksObtained",
                    total: "$TotalMarks"
                  }
                }
                
              ])
            const MCQresults = await MCQTestResult.aggregate([
                {
                  $match: {
                    StudentId:new mongoose.Types.ObjectId(token.student_id)
                  }
                },
                {
                  $lookup:{
                    from: "mcqtests",
                    localField: "TestId",
                    foreignField: "_id",
                    as: "Test"
                  }
                },
                {
                  $unwind: "$Test"
                },
                {
                  $project: {
                    date: "$Test.TestStartTime",
                    score: "$TotalMarksObtained",
                    total: "$TotalMarks"
                  }
                }
                
              ])
              

              if(data){
                return next(handelSucess(res,"sucessful",{code:data,mcq:MCQdata,codeResult:results,mcqresults:MCQresults}))
              }else{
                return next(handelErr(res,"Err data not found","error",402))
              }

        }else{
            handelErr(res,"Student not found","Credentials Not found",401)
        }
    }catch(err){
        return  handelErr(res,err.message,err,404)
    }
}

module.exports={StudentRegister,GetAllResults,GetDashboardData}
