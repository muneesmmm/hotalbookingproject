const { response } = require('express');
var express = require('express');
var router = express.Router();
const adminHelpers = require('../helpers/admin-helpers')
const userHelpers = require('../helpers/user-helper')
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
    req.session.LoginErr = false
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
router.get('/view-reviews/:id',(req, res) => {
  let user = req.session.user
  id=req.params.id
  console.log(id);
  userHelpers.viewreviews(id).then((review) => {
    console.log("reviews", review);
  res.render('admin/view-reviews',{id,pic:user.photos[0].value,name:user.displayName,review,admin: req.session.admin })
})
})
router.get('/view-reviews',(req, res) => {
  res.render('admin/view-reviews')
})
router.get('/add-hotel', (req, res) => {
  res.render('admin/add-hotel', { admin: req.session.admin })
})
router.post('/add-hotel', (req, res) => {
  adminHelpers.addHotel(req.body).then((response) => {
    console.log(response)
    req.session.admin = response
    req.session.loggedIn = true
    res.redirect('/admin/totalhotals')
    adminHelpers.addCity(req.body).then((response) => {
      console.log("//'.//////////////..//", response.city);
      req.session.admin = response
      req.session.loggedIn = true
    })
  })
  adminHelpers.sendMail(req.body).then((response) => {
    req.session.admin = response
    req.session.loggedIn = true
  
  })
})
router.get('/detete-hotel/:id', (req, res) => {
  let hotel = req.params.id
  console.log(hotel)
  adminHelpers.deleteHotel(hotel).then((response) => {
    res.redirect('/admin/totalhotals')
  })

})
router.get('/detete-review/:id', (req, res) => {
  let hotel = req.params.id
  console.log(hotel)
  adminHelpers.deletereview(hotel).then((response) => {
    res.redirect('/admin/totalhotals')
  })

})
router.get('/edit-hotel/:id', async (req, res) => {
  let hotels = await adminHelpers.getHotelDatails(req.params.id)
  console.log(hotels);
  res.render('admin/edit-hotel', { admin: true, hotels })

})
router.post('/edit-hotel/:id', (req, res) => {
  adminHelpers.updateHotel(req.params.id, req.body).then(() => {
    res.redirect('/admin/totalhotals')
  })
})
router.get('/view-booking', (req, res) => {
  adminHelpers.getroomDatails().then((rooms) => {
    console.log("|-----------------------------------------|", rooms);

    res.render('admin/view-booking', { admin: true, rooms })
  })
})
router.get('/view-city', (req, res) => {
  adminHelpers.getcityDatails().then((city) => {
    console.log("|-----------------------------------------|", city);

    res.render('admin/view-city', { admin: true, city })
  })
})
router.get('/detete-room/:id', (req, res) => {
  let room = req.params.id
  console.log("//*************//", room)
  adminHelpers.deleteRoom(room).then((response) => {
    res.redirect('/admin/view-booking')
  })

})
router.get('/edit-city/:id', async (req, res) => {
  let city = await adminHelpers.getCity(req.params.id)
  console.log(city);
  res.render('admin/edit-city', { admin: true, city })
})
router.post('/edit-city/:id', (req, res) => {
  adminHelpers.updateCity(req.params.id, req.body).then((id) => {
    console.log(req.body);
    res.redirect('/admin/view-city')

    if (req.files.image) {
      let id = req.params.id
      let image = req.files.image
      image.mv('./public/city-images/' + id + '.jpg')
    }
  })
})

module.exports = router;