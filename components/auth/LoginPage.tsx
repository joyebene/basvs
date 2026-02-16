"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '../shared/input';
import Button from '../shared/button';

import Image from 'next/image';

export default function LoginPage() {
  const [matricNumber, setMatricNumber] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matricNumber, password }),
      });
      

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      // Save token in localStorage (or cookie)
      localStorage.setItem("token", data.accessToken);

      // Redirect to dashboard/home
      router.push("/");
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/school-logo.webp"
            alt="BSVS Logo"
            width={80}
            height={80}
            className="rounded-full"
          />
          <h1 className="text-lg md:text-xl font-bold text-gray-800 mt-4 text-center">
            BASUG Student Voting System <span className="text-primary">(BSVS)</span>
          </h1>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="matricNumber"
            label="Matric Number"
            type="text"
            placeholder="Enter your matric number"
            value={matricNumber}
            onChange={(e) => setMatricNumber(e.target.value)}
            required
          />
          <div>
            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Default password for all students: 87654321
            </p>
          </div>
          <Button type="submit" isLoading={isLoading}>Login</Button>
        </form>
      </div>
    </div>
  );
}