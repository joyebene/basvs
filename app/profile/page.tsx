"use client";

import { useEffect, useState } from 'react';

import {
  CameraIcon,
  CheckCircleIcon,
  ChartBarIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Image from 'next/image';
import Button from '@/components/shared/button';
import Input from '@/components/shared/input';

export default function ProfilePage() {
  const DEFAULT_AVATAR = "/school-logo.webp";

  const [student, setStudent] = useState({
    name: '',
    matricNumber: '',
    email: '',
    avatar: DEFAULT_AVATAR,
    votesCast: 0,
    role: 'Student',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const refreshAccessToken = async () => {
    const res = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to refresh token");

    const data = await res.json();
    return data.accessToken;
  };



  useEffect(() => {
    const fetchProfile = async () => {
      try {
        let token = localStorage.getItem("token");
        let res = await fetch("/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // If unauthorized, try refreshing token
        if (res.status === 401) {
          try {
            token = await refreshAccessToken();
            localStorage.setItem("token", token!);
            res = await fetch("/api/profile", {
              headers: { Authorization: `Bearer ${token}` },
            });
          } catch {
            console.error("Failed to refresh token");
            return;
          }
        }

        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setStudent({
          name: data.name,
          matricNumber: data.matricNumber,
          email: data.email,
          avatar: data.avatar || DEFAULT_AVATAR,
          votesCast: data.votesCast || 0,
          role: data.role || "Student",
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);


  const handleInputChange = (field: keyof typeof student, value: string) => {
    setStudent(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async () => {
    try {
      let token = localStorage.getItem("token");
      let res = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(student),
      });

      if (res.status === 401) {
        token = await refreshAccessToken();
        localStorage.setItem("token", token!);
        res = await fetch("/api/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(student),
        });
      }

      if (!res.ok) throw new Error("Failed to update profile");
      const updated = await res.json();
      setStudent(updated);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
    }
  };


  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      // Simulate upload
      setTimeout(() => {
        setStudent(prev => ({ ...prev, avatar: URL.createObjectURL(file) }));
        setIsUploading(false);
      }, 1500);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to initial state if needed
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">

        <div className="flex items-center gap-4 mb-8">
          <UserIcon className="w-8 h-8 text-[#8B0000]" />
          <h1 className="text-2xl md:text-3xl font-bold text-black">Your Profile</h1>
        </div>

        {/* Profile Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 p-4 sm:p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-blue-50 to-indigo-50 opacity-50" />
          <div className="relative z-10">
            {/* Avatar Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <Image
                  src={student.avatar || DEFAULT_AVATAR}
                  alt="Profile Avatar"
                  width={50}
                  height={50}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = DEFAULT_AVATAR;
                  }}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                {isEditing && (
                  <label htmlFor='image' className="absolute bottom-2 right-2 bg-[#8B0000] text-white p-2 rounded-full cursor-pointer hover:bg-[#660000] transition">
                    <CameraIcon className="w-5 h-5" />
                    <input
                      id='image'
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      placeholder='image'
                    />
                  </label>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mt-4">{student.name}</h2>
              <p className="text-gray-600">{student.role}</p>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-row  gap-2 md:gap-6 mb-8">
              <div className="flex-1 text-center p-4 border-2 border-blue-100 rounded-md">
                <ChartBarIcon className="w-5 h-5 sm:w-8 sm:h-8 text-[#8B0000] mx-auto mb-2" />
                <div className="text-sm sm:text-base font-bold text-gray-800">{student.votesCast}</div>
                <div className="text-xs sm:text-sm text-gray-600">Votes Cast</div>
              </div>
              <div className="flex-1 text-center p-4 border-2 border-green-100 rounded-md">
                <CheckCircleIcon className="w-5 h-5 sm:w-8 sm:h-8 text-green-500 mx-auto mb-2" />
                <div className="text-sm sm:text-base font-bold text-gray-800">Active</div>
                <div className="text-xs sm:text-sm text-gray-600">Status</div>
              </div>
              <div className="flex-1 text-center p-4 border-2 border-purple-100 rounded-md">
                <CheckCircleIcon className="w-5 h-5 sm:w-8 sm:h-8 text-purple-500 mx-auto mb-2" />
                <div className="text-sm sm:text-base font-bold text-gray-800">3</div>
                <div className="text-xs sm:text-sm text-gray-600">Ongoing Elections</div>
              </div>
            </div>

            {/* Profile Form */}
            <div className="space-y-6">
              <Input
                label='Full Name'
                name='fullName'
                type="text"
                value={student.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={!isEditing}

              />

              <Input
                label='Matric Number'
                name='matricNumber'
                type="text"
                value={student.matricNumber}
                readOnly
                className=" bg-gray-50 cursor-not-allowed"
              />

              <Input
                label='Email'
                name='email'
                type="email"
                value={student.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={!isEditing}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200">
              {isEditing ? (
                <>
                  <Button
                    onClick={handleUpdate}
                    className="flex items-center justify-center gap-2"
                  >
                    <CheckCircleIcon className="w-5 h-5" />
                    Save Changes
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant='secondary'
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} className='flex item-center justify-center gap-2'>
                  <CameraIcon className="w-5 h-5" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}