const { sendRequestFrien, CheckisChatOrCreate } = require("../controller/chat.controller");
const { isAuth } = require("../middleware/auth.middleware");

const router = require("express").Router();



router.post('/getandCreateChat',isAuth,CheckisChatOrCreate);


module.exports = router;