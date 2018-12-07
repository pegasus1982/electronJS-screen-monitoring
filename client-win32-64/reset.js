var ids = require('short-id');
var fs = require('fs')
const remote = require('electron').remote;

$('#get-info').click(function(){
    var name = $('#p-info-name').val();
    var mail = $('#p-info-mail').val();
    var phone = $('#p-info-phone').val();
    var password = $('#p-info-password').val();
    var personal_data = {
        "name" : name,
        "mail" : mail,
        "phone" : phone,
        "password" : password,
        "UUID" : ids.store(name+mail+phone+password)
    }
    fs.writeFile(__dirname+"/../../personal-info", JSON.stringify(personal_data), function(err) {
        if(err) {
            return console.log(err);
        }

        console.log("The file was saved!");
        var wd = remote.getCurrentWindow()
        wd.hide();
    });
})