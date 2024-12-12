const express = require('express')
const { fbContoller_C } = require('../../Controller')


const fb_router = express.Router()
//First, create two users to test the friend request functionality.
fb_router.post('/create-fbuser',
    fbContoller_C.create_fbUser_C
)

//send friend request route
fb_router.post('/friendRequest-send',
    fbContoller_C.send_friend_request
)

//update friend request status accepted/rejected
fb_router.put('/friendRequest-status/:id',
    fbContoller_C.update_friend_request_status
)
//Accept friend request
// fb_router.post('/friendRequest-accept',
//    fbContoller_C.aceept_request_c
// )

// //Reject friend request
// fb_router.post('/friendRequest-reject',
//     fbContoller_C.reject_request_c
// )

//get all frien request foe user IDs
fb_router.get('/friend-requests',
    fbContoller_C.get_all_friend_request_c
)

//delete friend request
fb_router.delete('/friendRequest-delete/:id',
    fbContoller_C.delete_friendRequest_c
)


// Route to get the friend list of a specific user
fb_router.get('/friends/:userId/list', 
    fbContoller_C.getFriendList

);
module.exports = fb_router