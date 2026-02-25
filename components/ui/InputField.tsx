import React, { useState } from "react";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  secure?: boolean;
  editable?: boolean;
  value?: string;
  onTextChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  title?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  secure = false,
  editable = true,
  value,
  onTextChange,
  title,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisible = () => setIsPasswordVisible(!isPasswordVisible);

  return (
    <div className="flex flex-col mb-4 w-full">
      {title && <h6 className="text-base mb-1 text-gray-700 font-medium">{title}</h6>}

      <div className="relative flex items-center w-full">
        <input
          type={secure && !isPasswordVisible ? "password" : "text"}
          value={value}
          onChange={onTextChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={label}
          disabled={!editable}
          className={`w-full bg-transparent border-b-2 text-gray-800 placeholder-gray-400 text-base py-2 pr-10 outline-none transition-colors duration-300 
            ${editable ? "cursor-text" : "cursor-not-allowed opacity-60"} 
            ${isFocused ? "border-indigo-500" : "border-gray-400"}`}
          {...props}
        />

        {secure && (
          <FontAwesomeIcon
            icon={faEye}
            onClick={togglePasswordVisible}
            className="absolute right-2 text-gray-500 cursor-pointer hover:text-gray-700 w-5 h-5"
          />
        )}
      </div>
    </div>
  );
};

export default InputField;
