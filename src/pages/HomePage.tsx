import React from 'react';
import { Navbar } from '../components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col">

            <main className="flex-1 flex items-center justify-center bg-white">
                <div className="max-w-6xl w-full px-6 py-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-loose tracking-wider hover:translate-1.5 hover:text-[#4f772d]  cursor-pointer transition-all ease-in-out">Perspectia</h1>
                            <p className="mt-4 text-md md:text-lg text-gray-600 max-w-md leading-loose tracking-wide ">A calm space to share short perspectives on daily topics, read diverse views and reflect together.</p>

                            <div className="mt-6 flex gap-4">
                                <Link to="/signup" className="inline-flex items-center px-6 py-3 rounded-full bg-[#4f772d] hover:bg-[#4a7c59] text-white font-medium shadow-md">Get Started</Link>
                                <Link to="/login" className="inline-flex items-center px-6 py-3 rounded-full border-2 border-black border-r-4 border-b-4 bg-white text-[#4f772d] hover:bg-[#f7f7f7]">Login</Link>
                            </div>

                        </div>

                        <div>
                            <Card className="border-2 border-r-8 border-b-8 border-black bg-[#faf3dd] shadow-lg hover:scale-90 transition-all ease-in-out cursor-pointer">
                                <CardHeader>
                                    <CardTitle className="text-md text-center text-gray-600">Today's Topic</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-[#4f772d] font-bold leading-relaxed tracking-wide">What role should AI play in public decision making?</p>
                                    <p className="mt-3 text-xs text-gray-500 leading-relaxed tracking-wide">Join the conversation, share a short perspective and read diverse views.</p>
                                </CardContent>
                            </Card>

                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Card className="border-2 border-r-4 border-b-4 border-black bg-gradient-to-br from-green-50 to-emerald-50  hover:scale-90 transition-all ease-in-out cursor-pointer">
                                    <CardContent>
                                        <p className="text-xs text-gray-700 font-semibold tracking-wide">Share once</p>
                                        <p className="text-[10px] text-gray-500 py-2 leading-loose tracking-wide">Contribute a concise perspective per topic.</p>
                                    </CardContent>
                                </Card>

                                <Card className="border-2 border-r-4 border-b-4 border-black bg-gradient-to-br from-purple-50 to-indigo-50  hover:scale-90 transition-all ease-in-out cursor-pointer">
                                    <CardContent>
                                        <p className="text-xs text-gray-700 font-semibold tracking-wide">Nightly Summary</p>
                                        <p className="text-[10px] text-gray-500 py-2 leading-loose tracking-wide">Perspectia summarize discussions between 9PM – 9AM.</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="bg-white border-t border-gray-200">
                <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between text-[10px] text-gray-500">
                    <div>© {new Date().getFullYear()} Perspectia</div>
                    <div className="flex gap-4">
                        <a href="#" className="hover:underline">Privacy</a>
                        <a href="#" className="hover:underline">Terms</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default HomePage;