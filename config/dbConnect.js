const mongoose= require("mongoose")
require("dotenv").config()

const connectDB=async()=>{
    //  handle the data base connctions
    const connect=await mongoose.connect(process.env.URI||"mongodb+srv://vasusingh9691:SIayWuVMMDjdKd7w@cluster0.ndhrs0h.mongodb.net/TestHub",{family:4}).then(()=>{
        console.log("connected to the database ")
    }).catch((err)=>{
        console.log("err in the connections ",err)
    })
}

module.exports={connectDB}
