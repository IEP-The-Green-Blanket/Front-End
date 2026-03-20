"use client";

import React, {useState} from "react";
import { StatusMessage } from "@/types";
import { useRouter } from "next/navigation";

const ReportForm: React.FC = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [reportType, setReportType] = useState("");
    const [message, setMessage] = useState("");
    const [location, setLocation] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const routing = useRouter();
    // error states for error handling
    const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
    const [nameError, setNameError] = useState<string | null>("");
    const [mailError, setMailError] = useState<string | null>("");
    const [locationError, setLocationError] = useState<string | null>("");


    // Validation of the non-nulls
     const formValidator = (): boolean => {
        let isValid = true;

        // name cannot be empty
        if(isSubmitting){
            if(!name || name.trim() === ""){
                setNameError("Please submit a name");
                isValid = false;

            }
        }

        // e-mail cannot be empty and must be valid (@ and .)
        if(isSubmitting){
            const hasValidSymbols: boolean = email.includes("@") 
                && email.includes(".");

            if(!email || email.trim() === ""){
                setMailError("Please submit an e-mail adress");
            } else if (!hasValidSymbols) {
                setMailError("Please provide a valid e-mailadress")
            }
        }

        // location cannot be empty
        if(isSubmitting){
            if(!location || location.trim() === ""){
                setLocationError("Please submit a location");
            }
        }
        return isValid;
     };

     //  clearing the errors
     const errorCleaner = () => {
         setNameError(null);
         setLocationError(null);
         setMailError(null);
         setStatusMessages([]);
     };

    const handleLoginSubmit = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        errorCleaner();
        if (!formValidator()){
            return;
        }

        try{
            setStatusMessages([{ message: "Submission accepted. Please wait", type: "success" }]);

            setTimeout(() => {
                routing.push("/");
            }, 2000);
        } catch (error) {
            setStatusMessages([{ message: (error as Error).message, type: "error" }]);
        };

        return (<div className="max-w-sm m-auto">
      {statusMessages && statusMessages.length > 0 && (
        <div className="row">
          <ul className="list-none-mb-3 mx-auto">
            {statusMessages.map(({ message, type }, index) => (
              <li
                key={index}
                className={classNames({
                  "login-error": type === "error",
                  "login-successful": type === "success",
                })}
              >
                {message}
              </li>
            ))}
          </ul>
        </div>
      )}

      <h1 className="text-center text-xl mb-4">
        {isRegistering ? t("registerTitle") : t("loginTitle")}
      </h1>

      <form
        className="login-form"
        onSubmit={isRegistering ? handleRegisterSubmit : handleLoginSubmit}
      >
        {/* First and Last Name for Registration */}
        {isRegistering && (
          <>
            <div className="mt-2">
              <label htmlFor="firstNameInput" className="block mb-2 text-sm font-medium">
                {t("firstName")}
              </label>
              <input
                id="firstNameInput"
                type="text"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue:500 block w-full p-2.5"
              />
            </div>

            <div className="mt-2">
              <label htmlFor="lastNameInput" className="block mb-2 text-sm font-medium">
                {t("lastName")}
              </label>
              <input
                id="lastNameInput"
                type="text"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue:500 block w-full p-2.5"
              />
            </div>
          </>
        )}

        {/* Username */}
        <div className="mt-2">
          <label htmlFor="usernameInput" className="block mb-2 text-sm font-medium">
            {t("username")}
          </label>
          <input
            id="usernameInput"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue:500 block w-full p-2.5"
          />
        </div>

        {/* Email for registration */}
        {isRegistering && (
          <div className="mt-2">
            <label htmlFor="emailInput" className="block mb-2 text-sm font-medium">
              {t("email")}
            </label>
            <input
              id="emailInput"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue:500 block w-full p-2.5"
            />
          </div>
        )}

        {/* Password */}
        <div className="mt-2">
          <label htmlFor="passwordInput" className="block mb-2 text-sm font-medium">
            {t("password")}
          </label>
          <input
            id="passwordInput"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue:500 block w-full p-2.5"
          />
        </div>

        {/* Confirm Password for registration */}
        {isRegistering && (
          <div className="mt-2">
            <label htmlFor="confirmPasswordInput" className="block mb-2 text-sm font-medium">
              {t("confirmPassword")}
            </label>
            <input
              id="confirmPasswordInput"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue:500 block w-full p-2.5"
            />
          </div>
        )}

        {/* Submit Button */}
        <div className="mt-4">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg"
          >
            {isRegistering ? t("registerButton") : t("loginButton")}
          </button>
        </div>
      </form>

      <div className="text-center mt-4">
        <button onClick={toggleForm} className="text-blue-500">
          {isRegistering ? t("switchToLogin") : t("switchToRegister")}
        </button>
      </div>
    </div>);
    }
}; 
export default ReportForm;