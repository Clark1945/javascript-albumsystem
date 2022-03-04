var express=require('express');
var router=express.Router();
var multer=require('multer');
var memberModel=require('../models/memberModel');

var storage=multer.diskStorage({
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


router.post("/getAlbum",function(req,res,next){
    memberModel.findOne({account:req.body.account},function(err,data){
        if(err){
            res.json({'status':1,'msg':'error'});
        }
        else{
            res.json({'status':0,'msg':'success','data':data});
        }
    });
});


router.post("/delete",function(req,res,next){
    memberModel.findOne({account:req.body.account},function(err,data){
        if(err){
            res.json({'status':1,'msg':'error'});
        }
        else{
            var images=req.body.images;
            for(var i in images){
                var index=data.photos.indexOf(images[i]);
                if(index>-1){
                    data.photos.splice(index,1);
                }
            }
            //data.markModified("photos");
            data.save(function(err){
                if(err){
                    res.json({'status':1,"msg":'error'});
                }
                else{
                    res.json({'status':0,'msg':'success','photos':data.photos});
                }
            });
        }
    });
});

module.exports=router;