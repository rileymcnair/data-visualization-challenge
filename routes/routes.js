const express = require('express')

const router = express.Router()

const axios = require('axios')


function cToF(celsius) {
    return Math.round(celsius * 9 / 5 + 32);
}
  

class WeatherData {
    constructor(current, days) {
        this.current = current
        this.days = days
    }
    *getTemp() {
        return this.current.temp
    }
  
    week(startDay) {
        return this.days.splice(startDay, startDay + 7)
    }
}
var weatherState = new WeatherData()
axios.get('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/los%20angeles?unitGroup=metric&include=days%2Ccurrent&key=HZB6V4P3UHRCK3L6K84WKYPHS&contentType=json')
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


//update weather data on every render
// router.get('*', (req,res, next) => {
//     axios.get('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/los%20angeles?unitGroup=metric&include=days%2Ccurrent&key=HZB6V4P3UHRCK3L6K84WKYPHS&contentType=json')
//     .then( apires => {
//         const current = apires.data.currentConditions
//         const currentTemp = current.temp
//         const currentWindSpeed = current.windspeed
//         const currentCondition = current.conditions
//         const currentHumidity = current.humidity
//         const days = apires.data.days // list of daily forecasts
//         weatherState = new WeatherData(current, days)
//         next()
//     })
//     .catch(err => {
//         console.log(err)
//         res.sendStatus(400)
//     })
// })

router.get('/', (req,res) => {
    const weekWeather = weatherState.week(0)
    console.log('printing weather for the week')
    console.log(weekWeather)
    const current = weatherState.current
    console.log(`current temp is: ${current.temp}`)
    res.render('index', {
        current: current, 
        weekWeather: weekWeather,
        cToF: cToF //celsius to fahrenheit function
    })
})

router.get('/week/:id', (req,res)=> {
    const week = req.params.id
    console.log(week)
    if(!week){
        console.log('failed')
    }
    res.render('index',{temp: 10} )
})

router.get('/day/:id', (req,res)=> {
    const day = req.params.id
    console.log(day)
    if(!day){
        console.log('failed')
    }
    res.render('index',{temp: 20} )
})


module.exports = router

