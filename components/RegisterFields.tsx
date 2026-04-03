"use client";

import { LoginService } from "@/services/loginService";
import { useRouter } from "next/navigation";
import React from "react";

export const RegisterFields: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const loginName = localStorage.getItem("loginName");
    if (loginName) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleRegister = async (
    event: React.SyntheticEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const loginName = formData.get("loginName") as string;
    const password = formData.get("password") as string;
    const email = formData.get("email") as string;

    setLoading(true);

    try {
      const response = await LoginService.registerUser(
        loginName,
        password,
        email,
      );
      if (response.ok) {
        localStorage.setItem("loginName", loginName);
        console.log("Fake register completed.");
        router.push("/");
      } else {
        const errorData = await response.json();
        console.error("Register failed:", response.status, errorData);
      }
    } catch (error) {
      console.error("Register failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (isLoggedIn) {
    const loginName = localStorage.getItem("loginName");
    const handleLogout = () => {
      localStorage.removeItem("loginName");
      setIsLoggedIn(false);
      router.push("/");
    };
    return (
      <div className="flex-col items-center justify-center bg-gray-50 px-4 pt-5">
        <div className="w-full max-w-sm text-center">
          <p className="text-lg font-semibold text-gray-900">
            {loginName} is already logged in.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center bg-gray-50 px-4 pt-5">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-gray-900">Login</h1>

        <form className="space-y-4" onSubmit={handleRegister}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Login name
            </label>
            <input
              type="text"
              name="loginName"
              placeholder="Bart"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="bart@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors mt-6"
          >
            {loading ? "Loading..." : "Confirm"}
          </button>
        </form>
      </div>
    </div>
  );
};
