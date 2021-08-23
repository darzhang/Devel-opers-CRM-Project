const express = require('express');
const departmentRouter = express.Router();

// require the department controller
var departmentController = require('../controllers/departmentController');

//GET request to get one department
departmentRouter.get('/department/:id', departmentController.getOne)

//GET request to get all department
departmentRouter.get('/department/all', departmentController.getAll)

//POST request to create a new department
departmentRouter.post('/department/create', departmentController.createOne)

//POST request to delete a department
departmentRouter.post('/department/delete/:id', departmentController.deleteOne)

// export the router
module.exports = departmentRouter;