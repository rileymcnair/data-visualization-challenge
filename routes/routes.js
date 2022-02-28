const express = require('express')

const router = express.Router()

const axios = require('axios')


function cToF(celsius) {
    return Math.round(celsius * 9 / 5 + 32);
}

function getDate(dayOffset) {
    let date = new Date()
    date.setDate(date.getDate() + dayOffset)
    const options = {
        timeZone: 'America/Los_Angeles',
        year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric'
    }
    //LA timezone date in format 'mm/dd/yyyy'
    let tzDate = new Intl.DateTimeFormat('en-US', options).format(date) 
    let mm = tzDate.slice(0,2) 
    let dd = tzDate.slice(3, 5)
    let yyyy = tzDate.slice(6,10)
    return `${yyyy}-${mm}-${dd}` //formats in 'yyyy-mm-dd'
}

class WeatherData {
    constructor(current, days) {
        this.current = current
        this.days = days
        this.currWeek = 1
    }
    *getTemp() {
        return this.current.temp
    }
  
    week(weekNum) {
        let startDay = weekNum * 7
        return this.days.slice(startDay, startDay + 7)
    }

}

const datafunc = require('../data.js')
const DATA = datafunc()
const current = {
    temp: 15
}
var weatherState = new WeatherData(current, DATA)



// var weatherState = new WeatherData()
// let startDate = getDate(-7)
//     let endDate = getDate(13)
//     axios.get(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/los%20angeles/${startDate}/${endDate}?unitGroup=metric&include=days%2Ccurrent&key=HZB6V4P3UHRCK3L6K84WKYPHS&contentType=json`)

//     .then( apires => {
//         const current = apires.data.currentConditions
//         const currentTemp = current.temp
//         const currentWindSpeed = current.windspeed
//         const currentCondition = current.conditions
//         const currentHumidity = current.humidity
//         const days = apires.data.days // list of daily forecasts
//         weatherState = new WeatherData(current, days)
//     })
//     .catch(err => {
//         console.log(err)
//     })


//update weather data on every render
// router.get('*', (req,res, next) => {
//     let startDate = getDate(-7)
//     console.log(`startDate: ${startDate}`)
//     let endDate = getDate(13)
//     axios.get(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/los%20angeles/${startDate}/${endDate}?unitGroup=metric&include=days%2Ccurrent&key=HZB6V4P3UHRCK3L6K84WKYPHS&contentType=json`)
//     .then( apires => {
//         const current = apires.data.currentConditions
//         const currentTemp = current.temp
//         const currentWindSpeed = current.windspeed
//         const currentCondition = current.conditions
//         const currentHumidity = current.humidity
//         const days = apires.data.days // list of daily forecasts
//         //console.log('printing days')
//         //console.log(days)
//         weatherState = new WeatherData(current, days)
//         next()
//     })
//     .catch(err => {
//         console.log(err)
//         res.sendStatus(400)
//     })
// })

router.get('/', (req,res) => {
    console.log(weatherState.days)
    weatherState.currWeek = 1
    const weekWeather = weatherState.week(weatherState.currWeek)
    console.log('printing weather for the week')
    console.log(weekWeather)
    const current = weatherState.current
    //console.log(`current temp is: ${current.temp}`)

    res.render('index', {
        current: current, 
        weekWeather: weekWeather,
        cToF: cToF //celsius to fahrenheit function
    })
})


router.get('/week/:dir', (req,res)=> {
    const direction = req.params.dir
    if (direction=='next' && weatherState.currWeek<2)
        weatherState.currWeek++
    else if (direction == 'prev' && weatherState.currWeek>0)
        weatherState.currWeek--
    // week*7 will give the the day for the start of the week
    //supports two weeks: 0 (current week) and 1 (next week)
    // if week is 0, will give us day 0
    // if week is 1, will give us day 1
    const weekWeather = weatherState.week(weatherState.currWeek)
    // console.log(`weekWeather for week ${weatherState.currWeek}:`)
    // console.log(weekWeather)
    const current = weatherState.current
    res.render('index', {
        weekWeather: weekWeather,
        current: current,
        cToF: cToF
    })
})

router.get('/day/:id', (req,res)=> {
    const day = req.params.id
    console.log(`day is ${day}`)
    if(!day){
        console.log('failed')
    }
    res.render('index',{temp: 20} )
})


module.exports = router

