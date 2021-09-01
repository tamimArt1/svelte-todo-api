import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import cors from "cors";
import dotenv from "dotenv";

// app configs
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// MongoDB
const client = new MongoClient(process.env.CONNECTION_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Make connection once and use it
async function run() {
  try {
    await client.connect();
    app.listen(process.env.PORT || 9000);
    const database = client.db("todo");
    const todos = database.collection("todos");

    // Endpoints
    app.get("/", async (req, res) => {
      res.send("todo crud api");
    });

    app.get("/todos", async (req, res) => {
      const allTodos = await todos.find({}).toArray();
      res.send(allTodos);
    });

    app.post("/todos", async (req, res) => {
      const newTodo = req.body;
      await todos.insertOne(newTodo);
      res.send("Insert done");
    });

    app.patch("/todo/:id", async (req, res) => {
      const id = ObjectId(req.params.id);
      const { text, completed } = req.body;
      await todos.updateOne(
        { _id: id },
        { $set: { text: text, completed: completed } }
      );
      res.end();
    });

    app.delete("/todo/:id", async (req, res) => {
      const id = ObjectId(req.params.id);
      await todos.deleteOne({ _id: id });
      res.end();
    });
  } finally {
  }
}
run().catch(console.dir);
client.close();
