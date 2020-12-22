const { resolve, reject } = require('promise')
const bcrypt = require('bcrypt')
var db = require('../config/connection')
var collection = require('../config/collections')
const { response } = require('express')
var objectId = require('mongodb').ObjectID
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
              hotels=  db.get().collection(collection.HOTELUSER_COLLECTION).find({ city: hotel.city }).toArray()
                    console.log(hotels);
                    resolve(hotels)
                
            })
        })
    },
    searchHotel: (hotelid) => {
        return new Promise((resolve, reject) => {
              hotels=  db.get().collection(collection.HOTELUSER_COLLECTION).find({ city: hotelid }).toArray()
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
    // adduserRoom: (roomid, userid) => {
    //     // let proObt = {
    //     //     item: objectId(proid),
    //     //     quantity: 1

    //     // }

    //     return new Promise(async (resolve, reject) => {
    //         let userRoom = await db.get()
    //             .collection(collection.ROOMDATA_COLLECTION).findOne({ user: objectId(userid) })
    //         if (userRoom) {
    //         //     let roomExist = userCart.products.findIndex(product => product.item == roomid)
    //         //     console.log(proExist);
    //             // if (proExist != -1) {
    //             //     db.get().collection(collection.CART_COLLECTION)
    //             //         .updateOne({ user: objectId(userid)},
    //             // //             {
    //             // //                 $inc: { 'products.$.quantity': 1 }
    //             // //             }).then(() => {
    //             // //                 resolve()
    //             // //             })
    //             // // } else {
    //                 db.get().collection(collection.ROOMDATA_COLLECTION)
    //                     .updateOne({ user: objectId (userid)  }, 
    //                     {
    //                         $push: { room: objectId(roomid) }
    //                     }
                        
    //                     ).then((respons) => {
    //                         resolve()
    //                     })
    //             }
    //          else {
    //             let dataObj = {
    //                 user: objectId(userid),
    //                 room:[ objectId(roomid)]
    //             }
    //             db.get().collection(collection.ROOMDATA_COLLECTION).insertOne(dataObj).then((response) => {
    //                 resolve()
    //             })
    //         }
    //     })
    // },
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
                        hid:'$hotelid',
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
            console.log("roomsss",rooms);
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
                        hid:'$hotelid',
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
            console.log("roomsss",rooms);
            resolve(rooms)
        })

    },
    addBookedroom: (bookingData) => {
        // let persons=bookingData.adults
        // let room=bookingData.rooms
        // let users=persons/room
        // console.log(persons);
        return new Promise(async (resolve, reject) => {
           
            db.get().collection(collection.ROOMBOOKING_COLLECTION).insertOne(bookingData).then((data) => {
                console.log(bookingData);
                resolve(data.ops[0])
            
            })

        })
    },
    getUser: (userid) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).findOne({ _id: objectId(userid) }).then((user) => {
                resolve(user)
            })
        })
    }
}