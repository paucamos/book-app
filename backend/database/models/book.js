const moongoose = require("mongoose");

const BookSchema = new moongoose.Schema({
    title: {
        type: String,
        trim: true,
        minlength: 3,
    },
    description: {
        type: String,
        trim: true,
        minlength: 5,
    },
    publish_date: {
        type: Date,
    },
    authors: {
        type: String,
        trim: true,
        minlength: 2,
    },
    created_date: {
        type: Date
    }
});

const Book = moongoose.model("Book", BookSchema);
module.exports = Book;
