import express, { response } from "express";
import mongodb, { MongoClient } from "mongodb";

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
//chest data collection
app.get("/chestdata", async (request, response) => {
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




