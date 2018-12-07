var ClientGroup = function(data,parent){
    this.data = data;
    this.parent = parent;
    this.clientList = [];

    _this = this;
    this.construct = function(){
        $('#'+this.parent+'>ul').append('<li><a data-toggle="tab" href="#'+data.id+'">'+data.name+'</a></li>');
        $('#'+this.parent+'>div').append('<div id="'+data.id+'" class="tab-pane fade in">')

        this.getClients();
        //add new client element
        $('#'+this.parent+'>div>#'+data.id).append('<div id="add-new-client" class="col-sm-3 col-md-3"><div id="new-client-info"><div class="g-margin-b-10--xs"><input id="new-client-name" type="text" class="form-control s-form-v3__input" placeholder="Name"></div><div class="g-margin-b-10--xs"><input id="new-client-id" type="text" class="form-control s-form-v3__input" placeholder="ID"></div></div><button id="btn-add-new-client-'+_this.data.id+'" type="button" class="text-uppercase s-btn s-btn--sm s-btn--white-brd" style="width:100%">Add New Client</button></div>')
        
        $(document.body).on('click','#btn-add-new-client-'+_this.data.id,function(e){
            var groupID = e.target.parentElement.parentElement.getAttribute('id')
            var name = $('#'+groupID+' #new-client-name').val()
            var id = $('#'+groupID+' #new-client-id').val()
            if(name != "" && id != ""){
                $('#'+groupID+' #new-client-name').val("")
                $('#'+groupID+' #new-client-id').val("")
                addClient(groupID,name,id)
            }
        })
    }
    
    this.getClients = function(){
        if(data.clients == undefined){
            console.log('no client data')
        }
        else{
            for(var i = 0 ; i < data.clients.length ; i++){
                this.clientList.push(new Client(data.clients[i],'#'+this.parent+'>div>#'+data.id))
            }
        }
    }

    this.construct();
}