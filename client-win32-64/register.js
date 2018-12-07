
var fs = require('fs')
var md5 = require('md5')
const {ipcRenderer} = require('electron')
var ids = require('short-id')
const remote = require('electron').remote;


var p_name,p_mail,p_phone,p_UUID

function confirmRegistered(){
    var wd = remote.getCurrentWindow()
    // wd.setMaximizable(true)
    // wd.webContents.openDevTools();
    $('#register-form').addClass('hide');
    $('#screen-capture').removeClass('hide');
    wd.hide();
    startCommunication();
    ipcRenderer.send('synchronous-message','registered')
}

function checkRegistered(){
    console.log(__dirname)
    fs.readFile(__dirname+'/../../personal-info', {encoding: 'utf-8'}, function(err,data){
        if (!err) {
            data = JSON.parse(data);
            console.log(data)

            //set global personal info
            p_name = data.name;
            p_mail = data.mail;
            p_phone = data.phone;
            p_UUID = data.UUID;
            console.log("UUID is ",p_UUID)
            confirmRegistered()
            
        } else {
            console.log(err);
        }
    });
}

$('#get-info').click(function(){
    var name = $('#p-info-name').val();
    var mail = $('#p-info-mail').val();
    var phone = $('#p-info-phone').val();
    var password = $('#p-info-password').val();
    p_UUID = ids.store(name+mail+phone+password)
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
        confirmRegistered()
    });
})

checkRegistered()