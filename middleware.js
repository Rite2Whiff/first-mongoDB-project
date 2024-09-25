const jwt = require("jsonwebtoken");
const JWT_SECRET = "mohit@12345";

const auth = (req, res, next) => {
  const token = req.headers.token;

  const decodedData = jwt.verify(token, JWT_SECRET);

  if (decodedData) {
    req.userId = decodedData.userId;
    next();
  } else {
    res.status(403).send({
      message: "Invalid credentials",
    });
  }
};

module.exports = {
  auth,
  JWT_SECRET,
};
