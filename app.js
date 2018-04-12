//load environment variable from files
require('dotenv').load();

const express = require('express');
const fs = require('fs');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const uglifyEs = require('uglify-es');

//connect to mongodb and register database models
//require('./app_api/models/db');
//register authentication strategy
//require('./app_api/config/passport');

//minify client-side javascript files
try {
    const appClientFiles = [
        //fs.readFileSync('public/app_client/app.js', 'utf8'),
    ];

    const uglified = uglifyEs.minify(appClientFiles, {compress: false});
    //fs.writeFileSync('public/angular/instaApp.min.js', uglified.code);
} catch(e) {
    console.log(e);
    process.exit(1);
}


const app = express();

app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

//app.use(passport.initialize());

//const routesApi = require('./app_api/routes/index');
//app.use('/api', routesApi);

//if none of the routes matched, forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//Error handler
app.use((err, req, res, next) => {
    const s = err.status || 500
    res.status(s).json({
        message: err.message,
        status: s,
        error: app.get('env') === 'development' ? err.stack : ''
    });
});


const https = require('https');
let options;
try {
    options = {
        key: fs.readFileSync(path.join(__dirname, 'ssl', 'instagram.pem')),
        cert: fs.readFileSync(path.join(__dirname, 'ssl', 'instagram.crt'))
    };
} catch(e) {
    console.log(e);
    process.exit(1);
}

app.set('port', process.env.PORT || 3001);
https.createServer(options, app).listen(app.get('port'), () => {
    console.log(app.get('env'));
    console.log('instagram server is running on port ' + app.get('port'));
});

