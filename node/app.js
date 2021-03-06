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
        client.get(req.query.hash,(err,value)=>{
            if(err){
                res.status(404).send(404);
            }
            else if(value===null)
                res.send("this user does not exist!")
            else
                res.send(JSON.stringify({"message": value}));
        })
    })
    .post(async (req, res) =>{
        let userString = req.body["message"];
        let hash = crypto.createHash("sha256").update(`${userString}`).digest('hex');
        await client.set(hash, userString);
        res.status(200).json(`message : ${userString} ///// hash : ${hash}`)
    });
app.route("*")
    .get((req, res) => res.status(404).send(404))
    .post((req, res) => res.status(404).send(404));
app.listen(port,()=>{
    console.log(`listening at port ${port}`)
})
    
