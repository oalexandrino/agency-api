const mongooseConfig = {
    autoIndex: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

class MongoConnection {

    constructor(mongooseObj) {
        this.mongooseObj = mongooseObj;
        this.dbURI = 'mongodb://localhost/agency_api'
        this.environment = 'DEV environment';
        this.secureMongooseShutdown = function (msg, callback) {
            mongooseObj.connection.close(function () {
                console.log('Mongoose disconnected through ' + msg);
                callback();
            });
        };
    }

    start() {
        this.setURI();
        this.mongooseObj.connect(this.dbURI, mongooseConfig);
        this.setUpSignals();
        this.setUpProcessKillers();
    }

    setURI() {

        if (process.env.NODE_ENV === 'production') {
            this.dbURI = process.env.db_HEROKU_MLAB_URI;
            this.environment = 'production environment';
        }
        else {

            this.dbURI = 'mongodb://localhost/agency_api';
            this.environment = 'DEV environment';
        }

    }


    setUpSignals() {

        var dbURI = this.dbURI;
        var environment = this.environment;

        this.mongooseObj.connection.on('connected', function () {
            console.log('Mongoose has been connected to: ' + dbURI + ' on ' + environment );
        });

        this.mongooseObj.connection.on('error', function (err) {
            console.log('Mongoose connection error: ' + err);
        });

        this.mongooseObj.connection.on('disconnected', function () {
            console.log('Mongoose has been disconnected from ' + environment);
        });

    }

    setUpProcessKillers() {
        this.nodemonRestarting();
        this.appTermination();
        this.herokuAppTermination();
    }

    /*
    * For nodemon restarts
    */
    nodemonRestarting() {

        var secureMongooseShutdown = this.secureMongooseShutdown;

        process.once('SIGUSR2', function () {
            secureMongooseShutdown('"Nodemon signal restart: SIGUSR2"', function () {
                process.kill(process.pid, 'SIGUSR2');
            });
        });
    }

    /*
    * For app termination
    */
    appTermination () {

        var secureMongooseShutdown = this.secureMongooseShutdown;

        process.on('SIGINT', function () {
            secureMongooseShutdown('"App signal termination: SIGINT."', function () {
                process.exit(0);
            });
        });
    }

    /*
    * For Heroku app termination
    */
    herokuAppTermination() {

        var secureMongooseShutdown = this.secureMongooseShutdown;

        process.on('SIGTERM', function () {
            secureMongooseShutdown('"Heroku app signal shutdown: SIGTERM."', function () {
                process.exit(0);
            });
        });
    }

};

module.exports = MongoConnection;