const admin = require("firebase-admin");
const { User } = require("../models/user.model");
module.exports.sendAndReciveMessagesandNotification = (socket,onlineUsres) => {

    // notification socket :)* //
   

    socket.on("getUnReadMessages_Requist", async (data) => {
      
      const user = await User.findById(data?.userId);
      if (user) {
        console.log("UNREADE MESSAGES _) is full");
        let unReadMessages
        if(user.unReadMessages.length != 0){
          unReadMessages = user?.unReadMessages;
          user.unReadMessages = []
          await user.save()
          socket.emit("getUnReadMessages_Responsive",unReadMessages)
        } else {
          console.log("UNREADE MESSAGES _)  is empty"); 
          socket.emit("getUnReadMessages_Responsive",[])
        }
      }

    })

    socket.on("leaveApp",(id)=>{
      const check = onlineUsres?.includes(id);
      if (check) {
        onlineUsres = onlineUsres.filter(ele=>ele != id)
      }
    })

    socket.on("sendNewMessage",(data)=>{
        // console.log(data,"sendNewMessage <== 0 ==> sendNewMessage");
        socket.to(data[1].chat).emit("reciveNewMessage",data[1])
    })
    
    socket.on("reqPeerId",(data)=>{
        // console.log(data);
        socket.to(data.friendId).emit("recieveReqPeerId",data.SENDER)
    })

    socket.on("acceptRequistPeerId",(data)=>{
        console.log(data,"fuck you tramb ...::::::>>>>>><><><><>>>><<<<<<><>");
        socket.to(data.userId).emit("sendPeerId",{peerId:data.peerId,})
    })

    socket.on("sendClosecallVideo",(data)=>{
    //  console.log("close call video ",data);
     socket.to(data.userId).emit("recieveClosecallVideo",{userId:data.myId})
    })

}