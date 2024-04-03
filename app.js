const mongodb =require("mongodb")
const {MongoClient}=require("mongodb")
const express = require('express');
const router = express.Router();
const nodemailer = require("nodemailer")
const dotenv = require("dotenv")
dotenv.config()
const client=new MongoClient(process.env.DB_URL)
router.get('/',async(req, res) => {
    await client.connect()
    try{
      const db= await client.db(process.env.DB_Name)
      let skills=await db.collection("skills").find().toArray()
      let projects= await db.collection("projects").find().toArray()
      res.status(200).send({
        message:"Data fetch success",
        skills,projects
      })
    }
    catch(error){
        res.status(500).send({
            message:"internal server error"||error.message
    })
    }
    finally{
        client.close()
    }
});

router.post('/createskills',async(req, res) => {
    await  client.connect()
    try{
        const db= await client.db(process.env.DB_Name)
         await db.collection("skills").insertOne(req.body)
        res.status(201).send({
          message:"Data created success"
        })
    }
    catch(error){
        res.status(500).send({
            message:"internal server error"||error.message
    })
    }
    finally{
        client.close()
    }
});

router.post('/createproject',async(req, res) => {
    await  client.connect()
    try{
        const db= await client.db(process.env.DB_Name)
         await db.collection("projects").insertMany(req.body)
         res.status(201).send({
          message:"Data created success",
          success:true
        })
    }
    catch(error){
        res.status(500).send({
            message:"internal server error"||error.message     
    })
    }
    finally{
        client.close()
    }
});

router.post('/createlinkcontact',async(req,res) => {
    await client.connect() 
    const name=req.body.name
    const email=req.body.email
    const content=req.body.content
    try{ 
        const db= await client.db(process.env.DB_Name)
         let user=await db.collection("linkcontact").insertOne(req.body)
         if(user){ 
            const transporter = nodemailer.createTransport({
                service:'gmail',
                host: "smtp.gmail.email",
                port: 587,
                secure: false, // Use `true` for port 465, `false` for all other ports
                auth: {
                  user: process.env.MAIL,
                  pass: process.env.PASSWORD,
                },
              });
            
              const mailOptions = {
                from: {
                    name:'Guhan',
                    address : process.env.MAIL
                }, to: ["guhan6guhan@gmail.com"], // list of receivers // user request 
                subject: "Client information", // Subject line
                text: "Hello User your have received data form client", // plain text body
                html: ` <h1>Message form client</h1>
                        <h2>Name:${name}</h2>
                        <h2>Email: ${email}</h2>
                        <h2>Content: ${content}</h2>`, // html body
              }
            
              const sendMail = async(transporter,mailOptions)=>{
                try {
                    await transporter.sendMail(mailOptions);
                    console.log("Email has been send successfully");
                } catch (error) {
                    console.error(error);
                }
              }
            
              sendMail(transporter,mailOptions)
            
         res.status(201).json({
          success:"true",
          message:"Data created success"
        })
    }
}
    catch(error){
            res.status(500).send({
            message:"internal server error"||error.message
    })
    }
    finally{
        client.close()
    }
});

module.exports = router;