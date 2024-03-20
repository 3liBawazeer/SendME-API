const {User} = require('../models/user.model');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const resulteValidationExpress = require('express-validator').validationResult


const generatedNumbers = new Set();

function generateNumber() {
  const prefix = '53';
  let randomNumber = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
  
  while (generatedNumbers.has(randomNumber)) {
    randomNumber = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
  }
  
  const generatedNumber = prefix + randomNumber;
  generatedNumbers.add(randomNumber);
  
  return generatedNumber;
}

exports.signupController = async (req,res,next) => {

    const err = resulteValidationExpress(req)

   try {
    
        if(err.isEmpty()){
        const searchIsUserFound = await User.findOne({email: req.body.email});
        if (searchIsUserFound) {
            const pass = await bcrypt.compare(req.body.password,searchIsUserFound.password);
            if (!pass) { 
                next({errorCode:"InvalidLogin",mesg:"invalid PhoneNumber or Password ! "})
            }else{
                const user = await User.findOneAndUpdate({email: req.body.email},{
                    $set :{
                        FCMtoken:req.body.FCMtoken
                    }
                },{new:true})
                 const token = jwt.sign({userId:searchIsUserFound._id},process.env.SECRET_KEY_JWT );
                 res.json({res:{token,user:user,new:"false"},mesg:'signIn Successfuly ... ! ',});
            }
        }else{
            const salt = await bcrypt.genSalt();
            const hashPass = await bcrypt.hash(req.body.password,salt)
            
            const user = new User({
                FCMtoken:req.body.FCMtoken,
                email: req.body.email,
                password:hashPass,
                username:req.body.username,
                SMID:generateNumber(),
                image:req.body.image,
            });
            await user.save();
            const token = jwt.sign({userId:user},process.env.SECRET_KEY_JWT );
            res.json({res:{token,user:user,new:"true"},mesg:'signUp Successfuly ... ! ',});
        }
    }else{
        console.log(err.array()[0]);
        next({errorCode:"validationError",mesg:err.array()[0]})
    }

   } catch (error) {
    console.log(error);
        next({errorCode:"SignUpError",mesg:error.message})
   }

}

exports.loginController = async (req,res,next) => {

    const err = resulteValidationExpress(req)

    try {

            if (err.isEmpty()) {

                const checkuser = await User.findOne({email:req.body.email});
                if (checkuser) {
                         const pass = await bcrypt.compare(req.body.password,checkuser.password);
                        if (!pass) { 
                            next({errorCode:"InvalidLogin",mesg:"invalid PhoneNumber or Password ! "})
                        }else{
                            const user = await User.findOneAndUpdate({email: req.body.email},{
                                $set :{
                                    FCMtoken:req.body.FCMtoken
                                }
                            },{new:true})
                             const token = jwt.sign({userId:checkuser._id},process.env.SECRET_KEY_JWT );
                             res.json({res:{token,user:user,new:"false"},mesg:'signIn Successfuly ... ! ',});
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