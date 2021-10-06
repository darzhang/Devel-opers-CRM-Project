const express = require('express')
const app = express()
var exphbs = require('express-handlebars');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const path = require('path');
const http = require('http');
const passport = require("./passport/setup.js");
const flash = require('connect-flash-plus');
const session = require("express-session");
const jwt = require('jsonwebtoken');
const MongoDBStore = require("connect-mongo");
const schedule = require('node-schedule');
const db = "mongodb+srv://user:P%40ssw0rd!@cluster0.lzade.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const dboptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    dbName: "PersonalCRM"
  };
const cors = require('cors');

// connecting to database
mongoose.connect(db, dboptions).then(
    () => {
      console.log("Connection to the database established");
    },
    err => {
      console.log("Error connecting to database due to: ", err);
    }
  );

  // setting up views
app.engine('hbs', exphbs({
    defaultlayout: 'main',
    extname: 'hbs',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: [
      //  path to your partials
      path.join(__dirname, 'views/partials/'),
    ]
  }))

app.use(express.json())
app.use(cors());

app.use(session({
  secret: "test",
  resave: true,
  saveUnitialized: true,
  expires: new Date(Date.now() + (60 * 60 * 24 * 7 * 1000)),
  cookie: { secure: false,
            httpOnly: false } ,
  store: MongoDBStore.create({mongoUrl: db})
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'hbs');
app.engine('handlebars', exphbs());
app.use(express.static(path.join(__dirname, '/public')));

// setting trust proxy
app.enable('trust proxy');
app.set('trust proxy', true);

const port =  process.env.PORT || 5000

// set up routes
const contactRouter = require('./routes/contactRouter');
const eventRouter = require('./routes/eventRouter');
const departmentRouter = require('./routes/departmentRouter');
const organisationRouter = require('./routes/organisationRouter');
const loginRouter = require('./routes/loginRouter'); 

// handle requests
// the contact routes are added onto the end of '/contact'
app.use('/contact', contactRouter)
app.use('/event', eventRouter)
app.use('/department', departmentRouter)
app.use('/organisation', organisationRouter)
app.use('/', loginRouter)

app.listen(port, () => {
    console.log(`The personal CRM app is listening on port ${port}!`)
})

// handler for GET home page
app.get('/', (req, res) => {
    res.render('login')
    //res.send('<h1>Personal CRM</h1>')
})

//Schedule the email notification for events
const notificationScheduler = require('./notificationScheduler')
const job = schedule.scheduleJob('*/15 * * * * *', notificationScheduler.sendNotifications);


module.exports = app