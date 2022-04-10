import bippath from 'bip32-path'
import { Buffer } from "buffer/";
import HDKey from "hdkey";
import createHash from "create-hash";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import TransportWebHID from "@ledgerhq/hw-transport-webhid";

import AvaxApp from "@obsidiansystems/hw-app-avalanche";
const AVA_ACCOUNT_PATH = "m/44'/9000'/0'";
const ADDRESS_PATH = "0/0";

let avaxApp = null;

const getTransport = async () => {
  try {
    return await TransportWebHID.create();
  } catch (e) {
    return await TransportWebUSB.create();
  }
};

export const createWallet = async () => {
  const transport = await getTransport();
  avaxApp = new AvaxApp(transport);
};

export const getInfo = async () => {
  const version = await avaxApp.getAppConfiguration();
  const walletId = await avaxApp.getWalletId();

  return {
    version,
    walletId,
  };
};

export const createUnsignedHash = async (message) => {
  const msg = typeof message === "object" ? JSON.stringify(message) : message;
  const buff = Buffer.from(JSON.stringify(msg));
  return createHash("sha256").update(buff).digest();
};

export const signHash = async (hash) => {
  const addressPath = bippath.fromString(ADDRESS_PATH, false);
  const accountPath = bippath.fromString(AVA_ACCOUNT_PATH);
  console.log(addressPath);
  console.log(accountPath);
  return await avaxApp.signHash(accountPath, [addressPath], hash);
};

const getHDKey = (address) => {
  const hd = new HDKey();
  hd.publicKey = address.public_key;
  hd.chainCode = address.chain_code;
  return JSON.stringify(hd);
};

// export const getWalletAddress = async () => {
//   const walletAddress = await avaxApp.getWalletAddress(`${AVA_ACCOUNT_PATH}${ADDRESS_PATH}`);
//   return walletAddress;
// };

export const getAddress = async () => {
  const extendedPublicKey = await avaxApp.getWalletExtendedPublicKey(
    `${AVA_ACCOUNT_PATH}${ADDRESS_PATH}`
  );

  const resp = await fetch("http://localhost:3000/address", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: getHDKey(extendedPublicKey),
  });

  return await resp.json();
};
