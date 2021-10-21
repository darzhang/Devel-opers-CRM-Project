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
This page contains information about Home.

* Home have the following functionality :

| Functionality | Description |
| :---| :---:|
| Activity Graph | View all Events in the next 7 days   |
| Graph Tooltip | View specific day with total number of Events  |
| Upcoming Events | View the next 4 Upcoming Events  |
| View | Redirect user to the specific Event Page  |
| Recently Added | View the last 4 Recently Added Contacts  |
| Profile | Redirect user to the specific Contact Page  |

### Contact Page
This page contains information about Contact.

* Contact contains the following attributes :

| Attribute | Data type | Description |
| :---|:---:| :---:|
| contactName | String | The name of the contact  |
| phoneNumbers | Object | The phone numbers of the contact, which are divided into mobile, work, and home  |
| email | String | The email address of the contact  |
| label | String | The label used to refer to a contact  |
| departmentId | MongoDb ObjectID | The department ID based on the department of the contact  |
| organisationId | MongoDb ObjectID | The organisation ID based on the department of the contact  |
| description | String | The description which describes the contact  |
| dateCreated | String | The date when the contact was created  |
| userId | MongoDb ObjectID | The ID of the user that created the contact  |

* Contact have the following functionality :

| Functionality | Description |
| :---| :---:|
| Filter | Filter the contact based on the selected field  |
| Sort | Sort the contact based on the selected field  |
| Export | Export data about the contacts to a csv file  |
| Add | Create a new contact based on the inputs  |
| Edit | Edit a contact based on the inputs  |
| Delete | Delete a contact based on the inputs  |

### Event Page
This page contains information about Event.

* Event contains the following attributes : 

| Attribute | Data type | Description |
| :---|:---:| :---:|
| eventName | String | The name of the event  |
| startTime | Date | The start date & time of the event  |
| endTime | Date | The end date & time of the event  |
| description | String | The description of the event  |
| location | String | The location of the event  |
| participants | Array | The array of participant's IDs (from contact)  |
| dateAddedd | Date | The date & time of the creation of event  |
| timezone | String | The timezone where the event is created (local browser's timezone)  |
| isEmailed | Boolean | The truth value of whether the event has been notified to the user  |
| userId | MongoDb ObjectID | The userId that creates the event  |

* Event have the following functionality :

| Functionality | Description |
| :---| :---:|
| Filter | Filter the event based on the selected field  |
| Sort | Sort the event based on the selected field  |
| Export | Export data about the event to a csv file  |
| Notification | Notify the user for upcoming event 24 hours prior to the start of the event through email  |
| Add | Create a new event based on the inputs  |
| Edit | Edit a event based on the inputs  |
| Delete | Delete a event based on the inputs  |

### Calendar Page
This page contains information about the Calendar.

* Calendar have the following functionality :

| Functionality | Description |
| :---| :---:|
| Month | View all Events in the current month  |
| Week | View all Events in the current week  |
| Day | View all Events in the current day  |
| Agenda | View Events as an Agenda  |
| Next/Back | Change months of current viewing session  |
| onClick | Redirect user to the specific Event page after double-clicking on the specific Event  |

### Organisation Page
This page contains information about Organisation.

* Organisation contains the following attributes : 

| Attribute | Data type | Description |
| :---|:---:| :---:|
| orgName | String | The name of the organisation  |
| nameLower | String | The name of the organisation with all lower case character  |
| size | Integer | Number of contact in the specific organisation  |
| createdBy | MongoDb ObjectID | The userID that created this organisation  |

* Organisation have the following functionality :

| Functionality | Description |
| :---| :---:|
| Search | Search organisation by the name  |
| Sort | Sort the organisation based on the selected field  |
| Filter | Filter the organisation based on the selected field  |
| Export | Export data about the organisations to a csv file  |
