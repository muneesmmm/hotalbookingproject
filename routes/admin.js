const { response } = require('express');
var express = require('express');
var router = express.Router();
const adminHelpers = require('../helpers/admin-helpers')
const verifyLogin = (req, res, next) => {
  if (req.session.loggedIn) {
    next()
  } else {
    res.redirect('/admin/login')
  }
}
/* GET users listing. */
router.get('/', function (req, res, next) {
  let admin = req.session.admin
  if (req.session.loggedIn) {
    res.render('admin/homepage', { admin })
  } else {
    res.render('admin/login', { "LoginErr": req.session.LoginErr })
    req.session.LoginErr =false
  }
});
router.post('/login', (req, res) => {
  req.session.loggedIn = false
  adminHelpers.doLogin(req.body).then((response) => {

    if (response.status) {
      req.session.loggedIn = true
      req.session.admin = response.admin
      res.redirect('/admin')
    } else {
      req.session.LoginErr = true
      res.redirect('/admin')
      
    }


  })
})
// router.get('/login',(req,res)=>{

//   if(req.session.LoginErr){
//     console.log("bvvbv",LoginErr);
//     res.render('admin/login')

//   }else{
//     res.redirect('/admin')
//     req.session.LoginErr=false
//   }  
// })

router.get('/homepage', (req, res, next) => {


  res.render('admin/homepage', { admin: req.session.admin })

})
router.get('/totalhotals', (req, res) => {
  adminHelpers.getAllHotels().then((hotel) => {
    res.render('admin/totalhotals', { admin: req.session.admin, hotel })
  })
})
router.get('/totalusers', (req, res) => {
  res.render('admin/totalusers', { admin: req.session.admin })
})
router.get('/logout', (req, res) => {
  req.session.loggedIn = false
  req.session.user = null
  res.redirect('/admin')
})
router.get('/add-hotel', (req, res) => {
  res.render('admin/add-hotel', { admin: req.session.admin })
})
router.post('/add-hotel', (req, res) => {
  adminHelpers.addHotel(req.body).then((response) => {
    console.log(response)
    console.log(response)
    req.session.admin = response
    req.session.loggedIn = true
    res.redirect('/admin/totalhotals')
  })
  adminHelpers.sendMail(req.body).then((response) => {
    req.session.admin = response
    req.session.loggedIn = true
    res.redirect('/admin/totalhotals')
  })
})  
router.get('/detete-hotel/:id',(req,res)=>{
  let hotel=req.params.id
  console.log(hotel)
  adminHelpers.deleteProduct(hotel).then((response)=>{
    res.redirect('/admin/totalhotals')
  })

})
module.exports = router;