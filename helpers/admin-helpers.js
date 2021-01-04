const { resolve, reject } = require('promise')
var db = require('../config/connection')
var collection = require('../config/collections')
const { response } = require('express')
const bcrypt = require('bcrypt')

var objectId = require('mongodb').ObjectID
var generator = require('generate-password');
var nodemailer = require('nodemailer');
const { compare } = require('bcrypt')

var password = generator.generate({
    length: 10,
    numbers: true
});
module.exports = {
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
                        response.admin = admin
                        response.status = true
                        resolve(response)
                    } else {
                        console.log("failed");
                        response.status = false
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
    getAllHotels: () => {
        return new Promise(async (resolve, reject) => {
            let hotel = await db.get().collection(collection.HOTELUSER_COLLECTION).find().toArray()
            resolve(hotel)
        })

    },
    addHotel: (hotelData) => {
        return new Promise(async (resolve, reject) => {
            hotelData.password = password
            console.log(password);
            db.get().collection(collection.HOTELUSER_COLLECTION).insertOne(hotelData).then((data) => {
                console.log(hotelData);
                resolve(data.ops[0])
            })


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
            from: 'muneesmmm@gmail.com',
            to: username,
            subject: 'Sending Email using Node.js',
            text: 'Thank you for registering your hotel is added successfully you can use this username and password \n username:\t' + username + '\n password:\t' + password + ''
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
    },
    addCity: (hotelData) => {
        return new Promise(async (resolve, reject) => {
            let city = {
                city: hotelData.city
            }
            let data = await db.get().collection(collection.CITY_COLLECTION).findOne({city:hotelData.city})
            console.log("daataa",data);
            if(data){
                compare(hotelData.city,city.city).then((response)=>{
                    console.log("exist");
                })
                
            }else{
            db.get().collection(collection.CITY_COLLECTION).insertOne(city).then((data) => {
                console.log(city);
                resolve(data.ops[0])
                
            })

        }
        })
    },
    deleteHotel: (room) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.HOTELUSER_COLLECTION).removeOne({ _id: objectId(room) }).then((response) => {
                console.log(response)
                resolve(response)
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
    updateCity: (id, cityData) => {
        
        return new Promise((resolve, reject) => {
            db.get().collection(collection.CITY_COLLECTION)
                .updateOne({ _id: objectId(id) }, {
                    $set: {
                        city: cityData.city
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
    getcityDatails: () => {
        return new Promise(async(resolve, reject) => {
            let city=await db.get().collection(collection.CITY_COLLECTION).find({}).toArray()
                resolve(city)
            
        })
    }
    ,
    getCity: (id) => {
        return new Promise(async(resolve, reject) => {
            db.get().collection(collection.CITY_COLLECTION).findOne({_id: objectId(id) }).then((city)=>{
                resolve(city)
            })
                
            
        })
    },
    getroomDatails: () => {
        return new Promise(async (resolve, reject) => {
            let data=await db.get().collection(collection.ROOMBOOKING_COLLECTION).find({}) .toArray()
            console.log("/********************/",data);         
            resolve(data)
        })

    } ,
    deleteRoom: (room) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ROOMBOOKING_COLLECTION).removeOne({ _id: objectId(room) }).then((response) => {
                console.log(response)
                resolve(response)
            })
        })
    }



}



