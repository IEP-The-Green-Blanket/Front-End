"use client";

import { LoginService } from "@/services/loginService";
import React from "react";
import { useRouter } from "next/navigation";

export const LoginFields: React.FC = () => {
  // some variables that help with:
  // if the site is loading
  const [loading, setLoading] = React.useState(false);
  // if the user is already logged in or not
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  // pathing so that i can send the user to other pages
  const router = useRouter();

  // if the user is already loged in than set isLoggedIn to True
  // this check only runs when the page first is loaded.
  React.useEffect(() => {
    const loginName = localStorage.getItem("loginName");
    if (loginName) {
      setIsLoggedIn(true);
    }
  }, []);

  // make a form event where i can extract the input ino data
  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    // set the loginName and the password into a string
    const loginName = formData.get("loginName") as string;
    const password = formData.get("password") as string;

    setLoading(true);
    try {
      // send a request with loginUser to the back end.
      const response = await LoginService.loginUser(loginName, password);
      if (response.ok) {
        // if login succeed save it in the browser and send user back to the home page
        localStorage.setItem("loginName", loginName);
        await router.push("/");
      } else {
        // give error status back if the login failed
        const errorData = await response.json();
        console.error("Login failed:", response.status, errorData);
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // if the user is already loged in than this will give the user the option
  // to be able to logout and this function will remove the loged in user from the browser
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

  // if the user is not loged in return the form to fill in there login data
  return (
    <div className="flex items-center justify-center bg-gray-50 px-4 pt-5">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-gray-900">Login</h1>

        {/* make a form that will trigger handleLogin when pressing a confirm button */}
        <form className="space-y-4" onSubmit={handleLogin}>
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
