var mongoose = require('mongoose');
const dbURI = 'mongodb://localhost/agency_api'
const config = {
    autoIndex: false,
    useNewUrlParser: true,
    useUnifiedTopology: true, 
};

mongoose.connect(dbURI, config);

mongoose.connection.on('connected', function () {
    console.log('Mongoose has been connected to: ' + dbURI);
});
mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose has been disconnected.');
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