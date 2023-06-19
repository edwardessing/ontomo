const fetch = require("cross-fetch");
const dotenv = require("dotenv")
dotenv.config()

const API_KEY = process.env.WHEREBY_API_KEY;
const BASE_URL = "https://api.whereby.dev/v1";

const data = {
  endDate: "2099-02-18T14:23:00.000Z",
};


async function createRoom() {
  return fetch(`${BASE_URL}/meetings`, {
      method: "POST",
      headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
  });
}


exports.createRoom = (request, response) => {
  createRoom().then(async res => {
    if (res.status >= 400) response.json("Something is wrong.")
    const data = await res.json();
    console.log("Room URL:", data.roomUrl);
    response.json(data);
  });
};
