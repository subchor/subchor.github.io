(function(){
/*****
 * Embed Photos from Flickr
****/
var FlickrApiKey = "088e79ad567fb57b47e31915b2d0c8f9"
var FlickrGroupId = "4008006@N22"
var groupPhotoUrl = "https://api.flickr.com/services/rest/?method=flickr.groups.pools.getPhotos&api_key=" +
                    FlickrApiKey + "&per_page=100&format=json&nojsoncallback=1&extras=path_alias,url_l&group_id=" +
                    FlickrGroupId

fetch(groupPhotoUrl)
.then(function(res){
    return res.json()
}).then(function(json){
    var flickrStream = new FlickrStream({
        photos: json.photos.photo,
        imgEl: document.getElementById("photo"),
        titleEl: document.getElementById("photo-title"),
        flickrLinkEl: document.getElementById("photo-flickr"),
    })

    var navs = document.querySelectorAll(".photo-nav")
    for(var i = 0; i < navs.length; i++){
        navs[i].onclick = function(ev){
            ev.preventDefault()
            flickrStream.navigate(this.dataset.nav, true)
        }
    }
})


// Wrapper for Flickr Photo
var FlickrPhoto = function(raw) {
    this.id = raw.id
    this.title = raw.title
    this.imageUrl = raw.url_l
    this.flickrUrl = "https://www.flickr.com/photos/" + raw.pathalias + "/" + raw.id + "/"
}


// Navigate through a list of photos
var FlickrStream = function(options) {
    this.options = options
    this.photos = options.photos.map(function(p){
        return new FlickrPhoto(p)
    })
    this.nb = 0

    this.navigate(0, false)
}
FlickrStream.prototype._getNb = function(incr){
    nb = this.nb + incr
    if(nb >= this.photos.length) {
        nb = 0
    } else if(nb < 0){
        nb = this.photos.length - 1
    }
    return nb
}
FlickrStream.prototype.showPhoto = function(){
    var photo = this.photos[this.nb]
    var opts = this.options
    opts.titleEl.innerText = photo.title
    opts.flickrLinkEl.href = photo.flickrLink
    opts.imgEl.src = photo.imageUrl
}
FlickrStream.prototype.preload = function(){
    var preloadImg = function(photo){
        var url = photo.imageUrl
        var img = document.createElement('img')
        img.src = url
    }
    preloadImg(this.photos[this._getNb(-1)])
    preloadImg(this.photos[this._getNb(1)])
}

FlickrStream.prototype.navigate = function(incr, preload) {
    this.nb = this._getNb(parseInt(incr))
    this.showPhoto()
    if(preload) {
        this.preload()
    }
}
})()
