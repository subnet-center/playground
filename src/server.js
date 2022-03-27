const HdScanner = require("@avalabs/avalanche-wallet-sdk").HdScanner;
const bip32 = require("bip32");

let BIP32Factory = require("bip32").default;
// tiny-secp256k1 v2 is ES module and must be imported, not required
// (This requires v14 of node or greater)
// But as long as you implement the interface, any library is fine
import("tiny-secp256k1")
  .then((ecc) => BIP32Factory(ecc))
  .then((bip32) => {
    let node = bip32.fromBase58("key.from.ledger.goes.here");
    let scanner = new HdScanner(node, false);
    let addressP = scanner.getAddressP();

    console.log(addressP);
  });
