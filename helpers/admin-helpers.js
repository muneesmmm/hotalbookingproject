const { resolve, reject } = require('promise')
const bcrypt = require('bcrypt')
var db=require('../config/connection')
var collection=require('../config/collections')
const { response } = require('express')
var objectId=require('mongodb').ObjectID
module.exports={
    doLogin: (adminData) => {
        return new Promise(async (resolve, reject) => {
            let status = false
            let response = {}
            let admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ email: adminData.email })
            if (admin) {
                bcrypt.compare(adminData.password, admin.password).then((status) => {
                    if (status) {
                        console.log("success");
                        console.log(admin);
                        response.admin=admin
                        response.status=true
                        resolve(response)
                    } else {
                        console.log("failed");
                        response.status=false
                        resolve({ status: false })
                        console.log(response.status);

                    }
                })
            } else {
                console.log("db failed");
                resolve({ status: false })
            }
        })
    },
    getAllHotels:()=>{
        return new Promise(async(resolve,reject)=>{
            let hotel=await db.get().collection(collection.HOTELUSER_COLLECTION).find().toArray()
            resolve(hotel)
        })

    },
    addHotel: (hotelData) => {
        return new Promise(async (resolve, reject) => {
            hotelData.password = await bcrypt.hash(hotelData.password, 10)
            db.get().collection(collection.HOTELUSER_COLLECTION).insertOne(hotelData).then((data) => {

                resolve(data.ops[0])
            })


        })
    }

    }


   
       