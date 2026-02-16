"use client";


import {
  TrophyIcon,
  ChartBarIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useEffect, useState } from 'react';


interface CandidateResult {
  _id: number;
  name: string;
  position: string;
  votes: number;
  percentage: number;
}

interface ElectionResult {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  totalVotes: number;
  candidates: CandidateResult[];
}

export default function ResultsPage() {

  const [completedElections, setCompletedElections] = useState<ElectionResult[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      const res = await fetch("/api/votes/completed");
      if (res.ok) {
        const data = await res.json();
        setCompletedElections(data);
      }
    };
    fetchResults();
  }, []);



  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const sortCandidatesByVotes = (candidates: CandidateResult[]): CandidateResult[] => {
  // Create a copy and sort descending by votes
  return [...candidates].sort((a, b) => b.votes - a.votes);
};

  const getWinner = (candidates: CandidateResult[]) => {
    if (candidates.length === 0) return null;

    const maxVotes = Math.max(...candidates.map(c => c.votes));
    const winners = candidates.filter(c => c.votes === maxVotes);

    if (winners.length > 1) return "draw";
    return winners[0];
  };


  if (completedElections.length === 0) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 sm:mb-4 md:mb-6">Election Results</h1>
          <p className="text-gray-600">No completed elections yet. Check back after voting periods end!</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">

        <div className='mb-8'>
          <div className="flex items-center gap-3 mb-2 sm:mb-4 md:mb-6">
            <ChartBarIcon className="w-8 h-8 text-green-500" />
            <h1 className="text-2xl md:text-3xl font-bold text-black">Election Results</h1>
          </div>
          <p className="text-sm md:textbase text-gray-600">View detailed results from completed elections.</p>
        </div>



        <div className="grid grid-cols-1 gap-6">
          {completedElections.map((election) => {
            const winner = getWinner(election.candidates);
            return (
              <div
                key={election.id}
                className="group bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 p-6 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-linear-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">{election.title}</h2>
                      <p className="text-sm sm:text-base text-gray-600">{election.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-[13px] sm:text-sm text-gray-500 mb-1">
                        <CalendarIcon className="w-4 h-4" />
                        {formatDate(election.startDate)} - {formatDate(election.endDate)}
                      </div>
                      <div className="text-[13px] sm:text-sm text-[#8B0000]">
                        Total Votes: {election.totalVotes}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {sortCandidatesByVotes(election.candidates).map((candidate) => (
                      <div key={candidate._id} className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm sm:text-base font-semibold text-gray-800">{candidate.name}</span>
                            <span className="text-sm text-gray-500">({candidate.position})</span>
                            {winner && winner !== "draw" && candidate._id.toString() === winner._id.toString() ? (
                              <div className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                                <TrophyIcon className="w-3 h-3" />
                                <span className='hidden sm:block'>Winner</span>
                              </div>
                            ) : winner === "draw" ? (
                              <div className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                                Draw
                              </div>
                            ) : null}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-linear-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${candidate.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="text-right min-w-20">
                          <div className="font-semibold text-gray-800">{candidate.votes}</div>
                          <div className="text-sm text-gray-500">{candidate.percentage}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}