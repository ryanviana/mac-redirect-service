const clicksApi = "https://mac-backend-six.vercel.app/clicks";
const referencesApi = "https://mac-backend-six.vercel.app/references";

export default async function handler(req, res) {
  const { reference } = req.query;
  if (reference) {
    const link = await getLinkByReference("/" + reference);
    if (link) {
      await PayPerClick(req);
      res.status(200).json({ url: link });
    }
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

async function PayPerClick(req) {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  const url = req.url;
  const reference = "/" + req.query;

  const shouldMakePayment =
    (await newIpClick(ip, url)) && (await thousandClicks(reference));

  if (shouldMakePayment) {
    await makePayment();
    await resetUnpaidCount();
    await addNewClick(ip, url);
  }

  return { props: {} };
}

async function makePayment() {
  console.log("Payment made");
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
