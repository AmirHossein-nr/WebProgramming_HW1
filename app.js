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
app.use(express.urlencoded());
app.route("/node/sha256")
    .get(async (req, res) => {
        let userString = await client.get(req.param.hash);
        res.send(JSON.stringify({"message": userString}));
    })
    .post(async (req, res) =>{
        let userString = req.body["message"];
        let hash = crypto.createHash("sha256").update(`${userString}`).digest('hex');
        await client.set(hash, userString);
    });
app.route("*")
    .get((req, res) => res.status(404).send(404))
    .post((req, res) => res.status(404).send(404));
    
app.listen(3000);