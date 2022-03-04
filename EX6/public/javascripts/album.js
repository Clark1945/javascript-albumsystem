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
function initAlbum(data){
    data.photos.forEach(function (img){
        var commet = `<div style="width:300px;height:300px;float:left;margin:2%"
        <a href="JavaScript:void(0)" onclick="selectImg('${img}',this)">
        <img class="u_img"
        src="/public/photos/${img}"/>
        </a>
        </div>`;
        $('#albumForm').append(commet);
    });
}
function getAlbum(){
    if(!$.cookie('userID') || $.cookie('userID')=="null"){
        alert("請先登入");
        location.href='/public/login.html';
        return;
    }
    $.post("/album/getAlbum",{'account':$.cookie('userID')},
    function(res){
        if(res.status==0){
            initAlbum(res.data);
        }
    });
}
getAlbum();

/*function selectImg(img,a){
    $('#preview').attr('style','display:block');
    $('#previewbg').attr('style','display:block');
    $('#image').attr('src','/public/photos/'+img);
}*/
function closeDialog(){
    $('#preview').attr('style','display:none');
    $('#previewbg').attr('style','display:none');
}
var status="";
var deleteImg=[];
function onSelect(){
    $("#selBtn").hide();
    $("#delBtn").show();
    $("#cnBtn").show();
    status="onSelect";
}
function cnSelect(){
    $("#selBtn").show();
    $("#delBtn").hide();
    $("#cnBtn").hide();
    status="";
    deleteImg=[];
    $("u_img_file").removeClass("u_img_file");
}
function selectImg(img,a){
    if(status=="onSelect"){
        $(a).children().toggleClass("u_img_file");
        if(deleteImg.indexOf(img)>-1){
            deleteImg.splice(deleteImg.indexOf(img),1);
        }
        else{
            deleteImg.push(img);
        }
    }else{
        $('#preview').attr('style','display:block');
        $('#previewbg').attr('style','display:block');
        $('#image').attr('src','/public/photos/'+img);
    }
}
function onDelete(){
    if(!$.cookie('userID') || $.cookie('userID')=="null"){
        alert("請先登入");
        location.href='/public/login.html';
        return;
    }
    if(deleteImg.length<1){
        alert("尚未選取圖片");
        return;
    }
    if(!confirm("確定刪除?")){
        return;
    }
    else{
        var url = "/album/delete";
        var jsondata = JSON.stringify({
            "account":$.cookie("userID"),
            "images":deleteImg
        });
        $.ajax({
            url:url,
            type:"POST",
            data:jsondata,
            contentType:"application/json",
            success: function (res){
                if(res.status==0){
                    alert("刪除成功");
                    history.go(0);
                }
                else{
                    alert(res.status);
                }
            },
            error: function (err){
                console.log(err);
            }           
        })
    }
}