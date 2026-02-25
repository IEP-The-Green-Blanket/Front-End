
import InputField from "@components/ui/InputField";
import { AuthContext } from "@context/AuthContext";
import { UserService } from "@services/userService";
import { StatusMessage } from "@types";
import { useRouter } from "next/navigation";
import React, { useContext, useState } from 'react';

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [passwoord, setPasswoord] = useState("");
  const router = useRouter();
  const [nameError, setNameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);


  const validate = (): boolean => {
    let result = true;
    if (!username || username.trim() === '') {
      setNameError('Username is required');
      result = false;
    }

    if (!passwoord || passwoord.trim() === '') {
      setPasswordError('Password is required');
      result = false;
    }
    return result;
  }
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('Userloginform must be used within an AuthProvider');
  }
  const { login } = context;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if(!validate()) {
      return;
    }
    try {
      const LoginInput = { username, passwoord };
      const loggedInUser = await UserService.login(LoginInput);
      login(loggedInUser);
      setStatusMessages([{message: 'Login Successful.',type:'success'}])
      sessionStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
      setTimeout(() => {router.push('/');}, 1000);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Unknown error");
    }
  };

  const handleRegister = async() => {
    router.push("/register")
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-[hsl(var(--background))]">
      <form
        onSubmit={handleLogin}
        className="bg-[hsl(var(--card))] p-8 rounded-xl shadow-lg w-full max-w-md border border-[hsl(var(--border))]"
      >
        <h4 className="text-2xl font-semibold mb-6 text-center text-[hsl(var(--foreground))]">
          Login Formulier
        </h4>
        {statusMessages.map((msg, index) => (<div key={index} style={{color: 'green'}}>{msg.message}</div>))}
        {nameError && <div className="text-red-800 ">{nameError}</div>}
        <InputField
          title="Name:"
          label="Billy Joel"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {passwordError && (<div className=" text-red-800">{passwordError}</div>)}
        <InputField
          title="Passwoord:"
          label="passwoord123"
          value={passwoord}
          secure
          onChange={(e) => setPasswoord(e.target.value)}
        />

        <button type="submit" className="w-full mt-5 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] py-2 rounded-lg font-medium hover:brightness-110 transition-all">Inloggen</button>
        <button type = "button" onClick={handleRegister} className="w-full mt-5 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] py-2 rounded-lg font-medium hover:brightness-110 transition-all">Maak een account</button>
      </form>
    </div>
  );
};

export default LoginForm;
