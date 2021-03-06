const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
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

    // AUTH
    app.post('/login', async (req, res) => {
      const user = req.body;
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: 'id'
      });
      res.send({accessToken});
    })
    // SERVICE API
    //get method
    app.get('/product', async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    })
    app.get('/myProduct', async (req, res) => {
      const email = req.query.email
      const query = { email: email };
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
      const quantity = req.body;
      const stock = quantity.stock;
      console.log(quantity)
      const filter = {_id: objectId(id)};
      const options = {upsert: true};
      const updatedDoc = {
        $set: {
          stock
        }
      };
      const result = await productCollection.updateOne(filter, updatedDoc, options);
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