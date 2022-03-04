const request = require('supertest')
const express = require('express')
const router = require('./routes/routes.js')
const app = express()
app.use('/', router)

const {cToF, getDate, compareDays } = require('./routes/routes.js')

test('convert celsius to fahrenheit', () => {
    expect(cToF(35)).toBe(95)
})

test('compare two dame dates', () => {
    expect(compareDays(new Date().getTime(), new Date().getTime())).toBe(true)
})

test('compare different days', () => {
    const diffDay = new Date()
    diffDay.setDate(15)
    expect(
        compareDays(
            diffDay, new Date().getTime())).toBe(false)
})

//for some reason keeps throwing error: requires middleware but go an object
test('day request must have id between 0 and 6', function() {
    return request(app)
        .get('/day/7')
        .expect(404)
});

