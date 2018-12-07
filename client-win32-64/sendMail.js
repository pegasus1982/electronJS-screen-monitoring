var fs = require('fs');
const sendmail = require('sendmail')();

let p_UUID;
fs.readFile(__dirname+'/../../personal-info', {encoding: 'utf-8'}, function(err,data){
    if (!err) {
        data = JSON.parse(data);
        console.log(data)
        p_UUID = data.UUID
        console.log(p_UUID)
        $('#your-id').val(p_UUID)
    } else {
        console.log(err);
    }
});

// $('#your-id').on('focus', function(e) {
//     $(this).blur();
// });

$('#send-info').click(function(){
    var yourMail = $('#your-mail').val();
    var managerMail = $('#manager-mail').val();
    var id = $('#your-id').val();
    console.log(yourMail,managerMail)
    var link = "mailto:"+managerMail+
             "?cc="+yourMail+
             "&subject=" + escape("My Id is")+
             "&body=" + escape(id);
    window.location.href = link;
})