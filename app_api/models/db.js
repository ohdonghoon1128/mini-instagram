const mongoose = require('mongoose');

let dbURI;
if(process.env.NODE_ENV === 'development') {
    dbURI = 'mongodb://localhost/instagram';
} else if(process.env.NODE_ENV === 'production' && process.env.MLAB_URI) {
    dbURI = process.env.MLAB_URI;
} else {
    throw new Error('invalid process.env value');
}

//connect to mongodb
mongoose.connect(dbURI);

mongoose.connection.on('connected', () => {
    console.log('mongoose connected to: ' + dbURI);
});

mongoose.connection.on('disconnected', () => {
    console.log('mongoose disconnected from: ' + dbURI);
});

mongoose.connection.on('error', (err) => {
    console.log('mongoose error: ' + err);
});


process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('app termination');
        process.exit(0);
    });
});

require('./users');
//require('./comments');
require('./photos');
