const moongoose = require("mongoose");

const LogSchema = new moongoose.Schema({
    book_id: {
        type: String
    },
    action: {
        type: String
    },
    change_date: {
        type: Date
    }
});

module.exports = moongoose.model("logs", LogSchema);
