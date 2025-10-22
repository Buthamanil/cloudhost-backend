import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URL;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Only POST allowed");
  }

  const { name, email, message } = req.body;

  try {
    await client.connect();
    const db = client.db("cloudhostdb");
    const collection = db.collection("messages");
    await collection.insertOne({ name, email, message, time: new Date() });

    return res.status(200).send("Message stored successfully!");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error saving message");
  } finally {
    await client.close();
  }
}
