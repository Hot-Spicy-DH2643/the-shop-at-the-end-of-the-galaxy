var express = require('express');
var router = express.Router();

/* GET API root */
router.get('/', function(req, res, next) {
  res.json({ 
    message: 'Welcome to The Shop at the End of the Galaxy API',
    version: '1.0.0',
    endpoints: {
      users: '/api/users'
    }
  });
});

module.exports = router;
