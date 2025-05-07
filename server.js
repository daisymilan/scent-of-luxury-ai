
// Server entry point - Run with: node server.js
const app = require('./src/server/webhook-handler.js');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Voice authentication webhook handler running on port ${PORT}`);
});
