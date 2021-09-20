const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    eventName: {
        type: String,
        required: true
    },
    dateTime: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    participants: {
        type: Array,
        required: true,
        default: void 0
    },
    dateAdded: {
        type: Date,
        required: true
    }
}, { versionKey: false , timestamps: false });

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;