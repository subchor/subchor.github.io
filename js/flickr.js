(function(){
/*****
 * Embed Photos from Flickr
****/
var searchByTagUrl = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=088e79ad567fb57b47e31915b2d0c8f9&per_page=500&format=json&nojsoncallback=1&media=photos&tags=subchor"
var photoSizesUrl = "https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=088e79ad567fb57b47e31915b2d0c8f9&format=json&nojsoncallback=1&&photo_id="
var flickrUrl = "https://www.flickr.com/groups/subchor/"

fetch(searchByTagUrl)
.then(function(res){
    return res.json()
}).then(function(json){
    var flickrStream = new FlickrStream({
        photos: json.photos.photo,
        imgEl: document.getElementById("photo"),
        titleEl: document.getElementById("photo-title"),
        flickrLinkEl: document.getElementById("photo-flickr"),
        size: "Large"
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
}
FlickrPhoto.prototype.getSizes = function(){
    if(!this._sizesPromise) {
        var that = this
        this._sizesPromise = fetch(photoSizesUrl + this.id)
            .then(function(res){
                return res.json()
            })
            .then(function(json){
                that._sizes = json.sizes.size
            })
    }
    return this._sizesPromise
}
FlickrPhoto.prototype.getUrlForSize = function(size) {
    var sizes = this.getSizes()
    var that = this
    return new Promise(function(resolve, reject){
        sizes.then(function(res){
            var resolved = false
            that._sizes.forEach(function(sizeObj){
                if(sizeObj.label === size){
                    resolve(sizeObj.source)
                    resolved = true
                }
            })
            if(!resolved) {
                reject()
            }
        })
    })
}


// Navigate through a list of photos
var FlickrStream = function(options) {
    this.options = options
    this.photos = options.photos.map(function(p){
        return new FlickrPhoto(p)
    })
    this.nb = parseInt(localStorage.getItem("subchor.flickrNb")) || 0

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
    photo.getUrlForSize(opts.size)
        .then(function(url){
            opts.imgEl.src = url
            opts.titleEl.innerText = photo.title
            opts.flickrLinkEl.href = flickrUrl + photo.id
        })
}
FlickrStream.prototype.preload = function(){
    var that = this
    var preloadImg = function(i){
        that.photos[that._getNb(i)]
            .getUrlForSize(that.options.size)
            .then(function(url){
                var img = document.createElement('img')
                img.src = url
            })

    }
    preloadImg(-1)
    preloadImg(1)
}
FlickrStream.prototype.setNb = function(nb) {
    this.nb = nb
    localStorage.setItem("subchor.flickrNb", nb)
}
FlickrStream.prototype.navigate = function(incr, preload) {
    this.setNb(this._getNb(parseInt(incr)))
    this.showPhoto()
    if(preload) {
        this.preload()
    }
}
})()
