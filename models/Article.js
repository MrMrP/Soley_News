var mongoose = require("mongoose");

// To save a reference to the Schema constructor //
var Schema = mongoose.Schema;

// We will now use the Schema constructor to create a new UserSchema object //
var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

// Here's how we create our model from the above schema, using mongoose's model method //

var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model //
module.exports = Article;

