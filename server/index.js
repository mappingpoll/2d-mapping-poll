import express from 'express';

const app = express();

app.get('/', (request, response) => {
    response.send('hello world')
})

app.listen(3000, () => {
    console.log('listening at http://localhost:3000')
})