import { LoginFields } from "@/components/LoginFields";

const LoginPage = async () => {
  return (
    <>
      <main className="mx-auto flex min-h-[70vh] w-full max-w-md items-center justify-center px-4">
        <div className="w-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <LoginFields />

          <p className="mt-4 text-center text-sm text-gray-600">
            Dont have a account ?
          </p>

          <a
            href="/register"
            className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-green-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
          >
            Register
          </a>
        </div>
      </main>
    </>
  );
};
export default LoginPage;
