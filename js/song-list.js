{
    let view = {
        el:'.songList-container',
        template:`
            <ul></ul>
        `,
        render(data){
            $(this.el).html(this.template)
            let {songs} = data
            let liList = songs.map((song)=> $('<li></li>').text(song.name))
            $(this.el).find('ul').empty()
            liList.map((domLi)=>{
                $(this.el).find('ul').append(domLi)
                
            })
        },
        clearActive(){
            $(this.el).find('.active').removeClass('active')
        }
    }
    let model = {
        data:{
            songs:[]
        },
        find(){
            var query = new AV.Query('Song');
            return query.find().then( (songs) => {
                this.data.songs = songs.map((song)=>{
                    return {id:song.id,...song.attributes}
                })
            });            
        }
    }
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            this.bindEventHubs()
            this.findAllSongs()
        },
        findAllSongs(){
            return this.model.find().then(()=>{
                this.view.render(this.model.data)
            })
        },
        bindEventHubs(){
            window.eventHubs.on('new',(data)=>{
                this.view.clearActive()
            })
            window.eventHubs.on('create',(songData)=>{
                this.model.data.songs.push(songData)
                this.view.render(this.model.data)
                

            })
        }
    }
    controller.init(view,model)
}