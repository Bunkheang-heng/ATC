"use client";

import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';

interface Team {
  id: string;
  name: string;
  logo: string;
}

export default function Home() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [team1, setTeam1] = useState<string>('');
  const [team2, setTeam2] = useState<string>('');
  const [timer, setTimer] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchTeams = async () => {
      const teamsCollection = collection(db, 'teams');
      const teamSnapshot = await getDocs(teamsCollection);
      const teamList = teamSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Team));
      setTeams(teamList);
    };

    fetchTeams();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      setShowModal(true);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleStartTimer = () => {
    if (timer > 0) {
      setTimeLeft(timer * 60);
      setIsRunning(true);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-6xl mx-auto p-4 text-black bg-white">
      <h1 className="text-3xl font-bold text-center mb-6">
        Match Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl text-black font-semibold mb-4">
            Team 1
          </h2>
          <select
            className="w-full p-2 border border-gray-300 rounded"
            value={team1}
            onChange={(e) => setTeam1(e.target.value)}
          >
            <option value="" disabled>Select Team 1</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-center mb-4">
            Timer
          </h2>
          <input
            type="number"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            placeholder="Time (minutes)"
            value={timer}
            onChange={(e) => setTimer(Number(e.target.value))}
          />
          <button
            className={`w-full p-2 rounded ${isRunning ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
            onClick={handleStartTimer}
            disabled={isRunning}
          >
            {isRunning ? formatTime(timeLeft) : "Start Timer"}
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            Team 2
          </h2>
          <select
            className="w-full p-2 border border-gray-300 rounded"
            value={team2}
            onChange={(e) => setTeam2(e.target.value)}
          >
            <option value="" disabled>Select Team 2</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg text-center">
            <h2 className="text-3xl font-bold">
              Time's Up!
            </h2>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
