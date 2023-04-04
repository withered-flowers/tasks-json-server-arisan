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
  objPeserta.saldo = faker.finance.amount(10000, 10000000, 0);
  objPeserta.createdAt = new Date();
  objPeserta.updatedAt = new Date();

  dataPeserta.push(objPeserta);
}

for (let i = 0; i < 100; i++) {
  let objArisan = {};

  objArisan.id = i + 1;
  objArisan.nama = faker.commerce.productName();
  objArisan.poolUang = faker.finance.amount(1000000, 100000000, 0);
  objArisan.createdAt = new Date();
  objArisan.updatedAt = new Date();

  dataArisan.push(objArisan);
}

for (let i = 0; i < 1000; i++) {
  let objHadiah = {};

  objHadiah.id = i + 1;
  objHadiah.PesertaId = faker.datatype.number({
    min: 1,
    max: 10,
  });
  objHadiah.ArisanId = faker.datatype.number({
    min: 1,
    max: 100,
  });
  objHadiah.reward = faker.finance.amount(500000, 1000000, 0);
  objHadiah.createdAt = new Date();
  objHadiah.updatedAt = new Date();

  dataHadiah.push(objHadiah);
}

dataOutput.peserta = dataPeserta;
dataOutput.arisan = dataArisan;
dataOutput.hadiah = dataHadiah;

fs.writeFile("./data.json", JSON.stringify(dataOutput, null, 2), (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Success write to data.json");
  }
});
