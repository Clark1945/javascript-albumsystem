function upload(){
    if(!$.cookie('userID') || $.cookie('userID')=="null"){
        alert("請先登入");
        location.href='/public/login.html';
    }

    var img=document.getElementById('u_img_file');
    if(!/.(gif|jpg|png|GIF|JPG|JPG|PNG|JEPG)$/.test(img.value)){ //正規表示式/......./ $=結尾
        alert("圖片類型錯誤");
        return;
    }
    var formData=new FormData();
    formData.append("file",img.files[0]);//鍵:file,值:img
    var url='/album/upload?account='+$.cookie('userID');
    $.ajax({
        url:url,
        type:"POST",
        data:formData,
        processData:false,//不自動轉換
        contentType:false,//不另行設置
        success:function(res){
            if(res.status==0){
                alert('上傳成功');
                history.go(0);
            }
        },
        error:function(err){
            console.log(err);
        }
    });
}

$('#u_img_file').change(function(){
    readURL(this);
});
function readURL(input){
    if(input.files&&input.files[0]){
        var reader=new FileReader();//讀取檔案使用的方法
        reader.onload=function(e){
            $("u_img").attr('src',e.target.result);//src變換
        }
        reader.readAsDataURL(input.files[0]);//讀取回傳(base64編碼)
    }
}