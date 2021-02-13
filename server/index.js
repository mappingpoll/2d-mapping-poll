import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongodb from "mongodb";
import mongoose from "mongoose";
import session from "express-session";
import connectMongo from "connect-mongo";
const MongoStore = connectMongo(session);
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

const URL = `mongodb://localhost:${MONGO_PORT}`;
mongoose.connect(URL, {
  user: MONGO_INITDB_ROOT_USERNAME,
  pass: MONGO_INITDB_ROOT_PASSWORD,
  dbName: MONGO_INITDB_DATABASE,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

const respondantSchema = new mongoose.Schema({
  ip: String,
  email: String,
});

const Respondant = mongoose.model("Respondant", respondantSchema);

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("mongoose successfully connected to database 🎉");
});

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(
  session({
    secret: "secret",
    store: new MongoStore({ mongooseConnection: db }),
  })
);

app.get("/", (request, response) => {
  response.send("hello world");
});

app.post("/form", (request, response) => {
  console.log(`request received from ${request.ip}`);
  console.log(request.session);
  try {
    const user = new Respondant(); //identifyUser(request);
    if (user.error != null) throw new Error(user.error);
    user.save((err, user) => {
      if (err != null) throw new Error(err);
      console.log(`Succesfully added respondant to DB : ${user}`);
      response.json(request.body);
    });
  } catch (error) {
    console.error(error);
    response.json(error.message);
  }
});

app.listen(port, () => {
  console.log("listening at http://localhost:3000");
});
