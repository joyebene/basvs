"use client";

import { useRouter } from 'next/navigation';
import {
  CheckCircleIcon,
  ChartBarIcon,
  UserIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import DashboardLayout from './DashboardLayout';
import { useState } from 'react';
import Button from '../shared/button';
import Input from '../shared/input';

export default function DashboardPage() {
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    candidates: [''] as string[],
    isPublic: true,
    passcode: '',
  });

  const handleCastVote = () => router.push('/vote');
  const handleViewResults = () => router.push('/results');
  const handleProfile = () => router.push('/profile');

  const openModal = () => setIsCreateModalOpen(true);
  const closeModal = () => {
    setIsCreateModalOpen(false);
    // Reset form
    setFormData({
      title: '', description: '', startDate: '', endDate: '', candidates: [''], isPublic: true,
      passcode: '',
    });
  };

  const addCandidate = () => {
    setFormData(prev => ({ ...prev, candidates: [...prev.candidates, ''] }));
  };

  const removeCandidate = (index: number) => {
    if (formData.candidates.length <= 2) return; // Minimum 2 candidates
    setFormData(prev => ({
      ...prev,
      candidates: prev.candidates.filter((_, i) => i !== index),
    }));
  };

  const updateCandidate = (index: number, value: string) => {
    const newCandidates = [...formData.candidates];
    newCandidates[index] = value;
    setFormData(prev => ({ ...prev, candidates: newCandidates }));
  };
 
    const refreshAccessToken = async () => {
    const res = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to refresh token");

    const data = await res.json();
    return data.accessToken;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || formData.candidates.length < 2) {
      alert("Please enter a title and at least 2 candidates");
      return;
    }

    if (!formData.isPublic && !formData.passcode) {
      alert("Please enter a passcode for private election");
      return;
    }

    try {
      let token = localStorage.getItem("token");

      let res = await fetch("/api/votes/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

       // If unauthorized, try refreshing token
        if (res.status === 401) {
          try {
            token = await refreshAccessToken();
            localStorage.setItem("token", token!);
            res = await fetch("/api/votes/create", {
              headers: { Authorization: `Bearer ${token}` },
            });
          } catch {
            console.error("Failed to refresh token");
            return;
          }
        }

      if (!res.ok) {
        const error = await res.json();
        alert(error.message || "Failed to create election");
        return;
      }

      const data = await res.json();
      console.log("Created election:", data.election);
      alert("Election created successfully!");
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Something went wrong while creating the election");
    }
  };


  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className='mb-8'>
          <h2 className="text-2xl md:text-3xl font-bold mb-2 sm:mb-4 md:mb-6 text-black">Dashboard Overview</h2>
          <p className="text-sm md:textbase text-gray-600">Manage elections, cast votes, and more.</p>
        </div>

        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {/* Create Vote Card */}
          <div
            onClick={openModal}
            className="group cursor-pointer bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-white/20 hover:shadow-2xl hover:border-indigo-200/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-linear-to-br from-indigo-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex flex-col items-center">
              <PlusIcon className="w-10 h-10 sm:w-12 sm:h-12 text-[#8B0000] mb-4 group-hover:scale-110 transition-transform" />
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Create Vote</h2>
              <p className="text-sm sm:text-base text-gray-600">Start a new election or poll</p>
            </div>
          </div>

          <div
            onClick={handleCastVote}
            className="group cursor-pointer bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-white/20 hover:shadow-2xl hover:border-blue-200/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10 flex flex-col items-center">
              <CheckCircleIcon className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500 mb-4 group-hover:scale-110 transition-transform duration-300" />
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Cast Your Vote</h2>
              <p className="text-sm sm:text-base text-gray-600">Participate in the ongoing student elections.</p>
            </div>
          </div>

          <div
            onClick={handleViewResults}
            className="group cursor-pointer bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-white/20 hover:shadow-2xl hover:border-green-200/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-linear-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10 flex flex-col items-center">
              <ChartBarIcon className="w-10 h-10 sm:w-12 sm:h-12 text-green-500 mb-4 group-hover:scale-110 transition-transform duration-300" />
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">View Results</h2>
              <p className="text-sm sm:text-base text-gray-600">Check the current or past election results.</p>
            </div>
          </div>

          <div
            onClick={handleProfile}
            className="group cursor-pointer bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-white/20 hover:shadow-2xl hover:border-purple-200/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-linear-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10 flex flex-col items-center">
              <UserIcon className="w-10 h-10 sm:w-12 sm:h-12 text-purple-500 mb-4 group-hover:scale-110 transition-transform duration-300" />
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Profile</h2>
              <p className="text-sm sm:text-gray-600">View or update your profile information.</p>
            </div>
          </div>
        </main>
      </div>

      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-300 px-6 py-4 flex items-center justify-between z-10 rounded-t-3xl">
              <h3 className="text-2xl font-bold text-gray-800">Create New Election</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                {<XMarkIcon className="w-7 h-7" />}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <Input
                label="Election Title"
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. SRC President Election 2026"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B0000] transition text-gray-900"
                  placeholder="Brief description of the election..."
                />
              </div>

              <div className="flex flex-col mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Election Type</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-gray-900">
                    <input
                      type="radio"
                      name="isPublic"
                      value="true"
                      checked={formData.isPublic}
                      onChange={() => setFormData(prev => ({ ...prev, isPublic: true, passcode: '' }))}
                      className="form-radio text-[#8B0000]"
                    />
                    Public
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-gray-800">
                    <input
                      type="radio"
                      name="isPublic"
                      value="false"
                      checked={!formData.isPublic}
                      onChange={() => setFormData(prev => ({ ...prev, isPublic: false }))}
                      className="form-radio text-[#8B0000]"
                    />
                    Private
                  </label>
                </div>

                {!formData.isPublic && (
                  <Input
                    label="Passcode"
                    type="text"
                    required
                    value={formData.passcode}
                    onChange={(e) => setFormData(prev => ({ ...prev, passcode: e.target.value }))}
                    placeholder="Enter a passcode for private election"
                    className="mt-2"
                  />
                )}
              </div>


              <div className="grid grid-cols-1  sm:grid-cols-2 gap-4">
                <div>
                  <Input
                    label='Start Date'
                    name='startDate'
                    type="datetime-local"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <Input
                    label='End Date'
                    name='endDate'
                    type="datetime-local"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Candidates</label>
                {formData.candidates.map((candidate, index) => (
                  <div key={index} className="flex gap-3 mb-3">
                    <Input
                      type="text"
                      required
                      name='candidates'
                      value={candidate}
                      onChange={(e) => updateCandidate(index, e.target.value)}
                      placeholder={`Candidate ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeCandidate(index)}
                      className="text-red-500 hover:text-red-700 px-3"
                    >
                      {<XMarkIcon className="w-5 h-5" />}
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addCandidate}
                  className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2 mt-2"
                >
                  + Add Candidate
                </button>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="secondary" onClick={closeModal}>Cancel</Button>
                <Button type="submit">Create Election</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}