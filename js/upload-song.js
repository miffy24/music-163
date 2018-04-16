{
    let view = {
        el:'aside>#uploadArea',
        template:`
        <div class="upload" id="upload-button">上传歌曲</div>
        `,
        render(data) {
            $(this.el).html(this.template)
        }
    }
    let model = {

    }
    let controller = {
        init(view,model){
            this.view = view 
            this.model = model
            this.view.render(this.model.data)
            this.initQiniu()
        },
        initQiniu(){
            var uploader = Qiniu.uploader({
                runtimes: 'html5',    //上传模式,依次退化
                browse_button: 'upload-button',       //上传选择的点选按钮，**必需**
                uptoken_url : 'http://localhost:8888/uptoken',
                domain: 'http://p5oazus7h.bkt.clouddn.com',   //bucket 域名，下载资源时用到，**必需**
                get_new_uptoken: false,  //设置上传文件的时候是否每次都重新获取新的token
                max_file_size: '20mb',           //最大文件体积限制
                dragdrop: true,                   //开启可拖曳上传
                drop_element: 'uploadArea',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
                init: {
                    'FilesAdded': function(up, files) {
                        plupload.each(files, function(file) {
                            // 文件添加进队列后,处理相关的事情
                        });
                    },
                    'BeforeUpload': function(up, file) {
                        // 每个文件上传前,处理相关的事情
                    },
                    'UploadProgress': function(up, file) {
                        // 每个文件上传时,处理相关的事情
                    },
                    'FileUploaded': function(up, file, info) {
                        var domain = up.getOption('domain');
                        var response = JSON.parse(info.response);
                        var sourceLink = domain +'/' + encodeURIComponent(response.key); //获取上传成功后的文件的Url
                        window.eventHubs.emit('new', {
                             url:sourceLink,
                             name:response.key
                        })
                    },
                    'Error': function(up, err, errTip) {
                        //上传出错时,处理相关的事情
                    },
                    'UploadComplete': function() {
                        //队列文件处理完毕后,处理相关的事情
                    },
                }
            });       
        }
    }
    controller.init(view,model)
}