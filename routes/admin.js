const { response } = require('express');
var express = require('express');

const adminHelpers= require('../helpers/admin-helpers')
var router = express.Router();
/* GET users listing. */
router.get('/',function(req, res) {
  let user=req.session.user
  console.log(user)
  res.render('admin/login',{admin:true})
  
});
router.get('/login',(req,res)=>{
  if(req.session.user){
    res.redirect('/homepage')
  }else{
    res.render('admin/login',{"loginErr":req.session.userloginErr})
    req.session.userloginErr=false
  }  
})
router.post('/login',(req,res)=>{
  adminHelpers.doLogin(req.body).then((response)=>{
    
    if(response.user['type']==='admin'){
      console.log(response.user);
      req.session.user=response.user
      req.session.userloggedIn=true
      res.redirect('/admin/homepage')
    }else{
      req.session.userloginErr="invalid username & password"
      res.redirect('/login')
    }
  })
  })
  router.get('/homepage',(req,res)=>{
    res.render('admin/homepage',{admin:true})
  })
  router.get('/totalhotals',(req,res)=>{
    res.render('admin/totalhotals',{admin:true})
  })
  router.get('/totalusers',(req,res)=>{
    res.render('admin/totalusers',{admin:true})
  })
  
  
module.exports = router;