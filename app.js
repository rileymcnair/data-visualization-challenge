const express = require("express")
const app = express()
const PORT = 3030

//middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/favicon.ico', express.static('images/favicon.ico'));
app.use(express.static('public'))

app.set('view engine', 'ejs')

const routes = require('./routes/routes')
app.use('/', routes)

app.listen(PORT, () => {
    console.log(`Express is running on port ${PORT}`)
})