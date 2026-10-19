import jwt from "jsonwebtoken";

const generateToken = (id, authVersion = 0) => {
  return jwt.sign({ id, authVersion }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token remains valid for 30 days
  });
};

export default generateToken;
