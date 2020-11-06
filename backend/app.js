// App init
const express = require("express");
const app = express();

// Database Config
const mongoose = require("./database/mongoose");

// Models
const Book = require("./database/models/book");

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
app.get("/books", (req, res) => {
    Book.find({})
        .then((books) => res.send(books))
        .catch((error) => console.log(error));
});

app.post("/books/new", (req, res) => {
    new Book({
        title: req.body.title,
        description: req.body.description,
        publish_date: req.body.publish_date,
        authors: req.body.authors,
    })
        .save()
        .then((books) => res.send(books))
        .catch((error) => console.log(error));
});

app.get("/books/:id", (req, res) => {
    Book.find({ _id: req.params.id })
        .then((books) => res.send(books))
        .catch((error) => console.log(error));
});

app.patch("/books/:id", (req, res) => {
    Book.findOneAndUpdate({ _id: req.params.id }, { $set: req.body })
        .then((books) => res.send(books))
        .catch((error) => console.log(error));
});

app.delete("/books/:id", (req, res) => {
    Book.findOneAndDelete({ _id: req.params.id })
        .then((books) => res.send(books))
        .catch((error) => console.log(error));
});

app.listen(3000, () => console.log("Server is Connected on port 3000"));
