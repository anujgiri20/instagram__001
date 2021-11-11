import express, { response } from "express";
import { MongoClient } from "mongodb";
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
   const {id} = request.params.id;
   const client = await createconnections();
   const user= await client.db("gymDatabase").collection("data").deleteOne({id:id})
   
   console.log(user)
   response.send(user)
   

});
app.patch("/chestupdate/:id", async(request, response) => {
   console.log(request.params);

   const {id} = request.params.id;
   const client = await createconnections();
   const newdata=  request.body;
   const user= await client.db("gymDatabase").collection("data").updateOne({id:id},{$set:newdata})
   
   // console.log(user)
   response.send(user)
   console.log(newdata)
   

});





//bicep data collection
app.get("/bicepsdata", async (request, response) => {
   const client = await createconnections();
   const result = await client.db("gymDatabase").collection("biceps").find({}).toArray();
   response.send(result)
});
app.post("/biceps", async (request, response) => {
   const client = await createconnections();
   const add_data = request.body

   const result = await client.db("gymDatabase").collection("biceps").insertMany(add_data)
   console.log(add_data, result)
   response.send(result)
});




//back data collection
app.get("/backdata", async (request, response) => {
   const client = await createconnections();
   const result = await client.db("gymDatabase").collection("back").find({}).toArray();
   response.send(result)
});
app.post("/back", async (request, response) => {
   const client = await createconnections();
   const add_data = request.body

   const result = await client.db("gymDatabase").collection("back").insertMany(add_data)
   console.log(add_data, result)
   response.send(result)
});






//Triceps data collection
app.get("/Tricepsdata", async (request, response) => {
   const client = await createconnections();
   const result = await client.db("gymDatabase").collection("Triceps").find({}).toArray();
   response.send(result)
});
app.post("/Triceps", async (request, response) => {
   const client = await createconnections();
   const add_data = request.body

   const result = await client.db("gymDatabase").collection("Triceps").insertMany(add_data)
   console.log(add_data, result)
   response.send(result)
});




//Shoulder data collection
app.get("/Shoulderdata", async (request, response) => {
   const client = await createconnections();
   const result = await client.db("gymDatabase").collection("Shoulder").find({}).toArray();
   response.send(result)
});
app.post("/Shoulder", async (request, response) => {
   const client = await createconnections();
   const add_data = request.body

   const result = await client.db("gymDatabase").collection("Shoulder").insertMany(add_data)
   console.log(add_data, result)
   response.send(result)
});




//Legs data collection
app.get("/Legsdata", async (request, response) => {
   const client = await createconnections();
   const result = await client.db("gymDatabase").collection("Legs").find({}).toArray();
   response.send(result)
});
app.post("/Legs", async (request, response) => {
   const client = await createconnections();
   const add_data = request.body

   const result = await client.db("gymDatabase").collection("Legs").insertMany(add_data)
   console.log(add_data, result)
   response.send(result)
});




//Abdominal data collection
app.get("/Abdominaldata", async (request, response) => {
   const client = await createconnections();
   const result = await client.db("gymDatabase").collection("Abdominal").find({}).toArray();
   response.send(result)
});
app.post("/Abdominal", async (request, response) => {
   const client = await createconnections();
   const add_data = request.body

   const result = await client.db("gymDatabase").collection("Abdominal").insertMany(add_data)
   console.log(add_data, result)
   response.send(result)
});




//Combined data collection
app.get("/Combineddata", async (request, response) => {
   const client = await createconnections();
   const result = await client.db("gymDatabase").collection("Combined").find({}).toArray();
   response.send(result)
});
app.post("/Combined", async (request, response) => {
   const client = await createconnections();
   const add_data = request.body

   const result = await client.db("gymDatabase").collection("Combined").insertMany(add_data)
   console.log(add_data, result)
   response.send(result)
});





//Cardio data collection
app.get("/Cardiodata", async (request, response) => {
   const client = await createconnections();
   const result = await client.db("gymDatabase").collection("Cardio").find({}).toArray();
   response.send(result)
});
app.post("/Cardio", async (request, response) => {
   const client = await createconnections();
   const add_data = request.body

   const result = await client.db("gymDatabase").collection("Cardio").insertMany(add_data)
   console.log(add_data, result)
   response.send(result)
});





app.listen(PORT, () => console.log("server is started in port 1234"));




