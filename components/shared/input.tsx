"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Input({
  label,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={props.id}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}

      <input
        {...props}
        className={`
          w-full px-4 py-2 border border-gray-300 rounded-md
          focus:outline-none focus:ring-2 focus:ring-[#753a3a]
          transition shadow-xs
          ${className}
        `}
      />
    </div>
  );
}
