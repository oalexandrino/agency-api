var mongoose = require('mongoose');
var dbURI = 'mongodb://localhost/agency_api'
var environment = 'DEV environment';

if (process.env.NODE_ENV === 'production') {
    dbURI = ENV['db_HEROKU_MLAB_URI'];
    environment = 'production environment';
}


const config = {
    autoIndex: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

mongoose.connect(dbURI, config);

mongoose.connection.on('connected', function () {
    console.log('Mongoose has been connected to: ' + dbURI + ' on ' + environment );
});
mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose has been disconnected from ' + environment);
});

var secureMongooseShutdown = function (msg, callback) {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected through ' + msg);
        callback();
    });
};

// For nodemon restarts
process.once('SIGUSR2', function () {
    secureMongooseShutdown('"nodemon restart"', function () {
        process.kill(process.pid, 'SIGUSR2');
    });
});

// For app termination
process.on('SIGINT', function () {
    secureMongooseShutdown('"app termination"', function () {
        process.exit(0);
    });
});

// For Heroku app termination
process.on('SIGTERM', function () {
    secureMongooseShutdown('"Heroku app shutdown"', function () {
        process.exit(0);
    });
});