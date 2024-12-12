const { postModel } = require("../Model")
const { User } = require("../Model/fb_model")
const userModel = require("../Model/model")
const { User_service } = require("../Service")
const bcrypt = require("bcrypt")
const saltRounds = 10
const salt = "$2b$10$t7oxiwchWGHa/B9w0AzrYO"
const jwt = require('jsonwebtoken')


const create_register_controller = async(req,res) =>{
    try {
        const Password = await bcrypt.hash(req.body.Password, salt)
        
        const data = {...req.body,Password}
     
        const new_password = await bcrypt.hash(Password,10)
        if(!new_password){
            throw new Error("password not match")
        }
        const searched_result = await User_service.findByEmail(data.Email,Password)
        // console.log("======>>>>" , searched_result)

        if(searched_result){
            throw new Error(`Email by this name ${data.Email} already exist`)
        }
       
          // service
        const new_series = await User_service.create_register_S(data)
           // success response
        res.status(200).json({
            success: true,
            message: "Email created successfully",
            data: new_series
        })
    } catch (error) {
       
        res.status(400).json({
            success:"false",
            message:error.message
        })
    }
}
//get all register account list
const get_register_controller = async(req,res) =>{
  
    try {
        const get_register = await User_service.get_all_register_S()

        if(!get_register){
            throw new Error("register account data not found");  
        }
        res.status(200).json({
            success:true,
            message:"Register_Account retrieved successfully",
            data:get_register
        })
    } catch (error) {
        res.status(400).json({
            success:"false",
            message:"Error retrieving Register_Account"
        })
    }
}

//update register account
const update_register_C = async(req,res) =>{
    try {
          
        const id = req.params.id
        const data = req.body

        const updateData = await User_service.update_register_S(id,data)
        // console.log(updateData);
        
        if(!updateData){
            throw new Error("update register account data not found");
            }
            
        res.status(200).json({
            message:"update account successfully",
            success:true,
            data:updateData
        })
    } catch (error) {
        res.status(400).json({
            message:message.error,
            success:false
        })
    }
}

//delete register account
const delete_register_c = async(req,res) =>{
    try {
        const id = req.params.id
        const data_delete = await User_service.delete_register_S(id)
        if(!data_delete){
            throw new Error("delete register account data not found");
        }
        res.status(200).json({
            message:"delete account successfully",
            success:true,
            data:data_delete
        })
    } catch (error) {
        res.status(400).json({
            message:message.error,
            success:false
        })
    }
}


const create_login_C = async (req, res) => {
    try {
        const { Email, Password } = req.body;

        // Step 1: Check if the email exists
        const login_user = await userModel.findOne({ Email });

        if (!login_user) {
            return res.status(422).json({
                message: "User not found",
                success: false
            });
        }

        // Step 2: Check if the account is blocked
        if (login_user.isBlocked) {
            return res.status(403).json({
                message: "Your account is blocked",
                success: false
            });
        }

        // Step 3: Validate the password
        const isPasswordValid = await bcrypt.compare(Password, login_user.Password);
        if (!isPasswordValid) {
            return res.status(422).json({
                message: "Incorrect password",
                success: false
            });
        }
       
        const jwtToken = jwt.sign(
            { Email: login_user.Email },
            "secreat123",
            { expiresIn : '24h'}

        )
        // Step 4: Successful login
        return res.status(200).json({
            message: "Login successful",
            success: true,
            jwtToken,Email,
            data: login_user
        });

    } catch (error) {
        return res.status(500).json({
            message: "An error occurred",
            error: error.message
        });
    }
};
//decode token
const decodeToken = (req, res, next) => {
    try {
        const jwtToken = req.header('Authorization');

        if (!jwtToken) {
            return res.status(401).json({
                success: false,
                message: "No token provided"
            });
        }

        // Extract Bearer token
        const token = jwtToken.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Malformed token"
            });
        }

        // Verify the token
        const decode = jwt.verify(token, 'secreat123');

        // Attach decoded user information to request object
        req.user = decode;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token: " + error.message
        });
    }
};


//block user
const block_user_c = async (req, res) => {
    try {
        const { Email} = req.body;
       
        // Find the user by email and update the isBlocked field to true
        const blockedUser = await userModel.findOneAndUpdate(
            { Email: Email },
            {isBlocked: true } 
        );
        // console.log(blockedUser);
        
        if (!blockedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "User account has been blocked",
            data: blockedUser
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to block user",
            error: error.message
        });
    }
}

//get all block user list
const get_blocked_user_list = async (req, res) => {
    try {
        const get_blockUsers = await User_service.get_blocked_user_list_S()

     return res.status(200).json({
            message:"All Block user list retrived successfully",
            success:true,
            data: get_blockUsers
        })
    } catch (error) {
        res.status(400).json({
            message: "Failed to get blocked user list",
            success: false,
        })
    }
}

//unblock user 
const unblock_user_c = async (req, res) => {
    try {
        const { Email } = req.body;

        // Find the user by email and update the isBlocked field to false
        const unblockedUser = await userModel.findOneAndUpdate(
            { Email: Email },
            { $set: { isBlocked: false } },
            { new: true }
        );

        if (!unblockedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User account has been unblocked",
            data: unblockedUser
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to unblock user",
            error: error.message
        });
    }
}

//get All UnBlock Usser
const unblock_user_list_c = async(req,res)=>{
    try {
        const unblock_list = await User_service.get_unblock_user_list_S()

        if(!unblock_list){
            throw new Error("unblock list not found")
        }
          console.log(unblock_list);
           
      res.status(200).json({
         message: "All unblock user list get successfully",
            success: true,
            data:unblock_list
        })
    } catch (error) {
        res.status(400).json({
            message:error.message,
            success:false
        })
    }
}
//get login user list
const get_login_controller = async(req,res) =>{
  
    try {
        const get_login = await User_service.get_all_login_S()

        if(!get_login){
            throw new Error("register account data not found");  
        }
        res.status(200).json({
            success:"true",
            message:"LOgin data retrieved successfully",
            data:get_login
        })
    } catch (error) {
        res.status(400).json({
            success:"false",
            message:"Error retrieving Register_Account"
        })
    }
}

// get details of a single user by email
const single_login_user = async (req,res) => {
   try {
   
        const user = await userModel.findOne({Email:req.params.Email})
        
        if(!user){
            throw new Error ('user not found')
        }     
        return  res.status(200).json({
                    message: "User found",
                    success:true,
                    data:user
                })
   } catch (error) {
    res.status(400).json({
        success:"false",
        message:"Error retrieving login Account"
    })
   }
}

//file upload with multer
const upload_file = (req, res)=>{
    try {
       return res.status(200).json({
            success:"true",
            message:"File uploaded successfully",
        })
    } catch (error) {
        res.status(400).json({
            success:"false",
            message:error.message
        })
    }
}

//create post
const create_post = async (req, res) =>  {
  
        const { content, username } = req.body; // Extract content and username from request body

        const post = new postModel({
            content: content,
            username: username // Store the username in the post model
        });
      // const post = new postModel({
    //     content: req.body.content
    // });
try {
    const savedPost = await post.save();
    if(!savedPost){
        throw new Error('Error creating post')
    }
    res.status(201).json({
        message: `${username} created post successfully`,
        success:true,
        data:savedPost
    });
} catch (err) {
    res.status(400).json({ 
        message: err.message 
    });
}
}


//update post
const update_post = async (req, res) => {
   
    try {
        const id = req.params.id
        const data = req.body
        const postUpdate = await User_service.update_post_S(id,data)   
    if(!postUpdate){
        throw new Error('Post Not update')
    }
    res.status(200).json({
        message:'Post updated successfully',
        success:true,
        data:postUpdate
    })
    } catch (err) {
        res.status(400).json({ 
            message: err.message 
        });
}
}

//delete post
const delete_post_C = async(req,res)=>{
    try {
        const id = req.params.id
        const delete_post = await User_service.delete_post_S(id)
        if(!delete_post){
            throw new Error('Post Not delete')
        }
        res.status(200).json({
            message:'Post delete successfully',
            success:true
        })
    } catch (error) {
        res.status(400).json({ 
            message: error.message 
        });
    }
}

//get all post
const get_all_post = async (req, res) => {
    try {
        const get_post = await User_service.get_all_post_S()
        if(!get_post){
            throw new Error('Post Not found')
        }
        res.status(200).json({
            message:'Post found successfully',
            success:true,
            data:get_post
            })
    } catch (error) {
        res.status(400).json({ 
            message: error.message 
        });
    }
}

//like controller
// const like_post_c = async(req,res)=>{
//     try {
//         const post = await postModel.findById(req.params.id);
//         post.likes += 1;
//         const updatedPost = await post.save();
//         res.json({
//             message:"post like successfully",
//             success:true,
//             data:updatedPost
//         });
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// }



// Controller for liking a post
const like_post_c = async (req, res) => {
    const { username } = req.body;
    const postId = req.params.id;
  
    try {
      // Find the post by ID
      const post = await postModel.findById(postId);
      
      // If post is not found, send an error
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      // Check if the user already liked the post
      if (post.likedBy.includes(username)) {
        return res.status(400).json({ message: 'You have already liked this post' });
      }
  
      // Increase the like count and add the user to likedBy array
      post.likes += 1;
      post.likedBy.push(username);
      
      // Save the updated post
      await post.save();
  
      // Send the updated post data back
      res.status(200).json({
        message: 'Post liked successfully',
        likes: post.likes,
        likedBy: post.likedBy,
      });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while liking the post' });
    }
};

// Controller to fetch likes of a post and return users who liked it
// const get_post_likes_c = async (req, res) => {
//     try {
//         const postId = req.params.postId;

//         // Find the post and populate the user names from the likes array
//         const post = await postModel.findById(postId).populate('likes.user', 'name');

//         if (!post) {
//             return res.status(404).json({ message: 'Post not found', success: false });
//         }

//         // Ensure likes is an array
//         const likes = Array.isArray(post.likes) ? post.likes : [];

//         // Get list of users who liked the post and return their names
//         const usersWhoLiked = likes.map(like => ({
//             userId: like.user._id, // assuming `like.userModel` should be `like.user`
//             userName: like.user.name,
//             likedAt: like.likedAt
//         }));

//         res.json({
//             message: 'Post likes fetched successfully',
//             success: true,
//             data: {
//                 postId: post._id,
//                 title: post.title,
//                 likeCount: post.likeCount,
//                 usersWhoLiked
//             }
//         });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

const get_post_likes_c = async (req, res) => {
    try {
        const postId = req.params.postId;

        // Find the post and populate the user names from the likes array
        const post = await postModel.findById(postId).populate('likes.user', 'First_Name');

        if (!post) {
            return res.status(404).json({ message: 'Post not found', success: false });
        }

        // Ensure likes is an array
        const likes = Array.isArray(post.likes) ? post.likes : [];

        // Get list of users who liked the post and return their names
        const usersWhoLiked = likes.map(like => ({
            userId: like.user ? like.user._id : null, // Ensure the user is populated
            userName: like.user ? like.user.name : 'Unknown User', // Ensure the user name is present
            likedAt: like.likedAt
        }));
        // console.log(user);
        
        res.json({
            message: 'Post likes fetched successfully',
            success: true,
            data: {
                postId: post._id,
                title: post.title,
                likeCount: post.likeCount,
                usersWhoLiked
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


//commemt controller
const comment_post_c = async(req,res)=>{
    try {
        const comment = {
            text: req.body.text,
            user: req.body.user
        };
        
        // Get the post ID from params
        const postId = req.params.id;
        
        // Find the post by its ID
        const commentPost = await postModel.findById(postId);
        
        if (!commentPost) {
            return res.status(404).json({
                message: 'Post not found',
                success: false
            });
        }

        // Add the comment to the post's comments array
        commentPost.comments.push(comment);

        // Save the updated post
        await commentPost.save();

        res.json({
            message: "Comment added successfully",
            success: true,
            data: commentPost
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}
//delete comment
const delete_comment_c = async(req,res)=>{
    try {
        const postId = req.params.postId
        const commentId = req.params.commentId

        // Log postId and commentId to ensure they're being passed correctly
        // console.log("Post ID:", postId, "Comment ID:", commentId);

        //find the post by its id
        const post = await postModel.findById(postId)
        if(!post){
            throw new Error('post not found')
        }
        //find the comment by its id
        const comment = post.comments.id(commentId)
        if(!comment){
            throw new Error('comment not found')
        }

         // Use pull to remove the comment from the comments array
         post.comments.pull(commentId);

        // Save the updated post
        await post.save();

        return res.status(200).json({
            message: 'Comment deleted successfully',
            success: true,
            data: post
    })
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

//update comment in post
const update_comment_c = async (req, res) => {
    try {
        const postId = req.params.postId; // Get the post ID from the URL params
        const commentId = req.params.commentId; // Get the comment ID from the URL params
        const { text } = req.body; // Get the new comment text from the request body

        // Find the post by its ID
        const post = await postModel.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: 'Post not found',
                success: false
            });
        }

        // Find the specific comment within the post's comments array
        const comment = post.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({
                message: 'Comment not found',
                success: false
            });
        }

        // If text is provided, update the comment text
        if (text) {
            comment.text = text;
        } else {
            return res.status(400).json({
                message: 'No new comment text provided',
                success: false
            });
        }

        // Save the updated post with the updated comment
        await post.save();

        res.json({
            message: 'Comment updated successfully',
            success: true,
            data: post
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};





module.exports = {
    create_register_controller,
    get_register_controller,
    create_login_C,
    get_login_controller,
    single_login_user,
    update_register_C,
    delete_register_c,
    block_user_c,
    get_blocked_user_list,
    unblock_user_c,
    unblock_user_list_c,
    decodeToken,
    upload_file,
    create_post,
    update_post,
    delete_post_C,
    get_all_post,
    comment_post_c,
    delete_comment_c,
    update_comment_c,
    like_post_c,
    get_post_likes_c
      
}



