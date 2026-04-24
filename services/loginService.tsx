const apiUrl = process.env.NEXT_PUBLIC_URL;

export const LoginService = {
  // recieves a username and password an will make a
  // POST request to the given back end to and waits for a respond of the back end
  async loginUser(userName: string, password: string) {
    try {
      const response = await fetch(`${apiUrl}/api/Auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName, password }),
      });

      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  async registerUser(username: string, password: string, email: string) {
    try {
      const response = await fetch(`${apiUrl}/api/Auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, role: "Tourist" }),
      });

      return response;
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  },
};
