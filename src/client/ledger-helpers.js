import HDKey from "hdkey";

import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import TransportWebHID from "@ledgerhq/hw-transport-webhid";

import AvaxApp from "@obsidiansystems/hw-app-avalanche";

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

export const signHash = async (hash) => {
  return await avaxApp.signHash(
    "m/44'/9000'/0"
    ["/"],
    "00000000000000000000000000000000"
  );
};

const getHDKey = (address) => {
  const hd = new HDKey();
  hd.publicKey = address.public_key;
  hd.chainCode = address.chain_code;
  return JSON.stringify(hd);
};

export const getAddresses = async () => {
  // X and P chain derived path
  const extendedPublicKey = await avaxApp.getWalletExtendedPublicKey("m/44'/9000'/0'");
  // const extendedPublicKeyC = await avaxApp.getWalletExtendedPublicKey("m/44'/60'/0'/0/0");
  
  const resp = await fetch("http://localhost:3000/address", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: getHDKey(extendedPublicKeyC),
  });

  return await resp.json();
};


