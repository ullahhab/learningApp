export default function handler(req, res) {
  console.log("Request received! Method:", req.method);
  
  // Simple response
  res.status(200).json({
    message: "GET request received successfully",
    method: req.method,
    query: req.query, // will show any query parameters
  });
}