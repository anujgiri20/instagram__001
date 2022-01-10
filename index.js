import express, { response } from "express";
import mongodb, { MongoClient } from "mongodb";
import jsonwebtoken from "jsonwebtoken";
import  jwt  from "jsonwebtoken";
import verify from "jsonwebtoken";
import bcrypt from "bcrypt";
import cors from "cors"
import dotenv from "dotenv"
const app = express()
dotenv.config();
const PORT = process.env.PORT

async function createconnections() {

   const MONGO_URL = process.env.MONGO_URL
   const client = new MongoClient(MONGO_URL)
   await client.connect();
   console.log("connected")
   return client;
}
app.use(express.json())
app.use(cors())



const validateToken = async (req, res, next) => {

   try {
     const token = req.header("access-token");
     if (!token) return res.status(403).send("Access denied.");
 
     const decoded = await jwt.verify(token,"SECRET");
     req.user = decoded;
     next();
 } catch (error) {
     res.status(400).send("Invalid token");
 }
   };
 


//registration
app.post("/register" , async (request,response)=>{
   const client= await createconnections()
  
  const {name , email , username , password ,icon} = request.body;

  const result1 = await client.db("gymDatabase").collection("userdata").findOne({username:username})
  if(!result1)
  {
   const salt = await bcrypt.genSalt(10)
   const hashpass =await bcrypt.hash(password,salt)
   
   const result = await client.db("gymDatabase").collection("userdata").insertOne({name , email , username , hashpass , icon})
   console.log(result)
   response.send("registration successful")
  }
  else{
      response.send("user already exists")
  }

})







//login code
app.post("/login" , async(request,response)=>{
   const client= await createconnections()
  
  const{username,password} = request.body;
  
  const result = await client.db("gymDatabase").collection("userdata").findOne({username:username})

const username_send = result.username
const usericon = result.icon

  if(!result) 
  {
      response.send("user not exist")
  }
  else
  {
  const hash = result.hashpass
 
  const ispasswordmatch = await bcrypt.compare(password,hash)

   if(!ispasswordmatch){
       response.send("username and password not match")
   }
   else{
 

       const accessToken =  await jwt.sign(
           { id: result.username },
           "SECRET",
           {
             expiresIn: "2h"
           }
         );
       response.json({messege:"valid logged in",token:accessToken,username_send,usericon})

       

   }
}
});



















//chest data collection
app.get("/chestdata",validateToken, async (request, response) => {
   const client = await createconnections();
   const result = await client.db("gymDatabase").collection("data").find({}).toArray();
   response.header("Access-Control-Allow-Origin","*")
   response.header("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept")
   response.send(result)
});
app.post("/chest", async (request, response) => {
   const client = await createconnections();
   const add_data = request.body

   const result = await client.db("gymDatabase").collection("data").insertMany(add_data)
   console.log(add_data, result)
   response.send(result)
});
app.delete("/deletechest/:id", async(request, response) => {
   const id = request.params.id;
   const client = await createconnections();
   const user= await client.db("gymDatabase").collection("data").deleteOne({_id: new mongodb.ObjectId(id)})
   console.log(id)
   console.log(user)
   response.send(user)
   
});
app.patch("/chestupdate/:id", async(request, response) => {
   console.log(request.params);

   const id = request.params.id;
   const client = await createconnections();
   
   const user= await client.db("gymDatabase").collection("data").updateOne({_id:new mongodb.ObjectId(id)},{$set:{"data.bi.img":request.body.img,"data.bi.name":request.body.name,"data.bi.description":request.body.description,"data.bi.steps":request.body.steps,"data.bi.Tips":request.body.Tips}})
   // console.log(user)
   response.send(user)

 });










app.listen(PORT, () => console.log("server is started in port 1234"));




