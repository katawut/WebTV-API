var config = new Object;

/**
 * Allow origin to access resouces
 * กำหนด domain ที่อนุญาตให้ access resource ได้
 */
config.cors = {
    whitelist: ['']
}

/**
 * Staging MySQL Database configuration
 */
config.STAGING_MYSQL_CONNECTION_POOL = {
    connectionLimit: 100,
    host: '127.0.0.1',
    port: 3306,
    user: '',
    password: '',
    database: ''
}

/**
 * Redis master server (for ADD, DELETE, UPDATE data)
 */
config.REDIS_MASTER = {
    host: '192.168.0.111',
    port: 6382
}

/**
 * Redis slave server (for READ data only)
 */
config.REDIS_SLAVE = {
    host: '127.0.0.1',
    port: 6382
}

config.REDIS_PREFIX_KEY = 'WEBTVAPI';

config.REDIS_DEFAULT_EXPIRED = 32000 // หน่วยเป็นวินาที

/**
 * Error message template to use in app.
 */
config.errorMessage = {
    mysqlConnection: 'MySQL connection Error - ',
    mysqlQuery: 'MySQL Query Error - ',
    internalError: 'Internal error, please check log.'
}

/**
 * message template to use in app.
 */
config.appMessage = {
    dataSource: {
        mysql: 'mysql',
        redis: 'redis'
    }
}

/**
 * data response template
 * 
 * @param {number} responseCode - HTTP response code
 * @param {string} responseStatus - App status
 * @param {*} responseDescription - more response information
 * @param {object} data - response data. use NULL if no data response
 */
config.response = (responseCode, responseStatus, responseDescription, data) => {
    
    return {
        header: {
            res_code: responseCode,
            res_status: responseStatus,
            res_desc: responseDescription
        },
        body: data
    }
}


module.exports = config;