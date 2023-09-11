const { Chat } = require("../models/chat.model");


module.exports.joinTochatAndJoinToNotification = (socket) => {

    socket.on("joinNotificationRoom",(id)=>{
        socket.join(id.userId);
        console.log("join Notifcation succefuly ..");
    });
    socket.on("joinToChat",(id)=>{
        socket.join(id)
        console.log("join To chat succefuly ..");
    });

    socket.on("leaveFromChat",(id)=>{
        socket.join(id)
        socket.leave(id);
        console.log("leave from chat succefuly ..");
    });
  
    
    
    

}