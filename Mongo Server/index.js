const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e97ot.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
//For Database user connection Start
//For Database user connection
async function run() {
    try {
      await client.connect();
      const database = client.db("onlineShop");
      const productCollection = database.collection("products");
      const orderCollection = database.collection("orders");
    // create a document to insert data from here start
    //   const doc = {
    //     name: "Monirul Islam",
    //     email: "monirecebd@gmail",
    //     occupation: "Freelancer"
    //   }
    //   const result = await usersCollection.insertOne(doc);
    //   console.log(`A document was inserted with the _id: ${result.insertedId}`);
    // create a document to insert data from here End

      //POST API: (Add Order) Sending data from React UI to Mongodb Start
      app.post('/orders', async(req, res) => {
        const order = req.body;
        // const result = await usersCollection.insertOne(newUser);
        console.log('order', order);
        res.json('Order Processed')
      });
      //POST API: (Add Order) Sending data from React UI to Mongodb End

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

      //Details API: Get Details from user id from Backend Start
    //   app.get('/users/:id', async(req, res) => {
    //     const id = req.params.id;
    //     const query = { _id: ObjectId(id) };
    //     const user = await productsCollection.findOne(query);
    //     console.log('Load user with id: ', id);
    //     res.send(user);
    //   });
      //Details API: Get Details from user id from Backend End

      //UPDATE API: from Mongodb by React website Start
    //   app.put('/users/:id', async(req, res) => {
    //     const id = req.params.id;
    //     const updatedUser = req.body;
    //     const filter = { _id: ObjectId(id) };
    //     const options = {upsert: true};
    //     const updateDoc = {
    //       $set: {
    //         name: updatedUser.name,
    //         email: updatedUser.email
    //       }
    //     };
    //     const result = await productsCollection.updateOne(filter, updateDoc, options)
    //     console.log('Updating user', req);
    //     res.json(result);
    //   });
      //UPDATE API: from Mongodb by React website End

      //DELETE API: From React website Start
      // Import in the top : const ObjectId = require('mongodb').ObjectId;
    //   app.delete('/users/:id', async(req, res) => {
    //     const id = req.params.id;
    //     const query = { _id: ObjectId(id) };
    //     const result = await productsCollection.deleteOne(query);
    //     console.log('Deleting user with id', result);
    //     res.json(result);
    //   });
      //DELETE API: From React website End

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
