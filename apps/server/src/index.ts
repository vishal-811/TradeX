import express, { Request, Response } from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req: Request, res: Response) => {
  res.send("Ok!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
