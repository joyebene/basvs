"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LockClosedIcon,
  CheckCircleIcon,
  XMarkIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Button from "@/components/shared/button";
import Input from "@/components/shared/input";

interface Election {
  _id: string;
  title: string;
  description: string;
  isPublic: boolean;
  passcode?: string;
  status: "ongoing" | "completed";
  candidates: { _id: string; name: string; position: string }[];
  startDate: string;
  endDate: string;
}

export default function VotePage() {
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentElection, setCurrentElection] = useState<Election | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [enteredPasscode, setEnteredPasscode] = useState("");
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [error, setError] = useState("");
  const [showCompletedModal, setShowCompletedModal] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const res = await fetch("/api/votes");
        if (!res.ok) throw new Error("Failed to fetch elections");
        const data = await res.json();
        setElections(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load elections.");
      } finally {
        setLoading(false);
      }
    };
    fetchElections();
  }, []);

  const isElectionCompleted = (election: Election) => {
    if (election.status === "completed") return true;
    return false;
  };


  const handleElectionClick = async (id: string) => {
    try {
      const res = await fetch(`/api/votes/${id}`);
      if (!res.ok) throw new Error("Failed to fetch election");
      const election = await res.json();
      setCurrentElection(election);

      if (isElectionCompleted(election)) {
        setShowCompletedModal(true);
        setIsVoting(false);
        setShowPasscodeModal(false);
        return;
      }

      if (election.isPublic) {
        setIsVoting(true);
      } else {
        setShowPasscodeModal(true);
        setEnteredPasscode("");
      }
      setSelectedCandidate(null);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load election. Try again.");
    }
  };

  const handlePasscodeSubmit = () => {
    if (!currentElection?.passcode) return;
    if (enteredPasscode === currentElection.passcode) {
      setShowPasscodeModal(false);
      setIsVoting(true);
      setSelectedCandidate(null);
    } else {
      setError("Invalid passcode. Please try again.");
    }
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


  const handleVote = async () => {
    if (!selectedCandidate || !currentElection) {
      setError("Please select a candidate.");
      return;
    }

    try {
      let token = localStorage.getItem("token");
      let res = await fetch("/api/votes/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          electionId: currentElection._id,
          candidateId: selectedCandidate,
        }),
      });

      // If unauthorized, try refreshing token
      if (res.status === 401) {
        try {
          token = await refreshAccessToken();
          localStorage.setItem("token", token!);
          res = await fetch("/api/votes/submit", {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch {
          console.error("Failed to refresh token");
          return;
        }
      }


      if (!res.ok) {
        const errorText = await res.text();
        setError(errorText || "Failed to submit vote");
        return;
      }

      alert(`Vote submitted successfully for ${currentElection.title}!`);
      router.push("/"); // Redirect after vote
    } catch (err) {
      console.error(err);
      setError("Something went wrong while submitting vote.");
    }
  };

  const closeVoting = () => {
    setIsVoting(false);
    setCurrentElection(null);
    setSelectedCandidate(null);
    setError("");
  };

  const now = new Date();
  const activeElections = elections.filter(
    (election) =>
      new Date(election.startDate) <= now && new Date(election.endDate) >= now
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">Loading elections...</div>
      </DashboardLayout>
    );
  }

  if (activeElections.length === 0) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto text-center py-20">
          <h1 className="text-3xl font-bold mb-6 text-black">Cast Your Vote</h1>
          <p className="text-gray-600">
            No ongoing elections at the moment. Check back later!
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-black">Ongoing Elections</h1>
        <p className="text-sm md:text-base text-gray-600 mb-8">
          Select an election to participate in.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeElections.map((election) => (
            <div
              key={election._id}
              onClick={() => handleElectionClick(election._id)}
              className="group cursor-pointer bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-white/20 hover:shadow-xl hover:border-blue-200/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-lg md:text-xl font-bold text-gray-800">
                    {election.title}
                  </h2>
                  {election.isPublic ? (
                    <GlobeAltIcon className="w-5 h-5 text-green-500" title="Public" />
                  ) : (
                    <LockClosedIcon className="w-5 h-5 text-yellow-500" title="Private" />
                  )}
                </div>
                <p className="text-sm md:text-base text-gray-600 mb-4 line-clamp-2">
                  {election.description}
                </p>
                <div className="text-xs md:text-sm text-gray-500">
                  {election.candidates.length} candidate
                  {election.candidates.length !== 1 ? "s" : ""}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Passcode Modal */}
      {showPasscodeModal && currentElection && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Enter Passcode</h3>
                <button
                  onClick={() => setShowPasscodeModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {<XMarkIcon className="w-6 h-6" />}
                </button>
              </div>
              <p className="text-gray-600 mb-4">
                Enter the passcode for &ldquo;{currentElection.title}&rdquo;
              </p>
              <Input
                type="password"
                value={enteredPasscode}
                onChange={(e) => setEnteredPasscode(e.target.value)}
                placeholder="Enter passcode"
              />
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <div className="flex gap-3 mt-4">
                <Button variant="secondary" onClick={() => setShowPasscodeModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handlePasscodeSubmit}>Verify</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Voting Modal */}
      {isVoting && currentElection && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-300 px-6 py-4 flex items-center justify-between z-10">
              <h3 className="text-xl font-bold text-gray-800">{currentElection.title}</h3>
              <button onClick={closeVoting} className="text-gray-400 hover:text-gray-600">
                {<XMarkIcon className="w-6 h-6" />}
              </button>
            </div>

            <div className="p-6 space-y-6">
              <p className="text-gray-600">{currentElection.description}</p>
              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800">Select Candidate:</h4>
                <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto">
                  {currentElection.candidates.map((candidate) => (
                    <div
                      key={candidate._id}
                      onClick={() => {
                        setSelectedCandidate(candidate._id);
                        setError("");
                      }}
                      className={`cursor-pointer p-4 rounded-md border transition-all ${selectedCandidate === candidate._id
                        ? "border-green-500 bg-green-50 shadow-md"
                        : "border-gray-300 hover:border-gray-400"
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-semibold text-gray-800">{candidate.name}</h5>
                          <p className="text-sm text-gray-600">{candidate.position}</p>
                        </div>
                        {selectedCandidate === candidate._id && (
                          <CheckCircleIcon className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={handleVote} disabled={!selectedCandidate}>
                Submit Vote
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Completed Modal */}
      {showCompletedModal && currentElection && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Election Completed</h3>
                <button
                  onClick={() => setShowCompletedModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {<XMarkIcon className="w-6 h-6" />}
                </button>
              </div>
              <p className="text-gray-600 mb-4">
                The election <span className="text-[#660000] font-bold"
                >
                {currentElection.status === "completed" ? "Completed" : "Ongoing"}
                </span> &ldquo;{currentElection.title}&rdquo; has already been completed.
              </p>

              <Button onClick={() => setShowCompletedModal(false)}>Close</Button>
              </div>
              </div>
              </div>
                )}

            </DashboardLayout>
            );
}
