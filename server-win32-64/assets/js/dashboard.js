

            function parseStudentList(data){
                var strhtml = "";            
                $('#check_group input[type=checkbox]').each(function(index){
                    if (typeof $(this).attr('checked') != 'undefined' && $(this).attr('checked') == 'checked')
                            for(var i = 0 ; i < data.length ; i++){
                                var hiddenF = "";
                                if ($(this).val() != data[i].group_id) hiddenF = "style='display:none'";;
                                    var strElem;
                                    strElem = "<tr "+hiddenF+" id='stu"+ data[i].id +"' scope='col'><td><label class='label-custom'>"+(i+1)+"</label></td><td><div class='styled-input-single'><input type='checkbox' id='"
                                              +data[i].id +"' onclick='savePresentInfo()' value= '"+ data[i].id +"' "+(data[i].status?"checked":"")+"/><label for='"+ data[i].id +"'>"+data[i].name+"</label></div></td><td><label class='label-custom'>"
                                              +data[i].group_name+"</label></td><td><label onclick='removeStu(this)' stu_name='"+data[i].name+"' stu_id= '"
                                              + data[i].id +"' class='label-custom label-button'>Effacer</label></td></tr>";
                                    strhtml = strhtml + strElem;
                            }                        
                });
                if (strhtml == "") {
                    strhtml = "<tr><td colspan='5' style='text-align:center;'><p style='color:white'>Il n'y a pas d'étudiants sélectionnés.</p></td></tr>";
                }                
                $('#current-student-list>tbody').html(strhtml);
            }
            function getStudentList(){
                var strUrl=$('meta[name=siteURL]').attr('content') + "Dashboard/getStudentList";
                var request = $.ajax({
                  url: strUrl,
                  method: "POST",
                  //data: {"userID":userID},
                  dataType: "json"
                });                                 
                request.done(function( msg ) {
                    console.log("Received All Students List ->", msg);
                    parseStudentList(msg);
                });
                request.fail(function( jqXHR, textStatus ) {
                  console.error( "Request failed: " + textStatus );
                });                 
            }
            function rebuildTable_01(data){
                $('#scores-by-student-game-date>tbody').empty();
                var convertedData = [];
                //sort by name
                var tmp = [];
                for(var i = 0 ; i < data.length ; i++)
                    tmp.push(data[i].studentName);
                var uniqueNames = [];
                
                $.each(tmp, function(i, el){
                    if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
                });

                for(var i = 0 ; i < uniqueNames.length ; i++){
                    tmp = data.filter(function(item){
                        return item.studentName == uniqueNames[i];
                    });
                    var elem = [];
                    elem['name'] = uniqueNames[i];
                    elem['data'] = [];
                    var tmpGameName = [];
                    for(var j = 0 ; j < tmp.length ; j++)
                        tmpGameName.push(tmp[j].gameName);
                    var uniqueGameNames = [];
                    
                    $.each(tmpGameName, function(i, el){
                        if($.inArray(el, uniqueGameNames) === -1) uniqueGameNames.push(el);
                    });

                    for(var j = 0 ; j < uniqueGameNames.length ; j++){
                        var elemGame = [];
                        elemGame['name'] = uniqueGameNames[j];
                        elemGame['date'] = tmp.filter(function(item){
                            return item.gameName == uniqueGameNames[j];
                        });
                        //sort by game name
                        
                        elem['data'].push(elemGame);
                    }
                    convertedData.push(elem);
                }
                var total_strHtml = "";
                for(var i = 0 ; i < convertedData.length ; i++){
                    var rowSpanForName = 0;
                    var rowSpanForFirstRow = convertedData[i].data[0].date.length;
                    for(var j = 0 ; j < convertedData[i].data.length ; j++)
                        rowSpanForName += convertedData[i].data[j].date.length;
                    
                    var strHtml = "<tr><td rowspan='"+rowSpanForName+"'>"+(i+1)+"</td><td  rowspan='"+rowSpanForName+"'>"+convertedData[i].name+"</td><td rowspan='"+rowSpanForFirstRow+"'>"+convertedData[i].data[0].name+"</td><td>"+convertedData[i].data[0].date[0].playDate+"</td><td>"+convertedData[i].data[0].date[0].score+"</td></tr>";
                    
                    for(var j = 1 ; j < convertedData[i].data[0].date.length ; j++){
                        strHtml += "<tr><td>"+convertedData[i].data[0].date[j].playDate+"</td><td>"+convertedData[i].data[0].date[j].score+"</td></tr>"; 
                    }
                    for(var j = 1 ; j < convertedData[i].data.length ; j++){
                        var rowSpanForGame = convertedData[i].data[j].date.length;
                        strHtml += "<tr><td rowspan='"+rowSpanForGame+"'>"+convertedData[i].data[j].name+"</td><td>"+convertedData[i].data[j].date[0].playDate+"</td><td>"+convertedData[i].data[j].date[0].score+"</td></tr>";
                        for(var k = 1 ; k < convertedData[i].data[j].date.length ;k++)
                        {
                            strHtml += "<tr><td>"+convertedData[i].data[j].date[k].playDate+"</td><td>"+convertedData[i].data[j].date[k].score+"</td></tr>";
                        }
                    }
                    total_strHtml = total_strHtml + strHtml;
                    
                }
                if (total_strHtml == "") {
                    total_strHtml = "<tr><td colspan='5' style='text-align:center;'><p style='color:white'>Personne n'a de scores.</p></td></tr>";
                }                
                $('#scores-by-student-game-date>tbody').html(total_strHtml);
            }
            function parseScore(data){
                rebuildTable_01(data);
            }

            function parseGroupList(data)
            {          
                var strhtml =  strhtml_1 = "<p style='color:white'>Aucun groupe, s'il vous plaît Ajouter un groupe</p>";              
                if (data.length !== 0) {
                        strhtml_1 = '';
                        flag = true;
                        strhtml = '<div class="form-group" ><label>Select Group:</label> <select id="sel_game" class="form-control">';
                        for (var i = 0; i < data.length; i++) {
                                     strhtml = strhtml  + '<option value="'+ data[i].groupID +'">' + data[i].groupName +'</option>'; 
                                     if(i % 3 == 0) 
                                        if (flag) {
                                            strhtml_1 = strhtml_1 + "<tr>"; flag = false;
                                        }else{
                                            strhtml_1 = strhtml_1 + "</tr>"; flag = true;
                                        }
                                              
                                     strhtml_1 = strhtml_1  + '<td><div class="styled-input-single"><input type="checkbox"  id="'+ data[i].groupID +'" value="'+ data[i].groupID +'" onclick="filterStudent(this)" /><label for="'+ data[i].groupID +'">' + data[i].groupName +'</label></div></td>';                    
                        }
                        strhtml = strhtml + '</select></div><div class="form-group" ><label>Enter Student Name:</label>'+
                                            '<input placeholder="Enter student name" type="text" id="student_name" class = "form-control">'+
                                            '</div>';
                        strhtml = strhtml  +  '<div class="form-group" ><button type="button" onclick="addStudent(this)" class="form-control btn btn-default" >ADD</button></div>';                     

                }
                $('#check_group').html(strhtml_1);
                $('#select_group').html(strhtml);
                getStudentList();
            }
            function addStudent()
            {
                var data = {};
                data.stu_name = $('#student_name').val();
                data.group_id = $('#sel_game').val();

                var strUrl=$('meta[name=siteURL]').attr('content') + "Dashboard/addStudent";

                var request = $.ajax({
                  url: strUrl,
                  method: "POST",
                  data: data,
                  dataType: "json"
                });
                                 
                request.done(function( msg ) {
                    if (typeof msg.error != "undefined") {
                        //$('#stu_name_alert').html = msg.error.nameErr;
                        console.error(msg.error);
                        return;    
                    }
                  if(msg == true)
                    {
                        $('#add_student_modal_close').click();
                        init();
                    }
                  else
                    alert("not successful, unknow");
                });
                 
                request.fail(function( jqXHR, textStatus ) {
                  console.error( "Request failed: " + textStatus );
                });                 
            }
            function getScore(){
                var strUrl=$('meta[name=siteURL]').attr('content') + "Dashboard/getScore";

                var request = $.ajax({
                  url: strUrl,
                  method: "POST",
                  //data: {"userID":userID},
                  dataType: "json"
                });                                 
                request.done(function( msg ) {
                    console.log("Received All Score List ->", msg);
                    parseScore(msg);
                });
                request.fail(function( jqXHR, textStatus ) {
                  console.error( "Request failed: " + textStatus );
                });                 
            }            
            function getGroupList(){
                var strUrl=$('meta[name=siteURL]').attr('content') + "Profile/getGroupList";
                var request = $.ajax({
                  url: strUrl,
                  method: "POST",
                  //data: {"userID":userID},
                  dataType: "json"
                });
                                 
                request.done(function( msg ) {
                    console.log("Received All Group List ->", msg);
                    parseGroupList(msg);
                });
                request.fail(function( jqXHR, textStatus ) {
                    console.error( "Request failed: " + textStatus );
                });                 
            }
            function parseAllGame(data)
            {
                
                var strhtml = strhtml_1 = '<p>There are no games.</p>';
                if (data.length !== 0) {
                        strhtml_1 = '';
                        //g_data = data;
                        strhtml = '<div class="form-group"><table class="table table-bordered"><thead><tr><th>Game Name</th><th>Description</th></tr></thead><tbody id="add_games">';
                        for(var i = 0 ; i < data.length ; i++){
                                strhtml = strhtml + '<tr><td><div class= "checkbox"><label><input type="checkbox" value="'+
                                          data[i].id+'"'+ ((typeof data[i].checked != "undefined" && data[i].checked)?'checked':'')+'>'+data[i].name+'</label><div></td><td><p>'+data[i].description+'</p></td></tr>';
                                if (typeof data[i].checked != "undefined" && data[i].checked)
                                    strhtml_1 = strhtml_1 +"<tr scope='col'><td>"+(i+1)+"</td><td>"+data[i].name+"</td><td>"+data[i].description+"</td></tr>";                        
                        }                                        
                        strhtml = strhtml + '</tbody></table></div>';
                        strhtml = strhtml + '</select></div>'; 
                        strhtml = strhtml  +  '<div class="form-group" ><button type="button" onclick="addGameFunc(this)" class="form-control btn btn-default" >SAVE</button></div>';                     
                }
                if (strhtml_1 == "") {
                    strhtml_1 = "<tr><td colspan='5' style='text-align:center;'><p>There are no any added games.</p></td></tr>";
                }
                $('#current-game-list>tbody').html(strhtml_1);
                $('#add_game').html(strhtml);

                getGroupList();
            }
            function getAllGameList()
            {
                var strUrl=$('meta[name=siteURL]').attr('content') + "Dashboard/getAllGame";
                var request = $.ajax({
                  url: strUrl,
                  method: "POST",
                  //data: {"userID":userID},
                  dataType: "json"
                });
                                 
                request.done(function( msg ) {
                  console.log("Received All Game List ->", msg);
                  parseAllGame(msg);
                });
                 
                request.fail(function( jqXHR, textStatus ) {
                  console.error( "Request failed: " + textStatus );
                });                  
            }                        
            function addGameFunc(){
                var games = [];
                $('#add_games input[type=checkbox]').each(function(index){
                    if (typeof $(this).attr('checked') != 'undefined' && $(this).attr('checked') == 'checked')
                        games.push($(this).val());
                });      

                var strUrl=$('meta[name=siteURL]').attr('content') + "Dashboard/resetCurrentGames";
                //var userID=<?php echo $_SESSION["user_id"]?>;

                var request = $.ajax({
                  url: strUrl,
                  method: "POST",
                  data: {"games":JSON.stringify(games)},
                  dataType: "json"
                });
                                 
                request.done(function( msg ) {
                    if (msg) {
                        $('#add_game_close').click();
                        init();
                    }else{
                        alert("not successful, unknow");
                    }
                });
                 
                request.fail(function( jqXHR, textStatus ) {
                  console.error( "Request failed: " + textStatus );
                });     
            }
            function filterStudent()
            {
                getStudentList();
            }
            function savePresentInfo(){
                //console.log("Present",$('#current-student-list>tbody input[type=checkbox]'));
                var presentInfo = [];
                $('#current-student-list>tbody input[type=checkbox]').each(function(){
                    var status;
                    if(typeof $(this).attr('checked') == "undefined" || $(this).attr('checked') == false)
                        status = false;
                    else
                        status = true;

                    presentInfo.push({"id":$(this).val(),"status":status});
                });
                //console.log("present info json", presentInfo);
                // if (presentInfo.length == 0) {
                //     alert("no students");
                //     return;
                // }
                var strUrl=$('meta[name=siteURL]').attr('content') + "Dashboard/savePresentInfo";

                var request = $.ajax({
                  url: strUrl,
                  method: "POST",
                  data: {"status_values": JSON.stringify(presentInfo)},
                  dataType: "json"
                });
                                 
                request.done(function( msg ) {
                    console.log("Received Present Status:",msg);
                });
                 
                request.fail(function( jqXHR, textStatus ) {
                  console.error( "Request failed: " + textStatus );
                });                  
            }

            function removeStu(e){
                if(!confirm("Are you sure? You will loss " + $(e).attr('stu_name') + " student."))
                  return;
                var strUrl=$('meta[name=siteURL]').attr('content') + "Dashboard/removeStudent";

                var request = $.ajax({
                  url: strUrl,
                  method: "POST",
                  data: {"stu_id": $(e).attr('stu_id')},
                  dataType: "json"
                });
                                 
                request.done(function( msg ) {
                    console.log(msg);
                    if(msg) {                        
                        $('#stu'+$(e).attr('stu_id')).remove();
                    }
                    else alert("fail, can't perform this action becasue of unknow error");
                });
                 
                request.fail(function( jqXHR, textStatus ) {
                  console.error( "Request failed: " + textStatus );
                });                 
            }
            function init(){
                //getGameListFromServer();
                getAllGameList();
                            
                getScore();                                
            }            

            setInterval(getScore,2000);

