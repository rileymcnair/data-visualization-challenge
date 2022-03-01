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

const {data} = require('../data.js')
const {current} = require('../data.js')
const DATA = data()
const currentData = current()
var weatherState = new WeatherData(currentData, DATA)



// var weatherState = new WeatherData()
// let startDate = getDate(-7)
//     let endDate = getDate(13)
//     axios.get(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/los%20angeles/${startDate}/${endDate}?unitGroup=metric&include=days%2Ccurrent&key=HZB6V4P3UHRCK3L6K84WKYPHS&contentType=json`)

//     .then( apires => {
//         const current = apires.data.currentConditions
//         console.log(current)
//         const currentTemp = current.temp
//         const currentWindSpeed = current.windspeed
//         const currentCondition = current.conditions
//         const currentHumidity = current.humidity
//         const days = apires.data.days // list of daily forecasts
//         console.log(days)
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
    //console.log(weatherState.days)
    weatherState.currWeek = 1
    const weekWeather = weatherState.week(weatherState.currWeek)
    // console.log('printing weather for the week')
    // console.log(weekWeather)
    const current = weatherState.current
    // console.log(`printing current day`)
    // console.log(current)
    const isCurrent = (String(weatherState.current.datetimeEpoch).slice(0,6)==String(weatherState.daySelection.datetimeEpoch).slice(0,6))
    //console.log(isCurrent)
    res.render('index', {
        current: current, 
        weekWeather: weekWeather,
        cToF: cToF, //celsius to fahrenheit function
        isCurrent: isCurrent
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
    const isCurrent = (String(weatherState.current.datetimeEpoch).slice(0,6)==String(weekWeather[0].datetimeEpoch).slice(0,6))
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
    console.log('printing dayselect')
    console.log(weatherState.daySelection)
    let first = String(weatherState.current.datetimeEpoch).slice(0,6)
    console.log(first)
    let second = String(weatherState.daySelection.datetimeEpoch).slice(0,6)
    console.log(second)
    const isCurrent = (first==second)
    console.log('printing current: ')
    console.log(weatherState.current)
    console.log(`day selected is current: ${isCurrent}`)
    res.render('index', {
        current: isCurrent?  weatherState.current : weatherState.daySelection, 
        weekWeather: weekWeather,
        cToF: cToF,
        isCurrent: isCurrent
    })
})


module.exports = router

