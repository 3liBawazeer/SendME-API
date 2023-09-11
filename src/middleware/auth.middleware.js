const jwt = require("jsonwebtoken");
const { User } = require("../models/user.model");

exports.isAuth = async (req,res,next) => {
    console.log(req.headers);
    if (req.headers && req.headers.auth_token_jwt) {

        try {
            const token =  req.headers.auth_token_jwt;

            const user = jwt.verify(token,process.env.SECRET_KEY_JWT);

             if (user) {
                 const findUser = await User.findById(user.userId) 
                 if (findUser) {
                     res.user = findUser;
                     next()
                 }else{
                     next({errorCode:"AuthraizationError", mesg:' you can not acces this try sign in agian 5050  !'})
                 }
             }else{
                next({errorCode:"AuthraizationError", mesg:' you can not acces this try sign in agian 5051 !'})
             }
             
             
        } catch (error) {
            next({errorCode:"AuthraizationError", mesg:error})
        }
      
    }else {
      res.json({res:"error authraization ", mesg:' try sign in agian ); heaaaaaaaa'})
    }

}