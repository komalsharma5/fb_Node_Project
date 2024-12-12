const mongoose = require('mongoose');
const User = require('./fb_model')



// // Assuming you have a commentSchema defined somewhere
// const commentSchema = new mongoose.Schema({
//     text: String,
//     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Comment author
//     createdAt: { type: Date, default: Date.now }
// });

// const postSchema = new mongoose.Schema({
//     title: String,
//     content: String,
//     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Post author
//     comments: [commentSchema],
//     likes: [
//         {
//             user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // User who liked the post
//             likedAt: { type: Date, default: Date.now }
//         }
//     ],
//     likeCount: { type: Number, default: 0 },  // Track the total number of likes on the post
//     createdAt: { type: Date, default: Date.now }
// });

// const Post = mongoose.model('Post', postSchema);

///////////////////////////////////////////////////////////////2nd time is correct code
const postSchema = new mongoose.Schema({
    content: String,
    likes: { type: Number, default: 0 },
    likedBy: [{ type: String },{
      User: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{ username: String, comment: String }],
  });
// Post model
const Post = mongoose.model('Post', postSchema);

module.exports = Post



