import express from 'express';
import mongodb from 'mongodb';
const mongoClient = mongodb.MongoClient;

const DB_URI = `mongodb+srv://nilueps:<password>@cluster0.asztd.mongodb.net/<dbname>?retryWrites=true&w=majority`



const app = express();

app.get('/', (request, response) => {
    response.send('hello world')
})

app.listen(3000, () => {
    console.log('listening at http://localhost:3000')
})