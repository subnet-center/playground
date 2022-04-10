import {
  createWallet,
  createUnsignedHash,
  getInfo,
  getWalletAddress,
  getAddress,
  signHash,
} from "./ledger-helpers";
import { ConsoleInDom } from "console-in-dom";

const $start = document.querySelector("#start");
const $info = document.querySelector("#info");
const $address = document.querySelector("#address");
const $sign = document.querySelector("#sign");
const $console = document.querySelector("#console");

const domConsole = ConsoleInDom.render($console);

$start.addEventListener("click", async () => {
  createWallet();
  $start.disabled = true;

  $info.addEventListener("click", async () => {
    const walletInfo = await getInfo();
    domConsole.log(walletInfo);
  });

  $info.disabled = false;

  $address.addEventListener("click", async () => {
    const address = await getAddress();
    domConsole.log(address);
  });

  $address.disabled = false;

  $sign.addEventListener("click", async () => {
    const address = await getAddress();
    const message = {
      email: "jeroen@jeroenwever.com",
      addressX: address,
    };
    const hash = await createUnsignedHash(message);
    const signedHash = await signHash(hash);
    
    domConsole.log(signedHash);
  });

  $sign.disabled = false;
});

// const message = await signHash();

// console.log(await signHash());
