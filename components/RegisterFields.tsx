"use client";

import { LoginService } from "@/services/loginService";
import { useRouter } from "next/navigation";
import React from "react";

export const RegisterFields: React.FC = () => {
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

  // make a form event where i can extract the input into data
  const handleRegister = async (
    event: React.SyntheticEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    // set the loginName, password an email into a string
    const loginName = formData.get("loginName") as string;
    const password = formData.get("password") as string;
    const email = formData.get("email") as string;

    setLoading(true);
    // sends a request with registerUser to the back end
    // this is for now a mock up untill the back end is ready for registers
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

  // if the user is already loged in send the user to the login page where they can logout if they want
  if (isLoggedIn) {
    router.push("/login");
    return;
  }

  // if the user is not loged in return the form to fill in there register data
  return (
    <div className="flex items-center justify-center bg-gray-50 px-4 pt-5">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-gray-900">Login</h1>

        {/* make a form that will trigger handleRegister when pressing a confirm button */}
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
