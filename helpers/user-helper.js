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
    viewpenalty: (data) => {
        return new Promise(async (resolve, reject) => {
            id = await db.get().collection(collection.PENALTY_COLLECTION).findOne({ userid: objectId(data) })
            console.log("///////////", id);

            details = await db.get().collection(collection.PENALTY_COLLECTION).find({ id }).toArray()
            resolve(details)

        })
    },
    getTotalAmount: (id) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.ROOMBOOKING_COLLECTION).findOne({ _id: objectId(id) }).then((data) => {
                console.log("//", data);
                resolve(data)   
            })
        })
    },
    getbookedroom: (id) => {
        return new Promise(async (resolve, reject) => {
            let data = await db.get().collection(collection.ROOMBOOKING_COLLECTION).find({ userid: id,status:'pendin' }).toArray()
            console.log("/********************/", data);
            resolve(data)
        })
    },
    getconfirmbooked: (id) => {
        return new Promise(async (resolve, reject) => {
            let data = await db.get().collection(collection.ROOMBOOKING_COLLECTION).find({ userid: id,status:'success' }).toArray()
            console.log("/********************/", data);
            resolve(data)
        })
    },
    getbooked: (id) => {
        return new Promise(async (resolve, reject) => {
            let data = await db.get().collection(collection.CONFBOOKING_COLLECTION).find({ userId:id }).toArray()
            console.log("/********************/", data);
            resolve(data)
        })
    },
    getpenaltyAmount: (id) => {
        return new Promise(async (resolve, reject) => {
            let data = await db.get().collection(collection.PENALTY_COLLECTION ).findOne({ _id:objectId(id) })
            console.log("/********************/", data.amount);
            resolve(data)
        })

    }
    ,
    generateRazorpay: (bookingid, total) => {
        console.log("...................", bookingid);
        return new Promise((resolve, reject) => {
            var options = {
                amount: total * 100,  // amount in the smallest currency unit  
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
    placeOrder: (details, data, total) => {
        console.log('./............./........./.........../', details, data, total);
        return new Promise((resolve, reject) => {

            let status = details['payment-methord'] === 'COD' ? 'placed' : 'pending'
            let orderObj = {
                    mobile: details.mobile,
                    orderid: data._id,
                    username:data.name,
                    hotelid:data.hotelid,
                userId: details.userid,
                paymentMethord: details['payment-methord'],
                totalAmount: total,
                status: status,
                date: new Date()
            }
            db.get().collection(collection.CONFBOOKING_COLLECTION).insertOne(orderObj).then((response) => {
                console.log(details.userid);
                db.get().collection(collection.ROOMBOOKING_COLLECTION).updateOne({ _id: objectId(data._id) },
                    {
                        $set: {
                            status: 'success',
                        }
                    }).then(() => {
                        resolve()
                    })
                console.log('completed');
                // console.log("*----------------------**",response);
                resolve(response.ops[0]._id)
            })
        })
    }
    ,
    verifyPayment: (details) => {
        return new Promise((resolve, reject) => {
            console.log(details);
            const crypto = require('crypto')
            let hmac = crypto.createHmac('sha256', 'AYaURNqqGY0qnrZLQAQDJxmw')
            hmac.update(details['payment[razorpay_order_id]'] + '|' + details['payment[razorpay_payment_id]'])
            hmac = hmac.digest('hex')
            if (hmac == details['payment[razorpay_signature]']) {
                resolve()
            } else {
                reject()

            }
        })
    },
    changePaymentStatus: (orderId) => {
        console.log(orderId);
        return new Promise((resolve, reject) => {
            db.get().collection(collection.CONFBOOKING_COLLECTION).updateOne({ _id: objectId(orderId) },
                {
                    $set: {
                        status: 'success'
                    }
                }).then(() => {
                    resolve()
                })
        })
    },
    penalty: ( data, total) => {
        console.log('./............./........./.........../', data, total);
        return new Promise((resolve, reject) => {

            let orderObj = {
                bookingid: data.bookingid,
                totalAmount: total,
                date: new Date()
            }
            db.get().collection(collection.PENALTYPAY_COLLECTION).insertOne(orderObj).then((response) => {
               
                db.get().collection(collection.PENALTY_COLLECTION).updateOne({ _id: objectId(data._id) },
                    {
                        $set: {
                            status: 'success',
                        }
                    }).then(() => {
                        resolve()
                    })
                console.log('completed');
                // console.log("*----------------------**",response);
                resolve(response.ops[0]._id)
            })
        })
    },
    generateRazorpay1: (bookingid, total) => {
        console.log("...................", bookingid);
        console.log("..........+0+0000000000",total);
        return new Promise((resolve, reject) => {
            var options = {
                amount: total * 100,  // amount in the smallest currency unit  
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
    }
    ,
    verifyPayment1: (details) => {
        return new Promise((resolve, reject) => {
            console.log(details);
            const crypto = require('crypto')
            let hmac = crypto.createHmac('sha256', 'AYaURNqqGY0qnrZLQAQDJxmw')
            hmac.update(details['payment[razorpay_order_id]'] + '|' + details['payment[razorpay_payment_id]'])
            hmac = hmac.digest('hex')
            if (hmac == details['payment[razorpay_signature]']) {
                resolve()
            } else {
                reject()

            }
        })
    },
    changePaymentStatus1: (orderId) => {
        console.log(orderId);
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PENALTYPAY_COLLECTION).updateOne({ _id: objectId(orderId) },
                {
                    $set: {
                        status: 'success'
                    }
                }).then(() => {
                    resolve()
                })
        })
    },
    deleteRoom: (room) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ROOMBOOKING_COLLECTION).removeOne({ _id: objectId(room) }).then((response) => {
                console.log(response)
                resolve(response)
            })
        })
    },
    checkout: (id) => {
        console.log(id);
        return new Promise(async(resolve, reject) => {
            db.get().collection(collection.CONFBOOKING_COLLECTION)
                .update({ _id:objectId(id)}, {
                    $set:  
                            {
                        status:"cancelled"

            }
                }).then((response) => {
                    resolve(response)
                })
        })
    }

}
