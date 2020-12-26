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
    
    res.render('user/Roombooing', { user, rooms,email:user._json.email })
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
router.get('/make-payment/:id',async (req, res) => {
  let data= await userHelpers.getTotalAmount(req.params.id)
  let bookingid=data._id
    console.log("/**************/",data);
    let day1=new Date(data.checkIn)
    let day2=new Date(data.checkOut)
    let diff=parseInt((day2-day1)/(1000*60*60*24))
    console.log("day",diff);
    let total=data.Price*data.Room
    let Amount=diff*total
//     userHelpers.placeOrder(data,Amount).then((bookingid)=>{
//       if(req.body['payment-method']==='COD'){
//         res.json({codSuccess:true})
//       }else{
//         userHelpers.generateRazorpay(bookingid,Amount).then((response)=>{
          
//           res.json(response)
//         })
//       }
  
  
// })
    res.render('user/make-payment',{Amount,user:req.session.user,bookingid})
  
})
router.post('/make-payment', async(req, res) => {
  console.log(req.body);
  let details=req.body
  let data= await userHelpers.getTotalAmount(req.body.id)
  let day1=new Date(data.checkIn)
  let day2=new Date(data.checkOut)
  let diff=parseInt((day2-day1)/(1000*60*60*24))
  console.log("day",diff);
  let total=data.Price*data.Room
  let Amount=diff*total
  let bookingid=data._id
  userHelpers.placeOrder(details,data,Amount).then((orderId)=>{
    if(req.body['payment-method']==='COD'){
      res.json({codSuccess:true})
    }else{
          userHelpers.generateRazorpay(orderId,Amount).then((response)=>{
            
            res.json(response)
          })
    }
    
    
  })
})
router.get('/view-bookings',(req, res) => {
  let user=req.session.user._id
  userHelpers.getbookedroom(user).then((rooms) => {
    console.log("|-----------------------------------------|", rooms);
  res.render('user/view-booking', {user, rooms })
})
})
router.post('/add-booking', async(req, res) => {
    userHelpers.addBookedroom(req.body).then((response) => {
    console.log("+++++++++++",response)
    res.redirect('/view-bookings')
    
    
  
})
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