# The subchor website

This repository contains the website for subchor, a community choir from Vienna, Austria.

## How thinks work, supposedly

The site is just a plain old HTML site. Additional content is loaded from external source: videos from Youtube, images from Flickr, our newsfeed from Facebook.

The list of our shows is stored in `shows.json`. This file is dynamically loaded from the main page (`index.html`) and the archive page (`archiv.html`).

The objects describing a show have the following properties:

* date: date of the show, format `YYYY-MM-DD`
* title: name of the show
* location: name of the place
* description: additional information like other acts, running order, address, directions, etc.

## Contributing

### Website

Have something to add, don't like the site? Feel free to submit a pull request on Github.

### Facebook Newsfeed

All choir members get access to our Facebook Page on request.

### Photos via Flickr 

Just tag your subchor related photos on Flickr with `subchor` and they will show up in the gallery.
