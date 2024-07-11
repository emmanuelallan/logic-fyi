import { useEffect, useState } from "react";

const Dashboard = () => {
  const [tokenData, setTokenData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const getTokenFromCookies = () => {
      const tokenCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="));
      return tokenCookie ? tokenCookie.split("=")[1] : null;
    };

    const token = getTokenFromCookies();
    if (token) {
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => {
              return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join(""),
        );

        const parsedToken = JSON.parse(jsonPayload);
        setTokenData(parsedToken);
      } catch (e) {
        setError("Failed to parse token");
      }
    } else {
      setError("No token found");
    }
  }, []);

  return (
    <div>
      {error && <p className="text-red-500">{error}</p>}
      {tokenData && (
        <div>
          <h1 className="my-5 text-center text-2xl font-bold">Dashboard</h1>
          <pre className="mx-auto max-w-4xl rounded-3xl border-2 border-gray-200 p-6 font-mono shadow">
            {JSON.stringify(tokenData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
