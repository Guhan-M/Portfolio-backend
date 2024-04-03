const express=require("express")
const cors=require("cors")
const body_parser=require("body-parser")
const HTTP_SERVER=express()
const PORT=process.env.PORT||8000;
const HOST_NAME="0.0.0.0"

const routes=require('./app')

HTTP_SERVER.use(cors())
HTTP_SERVER.use(body_parser.json())

HTTP_SERVER.use("/",routes)


HTTP_SERVER.listen(PORT,HOST_NAME,()=>{console.log(`Server Run with ${PORT}`)
})
