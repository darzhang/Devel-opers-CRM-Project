const express = require("express");
const app = express();
var exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const http = require("http");
const passport = require("./passport/setup.js");
const flash = require("connect-flash-plus");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const MongoDBStore = require("connect-mongo");
require("dotenv").config();
const schedule = require("node-schedule");
const CONNECTION_STRING =
  "mongodb+srv://user:<password>@it-project-21.eqnjhqf.mongodb.net/?retryWrites=true&w=majority";
const db = CONNECTION_STRING.replace(
  "user",
  process.env.MONGO_USERNAME
).replace("<password>", process.env.MONGO_PASSWORD);
const dboptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  dbName: "PersonalCRM",
};
const cors = require("cors");

// connecting to database
mongoose.connect(db, dboptions).then(
  () => {
    console.log("Connection to the database established");
  },
  (err) => {
    console.log("Error connecting to database due to: ", err);
  }
);

// setting up views
app.engine(
  "hbs",
  exphbs({
    defaultlayout: "main",
    extname: "hbs",
    layoutsDir: path.join(__dirname, "views/layouts"),
    partialsDir: [
      //  path to your partials
      path.join(__dirname, "views/partials/"),
    ],
  })
);

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.set("trust proxy", 1);
app.use(
  session({
    secret: "testttt",
    resave: false,
    saveUnitialized: false,
    expires: new Date(Date.now() + 1),
    store: MongoDBStore.create({
      mongoUrl: db,
      dbName: "PersonalCRM",
      autoRemove: "native",
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "hbs");
app.engine("handlebars", exphbs());
app.use(express.static(path.join(__dirname, "/public")));

// setting trust proxy
app.enable("trust proxy");
app.set("trust proxy", true);

const port = 8080;

// set up routes
const contactRouter = require("./routes/contactRouter");
const eventRouter = require("./routes/eventRouter");
const departmentRouter = require("./routes/departmentRouter");
const organisationRouter = require("./routes/organisationRouter");
const loginRouter = require("./routes/loginRouter");
const notificationRouter = require("./routes/notificationRouter");

// handle requests
// the contact routes are added onto the end of '/contact'
app.use("/contact", contactRouter);
app.use("/event", eventRouter);
app.use("/department", departmentRouter);
app.use("/organisation", organisationRouter);
app.use("/", loginRouter);
app.use("/notify", notificationRouter);

app.listen(port, () => {
  console.log(`The personal CRM app is listening on port ${port}!`);
});

// handler for GET home page
app.get("/", (req, res) => {
  res.render("login");
  //res.send('<h1>Personal CRM</h1>')
});

// //Schedule the email notification for events
// const notificationController = require('./controllers/notificationController');
// const job = schedule.scheduleJob('*/10 * * * * *', notificationController.periodicCheck);

module.exports = app;
