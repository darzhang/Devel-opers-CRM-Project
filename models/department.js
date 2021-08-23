const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    departmentName : {
        type : String,
        required : true,
        unique : true
    },
    orgID : {
        type : Schema.Types.ObjectID,
        ref : 'organisation'
    }
});

const Department = mongoose.model("Contact", departmentSchema);

module.exports = Department;