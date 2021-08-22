// import contact model
const Event = require('../models/event');

// turn string into objectId
const objectId = require('mongodb').ObjectID;

// get all future events
const getAllFutureEvents = async (req, res) => {
    try {
        const events = await Event.find({status: "future"}).lean();
        return res.send(events);
    } catch (err) { // error occured
        res.status(400);
        return res.send("Database query failed");
    }
};

// get all past events
const getAllPastEvents = async (req, res) => {
  try {
      const events = await Event.find({status: "past"}).lean();
      return res.send(events);
  } catch (err) { // error occured
      res.status(400);
      return res.send("Database query failed");
  }
};

//get all events (both past and future events)
const getAllEvents = async (req, res) => {
  try {
      const events = await Event.find().lean();
      return res.send(events);
  } catch (err) { // error occured
      res.status(400);
      return res.send("Database query failed");
  }
};

// find one event by their id
const getOneEvent = async (req, res) => {
    try {
        const oneEvent = await Event.findOne({_id: objectId(req.params.id)}).lean();
        if (oneEvent === null) {  // no contact found in database
            res.status(404);
            return res.send("Event not found");
        }
        return res.send(oneEvent);
    } catch (err) { // error occured
        res.status(400);
        return res.send("Database query failed");
    }
};

// create new Event (POST)
const createEvent = async (req, res) => {
    const event = new Event(req.body);

    try { 
        let result = await event.save(); // save the new event to the database
        return res.send(result);
    } catch (err) { // error occured
        res.status(400);
        return res.send("Database insert failed");
    }
};

// update an event (POST)
const editEvent = async (req, res) => {
    const newEvent = req.body; //get the new event from POST body

    try {
        const result = await Event.findOneAndUpdate({_id: objectId(req.params.id)}, req.body); //find the event, and update it with new data 
        if (!result) { // if event is not found in database, returns an error
            res.status(400);
            return res.send("Event not found in database");
        }
        return res.send(result);
    } catch (err) { // error detected
        res.status(400);
        return res.send("Database update failed");
    }
};

// delete an event (DELETE)
const deleteEvent = async (req, res) => {
    try { 
        await Event.findOneAndDelete({_id: objectId(req.params.id)}); // delete event based on the given id
        return res.send("Event is successfully deleted");
    } catch (err) { // error detected
        res.status(400);
        return res.send("Database delete failed");
    }
};

module.exports = {
    getAllFutureEvents, getAllPastEvents, getAllEvents, getOneEvent, createEvent, editEvent, deleteEvent
};