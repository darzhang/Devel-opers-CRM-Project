const express = require('express')
const app = express()
app.use(express.json())
const port =  process.env.PORT || 3000

require('./models')

// set up contact routes
const contactRouter = require('./routes/contactRouter');
const eventRouter = require('./routes/eventRouter');

// handler for GET home page
app.get('/', (req, res) => {
    res.send('<h1>Personal CRM</h1>')
})

// handle requests
// the contact routes are added onto the end of '/contact'
app.use('/contact', contactRouter)
app.use('/event', eventRouter)

app.listen(port, () => {
    console.log(`The personal CRM app is listening on port ${port}!`)
})

module.exports = app