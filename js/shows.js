(function(){
    // load doT templates
    var templateHolder  = new Promise(function(resolve, reject){
        fetch("js/templates/templates.html")
        .then(function(response){
            return response.text()
        })
        .then(function(tmpl){
            var div = document.createElement("div")
            div.innerHTML = tmpl
            resolve(div)
        })
    })
    var getTemplate = function(name){
        return new Promise(function(resolve, reject){
            templateHolder.then(function(div){
                var tmplDOM = div.querySelector("#"+name)
                resolve(doT.template(tmplDOM.innerHTML))
            })
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
        var pastEl = document.getElementById("live-past")
        var pastMax = pastEl.dataset.max
        shows.forEach(function(show){
            show.date = new Date(show.date)
            show.dateFriendly = formatDate(show.date)
            if(show.date >= today) {
                upcommingShows.push(show)
            } else if (!pastMax || pastShows.length <= 5){
                pastShows.push(show)
            }
        })
        
        // render upcomming shows
        if(upcommingShows.length) {
            upcommingShows.reverse()
            getTemplate("upcomming")
            .then(function(tmpl){
                var upcommingEl = document.getElementById("live-upcomming")
                upcommingEl.innerHTML = tmpl({shows: upcommingShows})
            })
            

            getTemplate("next-gig")
            .then(function(tmpl){
                var nextGigEl = document.getElementById("next-gig")
                nextGigEl.innerHTML = tmpl({show: upcommingShows[0]})
            })
        }

        // render past shows
        getTemplate("showlist")
        .then(function(tmpl){
            pastEl.innerHTML = tmpl({shows: pastShows})
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
})()
