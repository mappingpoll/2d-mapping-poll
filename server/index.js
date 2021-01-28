import express from 'express';
import cors from 'cors';
import mongodb from 'mongodb';
const mongoClient = mongodb.MongoClient;

const DB_URI = `mongodb+srv://nilueps:<password>@cluster0.asztd.mongodb.net/<dbname>?retryWrites=true&w=majority`



const app = express();

app.use(cors())
app.use(express.json())

app.get('/', (request, response) => {
    response.send('hello world')
})

app.post('/form', (request, response) => {
    // response.send('form request received')
    console.log(request.body)
    response.json(request.body)
})

app.listen(3000, () => {
    console.log('listening at http://localhost:3000')
})