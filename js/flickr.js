(function(){
/*****
 * Embed Photos from Flickr
****/
var FlickrApiKey = "088e79ad567fb57b47e31915b2d0c8f9"
var FlickrGroupId = "4008006@N22"
var groupPhotoUrl = "https://api.flickr.com/services/rest/?method=flickr.groups.pools.getPhotos&api_key=" + FlickrApiKey + "&per_page=500&format=json&nojsoncallback=1&&group_id=" + FlickrGroupId
var photoSizesUrl = "https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=" + FlickrApiKey + "&format=json&nojsoncallback=1&&photo_id="

fetch(groupPhotoUrl)
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
        this._sizesPromise = fetch(photoSizesUrl + this.id)
            .then(function(res){
                return res.json()
            })
            .then(function(json){
                return json.sizes.size
            })
    }
    return this._sizesPromise
}
FlickrPhoto.prototype.getUrlForSize = function(size) {
    return this.getSizes()
        .then(function(sizes) {
            var sizeObj = sizes.find(function(sizeObj){
                return sizeObj.label === size
            })
            return sizeObj ? sizeObj.source : undefined
        })
}
FlickrPhoto.prototype.getFlickrLink = function() {
    return this.getSizes()
        .then(function(sizes) {
            if(sizes.length) {
                var urlMatch = sizes[0].url.match(/(.*)\/sizes\/.*/)
                return urlMatch ? urlMatch[1] : undefined
            }
        })
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
    photo.getUrlForSize(opts.size)
        .then(function(url){
            opts.imgEl.src = url
        })
    photo.getFlickrLink()
        .then(function(url) {
            opts.flickrLinkEl.href = url
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

FlickrStream.prototype.navigate = function(incr, preload) {
    this.nb = this._getNb(parseInt(incr))
    this.showPhoto()
    if(preload) {
        this.preload()
    }
}
})()
