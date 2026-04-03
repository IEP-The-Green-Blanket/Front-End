import { LoginFields } from "@/components/LoginFields";
import { RegisterFields } from "@/components/RegisterFields";

const LoginPage = async () => {
  return (
    <>
      <main>
        <LoginFields />
        Dont have a login yet ?
        <RegisterFields />
      </main>
    </>
  );
};
export default LoginPage;
