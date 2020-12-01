const { response } = require('express');
var express = require('express');
var router = express.Router();
const hotelHelpers= require('../helpers/hotel-helpers')

/* GET home page. */
router.get('/',async function(req, res) {
  res.render('hotel/login',{hotel:true})
  
})
router.get('hotel/login',(req,res)=>{
  if(req.session.hotel){
    res.redirect('/hotel')
  }else{
    res.render('/hotel/login',{"loginErr":req.session.hotelloginErr})
    req.session.userloginErr=false
  }  
})
router.get('/signup',(req,res)=>{
  res.render('hotel/signup')
})
router.post('/signup',(req,res)=>{
  hotelHelpers.doSignup(req.body).then((response)=>{
    console.log(response)
    req.session.hotel=response
    req.session.hotelloggedIn=true
    res.redirect('/hotel/homepage')
  })
  })
router.post('/login',(req,res)=>{
  hotelHelpers.doLogin(req.body).then((response)=>{
  if(response.status){
    req.session.hotel=response.hotel
    req.session.hotelloggedIn=true
    res.redirect('/hotel/homepage')
  }else{
    req.session.hotelloginErr=true
    res.redirect('/login')
  }
})
})
router.get('/logout',(req,res)=>{
  req.session.hotelloggedIn=false
  req.session.hotel=null
  res.redirect('/')
})
router.get('/homepage',(req,res)=>{
  res.render('hotel/homepage')
})
module.exports = router;