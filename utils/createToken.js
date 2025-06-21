const token = require("jsonwebtoken")
require("dotenv").config()

const createToken=async(payload,Expiretime)=>{
        const newToken=token.sign(payload,"vasu",{expiresIn:Expiretime})
    return newToken 
   
}

const getTokenData=async(newToken)=>{
    const tokenData=token.decode(newToken)
    return tokenData
}

module.exports={createToken,getTokenData}
