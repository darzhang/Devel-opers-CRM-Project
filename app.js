const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())  

require('./models')

// set up author routes
// const authorRouter = require('./routes/authorRouter')

// handler for GET home page
app.get('/', (req, res) => {
    res.send('<h1>Personal CRM</h1>')
})

// handler for author-management requests
// author routes are added onto the end of '/author-management'
// app.use('/author-management', authorRouter)

app.listen(3000, () => {
    console.log('The personal CRM app is listening on port 3000!')
})