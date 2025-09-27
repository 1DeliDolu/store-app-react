const fs = require("node:fs/promises");

const { v4: generateId } = require("uuid");

const { NotFoundError } = require("../util/errors");

async function readData() {
  const data = await fs.readFile("db.json", "utf8");
  return JSON.parse(data);
}

async function writeData(data) {
  await fs.writeFile("db.json", JSON.stringify(data));
}

async function get(username) {
  const data = await readData();

  const user = data.users.find((p) => p.username === username);

  return user;
}

async function add(user) {
  const data = await readData();
  // ensure stored user keeps address fields and other props
  data.users.unshift({
    id: generateId(),
    username: user.username,
    email: user.email,
    password: user.password,
    firstname: user.firstname || null,
    lastname: user.lastname || null,
    street: user.street || null,
    houseNumber: user.houseNumber || null,
    postalCode: user.postalCode || null,
    city: user.city || null,
    phone: user.phone || null,
  });
  await writeData(data);
}

exports.get = get;
exports.add = add;
