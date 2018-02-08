const validator = require('validator');
const statistic = require('./statistic');
const log = require('../../../logging/index');
const config = require('../../../config');
const helpers = require('../../../helper/helper');

const responseData = config.response;

var updateCounter = (req, res) => {
    
    if (helpers.isEmptyObject(req.body)) {
        return res.status(400).json(responseData(400, 'fail', 'no request object', null));
    }

    // TODO: เช็ค req.body.id ว่าถูกต้องไหม

    var counterFields = []; // ใส่ชื่อตอลัมน์ที่ต้องการจะอัพเดท

    if (req.body.type === 'view') {
        counterFields = ['countview'];
    } else if (req.body.type === 'share') {
        counterFields = ['share'];
    } else {
        return res.status(400).json(responseData(400, 'fail', 'wrong request object', null));
    }

    var updateInfo = {
            table: 'channels',
            counterFields,
            idField: 'channel_id',
            id: req.body.id
        }
    
    return statistic.updateCounter(updateInfo)
        .then((result) => {
            return res.json(responseData(200, 'success', null, result));
        })
        .catch((error) => {
            return res.status(500).json(responseData(500, 'fail', {'error': error}, null))
        });

}

var getCounter = (req, res) => {
    
    var section = req.params.section;
    var id = req.params.id;

    // TODO - verify req.params

    return statistic.getCounter(section, id)
        .then((result) => {
            return res.json(responseData(200, 'success', result.dataInfo, result));
        })
        .catch((error) => {
            return res.status(500).json(responseData(500, 'fail', {'error': error}, null))
        });

}

module.exports = {
    updateCounter,
    getCounter
}