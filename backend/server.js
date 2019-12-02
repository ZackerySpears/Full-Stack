//Mongoose - allows us to set up schemas for the data we store in our MongoDB datebase. We will also set up our datebase connection using Mongoose.
const mongoose = require('mongoose');
//Express - framework for NodeJS. Handles our routing and connection info (port, etc.).
const express = require('express');
//Morgan - Handles logging stuff for databases.
const logger = require('morgan');
//Body-Parser = Makes sure the body of our request is formatted correctly (in the case, we'll use JSON).
const bodyParser = require('body-parser');

//Import the getSecret function for the secrets.js file
const getSecret = require('./secret');

//Import the Mongoose Schema for our data
const Data = require('./DataSchema');

//Constant to hold the port that we are going to use to connect 
const API_PORT = 3001;

//Creat an Express app that will run our Node server and route our request
const app = express();

//Create an Express router which actually handles the routing 
const router = express.Router();

//Mongoose to set up a connection to the database
mongoose.connect(getSecret('dbUrl'), {useNewUrlParser: true, useFindAndModify: false});

//Reference to our database connection
let db = mongoose.connection;

//Use the database connection to print oit an error if one occurs when we try to connect to the database
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//Configure body-parser and morgan 
app.use(bodyParser.urlencoded({extend: false})); //Used for parsing data formatted in tne x-www-form-urlencoded format
app.use(bodyParser.json()); //Used for parsing the data formatted in the JSON format
app.use(logger('dev')); 

//Default rout that will run whenever we first connect to the server 
router.get('/', (req, res) =>{
    res.json({ message: 'HELLO WORLD'});
});

//Route to retrieve data from the database
router.get('/getData', (req, res) => {
    //Use Mongoose to find data with the given schema
    Data.find((error, data) =>{
        console.log(data);

        if (err) {
            return res.json({success: false, error: err});
        }

        return res.json({success: true, data: data});
    });
});

//Route that will put new information in the database
router.post('/postData', (req, res) => {
    //A new instance of the Mongoose Schema which we will send to the database
    let newData = new Data();

    //Pull the ID and message from the body of the request 
    const { id, message } = req.body;

    //If ID does not have a value and is equal to 0 or message doesn't have a value, return an error
    if ((!id && id !== 0) || !message) {
        return res.json({
            success: false,
            error: 'INVALID INPUT'
        })
    }

    newData.id = id;
    newData.message = message;

    new.save(err => {
        if (err) {
            return res.json({ success: false, error: err });
        }

        return res.json({ success: true});
    });
});

//Route to delete a given object from our database
router.delete('/deleteData', (req, res) => {
    Data.deleteOne({id: req.body.id }, err => {
        if (err) {
            return res.json({ success: false, error: err});
        } else {
            return res.json({success: true});
        }
    }); 
});

//Tell Express to use a certain path and to use the router we set up 
app.use('/api', router);

//Tell Express to listen for requests on the appropriate port
app.listen(API_PORT, () => console.log('LISTENING ON PORT' + API_PORT));