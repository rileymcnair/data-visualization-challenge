const express = require('express')
const router = express.Router()
const axios = require('axios')
require('dotenv').config();
require('dotenv')

//helper functions
function compareDays(epochNum1, epochNum2) {
    let date1 = new Date(epochNum1*1000)
    let date2 = new Date(epochNum2*1000)
    //same day if the first ten characters match: '2022-03-04'=='2022-03-04'
    return String(date1).split('T')[0].slice(0,11) == String(date2).split('T')[0].slice(0,11)
}
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
        this.daySelection = current
    }
    *getTemp() {
        return this.current.temp
    }
  
    week(weekNum) {
        let startDay = weekNum * 7
        return this.days.slice(startDay, startDay + 7)
    }

}

//for dev testing:
// const {data} = require('../data.js')
// const {current} = require('../data.js')
// const DATA = data()
// const currentData = current()
// var weatherState = new WeatherData(currentData, DATA)



//since using free tier, only update data on start
var weatherState = new WeatherData()
let startDate = getDate(-7)
    let endDate = getDate(13)
    axios.get(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/los%20angeles/${startDate}/${endDate}?unitGroup=metric&include=days%2Ccurrent&key=${process.env.apiKey}&contentType=json`)

    .then( apires => {
        const current = apires.data.currentConditions
        const currentTemp = current.temp
        const currentWindSpeed = current.windspeed
        const currentCondition = current.conditions
        const currentHumidity = current.humidity
        const days = apires.data.days // list of daily forecasts
        weatherState = new WeatherData(current, days)
    })
    .catch(err => {
        console.log(err)
    })


//update weather data on every render if 
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
    weatherState.currWeek = 1
    const weekWeather = weatherState.week(weatherState.currWeek)
    const current = weatherState.current

    res.render('index', {
        current: current, 
        weekWeather: weekWeather,
        cToF: cToF, //celsius to fahrenheit function
        isCurrent: true
    })
})


router.get('/week/:dir', (req,res)=> {
    const direction = req.params.dir
    if (direction=='next' && weatherState.currWeek<2)
        weatherState.currWeek++
    else if (direction == 'prev' && weatherState.currWeek>0)
        weatherState.currWeek--
    
    const weekWeather = weatherState.week(weatherState.currWeek)

    const isCurrent = compareDays(weatherState.current.datetimeEpoch, weekWeather[0].datetimeEpoch)
    const current = weatherState.current
    
    res.render('index', {
        weekWeather: weekWeather,
        current: isCurrent ? current : weekWeather[0],
        cToF: cToF,
        isCurrent: isCurrent
    })
})

router.get('/day/:id', (req,res)=> {
    const day = req.params.id //convert day number to int
    const dayNum = Number(day)
    if(!day){
        console.log('invalid day')
    }
    const weekWeather = weatherState.week(weatherState.currWeek)
    weatherState.daySelection = weekWeather[dayNum]
    
    const isCurrent = compareDays(weatherState.current.datetimeEpoch, weatherState.daySelection.datetimeEpoch)

    res.render('index', {
        current: isCurrent?  weatherState.current : weatherState.daySelection, 
        weekWeather: weekWeather,
        cToF: cToF,
        isCurrent: isCurrent
    })
})


module.exports = router

