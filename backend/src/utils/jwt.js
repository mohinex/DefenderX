import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "eurosia_access_secret_token_unlocked_9921_key";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "eurosia_refresh_secret_token_revoked_7821_key";
const ACCESS_EXP = process.env.JWT_ACCESS_EXPIRED || "15m";
const REFRESH_EXP = process.env.JWT_REFRESH_EXPIRED || "7d";

export function generateAccessToken(payload) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXP });
}

export function generateRefreshToken(payload) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXP });
}

export function verifyAccessToken(token) {
  try {
    return jwt.verify(token, ACCESS_SECRET);
  } catch (err) {
    return null;
  }
}

export function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, REFRESH_SECRET);
  } catch (err) {
    return null;
  }
}
