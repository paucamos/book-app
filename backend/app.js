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

app.get("/logs/node", async (req, res) => {
    // destructure page and limit and set default values
  const { page = 1, limit = 10 } = req.query;

  try {
    // execute query with page and limit values
    const logs = await Log.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // get total documents in the Posts collection 
    const count = await Log.countDocuments();

    // return response with posts, total pages, and current page
    res.json({
      logs,
      length: Math.ceil(count / limit),
      pageIndex: page  
    });
  } catch (err) {
    console.error(err.message);
  }
    /*
        Log.find({}).sort({change_date: -1})
            .then((logs) => res.send(logs))
            .catch((error) => console.log(error));
    */
});

app.listen(3000, () => console.log("Server is Connected on port 3000"));
