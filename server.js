const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

// Proxy all traffic to WhatsApp Web
app.use(
  "/",
  createProxyMiddleware({
    target: "https://web.whatsapp.com",
    changeOrigin: true,
    ws: true,          // WebSockets support
    secure: true,      // ensure HTTPS
    onProxyReq: (proxyReq, req, res) => {
      // Rewrite headers so WhatsApp sees requests as coming from its own domain
      proxyReq.setHeader("Host", "web.whatsapp.com");
      proxyReq.setHeader("Origin", "https://web.whatsapp.com");
      proxyReq.setHeader("User-Agent", req.headers["user-agent"]);
      
      // Forward cookies if you want persistent sessions
      if (req.headers.cookie) {
        proxyReq.setHeader("Cookie", req.headers.cookie);
      }
    },
    onProxyRes: (proxyRes, req, res) => {
      // Optional: fix any redirects coming from WhatsApp
      if (proxyRes.headers.location) {
        proxyRes.headers.location = proxyRes.headers.location.replace(
          "https://web.whatsapp.com",
          `https://${req.headers.host}`
        );
      }
    },
  })
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`WhatsApp Web proxy running on port ${PORT}`));
