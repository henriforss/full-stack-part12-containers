const express = require("express");
const router = express.Router();
const { getAsync } = require("../redis");

/* GET statistics. */
router.get("/", async (_req, res) => {
  const num = await getAsync("number");
  res.json({ added_todos: num });
});

module.exports = router;
