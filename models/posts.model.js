const mongoose = require('mongoose');
const postsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'User未填寫']
      },      
      tags: [
        {
          type: String,
          required: [true, '貼文標籤 tags 未填寫']
        }
      ],
      image: {
        type: String,
        default: ""
      },  
      content: {
        type: String,
        required: [true, 'Content 未填寫'],
      },
      likes: [{ 
        type: mongoose.Schema.ObjectId, 
        ref: 'User' 
      }],	     
    },{
      versionKey: false,
      timestamps:true,
      toJSON: {virtuals:true},
	  toObject: {virtuals:true},	
    });

    postsSchema.virtual('comments', {
        ref: 'Comment',
        foreignField: 'post',
        localField: '_id'
      });
    
    postsSchema.pre(/^find/, function(next) {
        this.populate({
          path: 'comments',
          select: 'comment'
        });
      
        next();
      });
    const postsModel = mongoose.model('Post',postsSchema);
  
    module.exports = postsModel;