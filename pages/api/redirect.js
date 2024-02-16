const clicksApi = "https://mac-backend-six.vercel.app/clicks";
const referencesApi = "https://mac-backend-six.vercel.app/references";
const announcementApi = "https://mac-backend-six.vercel.app/announcements";

import PayPerClickJSON from "../../abis/PayPerClick.json";
import { Account, Contract, RpcProvider } from "starknet";
require("dotenv").config();

export default async function handler(req, res) {
  const { reference } = req.query;
  if (reference) {
    const referenceRegister = await getReferenceRegister(reference);
    // const link = await getLinkByReference("/" + reference);
    // const reference = "/" + req.query;
    // const link = referenceRegister.link;
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const url = req.url;
    if (link) {
      await PayPerClick(ip, referenceRegister);
      res.status(200).json({ url: referenceRegister.link });
    }
  }
}

async function getReferenceRegister(reference) {
  try {
    const response = await fetch(
      referencesApi + "/get-id-by-reference" + "/" + reference,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Success:", result);
    return result;
  } catch (error) {
    console.error("Error:", error);
  }
}

async function PayPerClick(ip, referenceRegister) {
  let announcement = await findAnnouncementByReference(
    referenceRegister.referenceRegister
  );
  let advertiserAddress = announcement.advertiserWalletAddress;
  let creatorAddress = announcement.creatorWalletAddress;
  let announcementIndex = announcement.starknetIndex;

  const shouldMakePayment =
    (await newIpClick(ip, url)) && (await thousandClicks(reference));

  if (shouldMakePayment) {
    await makePayment(advertiserAddress, creatorAddress, announcementIndex);
    await resetUnpaidCount();
    await addNewClick(ip, url);
  }

  return { props: {} };
}

async function findAnnouncementByReference(reference) {
  try {
    const response = await fetch(announcementApi + "/" + reference, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Success:", result);
    return result;
  } catch (error) {
    console.error("Error:", error);
  }
}

async function getLinkByReference(reference) {
  if (reference === "/undefined") return;

  const body = JSON.stringify({ reference: reference });

  try {
    const response = await fetch(referencesApi + "/get-link-by-reference", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.text();
    console.log("Success:", result);
    return result;
  } catch (error) {
    console.error("Error:", error);
  }
}

async function newIpClick(ip, reference) {
  const body = JSON.stringify({ reference: reference, ip: ip });

  const exists = await fetch(clicksApi + "/ip-already-clicked", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });

  return !exists;
}

async function thousandClicks(reference) {
  const body = JSON.stringify({ reference: reference });

  try {
    const response = await fetch(clicksApi + "/unpaid", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    const data = await response.json();
    console.log("Response:", data);
  } catch (error) {
    console.error("Error:", error);
  }

  return data.hasAtLeastThousandUnpaidClicks;
}

async function resetUnpaidCount() {
  try {
    const response = await fetch(clicksApi + "/reset-unpaid-count", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Success:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function makePayment(
  advertiserAddress,
  creatorAddress,
  announcementIndex
) {
  // Adicione o JSON do PayPerClick na pasta "abis"
  const privateKey = process.env.PRIVATE_KEY;
  const accountAddress = process.env.PUBLIC_KEY;
  const account = new Account(provider, accountAddress, privateKey);
  try {
    const provider = new RpcProvider({
      network: constants.NetworkName.SN_GOERLI,
    });
    const PayPerClickContract = new Contract(
      PayPerClickJSON,
      "0x0565a1b3fa403889aa0bd47656158ec193232b2a2467651e74e08ac4c93eb812",
      provider
    );
    PayPerClickContract.connect(account);

    await PayPerClickContract.payCreator(
      advertiserAddress,
      creatorAddress,
      announcementIndex
    );

    console.log("Payment made");
  } catch (error) {
    console.error("Error creating campaign:", error);
  }
}

async function addNewClick(ip, reference) {
  const body = JSON.stringify({ reference: reference, ip: ip });

  try {
    const response = await fetch(clicksApi, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Success:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}
