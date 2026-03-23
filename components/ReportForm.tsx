"use client";

import React, {isValidElement, useState} from "react";
import { ReportSubject, StatusMessage } from "@/types";
import { useRouter } from "next/navigation";
import SmartField from "./SmartField";
import style from '@/style/forms.module.css';

const ReportForm: React.FC = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [reportType, setReportType] = useState("");
    const [otherCategory, setOtherCategory] = useState("");
    const [message, setMessage] = useState("");
    const [location, setLocation] = useState("");
    const [isReviewing, setIsReviewing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const routing = useRouter();
    // error states for error handling
    const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
    const [nameError, setNameError] = useState<string | null>("*");
    const [mailError, setMailError] = useState<string | null>("*");
    const [locationError, setLocationError] = useState<string | null>("*");
    const [reportTypeError, setReportTypeError] = useState<string | null>("*");
    const [otherCategoryError, setOtherCategoryError] = useState<string | null>("*")
    const requireMsg: string = (" is required");

    // Validation of the non-nulls
     const formValidator = (): boolean => {
        // error cleaning
         setNameError("*");
         setLocationError("*");
         setMailError("*");
         setStatusMessages([]);

        let isValid = true;

        // name cannot be empty
            if(!name || name.trim() === ""){
                setNameError(requireMsg);
                isValid = false;

            }

        // e-mail cannot be empty and must be valid (@ and .)
            const hasValidSymbols: boolean = email.includes("@") 
                && email.includes(".");

            if(!hasValidSymbols){
                setMailError("Emailaddress must be valid");
                isValid = false;
            }

            if(!email || email.trim() === ""){
                setMailError(requireMsg);
                isValid = false;
            }

        // location cannot be empty
            if(!location || location.trim() === ""){
                setLocationError(requireMsg);
                isValid = false;
            }

        // reporting category cannot be empty
            if(reportType.trim() === "" && otherCategory.trim() === ""){
                setReportTypeError(requireMsg);
                isValid = false;
            }
        return isValid;
     };

    const handleReportSubmit = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        setIsSubmitting(true);

        if (!formValidator()){
            setIsSubmitting(false);
            return;
        }

        try{
            setStatusMessages([{ message: "Submission accepted! We are redirecting you to the home page. Please wait...", type: "success" }]);

            setTimeout(() => {
                routing.push("/");
            }, 3000);
        } catch (error) {
            setIsSubmitting(false);
            setStatusMessages([{ message: (error as Error).message, type: "error" }]);
        };
    }
    // HTML display
    return (
        <div className="w-[90%] m-auto">
            <h1 className={`$"" && "text-center text-xl mb-4"`}>
                Report form
            </h1>
            {!isSubmitting && 
                !isReviewing ? (<p className="text-justify text-sm w-full mb-4">Have you spotted something off? Please let us know by filling out the form.
                    <span className="text-xs"> (Fields marked with <span className="text-red-500">*</span> are required.)</span></p>
                ) : (<p className="text-justify text-sm w-full mb-4">Please review your submission before submitting it.</p>)
            }
            
            <div className={isReviewing ? "hidden" : ""}>
                <form
                    onSubmit={handleReportSubmit}>
                    <>
                        
                        {/* Name submission */}
                            <SmartField
                                id="nameInput"
                                label="Name"
                                value={name}
                                onChange={setName}
                                placeholder_text="e.g. John Smith"
                                confirmed={isReviewing}
                                error={nameError} />

                        {/* Email submission */}
                            <SmartField
                                id="mailInput"
                                label="Email"
                                value={email}
                                type="email"
                                placeholder_text="e.g. john.smith@mail.com"
                                onChange={setEmail}
                                confirmed={isReviewing}
                                error={mailError} />
                                
                        {/* Location submission */}
                            <SmartField
                                id="locationInput"
                                label="Location"
                                value={location}
                                confirmed={isReviewing}
                                onChange={setLocation}
                                placeholder_text="e.g. Hartbeespoortdam West"
                                error={locationError} />

                        {/* Report submission */}
                            <SmartField
                                id="reportingCategory"
                                label="Reporting"
                                value={reportType}
                                confirmed={isReviewing}
                                onChange={setReportType}
                                category="select"
                                options= {<>
                                    <option className="text-sm" value="">-- Select a violation --</option>
                                    {Object.values(ReportSubject).map((type) => (<option className="text-sm" key={type} value={type}>{type}</option>))} </>}
                                error={reportTypeError} />

                                {reportType === ReportSubject.other && (
                                    <SmartField
                                        id="extraInfo"
                                        label="Other"
                                        value={otherCategory}
                                        confirmed={isReviewing}
                                        type="text"
                                        placeholder_text="-- specify your subject"
                                        onChange={setOtherCategory}
                                        error={mailError} />
                                )}

                        {/* Message submission */}
                            <SmartField
                                id="messageInput"
                                label="Additional information"
                                value={message}
                                onChange={setMessage}
                                confirmed={isReviewing}
                                placeholder_text="-- additional information (optional)"
                                error={null} />

                    {/* Submit button */}
                        <div>
                            <button
                                type="button"
                                className="block mx-auto mt-4 px-6 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                                onClick={()=> { if(formValidator()) setIsReviewing(true); }}>
                                    Review and submit report
                            </button>
                        </div>
                    </>
                </form>
            </div>

            {!isSubmitting && 
                isReviewing && (
                    <div className="mt-4 p-2 rounded-lg border border-green-600 bg-[#98ff98]">
                        <h2 className="text-lg font-medium mb-4">Review your submission</h2>

                        <div className="bg-gray-50 rounded-lg border border-green-400 p-4 text-sm w-[95%] m-auto space-y-2">
                            <p><span className="font-medium">Name:</span> {name}</p>
                            <p><span className="font-medium">Email:</span> {email}</p>
                            <p><span className="font-medium">Location:</span> {location}</p>
                            <p><span className="font-medium">Category:</span> {reportType}</p>
                            {reportType === ReportSubject.other && (
                                <p><span className="font-medium">Other:</span> {otherCategory}</p>
                            )}
                            {message && (
                                <p><span className="font-medium">Additional info:</span> {message}</p>
                            )}
                        </div>

                        <div className="flex gap-4 justify-center mt-4">
                            <button
                                type="button"
                                onClick={() => setIsReviewing(false)}
                                className="px-6 py-2 border border-green-500 text-green-500 bg-green-50 text-sm font-medium rounded-lg transition-colors duration-200">
                                Edit
                            </button>
                            <button
                                type="submit"
                                onClick={handleReportSubmit}
                                className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors duration-200">
                                Confirm and submit
                            </button>
                        </div>
                    </div>
                )
            }
            {isSubmitting && (
                <div className="row">
                    <ul className="list-none-mb-3 mx-auto">
                        {statusMessages.map(({ message, type }, index) => (
                            <li
                                key={index}
                                className={type === "success" ? "statusSuccess" : "statusFail"}
                            > 
                            {message}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

        </div>
    )
}; export default ReportForm;
