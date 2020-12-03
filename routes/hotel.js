const { response } = require('express');
var express = require('express');
var router = express.Router();
const hotelHelpers= require('../helpers/hotel-helpers')
const verifyLogin=(req,res,next)=>{
  if(req.session.hotelloggedIn){
    next()
  }else{
    res.redirect('/hotel/login')
  }
}
/* GET home page. */
router.get('/',function(req, res, next) {
  if(req.session.hotelloggedIn){
    let hotel=req.session.hotel
  res.render('hotel/homepage',{hotel:true})}
  else{
    res.render('hotel/login',{"LoginErr":req.session.hotelloginErr})
  req.session.hotelloginErr=false
  }
  
})
router.get('/login',(req,res)=>{
  if(req.session.hotelloginErr){
    res.redirect('hotel/login')
  }else{
    res.render('/hotel',{"loginErr":req.session.hotelloginErr})
    req.session.hotelloginErr=false
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
    req.session.hotelloggedIn=false
    hotelHelpers.doLogin(req.body).then((response)=>{
      
      if(response.loginStatus){
        req.session.hotelloggedIn=true
        req.session.hotel=response.hotel
        res.redirect('/hotel')
      }else{
        res.redirect('/hotel/login')
        req.session.LoginErr=true
      }
        
      
    })
    })
router.get('/logout',(req,res)=>{
  req.session.hotelloggedIn=false
  req.session.hotel=null
  res.redirect('/hotel')
})
router.get('/homepage',(req,res)=>{
  res.render('hotel/homepage')
})
router.get('/view-profile',async(req,res)=>{
  if(req.session.hotelloggedIn){ 
  let hotel=req.session.hotel
  // let profile=await userHelper.getUserProfile(req.session.hotel._id)
  // console.log(hotel)
  // console.log(req.session.hotel._id)
  res.render('hotel/view-profile',{hotel:true})
  console.log(hotel);
  }
})
module.exports = router;