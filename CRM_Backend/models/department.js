const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    departmentName : {
        type : String,
        required : true,
        unique : true
    },
    orgID : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'organisation'
    }
});

const Department = mongoose.model("Department", departmentSchema);

module.exports = Department;