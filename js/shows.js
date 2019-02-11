/**
 * Loads a JSON file with information on shows and renders the
 * information in the current document. Populates the elements 
 * marked by the following HTML data-attributes:
 * 
 * data-live-next-link: innerTExt is set to the title of the next upcomming show
 * data-live-upcomming: renders a list of all upcomming shows
 * data-live-upcomming-empty: visibility is toggled depending on upcomming shows
 * data-live-past: renders a list of past shows
 */

(function(){
    // load doT templates
    var templateHolder = fetch("js/templates/templates.html")
        .then(function(response){
            return response.text()
        })
        .then(function(tmpl){
            var div = document.createElement("div")
            div.innerHTML = tmpl
            return div
        })
    var getTemplate = function(name){
        return templateHolder.then(function(div){
                var tmplDOM = div.querySelector("#"+name)
                return doT.template(tmplDOM.innerHTML)
            })
    }

    // load JSON with show data
    fetch("shows.json")
    .then(function(response){
        return response.json()
    })
    .then(function(shows){

        // get start of tomorrow - without using Moment.js
        var today = new Date()
        today.setHours(0)
        today.setMinutes(0)
        today.setSeconds(0)
        today.setMilliseconds(0)
        //tomorrow.setDate(tomorrow.getDate() + 1)

        // separate shows into upcomming and past
        var upcommingShows = []
        var pastShows = []
        var pastEl = document.querySelector("[data-live-past]")
        var pastMax = pastEl.dataset.liveMax
        shows.forEach(function(show){
            show.date = new Date(show.date)
            show.dateFriendly = formatDate(show.date)
            if(show.date >= today) {
                upcommingShows.push(show)
            } else if (!pastMax || pastShows.length < parseInt(pastMax, 10)){
                pastShows.push(show)
            }
        })

        // render upcomming shows
        if(upcommingShows.length) {
            upcommingShows.reverse()
            getTemplate("showlist")
            .then(function(tmpl){
                var upcommingEl = document.querySelector("[data-live-upcomming]")
                upcommingEl.innerHTML = tmpl({shows: upcommingShows})
                initLightbox()
            })

            var nextGigEl = document.querySelector("[data-live-next-link]")
            if(nextGigEl) {
                getTemplate("next-gig")
                .then(function(tmpl){
                    nextGigEl.innerHTML = tmpl({show: upcommingShows[0]})
                })
            }

        } else {
            var emptyText = document.querySelector("[data-live-upcomming-empty]")
            if(emptyText) {
                emptyText.style.display = "block"
            }
        }

        // render past shows
        getTemplate("showlist")
        .then(function(tmpl){
            pastEl.innerHTML = tmpl({shows: pastShows})
            initLightbox()
        })
    })

    // helper for date formatting
    var formatDate = function(date) {
        var monthNames = [
            "Januar", "Februar", "März",
            "April", "Mai", "Juni", "Juli",
            "August", "September", "Oktober",
            "November", "Dezember"
        ]
        var day = date.getDate()
        var monthIndex = date.getMonth()
        var year = date.getFullYear()
        return day + ". " + monthNames[monthIndex] + " " + year
    }

    var initLightbox = function() {
        if(window.baguetteBox && typeof window.baguetteBox.run === 'function') {
            baguetteBox.run('.live-shows');
        }
    }
})()
