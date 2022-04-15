const HdScanner = require("@avalabs/avalanche-wallet-sdk").HdScanner;
const BIP32Factory = require("bip32").default;

const getAddresses = async ({ publicKey }) => {
  const secp256k1 = await import("tiny-secp256k1");
  const bip32 = BIP32Factory(secp256k1);

  const node = bip32.fromBase58(publicKey);
  const scanner = new HdScanner(node, false);
  const addressP = scanner.getAddressP();
  const addressX = scanner.getAddressX();
  
  return {
    addressP,
    addressX,
  };
};

module.exports = {
  getAddresses,
};


// m/44'/9000'/0'
// m/44'/60'/0'/0/0


// MAIN X: X-avax1xjytpw2y698vkhc5tlj8mc36ece5ue99vqs5hw
// FUJI X: X-fuji1cz7wqzg7z3lqyfx6eln5jw8ztgs369txgch2e2

// MAIN P: P-avax1xjytpw2y698vkhc5tlj8mc36ece5ue99vqs5hw
// FUJI P: P-fuji1cz7wqzg7z3lqyfx6eln5jw8ztgs369txgch2e2

// MAIN C: 0x175f3dbc83e9dd3e6235378a7fdbea6a8bc1ad51
// FUJI C: 0x175f3dbc83e9dd3e6235378a7fdbea6a8bc1ad51