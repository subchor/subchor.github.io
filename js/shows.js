/**
 * Loads a JSON file with information on shows and renders the
 * information in the current document. Populates the elements 
 * marked by the following HTML data-attributes:
 * 
 * data-live-next-link: innerText is set to the title of the next upcomming show
 * data-live-upcomming: renders a list of all upcomming shows
 * data-live-upcomming-empty: visibility is toggled depending on upcomming shows
 * data-live-past: renders a list of past shows
 */

(function(){
    var compiledTemplates = {
        'showlist': function anonymous(it) {
            return it.shows.map(show => `
    <li class="live-show">
        ${show.flyer
            ? `<a href="${ show.flyer}" class="live-show__flyer">
                    <img class="live-show__img" src="${ show.flyer}" loading="lazy">
                    <h4 class="live-show__title">${ show.title }</h4>
                </a>`
            : `<h4 class="live-show__title">${ show.title }</h4>`
        }
            <div class="live-show__date-location">
                ${ show.dateFriendly }
                ${ show.time && `ab ${ show.time}` },
                ${ show.location }
            </div>
            ${ show.description && `<div class="live-show__description">${ show.description }</div>`}
            ${ show.link && `
                <a href="${ show.link }" target="_blank" rel="noopener">
                    ${ show.linkIsFacebook ? 'Facebook Event' : 'Website' }
                </a>
            `}
    </li>`).join('')
        },
        'next-gig': function anonymous(it) {
            return ` Nächster Auftritt: ${it.show.title}, ${it.show.dateFriendly}`
        }
    }
    var getTemplate = function(name){
        return compiledTemplates[name]
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
            show.linkIsFacebook = show.link && show.link.match(/^(?:https?\:\/\/)?(?:www\.)?facebook\.com\/events\/\d{10,20}\/?$/)
            if(show.date >= today) {
                upcommingShows.push(show)
            } else if (!pastMax || pastShows.length < parseInt(pastMax, 10)){
                pastShows.push(show)
            }
        })

        // render upcomming shows
        if(upcommingShows.length) {
            upcommingShows.reverse()
            var tmpl = getTemplate("showlist")
            var upcommingEl = document.querySelector("[data-live-upcomming]")
            upcommingEl.innerHTML = tmpl({shows: upcommingShows})
            initLightbox()
            refreshGumshoe()

            var nextGigEl = document.querySelector("[data-live-next-link]")
            if(nextGigEl) {
                var tmpl = getTemplate("next-gig")
                nextGigEl.innerHTML = tmpl({show: upcommingShows[0]})
            }

        } else {
            var emptyText = document.querySelector("[data-live-upcomming-empty]")
            if(emptyText) {
                emptyText.style.display = "block"
            }
        }

        // render past shows
        var tmpl = getTemplate("showlist")
        pastEl.innerHTML = tmpl({shows: pastShows})
        initLightbox()
        refreshGumshoe()
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
    var refreshGumshoe = function () {
        if(window.gumshoe  && typeof window.gumshoe.setDistances === 'function') {
            gumshoe.setDistances();
        }
    }
})()
