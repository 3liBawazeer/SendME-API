const { Chat } = require("../models/chat.model");
const { User } = require("../models/user.model");



/////////////////////////////////////////////////  Check is Chat Or Create  ///////////////////////////////////////////////////

exports.CheckisChatOrCreate =  async (req,res,nex) => {
        try {
 
            const chats = await Chat.find({});
            if(chats.length > 0){
         
                const checkourChat = chats.find((item)=> item.users.includes(req.body.myId) && item.users.includes(req.body.friendId) );
                if(checkourChat){
                    res.json({res:JSON.stringify(checkourChat),mesg:"you have a chat with this friend :) successfuly ;)..."})
                }else{

                    const newChat = await Chat({
                        users : [req.body.myId ,req.body.friendId ]
                    });
                    const chat = await newChat.save();
                    console.log(chat);
                    res.json({res:JSON.stringify(chat),mesg:"new chat created :) 11111 successfuly ;)..."})

                }

             }else{
                const newChat = await Chat({
                    users : [req.body.myId ,req.body.friendId ]
                });
                const chat = await newChat.save();
                console.log(chat);
                res.json({res:JSON.stringify(chat),mesg:"new chat created :) 22222 successfuly ;)..."})
             }
       
        } catch (error) {
            throw new Error(error)
        }
}


/////////////////////////////////////////////\\//]/]/]/]/]////ADD///////////////////////////////////////////////////

exports.sendRequestFrien = async (req) => {


    try {
        
        await User.updateOne(
            {_id:req.body.myId},
            {
                $push:
                
                {sentRequests : { 
                    name:req.body.friendName, 
                    id:req.body.friendId ,
                }
            }
        }
        );
        
        await User.updateOne(
            {_id:req.body.friendId},
            {
                $push:{friendsRequests : { 
                    name:req.body.myName, id:req.body.myId 
                }
            }
        }
        );

    } catch (error) {
        next({errorCode:"ErrorsendRequestFriend",mesg:error})
    }


};

//////////////////////////////////////////////////CANCEL//////////////////////////////////////////////////

exports.cancelFriend = async (req,res) => {

    await User.updateOne(
        {_id:req.body.myId},
        {
            $pull:{sentRequests : { id:req.body.friendId }}
        }
        );
    
    await User.updateOne(
        {_id:req.body.friendId},
        {
            $pull:{friendsRequests : { id:req.body.myId }}
        }
        );

    res.redirect("/profile/" + req.body.friendId);

};

//////////////////////////////////////////////////ACCEPT//////////////////////////////////////////////////

exports.acceptFriend = async (req,res) => {

    const newChat = await Chat({
        users : [req.body.myId ,req.body.friendId ]
    });
    await newChat.save();
    


    await User.updateOne(
        {_id:req.body.myId},
        {
            $push:{friends : { name : req.body.friendName , image : req.body.friendImg , id: req.body.friendId, chatId : newChat._id }}
        }
        );
    
    await User.updateOne(
        {_id:req.body.friendId},
        {
            $push:{friends : { name : req.body.myName , image : req.body.myImg , id: req.body.myId, chatId : newChat._id }}
        }
        );


        await User.updateOne(
            {_id:req.body.myId},
            {
                $pull:{friendsRequests : { id:req.body.friendId }}
            }
            );
        
        await User.updateOne(
            {_id:req.body.friendId},
            {
                $pull:{ sentRequests : { id:req.body.myId }}
            }
            );

    res.redirect("/profile/" + req.body.friendId);

};

//////////////////////////////////////////////////DELETE//////////////////////////////////////////////////

exports.deleteFriend = async (req,res) => {

    await User.updateOne(
        {_id:req.body.myId},
        {
            $pull:{friends : { id:req.body.friendId }}
        }
        );
    
    await User.updateOne(
        {_id:req.body.friendId},
        {
            $pull:{friends : { id:req.body.myId }}
        }
        );

    res.redirect("/profile/" + req.body.friendId);

};

//////////////////////////////////////////////////REJECT//////////////////////////////////////////////////

exports.rejectFriend = async (req,res) => {

      await User.updateOne(
        {_id:req.body.myId},
        {
            $pull:{friendsRequests : { 
                id:req.body.friendId 
            }
        }
    }
    );
    
    await User.updateOne(
        {_id:req.body.friendId},
        {
            $pull:{sentRequests : { 
                id:req.body.myId 
            }
        }
    }
    );

    res.redirect("/profile/" + req.body.friendId);

};