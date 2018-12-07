const {desktopCapturer} = require('electron');

let localStream;

function refresh() {
  $('select').imagepicker({
    hide_select : true
  });
}

function addSource(source) {
  $('select').append($('<option>', {
    value: source.id.replace(":", ""),
    text: source.name
  }));
  $('select option[value="' + source.id.replace(":", "") + '"]').attr('data-img-src', source.thumbnail.toDataURL());
  refresh();
}

function showSources() {
  desktopCapturer.getSources({ types:['window', 'screen'] }, function(error, sources) {
    addSource(sources[0]);
  });
}

function onAccessApproved(desktop_id) {
  if (!desktop_id) {
    console.log('Desktop Capture access rejected.');
    return;
  }
  console.log("Desktop sharing started.. desktop_id:" + desktop_id);
  navigator.webkitGetUserMedia({
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: desktop_id,
        minWidth: 1080,
        maxWidth: 1080,
        minHeight: 608,
        maxHeight: 608
      }
    }
  }, gotStream, getUserMediaError);

  function gotStream(stream) {
    localStream = stream;
    document.querySelector('video').src = URL.createObjectURL(stream);
    stream.onended = function() {
    };
  }

  function getUserMediaError(e) {
    console.log('getUserMediaError: ' + JSON.stringify(e, null, '---'));
  }
}

$(document).ready(function() {
  showSources();
  refresh();
});

function startCapturing(){
  setTimeout(() => {
      var id = ($('select').val()).replace(/window|screen/g, function(match) { return match + ":"; });
      console.log(id);
      onAccessApproved(id);
    }, 1000
  );
}