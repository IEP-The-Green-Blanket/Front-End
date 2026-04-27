import { useState } from "react";
import style from '@/style/forms.module.css';
import React from "react";

const SmartField: React.FC < {
    id: string;
    label: string;
    value: string;
    onChange: (v: string) => void;
    error: string | null;
    type?: string;
    category?: string | null;
    options?: React.ReactNode;
    placeholder_text?: string;
    confirmed?: boolean;
}> = ({ id, label, value, onChange, error, type = "text", category, options, placeholder_text, confirmed = false }) => {
    const [inlineSubmission, setInlineSubmission] = useState(confirmed);
    
    React.useEffect(()=> {
        if(confirmed) setInlineSubmission(true);
    }, [confirmed]);

    const handleTrans = () => {
        value.trim() === "" ? setInlineSubmission(false) : setInlineSubmission(true);
    };
    
    const inputRef = React.useRef<HTMLInputElement>(null);
    const selectRef = React.useRef<HTMLSelectElement>(null);
    
    const handleEdit = () => {
        setInlineSubmission(false);
        setTimeout(() => {
            inputRef.current?.focus();
            selectRef.current?.focus();
        }, 0);
    };

    return (
        <div className="w-full">
            <label  htmlFor={id} className={`block mb-2 mt-3 text-sm font-medium transition-all duration-300 ${
                    inlineSubmission ? "opacity-0 h-0 mb-0 overflow-hidden" : "opacity-100"
                }`}>{label}{error && <span className="text-red-500 text-sm mt-1">{error}</span>} </label>
                

            <div
                className="relative w-full"
                style={{ minHeight: "3.5rem" }}>

                {!category && (
                    <input
                        ref={inputRef}
                        placeholder={placeholder_text}
                        id={id}
                        type={type}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onBlur={handleTrans}
                        className={`${style.formField} absolute inset-0 transition-all duration-300 ${
                            inlineSubmission
                                ? "opacity-0 pointer-events-none"
                                : "opacity-100"
                        }`}
                    />
                )}

                {category === "select" && (
                    <select
                        ref={selectRef}
                        id={id}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onBlur={handleTrans}
                        className={`${style.formField} absolute inset-0 transition-all duration-300 ${
                            inlineSubmission
                                ? "opacity-0 pointer-events-none"
                                : "opacity-100"
                        }`}
                    > {options}
                    </select>
                )}

                {/* showing the submitted result in a paragraph*/}
                <div
                    onClick={handleEdit}
                    className={`absolute inset-0 rounded-lg px-2.5 flex items-center cursor-pointer transition-all duration-300 ${
                        inlineSubmission ?  "opacity-100 bg-[#98ff98] text-black"  : "opacity-0 pointer-events-none"
                    }`}>
                    <p className="text-sm font-bold truncate ">{label}: {value}</p>
                    <span className="text-xs text-gray-500 ml-auto italic">tap to edit</span>
                </div>
            </div>
        </div>
    );
}; export default SmartField;