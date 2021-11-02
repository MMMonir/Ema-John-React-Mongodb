const express = require('express');
const { MongoClient } = require('mongodb');
//Require for Access token
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


var admin = require("firebase-admin");
//Firebase admin initialization
var serviceAccount = require('./life-care-1e467-firebase-adminsdk-5w6c7-8fc8ac44b9.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e97ot.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function verifyToken(req, res, next) {
  if (req.headers?.authorization?.startsWith('Bearer ')){
    const idToken = req.headers.authorization.split('Bearer ')[1];
    try{
      const decodedUser = await admin.auth().verifyIdToken(idToken);
      req.decodedUserEmail = decodedUser.email;
    }
    catch{}
  }
  next();
}

async function run() {
    try {
      await client.connect();
      const database = client.db("onlineShop");
      const productCollection = database.collection("products");
      const orderCollection = database.collection("orders");

      //(Add Order) Sending data from React UI to Mongodb Start
      app.post('/orders', async(req, res) => {
        const order = req.body;
        //For order created Time
        order.createAt = new Date();
        const result = await orderCollection.insertOne(order);
        res.json(result)
      });
      //(Add Order) Sending data from React UI to Mongodb End

      //(Get Order) from Mongodb database to React Start
      app.get('/orders', verifyToken, async(req, res) => {
        const email = req.query.email;
        if(req.decodedUserEmail === email){
            const query = {email: email};
            const cursor = orderCollection.find(query);
            const orders = await cursor.toArray();
            res.json(orders);
        }
        else{
          res.status(401).json({message: 'User not Authorized'})
        }
        
      });
      //(Get Order) from Mongodb database to React End

      //GET API: from Mongodb to React website Start
      app.get('/products', async(req, res) => {
        const cursor = productCollection.find({});
        const page = req.query.page;
        const size = parseInt(req.query.size);
        let products;
        const count = await cursor.count();
        if(page){
            products = await cursor.skip(page*size).limit(size).toArray();
        }
        else{
            products = await cursor.toArray();
        }
        

        //limit(10) means You will get only 10 products
        // const users = await cursor.limit(10).toArray();
        res.send({
          count,
          products
        })
      });
      //GET API: from Mongodb to React website End

      //Use POST to get data by keys Start
      app.post('/products/byKeys', async (req, res) => {
          const keys = req.body;
          const query = { key: { $in: keys } }
          const products = await productCollection.find(query).toArray();
          res.send(products);
      });
      //Use POST to get data by keys End

      //POST API: Sending data from React UI to Mongodb Start
      app.post('/orders', async(req, res) => {
        const order = req.body;
        const result = await orderCollection.insertOne(order);
        res.json(result);
      });
      //POST API: Sending data from React UI to Mongodb End

    }
    finally {
      // await client.close();
    }
  }
  run().catch(console.dir);
//For Database user connection End


app.get('/', (req, res) => {
    res.send('Running my server')
});
app.listen(port, () =>{
    console.log('Running server on port', port)
});
