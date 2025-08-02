import express from "express";
import cors from 'cors'
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import {  apifyRouter } from "./router/apify.js";
dotenv.config();
const server = express();
server.use(cookieParser());
server.use(express.static(path.join(__dirname, "build")));

const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_URL
];

server.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
server.use(express.json());
server.use('/',apifyRouter)
server.get('/', (req, res) => {
  res.json({ succes: "done" });
})

server.listen(process.env.PORT, () => {
  console.log("server started");
  console.log("http://localhost:8080/");
})