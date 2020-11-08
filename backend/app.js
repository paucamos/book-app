// App init
const express = require("express");
const app = express();

// Database Config
const mongoose = require("./database/mongoose");

// Models
const Book = require("./database/models/book");
const Log = require("./database/models/logs");

// Controllers
const BooksController = require("./database/controllers/books-controller");

// Return a JSON
app.use(express.json());

/*
    CORS - Cross Origin Request Security
    localhost:3000 - backend API
    localhost:4200 - front-end
*/
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

/*
    Methods and Routes
*/
app.get("/books", BooksController.findAll);

app.post("/books/new", BooksController.create);

app.get("/books/:id", BooksController.findOne);

app.patch("/books/:id", BooksController.update);

app.delete("/books/:id", BooksController.delete);

app.get("/logs", (req, res) => {
    Log.find({}).sort({change_date: -1})
        .then((logs) => res.send(logs))
        .catch((error) => console.log(error));
});

app.listen(3000, () => console.log("Server is Connected on port 3000"));