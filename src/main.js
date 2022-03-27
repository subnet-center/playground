import "core-js/actual";
import { listen } from "@ledgerhq/logs";

import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import TransportWebHID from "@ledgerhq/hw-transport-webhid";

import Avalanche from "@obsidiansystems/hw-app-avalanche";
import HDKey from "hdkey";

//Display the header in the div which has the ID "main"
const initial =
  "<h1>Connect your Nano and open the Avalanche app. Click anywhere to start...</h1>";
const $main = document.getElementById("main");
$main.innerHTML = initial;

async function getTransport() {
  try {
    return await TransportWebHID.create();
  } catch (e) {
    return await TransportWebUSB.create();
  }
}

document.body.addEventListener("click", async () => {
  const avalanche = new Avalanche(await getTransport());

  const getWalletId = async () => {
    return await avalanche.getWalletId();
  };

  const signHash = async () => {
    return await avalanche.signHash(
      "44'/9000'/0'/0/0",
      ["/"],
      "00000000000000000000000000000000"
    );
  };

  const getVersion = async () => {
    return await avalanche.getAppConfiguration();
  };

  const getAddress = async () => {
    return await avalanche.getWalletExtendedPublicKey("44'/9000'/0'/1/0");
  };

  // console.log(await getWalletId());
  // console.log(await getVersion());
  const address = await getAddress();
  // const message = await signHash();

  let hd = new HDKey();
  hd.publicKey = address.public_key;
  hd.chainCode = address.chain_code;

  console.log(JSON.stringify(hd));
  // console.log(await s  ignHash());
});
