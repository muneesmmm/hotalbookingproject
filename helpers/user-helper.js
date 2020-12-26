const { resolve, reject } = require('promise')
const bcrypt = require('bcrypt')
var db = require('../config/connection')
var collection = require('../config/collections')
const { response } = require('express')
var objectId = require('mongodb').ObjectID
const Razorpay = require('razorpay')

var instance = new Razorpay({
    key_id: 'rzp_test_kjyHA20dKI0lVy',
    key_secret: 'AYaURNqqGY0qnrZLQAQDJxmw',
});
module.exports = {
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            // let user = {
            //     email: userData._json.email
            // }
            // datauser=db.get().collection(collection.USER_COLLECTION).findOne({email:userData._json.email})
            //     console.log("daataa",datauser);


            // if(datauser){
            //     compare(userData._json.email,datauser).then((response)=>{
            //         console.log("user alredy exist");
            //         db.get().collection(collection.USER_COLLECTION).findOne({user}).then((data) => {
            //             resolve(data)
            //         })
            //     })

            // }else{
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) => {
                resolve(data.ops[0])
            })

            // let user = await db.get().collection(collection.USER_COLLECTION).findOne({ displayName: userData.displayName })
            // console.log("user", user.displayName);
            // }
        })
    },
    getAllDestination: () => {
        return new Promise(async (resolve, reject) => {
            let city = await db.get().collection(collection.CITY_COLLECTION).find().toArray()
            resolve(city)
            console.log(city);
        })
    }
    ,
    getAllHotel: () => {
        return new Promise(async (resolve, reject) => {
            let city = await db.get().collection(collection.HOTELUSER_COLLECTION).find().toArray()
            resolve(city)
            console.log(city);
        })
    },
    getHotelDatails: (hotelid) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.CITY_COLLECTION).findOne({ _id: objectId(hotelid) }).then((hotel) => {
                hotels = db.get().collection(collection.HOTELUSER_COLLECTION).find({ city: hotel.city }).toArray()
                console.log(hotels);
                resolve(hotels)

            })
        })
    },
    searchHotel: (hotelid) => {
        return new Promise((resolve, reject) => {
            hotels = db.get().collection(collection.HOTELUSER_COLLECTION).find({ city: hotelid }).toArray()
            console.log(hotels);
            resolve(hotels)

        })

    },
    getHotelData: (hotelid) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.HOTELUSER_COLLECTION).findOne({ _id: objectId(hotelid) }).then((hotel) => {
                resolve(hotel)
            })
        })
    },
    getRoomData: (hotelid) => {
        return new Promise(async (resolve, reject) => {

            let rooms = await db.get().collection(collection.ROOM_COLLECTION).aggregate([
                {
                    $match: { hotelid: objectId(hotelid) }
                },
                {
                    $unwind: '$rooms'
                },
                {
                    $project: {
                        hid: '$hotelid',
                        roomname: '$rooms.roomname',
                        price: '$rooms.price',
                        features: '$rooms.features',
                        avileblerooms: '$rooms.avileblerooms',
                        type: '$rooms.type',
                        image: '$rooms.image'
                    }
                },
                {
                    $lookup: {
                        from: collection.ROOM_COLLECTION,
                        localField: 'hotelid',
                        foreignField: '_id',
                        foreignField: 'hotelid',
                        as: 'rooms'
                    }
                }
            ]).toArray()
            console.log("roomsss", rooms);
            resolve(rooms)
        })

    },
    getRoomDetails: (roomid) => {
        console.log(roomid);
        return new Promise(async (resolve, reject) => {
            let rooms = await db.get().collection(collection.ROOM_COLLECTION).aggregate([
                {
                    $match: { _id: objectId(roomid) }
                },
                {
                    $unwind: '$rooms'
                },
                {
                    $project: {
                        hid: '$hotelid',
                        roomname: '$rooms.roomname',
                        price: '$rooms.price',
                        features: '$rooms.features',
                        avileblerooms: '$rooms.avileblerooms',
                        type: '$rooms.type',
                        image: '$rooms.image'
                    }
                },
                {
                    $lookup: {
                        from: collection.ROOM_COLLECTION,
                        localField: 'roomid',
                        foreignField: '_id',
                        foreignField: 'hotelid',
                        as: 'rooms'
                    }
                }
            ]).toArray()
            console.log("roomsss", rooms);
            resolve(rooms)
        })

    },
    addBookedroom: (bookingData) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.ROOMBOOKING_COLLECTION).insertOne(bookingData).then((data) => {
                console.log(bookingData);
                resolve(data.ops[0])

            })

        })
    },
    getTotalAmount: (id) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.ROOMBOOKING_COLLECTION).findOne({ _id: objectId(id) }).then((data) => {
                console.log("//",data);
                resolve(data)
            })
        })
    }
    ,
    getbookedroom: (id) => {
        return new Promise(async (resolve, reject) => {
            let data = await db.get().collection(collection.ROOMBOOKING_COLLECTION).find({ userid: id }).toArray()
            console.log("/********************/", data);
            resolve(data)
        })

    },
    placeOrder: ( data, total) => {
        console.log('./............./........./.........../', data, total);
        return new Promise((resolve, reject) => {

            db.get().collection(collection.ROOMBOOKING_COLLECTION)
            .updateOne({ status: data.status }, {
                $set: {
                    status : 'success'
        }
            }).then((response) => {
                resolve(response)
            })
    })
            
    }
     ,
    generateRazorpay: (bookingid,total) => {
        console.log("...................",bookingid);
        return new Promise((resolve, reject) => {
            var options = {
                amount: total*100,  // amount in the smallest currency unit  
                currency: "INR",
                receipt: "" + bookingid
            };
            instance.orders.create(options, function (err, booking) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("order:", booking);
                    resolve(booking)
                }
            });
        })
    },
    placeOrder: (details,data, total) => {
        console.log('./............./........./.........../',details, data, total);
        return new Promise((resolve, reject) => {

            let status = details['payment-methord'] === 'COD' ? 'placed' : 'pending'
            let orderObj = {
                deliveryDetails: {
                    mobile: details.mobile,
                    address: details.address,
                    pincode: details.pincode
                },
                userId: details.userid,
                paymentMethord: details['payment-methord'],
                totalAmount: total,
                status: status,
                date: new Date()
            }
            db.get().collection(collection.CONFBOOKING_COLLECTION).insertOne(orderObj).then((response) => {
                console.log(details.userid);
                // db.get().collection(collection.CART_COLLECTION).removeOne({ user: objectId(order.userid) })
                console.log('completed');
                // console.log("*----------------------**",response);
                resolve(response.ops[0]._id)
            })
        })
    }
    
}
