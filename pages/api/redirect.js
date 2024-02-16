import {
  getAnnouncementById,
  getReferenceByReference,
  getLinkByReference,
  newIpClick,
  thousandClicks,
  resetUnpaidCount,
  addNewClick,
} from "@/mac-api";
import PayPerClickJSON from "../../abis/PayPerClick.json";
import { Account, Contract, RpcProvider } from "starknet";

export default async function handler(req, res) {
  const { reference } = req.query;
  if (reference) {
    const referenceRegister = await getReferenceByReference(reference);
    console.log("referenceRegister:", referenceRegister);
    const link = await getLinkByReference("/" + reference);
    if (link) {
      await PayPerClick(req, referenceRegister);
      res.status(200).json({ url: link });
    }
  }
}

async function PayPerClick(req, referenceRegister) {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const url = req.url;
  const reference = "/" + req.query;
  const announcement = await getAnnouncementById(
    referenceRegister.announcementId
  );
  console.log("announcement:", announcement);

  const shouldMakePayment =
    (await newIpClick(ip, url)) && (await thousandClicks(reference));

  if (shouldMakePayment) {
    await makePayment(announcement);
    await resetUnpaidCount();
    await addNewClick(ip, url);
  }

  return { props: {} };
}

async function makePayment(announcement) {
  {
    console.log("Making payment for announcement: ", announcement);
    // Adicione o JSON do PayPerClick na pasta "abis"
    const privateKey = "PK_HERE_FROM_ENV";
    const accountAddress = "ADDRESS_HERE_FROM_ENV";
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
        "advertiserAddres_HERE",
        "creatorAddress_HERE",
        1 //"announcementINDEX_HERE"
      );

      console.log("Payment made");
    } catch (error) {
      console.error("Error creating campaign:", error);
    }
  }
}
