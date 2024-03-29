const express = require('express');
const cors = require('cors');
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors())
app.use(express.json())




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASS}@cluster0.pr3rbd0.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  useNewUrlParser:true,
  useUnifiedTopology:true,
  maxPoolSize:10,
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect((err) => {
        if(err){
            console.log(err);
            return
        }
    });

    const productCollection = client.db("emajhonsimpleDB").collection("products");

    app.get('/products', async(req,res) => {

        const page = parseInt(req.query.page) || 0;
        const limit = parseInt(req.query.limit) || 10;
        const skip = page * limit;
        const result = await productCollection.find().skip(skip).limit(limit).toArray();
        res.send(result)
    })


    app.get("/totalProducts", async (req,res) => {
        const result = await productCollection.estimatedDocumentCount();
        res.send({totalProducts:result})
    })


    app.post("/productById", async (req,res) => {
        const ids = req.body;
        const objectsIds = ids.map(id => new ObjectId(id));
        const query = {_id: {$in: objectsIds}}
        const result = await productCollection.find(query).toArray();
        res.send(result)
    })




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get("/",(req,res) => {
    res.send("Hello ema-jhon server running on this")
})

app.listen(port,() => {
    console.log(`ema-jhon server run this port ${port}`);
})
