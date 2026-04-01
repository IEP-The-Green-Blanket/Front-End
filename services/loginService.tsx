const apiUrl = process.env.NEXT_PUBLIC_URL;

export const LoginService = {
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
};
