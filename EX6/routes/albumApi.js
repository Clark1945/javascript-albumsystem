const { storage } = require('debug/src/browser');  //自動加入
var express=require('express');
var router=express.Router();
var multer=require('multer');
var memberModel=require('../models/memberModel');

var sotrage=multer.diskStorage({
    destination: function (req,file,cb){  //cb callback方法
        cb(null,'./public/photos');//儲存地，error不進行動作
    },
    filename: function(req,file,cb){
        var str=file.originalname.split(".");
        cb(null,Date.now()+"."+str[1]);//命名規則
    }
});
var upload=multer({storage:storage});

router.post("/upload",upload.single("file"),function(req,res,next){
    memberModel.findOne({account:req.query.account},function(err,data){
        data.photos.push(req.file.filename);//檔案名稱存入陣列
        data.markModified('photos');
        data.save(function(err){
            if(err){
                res.json({'status':1,'msg':'error'});
            }
            else{
                res.json({'status':0,'msg':'success','photos':data.photos});
            }
        });
    });
});



module.exports=router;