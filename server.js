const express = require('express');
const path = require('path');
const app = express();

// Serve all static files from public/
app.use(express.static(path.join(__dirname, 'public')));

// Any unknown route returns index.html (single-page app style)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n--- Smart Device Web UI ---`);
  console.log(`🌐 Serving static files on port ${PORT}`);
});
