const fs = require("fs");
const bcrypt = require("bcryptjs");
const { faker } = require("@faker-js/faker");

let dataOutput = {};

let dataPeserta = [];
let dataArisan = [];
let dataHadiah = [];

for (let i = 0; i < 10; i++) {
  let objPeserta = {};

  objPeserta.id = i + 1;
  objPeserta.nama = faker.name.fullName();
  objPeserta.username = faker.internet.userName().toLowerCase();
  objPeserta.email = faker.internet.email().toLowerCase();
  objPeserta.password = bcrypt.hashSync("123456", 10);
  objPeserta.saldo = faker.datatype.number({
    min: 10000,
    max: 1000000,
  });

  dataPeserta.push(objPeserta);
}

for (let i = 0; i < 50; i++) {
  let objArisan = {};

  objArisan.id = i + 1;
  objArisan.nama = faker.commerce.productName();
  objArisan.poolUang = faker.datatype.number({
    min: 2000000,
    max: 100000000,
  });

  dataArisan.push(objArisan);
}

for (let i = 0; i < 100; i++) {
  let objHadiah = {};

  objHadiah.id = i + 1;
  objHadiah.entrantId = faker.datatype.number({
    min: 1,
    max: 10,
  });
  objHadiah.clubId = faker.datatype.number({
    min: 1,
    max: 50,
  });
  objHadiah.reward = faker.datatype.number({
    min: 1000000,
    max: 2000000,
  });

  dataHadiah.push(objHadiah);
}

dataOutput.entrants = dataPeserta;
dataOutput.clubs = dataArisan;
dataOutput.gifts = dataHadiah;

fs.writeFile("./data.json", JSON.stringify(dataOutput, null, 2), (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Success write to data.json");
  }
});
