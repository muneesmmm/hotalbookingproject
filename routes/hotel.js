const { response } = require('express');
var express = require('express');
var router = express.Router();
const hotelHelpers = require('../helpers/hotel-helpers')
const verifyLogin = (req, res, next) => {
  if (req.session.hotelloggedIn) {
    next()
  } else {
    res.redirect('/hotel/login')
  }
}
/* GET home page. */
router.get('/', function (req, res, next) {
  let hotel = req.session.hotel
  if (req.session.hotelloggedIn) {
    res.render('hotel/homepage', { hotel })
  }
  else {
    res.render('hotel/login', { "LoginErr": req.session.hotelloginErr })
    req.session.hotelloginErr = false
  }

})
// router.get('/login',(req,res)=>{
//   if(req.session.hotelloginErr){
//     res.redirect('hotel/login')
//   }else{
//     res.render('/hotel',{"loginErr":req.session.hotelloginErr})
//     req.session.hotelloginErr=false
//   }  
// })
router.get('/signup', (req, res) => {
  res.render('hotel/signup')
})
router.post('/signup', (req, res) => {
  hotelHelpers.doSignup(req.body).then((response) => {
    console.log(response)
    req.session.hotel = response
    req.session.hotelloggedIn = true
    res.redirect('/hotel/homepage')
  })
})
router.post('/login', (req, res) => {
  req.session.hotelloggedIn = false
  hotelHelpers.doLogin(req.body).then((response) => {

    if (response.loginStatus) {
      console.log(response);
      req.session.hotelloggedIn = true
      req.session.hotel = response.hotel
      res.redirect('/hotel')
    } else {
      req.session.hotelloginErr = true
      res.redirect('/hotel')
    }


  })
})
router.get('/logout', (req, res) => {
  req.session.hotelloggedIn = false
  req.session.hotel = null
  res.redirect('/hotel')
})
router.get('/homepage', (req, res) => {
  res.render('hotel/homepage')
})
// router.get('/view-profile', async (req, res) => {
//   if (req.session.hotelloggedIn) {
//     let hotels = req.session.hotel
//     res.render('hotel/view-profile', { hotel: true, hotels })
//     console.log("hotels", hotels);
//   }
// })
router.get('/view-profile',async(req,res)=>{
  let hotels=await hotelHelpers.getHotel(req.session.hotel._id)
  res.render('hotel/view-profile',{hotel:true,hotels})
})
router.get('/edit-profile/:id',async(req,res)=>{
  let hotels=await hotelHelpers.getHotelDatails(req.params.id)
  console.log(hotels);
  res.render('hotel/edit-profile',{hotel:true,hotels})
})
router.post('/edit-profile/:id',(req,res)=>{
  hotelHelpers.updateHotel(req.params.id,req.body).then((id)=>{
    res.redirect('/hotel/view-profile')
    
    if(req.files.image){
      let id=req.params.id
      let image=req.files.image
      image.mv('./public/hotel-images/'+id+'.jpg')
    }
  })
})
router.get('/add-room', (req, res) => {
  res.render('hotel/add-room', { hotel: req.session.hotel })
})
router.post('/add-room', (req, res) => {
  hotelHelpers.addRoom(req.body,req.session.hotel).then((id) => {
    console.log(id)
    let image=req.files.Image
    image.mv('./public/room-images/'+id+'.jpg',(err)=>{
      if(!err){
        res.redirect('/hotel/rooms')
    req.session.hotelloggedIn = true
      }else{
        console.log(err);
      }
  })
})
})
router.get('/rooms',async (req, res) => {
  let rooms=await hotelHelpers.getAllRooms(req.session.hotel)
  console.log(rooms);
  res.render('hotel/rooms', {hotel:req.session.hotel ,rooms})
  req.session.hotelloggedIn = true
})
module.exports = router;