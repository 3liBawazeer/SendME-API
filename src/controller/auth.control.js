const {User} = require('../models/user.model');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const resulteValidationExpress = require('express-validator').validationResult


exports.signupController = async (req,res,next) => {

    const err = resulteValidationExpress(req)

   try {
    
        if(err.isEmpty()){
        const searchIsUserFound = await User.findOne({phoneNumber: req.body.phoneNumber});
        if (searchIsUserFound) {
            const user = await User.findOneAndUpdate({phoneNumber: req.body.phoneNumber},{
                $set :{
                    FCMtoken:req.body.FCMtoken
                }
            },{new:true})
             const token = jwt.sign({userId:searchIsUserFound._id},process.env.SECRET_KEY_JWT );
             res.json({res:{token,user:user,new:"false"},mesg:'signIn Successfuly ... ! ',});
            // return  next({errorCode:"PhoneNumberUsed",mesg:' This number is used use anouther number ... ! '})
        }else{
            const user = User({
                FCMtoken:req.body.FCMtoken,
                phoneNumber: req.body.phoneNumber,
                countryKey: req.body.countryKey,
            });
            await user.save();
            const token = jwt.sign({userId:user._id},process.env.SECRET_KEY_JWT );
            res.json({res:{token,user:user,new:"true"},mesg:'signUp Successfuly ... ! ',});
        }
    }else{
        next({errorCode:"validationError",mesg:err.array()[0]})
    }

   } catch (error) {
        next({errorCode:"SignUpError",mesg:error.message})
   }

}

exports.loginController = async (req,res,next) => {

    const err = resulteValidationExpress(req)

    try {

            if (err.isEmpty()) {

                const checkuser = await User.findOne({phoneNumber:req.body.phoneNumber});
                if (checkuser) {
                         const pass = await bcrypt.compare(req.body.password,checkuser.password);
                        if (!pass) { 
                            next({errorCode:"InvalidLogin",mesg:"invalid PhoneNumber or Password ! "})
                        }else{

                            const token = jwt.sign({userId:checkuser._id},process.env.SECRET_KEY_JWT)

                            res.json({res:{user:checkuser,token},mesg:" login is successfuly :)"})
                        }
                    }else{
                        next({errorCode:"NotRegistered",mesg:"This Phone Number is not register try to use anouther number ... !   "})
                        }

            }else{
                next({errorCode:"validationError",mesg:err.array()[0]})
            }

    } catch (error) {
        res.status(500).send(error.message)
    }
    
}