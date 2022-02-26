const express = require("express")
const app = express()
const expressLayouts = require('express-ejs-layouts')
const PORT = 4000
const axios = require('axios')

//middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

app.use(expressLayouts)
app.set('layout', './layouts/main')
app.set('view engine', 'ejs')


app.get('/', (req, res) => {
    res.render('index')
    axios.get('https://www.metaweather.com/api/location/44418')
    .then(res => console.log(res.data.consolidated_weather))
    .catch(err => console.log(err))
})
// const routes = require('./routes/routes.js')
// app.use('/', routes)

app.listen(PORT, () => {
    console.log(`Express is running on port ${PORT}`)
})