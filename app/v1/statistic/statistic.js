/** 
 * statistic
 * จัดการข้อมูลสถิติ เช่น ดึงข้อมูล, อัพเดท ยอดวิว ยอดแชร์
 **/

const mysql = require('mysql');
const config = require('../../../config/index');
const log = require('../../../logging/index');
const base64 = require('base-64');

const mysqlPool = mysql.createPool(config.STAGING_MYSQL_CONNECTION_POOL);
const appMessage = config.appMessage;

var updateCounter = (updateInfo) => {
    
    var data = [];

    return new Promise((resolve, reject) => {
        mysqlPool.getConnection((error, connection) => {

            if (error) {
                log.error(`POST /stats/count , error: `+ error);
                connection.release();
                reject(error);
            }

            var fieldsToUpdate = updateInfo.counterFields.map((field) => {
                 return `${field} = ${field} + 1`
            })
            var queryString  = `
                UPDATE ${updateInfo.table} 
                SET ${fieldsToUpdate}
                WHERE ${updateInfo.idField} = ${updateInfo.id} `;

            connection.query(queryString, (error, results, fields) => {
                if (error) {
                    log.error(`POST /stats/count , error: `+ error);
                    connection.release();
                    reject(error);
                }
                connection.release();
                data.push({
                    updated: true
                })
                resolve(data);
            })

        });
    });
}

var getCounter = (section, id) => {

    return new Promise((resolve, reject) => {

        var data = [];

        mysqlPool.getConnection((error, connection) => {

            if (error) {
                log.error(`GET /stats/count/${section}/${id}, error: `+ error);
                connection.release();
                reject(error);
            }

            var queryString  = `
                SELECT channel_id, countview, share
                FROM channels
                WHERE channel_id = ${id}
            `;

            var query = connection.query(queryString)
            query
            .on('error', (err) => {
                log.error(`GET /stats/count/${section}/${id}, error: `+ error);
                connection.release();
                reject(err);
            })
            .on('result', (row) => {
                connection.pause();
                var rowData = {
                    section: section,
                    id: row.channel_id,
                    view: row.countview,
                    share: row.share
                }
                data.push(rowData);
                connection.resume();
            })
            .on('end', () => {
                connection.release();
                data['dataInfo'] = {
                    dataSource: appMessage.dataSource.mysql,
                    cacheKey: 'no cache'
                };
                resolve(data);
            })
        });

    });
}

module.exports = {
    updateCounter,
    getCounter
}