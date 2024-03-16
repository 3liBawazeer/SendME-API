const router = require('express').Router();
const {signupController,loginController} = require('../controller/auth.control');
const { isAuth } = require('../middleware/auth.middleware');
const { check } = require('express-validator');
const { User } = require('../models/user.model');


// with email
router.post('/signup', 
        check('email').isEmail().not().isEmpty().withMessage("يجب عليك إدخال اسم مستخدم"),
        check('password').not().isEmpty().withMessage("يجب إدخال كلمة مرور"),
        signupController);

router.post("/editProfile",isAuth, async (req,res,next)=>{
   try {

            const newUser = await User.findOneAndUpdate(
                {mySMId: req.body.SMID},
                {$set:{
                 username:req.body.username,
                 image:req.body.image,
                 countryKey:req.body.countryKey,
                 phoneNumber:req.body.phoneNumber
                },},
                {new: true}
                )
                res.json({res:{user:newUser},mesg:'edit User Name Succefuly ... ! '});
        
   } catch (error) {
        next({errorCode:"EditProfileError",mesg:error.message})
   }

})

router.post("/logout",isAuth, async (req,res,next)=>{
        try {
                 const newUser = await User.findOneAndUpdate(
                     {phoneNumber: req.body.phoneNumber},
                     {$set:{
                      FCMtoken:""
                     },},
                     {new: true}
                     )
                     res.json({res:{user:newUser},mesg:'edit User Name Succefuly ... ! '});
             
        } catch (error) {
             next({errorCode:"EditProfileError",mesg:error.message})
        }
     
     })

router.post('/login',
check('password').not().isEmpty().withMessage("يجب إدخال كلمة مرور"),
check('email').not().isEmpty().isEmail().withMessage("أدخل إيميل صحيح"),
loginController,)

router.all("/logout",isAuth,(req,res,next)=>{
    req.session.destroy()
    res.redirect("/")
})

router.post("/create-post",isAuth,(req,res)=>{
 res.send("create post succse")
})
module.exports = router;