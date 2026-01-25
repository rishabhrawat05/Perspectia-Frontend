import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from './ui/card';

export const Navbar: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const getInitials = (name: string | undefined) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="fixed top-0 tracking-wide left-0 right-0 bg-[#4a7c59] shadow-sm border-b z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - App name */}
          <div className="flex items-center">
            <h1 className="text-xl font- text-white">Perspectia</h1>
          </div>

          {/* Right side - User profile */}
          <div className="relative">
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <span className="text-sm hidden md:block text-white">
                {user?.name}
              </span>
              <div className="w-10 h-10 rounded-full bg-[#faf3dd] flex items-center text-sm justify-center text-[#4a7c59] font-semibold">
                {getInitials(user?.name)}
              </div>
            </div>

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 md:w-md w-sm z-50">
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription className="text-center text-xs font-semibold text-gray-900">
                      {user?.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between py-2 border-b">
                        <span className="font-medium text-[10px]">Email:</span>
                        <span className="text-gray-600 text-[10px] line-clamp-1">{user?.email}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b">
                        <span className="font-medium text-xs">Email Verified:</span>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            user?.emailVerified
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {user?.emailVerified ? 'Yes' : 'No'}
                        </span>
                      </div>
                      {user?.provider && (
                        <div className="flex items-center justify-between py-2 border-b">
                          <span className="font-medium text-xs">Provider:</span>
                          <span className="text-gray-600 capitalize text-sm">
                            {user.provider}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2">
                      <Button
                        onClick={logout}
                        disabled={isLoading}
                        variant="destructive"
                        className="w-full"
                      >
                        {isLoading ? 'Logging out...' : 'Logout'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
