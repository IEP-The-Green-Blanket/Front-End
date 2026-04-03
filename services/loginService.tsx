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

  async registerUser(registerName: string, password: string, email: string) {
    // makes a fake hardcoded back end
    const hardcodedUsers = [
      {
        id: 1,
        registerName: "alice",
        password: "alice123",
        email: "alice@mail.com",
      },
      { id: 2, userName: "bob", password: "bob123", email: "bob@mail.com" },
    ];

    // if the user isent in teh fake hardcoded back end than the user will login with the registered data
    const existingUser = hardcodedUsers.find(
      (user) => user.registerName === registerName || user.email === email,
    );

    if (existingUser) {
      return {
        ok: false,
        status: 409,
        json: async () => ({
          message: "Gebruiker bestaat al",
          user: existingUser,
        }),
      };
    }

    const newUser = {
      id: hardcodedUsers.length + 1,
      registerName,
      password,
      email,
    };

    return {
      ok: true,
      status: 201,
      json: async () => ({
        message: "Registratie geslaagd (mock)",
        user: newUser,
        seedUsers: hardcodedUsers,
      }),
    };
  },
};
