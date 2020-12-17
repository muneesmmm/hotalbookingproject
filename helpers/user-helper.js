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
            //     email: userData.email
            // }
            // let datauser = await db.get().collection(collection.USER_COLLECTION).find()
            // console.log("daataa",user);
            // if(datauser){
            //     compare(userData.email,user.email).then((response)=>{
            //         console.log("exist");
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

    }
}