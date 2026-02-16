"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "danger" | "secondary";
  isLoading?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  isLoading = false,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "w-full py-2 sm:py-3 rounded-md font-semibold transition";

  const variants = {
    primary: "bg-[#8B0000] text-[#FFFFFF] hover:bg-[#660000]",
    secondary: "bg-[#D3D3D3] text-[#8B0000] hover:bg-[#C0C0C0]",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {isLoading && (
        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      )}
      {isLoading ? "Please wait..." : children}
    </button>
  );
}
