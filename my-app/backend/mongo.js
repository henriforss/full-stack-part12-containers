/* Import mongoose. */
const mongoose = require("mongoose")

/* Check if there is a minimum of three command line arguments. */
if (process.argv.length < 3) {
  console.log("Instructions: node <filename> <password> <optional: name to add> <optional: number to add>.")
  process.exit(1)
}

/* Define constants. */
const argPassword = process.argv[2]
const argName = process.argv[3]
const argNumber = process.argv[4]

/* Define database URL. */
const url = `mongodb+srv://numberone:${argPassword}@cluster0.knmh4.mongodb.net/puhelinluettelo?retryWrites=true&w=majority`

/* Connect to database URL. */
mongoose.connect(url)

/* Create a schema. */
const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

/* Create a model. */
const Person = mongoose.model("Person", personSchema)

/* Add new person. */
if (process.argv.length === 5) {
  const person = new Person({
    name: argName,
    number: argNumber
  })
  person.save().then(result => {
    console.log(`Added ${argName} number ${argNumber} to phonebook.`)
    mongoose.connection.close()
  })
}

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log("Phonebook:")
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}

if (process.argv.length === 4 || process.argv.length > 5) {
  console.log("Failure!")
  mongoose.connection.close()

}