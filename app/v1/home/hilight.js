/** 
 * hilight
 * จัดการข้อมูลในส่วนของเนื้อหาที่เป็น hilight 
 **/

const mysql = require('mysql');
const config = require('../../../config/index');
const log = require('../../../logging/index');
const helpers = require('../../../helper/helper');
const redisCache = require('../caching/redis');
const base64 = require('base-64');

const mysqlPool = mysql.createPool(config.STAGING_MYSQL_CONNECTION_POOL);
const errorMessge = config.errorMessage;
const appMessage = config.appMessage;
const redisPrefix = config.REDIS_PREFIX_KEY;

// getHilight - ดึงข้อมูลในส่วนของคลิปที่เป็น Hilight
var getHilight = (req) => {
    
    return new Promise((resolve, reject) => {

        var logName = helpers.setLogName(req.method, req.path, req.query);
        var cacheKey = helpers.generateCacheKey(req.path, req.query);

        var data = [];
        var queryLimit = req.query.count ? req.query.count : 13;

        redisCache.get(cacheKey)
            .then((result) => {
                if (result) {
                    data['dataInfo'] = {
                        dataSource: appMessage.dataSource.redis,
                        cacheKey: cacheKey
                    };
                    data.push(JSON.parse(result));
                    resolve(data);

                } else {
                    mysqlPool.getConnection((error, connection) => {

                        if (error) {
                            log.error(logName+' '+errorMessge.mysqlQuery+' '+error);
                            connection.release();
                            reject(error);
                        }

                        var queryString  = `
                        SELECT * 
                        FROM highlight 
                        LIMIT ${queryLimit}`;

                        var query = connection.query(queryString)
                        query
                        .on('error', (err) => {
                            log.error(logName+' '+errorMessge.mysqlQuery+' '+err);
                            connection.release();
                            reject(err);
                        })
                        .on('result', (row) => {
                            connection.pause();
                            data.push(row);
                            connection.resume();
                        })
                        .on('end', () => {
                            connection.release();
                            redisCache.set(cacheKey, 60, JSON.stringify(data));
                            data['dataInfo'] = {
                                dataSource: appMessage.dataSource.mysql,
                                cacheKey: cacheKey
                            };
                            resolve(data);
                        })
                    });
                } 
            })
            .catch((error) => {
                reject(error);
            });

    });
};

var deleteHilight = (req) => {
    return new Promise((resolve, reject) => {
        redisCache.deleteByPath(base64.encode(req.path))
        .then((result) => {
            resolve(result);
        })
        .catch((error) => {
            reject(error);
        })
    });
};

module.exports = {
    getHilight,
    deleteHilight
}