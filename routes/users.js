const { response } = require('express');
var express = require('express');

const adminHelpers= require('../helpers/admin-helpers')
var router = express.Router();
/* GET users listing. */
router.get('/',function(req, res) {
  res.render('user/view-hoteals',{user})
  
});
router.get('/',(req,res)=>{
  
    res.redirect('/view-hotels')
  
    res.render('/view-hotals')
  
})

module.exports = router;