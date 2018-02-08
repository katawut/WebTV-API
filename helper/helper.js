const config = require('../config/index');
var helpers = new Object;
const base64 = require('base-64');

/**
 * setLogName - ตั้งชื่อหัวข้อสำหรับ log ที่ใช้ใน log file
 * @param {String} method - HTTP Method
 * @param {String} path - request route URL
 * @param {Object} data - request data
 * @returns {String} log name pattern
 */
helpers.setLogName = (method, path, data) => {
    var requestData = [];
    requestData = Object.getOwnPropertyNames(data);
    var stringReqData = extractRequestData(requestData, data);

    return `[${method} - ${path.replace('//','\//')} - ${stringReqData}] `;
}

/**
 * generateCacheKey - สร้าง keyname สำหรับใช้กับ caching system
 * @param {String} path - request route URL
 * @param {Object} data - request data
 * @returns {String} cache key pattern
 */
helpers.generateCacheKey = (path, data) => {
    var requestData = [];

    requestData = Object.getOwnPropertyNames(data);

    var cachePrefix = base64.encode(config.REDIS_PREFIX_KEY);
    var cachePath = base64.encode(path);
    var stringReqData = base64.encode(extractRequestData(requestData, data));

    return `${cachePrefix}.${cachePath}.${stringReqData}`;

}

/**
 * extractRequestData - แยก request data ออกแล้วประกอบมาเป็น string
 * @param {Array} probs 
 * @param {Object} data
 * @returns {String} request data string
 */
function extractRequestData(probs, data) {
    var stringReqData = '';

    if (probs.length !== 0) {
        probs.map((prop) => {
            stringReqData += prop + ':' + data[prop] + '|';
        });
        return stringReqData;
    }

    return stringReqData;
}

helpers.isEmptyObject = (obj) => {
    return !Object.keys(obj).length;
}

module.exports = helpers;