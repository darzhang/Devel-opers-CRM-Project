const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    contactName: {
        type: String,
        required: true
    },
    phoneNumbers: {
        type: Object,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    positionId: {
        type: Number
    },
    departmentId: {
        type: Number
    },
    organisationId: {
        type: Number
    },
    description: {
        type: String
    }
}, { versionKey: false , timestamps: false });

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;