import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Home = () => {
  const { auth } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 border-4 border-green-600 rounded-full"></div>
          <div className="absolute top-40 right-20 w-24 h-24 border-4 border-emerald-600 rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 border-4 border-teal-600 rounded-full"></div>
        </div>

        <div className="relative px-4 pt-20 pb-16 sm:px-6 sm:pt-24 sm:pb-20 lg:px-8 lg:pt-32 lg:pb-32">
          <div className="text-center">
            {/* Main Title */}
            <div className="flex justify-center mb-6">
              <span className="text-6xl sm:text-7xl lg:text-8xl">🏓</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-6">
              Welcome to
              <span className="block text-green-600">PicklePal</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Your ultimate platform for managing your pickleball journey. Track
              matches, learn rules, and improve your game.
            </p>

            {/* Primary Actions - Stacked on Mobile */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <Link
                to="/rules"
                className="w-full sm:w-auto group relative px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 min-h-[56px] flex items-center justify-center">
                <span className="flex items-center">
                  <span className="mr-2">📋</span>
                  Learn Rules
                </span>
              </Link>

              {auth.token ? (
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 min-h-[56px] flex items-center justify-center">
                  <span className="flex items-center">
                    <span className="mr-2">📊</span>
                    Dashboard
                  </span>
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="w-full sm:w-auto group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 min-h-[56px] flex items-center justify-center">
                  <span className="flex items-center">
                    <span className="mr-2">🚀</span>
                    Get Started
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 mb-16">
            Everything You Need for Your Game
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Track Matches
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Keep detailed records of your matches, opponents, scores, and
                performance trends over time.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Live Scoring
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Real-time score tracking with instant synchronization across
                devices for seamless match management.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Learn Rules
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Master pickleball rules with our comprehensive guide, from
                kitchen violations to scoring systems.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section (if authenticated) */}
      {auth.token && (
        <div className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20 bg-gradient-to-r from-green-600 to-emerald-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-8">
              Your Pickleball Journey
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold text-white mb-2">🔥</div>
                <div className="text-2xl font-bold text-white">0</div>
                <div className="text-sm text-green-100">Day Streak</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold text-white mb-2">🏓</div>
                <div className="text-2xl font-bold text-white">0</div>
                <div className="text-sm text-green-100">Total Matches</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold text-white mb-2">🏆</div>
                <div className="text-2xl font-bold text-white">0</div>
                <div className="text-sm text-green-100">Wins</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold text-white mb-2">📊</div>
                <div className="text-2xl font-bold text-white">0%</div>
                <div className="text-sm text-green-100">Win Rate</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
