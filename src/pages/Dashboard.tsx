import { useEffect, useState } from "react";

const Dashboard = () => {
  const [tokenData, setTokenData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // const getTokenFromCookies = () => {
    //   const tokenCookie = document.cookie
    //     .split("; ")
    //     .find((row) => row.startsWith("token="));
    //   return tokenCookie ? tokenCookie.split("=")[1] : null;
    // };

    const getTokenFromLocalStorage = () => {
      const token = localStorage.getItem("token");
      return token;
    };

    function parseJwt(t: string) {
      const base64Url = t.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join(""),
      );

      return JSON.parse(jsonPayload);
    }

    const token = getTokenFromLocalStorage();
    if (token) {
      try {
        setTokenData(parseJwt(token));
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
