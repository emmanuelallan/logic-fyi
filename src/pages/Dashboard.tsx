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

    const getTokenFromSessionStorage = () => {
      const token = sessionStorage.getItem("token");
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

    const token = getTokenFromSessionStorage();
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
    <div className="flex h-screen min-h-full flex-1 flex-col items-center justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        {error && (
          <p className="text-red-500 text-center font-bold font-mono shadow py-5 rounded-2xl">
            {error}
          </p>
        )}
        {tokenData && (
          <div>
            <h1 className="my-5 text-center text-2xl font-bold">Dashboard</h1>
            <pre className="mx-auto max-w-4xl rounded-3xl border-2 border-gray-200 p-6 font-mono shadow">
              {JSON.stringify(tokenData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
