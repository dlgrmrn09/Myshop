const express = require("express");
const cors = require("cors");
const pool = require("./db.js");

const router = express.Router();
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES

router.get("/all-products", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const skip = parseInt(req.query.skip) || 0;

    const que = `SELECT * FROM products ORDER BY id LIMIT $1 OFFSET $2`;
    const values = [limit, skip];
    const result = await pool.query(que, values);

    const totalResult = await pool.query(`SELECT COUNT(*) FROM products`);
    const total = parseInt(totalResult.rows[0].count);

    const data = result.rows;

    res.status(200).json({ data, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/all-products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const que = `SELECT * FROM products WHERE id = $1`;
    const values = [id];
    const result = await pool.query(que, values);
    const data = result.rows[0];

    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/add-product", async (req, res) => {
  try {
    const {
      thumbnail,
      title,
      description,
      category,
      price,
      discountPercentage,
      rating,
      stock,
    } = req.body;
    const que =
      "INSERT INTO products (thumbnail, title, description, category, price, discount_percentage, rating, stock) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *";
    const values = [
      thumbnail,
      title,
      description,
      category,
      price,
      discountPercentage,
      rating,
      stock,
    ];
    const result = await pool.query(que, values);
    const data = result.rows[0];
    res.status(201).json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/update-product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      thumbnail,
      title,
      description,
      category,
      price,
      discountPercentage,
      rating,
      stock,
    } = req.body;
    const que =
      "UPDATE products SET thumbnail = $2, title = $3, description = $4, category = $5, price = $6, discount_percentage = $7, rating = $8, stock = $9 WHERE id = $1 RETURNING *";
    const values = [
      id,
      thumbnail,
      title,
      description,
      category,
      price,
      discountPercentage,
      rating,
      stock,
    ];
    const result = await pool.query(que, values);
    const data = result.rows[0];
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/delete-product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const que = "DELETE FROM products WHERE id = $1 RETURNING *";
    const values = [id];
    const result = await pool.query(que, values);
    const data = result.rows[0];
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use("/api", router);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
