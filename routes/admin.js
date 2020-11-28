const { response } = require('express');
var express = require('express');

const adminHelpers= require('../helpers/admin-helpers')
var router = express.Router();
/* GET users listing. */
router.get('/',function(req, res) {
  let admin=req.session.admin
  console.log(admin)
  res.render('admin/login',{admin:true})
  
});
router.get('/admin/login',(req,res)=>{
  if(req.session.admin){
    res.redirect('/homepage')
  }else{
    res.render('/admin',{"LoginErr":req.session.LoginErr})
    req.session.userloginErr=false
  }  
})
router.post('/login',(req,res)=>{
  adminHelpers.doLogin(req.body).then((response)=>{
    
    if(response.status){
      req.session.loggedIn=true
      req.session.admin=response.admin
      res.redirect('/admin/homepage')
    }else{
      req.session.userloginErr=true
      res.redirect('/admin')
    }
  })
  })
  router.get('/homepage',(req,res)=>{
    res.render('admin/homepage',{admin:req.session.admin})
  })
  router.get('/totalhotals',(req,res)=>{
    res.render('admin/totalhotals',{admin:req.session.admin})

  })
  router.get('/totalusers',(req,res)=>{
    res.render('admin/totalusers',{admin:req.session.admin})
  })
  router.get('/logout',(req,res)=>{
    req.session.userloggedIn=false
    req.session.user=null
    res.redirect('/admin')
  })
  
module.exports = router;