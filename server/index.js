// index.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 4730;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    var response = {
        "data": [
            {
                "label": 'House in the snow',
                "url": "image_1.jpeg",
                "description": 'House in the snow by Todd Diemer',
                "tags": ["Snow", "House", "Nature", "Architecture", "Norway"]
            },
            {
                "label": 'Polar bear in zoo',
                "url": "image_2.jpeg",
                "description": 'Polar bear by Ross Sokolovski',
                "tags": ["Animals", "Polar Bear", "Bear", "Ice Bear", "Zoo"]
            },
            {
                "label": 'Hills in Leysin, Switzerland',
                "url": "image_3.jpeg",
                "description": 'Hills in Leysin, Switzerland by Olivier Miche',
                "tags": ["Nature", "Forest", "Hills", "Switzerland"]
            },
            {
                "label": 'Atacama desert',
                "url": "image_4.jpeg",
                "description": 'San Pedro de Atacama, Chile by Hailey Kean',
                "tags": ["Nature", "Desert", "Hills", "Chile", "Atacama"]
            }
        ]
    };

    res.json(response);
});


router.post('/login', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    var response = {
        "data": [
            {
                "success": true,
                "user": "John",
                "name": "John Doe"
            }
        ]
    };
    res.json(response);
});

// SERVE STATIC IMAGES
app.use('/static', express.static(__dirname + '/static'));

// ALLOW CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
 app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Server running at port:  ' + port);