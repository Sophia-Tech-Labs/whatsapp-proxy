// index.js
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

// Proxy all requests to WhatsApp Web
app.use(
  "/",
  createProxyMiddleware({
    target: "https://web.whatsapp.com",
    changeOrigin: true,
    ws: true, // enables WebSocket support
    secure: true,
    onProxyReq: (proxyReq, req, res) => {
      // Optional: modify headers if needed
      proxyReq.setHeader("User-Agent", req.headers["user-agent"]);
    },
  })
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));

