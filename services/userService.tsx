import { loginInfo, registerUser, updateUser, User } from "@types";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const UserService = {
  register: async (user: registerUser): Promise<User> => {
    try {
      const res = await fetch(apiUrl + "/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Registratie is gefaald!");
      }
      const createdUser: User = await res.json();
      localStorage.setItem("loggedInUser", JSON.stringify(createdUser));
      return createdUser;
    } catch (error) {
      throw error;
    }
  },

  login: async (info: loginInfo): Promise<User> => {
    try {
      const res = await fetch(apiUrl + "/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(info),
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error?.message || `Authentication Failed.`);
      }

      const data = await res.json();
      const realUser = data.object ? data.object : data;
      localStorage.setItem("loggedInUser", JSON.stringify(realUser));

      return realUser;
    } catch (error) {
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    const res = await fetch(apiUrl + "/users/logout", {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error(`Logout failed: ${res.statusText}`);
    }
  },

  assignVerantwoordelijke: async (
    userEmail: string,
    dierNaam: string
  ): Promise<User> => {
    try {
      const res = await fetch(
        `${apiUrl}/users/verantwoordelijke/${userEmail}/${dierNaam}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error(
          `Failed to assign verantwoordelijke: ${res.status} ${res.statusText}`
        );
      }

      const updatedUser = (await res.json()) as User;

      try {
        if (typeof window !== "undefined" && updatedUser) {
          localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
        }
      } catch (e) {
        console.warn("Could not persist updated user to localStorage", e);
      }

      return updatedUser;
    } catch (error) {
      throw error;
    }
  },

  unassignVerantwoordelijke: async (
    userEmail: string,
    dierNaam: string
  ): Promise<User> => {
    try {
      const res = await fetch(
        `${apiUrl}/users/verantwoordelijke/${userEmail}/${dierNaam}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error(
          `Failed to unassign verantwoordelijke: ${res.status} ${res.statusText}`
        );
      }

      const updatedUser = (await res.json()) as User;

      try {
        if (typeof window !== "undefined" && updatedUser) {
          localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
        }
      } catch (e) {
        console.warn("Could not persist updated user to localStorage", e);
      }

      return updatedUser;
    } catch (error) {
      throw error;
    }
  },

  updateUser: async (user: updateUser): Promise<User> => {
    try {
      const res = await fetch(`${apiUrl}/users/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData?.message || `Update mislukt: ${res.statusText}`
        );
      }
      const updatedUser: User = await res.json();
      if (typeof window !== "undefined" && updatedUser) {
        localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
      }

      return updatedUser;
    } catch (error) {
      console.error("UserService Update Error:", error);
      throw error;
    }
  },
};
