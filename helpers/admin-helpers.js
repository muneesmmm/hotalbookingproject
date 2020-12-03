const { resolve, reject } = require('promise')
const bcrypt = require('bcrypt')
var db=require('../config/connection')
var collection=require('../config/collections')
const { response } = require('express')
var objectId=require('mongodb').ObjectID
var generator = require('generate-password');
var nodemailer = require('nodemailer');
 
var password = generator.generate({
    length: 10,
    numbers: true
});
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
        var username=reciever.email
        var  password=reciever.password
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
            text: 'Thank you for registering your hotel is added successfully you can use this username and password \n username:\t'+username+'\n password:\t'+password+''
                };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
                responseData.message="hotel registered succussfully"
                console.log(responseData.message);
            }
        });
    },
    deleteProduct:(hotel)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.HOTELUSER_COLLECTION).removeOne({_id:objectId(hotel)}).then((response)=>{
                console.log(response)
                resolve(response)
            })
        })
    }
            


}


   
       