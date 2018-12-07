var Client = function(data,parent){
    this.id = data.id;
    this.name = data.name;
    this.type = data.type;
    this.parent = parent;
    this.found = false;
    this.connected = false;

    var _this = this;

    // Create WebSocket connection.
    var socket = new WebSocket("wss://node2.wsninja.io");

    // Connection opened, now send GUID to autenticate with server.
    socket.addEventListener('open', function(event) {
        socket.send(JSON.stringify({ guid: "b8907407-7291-4ae1-b34a-8699137199dd" }));
    });
    socket.addEventListener('error',function(event){
        console.log(event);
    });

    // Listen for websocket messages
    socket.addEventListener('message', function(event) {
        data = JSON.parse(event.data)
        console.log(data)
        if(data.accepted == true){
            console.log("started");
            _this.findClient();
        }

        //check reply message
        if(data.type == "reply" && data.sender == _this.id){
            _this.found = true;
            new Notification("Infomation",{
                title: "Information",
                body: _this.name+" is online.",
                icon: __dirname + '/assets/img/icon.png'
              });
        }

        //check share screen message
        if(data.type == "share-screen" && data.sender == _this.id){
            //videos-container
            console.log('screen sharing started')
            $('#c-'+_this.id+ ' #fake-frame').html('<p>CONNECTING...</p>');
            $('#c-'+_this.id+ '>iframe').attr('src',data.payload)
            _this.getVideo();
        }
    });
    
    this.getVideo = function(){
        var iframe = document.getElementById("frame-"+_this.id);
        var elmnt = iframe.contentWindow.document.getElementsByTagName("video");
        if(elmnt.length == 0) setTimeout(() => {
            _this.getVideo();
        }, 1000);
        else{
            $('#c-'+_this.id+ ' #fake-frame').css('display','none');
            $('#c-'+_this.id+ '>video').css('display','block');
            $('#c-'+_this.id+ '>video').attr('src',elmnt[0].getAttribute('src'));
            _this.found = true
        }
    }
    this.findClient = function(){
        console.log('finding')
        if(_this.found == false){
            socket.send(JSON.stringify({type:"find-client",sender:"monitor",receiver:_this.id}))
            setTimeout(() => {
                _this.findClient();
            }, 1000);
        }
    }
    this.construct = function(){
        $(this.parent).append("<div id='c-"+this.id+"' class='cursor-pointer col-xs-6 col-sm-4 col-md-3 col-lg-3 col-xl-3 break-word client-item'><div id='fake-frame' class='fake-frame'></div><iframe id='frame-"+_this.id+"' style='display:none'></iframe><video style='display:none'></video>"+this.name+"</div>")
        $("#c-"+this.id).click(function(){
            console.log(_this.name+' selected')
            viewThumbnail(_this.id)
        })
    }

    this.construct();
}