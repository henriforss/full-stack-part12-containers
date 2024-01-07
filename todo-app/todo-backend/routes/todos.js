const express = require("express");
const { Todo } = require("../mongo");
const router = express.Router();

/* GET todos listing. */
router.get("/", async (_, res) => {
  const todos = await Todo.find({});
  res.send(todos);
});

/* POST todo to listing. */
router.post("/", async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false,
  });
  res.send(todo);
});

// /* GET todo by id. */
// router.get("/:id", (req, res) => {
//   // const todo = await Todo.
//   console.log(req.params.id);

//   res.send("moikka");
// });

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params;
  req.todo = await Todo.findById(id);
  if (!req.todo) return res.sendStatus(404);

  next();
};

/* DELETE todo. */
singleRouter.delete("/", async (req, res) => {
  await req.todo.delete();
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get("/", async (req, res) => {
  try {
    const todo = await req.todo;
    res.send(todo);
  } catch (error) {
    console.log(error);
  }
});

/* PUT todo. */
singleRouter.put("/", async (req, res) => {
  try {
    const infoToUpdate = req.body;
    const updatedTodo = await Todo.findByIdAndUpdate(req.todo, infoToUpdate, {
      new: true,
      useFindAndModify: false,
    });
    res.send(updatedTodo);
  } catch (error) {
    console.log(error);
  }
});

router.use("/:id", findByIdMiddleware, singleRouter);

module.exports = router;
