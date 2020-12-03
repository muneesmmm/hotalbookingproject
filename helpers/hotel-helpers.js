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
            let password = await db.get().collection(collection.HOTELUSER_COLLECTION).findOne({ password: hotelData.password })
            if (hotel) {
                    if(password){
                        loginStatus=true
                    }
                if (loginStatus) {
                        console.log("success");
                        response.hotel=hotel
                        response.loginStatus=true
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
        }
        // getUserProfile: (hotelId) => {
        //     return new Promise(async (resolve, reject) => {
        //         let profile = await db.get().collection(collection.HOTELUSER_COLLECTION).aggregate([
        //             {
        //                 $match: { hotel: objectId(hotelId) }
        //             },
        //             {
        //                 $unwind: '$hotels'
        //             },
        //             {
        //                 $project: {
        //                     hotelname: '$hotel.hotelname',
        //                     location: '$hotel.location',
        //                     email: '$hotel.email'
        //                 }
        //             }
        //             ,
        //             {
        //                 $lookup: {
        //                     from: collection.PRODUCT_COLLECTION,
        //                     localField: 'hotelname',
        //                     foreignField: '_id',
        //                     as: 'hotel'
        //                 }
        //             }
        //             // {
        //             //     $project: {
        //             //         item: 1, quantity: 1, product: { $arrayElemAt: ['$product', 0] }
        //             //     }
        //             // }
        //         ]).toArray()
        //         // console.log(cartItems);
        //         resolve(profile)
        //     })
        // }
    }