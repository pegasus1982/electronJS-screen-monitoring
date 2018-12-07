var viewThumbnail = function(id){
    console.log('view thumbnail of current client ',id)
    $('body').append("<div id='thumbnail-container'></div>")
    $('#thumbnail-container').click(function(e){
        e.preventDefault();
    })
    var videoSource = $('#c-'+id+ '>video').attr('src')
    $('#thumbnail-container').append('<div class="ctrl-item" style="padding-bottom: 0"><button id="btn-back-to-main" type="button" class="text-uppercase s-btn s-btn--sm s-btn--black-brd">Back</button></div>')
    $('#thumbnail-container').append("<div id='thumbnail'><div id='thumbnail-video'><video src='"+videoSource+"'></video></div><div id='thumbnail-main-control'></div><div>")
    $('#thumbnail-main-control').append('<div class="ctrl-item"><button id="btn-lock-screen" type="button" class="text-uppercase s-btn s-btn--sm s-btn--black-brd">Lock Screen</button></div>')
    $('#thumbnail-main-control').append('<div class="ctrl-item"><button id="btn-disable-enable-network" type="button" class="text-uppercase s-btn s-btn--sm s-btn--black-brd">Disable network for 30mins</button></div>')
    $('#btn-back-to-main').click(function(){
        $('#thumbnail-container').remove()
    })
}