import {
  createWallet,
  createUnsignedHash,
  getAddress,
  signHash,
  verifyHash,
} from "./ledger-helpers";
import { ConsoleInDom } from "console-in-dom";
import { init } from "express/lib/application";

const $address = document.querySelector("#address");
const $console = document.querySelector("#console");
const $email = document.querySelector("#email");
const $sign = document.querySelector("#sign");
const $verify = document.querySelector("#verify");

const domConsole = ConsoleInDom.render($console);

$address.addEventListener("click", async () => {
  await createWallet();

  const address = await getAddress();
  domConsole.log(address);
});

$sign.addEventListener("click", async () => {
  await createWallet();

  const message = $email.value;

  if (!message) alert("Please fill in an e-mail");

  const hash = createUnsignedHash(message);
  const signature = await signHash(hash);

  domConsole.log(signature);

  $verify.addEventListener("click", async () => {
    const address = verifyHash(message, signature);
    domConsole.log(address);
  });

  $verify.disabled = false;
});
