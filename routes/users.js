const { response } = require('express');
const express = require('express')
var router = express.Router();
const app = express()
const passport = require('passport');
const userHelpers = require('../helpers/user-helper')
const hotelHelpers = require('../helpers/hotel-helpers')
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
  if (req.session.user) {
    userHelpers.getAllDestination().then((destination) => {
      userHelpers.getAllHotel().then((hotels) => {
        res.render('user/homepage', { user, destination, hotels, pic: user.photos[0].value, email: user._json.email })
      })
    })
  } else {
    userHelpers.getAllDestination().then((destination) => {
      userHelpers.getAllHotel().then((hotels) => {
        res.render('user/homepage', { user, destination, hotels })
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

router.get('/Roombooing/:id', verifylogin, async (req, res) => {
  let user = req.session.user

  userHelpers.getRoomDetails(req.params.id).then((rooms) => {

    res.render('user/Roombooing', { user, rooms, email: user._json.email })
  })
})
router.get('/view-details/:id', async (req, res) => {
  let user = req.session.user
  id = req.params.id
  console.log(id);
  data = await hotelHelpers.viewdata(id)
  hotelHelpers.viewdetails(id).then((review) => {
    console.log("reviews", review);
    res.render('hotel/view-details', { id, pic: user.photos[0].value, name: user.displayName, review, data })
  })
})
router.get('/hotels/:id', (req, res) => {
  userHelpers.getHotelDatails(req.params.id).then((hotels) => {
    res.render('user/hotels', { hotels })
  })
})
router.get('/view-profile', async (req, res) => {
  let users = await userHelpers.getUser(req.session.user._id)
  res.render('user/view-profile', { users })
})


router.post('/search', (req, res) => {
  userHelpers.searchHotel(req.body.city).then((hotels) => {
    res.render('user/hotels', { hotels, city: req.body.city })
  })
})
router.get('/make-payment/:id', async (req, res) => {
  let data = await userHelpers.getTotalAmount(req.params.id)
  let bookingid = data._id
  console.log("/**************/", data);
  let day1 = new Date(data.checkIn)
  let day2 = new Date(data.checkOut)
  let diff = parseInt((day2 - day1) / (1000 * 60 * 60 * 24))
  console.log("day", diff);
  let total = data.Price * data.Room
  let Amount = diff * total

  res.render('user/make-payment', { Amount, user: req.session.user, bookingid })

})
router.post('/make-payment', async (req, res) => {
  let details = req.body
  console.log("23030300", details);
  let data = await userHelpers.getTotalAmount(req.body.id)
  let day1 = new Date(data.checkIn)
  let day2 = new Date(data.checkOut)
  let diff = parseInt((day2 - day1) / (1000 * 60 * 60 * 24))
  let total = data.Price * data.Room
  let Amount = diff * total
  userHelpers.placeOrder(details, data, Amount).then((orderId) => {
    console.log("000000000000", orderId);

    if (req.body['payment-method'] === 'COD') {
      res.json({ codSuccess: true })
    } else {
      userHelpers.generateRazorpay(orderId, Amount).then((response) => {

        res.json(response)
      })
    }


  })
})
router.get('/pay-penalty/:id', async (req, res) => {
  userHelpers.getpenaltyAmount(req.params.id).then((data) => {
    let bookingid = data._id
    Amount = data.amount
    console.log("/**************/", data);
    res.render('user/pay-penalty', { user: req.session.user, bookingid, Amount })

  })

})
router.post('/pay-penalty', async (req, res) => {
  let data = await userHelpers.getpenaltyAmount(req.body.id)
  console.log(data);
  let Amount = data.amount
  userHelpers.penalty(data, Amount).then((orderId) => {
    console.log("///", orderId);
    console.log(Amount);
    userHelpers.generateRazorpay1(orderId, Amount).then((response) => {

      res.json(response)
    })
  })
})
router.get('/view-bookings', (req, res) => {
  let user = req.session.user._id
  userHelpers.getbookedroom(user).then((rooms) => {
    console.log("|-----------------------------------------|", rooms);

    res.render('user/view-booking', { user, rooms })
  })
})
router.get('/view-reviews/:id', (req, res) => {
  let user = req.session.user
  id = req.params.id
  console.log(id);
  userHelpers.viewreviews(id).then((review) => {
    console.log("reviews", review);
    res.render('user/view-reviews', { id, pic: user.photos[0].value, name: user.displayName, review })
  })
})
router.post('/review/:id', (req, res) => {
  let user = req.session.user
  id = req.params.id
  console.log(req.body);

  userHelpers.review(req.body).then((data) => {
    userHelpers.viewreviews(id).then((review) => {
      console.log("reviews", review);
      console.log(data);
      res.render('user/view-reviews', { id, pic: user.photos[0].value, name: user.displayName, review })

    })
  })
})

router.get('/bookedhotels', async (req, res) => {
  let user = req.session.user._id
  let room = await userHelpers.getconfirmbooked(user)

  userHelpers.getbooked(user).then((rooms) => {


    console.log("|-----------------------------------------|", rooms);

    res.render('user/bookedhotels', { user, rooms, room,btn:rooms.chn==="pendin" })
  })
})
router.get('/view-penalty', (req, res) => {
  let user = req.session.user._id
  userHelpers.viewpenalty(user).then((data) => {
    console.log("|-----------------------------------------|", data);

    res.render('user/view-penalty', { user, data })
  })
})
router.post('/add-booking', async (req, res) => {
  userHelpers.addBookedroom(req.body).then((response) => {
    console.log("+++++++++++", response)
    res.redirect('/view-bookings')



  })
})
router.get('/cancel-hotel/:id', (req, res) => {
  let id = req.params.id
  console.log("//*************//", id)
  userHelpers.checkout(id).then((response) => {
    res.redirect('/bookedhotels')
  })

})
router.get('/detete-room/:id', (req, res) => {
  let room = req.params.id
  console.log("//*************//", room)
  userHelpers.deleteRoom(room).then((response) => {
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
router.post('/verify-payment', (req, res) => {
  userHelpers.verifyPayment(req.body).then(() => {
    console.log("details", req.body);

    userHelpers.changePaymentStatus(req.body['order[receipt]']).then(() => {
      console.log('sucesssssssssss');
      res.json({ status: true })

    })

  }).catch((err) => {
    console.log('faileddddddddd');
    res.json({ status: false, errMsg: '' })
  })
})
router.post('/verify-payment1', (req, res) => {
  userHelpers.verifyPayment1(req.body).then(() => {
    console.log("details", req.body);

    userHelpers.changePaymentStatus1(req.body['order[receipt]']).then(() => {
      console.log('sucesssssssssss');
      res.json({ status: true })

    })

  }).catch((err) => {
    console.log('faileddddddddd');
    res.json({ status: false, errMsg: '' })
  })
})

module.exports = router;