import "dotenv/config";
import * as jose from "jose";

const secret = new TextEncoder().encode(process.env.JWT_KEY);
const alg = "HS256";

interface CreateToken {
  payload: jose.JWTPayload;
  exp: string;
}

export const CreateToken = (v: CreateToken): Promise<string> => {
  return new jose.SignJWT(v.payload)
    .setProtectedHeader({
      alg: alg,
    })
    .setExpirationTime(v.exp)
    .sign(secret);
};

export const VerifyJwt = (token: string) => {
  return jose.jwtVerify(token, secret);
};

export const DecodeJwt = (token: string) => {
  return jose.decodeJwt(token);
};
