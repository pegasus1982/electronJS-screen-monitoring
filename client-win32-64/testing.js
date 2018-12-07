// Create WebSocket connection.
var socket = new WebSocket("wss://node2.wsninja.io");

// Connection opened, now send GUID to autenticate with server.
socket.addEventListener('open', function(event) {
  socket.send(JSON.stringify({ guid: "111650ac-dbfc-4682-9e43-ec1d71c9fb2f" }));
});

var handleMessage; // WebSocket message handler
// Listen for websocket messages
socket.addEventListener('message', function(event) {
  handleMessage(JSON.parse(event.data));
});

var mainArea = document.getElementById("mainArea");
var clearButton = document.getElementById("clearButton");
var addButton = document.getElementById("addButton");
var statusMessage = document.getElementById("statusMessage");

var canvas = document.getElementById("myCanvas");
canvas.width = mainArea.offsetWidth - 5;
canvas.height = mainArea.offsetHeight - 38;

var prev_pos;
var drawing = false;

var ctx = canvas.getContext("2d");

// Check the socket state and update status field accordingly.
setInterval(function() {
  if (socket.readyState === 0) statusMessage.textContent = "Connecting...";
  if (socket.readyState === 1) statusMessage.textContent = "Connected";
  if (socket.readyState === 2) statusMessage.textContent = "Closing...";
  if (socket.readyState === 3) statusMessage.textContent = "Disconnected";
}, 1000);

function moveTo(pos) {
  prev_pos = pos;
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
  drawing = true;
}

function lineTo(pos) {
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
  prev_pos = pos;
}

function cutOff() {
  drawing = false;
}

function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function startDraw(e) {
  var pos = getMousePos(canvas, e);
  moveTo(pos);
  socket.send(JSON.stringify( { method: "move-to", pos: pos, size: {w: canvas.width, h: canvas.height} } ));
}

function stopDraw(e) {
  cutOff();
  socket.send(JSON.stringify( { method: "cut-off" } ));
}

function draw(e) {
  if (!drawing) return;

  var pos = getMousePos(canvas, e);
  if (pos.x !== prev_pos.x || pos.y !== prev_pos.y) {
    lineTo(pos);
    socket.send(JSON.stringify( { method: "line-to", pos: pos } ));
  }
}

function clearAll() {
  clear();
  socket.send(JSON.stringify( { method: "clear" } ));
}

function handleMessage(message) {
  if (message.method === "move-to") {
    moveTo(message.pos);
  }
  if (message.method === "line-to") {
    lineTo(message.pos);
  }
  if (message.method === "cut-off") {
    cutOff();
  }
  if (message.method === "clear") {
    clear();
  }
}

function getMousePos(c, evt) {
  var rect = c.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

function addClient() {
  window.open(
    'https://jsfiddle.net/mmalex/g13e4yt6/show', 
    'MsgWindow_' + Date.now(), 
    'left=0,top=0,width=' + mainArea.offsetWidth + ',height=' + mainArea.offsetHeight);
}

window.addEventListener('mousedown', startDraw, false);
window.addEventListener('mouseup', stopDraw, false);
window.addEventListener('mousemove', draw, false);

clearButton.addEventListener('click', clearAll, false);
addButton.addEventListener('click', addClient, false);