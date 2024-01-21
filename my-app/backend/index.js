/* Import dependencies */
import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";

/* Import custom mongoose module */
import Person from "./models/person.js";

/* Create express object */
const app = express();

/* Create middleware errorHandler to handle all errors.
Uses function next(). Enable last in script. */
const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "Malformatted id." });
  } else if (error.name === "ValidationError") {
    return response.status(400).send({
      error:
        "Name must be min 3 characters. Number must be format 123-12345 or 12-123456.",
    });
  }
  next(error);
};

/* Enable built-in middleware "json-parser" for parsing POST-requests. */
app.use(express.json());

/* Enable and configure external middleware "morgan" for console logging.
Very useful! */
morgan.token("body", (request, _response) => {
  const body = JSON.stringify(request.body);
  return body;
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

/* Enable cors */
app.use(cors());

/* Enable built-in middleware static.  */
app.use(express.static("build"));

/* Get all entries in route "/api/persons". */
app.get("/persons", (_request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

/* Get info at "/info". */
app.get("/info", (_request, response) => {
  Person.countDocuments({}, (err, count) => {
    console.log(`Number of persons: ${count}`);
    const date = new Date();

    response.send(`Phonebook has info on ${count} persons. <br>
            ${date}`);
  });
});

/* Get person by "id". If "id" is wrong, respond with status-code 404. */
app.get("/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

/* Delete person by "id". */
app.delete("/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((_result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

/* Add new person. Requires json-parser to be enabled further up. */
app.post("/persons", (request, response, next) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({ error: "No name." });
  }

  if (!body.number) {
    return response.status(400).json({ error: "No number." });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
});

/* Update person number. */
app.put("/persons/:id", (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

/* Enable middleware errorHandler. Must always be last of middlewares. */
app.use(errorHandler);

/* Listen to port for connections/requests. */
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
