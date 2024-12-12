const express = require('express')
const { Register_account_C } = require('../../Controller')
const { decodeToken } = require('../../Controller/controller')
const user_router = express.Router()
//use multer
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({ storage: storage });




//regiser router
user_router.post('/register_account',
    Register_account_C.create_register_controller
)
//get all lisr of register account
user_router.get('/get_register_list',
    Register_account_C.get_register_controller
)

//update register account
user_router.put('/update_account/:id',
    Register_account_C.update_register_C
)

//delete register account
user_router.delete('/delete_account/:id',
    Register_account_C.delete_register_c
)

//block user
user_router.post('/block-user',
    Register_account_C.block_user_c
)
//get All Block User List
user_router.get("/block-userList",
    Register_account_C.get_blocked_user_list
)

//unblock user route
user_router.post('/unblock-user',
    Register_account_C.unblock_user_c
)

//get all unblock user list
user_router.get('/get-unblock-List',
    Register_account_C.unblock_user_list_c
)

//login router
user_router.post('/login-account',
    Register_account_C.create_login_C
)
// //get decode jwt token 
// user_router.post('/decode-jwt',
//     Register_account_C.decodeToken
// )
user_router.get('/decode', decodeToken, (req, res) => {
    return res.status(200).json({
        message: "Access granted to protected route",
        user: req.user
    });
});

//get all login users
user_router.get('/get-login',
    Register_account_C.get_login_controller
)

//single user login details
user_router.post('/single-user/:Email',
    Register_account_C.single_login_user
)


//img upload with multer
user_router.post('/upload',upload.single('profile'),
    Register_account_C.upload_file
)

//multiple img upload
// user_router.post('/upload',upload.array('profile',4),
//     Register_account_C.upload_file
// )




module.exports = user_router