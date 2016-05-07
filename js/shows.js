(function(){
    // load doT templates
    var fetchTemplate = function(name){
        if(!templates[name]) {
            templates[name] = new Promise(function(resolve, reject){
                fetch("js/templates/"+name+".html")
                .then(function(response){
                    return response.text()
                })
                .then(function(tmpl){
                    resolve(doT.template(tmpl))
                })
            })
        }
        return templates[name]
    }
    var templates = {}
    fetchTemplate("showlist")

    // load JSON with show data
    fetch("shows.json")
    .then(function(response){
        return response.json()
    })
    .then(function(shows){

        // get start of tomorrow - without using Moment.js
        var tomorrow = new Date()
        tomorrow.setHours(0)
        tomorrow.setMinutes(0)
        tomorrow.setSeconds(0)
        tomorrow.setMilliseconds(0)
        tomorrow.setDate(tomorrow.getDate() + 1)

        // separate shows into upcomming and past
        var upcommingShows = []
        var pastShows = []
        var pastEl = document.getElementById("live-past")
        var pastMax = pastEl.dataset.max
        shows.forEach(function(show){
            show.date = new Date(show.date)
            show.dateFriendly = formatDate(show.date)
            if(show.date > tomorrow) {
                upcommingShows.push(show)
            } else if (!pastMax || pastShows.length <= 5){
                pastShows.push(show)
            }
        })
        
        // render upcomming shows
        if(upcommingShows.length) {
            fetchTemplate("upcomming")
            .then(function(tmpl){
                var upcommingEl = document.getElementById("live-upcomming")
                upcommingEl.innerHTML = tmpl({shows: upcommingShows})
            })
            
        }

        // render past shows
        templates.showlist.then(function(tmpl){
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
