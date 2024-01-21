/* This file creates a Mongoose model called that is used for
all communication between app and database. */

/* Import mongoose. */
import mongoose from "mongoose";

/* Define database URL. */
const url = process.env.MONGODB_URI;

/* Connect to database URL. */
console.log("Connecting to", url);
mongoose
  .connect(url)
  .then((_result) => {
    console.log("Connected to DB.");
  })
  .catch((error) => {
    console.log("Error connecting to DB", error.message);
  });

/* Create a schema. */
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
  },
  number: {
    type: String,
    validate: (input) => {
      return /(^\d{2}-\d{6})|(^\d{3}-\d{5})/.test(input);
    },
  },
});

/* Set schema. That is, convert everything to json/plain text. */
personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

/* Export model. */
const Person = mongoose.model("Person", personSchema);
export default Person;
