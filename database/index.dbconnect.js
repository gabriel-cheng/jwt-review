/* eslint-disable indent */
const mongoose = require("mongoose");
const app = require("express")();
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
mongoose.set("strictQuery", false);

function mongoConnect() {
    mongoose.connect(
        `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.wvthnwq.mongodb.net/?retryWrites=true&w=majority`
    )
    .then(() => {
        app.listen(27017, () => {
            console.log("Banco conectado com sucesso, rodando na porta 27017!");
        });
    })
    .catch((err) => {
        console.log({mongo_connect_err: err});
    });
}

module.exports = mongoConnect;