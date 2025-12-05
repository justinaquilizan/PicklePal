import React from "react";
import { Link } from "react-router-dom";

const Rules = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Pickleball Rules
          </h1>
          <p className="text-lg text-gray-600">
            Learn the official rules of pickleball
          </p>
        </div>

        {/* Navigation */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
            ← Back to Home
          </Link>
        </div>

        {/* Rules Content */}
        <div className="space-y-8">
          {/* The Kitchen Rule */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              🏠 The Kitchen (Non-Volley Zone)
            </h2>
            <div className="prose text-gray-600">
              <p className="mb-4">
                The <strong>kitchen</strong> (officially called the non-volley
                zone) is the 14-foot area on both sides of the net.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  You cannot volley (hit the ball in the air) while standing in
                  the kitchen
                </li>
                <li>Your feet cannot touch the kitchen line when volleying</li>
                <li>
                  You can enter the kitchen to play a ball that has bounced
                </li>
                <li>You must exit the kitchen before hitting another volley</li>
              </ul>
              <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400">
                <p className="text-sm">
                  <strong>Remember:</strong> If momentum carries you into the
                  kitchen after a volley, it's a fault!
                </p>
              </div>
            </div>
          </section>

          {/* Scoring Rules */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              📊 Scoring System
            </h2>
            <div className="prose text-gray-600">
              <p className="mb-4">
                Pickleball uses a unique scoring system that's easy to learn:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Games to 11:</strong> First team to 11 points wins
                  (must win by 2)
                </li>
                <li>
                  <strong>Only serving team scores:</strong> You can only score
                  points when your team is serving
                </li>
                <li>
                  <strong>Three-number score:</strong> Server's score,
                  receiver's score, server number (1 or 2)
                </li>
                <li>
                  <strong>Server rotation:</strong> In doubles, each player gets
                  a turn to serve until they lose the rally
                </li>
              </ul>
              <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400">
                <p className="text-sm">
                  <strong>Example:</strong> Score of 5-3-2 means serving team
                  has 5 points, receiving team has 3 points, and server #2 is
                  serving.
                </p>
              </div>
            </div>
          </section>

          {/* Serving Rules */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              🎾 Serving Rules
            </h2>
            <div className="prose text-gray-600">
              <p className="mb-4">
                Proper serving is essential for starting each rally:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Underhand serve:</strong> Must be underhand, paddle
                  below waist
                </li>
                <li>
                  <strong>Upward motion:</strong> Paddle must move upward when
                  contacting the ball
                </li>
                <li>
                  <strong>Behind baseline:</strong> Both feet must be behind the
                  baseline when serving
                </li>
                <li>
                  <strong>Diagonal service:</strong> Serve to the opponent's
                  diagonal service court
                </li>
                <li>
                  <strong>Let serve:</strong> If the ball hits the net and lands
                  in the correct service area, it's a let (replay)
                </li>
              </ul>
              <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-400">
                <p className="text-sm">
                  <strong>First serve exception:</strong> At the start of each
                  game, only one player gets to serve before switching sides.
                </p>
              </div>
            </div>
          </section>

          {/* Double Bounce Rule */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              ⚡ Double Bounce Rule
            </h2>
            <div className="prose text-gray-600">
              <p className="mb-4">
                This is one of the most important rules in pickleball:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  The receiving team must let the serve bounce before returning
                </li>
                <li>
                  The serving team must let that return bounce before hitting it
                  back
                </li>
                <li>
                  After these two bounces, the ball can be volleyed or played
                  off the bounce
                </li>
                <li>
                  This rule prevents the serve and volley advantage seen in
                  tennis
                </li>
              </ul>
            </div>
          </section>

          {/* Faults */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              ❌ Common Faults
            </h2>
            <div className="prose text-gray-600">
              <p className="mb-4">
                A rally ends when a fault occurs. Common faults include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Hitting the ball out of bounds</li>
                <li>Not clearing the net</li>
                <li>Volleying from the kitchen or on the kitchen line</li>
                <li>Breaking the double bounce rule</li>
                <li>Serving into the wrong court or net</li>
                <li>Letting the ball bounce twice on your side</li>
              </ul>
            </div>
          </section>
        </div>

        {/* Quick Reference */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            📋 Quick Reference
          </h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="p-4 bg-gray-50 rounded">
              <strong>Court Dimensions:</strong> 20' × 44' (same as badminton
              doubles)
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <strong>Net Height:</strong> 36" at sides, 34" at center
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <strong>Ball:</strong> Plastic with holes (indoor vs outdoor)
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <strong>Paddle:</strong> Solid surface, no strings (larger than
              ping pong paddle)
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500">
          <p className="text-sm">
            These are the basic rules to get you started. For complete official
            rules, visit USA Pickleball's website.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Rules;
