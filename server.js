import express from 'express';
import dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';
import cors from 'cors';
import bodyParser from 'body-parser';

dotenv.config();

// App & Database
const app = express();
const port = 3000;
const url =  process.env.MONGO_URI
const dbName = process.env.DB_NAME;

const client = new MongoClient(url);

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB and start server
await client.connect();
console.log("Connected to MongoDB");
const db = client.db(dbName);
const collection = db.collection('passwords');

// Get all passwords
app.get('/', async (req, res) => {
    try {
        const passwords = await collection.find({}).toArray();
        res.json(passwords);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Save a password
app.post('/', async (req, res) => {
    try {
        const password = req.body;
        const result = await collection.insertOne(password);
        res.json({ success: true, result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a password by id
app.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        res.json({ success: true, result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
