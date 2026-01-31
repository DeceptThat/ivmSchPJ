const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get('/api/status', (req, res) => {
  res.json({ message: "Node.js server is officially running!" });
});

app.listen(PORT, () => {
  console.log(`Server is breathing on http://localhost:${PORT}`);
});