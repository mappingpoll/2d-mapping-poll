import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongodb from "mongodb";
import mongoose from "mongoose";
import session from "express-session";
import connectMongo from "connect-mongo";

// load environment variables
dotenv.config();
const port = process.env.PORT || "3000";

// connect to DB
const {
  MONGO_HOSTNAME,
  MONGO_PORT,
  MONGO_INITDB_DATABASE,
  MONGO_INITDB_ROOT_USERNAME,
  MONGO_INITDB_ROOT_PASSWORD,
} = process.env;

const URL = `mongodb://localhost:${MONGO_PORT}`
mongoose.connect(URL, {
    user: MONGO_INITDB_ROOT_USERNAME,
    pass: MONGO_INITDB_ROOT_PASSWORD,
    dbName: MONGO_INITDB_DATABASE,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log("mongoose successfully connected to database 🎉");
})


// const mongoClient = mongodb.MongoClient;
// const MongoStore = connectMongo(session)

//const DB_URI = `mongodb+srv://nilueps:<password>@cluster0.asztd.mongodb.net/<dbname>?retryWrites=true&w=majority`

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.get("/", (request, response) => {
  response.send("hello world");
});

app.post("/form", (request, response) => {
  // response.send('form request received')
  response.json(request.body);
});

app.listen(port, () => {
  console.log("listening at http://localhost:3000");
});
