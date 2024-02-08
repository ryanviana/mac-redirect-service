import { MongoClient } from "mongodb";

const connection = {};

async function dbConnect() {
  if (connection.isConnected) {
    return;
  }

  const client = await MongoClient.connect(
    "mongodb+srv://rgb:admin@nodeexpress.ps2xp1a.mongodb.net/?retryWrites=true&w=majority"
  );
  const db = client.db("MAC");
  connection.isConnected = db;
}

export default dbConnect;
