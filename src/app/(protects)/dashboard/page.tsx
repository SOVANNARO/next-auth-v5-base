"use client";

import React from "react";
import { useSession } from "next-auth/react"; // Import useSession

const Dashboard = () => {
  const { data: session } = useSession() as { data: any }; // Get session data

  // Extract important session data
  const userData = session?.user
    ? {
      name: session.user.name,
      email: session.user.email,
      role: session.user.role,
      avatar: session.user.avatar,
      creationAt: new Date(session.user.creationAt).toLocaleDateString(), // Format date
      updatedAt: new Date(session.user.updatedAt).toLocaleDateString(), // Format date
    }
    : null;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          {/* Cards Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Total Users */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-700">Total Users</h2>
              <p className="mt-2 text-3xl font-bold text-indigo-600">1,234</p>
              <p className="mt-1 text-sm text-gray-500">+5.2% from last month</p>
            </div>

            {/* Card 2: Total Revenue */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-700">Total Revenue</h2>
              <p className="mt-2 text-3xl font-bold text-green-600">$12,345</p>
              <p className="mt-1 text-sm text-gray-500">+12.4% from last month</p>
            </div>

            {/* Card 3: Active Projects */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-700">Active Projects</h2>
              <p className="mt-2 text-3xl font-bold text-yellow-600">45</p>
              <p className="mt-1 text-sm text-gray-500">+3 projects this week</p>
            </div>

            {/* Card 4: Pending Tasks */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-700">Pending Tasks</h2>
              <p className="mt-2 text-3xl font-bold text-red-600">12</p>
              <p className="mt-1 text-sm text-gray-500">-2 tasks completed today</p>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900">User Session Data</h2>
            <div className="mt-4 bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avatar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Updated At
                  </th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                {userData && (
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={userData.avatar}
                          alt="User Avatar"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {userData.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {userData.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {userData.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {userData.creationAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {userData.updatedAt}
                    </td>
                  </tr>
                )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;