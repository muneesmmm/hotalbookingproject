const { response } = require('express');
const express = require('express')
var router = express.Router();
const app = express()
const passport = require('passport');
const userHelpers = require('../helpers/user-helper')

require('../passport-setup');

// For an actual app you should configure this with an experation time, better keys, proxy and secure
// Auth middleware that checks if the user is logged in
const verifylogin = (req, res, next) => {
    if (req.session.loggedIn) {
        next();
    } else {
        res.redirect('/google');
    }
}
// Example protected and unprotected routes
router.get('/', (req, res) =>{
let Guser=req.user
console.log(Guser);
userHelpers.getAllDestination().then((destination)=>{
  res.render('user/homepage',{user:true,destination,Guser})
  })
})
router.get('/failed', (req, res) => res.send('You Failed to log in!'))
// In this route you can see that if the user is logged in u can acess his info in: req.user
router.get('/good', (req, res) =>{
  userHelpers.doLogin(req.user).then((response) => {
    req.session.user=response.user
    req.session.loggedIn=true
    res.redirect('/')
  //  res.send(`Welcome mr ${req.user.displayName}!`)
})
})

// Auth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/good');
  }
);

router.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
})
router.post('/hotel/:id',(req,res)=>{
  userHelpers.getHotel(req.params.id,req.body).then(()=>{
    res.redirect('/user/hotals')
  })
})
  module.exports = router;