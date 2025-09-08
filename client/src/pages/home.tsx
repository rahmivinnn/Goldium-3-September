import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BalanceCards } from '@/components/balance-cards';
import { RealTransaction } from '@/components/demo-transaction';
import { SelfContainedStakingTab } from '@/components/self-contained-staking-tab';
import { RealSendTab } from '@/components/real-send-tab';
import { TransactionHistory } from '@/components/transaction-history';
import { ExternalWalletSelector } from '@/components/external-wallet-selector';
import { BalanceStatusIndicator } from '@/components/balance-status-indicator';
import { useSolanaWallet } from '@/components/solana-wallet-provider';
import { GamingHub } from '@/components/gaming-hub';


export default function Home() {
  const wallet = useSolanaWallet();
  const [selectedGalleryItem, setSelectedGalleryItem] = useState(null);
  const [showGamingHub, setShowGamingHub] = useState(false);

  // Self-contained wallet is always connected, no need for wallet selection

  // Handle gallery item clicks
  const handleGalleryClick = (item: string) => {
    setSelectedGalleryItem(item);
    if (item === 'gaming') {
      setShowGamingHub(true);
    }
  };

  // If gaming hub is shown, render it
  if (showGamingHub) {
    return (
      <div>
        <GamingHub />
        <button
          onClick={() => setShowGamingHub(false)}
          className="fixed top-6 left-6 z-50 bg-gray-900/80 hover:bg-gray-800/80 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 border border-gray-700/50"
        >
          ← Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation - Zealy.io inspired clean design */}
      <nav className="fixed top-0 w-full z-50 bg-black/95 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo - Clean and minimal */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-black font-bold text-xl">G</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-white tracking-tight">Goldium</span>
                <p className="text-sm text-gray-400 font-medium">DeFi Platform</p>
              </div>
            </div>

            {/* Navigation Links - Zealy.io style */}
            <div className="hidden lg:flex items-center space-x-1">
              <a href="#home" className="px-4 py-2 text-white font-medium rounded-lg hover:bg-gray-800/50 transition-all duration-200">Home</a>
              <a href="#defi" className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200">DeFi</a>
              <a href="#gallery" className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200">Features</a>
              <a href="#about" className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200">About</a>
            </div>

            {/* Right side - Clean wallet integration */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block">
                <BalanceStatusIndicator
                  connected={wallet.connected}
                  balance={wallet.balance}
                  walletType={wallet.wallet || undefined}
                />
              </div>
              <ExternalWalletSelector />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Zealy.io inspired */}
      <section id="home" className="pt-24 pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            {/* Main Title - Clean typography */}
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 tracking-tight">
              <span className="bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 bg-clip-text text-transparent">
                GOLDIUM
              </span>
            </h1>

            {/* Subtitle - Zealy.io style */}
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              The Ultimate Solana DeFi Experience. Swap, Stake, and Earn with GOLD tokens on the fastest blockchain.
            </p>

            {/* CTA Buttons - Modern design */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
              <button
                onClick={() => document.getElementById('defi')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Start Trading
              </button>
              <button
                onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-2 border-gray-600 hover:border-amber-500 text-gray-300 hover:text-amber-400 px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-gray-800/30"
              >
                Explore Features
              </button>
            </div>

            {/* Stats or additional info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-400 mb-2">99.9%</div>
                <div className="text-gray-400">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-400 mb-2">&lt;1s</div>
                <div className="text-gray-400">Swap Speed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-400 mb-2">0.01%</div>
                <div className="text-gray-400">Fees</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Balance Cards Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <p>Balance Cards will be here</p>
          </div>
        </div>
      </section>

      {/* DeFi Section - Zealy.io inspired clean design */}
      <section id="defi" className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6 tracking-tight">DeFi Operations</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">Swap, stake, send, and track your transactions with lightning-fast speed and minimal fees</p>
          </div>

          {/* Main DeFi Interface - Clean card design */}
          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 shadow-2xl">
            <Tabs defaultValue="swap" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-gray-800/30 border border-gray-700/50 rounded-2xl p-2 mb-8">
                <TabsTrigger
                  value="swap"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-black text-gray-300 font-medium py-3 rounded-xl transition-all duration-300"
                >
                  Swap
                </TabsTrigger>
                <TabsTrigger
                  value="stake"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-black text-gray-300 font-medium py-3 rounded-xl transition-all duration-300"
                >
                  Stake
                </TabsTrigger>
                <TabsTrigger
                  value="send"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-black text-gray-300 font-medium py-3 rounded-xl transition-all duration-300"
                >
                  Send
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-black text-gray-300 font-medium py-3 rounded-xl transition-all duration-300"
                >
                  History
                </TabsTrigger>
              </TabsList>

              <div className="mt-8">
                <TabsContent value="swap">
                  <RealTransaction />
                </TabsContent>

                <TabsContent value="stake">
                  <SelfContainedStakingTab />
                </TabsContent>

                <TabsContent value="send">
                  <RealSendTab />
                </TabsContent>

                <TabsContent value="history">
                  <TransactionHistory />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Interactive Feature Gallery - Zealy.io inspired */}
      <section id="gallery" className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6 tracking-tight">Platform Features</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">Explore our comprehensive suite of DeFi tools and features</p>
          </div>

          {/* Interactive Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 1. Lightning-fast Swaps */}
            <div 
              className="group bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 hover:border-amber-500/50 transition-all duration-500 cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/10"
              onClick={() => handleGalleryClick('swaps')}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">Lightning Swaps</h3>
                  <p className="text-amber-400 font-medium">Ultra Fast</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6">Execute SOL ↔ GOLD swaps in seconds on Solana with minimal fees and maximum security.</p>
              <div className="flex items-center text-amber-400 font-medium group-hover:text-amber-300 transition-colors">
                <span>Learn More</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* 2. Staking Rewards */}
            <div 
              className="group bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 hover:border-emerald-500/50 transition-all duration-500 cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/10"
              onClick={() => handleGalleryClick('staking')}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 8v8m-4-4h8M4 12a8 8 0 1016 0A8 8 0 004 12z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">Staking Rewards</h3>
                  <p className="text-emerald-400 font-medium">High Yield</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6">Stake GOLD tokens to earn competitive yields while supporting the Solana ecosystem growth.</p>
              <div className="flex items-center text-emerald-400 font-medium group-hover:text-emerald-300 transition-colors">
                <span>Learn More</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* 3. Secure Wallet */}
            <div 
              className="group bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 hover:border-blue-500/50 transition-all duration-500 cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10"
              onClick={() => handleGalleryClick('wallet')}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 12a3 3 0 100-6 3 3 0 000 6z"/>
                    <path d="M19.4 15a1 1 0 00.6-.92V11a8 8 0 10-16 0v3.08a1 1 0 00.6.92L8 17v2a4 4 0 004 4 4 4 0 004-4v-2l3.4-2z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">Secure Wallet</h3>
                  <p className="text-blue-400 font-medium">Multi-Wallet</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6">Connect with popular Solana wallets including Phantom, Solflare, and more for secure asset management.</p>
              <div className="flex items-center text-blue-400 font-medium group-hover:text-blue-300 transition-colors">
                <span>Learn More</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* 4. Transparent History */}
            <div 
              className="group bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-500 cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10"
              onClick={() => handleGalleryClick('history')}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 7V3m8 4V3M3 11h18M5 19h14a2 2 0 002-2v-6H3v6a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">Transaction History</h3>
                  <p className="text-purple-400 font-medium">Full Transparency</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6">View complete on-chain activity for SOL and GOLD transactions with detailed analytics and insights.</p>
              <div className="flex items-center text-purple-400 font-medium group-hover:text-purple-300 transition-colors">
                <span>Learn More</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* 5. Analytics Dashboard */}
            <div 
              className="group bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 hover:border-cyan-500/50 transition-all duration-500 cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/10"
              onClick={() => handleGalleryClick('analytics')}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">Analytics</h3>
                  <p className="text-cyan-400 font-medium">Real-time Data</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6">Track portfolio performance, market trends, and optimize your DeFi strategies with comprehensive analytics.</p>
              <div className="flex items-center text-cyan-400 font-medium group-hover:text-cyan-300 transition-colors">
                <span>Learn More</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* 6. Gaming Hub */}
            <div 
              className="group bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 hover:border-pink-500/50 transition-all duration-500 cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/10"
              onClick={() => handleGalleryClick('gaming')}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.5a2.5 2.5 0 110 5H9V10z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">Gaming Hub</h3>
                  <p className="text-pink-400 font-medium">Play & Earn</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6">Play crypto games, earn rewards, and compete with other players in our integrated gaming ecosystem.</p>
              <div className="flex items-center text-pink-400 font-medium group-hover:text-pink-300 transition-colors">
                <span>Learn More</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features Section - Zealy.io inspired */}
      <section id="about" className="py-24 bg-gradient-to-b from-transparent to-gray-900/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6 tracking-tight">Additional Features</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">Discover more tools and services to enhance your DeFi experience</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Character Trading */}
            <div className="group bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-500 cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">Character Trading</h3>
                <p className="text-gray-300 mb-8 leading-relaxed">Trade and collect K1-K8 characters with unique abilities, stats, and special powers in our NFT marketplace.</p>
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  Explore Characters
                </button>
              </div>
            </div>

            {/* Gaming Hub */}
            <div className="group bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 hover:border-blue-500/50 transition-all duration-500 cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.5a2.5 2.5 0 110 5H9V10z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">Gaming Hub</h3>
                <p className="text-gray-300 mb-8 leading-relaxed">Play crypto games, earn rewards, and compete with other players in our integrated gaming ecosystem.</p>
                <button 
                  onClick={() => setShowGamingHub(true)}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Start Playing
                </button>
              </div>
            </div>

            {/* Analytics Dashboard */}
            <div className="group bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 hover:border-emerald-500/50 transition-all duration-500 cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/10">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-500 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">Analytics Dashboard</h3>
                <p className="text-gray-300 mb-8 leading-relaxed">Track your portfolio performance, analyze market trends, and optimize your DeFi strategies with comprehensive analytics.</p>
                <button className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  View Analytics
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Zealy.io inspired */}
      <footer className="border-t border-gray-800/50 py-16 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-black font-bold text-xl">G</span>
              </div>
              <span className="text-3xl font-bold text-white tracking-tight">Goldium</span>
            </div>
            <p className="text-xl text-gray-300 mb-6 font-light">The Ultimate Solana DeFi Experience</p>
            <p className="text-gray-400 mb-8">Built with ❤️ for the Solana ecosystem</p>
            
            {/* Social Links */}
            <div className="flex justify-center space-x-6 mb-8">
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors duration-300">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors duration-300">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors duration-300">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
            
            <div className="border-t border-gray-800/50 pt-8">
              <p className="text-gray-500 text-sm">© 2024 Goldium. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
