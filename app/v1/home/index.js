const validator = require('validator');
const hilight = require('./hilight');
const log = require('../../../logging/index');
const config = require('../../../config');

const responseData = config.response;

var getHilight = (req, res) => {

    if(req.query.count) {
        if (!validator.isNumeric(req.query.count)) {
            return res.status(400).json(responseData(400, 'fail', 'count must be numeric', null));
        }
        if (!validator.isLength(req.query.count, {max: 2})) {
            return res.status(400).json(responseData(400, 'fail', 'request limit exeed.', null));
        }
    }

    return hilight.getHilight(req)
        .then((result) => {
            return res.json(responseData(200, 'success', result.dataInfo, result));
        })
        .catch((error) => {
            return res.status(500).json(responseData(500, 'fail', {'error': error}, null))
        });

}

var deleteHilight = (req, res) => {

    return hilight.deleteHilight(req)
        .then((result) => {
            if (result == 0) {
                return res.json(responseData(204, 'fail', 'no key found or key already deleted.', null));
            }
            return res.json(responseData(200, 'success', 'deleted keys: '+result, null));
        })
        .catch((error) => {
            return res.status(500).json(responseData(500, 'fail', {'error': error}, null))
        });
}

module.exports = {
    getHilight,
    deleteHilight
}