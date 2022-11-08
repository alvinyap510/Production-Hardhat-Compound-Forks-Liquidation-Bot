const fs = require("fs");

const accountsInteractedWithProtocol = require("./informations/accountsInteractedWithProtocol.js");

const accountsInteractedWithProtocolFiltered = [
  ...new Set(accountsInteractedWithProtocol),
];

console.log(accountsInteractedWithProtocol);
console.log(accountsInteractedWithProtocolFiltered);

let message = "";

for (let i = 0; i < accountsInteractedWithProtocolFiltered.length; i++) {
  message += `"`;
  message += accountsInteractedWithProtocolFiltered[i];
  message += `",`;
}
fs.appendFile(
  "scripts/Cronos/Tectonic/informations/accountsInteractedWithProtocolFiltered.js",
  message,
  function (err) {
    if (err) throw err;
  }
);
