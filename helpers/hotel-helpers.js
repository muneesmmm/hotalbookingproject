const { resolve, reject } = require('promise')
const bcrypt = require('bcrypt')
var db = require('../config/connection')
var collection = require('../config/collections')
const { response } = require('express')
var objectId = require('mongodb').ObjectID

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

    }
}