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

        return (<div></div>);
    }
}; 
export default ReportForm;