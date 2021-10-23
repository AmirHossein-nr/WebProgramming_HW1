const crypto = require("crypto");
const redis = require("redis");
const express = require("express");
const app = express();
const client = redis.createClient({
    host:"",
    port:"",
    password:""
});

app.use(express.json());
app.use(express.urlencoded({extened: true}));
app.post("/node/sha256", async (req, res) =>{
    let userString = req.body["user-input"];
    let hash = crypto.createHash("sha256").update(`${userString}`).digest('hex');
    await client.set(hash, userString);
});

app.get("/node/sha256", async (req, res) => {
    let userString = await client.get(req.param.hash);
    res.send(JSON.stringify({"user-input": userString}));
})
