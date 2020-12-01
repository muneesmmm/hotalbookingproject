const { response } = require('express');
var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/',function(req, res) {
  res.render('user/homepage',{user:true})
  
})

module.exports = router;