import express,{Request, Response, Send} from "express";

import "dotenv/config"

const app = express();

app.get("/", (request:Request, response: Response) => {
    response.send("hello");
    return
})

app.listen( process.env.PORT, () => {
    console.log(`Running on Port ${process.env.PORT}`);
});
