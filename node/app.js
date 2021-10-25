const crypto = require("crypto");
const redis = require("redis");
const express = require("express");
const app = express();
const port =3000
const client = redis.createClient({
    host:"localhost",
    port:"6379",
});
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.route("/ip/node/sha256")
    .get(async (req, res) => {
        console.log(req.query.hash)
        // let userString = await client.get(req.param.hash);
        // if (userString === null) 
        //     res.status(404).send(404);
        // else res.send(JSON.stringify({"message": userString}));
        res.status(200).send(200)
    })
    .post(async (req, res) =>{
        let userString = req.body["message"];
        let hash = crypto.createHash("sha256").update(`${userString}`).digest('hex');
        await client.set(hash, userString);
        res.status(200).send(200)
    });
app.route("*")
    .get((req, res) => res.status(404).send(404))
    .post((req, res) => res.status(404).send(404));
app.listen(port,()=>{
    console.log(`listening at port ${port}`)
})
    
