const admin = require("firebase-admin");
const { User } = require("../models/user.model");
module.exports.sendAndReciveMessagesandNotification = (socket,onlineUsres) => {

    // notification socket :)* //
   

    socket.on("getMessagesStatus_Requist", async (data) => {
      
      const user = await User.findById(data?.userId);
      if (user) {
        let messagesStatus
        if(user.messagesStatus.length != 0){
          messagesStatus = user?.messagesStatus;
          user.messagesStatus = []
          await user.save()
          socket.emit("getMessagesStatus_Responsive",messagesStatus)
        } else {
          console.log("UNREADE MESSAGES _)  is empty"); 
          socket.emit("getMessagesStatus_Responsive",[])
        }
      }

    });


    socket.on("getMessagesRemoved_Requist", async (data) => {
      
      const user = await User.findById(data?.userId);
      if (user) {
        let messagesDeleted
        if(user.messagesDeleted.length != 0){
          messagesDeleted = user?.messagesDeleted;
          user.messagesDeleted = []
          await user.save()
          socket.emit("getMessagesRemoved_Responsive",messagesDeleted)
        } else {
          console.log("UNREADE MESSAGES _)  is empty"); 
          socket.emit("getMessagesRemoved_Responsive",[])
        }
      }

    });

    
    

    socket.on("leaveApp",(id)=>{
      const check = onlineUsres?.includes(id);
      if (check) {
        onlineUsres = onlineUsres.filter(ele=>ele != id)
      }
    });

    // socket.on("sendNewMessage",  (data,)=>{
    //     // console.log(data,"sendNewMessage <== 0 ==> sendNewMessage");
    //     socket.to(data[1].chat).emit("reciveNewMessage",data[1]) 
         
    // });
    
    socket.on("reqPeerId",(data)=>{
        // console.log(data);
        socket.to(data.friendId).emit("recieveReqPeerId",data.SENDER)
    });

    socket.on("acceptRequistPeerId",(data)=>{
        console.log(data,"fuck you tramb ...::::::>>>>>><><><><>>>><<<<<<><>");
        socket.to(data.userId).emit("sendPeerId",{peerId:data.peerId,})
    });

    socket.on("sendClosecallVideo",(data)=>{
    //  console.log("close call video ",data);
     socket.to(data.userId).emit("recieveClosecallVideo",{userId:data.myId})
    });

}