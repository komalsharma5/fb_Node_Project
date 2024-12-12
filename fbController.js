const { FriendRequest, User } = require("../Model/fb_model")


//fb user create first
const create_fbUser_C = async(req,res)=>{
    try {
        const {username,email} = req.body
        const fbUser = await User.create({username,email})
        if(!fbUser){
            return res.status(400).json({message:"User not created"})
        }
        return res.status(201).json({
            message:"User created successfully",
            data:fbUser
        })
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


//send friend request
const send_friend_request = async(req,res) =>{
        const { senderId, receiverId } = req.body;
        try {
            // Check if the request already exists
            const existingRequest = await FriendRequest.findOne({
                sender: senderId,
                receiver: receiverId
            });
    
            if (existingRequest) {
                return res.status(400).json({ message: 'Friend request already sent.' });
            }
    
            const friendRequest = new FriendRequest({
                sender: senderId,
                receiver: receiverId
            });
    
            await friendRequest.save();
            res.status(201).json({ message: 'Friend request sent!', friendRequest });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }

}

//Accept friend request
// const aceept_request_c = async(req,res)=>{
//     const { requestId } = req.body
//     try {
//         const request = await FriendRequest.findByIdAndUpdate(requestId,{status: 'accepted'},{new : true})

//         if(!request){
//             throw new Error('Friend request not found.')
//         }

//         return res.status(200).json({
//             message: 'Friend request accepted.',
//             data:request
//         })
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// }


//Reject friend request
// const reject_request_c = async(req,res)=>{
//     const { requestId } = req.body
//     try {
//         const request = await FriendRequest.findByIdAndUpdate(requestId,{status : 'rejected'},{new : 'true'})
//         if(!request){
//             throw new Error('Friend request not found.')
//         }
//         return res.status(200).json({
//             message: 'Friend request rejected.',
//             data:request
//         })
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// }

//update_friend_request_status
const update_friend_request_status = async (req, res) => {
 
    //     const { id } = req.params
    //     const { status } = req.body;
    //     // console.log(id);
        
    //     if (!['accepted', 'rejected'].includes(status)) {
    //         return res.status(400).json({ message: "Invalid status. Must be 'accepted' or 'rejected'." });
    //     }

    //     const updatedRequest = await FriendRequest.findByIdAndUpdate(
    //         id,
    //         { status },
    //         { new: true }
    //     );

    //     if (!updatedRequest) {
    //         return res.status(404).json({ message: "Friend request not found." });
    //     }

    //   return res.status(200).json({ message: "Friend request status updated", data: updatedRequest });
    // } catch (error) {
    //     res.status(400).json({ error: error.message });
    // }
    try {
        const userId = req.params.userId; // User accepting the friend request
        const friendId = req.body.friendId; // User who sent the friend request

        // Find both users
        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (!user || !friend) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if a friend request exists
        if (!user.friendRequests.includes(friendId)) {
            return res.status(400).json({ message: 'No friend request from this user' });
        }

        // Add each other to friends list
        user.friends.push(friendId);
        friend.friends.push(userId);

        // Remove friend request
        user.friendRequests = user.friendRequests.filter(id => id.toString() !== friendId);

        // Save both users
        await user.save();
        await friend.save();

        res.status(200).json({ message: 'Friend request accepted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}  
//get all friend request by users ids
const get_all_friend_request_c = async(req,res)=>{
    try {
        // Fetch all friend requests from the database
        const friendRequests = await FriendRequest.find()
            .populate('sender', 'username email')   // Populate sender details
            .populate('receiver', 'username email'); // Populate receiver details

        // If no friend requests found, return a message
        if (friendRequests.length === 0) {
            return res.status(404).json({ message: "No friend requests found." });
        }

        // Return the friend requests
        return res.status(200).json({
            message: "Friend requests retrieved successfully.",
            data: friendRequests
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

//delete friend request
const delete_friendRequest_c = async(req,res)=>{
    try {
        const {id} = req.params
        const friendRequest = await FriendRequest.findByIdAndDelete(id);
        if (!friendRequest) {
            return res.status(404).json({ message: "Friend request not found." });
            }
            return res.status(200).json({ 
                message: "Friend request deleted successfully.",
                data: friendRequest
            
            });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Get friend list of a specific user
const getFriendList = async (req, res) => {
    try {
        const userId = req.params.userId; // Get user ID from request params

        // Find the user and populate the friends field to get friends' names
        const user = await User.findById(userId).populate('friends', 'name email');  // Populate friends' name and email
        console.log(friends);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return the populated friends list
        res.status(200).json({
            message: 'Friend list retrieved successfully',
            friends: user.friends // This will include the names and emails of the friends
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    send_friend_request,
    create_fbUser_C,
    get_all_friend_request_c,
    update_friend_request_status,
    delete_friendRequest_c,
    getFriendList  
}