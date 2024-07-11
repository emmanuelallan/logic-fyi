import { Hono } from "hono";
import { setCookie } from "hono/cookie";
import { sign } from "hono/jwt";
import { handle } from "hono/aws-lambda";

const app = new Hono();
const JWT_SECRET = "thisIsASecretKey";

app.get("/api", async (c) => {
  return c.json({ status: "ok" });
});

app.post("/api/auth/login", async (c) => {
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

    const data = await response.json();

    if (response.ok) {
      const token = await sign(
        {
          sub: username,
          role: "user",
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
          cd_identityUsuario: 425,
          nb_nombreUsuario: "CARLOS MARQUEZ",
          Idioma: "EnUs",
          cd_identityPaisUsuario: 56,
          nb_paisUsuario: "GERMANY",
          tx_acronimoPais: "DE",
          cd_identitySucursalUsuario: 20,
          nb_sucursalUsuario_sucursal: "HAMBURG",
          CulturaUsuario: "en-US",
          ZonaHorarioaUsuario: "W. Europe Standard Time",
          st_estatus: "S",
          url_soporte:
            "https://master.d175pxy0e5rn7y.amplifyapp.com/en/docs-tutorials",
          cliente: "SchryverPruebas",
        },
        JWT_SECRET,
      );

      setCookie(c, "token", token, {
        httpOnly: false,
        secure: false,
        sameSite: "Lax",
        path: "/",
      });

      return c.json({ message: "Login successful" });
    } else {
      return c.json(
        { message: data.message || "Invalid credentials" },
        { status: response.status },
      );
    }
  } catch (error) {
    console.error("Error:", error);
    return c.json({ message: "Internal server error" }, 500);
  }
});

export const handler = handle(app);
