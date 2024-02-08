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
    await PayPerClick(req);
    res.status(200).json({ url: linkEntry.link });
  } else {
    res.status(404).json({ message: "Not Found" });
  }
}

async function checkDatabase(ip, url) {
  const client = await MongoClient.connect(
    "mongodb+srv://rgb:admin@nodeexpress.ps2xp1a.mongodb.net/?retryWrites=true&w=majority"
  );
  const db = client.db("MAC");

  const exists = await db.collection("clicks").findOne({ ip: ip, link: url });

  await client.close();

  return !exists;
}
async function PayPerClick(req) {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  const url = req.url;

  const shouldMakePayment = await checkDatabase(ip, url);

  console.log("shouldMakePayment", shouldMakePayment);
  console.log("ip", ip);
  console.log("url", url);

  if (shouldMakePayment) {
    await makePayment();
    await saveToDatabase(ip, url);
  }

  return { props: {} };
}

async function makePayment() {
  console.log("Payment made");
}

async function saveToDatabase(ip, url) {
  const client = await MongoClient.connect(
    "mongodb+srv://nodeexpress.ps2xp1a.mongodb.net/?retryWrites=true&w=majority"
  );
  const db = client.db("MAC");

  // await db.collection("clicks").insertOne({ link: url, ip: ip });
  console.log("saved to database" + ip + " " + url);

  await client.close();
}
