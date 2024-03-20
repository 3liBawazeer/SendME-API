const router = require('express').Router();
const { isAuth } = require('../middleware/auth.middleware');
const { check } = require('express-validator');
const { User } = require('../models/user.model');
const { Chat } = require('../models/chat.model');


router.route('/all-users')
.post(isAuth , async(req,res,next)=>{
    try {
        const myContacts = req.body.contact;
        const allUsres = await User.find({});
        const contactHasAcount = allUsres.filter((ele,iex)=>{
            const founded = myContacts.find((el)=> (ele.phoneNumber != "0" && el.phoneNumber.includes(ele.phoneNumber)) || el.phoneNumber == ele.SMID )
            if (founded) {
                ele.username = founded.displayName
                return {...ele}
            }
        })
        console.log(contactHasAcount);
        res.json({res:{users:contactHasAcount},mesg:"get all users succefily . "})
    } catch (error) {
        next({errorCode:"AllUsres",mesg:error})
    }
})

router.route('/deleteAccount').post(isAuth, async (req,res,next)=>{
    const id = req.body.id
    try {
        await User.findByIdAndDelete(id)
        res.json({res:"Delete Acount succefily ",mesg:"Delete Acount succefily"})
    } catch (error) {
        next({errorCode:"DelAccount",mesg:error})
    }
})

// router.post('/login',
// check('password').not().isEmpty().withMessage("يجب إدخال كلمة مرور"),
// check('phoneNumber').not().isEmpty().withMessage("رقم الجوال مطلوب "),
// loginController,)

// router.all("/logout",isAuth,(req,res,next)=>{
//     req.session.destroy()
//     res.redirect("/")
// })

// router.post("/create-post",isAuth,(req,res)=>{
//  res.send("create post succse")
// })
module.exports = router;