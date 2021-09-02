import { MongoClient, ObjectId } from "mongodb";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

async function main() {
  const client = new MongoClient(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    app.listen(process.env.PORT || 9000);
    const collection = client.db("todo").collection("todos");

    // Endpoints
    app.get("/", (req, res) => {
      res.send("todo crud api");
    });

    app.get("/todos", async (req, res) => {
      const allTodos = await collection.find({}).toArray();
      res.send(allTodos);
    });

    app.post("/todos", async (req, res) => {
      const newTodo = req.body;
      await collection.insertOne(newTodo);
      res.send("Insert Done");
    });

    app.patch("/todo/:id", async (req, res) => {
      const id = ObjectId(req.params.id);
      const { text, completed } = req.body;
      await collection.updateOne({ _id: id }, { $set: { text, completed } });
      res.send("Update Done");
    });

    app.delete("/todo/:id", async (req, res) => {
      const id = ObjectId(req.params.id);
      await collection.deleteOne({ _id: id });
      res.send("Delete Done");
    });
  } catch (err) {
    console.error(err);
  }
}

main().catch(console.error);
