const mongoose = require('mongoose');

const organisationSchema = new mongoose.Schema({
    orgName : {
        type : String,
        required : true,
        unique : true
    }
});

const Organisation = mongoose.model("Contact", organisationSchema);

module.exports = Organisation;