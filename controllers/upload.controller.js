const {ImgurClient } = require("imgur");
const { successHandle,errorHandle } = require("../services/FinishHandle.service");



const uploadImg={
    async upload(req,res,next){
            if(!req.files.length) {
                return next(errorHandle(400,new Error('尚未上傳檔案'),next));
              }
            const client=new ImgurClient({
                clientId: process.env.IMGUR_ClientID,
                clientSecret: process.env.IMGUR_Clientsecret,
                refreshToken: process.env.IMGUR_refreshToken
            });
            
            const response=await client.upload({
                image:req.files[0].buffer.toString('base64'),
                type: 'base64'
            })
            successHandle(res,{imgUrl:response.data.link});
    },
}

module.exports=uploadImg;