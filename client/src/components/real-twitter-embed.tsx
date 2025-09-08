import React, { useEffect, useRef } from 'react';

export function RealTwitterEmbed() {
  const twitterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Twitter widget script
    const script = document.createElement('script');
    script.src = 'https://platform.twitter.com/widgets.js';
    script.async = true;
    script.charset = 'utf-8';
    document.head.appendChild(script);

    // Cleanup
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-white mb-4">Latest Updates</h2>
        <p className="text-xl text-gray-300">Follow our official Twitter for real-time updates</p>
      </div>
      
      <div className="bg-gray-900/50 border border-gray-800/50 rounded-3xl p-8">
        {/* Twitter Profile Embed */}
        <div className="mb-8">
          <a 
            className="twitter-timeline" 
            data-height="600" 
            data-theme="dark"
            data-chrome="noheader nofooter noborders transparent"
            data-tweet-limit="5"
            href="https://twitter.com/goldiumofficial"
            ref={twitterRef}
          >
            Loading tweets from @goldiumofficial...
          </a>
        </div>
        
        {/* Direct Link to Twitter */}
        <div className="text-center">
          <a
            href="https://twitter.com/goldiumofficial"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-black hover:bg-gray-900 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 border border-gray-600 hover:border-gray-500"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            Follow @goldiumofficial
          </a>
        </div>
      </div>
    </div>
  );
}