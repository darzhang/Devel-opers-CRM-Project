const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    eventName: {
        type: String
    },
    dateTime: {
        type: Date
    },
    description: {
        type: String
    },
    location: {
        type: String
    },
    participants: {
        type: Array,
        default: void 0
    },
    dateAdded: {
        type: Date
    }
}, { versionKey: false , timestamps: false });

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;