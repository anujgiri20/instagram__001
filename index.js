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







//bicep data collection
app.get("/bicepsdata", async (request, response) => {
   const client = await createconnections();
   const result = await client.db("gymDatabase").collection("biceps").find({}).toArray();
    response.header("Access-Control-Allow-Origin","*")
   response.header("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept")
   
   response.send(result)
});
app.post("/biceps", async (request, response) => {
   const client = await createconnections();
   const add_data = request.body

   const result = await client.db("gymDatabase").collection("biceps").insertMany(add_data)
   console.log(add_data, result)
   response.send(result)
});
app.delete("/deletebiceps/:id", async(request, response) => {
   const id = request.params.id;
   const client = await createconnections();
   const user= await client.db("gymDatabase").collection("biceps").deleteOne({_id: new mongodb.ObjectId(id)})
   console.log(user)
   response.send(user)
   
});
app.patch("/bicepsupdate/:id", async(request, response) => {
   console.log(request.params);

   const id = request.params.id;
   const client = await createconnections();
   
   const user= await client.db("gymDatabase").collection("biceps").updateOne({_id:new mongodb.ObjectId(id)},{$set:{"data.bi.img":request.body.img,"data.bi.name":request.body.name,"data.bi.description":request.body.description,"data.bi.steps":request.body.steps,"data.bi.Tips":request.body.Tips}})
   // console.log(user)
   response.send(user)

 });




//back data collection
app.get("/backdata", async (request, response) => {
   const client = await createconnections();
   const result = await client.db("gymDatabase").collection("back").find({}).toArray();
    response.header("Access-Control-Allow-Origin","*")
   response.header("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept")
   response.send(result)
});
app.post("/back", async (request, response) => {
   const client = await createconnections();
   const add_data = request.body

   const result = await client.db("gymDatabase").collection("back").insertMany(add_data)
   console.log(add_data, result)
   response.send(result)
});
app.delete("/deleteback/:id", async(request, response) => {
   const id = request.params.id;
   const client = await createconnections();
   const user= await client.db("gymDatabase").collection("back").deleteOne({_id: new mongodb.ObjectId(id)})
   console.log(user)
   response.send(user)
   
});
app.patch("/backupdate/:id", async(request, response) => {
   console.log(request.params);

   const id = request.params.id;
   const client = await createconnections();
   
   const user= await client.db("gymDatabase").collection("back").updateOne({_id:new mongodb.ObjectId(id)},{$set:{"data.bi.img":request.body.img,"data.bi.name":request.body.name,"data.bi.description":request.body.description,"data.bi.steps":request.body.steps,"data.bi.Tips":request.body.Tips}})
   // console.log(user)
   response.send(user)

 });





//Triceps data collection
app.get("/Tricepsdata", async (request, response) => {
   const client = await createconnections();
   const result = await client.db("gymDatabase").collection("Triceps").find({}).toArray();
    response.header("Access-Control-Allow-Origin","*")
   response.header("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept")
   response.send(result)
});
app.post("/Triceps", async (request, response) => {
   const client = await createconnections();
   const add_data = request.body

   const result = await client.db("gymDatabase").collection("Triceps").insertMany(add_data)
   console.log(add_data, result)
   response.send(result)
});
app.delete("/deleteTriceps/:id", async(request, response) => {
   const id = request.params.id;
   const client = await createconnections();
   const user= await client.db("gymDatabase").collection("Triceps").deleteOne({_id: new mongodb.ObjectId(id)})
   console.log(user)
   response.send(user)
   
});
app.patch("/Tricepsupdate/:id", async(request, response) => {
   console.log(request.params);

   const id = request.params.id;
   const client = await createconnections();
   
   const user= await client.db("gymDatabase").collection("Triceps").updateOne({_id:new mongodb.ObjectId(id)},{$set:{"data.bi.img":request.body.img,"data.bi.name":request.body.name,"data.bi.description":request.body.description,"data.bi.steps":request.body.steps,"data.bi.Tips":request.body.Tips}})
   // console.log(user)
   response.send(user)

 });


//Shoulder data collection
app.get("/Shoulderdata", async (request, response) => {
   const client = await createconnections();
   const result = await client.db("gymDatabase").collection("Shoulder").find({}).toArray();
    response.header("Access-Control-Allow-Origin","*")
   response.header("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept")
   response.send(result)
});
app.post("/Shoulder", async (request, response) => {
   const client = await createconnections();
   const add_data = request.body

   const result = await client.db("gymDatabase").collection("Shoulder").insertMany(add_data)
   console.log(add_data, result)
   response.send(result)
});
app.delete("/deleteShoulder/:id", async(request, response) => {
   const id = request.params.id;
   const client = await createconnections();
   const user= await client.db("gymDatabase").collection("Shoulder").deleteOne({_id: new mongodb.ObjectId(id)})
   console.log(user)
   response.send(user)
   
});
app.patch("/Shoulderupdate/:id", async(request, response) => {
   console.log(request.params);

   const id = request.params.id;
   const client = await createconnections();
   
   const user= await client.db("gymDatabase").collection("Shoulder").updateOne({_id:new mongodb.ObjectId(id)},{$set:{"data.bi.img":request.body.img,"data.bi.name":request.body.name,"data.bi.description":request.body.description,"data.bi.steps":request.body.steps,"data.bi.Tips":request.body.Tips}})
   // console.log(user)
   response.send(user)

 });


//Legs data collection
app.get("/Legsdata", async (request, response) => {
   const client = await createconnections();
   const result = await client.db("gymDatabase").collection("Legs").find({}).toArray();
    response.header("Access-Control-Allow-Origin","*")
   response.header("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept")
   response.send(result)
});
app.post("/Legs", async (request, response) => {
   const client = await createconnections();
   const add_data = request.body

   const result = await client.db("gymDatabase").collection("Legs").insertMany(add_data)
   console.log(add_data, result)
   response.send(result)
});
app.delete("/deleteLegs/:id", async(request, response) => {
   const id = request.params.id;
   const client = await createconnections();
   const user= await client.db("gymDatabase").collection("Legs").deleteOne({_id: new mongodb.ObjectId(id)})
   console.log(user)
   response.send(user)
   
});
app.patch("/Legsupdate/:id", async(request, response) => {
   console.log(request.params);

   const id = request.params.id;
   const client = await createconnections();
   
   const user= await client.db("gymDatabase").collection("Legs").updateOne({_id:new mongodb.ObjectId(id)},{$set:{"data.bi.img":request.body.img,"data.bi.name":request.body.name,"data.bi.description":request.body.description,"data.bi.steps":request.body.steps,"data.bi.Tips":request.body.Tips}})
   // console.log(user)
   response.send(user)

 });


//Abdominal data collection
app.get("/Abdominaldata", async (request, response) => {
   const client = await createconnections();
   const result = await client.db("gymDatabase").collection("Abdominal").find({}).toArray();
    response.header("Access-Control-Allow-Origin","*")
   response.header("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept")
   response.send(result)
});
app.post("/Abdominal", async (request, response) => {
   const client = await createconnections();
   const add_data = request.body

   const result = await client.db("gymDatabase").collection("Abdominal").insertMany(add_data)
   console.log(add_data, result)
   response.send(result)
});
app.delete("/deleteAbdominal/:id", async(request, response) => {
   const id = request.params.id;
   const client = await createconnections();
   const user= await client.db("gymDatabase").collection("Abdominal").deleteOne({_id: new mongodb.ObjectId(id)})
   console.log(user)
   response.send(user)
   
});
app.patch("/Abdominalupdate/:id", async(request, response) => {
   console.log(request.params);

   const id = request.params.id;
   const client = await createconnections();
   
   const user= await client.db("gymDatabase").collection("Abdominal").updateOne({_id:new mongodb.ObjectId(id)},{$set:{"data.bi.img":request.body.img,"data.bi.name":request.body.name,"data.bi.description":request.body.description,"data.bi.steps":request.body.steps,"data.bi.Tips":request.body.Tips}})
   // console.log(user)
   response.send(user)

 });



//Combined data collection
app.get("/Combineddata", async (request, response) => {
   const client = await createconnections();
   const result = await client.db("gymDatabase").collection("Combined").find({}).toArray();
    response.header("Access-Control-Allow-Origin","*")
   response.header("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept")
   response.send(result)
});
app.post("/Combined", async (request, response) => {
   const client = await createconnections();
   const add_data = request.body

   const result = await client.db("gymDatabase").collection("Combined").insertMany(add_data)
   console.log(add_data, result)
   response.send(result)
});
app.delete("/deleteCombined/:id", async(request, response) => {
   const id = request.params.id;
   const client = await createconnections();
   const user= await client.db("gymDatabase").collection("Combined").deleteOne({_id: new mongodb.ObjectId(id)})
   console.log(user)
   response.send(user)
   
});
app.patch("/Combinedupdate/:id", async(request, response) => {
   console.log(request.params);

   const id = request.params.id;
   const client = await createconnections();
   
   const user= await client.db("gymDatabase").collection("Combined").updateOne({_id:new mongodb.ObjectId(id)},{$set:{"data.bi.img":request.body.img,"data.bi.name":request.body.name,"data.bi.description":request.body.description,"data.bi.steps":request.body.steps,"data.bi.Tips":request.body.Tips}})
   // console.log(user)
   response.send(user)

 });




//Cardio data collection
app.get("/Cardiodata", async (request, response) => {
   const client = await createconnections();
   const result = await client.db("gymDatabase").collection("Cardio").find({}).toArray();
    response.header("Access-Control-Allow-Origin","*")
   response.header("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept")
   response.send(result)
});
app.post("/Cardio", async (request, response) => {
   const client = await createconnections();
   const add_data = request.body

   const result = await client.db("gymDatabase").collection("Cardio").insertMany(add_data)
   console.log(add_data, result)
   response.send(result)
});
app.delete("/deleteCardio/:id", async(request, response) => {
   const id = request.params.id;
   const client = await createconnections();
   const user= await client.db("gymDatabase").collection("Cardio").deleteOne({_id: new mongodb.ObjectId(id)})
   console.log(user)
   response.send(user)
   
});
app.patch("/Cardioupdate/:id", async(request, response) => {
   console.log(request.params);

   const id = request.params.id;
   const client = await createconnections();
   
   const user= await client.db("gymDatabase").collection("Cardio").updateOne({_id:new mongodb.ObjectId(id)},{$set:{"data.bi.img":request.body.img,"data.bi.name":request.body.name,"data.bi.description":request.body.description,"data.bi.steps":request.body.steps,"data.bi.Tips":request.body.Tips}})
   // console.log(user)
   response.send(user)

 });




//yoga starts
//Cardio data collection
app.get("/yogadata", async (request, response) => {
   const client = await createconnections();
   const result = await client.db("gymDatabase").collection("yoga").find({}).toArray();
    response.header("Access-Control-Allow-Origin","*")
   response.header("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept")
   response.send(result)
});
app.post("/yoga", async (request, response) => {
   const client = await createconnections();
   const add_data = request.body

   const result = await client.db("gymDatabase").collection("yoga").insertMany(add_data)
   console.log(add_data, result)
   response.send(result)
});
app.delete("/deleteyoga/:id", async(request, response) => {
   const id = request.params.id;
   const client = await createconnections();
   const user= await client.db("gymDatabase").collection("yoga").deleteOne({_id: new mongodb.ObjectId(id)})
   console.log(user)
   response.send(user)
   
});
app.patch("/yogaupdate/:id", async(request, response) => {
   console.log(request.params);

   const id = request.params.id;
   const client = await createconnections();
   
   const user= await client.db("gymDatabase").collection("yoga").updateOne({_id:new mongodb.ObjectId(id)},{$set:{"data.bi.img":request.body.img,"data.bi.name":request.body.name,"data.bi.description":request.body.description,"data.bi.steps":request.body.steps,"data.bi.Tips":request.body.Tips}})
   // console.log(user)
   response.send(user)

 });














app.listen(PORT, () => console.log("server is started in port 1234"));




