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
    var compiledTemplates = {
        'showlist': function anonymous(it) {
            var out='';var arr1=it.shows;if(arr1){var show,index=-1,l1=arr1.length-1;while(index<l1){show=arr1[index+=1];out+=' <li class=\"live-show\"> ';if(show.flyer){out+=' <a href=\"'+(show.flyer)+'\" target=\"_blank\" rel=\"noopener\" class=\"live-show-flyer\" style=\"background-image: url('+(show.flyer)+');\"> <div class=\"live-show-title\">'+(show.title)+'</div> </a> ';}else{out+=' <div class=\"live-show-title\">'+(show.title)+'</div> ';}out+=' <div class=\"live-show-date-location\"> '+(show.dateFriendly);if(show.time){out+=' ab '+(show.time);}out+=', '+(show.location)+' </div> ';if(show.description){out+=' <div class=\"live-show-description\">'+(show.description)+'</div> ';}out+=' ';if(show.link){out+=' <a href=\"'+(show.link)+'\" target=\"_blank\" rel=\"noopener\"> ';if(show.linkIsFacebook){out+='Facebook Event';}else{out+='Website';}out+=' </a> ';}out+=' </li>';} } return out;
        },
        'next-gig': function anonymous(it) {
            var out=' Nächster Auftritt: '+(it.show.title)+', '+(it.show.dateFriendly);return out;
        }
    }
    // load doT templates
    var templateHolder = function() {
        return new Promise(function(resolve, reject){
            var script = document.createElement('script')
            script.onload = function () {
                return fetch("js/templates/templates.html")
                .then(function(response){
                    return response.text()
                })
                .then(function(tmpl){
                    var div = document.createElement("div")
                    div.innerHTML = tmpl
                    resolve(div)
                })
                .catch(reject)
            };
            script.src = "js/vendor/doT.min.js"
            document.head.appendChild(script)
        })
    }
    var getTemplate = function(name){
        var isProduction = location.hostname === 'subchor.at'
        if(isProduction && name in compiledTemplates) {
            return Promise.resolve(compiledTemplates[name])
        } else {
            return templateHolder().then(function(div){
                    var tmplDOM = div.querySelector("#"+name)
                    var compiled = doT.template(tmplDOM.innerHTML)
                    var asString = compiled.toString()
                    var trimF = function(str) {
                        return str.replace(/\r?\n|\r/g, '').replace(/\s/g,'').replace(/\\/g,'')
                    }
                    if(!(name in compiledTemplates) || trimF(compiledTemplates[name].toString()) !== trimF(asString)) {
                        console.warn("Compiled function for template '" + name + "' needs update:", asString)
                        if(!isProduction) {
                            window.alert('Update template function: ' + name)
                        }
                    }
                    return compiled
                })

        }
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
