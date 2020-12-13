const { resolve, reject } = require('promise')
const bcrypt = require('bcrypt')
var db = require('../config/connection')
var collection = require('../config/collections')
const { response } = require('express')
var objectId = require('mongodb').ObjectID
module.exports = {
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) => {

                resolve(data.ops[0])
            })
            
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ displayName: userData.displayName })
            console.log("user",user.displayName);
        })
    },
    getAllDestination: () => {
        return new Promise(async (resolve, reject) => {
            let city = await db.get().collection(collection.HOTELUSER_COLLECTION).find().toArray()
            resolve(city)
            console.log(city);
        })

    },
    getHotelDatails: (hotelid) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.HOTELUSER_COLLECTION).findOne({ city: hotelid.city }).then((hotel) => {
                resolve(hotel)
            })
        })
    }

}