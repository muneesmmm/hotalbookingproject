const { response } = require('express');
const express = require('express')
var router = express.Router();
const app = express()
const passport = require('passport');
const userHelpers = require('../helpers/user-helper')
const passportsetup = require('../passport-setup');

// For an actual app you should configure this with an experation time, better keys, proxy and secure
// Auth middleware that checks if the user is logged in
const verifylogin = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/google');
  }
}
// Example protected and unprotected routes
router.get('/', (req, res, next) => {
  let user = req.session.user
  // var pro=user.photos[0].value
  console.log(user);
  if(req.session.user){
  userHelpers.getAllDestination().then((destination) => {
    userHelpers.getAllHotel().then((hotels) => {
      res.render('user/homepage', { user, destination, hotels, pic:user.photos[0].value,email:user._json.email})
    })
  })
}else{
  userHelpers.getAllDestination().then((destination) => {
    userHelpers.getAllHotel().then((hotels) => {
      res.render('user/homepage', { user, destination, hotels})
    })
  })
}
})
router.get('/view-hotels/:id', async (req, res) => {
  let Guser = req.session.user
  let hotels = await userHelpers.getHotelData(req.params.id)
  let rooms = await userHelpers.getRoomData(req.params.id)
  console.log(hotels);
  console.log("/*********************/", rooms);
  res.render('user/view-hotels', { rooms, hotels, Guser })
})
// router.get('/add-to-userroom/:id',(req,res)=>{
//   console.log("api call") 
//   let user = req.session.user

//   let data=userHelpers.adduserRoom(req.params.id,req.session.user._id)
//   console.log(data);
//   userHelpers.getRoomDetails(req.params.id).then((rooms) => {
//     res.render('user/Roombooing', { user, rooms })
//   })
// })
router.get('/Roombooing/:id', verifylogin, async (req, res) => {
  let user = req.session.user
  
  userHelpers.getRoomDetails(req.params.id).then((rooms) => {
    res.render('user/Roombooing', { user, rooms })
  })
})
router.get('/hotels/:id', (req, res) => {
  userHelpers.getHotelDatails(req.params.id).then((hotels) => {
    res.render('user/hotels', { hotels })
  })
})
router.get('/view-profile',async(req,res)=>{
  let users=await userHelpers.getUser(req.session.user._id)
  res.render('user/view-profile',{users})
  })


router.post('/search',(req, res) => {
  userHelpers.searchHotel(req.body.city).then((hotels) => {
    res.render('user/hotels', { hotels,city:req.body.city })
  })
})
router.get('/make-payment',async (req, res) => {
  let total=await userHelpers.getTotalAmount(req.session.user._id)
  console.log(req.body);
  res.render('user/make-payment',{total,user:req.session.user})
})
router.post('/make-payment', (req, res) => {
  let persons=req.body.adults
        let room=req.body.rooms
        let users=persons/room
        console.log(persons);
        if(users>3 || room==0){
          console.log("add new room");
      }else{
  userHelpers.addBookedroom(req.body).then((response) => {
    console.log(response)
    req.session.loggedIn = true
    res.render('user/make-payment')
  })
}
})



router.get('/failed', (req, res) => res.send('You Failed to log in!'))
// In this route you can see that if the user is logged in u can acess his info in: req.user
router.get('/good', (req, res) => {
  req.session.user = req.user
  userHelpers.doLogin(req.session.user).then((response) => {
    res.redirect('/')
  })
})


// Auth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/good');
  }
);

router.get('/logout', (req, res) => {
  req.session.user = null;
  req.logout();
  res.redirect('/');
})

module.exports = router;