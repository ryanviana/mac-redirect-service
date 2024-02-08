import dbConnect from "@/mongodb";
import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  await dbConnect();

  const { reference } = req.query;

  const client = await MongoClient.connect(
    "mongodb+srv://rgb:admin@nodeexpress.ps2xp1a.mongodb.net/?retryWrites=true&w=majority"
  );
  const db = client.db("MAC");

  const linkEntry = await db
    .collection("references")
    .findOne({ reference: `/${reference}` });

  await client.close();

  if (linkEntry) {
    res.status(200).json({ url: linkEntry.link });
  } else {
    res.status(404).json({ message: "Not Found" });
  }
}
