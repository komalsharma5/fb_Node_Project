const express = require('express');
const postRouter = express.Router();
// const Post = require('../models/post');
const { Register_account_C } = require('../../Controller');

// Route to create a post
postRouter.post('/create-post',
   Register_account_C.create_post
);

//update post
postRouter.put('/update-post/:id',
    Register_account_C.update_post
)

//delete post
postRouter.delete('/delete-post/:id',
    Register_account_C.delete_post_C
)

//get all post
postRouter.get('/get-post',
    Register_account_C.get_all_post
)

 // Route to like a post
postRouter.post('/posts/:id/like', 
    Register_account_C.like_post_c
);

// Route to comment on a post
postRouter.post('/comment/:id', 
    Register_account_C.comment_post_c
);

//delete comment on post
postRouter.delete('/comment/:postId/:commentId',
     Register_account_C.delete_comment_c
    );

//update comment on post
postRouter.put('/comment/:postId/:commentId',
    Register_account_C.update_comment_c
)


//update like with user name
postRouter.get('/like/:postId/list-like', 
    Register_account_C.get_post_likes_c
);



module.exports = postRouter;
