const router = require("express").Router();
const admin = require("firebase-admin");

var serviceAccount = require("../../adminFirebaseSDK.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

router.post("/send", (req, res, next) => {

  try {
    const message = {
        notification: {
          title: "New Notification",
          body: "This is a new notification",
          
        },
        token:"drRzklaQRPeoLSaWCbPnRa:APA91bEh7n67eX7y47pEWanObMjURIlKjPXelOMklKcJUnSSihhQKLhWPkCCn-pOkst_46QurW2oIXFlukZUbCf5KdlnkRsWwLA9qx0pB9DsEaWreuYTxr-Kh8l1Tm48RlwQjFMCGQ_F"};


    
      admin
        .messaging()
        .send(message)
        .then((response) => {
          res.json({res:"Successfully sent message: "});
        })
        .catch((error) => {
          next("Error sending message: " + error);
        });
        
  } catch (error) {
    next("Error sending message: " + error);
  }

});



module.exports = router;
