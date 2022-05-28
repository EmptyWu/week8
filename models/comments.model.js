const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
    {
      comment: {
        type: String,
        required: [true, 'comment can not be empty!']
      },
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        require: ['true', '使用者必須存在']
      },
      post: {
        type: mongoose.Schema.ObjectId,
        ref: 'post',
        require: ['true', '文章必須存在']
      }
    },
    {
      versionKey: false,
      timestamps: true,
      toJSON: {virtuals:true},
      toObject: {virtuals:true},
    },
  );

  // commentSchema.pre(/^find/, function(next) {
  //   this.populate({
  //     path: 'user',
  //     select: 'name id createdAt'
  //   });
  
  //   next();
  // });

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;