const Book = require('../models/book');
const Log = require('../models/logs');

// Create and Save a new Book
exports.create = (req, res) => {
    new Book({
        title: req.body.title,
        description: req.body.description,
        publish_date: req.body.publish_date,
        authors: req.body.authors,
        created_date: new Date()
    })
        .save()
        .then((book) => {
            new Log({
                book_id: book.id,
                action:  `"${book.title}" has been created`,
                change_date: Date()
            }).save().then((log) => {
                res.send({
                    message: 'Book successfully created',
                    action: 'Ok',
                    code: 200
                })
            })
        })
        .catch((error) => console.log(error));
};

// Retrieve and return all Books from the database.
exports.findAll = (req, res) => {
    Book.find({})
        .sort( { created_date: -1 } )
        .then((books) => res.send(books))
        .catch((error) => console.log(error));
};

// Find a single note with a BookId
exports.findOne = (req, res) => {
    Book.find({ _id: req.params.id })
        .then((books) => res.send(books))
        .catch((error) => console.log(error));
};

// Update a Book identified by the BookId in the request
exports.update = (req, res) => {
    Book.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, {useFindAndModify: false})
        .then((book) => {
            for (const param in req.body) {
                new Log({
                    book_id: book.id,
                    action:  `${param.toUpperCase()}: "${book[param]}" has changed to: "${req.body[param]}"`,
                    change_date: Date()
                }).save();
            }
            res.send({
                message: 'Book successfully updated',
                action: 'Ok',
                code: 200
            })
        })
        .catch((error) => console.log(error));
};

// Delete a book with the specified bookId in the request
exports.delete = (req, res) => {
    Book.findOneAndDelete({ _id: req.params.id })
    .then((books) => {
        new Log({
            book_id: books.id,
            action:  `"${books.title.toUpperCase()}" has been deleted.`,
            change_date: Date()
        }).save();
        res.send({
            message: 'Book successfully deleted',
            action: 'Ok',
            code: 200
        })
    })
    .catch((error) => console.log(error));
};