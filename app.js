const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())  

// set up author routes
const authorRouter = require('./routes/authorRouter')

// handler for GET home page
app.get('/', (req, res) => {
    res.send('<h1>Library System</h1>')
})

// handler for author-management requests
// author routes are added onto the end of '/author-management'
app.use('/author-management', authorRouter)

app.listen(3000, () => {
    console.log('The library app is listening on port 3000!')
})