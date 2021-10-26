import express, { Application, Request, Response } from "express";
import {
  getInfo
} from "./BankSlip";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/boleto/:numBoleto", getInfo);

export default app;
