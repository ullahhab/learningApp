// pages/api/ai.js
export const config = {
  runtime: "nodejs",
};

export default async function handler(req, res) {
  // Always set CORS headers first
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Main logic
  try {
    if (req.method === "GET") {
      return res.status(200).json({ message: "GET successful" });
    }

    if (req.method === "POST") {
      const body = req.body;
      return res.status(200).json({ message: "POST successful", data: body });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}