var express = require('express');
var actions = require('../methods/actions');

var router = express.Router();

router.post('authapi/authenticate', actions.authenticate);
router.post('authapi/adduser', actions.addNew);
router.get('authapi/getinfo', actions.getinfo);



module.exports = router;
