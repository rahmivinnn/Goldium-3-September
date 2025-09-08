import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Tweet {
  id: string;
  content: string;
  author: string;
  username: string;
  avatar: string;
  timestamp: string;
  likes: number;
  retweets: number;
  replies: number;
  verified: boolean;
}

export function EnhancedTwitterInterface() {
  const twitterRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'timeline' | 'profile' | 'trending'>('timeline');

  // Mock tweets data for demonstration
  const mockTweets: Tweet[] = [
    {
      id: '1',
      content: '🚀 Exciting news! Goldium is now live on Solana mainnet! Experience lightning-fast swaps and staking with minimal fees. Join the DeFi revolution! #Goldium #Solana #DeFi',
      author: 'Goldium Official',
      username: 'goldiumofficial',
      avatar: '/goldium-logo.png',
      timestamp: '2h',
      likes: 1247,
      retweets: 389,
      replies: 156,
      verified: true
    },
    {
      id: '2',
      content: '💎 Our K1-K8 character collection is now available for trading! Each character has unique abilities and powers. Start your collection today! #NFT #Characters #Goldium',
      author: 'Goldium Official',
      username: 'goldiumofficial',
      avatar: '/goldium-logo.png',
      timestamp: '4h',
      likes: 892,
      retweets: 234,
      replies: 89,
      verified: true
    },
    {
      id: '3',
      content: '🎮 Gaming Hub is live! Play crypto games, earn rewards, and compete with other players. The future of play-to-earn is here! #Gaming #PlayToEarn #Goldium',
      author: 'Goldium Official',
      username: 'goldiumofficial',
      avatar: '/goldium-logo.png',
      timestamp: '6h',
      likes: 1567,
      retweets: 445,
      replies: 201,
      verified: true
    },
    {
      id: '4',
      content: '📊 Analytics Dashboard is now available! Track your portfolio performance, analyze market trends, and optimize your DeFi strategies. #Analytics #DeFi #Goldium',
      author: 'Goldium Official',
      username: 'goldiumofficial',
      avatar: '/goldium-logo.png',
      timestamp: '8h',
      likes: 743,
      retweets: 198,
      replies: 67,
      verified: true
    },
    {
      id: '5',
      content: '🔥 Staking rewards are now live! Stake your GOLD tokens and earn competitive yields while supporting the Solana ecosystem. #Staking #Rewards #Goldium',
      author: 'Goldium Official',
      username: 'goldiumofficial',
      avatar: '/goldium-logo.png',
      timestamp: '12h',
      likes: 2134,
      retweets: 567,
      replies: 234,
      verified: true
    }
  ];

  useEffect(() => {
    // Load Twitter widget script
    const script = document.createElement('script');
    script.src = 'https://platform.twitter.com/widgets.js';
    script.async = true;
    script.charset = 'utf-8';
    document.head.appendChild(script);

    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.h2 
          className="text-5xl font-bold text-white mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Latest Updates
        </motion.h2>
        <motion.p 
          className="text-xl text-gray-300"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Follow our official Twitter for real-time updates and community discussions
        </motion.p>
      </div>

      {/* Twitter Interface Container */}
      <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-3xl overflow-hidden shadow-2xl">
        {/* Twitter Header */}
        <div className="bg-black/80 border-b border-gray-800/50 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src="/goldium-logo.png" 
                alt="Goldium Logo" 
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="text-xl font-bold text-white">Goldium Official</h3>
                <p className="text-gray-400">@goldiumofficial</p>
              </div>
              <div className="flex items-center space-x-1">
                <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.12 14.016v4.968h5.76v-4.968h-5.76zm-1.008-6.024v10.992h7.776V7.992H8.112zm-1.008-1.008h9.792c.552 0 1.008.456 1.008 1.008v12.96c0 .552-.456 1.008-1.008 1.008H7.104c-.552 0-1.008-.456-1.008-1.008V7.992c0-.552.456-1.008 1.008-1.008z"/>
                </svg>
                <span className="text-blue-400 text-sm font-medium">Verified</span>
              </div>
            </div>
            
            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-gray-800/50 rounded-xl p-1">
              {[
                { id: 'timeline', label: 'Timeline', icon: '🏠' },
                { id: 'profile', label: 'Profile', icon: '👤' },
                { id: 'trending', label: 'Trending', icon: '🔥' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'timeline' && (
              <motion.div
                key="timeline"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Real Twitter Embed */}
                <div className="mb-8">
                  <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/50">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      Live Twitter Feed
                    </h4>
                    {isLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
                        <span className="ml-3 text-gray-300">Loading tweets...</span>
                      </div>
                    ) : (
                      <div className="twitter-timeline-container">
                        <a 
                          className="twitter-timeline" 
                          data-height="400" 
                          data-theme="dark"
                          data-chrome="noheader nofooter noborders transparent"
                          data-tweet-limit="3"
                          href="https://twitter.com/goldiumofficial"
                          ref={twitterRef}
                        >
                          Loading tweets from @goldiumofficial...
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Mock Tweets for Demo */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <span className="mr-2">📱</span>
                    Recent Updates
                  </h4>
                  {mockTweets.map((tweet, index) => (
                    <motion.div
                      key={tweet.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-6 hover:bg-gray-800/40 transition-all duration-200"
                    >
                      <div className="flex items-start space-x-4">
                        <img 
                          src={tweet.avatar} 
                          alt={tweet.author}
                          className="w-12 h-12 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h5 className="font-bold text-white">{tweet.author}</h5>
                            {tweet.verified && (
                              <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9.12 14.016v4.968h5.76v-4.968h-5.76zm-1.008-6.024v10.992h7.776V7.992H8.112zm-1.008-1.008h9.792c.552 0 1.008.456 1.008 1.008v12.96c0 .552-.456 1.008-1.008 1.008H7.104c-.552 0-1.008-.456-1.008-1.008V7.992c0-.552.456-1.008 1.008-1.008z"/>
                              </svg>
                            )}
                            <span className="text-gray-400">@{tweet.username}</span>
                            <span className="text-gray-500">·</span>
                            <span className="text-gray-500">{tweet.timestamp}</span>
                          </div>
                          <p className="text-gray-200 mb-4 leading-relaxed">{tweet.content}</p>
                          <div className="flex items-center space-x-6 text-gray-400">
                            <button className="flex items-center space-x-2 hover:text-blue-400 transition-colors">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              <span>{formatNumber(tweet.replies)}</span>
                            </button>
                            <button className="flex items-center space-x-2 hover:text-green-400 transition-colors">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              <span>{formatNumber(tweet.retweets)}</span>
                            </button>
                            <button className="flex items-center space-x-2 hover:text-red-400 transition-colors">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                              <span>{formatNumber(tweet.likes)}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl p-8 border border-amber-500/30">
                  <div className="flex items-center space-x-6">
                    <img 
                      src="/goldium-logo.png" 
                      alt="Goldium Logo" 
                      className="w-24 h-24 rounded-full border-4 border-white/20"
                    />
                    <div>
                      <h3 className="text-3xl font-bold text-white mb-2">Goldium Official</h3>
                      <p className="text-gray-300 text-lg mb-4">@goldiumofficial</p>
                      <div className="flex items-center space-x-4 text-gray-300">
                        <span>📍 Solana Ecosystem</span>
                        <span>🔗 goldium.io</span>
                        <span>📅 Joined December 2024</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 grid grid-cols-3 gap-6 text-center">
                    <div>
                      <div className="text-2xl font-bold text-white">1.2K</div>
                      <div className="text-gray-400">Following</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">15.8K</div>
                      <div className="text-gray-400">Followers</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">2.4K</div>
                      <div className="text-gray-400">Tweets</div>
                    </div>
                  </div>
                </div>

                {/* Profile Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/50">
                    <h4 className="text-lg font-semibold text-white mb-4">Engagement Stats</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Average Likes</span>
                        <span className="text-white font-semibold">1,247</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Average Retweets</span>
                        <span className="text-white font-semibold">389</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Engagement Rate</span>
                        <span className="text-green-400 font-semibold">8.2%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/50">
                    <h4 className="text-lg font-semibold text-white mb-4">Community Growth</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Monthly Growth</span>
                        <span className="text-green-400 font-semibold">+23.5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Active Followers</span>
                        <span className="text-white font-semibold">12.1K</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Top Hashtag</span>
                        <span className="text-amber-400 font-semibold">#Goldium</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'trending' && (
              <motion.div
                key="trending"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/50">
                  <h4 className="text-lg font-semibold text-white mb-6 flex items-center">
                    <span className="mr-2">🔥</span>
                    Trending Topics
                  </h4>
                  
                  <div className="space-y-4">
                    {[
                      { tag: '#Goldium', tweets: '12.4K', trend: 'up' },
                      { tag: '#SolanaDeFi', tweets: '8.7K', trend: 'up' },
                      { tag: '#PlayToEarn', tweets: '6.2K', trend: 'up' },
                      { tag: '#NFTTrading', tweets: '4.9K', trend: 'down' },
                      { tag: '#CryptoGaming', tweets: '3.8K', trend: 'up' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <span className="text-amber-400 font-bold">#{index + 1}</span>
                          <span className="text-white font-semibold">{item.tag}</span>
                          <span className="text-gray-400">{item.tweets} tweets</span>
                        </div>
                        <div className={`flex items-center space-x-1 ${
                          item.trend === 'up' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d={item.trend === 'up' ? "M7 14l5-5 5 5z" : "M7 10l5 5 5-5z"} />
                          </svg>
                          <span className="text-sm font-medium">
                            {item.trend === 'up' ? 'Trending' : 'Declining'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="bg-black/80 border-t border-gray-800/50 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <a
                href="https://twitter.com/goldiumofficial"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Follow @goldiumofficial
              </a>
              
              <button className="inline-flex items-center gap-3 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                Share
              </button>
            </div>
            
            <div className="text-gray-400 text-sm">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}