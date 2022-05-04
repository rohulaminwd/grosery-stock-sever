const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const objectId = require('mongodb').ObjectId;
const app = express();

const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.00g3e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try{
    await client.connect();
    const productCollection = client.db("groceryItem").collection("products");
    //get method
    app.get('/product', async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    })
    app.get('/product/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: objectId(id)}
      const product = await productCollection.findOne(query);
      res.send(product);
    })

    // post method
    app.post('/product', async (req, res) => {
      const newProduct = req.body;
      console.log('adding new user', newProduct);
      const result = await productCollection.insertOne(newProduct)
      res.send(result)
    })

    // update user put method
    app.put('/product/:id', async (req, res) => {
      const id = req.params.id;
      const updateProduct = req.body;
      const filter = {_id: objectId(id)};
      const options = {upsert: true};
      const updatedDoc = {
        $set: {
          name: updateProduct.name,
          email: updateProduct.email,
          password: updateProduct.password
        }
      };
      const result = await userCollection.updateOne(filter, updatedDoc, options);
      res.send(result)
    })

    // delete user method
    app.delete('/product/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: objectId(id)}
      const result = await productCollection.deleteOne(query);
      res.send(result);
    })

  }finally{}
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Server is running')
})

app.listen(port, () => {
    console.log(`Server is running at ${port}`)
})