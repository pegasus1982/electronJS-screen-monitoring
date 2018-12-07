            $('#edit_profile').click(function(){
                if ($(this).html() == 'Save') {
                    updateProfile();
                    return;
                }
                $('#real_name').attr('readonly', false);
                $('#password').attr('readonly', false);
                $('#password').val('');
                $('#again_password').attr('style', 'display:block');
                $('#again_password').val('');
                $('#school').attr('readonly', false);
                $(this).html('Save');
            });
            function parseProfile(data){
                if (!data['result']) {
                    if (typeof data['errors'] == "undefined") {
                      alert('unknow error');
                      return;
                    }
                      if(typeof data['errors']['nameErr'] != 'undefined')
                          $("#real_name_alert").html(data['errors']['nameErr']);
                      else
                          $("#real_name_alert").html("");
                      if(typeof data['errors']['passwdErr'] != 'undefined')
                          $("#passwd_alert").html(data['errors']['passwdErr']);
                      else
                          $("#passwd_alert").html("");
                      if(typeof data['errors']['again_passwdErr'] != 'undefined')
                          $("#again_passwd_alert").html(data['errors']['again_passwdErr']);
                      else
                          $("#again_passwd_alert").html("");                     
                      if(typeof data['errors']['schoolErr'] != 'undefined')
                          $("#school_alert").html(data['errors']['schoolErr']);
                      else
                          $("#school_alert").html("");
                      return;
                }
                $('#real_name').attr('readonly', true);
                $('#password').attr('readonly', true);
                $('#again_password').attr('style', 'display:none');
                $('#school').attr('readonly', true);   
                $('#edit_profile').html('Edit');
            }
            function updateProfile(){
                var strUrl=$('meta[name=siteURL]').attr('content') + '/Profile/updateProfile';

                var data = {};
                data['real_name'] = $("#real_name").val();
                data['passwd'] = $("#password").val();
                data['again_passwd'] = $("#again_password").val();
                data['school'] = $("#school").val();             
                //console.log("sending value:",data);
                var request = $.ajax({
                  url: strUrl,
                  method: "POST",
                  data: data,
                  dataType: "json"
                });
                                 
                request.done(function( msg ) {      
                  console.log("Recieved the result for updating profile", msg);          
                  parseProfile(msg);
                });
                 
                request.fail(function( jqXHR, textStatus ) {
                  alert( "Request failed: " + textStatus );
                });                                
            }
            function parseGroupList(data)
            {
                console.log("group info", data);
                var strhtml = "";
                if (data.length == 0) {
                    strhtml = '<li class="clearfix g-color--white g-margin-b-10--xs">' +
                        '<div class="g-media__body">' + 
                            '<input type="button" class="form-control s-form-v3__input g-padding-l-0--xs"  style="background-color:rgba(1,1,1,0);" value="+ New Group" onclick="add_new(this)">' +
                        '</div>' +
                     '</li>';
                    $('#groups').html("<p style='color:white'>Aucun groupe, s'il vous plaît Ajouter un groupe</p>"+strhtml);  
                    $('#del_group').html("<p>Pas de jeu, vous n'avez personne.</p>");
                    return;  
                }
                for (var i = 0; i < data.length; i++) {
                             strhtml = strhtml  +   '<li class="clearfix g-color--white g-margin-b-10--xs">' +
                                                        '<div class="g-media__body">' +
                                                            '<input type="text" readonly class="form-control s-form-v3__input" ondblclick="update_groupNmae(this)"  style="background-color:rgba(1,1,1,0);" value="'+ data[i].groupName +'" id="'+ data[i].groupID +'">' +
                                                        '</div>'                                    
                                                    '</li>';                    
                }
                strhtml = strhtml  + '<li class="clearfix g-color--white g-margin-b-10--xs">' +
                                        '<div class="g-media__body">' + 
                                            '<input type="button" class="form-control s-form-v3__input g-padding-l-0--xs"  style="background-color:rgba(1,1,1,0);" value="+ New Group" onclick="add_new(this)">' +
                                        '</div>' +
                                     '</li>'; 


                $('#groups').html(strhtml);

                var strhtml = '<div class="form-group"><table class="table table-bordered"><thead><tr><th>Group Name</th></tr></thead><tbody id="group_list">';

                for(var i = 0 ; i < data.length ; i++){
                        strhtml = strhtml + '<tr><td><div class= "checkbox"><label><input type="checkbox" value="'+data[i].groupID+'">'+data[i].groupName+'</label><div></td></tr>';
                }
                
                        
                strhtml = strhtml + '</tbody></table></div>';
                strhtml = strhtml + '</select></div>'; 

                strhtml = strhtml  +  '<div class="form-group" ><button type="button" onclick="delete_group(this)" class="form-control btn btn-default" >Delete</button></div>'; 

                $('#del_group').html(strhtml);                

            }
            function delete_group(){
                if(!confirm("Are you sure? You will loss the students belong to this group."))
                  return;
                var s_group = [];
                $('#group_list input[type=checkbox]').each(function(index){
                    if (typeof $(this).attr('checked') != 'undefined' && $(this).attr('checked') == 'checked')
                        //console.log($(this).attr('checked'));
                        s_group.push($(this).val());
                });      
                console.log(s_group);
     
                var strUrl=$('meta[name=siteURL]').attr('content') + "/Profile/deleteGroup";

                var request = $.ajax({
                  url: strUrl,
                  method: "POST",
                  data: {"s_group":s_group},
                  dataType: "json"
                });
                                 
                request.done(function( msg ) {
                    init();
                  //console.log("All game list", msg);
                  //parseAllGame(msg);
                });
                 
                request.fail(function( jqXHR, textStatus ) {
                  alert( "Request failed: " + textStatus );
                });                   
            }
            function update_groupNmae(e)
            {
                $(e).attr('style', "background-color:rgba(1,1,1,0.1);");
                $(e).attr('readonly', false);
                $(e).blur(function(){
                    $(e).attr('style', "background-color:rgba(1,1,1,0);");
                    $(e).attr('readonly', true);
                    changeGroupNameToServer($(e).attr('id'),$(e).val());
                });
            }
            function add_new(e)
            {
                var strUrl=$('meta[name=siteURL]').attr('content') + '/Profile/addGroup';
                var request = $.ajax({
                  url: strUrl,
                  method: "POST",
                  data: {"groupName":"New Group"},
                  dataType: "json"
                });
                                 
                request.done(function( msg ) {
                    console.log(msg);
                    if (msg == true)
                        getGroupListFromServer();
                    else
                        console.log('unexpected error mk');
                });
                 
                request.fail(function( jqXHR, textStatus ) {
                  alert( "Request failed: " + textStatus );
                });                 
            }

            function changeGroupNameToServer(group_id, group_name){
                var strUrl=$('meta[name=siteURL]').attr('content')+'/Profile/changeGroupName';
                

                

                var request = $.ajax({
                  url: strUrl,
                  method: "POST",
                  data: {"groupID":group_id, "groupName":group_name},
                  dataType: "json"
                });
                                 
                request.done(function( msg ) {
                    console.log(msg);
                    if (msg == true)
                        getGroupListFromServer();
                    else
                        console.log('unexpected error mk');
                });
                 
                request.fail(function( jqXHR, textStatus ) {
                  alert( "Request failed: " + textStatus );
                });                 
            }
            function getGroupListFromServer(){
                var strUrl=$('meta[name=siteURL]').attr('content')+'/Profile/getGroupList';
                var request = $.ajax({
                  url: strUrl,
                  method: "POST",
                  //data: {"userID":g_userID},
                  dataType: "json"
                });
                                 
                request.done(function( msg ) {
                  parseGroupList(msg);

                });
                 
                request.fail(function( jqXHR, textStatus ) {
                  alert( "Request failed: " + textStatus );
                });                 
            }
            function parseUserInfo(data){
              $("#real_name").val(data.real_name);
              $("#email").val(data.username);
              $('#school').val(data.school);
              $('#password').val(data.password);
            }
            function getUserInfo(){
                var strUrl=$('meta[name=siteURL]').attr('content')+'/Profile/getUserInfo';
                var request = $.ajax({
                  url: strUrl,
                  method: "POST",
                  //data: {"userID":g_userID},
                  dataType: "json"
                });
                                 
                request.done(function( msg ) {
                  console.log("Recieved User Info",msg);
                  parseUserInfo(msg);
                });
                 
                request.fail(function( jqXHR, textStatus ) {
                  alert( "Request failed: " + textStatus );
                });
            }
            function init(){
                getGroupListFromServer();   
                getUserInfo(); 
            }