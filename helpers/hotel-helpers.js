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
    doLogin: (hotelData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let hotel = await db.get().collection(collection.HOTELUSER_COLLECTION).findOne({ email: hotelData.email })
            let password = await db.get().collection(collection.HOTELUSER_COLLECTION).findOne({ password: hotelData.password })
            if (hotel) {
                if (password) {
                    loginStatus = true
                }
                if (loginStatus) {
                    console.log("success");
                    response.hotel = hotel
                    response.loginStatus = true
                    resolve(response)
                } else {
                    console.log("failed");
                    resolve({ loginStatus: false })
                }

            } else {
                console.log("db failed");
                resolve({ status: false })
            }
        })
    },

    doSignup: (hotelData) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.HOTELUSER_COLLECTION).insertOne(hotelData).then((data) => {

                resolve(data.ops[0])
            })


        })
    },
    updateHotel: (hotelid, hotelData) => {
        console.log(hotelData);
        console.log(hotelid);
        return new Promise((resolve, reject) => {
            db.get().collection(collection.HOTELUSER_COLLECTION)
                .updateOne({ _id: objectId(hotelid) }, {
                    $set: {
                        hotelname: hotelData.hotelname,
                        email: hotelData.email,
                        phone: hotelData.phone,
                        location: hotelData.location,
                        address: hotelData.address

                    }
                }).then((response) => {
                    resolve()
                })
        })
    },
    getHotelDatails: (hotelid) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.HOTELUSER_COLLECTION).findOne({ _id: objectId(hotelid) }).then((hotel) => {
                resolve(hotel)
            })
        })
    },
    getHotel: (hotelid) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.HOTELUSER_COLLECTION).findOne({ _id: objectId(hotelid) }).then((hotel) => {
                resolve(hotel)
            })
        })
    },
    addRoom: (hotelData, hid) => {
        return new Promise(async (resolve, reject) => {
            let rooms = {
               hotelid: objectId(hid._id),
                rooms: [hotelData]

            }
            
            db.get().collection(collection.ROOM_COLLECTION).insertOne(rooms).then((data) => {
                console.log(hotelData);
                resolve(data.ops[0]._id)
            })


        })
    },
    getAllRooms: (hotelid) => {
        return new Promise(async (resolve, reject) => {
            let rooms = await db.get().collection(collection.ROOM_COLLECTION).aggregate([
                {
                    $match: { hotelid: objectId(hotelid._id) }
                },
                {
                    $unwind: '$rooms'
                },
                {
                    $project: {
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
                        as: 'rooms'
                    }
                }
            ]).toArray()
            console.log("roomsss",rooms);
            resolve(rooms)
        })

    } ,
    getroomDatails: (roomid) => {
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
                        as: 'rooms'
                    }
                }
            ]).toArray()
            console.log("roomsss",rooms);
            resolve(rooms)
        })

    } ,
    updateRoom: (roomid, roomData) => {
        console.log(roomData);
        console.log(roomid);
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ROOM_COLLECTION)
                .update({ _id: objectId(roomid) }, {
                    $set: {
                        rooms : [ 
                            {
                        roomname: roomData.roomname,
                        price: roomData.price,
                        avileblerooms: roomData.avileblerooms,
                        type: roomData.type,
                        features: roomData.features

                    }
                ]
            }
                }).then((response) => {
                    resolve(response)
                })
        })
    },
    deleteRoom: (room) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ROOM_COLLECTION).removeOne({ _id: objectId(room) }).then((response) => {
                console.log(response)
                resolve(response)
            })
        })
    } ,
    getroomDatails: (id) => {
        return new Promise(async (resolve, reject) => {
            let data=await db.get().collection(collection.ROOMBOOKING_COLLECTION).find({ hotelid:id,status:'success'}) .toArray()
            console.log("/********************/",data);         
            resolve(data)
        })

    } ,
    checkin: (id) => {
        
        return new Promise(async(resolve, reject) => {
            data=await db.get().collection(collection.ROOMBOOKING_COLLECTION).findOne({ _id:objectId(id)})
            db.get().collection(collection.ROOMBOOKING_COLLECTION)
                .update({ _id: data._id }, {
                    $set:  
                            {
                        chn:"user checked in"

            }
                }).then((response) => {
                    resolve(response)
                })
        })
    },
    checkout: (id) => {
        
        return new Promise(async(resolve, reject) => {
            data=await db.get().collection(collection.ROOMBOOKING_COLLECTION).findOne({ _id:objectId(id)})
            db.get().collection(collection.ROOMBOOKING_COLLECTION)
                .update({ _id: data._id }, {
                    $set:  
                            {
                        cho:"user checked Out"

            }
                }).then((response) => {
                    resolve(response)
                })
        })
    },
    addpenaty: (data) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.PENALTY_COLLECTION).insertOne(data).then((data) => {
                console.log(data);
                resolve(data.ops[0])
            })
        })
    },
    viewpenalty: () => {
        return new Promise(async (resolve, reject) => {
            data = await db.get().collection(collection.PENALTY_COLLECTION).find({}).toArray()
            console.log("///////////", data);
            resolve(data)

        })
    },
    getbooked: (id) => {
        return new Promise(async (resolve, reject) => {  
            let data = await db.get().collection(collection.CONFBOOKING_COLLECTION).find({hotelid:id}).toArray()
            console.log("................",data);
            resolve(data)
        })
    },
    getcancelled: (id) => {
        return new Promise(async (resolve, reject) => {  
            let data = await db.get().collection(collection.CONFBOOKING_COLLECTION).find({status:"cancelled"}).toArray()
            console.log("................",data);
            resolve(data)
        })
    },
    getpenaltyAmount: (id) => {
        return new Promise(async (resolve, reject) => {
            
            let data = await db.get().collection(collection.CONFBOOKING_COLLECTION).findOne({ _id:objectId(id) })
            resolve(data)
        })

    }
    ,
    penalty: ( data, total) => {
        console.log('./............./........./.........../', data, total);
        return new Promise((resolve, reject) => {

            let orderObj = {
                bookingid: data._id,
                totalAmount: total,
                date: new Date()
            }
            db.get().collection(collection.RETURNPAY_COLLECTION).insertOne(orderObj).then((response) => {
               
                db.get().collection(collection.CONFBOOKING_COLLECTION).updateOne({ _id: data._id },
                    {
                        $set: {
                            status: 'payment refund successfully',
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
    sendMail: (reciever) => {
        console.log("Reviever", reciever)
        var username = reciever.email
        var password = reciever.password
        responseData = {}
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'muneesmmm@gmail.com',
                pass: 'mmuneesm786'
            }
        });

        var mailOptions = {
            from: reciever.email,
            to: username,
            subject: 'Sending Email using Node.js',
            text: 'payment refund successfully'
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
                responseData.message = "hotel registered succussfully"
                console.log(responseData.message);
            }
        });
    }
//      ,
//     getuser: (id) => {
//         return new Promise(async (resolve, reject) => {
//         let data=await db.get().collection(collection.ROOMBOOKING_COLLECTION).find({ hotelid:id}).toArray()
//             let user=await db.get().collection(collection.USER_COLLECTION).find({_id:objectId(data.userid)}).toArray()
//             resolve(user) 
//     })
    
// },

}