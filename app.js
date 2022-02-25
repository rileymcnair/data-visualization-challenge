const express = require("express")
const app = express()
const PORT = 4000

//middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + 'public'))


const routes = require('./routes/index.js')


app.listen(PORT, () => {
    console.log(`Express is running on port ${PORT}`)
})