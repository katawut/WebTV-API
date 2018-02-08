const express = require('express');
const app = express();

var home = require('../app/v1/home/index');
var statistic = require('../app/v1/statistic/index');

var apiRoutes = express.Router();

apiRoutes.get('/', (req, res) => {
    return res.send('WebTV API');
});

/**
 * Home page
 */
apiRoutes.get('/home/highlight', home.getHilight);
apiRoutes.delete('/home/highlight', home.deleteHilight); // Delete caching

/**
 * Statistic
*/
apiRoutes.get('/stats/count/:section/:id', statistic.getCounter);
apiRoutes.post('/stats/count', statistic.updateCounter);

module.exports = {apiRoutes};