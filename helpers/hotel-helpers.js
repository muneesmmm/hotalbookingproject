const { resolve, reject } = require('promise')
const bcrypt = require('bcrypt')
var db=require('../config/connection')
var collection=require('../config/collections')
const { response } = require('express')
var objectId=require('mongodb').ObjectID
module.exports={
    doLogin: (hotelData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let hotel = await db.get().collection(collection.HOTELUSER_COLLECTION).findOne({ email: hotelData.email })
            if (hotel) {
                bcrypt.compare(hotelData.password, hotel.password).then((status) => {
                    if (status) {
                        console.log("success");
                        response.hotel=hotel
                        response.status=true
                        resolve(response)
                    } else {
                        console.log("failed");
                        resolve({ status: false })
                    }
                })
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
        }
    }