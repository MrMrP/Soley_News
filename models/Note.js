var mongoose = require("mongoose");

// To save a reference to the Schema constructor //
var Schema = mongoose.Schema;

// We will now use the Schema constructor to create a new UserSchema object //
var NoteSchema = new Schema({
    title: String,
    body: String
});

// Here's how we create our model from the above schema, using mongoose's model method //
var Note = mongoose.model("Note", NoteSchema);

// Export the Article model //
module.exports = Note;