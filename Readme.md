# The subchor website

This repository contains the website for subchor, a community choir from Vienna, Austria.

## How thinks work, supposedly

The site is just a plain old HTML site. Additional content is loaded from external source: videos from Youtube, images from Flickr, our newsfeed from Facebook.

### Shows

The list of our shows is stored in `shows.json`. This file is dynamically loaded from the main page (`index.html`) and the archive page (`archiv.html`).

The objects describing a show have the following properties:

* date: date of the show, format `YYYY-MM-DD`
* title: name of the show
* location: name of the place
* description: additional information like other acts, running order, address, directions, etc.
* link: URL for further information

e.g.

    {
        "date": "2021-02-30",
        "title": "Subchor vs. Wiener Philharmoniker",
        "location": "Konzerthaus",
        "description": 0,
        "link": "https://www.facebook.com/events/1234567890/"
      }

### Landing page

**Background images** are stored in `img/bg/`. They are chosen randomly on each page load. For each image there has to be a CSS class `#landing.bg<i>`, where `<i>` is an integer. The code for random image selection is in `index.html` and the number of available images has to be adapted there.

The **quotes** are also randomly selected on each page load. They are defined in `index.html`.

## Contributing

### Website

Have something to add, don't like the site? Feel free to submit a pull request on GitHub.

### Facebook Newsfeed

All choir members get access to our Facebook Page on request.

### Photos via Flickr 

Just tag your subchor related photos on Flickr with `subchor` and they will show up in the gallery.
