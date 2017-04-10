var mongoose = require('mongoose');
var express = require('express');
var morgan = require('morgan');
var cors = require('cors');
var config = require('./config/database');
var passport = require('passport');
var routes = require('./routes/routes');
var bodyParser = require('body-parser');

var port = process.env.PORT || 3333;

//Db connection
mongoose.connect(config.database);
mongoose.connection.on('open', function() {

    console.log('mongo is open');
    var app= express();
    app.use(cors());
    app.use(morgan('dev'));
    
    //Use bodyparser
    app.use(bodyParser.urlencoded({extended: false}));
    
    app.use(bodyParser.json());
    //Use routes
    app.use(routes);
    
    //Initialize passport
    app.use(passport.initialize());
    require('./config/passport')(passport);

    app.listen(port, function(err){
        console.log('Server is running on port: ' + port);

    });
});

