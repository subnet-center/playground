import { bintools, Buffer } from "@avalabs/avalanche-wallet-sdk";
import bippath from "bip32-path";
import { getPreferredHRP } from "avalanche/dist/utils";
import { KeyPair } from "avalanche/dist/apis/avm";

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

const getHDKey = (address) => {
  const hd = new HDKey();
  hd.publicKey = address.public_key;
  hd.chainCode = address.chain_code;
  return hd;
};

const digestMessage = (msgStr) => {
  const mBuf = Buffer.from(msgStr, "utf8");
  const msgSize = Buffer.alloc(4);
  msgSize.writeUInt32BE(mBuf.length, 0);

  const msgBuf = Buffer.from(
    `\x1AAvalanche Signed Message:\n${msgSize}${msgStr}`,
    "utf8"
  );
  return createHash("sha256").update(msgBuf).digest();
};

export const createWallet = async () => {
  if (avaxApp) return;
  const transport = await getTransport();
  avaxApp = new AvaxApp(transport);
};

export const createUnsignedHash = (message) => {
  return digestMessage(message);
};

export const signHash = async (hash) => {
  const addressPath = bippath.fromString(ADDRESS_PATH, false);
  const accountPath = bippath.fromString(AVA_ACCOUNT_PATH);

  const sigMap = await avaxApp.signHash(accountPath, [addressPath], hash);
  const signed = sigMap.get(ADDRESS_PATH);

  return bintools.cb58Encode(signed);
};

export const verifyHash = (message, signature) => {
  const digest = digestMessage(message);
  const digestHex = digest.toString("hex");
  const digestBuff = Buffer.from(digestHex, "hex");

  const networkId = 1; // avax
  // const networkId = 5; // fuji

  const hrp = getPreferredHRP(networkId);
  const keypair = new KeyPair(hrp, "P");

  const signedBuff = bintools.cb58Decode(signature);

  const pubKey = keypair.recover(digestBuff, signedBuff);
  const addressBuff = KeyPair.addressFromPublicKey(pubKey);

  const addressP = bintools.addressToString(hrp, "P", addressBuff);

  return { addressP };
};

export const getAddress = async () => {
  const extendedPublicKey = await avaxApp.getWalletExtendedPublicKey(
    `${AVA_ACCOUNT_PATH}/${ADDRESS_PATH}`
  );

  const networkId = 1; // avax
  // const networkId = 5; // fuji

  const hrp = getPreferredHRP(networkId);
  const keypair = new KeyPair(hrp, "P");

  const addressBuff = KeyPair.addressFromPublicKey(
    extendedPublicKey.public_key
  );

  const addressP = bintools.addressToString(hrp, "P", addressBuff);

  return { addressP };

  // const resp = await fetch("http://localhost:3000/address", {
  //   method: "POST",
  //   headers: {
  //     Accept: "application/json",
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify(getHDKey(extendedPublicKey)),
  // });

  // return await resp.json();
};
