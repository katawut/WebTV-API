const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const log = require('./logging/index');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const responseTime = require('response-time');

const config = require('./config/index');

const pmx = require('pmx').init({
  http:true,
  errors:true,
  custom_probes:true,
  network:true,
  ports:true
});

const app = express();

/**
 *   # Setup App route
 *   : อิมพอร์ต route ของ App เข้ามา
 */
const {apiRoutes} = require('./routes/index');

/**
 * # Middleware
 */
app.use(logger('combined'));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.use(responseTime());

/**
 * handle CORS
 */
const whitelist = config.cors.whitelist;

// ถ้ายังอยู่ในช่วง Development process ให้เซ็ต origin เป็น '*'
// ถ้าขึ้น production แล้วให้แก้เป็นฟังชั่นตามด้านล่าง แล้วใส่ domain ที่ไฟล์ config
var corsOptions = {
    // origin: function (origin, callback) {
    //   if (whitelist.indexOf(origin) !== -1) {
    //     callback(null, true)
    //   } else {
    //     callback(new Error('Not allowed by CORS'))
    //   }
    // }
    origin: '*'
}
app.use(cors(corsOptions));
app.use(function (err, req, res, next) {
    if (err) {
        res.status(403).send(err);
    }
})


/**
 *   # API Routes
 *   : เรียกใช้ API route
 */
app.use('/v1', apiRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
app.use(function(err, req, res, next) {

    res.status(err.status || 500);

    var header = {};
    header.res_code = err.status;
    header.res_desc = err.message;

    var data = {};
    data.header = header;
    data.body = "";

    res.writeHead(err.status, {"Content-Type": "application/json; charset=UTF-8"});
    res.write( JSON.stringify(data) );
    res.end();

});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
log.info(err.stack);
res.status(err.status || 500);

var header = {};
header.res_code = res.statusCode;
header.res_desc = err.message;

var data = {};
data.header = header;
data.body = "";

res.writeHead(res.statusCode, {"Content-Type": "application/json; charset=UTF-8"});
res.write( JSON.stringify(data) );
res.end();

});

module.exports = app;