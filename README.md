**The University of Melbourne**
# COMP30022 - IT Project

Welcome to DEVEL-opers CRM project

## Table of contents
* [Team Members](#team-members)
* [General Info](#general-info)
* [Technologies](#technologies)
* [Implementation](#implementation)

## Team Members

| Name | Student ID | Task | Email |
| :---         |     :---:      |     :---:      | :---: |
| Erdinan Angkajaya | 1086206 | Back End, Front End, README Format  | angkajayae@student.unimelb.edu.au |
| Edward Chen | 1086210 | Back End, Front End, UI Design  |  edchen@student.unimelb.edu.au |
| Lesley Laisina  | 1086234 | Back End, Front End, UI Design |  llaisina@student.unimelb.edu.au |
| Darren Zhang  | 1086273 | Back End, Front End, UI Design  | darzhang@student.unimelb.edu.au |
| Vincent Anderson Hartono | 1086226 | Back End, Front End, UI Design  | vhartono@student.unimelb.edu.au |

## General Info

In this project, we are building a CRM WebApp. The main purpose of this CRM is to store contact and the information about the contact. The information can 
include email, contact number, department, organisation, and description. In addition, it can also store events which acts similar to a to-do-list for the user.

This repository includes 2 main sub-directory, crm_frontend for frontend, and crm_backend for backend. 


## Technologies
In this project we are building a WebApp.

1. Database : MongoDB v.5.13.7
2. Server : Express v.4.17.1, Node JS v.14.18.0
3. Front End : React v.17.0.2
4. Deployment : Heroku
* https://developer-crm-frontend.herokuapp.com/
5. Documentation : Confluence
* https://devel-opers.atlassian.net/wiki/spaces/FILES/pages/131465/Team+Document
6. Task Management : Jira
* https://devel-opers.atlassian.net/jira/software/projects/PC/boards/1


## Implementation

### Login Page

### Home Page

### Contact Page

### Event Page

### Calendar Page

### Organisation Page
This page contains information about Organisation.

* Organisation contains the following attributes : 

| Attribute | Data type | Description |
| :---|:---:| :---:|
| orgName | String | The name of the organisation  |
| nameLower | String | The name of the organisation with all lower case character  |
| size | Integer | NUmber of contact in the specific organisation  |
| createdBy | MongoDb ObjectID | The userID that created this organisation  |

* Organisation have the following functionality :

| Functionality | Description |
| :---| :---:|
| Search | Search organisation by the name  |
| Sort | Sort the organisation based on the selected field  |
| Filter | Filter the organisation based on the selected field  |
| Export | Export data about the organisations to a csv file  |