const admin = require("firebase-admin");
const { User } = require("../models/user.model");
module.exports.sendAndReciveMessagesandNotification = (socket,onlineUsres) => {

    // notification socket :)* //
    socket.on("sendNotifyNewMessage",async (data)=>{


        // shape of data [
        //     friendId,
        //     {
        //       id: messageId,
        //       content: mesgContent,
        //       sender: JSON.stringify(SENDER),
        //       chat: chatId,
        //       timestamp: Date.now(),
        //       isRead: '0',
        //     },
        //   ]

        // for send notification
        
        
        
        const userToken = await User.findById(data[0])
        if (userToken) {
          const isOnline = onlineUsres?.includes(userToken._id)
          console.log("1".repeat(30),isOnline,"| token : " , userToken?.FCMtoken );
            if (!isOnline && userToken?.FCMtoken != "") {
                console.log("2".repeat(30));
                console.log("|".repeat(50),!isOnline && userToken?.FCMtoken != "","|".repeat(50));
                await User.findByIdAndUpdate(data[0],{
                  $push:{
                    unReadMessages:{
                      id: data[1]?.id,
                      chat : data[1]?.chat,
                      content : data[1]?.content ,
                      sender : data[1]?.sender ,
                      timestamp: data[1]?.timestamp ,
                      isRead: '0',
                   }
                  }
                })
                const sender = JSON.parse(data[1]?.sender)
                await admin.messaging().send({
                    token: userToken?.FCMtoken ,
                    android:{
                      priority:"high",
                      notification:{
                        channelId:data[1]?.chat,
                        priority:"high"
                      },
                    },
                    notification: {
                    title: `${sender.username}`,
                    body: `${data[1]?.content}`,
                    },
                    data: {
                        notifee: JSON.stringify({
                            body: data[1]?.content,
                            android: {
                              channelId: data[1]?.chat,
                              actions: [
                                {
                                  title: 'Mark as Read',
                                  pressAction: {
                                    id: 'read',
                                  },
                                },
                              ],
                            },
                          }),
                        },
                    
                }).then(()=>{
                    console.log("send message succesfuly");
                })
                
            }
        }
        console.log("3".repeat(30));
        socket.to(data[0]).emit("reciveNotifyNewMessage",data[1])


    })

    socket.on("getUnReadMessages_Requist", async (data) => {
      const user = await User.findById(data?.userId);
      if (user) {
        let unReadMessages
        if(user.unReadMessages.length != 0){
          unReadMessages = user?.unReadMessages;
          user.unReadMessages = []
          await user.save()
          // await User.findByIdAndUpdate(data[0],{
          //   $unset:{
          //     unReadMessages:{}
          //   }
          // })
          socket.emit("getUnReadMessages_Responsive",unReadMessages)
        } else {
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