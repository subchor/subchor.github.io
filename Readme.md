# The subchor website

This repository contains the website for subchor, a community choir from Vienna, Austria.

## How thinks work, supposedly

The site is just a plain old HTML site. Additional content is loaded from external source: videos from Youtube, images from Flickr, our newsfeed from Facebook.

### Shows

The list of our shows is stored in `shows.json`. This file is dynamically loaded from the main page (`index.html`) and the archive page (`archiv.html`).

The objects describing a show have the following properties:

* title: name of the show
* date: date of the show, format `YYYY-MM-DD`
* time: start time of the event, 24h format, e.g. `21:30` (optional)
* location: name of the place
* description: additional information like other acts, running order, address, directions, etc. (optional)
* link: URL for further information (optional)
* flyer: absolute path or URL to an image resource (optional)

e.g.

    {
        "date": "2021-02-30",
        "title": "Subchor vs. Wiener Philharmoniker",
        "location": "Konzerthaus",
        "description": 0,
        "link": "https://www.facebook.com/events/1234567890/",
        "flyer": "/img/flyer/urleiwand.png"
      }

### Landing page

**Background images** are stored in `img/bg/`. They are chosen randomly on each page load. The script
in `index.html` contains a list of available images and has to be updated if images are added or removed.

The **quotes** are also randomly selected on each page load. They are also defined in `index.html`.

## Contributing

### Website

Have something to add, don't like the site? Feel free to submit a pull request on GitHub.

### Facebook Newsfeed

All choir members get access to our Facebook Page on request.

### Photos via Flickr 

Just tag your subchor related photos on Flickr with `subchor` and they will show up in the gallery.


## Development

There is no tooling required, the page is purely static. All resources and dependencies
are included in the repository.

For local development it can be useful to use some webserver so fetching resources via
XHR works. A nice zero-configuration option for this is [local-web-server](https://github.com/lwsjs/local-web-server).