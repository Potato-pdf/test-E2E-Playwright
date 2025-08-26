"use client";

import { useState } from "react";
import { LoginForm } from "@/app/login/login-form";
import { RegisterForm } from "@/app/login/register-form";

export default function LoginPage() {
  const [isChecked, setIsChecked] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-12">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <button
              onClick={() => setIsChecked(!isChecked)}
              className="w-8 h-8 border-2 border-white relative cursor-pointer transition-all duration-300 hover:border-white/80 group"
            >
              <div
                className={`absolute inset-1 bg-white transition-all duration-300 transform ${
                  isChecked ? "scale-100 opacity-100" : "scale-0 opacity-0"
                }`}
              />
              {/* Checkmark */}
              <svg
                className={`absolute inset-0 w-full h-full text-black transition-all duration-300 transform ${
                  isChecked ? "scale-100 opacity-100" : "scale-0 opacity-0"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </button>
            <h1 className="text-2xl font-light text-white tracking-wide">TaskFlow</h1>
          </div>
          <div className="w-16 h-px bg-white mx-auto"></div>
        </div>

        {isRegister ? (
          <RegisterForm onToggleLogin={() => setIsRegister(false)} />
        ) : (
          <LoginForm onToggleRegister={() => setIsRegister(true)} />
        )}
      </div>
    </div>
  );
}
