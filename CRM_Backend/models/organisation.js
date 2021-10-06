const mongoose = require('mongoose');

const organisationSchema = new mongoose.Schema({
    orgName : {
        type : String,
        required : true,
        unique : true
    },
    nameLower : {
        type: String,
        required : true,
        unique : true
    },
    size : {
        type: Number
    },
    createdBy : {
        type: mongoose.Schema.Types.ObjectId
    }
});

const Organisation = mongoose.model("Organisation", organisationSchema);


module.exports = Organisation;