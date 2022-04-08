const express = require("express");
const cors = require("cors");
const { getAddresses } = require("./helpers");

const app = express();

app.use(express.json());
app.use(cors());

app.post("/address", async (request, response) => {
  const { xpub } = request.body;
  const addresses = await getAddresses({ publicKey: xpub });
  response.send(addresses);
});

app.listen(3000);
