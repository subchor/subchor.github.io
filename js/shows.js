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

var templates = {
    'showlist': function anonymous(ctx) {
        return ctx.shows.map(show => `
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
            ${ show.time ? `ab ${ show.time}` : '' },
            ${ show.location }
        </div>
        ${ show.description ? `<div class="live-show__description">${ show.description }</div>` : ''}
        ${ show.link ? `
            <a href="${ show.link }" target="_blank" rel="noopener">
                ${ show.linkIsFacebook ? 'Facebook Event' : 'Website' }
            </a>
        ` : ''}
</li>`).join('')
    },
    'next-gig': function anonymous(ctx) {
        return ` Nächster Auftritt: ${ctx.show.title}, ${ctx.show.dateFriendly}`
    }
}
function renderTemplate(name, context){
    return templates[name](context)
}

// helper for date formatting
function formatDate(date) {
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

function initLightbox() {
    if(window.baguetteBox && typeof window.baguetteBox.run === 'function') {
        baguetteBox.run('.live-shows');
    }
}
function refreshGumshoe() {
    if(window.gumshoe  && typeof window.gumshoe.setDistances === 'function') {
        gumshoe.setDistances();
    }
}

function getNormalizedShowData(shows) {
    // get start of today
    var today = new Date()
    today.setHours(0)
    today.setMinutes(0)
    today.setSeconds(0)
    today.setMilliseconds(0)

    var upcoming = []
    var past = []
    shows.forEach(function(show){
        var normalized = JSON.parse(JSON.stringify(show))
        normalized.date = new Date(show.date)
        normalized.dateFriendly = formatDate(normalized.date)
        normalized.linkIsFacebook = show.link && show.link.match(/^(?:https?\:\/\/)?(?:www\.)?facebook\.com\/events\/\d{10,20}\/?$/)
        if(normalized.date >= today) {
            upcoming.push(normalized)
        } else {
            past.push(normalized)
        }
    })

    return {
        upcoming: upcoming.reverse(),
        past: past,
    }
}

function injectShows(showData) {

    // separate shows into upcomming and past
    var shows = getNormalizedShowData(showData)

    // render upcomming shows
    if(shows.upcoming.length) {
        var upcommingEl = document.querySelector("[data-live-upcomming]")
        upcommingEl.innerHTML = renderTemplate("showlist", {shows: shows.upcoming})
        initLightbox()
        refreshGumshoe()

        var nextGigEl = document.querySelector("[data-live-next-link]")
        if(nextGigEl) {
            nextGigEl.innerHTML = renderTemplate("next-gig", {show: shows.upcoming[0]})
        }

    } else {
        var emptyText = document.querySelector("[data-live-upcomming-empty]")
        if(emptyText) {
            emptyText.style.display = "block"
        }
    }

    // render past shows
    var pastEl = document.querySelector("[data-live-past]")
    if(pastEl) {
        var pastMax = pastEl.dataset.liveMax
        var pastShows = shows.past
        if(pastMax) {
            pastShows = pastShows.slice(0, parseInt(pastMax, 10))
        }
        pastEl.innerHTML = renderTemplate("showlist", {shows: pastShows})
    }
}


(function(){
    // load JSON with show data
    fetch("/shows.json")
    .then(function(response){
        return response.json()
    })
    .then(function(shows){
        injectShows(shows)
        initLightbox()
        refreshGumshoe()
    })
})()
