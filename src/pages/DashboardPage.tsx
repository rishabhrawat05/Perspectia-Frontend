import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Input } from '../components/ui/input';
import { perspectiveApi, type Topic, type PerspectiveResponse, type AISummaryResponse } from '../services/perspective.api';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [topicLoading, setTopicLoading] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Pagination and perspectives state
  const [perspectives, setPerspectives] = useState<PerspectiveResponse[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingPerspectives, setLoadingPerspectives] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  
  // AI Summary state
  const [aiSummary, setAiSummary] = useState<AISummaryResponse | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  
  // User's perspective state
  const [userPerspective, setUserPerspective] = useState<PerspectiveResponse | null>(null);

  // Check if current time is between 9PM and 9AM
  const isNightTime = () => {
    const hour = new Date().getHours();
    return hour >= 21 || hour < 9;
  };

useEffect(() => {
    const fetchLatestTopic = async () => {
      try {
        setTopicLoading(true);
        const topicData = await perspectiveApi.getLatestTopic();
        setTopic(topicData)
      } catch (error) {
        console.error('Failed to fetch topic:', error);
        setTopic(null);
      } finally {
        setTopicLoading(false);
      }
    };

    fetchLatestTopic();
  }, []);

  // Fetch user's perspective for current topic
  useEffect(() => {
    const fetchUserPerspective = async () => {
      if (!user?.id || !topic?.id) return;
      
      try {
        const userPerspectiveData = await perspectiveApi.getPerspectiveByUser(user.id, topic.id);
        setUserPerspective(userPerspectiveData);
      } catch (error) {
        console.error('Failed to fetch user perspective:', error);
        setUserPerspective(null);
      }
    };

    fetchUserPerspective();
  }, [user?.id, topic?.id]);

  // Fetch AI summary if it's night time (9PM to 9AM)
  useEffect(() => {
    const checkAndFetchSummary = async () => {
      if (isNightTime()) {
        setShowSummary(true);
        try {
          setSummaryLoading(true);
          const summaryData = await perspectiveApi.getLatestAISummary();
          setAiSummary(summaryData);
        } catch (error) {
          console.error('Failed to fetch AI summary:', error);
          setAiSummary(null);
        } finally {
          setSummaryLoading(false);
        }
      } else {
        setShowSummary(false);
      }
    };

    checkAndFetchSummary();
    
    // Check every minute if time has changed
    const interval = setInterval(() => {
      const shouldShow = isNightTime();
      if (shouldShow !== showSummary) {
        checkAndFetchSummary();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [showSummary]);

  // Fetch perspectives
  const fetchPerspectives = async (pageNum: number) => {
    if (loadingPerspectives || !hasMore || !topic?.id) return;

    try {
      setLoadingPerspectives(true);
        const response = await perspectiveApi.getAllPerspectives(pageNum, 10, topic.id);
        setPerspectives(prev => {
        // Avoid duplicates
        const newPerspectives = response.content.filter(
          newP => !prev.some(existingP => existingP.id === newP.id)
        );
        return [...prev, ...newPerspectives];
      });
      
      setHasMore(!response.last);
      setPage(pageNum);
      
    } catch (error) {
      console.error('Failed to fetch perspectives:', error);
    } finally {
      setLoadingPerspectives(false);
      setInitialLoad(false);
    }
  };

  // Initial load - only fetch when topic is available
  useEffect(() => {
    if (topic?.id) {
      fetchPerspectives(0);
    }
  }, [topic?.id]);

  // Infinite scroll handler
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    
    // Load more when user scrolls to bottom (with 100px threshold)
    if (scrollHeight - scrollTop <= clientHeight + 100) {
      if (hasMore && !loadingPerspectives) {
        fetchPerspectives(page + 1);
      }
    }
  };

const handleSubmitPerspective = async () => {
    if (!inputValue.trim() || !topic || !user) return;

    try {
      setIsSubmitting(true);
      const newPerspective = await perspectiveApi.createPerspective({
        topicId: topic.id,
        userId: user.id,
        content: inputValue.trim(),
      });
      
      // Clear input after successful submission
      setInputValue('');
      
      // Set as user's perspective
      setUserPerspective(newPerspective);
      
      // Add new perspective to the top of the list optimistically
      setPerspectives(prev => [newPerspective, ...prev]);
      
    } catch (error) {
      console.error('Failed to submit perspective:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitPerspective();
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      
      {/* Mobile - Topic Card at top */}
      <div className="md:hidden pt-16 bg-white border-b border-gray-200">
        <div className="px-4 py-4 space-y-4">
          <Card className="border-2 border-r-4 border-b-4 border-black bg-[#faf3dd]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-center text-gray-600">Today's Topic</CardTitle>
            </CardHeader>
            <CardContent>
              {topicLoading ? (
                <div className="text-gray-400 text-xs italic animate-pulse">Loading topic...</div>
              ) : topic ? (
                <p className="text-xs text-center text-[#4f772d] font-bold leading-relaxed">
                  {topic.content}
                </p>
              ) : (
                <p className="text-gray-400 text-xs text-center italic">No topic available</p>
              )}
            </CardContent>
            
          </Card>
          
          {/* User's Perspective Card */}
          {userPerspective && (
            <Card className="border-2 border-r-4 border-b-4 border-black bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-center text-gray-600">Your Perspective</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-700 leading-relaxed">
                  {userPerspective.content}
                </p>
                <p className="text-[10px] text-gray-400 mt-2">
                  {new Date(userPerspective.createdAt).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          )}
          
          {/* AI Summary Card - Only visible 9PM to 9AM */}
          {showSummary && (
            <Card className="border-2 border-r-4 border-b-4 border-black bg-gradient-to-br from-purple-50 to-indigo-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-center text-gray-600 flex items-center justify-center gap-2">
                  <span className="text-xl">🌙</span>
                  AI Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                {summaryLoading ? (
                  <div className="text-gray-400 text-xs italic animate-pulse text-center">Loading summary...</div>
                ) : aiSummary ? (
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-500 font-semibold mb-1">Topic:</p>
                      <p className="text-xs text-purple-700 font-medium">{aiSummary.topic}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold mb-1">Summary:</p>
                      <p className="text-xs text-gray-700 leading-relaxed">{aiSummary.summaryText}</p>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-400">
                        {aiSummary.modelUsed} • {new Date(aiSummary.generatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400 text-xs text-center italic">No summary available</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* Main content with two columns */}
      <div className="flex-1 flex  pt-16 ">
        {/* Left side - Topic Card (Desktop only) */}
        <div className={`hidden md:flex ${(topic && topic.content && !topic.content.toLowerCase().includes('not available')) ? 'md:w-80 lg:w-96 flex-shrink-0 border-r border-gray-200' : 'flex-1 items-center justify-center '} bg-white p-6 overflow-y-auto`}>
          <div className={`space-y-4 ${(topic && topic.content && !topic.content.toLowerCase().includes('not available')) ? 'pt-0' : 'max-w-2xl w-full'}`}>
            <Card className="border-2 border-r-8 border-b-8 border-black bg-[#faf3dd] backdrop-blur">
              <CardHeader className="pb-3">
                <CardTitle className="text-md text-center text-gray-600">Today's Topic</CardTitle>
              </CardHeader>
              <CardContent>
                {topicLoading ? (
                  <div className="text-gray-400 italic animate-pulse">Loading topic...</div>
                ) : topic ? (
                  <p className="md:text-sm text-xs text-center text-[#4f772d] font-bold bg-clip-text leading-relaxed">
                    {topic.content}
                  </p>
                ) : (
                  <p className="text-gray-400 text-xs md:text-lg text-center italic">No topic available</p>
                )}
              </CardContent>
              <CardContent className='text-[10px] wrap-break-word'>Today’s discussion closes at 9:00 PM IST</CardContent>
              <CardContent className='text-[10px] wrap-break-word '>New Topic will arrive at 9:00 AM IST everyday</CardContent>
            </Card>
            
            {/* User's Perspective Card */}
            {userPerspective && (
              <Card className="border-2 border-r-8 border-b-8 border-black bg-gradient-to-br from-green-50 to-emerald-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-md text-center text-gray-600">Your Perspective</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    {userPerspective.content}
                  </p>
                  
                </CardContent>
              </Card>
            )}
            
            {/* AI Summary Card - Only visible 9PM to 9AM */}
            {showSummary && (
              <Card className="border-2 border-r-8 border-b-8 border-black bg-gradient-to-br from-purple-50 to-indigo-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-md text-center text-gray-600 flex items-center justify-center gap-2">
                    Perspective Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {summaryLoading ? (
                    <div className="text-gray-400 italic animate-pulse text-center">Loading summary...</div>
                  ) : aiSummary ? (
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 font-semibold mb-1">Topic:</p>
                        <p className="text-xs text-purple-700 font-medium">{aiSummary.topic}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold mb-1">Summary:</p>
                        <p className="text-xs text-gray-700 leading-relaxed">{aiSummary.summaryText}</p>
                      </div>
                      <div className="pt-2 border-t border-gray-200">
                        <p className="text-[10px] text-gray-400 ">
                          Generated by<br></br> {aiSummary.modelUsed} <br></br>{new Date(aiSummary.generatedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-400 text-xs text-center italic">No summary available</p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        
        {/* Right side - Perspectives and Input - Hidden when no topic */}
        {(topic && topic.content && !topic.content.toLowerCase().includes('not available')) && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Scrollable wrapper for perspectives */}
            <div className="flex-1 overflow-y-auto" onScroll={handleScroll}>
            {/* Main content area - Perspectives list */}
            <div 
              className="w-full px-4 md:px-6 lg:px-8 md:max-w-5xl mx-auto" 
              style={{ 
                paddingTop: '20px',
                paddingBottom: '20px'
              }}
            >
        {initialLoad && loadingPerspectives ? (
          <div className="flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-400 text-lg">Loading perspectives...</p>
            </div>
          </div>
        ) : perspectives.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4 opacity-50">
              <svg 
                className="mx-auto h-24 w-24 text-gray-300" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
                />
              </svg>
              <p className="text-gray-400 text-sm md:text-lg font-medium">
                Be the first to share your perspective!
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 pb-4">
            {perspectives.map((perspective) => (
              <Card key={perspective.id} className="wrap-break-word border-2 border-r-4 border-b-4 border-black  shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardContent className="pt-2">
                  <p className="text-gray-800 text-xs text-base leading-relaxed">
                    {perspective.content}
                  </p>
                </CardContent>
              </Card>
            ))}
            
            {loadingPerspectives && (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}
            
            {!hasMore && perspectives.length > 0 && (
              <div className="text-center py-4 text-gray-400 text-xs">
                No more perspectives to load
              </div>
            )}
          </div>
        )}
      </div>
    </div>
          
          {/* Fixed Input Box at Bottom of right column - Hidden if user already submitted */}
          {!userPerspective && (
            <div className="bg-white border-t border-gray-200">
              <div className="w-full px-4 md:px-6 lg:px-8 md:max-w-5xl mx-auto py-4 md:py-5">
                <div className="relative">
                  <Input 
                  type="text" 
                  placeholder="Share your perspective..." 
                  className="w-full text-xs md:text-sm py-6 md:py-7 pl-4 md:pl-6 pr-12 md:pr-14 rounded-full focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 border-2 border-black border-r-4 border-b-4"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onCopy={(e) => e.preventDefault()}
                  onPaste={(e) => e.preventDefault()}
                  onCut={(e) => e.preventDefault()}
                  disabled={isSubmitting || !topic}
                />
                <button 
                  onClick={handleSubmitPerspective}
                  disabled={isSubmitting || !inputValue.trim() || !topic}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#4f772d] hover:bg-[#4a7c59] text-white rounded-full p-3 transition-colors duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg 
                    className="h-5 w-5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
                    />
                  </svg>
                </button>
              </div>
              <p className='text-[10px] text-center mt-2 text-gray-500'>You can share perspective only once</p>
            </div>
          </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
