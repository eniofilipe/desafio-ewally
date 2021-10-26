import app from "./src";

const port = 8080;


app.listen(port, (): void => {
  console.log(`Connected successfully on port ${port}`);
});