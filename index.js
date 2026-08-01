import express from "express";
import UserRouter from "./router/user/index.js";
import AuthRouter from "./router/auth/index.js";

const app = express();
const port = 3000;

// middleware to parse JSON bodies
app.use(express.json());

// extract form data from POST requests
app.use(express.urlencoded({ extended: true }));  

// lazily load the user router, dynamically importing it when the route is accessed
// app.use("/user", (await import("./router/user/create.js")).default);
app.use("/user", UserRouter);

app.use("/auth", AuthRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
