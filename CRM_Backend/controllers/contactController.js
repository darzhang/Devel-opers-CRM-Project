// import contact model
const Contact = require('../models/contact');

// turn string into objectId
const objectId = require('mongodb').ObjectID;

// get all contacts
const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().lean();
        return res.send(contacts);
    } catch (err) { // error occured
        res.status(400);
        return res.send("Database query failed");
    }
};

// find one contact by their id
const getOneContact = async (req, res) => {
    try {
        const oneContact = await Contact.findOne({"_id": req.params.id}).lean();
        if (oneContact === null) {  // no contact found in database
            res.status(404);
            return res.send("Contact not found");
        }
        return res.send(oneContact);
    } catch (err) { // error occured
        res.status(400);
        return res.send("Database query failed");
    }
};

// add a contact (POST)
const createContact = async (req, res) => {
    const contact = new Contact(req.body);

    try { // save the new contact to the database
        let result = await contact.save();
        return res.send(result);
    } catch (err) { // error occured
        res.status(400);
        return res.send("Database insert failed");
    }
};

// update a contact (POST)
const editContact = async (req, res) => {
    const newContact = req.body; // construct changed Contact object from body of POST

    try {
        const contact = await Contact.findOne({"_id": req.body._id});
        if (!contact) { // if contact is not already in database, return an error
            res.status(400);
            return res.send("Contact not found in database");
        }

        Object.assign(contact, newContact); // replace properties that are listed in the POST body
        let result = await contact.save();  // save update contact to database
        return res.send(result);            // return saved contact to sender
    } catch (err) { // error detected
        res.status(400);
        return res.send("Database update failed");
    }
};

// delete a contact (DELETE)
const deleteContact = async (req, res) => {
    try { // delete contact based on the given id
        const id = req.params.id;
        await Contact.deleteOne({"_id": objectId(id)}, (err, result) => {});
        return res.send("Contact successfully deleted");
    } catch (err) { // error detected
        res.status(400);
        return res.send("Database delete failed");
    }
};

module.exports = {
    getOneContact, getAllContacts, createContact, editContact, deleteContact
};