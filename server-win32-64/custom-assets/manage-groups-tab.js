var fs = require('fs');
var md5 = require('md5')

var database
var groupList = []
function getAllGroups(){
    fs.readFile(__dirname+'/../../administrator-info.json', {encoding: 'utf-8'}, function(err,data){
        if (!err) {
            //set global personal info
            database = data = JSON.parse(data);
            var groupData = data.groups;
            if(groupData == undefined){
                console.log('no group data')
            }
            else{
                for(var i = 0 ; i < groupData.length ; i++){
                    groupList.push(new ClientGroup(groupData[i],"main-container"))
                }
            }
            //add new group button
            $('#main-container>ul').append('<li><a data-toggle="tab" href="#add-new-class">Add New Group</a></li>')
            $('#main-container>ul>li').first().addClass('active');

            //add new group content
            $('#main-container>div').append('<div id="add-new-class" class="tab-pane fade in"><form class="center-block g-width-500--sm g-width-550--md"><div class="g-margin-b-20--xs"><input id="new-group-name" type="text" class="form-control s-form-v3__input" placeholder="Group Name"></div><div class="g-text-center--xs"><button id="add-new-group" type="button" class="text-uppercase s-btn s-btn--sm s-btn--white-brd g-radius--50 g-padding-x-60--xs g-margin-b-20--xs">Add New Group</button></div></form></div>')
            $('#main-container>div>div').first().addClass('active');
            $('#add-new-group').click(function(){
                var newGroupName = $('#new-group-name').val()
                if(newGroupName == "") alert("Please Enter Group Name")
                else{
                    //////////////////////////////////////////////////////////
                    //Add New Group
                    addNewGroup(newGroupName)
                }
            })
        } else {
            console.log(err);
        }
    });
}

function updateDB(){
    fs.writeFile(__dirname+"/../../administrator-info.json", JSON.stringify(database), function(err) {
        if(err) {
            return console.log(err);
        }
        location.reload()
    });
}
function addNewGroup(groupName){
    if(database.groups == undefined){
        database.groups = [];    
    }
    //check duplicating
    var bDuplicated = false
    for(var i = 0 ; i < database.groups.length ; i++){
        console.log(database.groups)
        if(database.groups[i].name == groupName){
            bDuplicated = true;
            alert('Same Group is exist!')
            break;
        }
    }
    if(bDuplicated == false){
        database.groups.push({
            "id":md5(groupName),
            "name":groupName,
            "clients":[]
        })
        updateDB();
    }
}

function addClient(groupID,clientName,clientID,clientType){
    console.log('add client process')
    console.log(groupID,clientName,clientID)
    for(var i = 0 ; i < database.groups.length ; i++){
        if(database.groups[i].id == groupID){
            console.log(database.groups[i].name)
            //check duplicated
            var bExist = false
            for(var j = 0 ; j < database.groups[i].clients.length ; j++){
                if(database.groups[i].clients[j].name == clientName){
                    bExist = true
                    break
                }
            }
            if(bExist == false){
                database.groups[i].clients.push({id:clientID,name:clientName,type:"desktop"})
                updateDB();
            }
            else{
                alert('Same Client Is Exist')
            }
            break;
        }
    }
}
getAllGroups();
