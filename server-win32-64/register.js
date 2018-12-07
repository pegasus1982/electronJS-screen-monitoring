
var fs = require('fs');
var md5 = require('md5');
const {ipcRenderer} = require('electron')
const remote = require('electron').remote;

let p_name,p_pwd

function checkRegistered(){
    fs.readFile(__dirname+'/../../administrator-info.json', {encoding: 'utf-8'}, function(err,data){
        if (!err) {
            //set global personal info
            data = JSON.parse(data);
            p_name = data.name
            p_pwd = data.password
            
            //check if administrator has been registered
            if(p_name != "" && p_pwd != "")
            {
                $('#register-form').hide();
                $('#signIn-form').show();
                var window = remote.getCurrentWindow();
                window.setSize(340,581)
            }
            
        } else {
            console.log(err);
        }
    });
}

$('#get-info').click(function(){
    var name = $('#p-info-name').val();
    var pwd = $('#p-info-password').val();
    var pwdConfirm = $('#p-info-password-confirm').val();
    if(pwd == pwdConfirm){
        var personal_data = {
            "name" : name,
            "password" : md5(pwd)
        }
        fs.writeFile(__dirname+"/../../administrator-info.json", JSON.stringify(personal_data), function(err) {
            if(err) {
                return console.log(err);
            }

            console.log("The file was saved!");
            var wd = remote.getCurrentWindow()
            wd.setSize(1200,800)
            wd.maximize()
            wd.setMaximizable(true)
            // wd.webContents.openDevTools();
            window.location.href="about.html"
        });
    }
    else{
        console.log('wrong password')
        $('#p-info-password').val("");
        $('#p-info-password-confirm').val("");
    }
})

$('#log-in-button').click(function(){
    var l_name = $('#log-in-name').val();
    var l_pwd = md5($('#log-in-password').val());
    if(p_name == l_name && p_pwd == l_pwd){
        //log in is successful
        var wd = remote.getCurrentWindow()
        wd.setSize(1200,800)
        wd.maximize()
        wd.setMaximizable(true)
        wd.webContents.openDevTools();
        window.location.href = "service.html"
    }
    else{
        $('#log-in-password').val("")
    }
})

checkRegistered()

$('#log-in-password').keydown(function (e){
    if(e.keyCode == 13){
        $('#log-in-button').click();
    }
})