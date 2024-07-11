import { Hono } from "hono";
import { setCookie } from "hono/cookie";
import { handle } from "hono/aws-lambda";
import { cors } from "hono/cors";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: "https://main.d3ce0cc7ut3ws9.amplifyapp.com",
    allowHeaders: ["Content-Type", "x-tenantid"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    credentials: true,
  }),
);

app.get("/", async (c) => {
  return c.json({ status: "ok" });
});

app.post("/", async (c) => {
  try {
    const { username, password } = await c.req.json();

    const response = await fetch(
      "https://7qk9m2xvu2.us-west-2.awsapprunner.com/v1/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-tenantid": "SchryverPruebas",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
        },
        body: JSON.stringify({ username, password }),
      },
    );

    const { access_token } = await response.json();

    if (response.ok) {
      setCookie(c, "token", access_token, {
        httpOnly: true,
        secure: true,
        sameSite: "Lax",
        path: "/",
      });

      return c.json({ message: "Login successful" });
    } else {
      return c.json(
        { message: "Invalid credentials" },
        { status: response.status },
      );
    }
  } catch (error) {
    console.error("Error:", error);
    return c.json({ message: "Internal server error" }, 500);
  }
});

export const handler = handle(app);
