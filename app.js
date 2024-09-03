// app.js
const express = require('express');
const mongodb = require('mongodb');

const app = express();
const port = 3001;

// Route handler for root URL
app.get('/', async (req, res) => {
  let client;
  try {
    // Create a new MongoClient
    const mongoClient = new mongodb.MongoClient("mongodb://127.0.0.1/", { useUnifiedTopology: true });
    client = await mongoClient.connect();
    
    // Access the database and collection
    const db = client.db('meals');
    const collection = db.collection('order_meals');

    // Perform aggregation and convert to array
    const result = await collection.aggregate([{ $sample: { size: 100 } }]).toArray();
    
    // Send the result as the response
    res.status(200).send(result);
  } catch (e) {
    console.error(e);
    res.status(500).send('Internal Server Error');
  } finally {
    if (client) {
      await client.close();
    }
  }
});

// Start the server
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
