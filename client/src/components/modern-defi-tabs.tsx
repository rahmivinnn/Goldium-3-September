import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CleanStakingTab } from '@/components/clean-staking-tab';
import { CleanSendTab } from '@/components/clean-send-tab';
import { CleanTransactionHistory } from '@/components/clean-transaction-history';
import GoldiumGamifiedStaking from '@/components/goldium-gamified-staking';
import { RealTransaction } from '@/components/demo-transaction';

export function ModernDeFiTabs() {
  return (
    <div className="w-full max-w-7xl mx-auto">
      <Tabs defaultValue="demo" className="w-full">
        
        {/* MODERN TAB NAVIGATION */}
        <div className="flex justify-center mb-12 modern-tabs-container">
          <TabsList className="
            modern-tabs-list
            bg-black/40 
            backdrop-blur-xl 
            border 
            border-[#333] 
            rounded-2xl 
            p-3 
            shadow-2xl 
            shadow-black/30
            flex 
            items-center 
            justify-center 
            gap-2
            overflow-x-auto
            scrollbar-hide
            min-w-fit
            max-w-full
            md:w-auto
          ">
            
            {/* SWAP TAB (formerly Real TX) */}
            <TabsTrigger 
              value="demo" 
              className="
                font-body
                font-semibold
                text-white/70
                uppercase
                tracking-wider
                px-6
                py-3
                rounded-xl
                min-w-[120px]
                h-12
                flex
                items-center
                justify-center
                transition-all
                duration-300
                ease-in-out
                data-[state=active]:bg-gradient-to-br
                data-[state=active]:from-white/15
                data-[state=active]:to-white/5
                data-[state=active]:text-white
                data-[state=active]:font-bold
                data-[state=active]:tab-active-glow
                hover:bg-white/5
                hover:text-white/90
                hover:scale-[1.02]
                hover:tab-glow
              "
            >
              SWAP
            </TabsTrigger>

            {/* STAKE TAB */}
            <TabsTrigger 
              value="stake" 
              className="
                font-body
                font-semibold
                text-white/70
                uppercase
                tracking-wider
                px-6
                py-3
                rounded-xl
                min-w-[120px]
                h-12
                flex
                items-center
                justify-center
                transition-all
                duration-300
                ease-in-out
                data-[state=active]:bg-gradient-to-br
                data-[state=active]:from-white/15
                data-[state=active]:to-white/5
                data-[state=active]:text-white
                data-[state=active]:font-bold
                data-[state=active]:tab-active-glow
                hover:bg-white/5
                hover:text-white/90
                hover:scale-[1.02]
                hover:tab-glow
              "
            >
              STAKE
            </TabsTrigger>

            {/* CHARACTER TAB */}
            <TabsTrigger 
              value="dragon" 
              className="
                font-body
                font-semibold
                text-white/70
                uppercase
                tracking-wider
                px-6
                py-3
                rounded-xl
                min-w-[120px]
                h-12
                flex
                items-center
                justify-center
                transition-all
                duration-300
                ease-in-out
                data-[state=active]:bg-gradient-to-br
                data-[state=active]:from-white/15
                data-[state=active]:to-white/5
                data-[state=active]:text-white
                data-[state=active]:font-bold
                data-[state=active]:tab-active-glow
                hover:bg-white/5
                hover:text-white/90
                hover:scale-[1.02]
                hover:tab-glow
              "
            >
              CHARACTER
            </TabsTrigger>

            {/* SEND TAB */}
            <TabsTrigger 
              value="send" 
              className="
                font-body
                font-semibold
                text-white/70
                uppercase
                tracking-wider
                px-6
                py-3
                rounded-xl
                min-w-[120px]
                h-12
                flex
                items-center
                justify-center
                transition-all
                duration-300
                ease-in-out
                data-[state=active]:bg-gradient-to-br
                data-[state=active]:from-white/15
                data-[state=active]:to-white/5
                data-[state=active]:text-white
                data-[state=active]:font-bold
                data-[state=active]:tab-active-glow
                hover:bg-white/5
                hover:text-white/90
                hover:scale-[1.02]
                hover:tab-glow
              "
            >
              SEND
            </TabsTrigger>

            {/* HISTORY TAB */}
            <TabsTrigger 
              value="history" 
              className="
                font-body
                font-semibold
                text-white/70
                uppercase
                tracking-wider
                px-6
                py-3
                rounded-xl
                min-w-[120px]
                h-12
                flex
                items-center
                justify-center
                transition-all
                duration-300
                ease-in-out
                data-[state=active]:bg-gradient-to-br
                data-[state=active]:from-white/15
                data-[state=active]:to-white/5
                data-[state=active]:text-white
                data-[state=active]:font-bold
                data-[state=active]:tab-active-glow
                hover:bg-white/5
                hover:text-white/90
                hover:scale-[1.02]
                hover:tab-glow
              "
            >
              HISTORY
            </TabsTrigger>


            
          </TabsList>
        </div>

        {/* TAB CONTENT */}
        <div className="min-h-[600px]">
          

          
          <TabsContent value="stake" className="p-8 m-0">
            <div className="max-w-5xl mx-auto">
              <CleanStakingTab />
            </div>
          </TabsContent>
          
          <TabsContent value="dragon" className="p-8 m-0">
            <div className="max-w-5xl mx-auto">
              <GoldiumGamifiedStaking />
            </div>
          </TabsContent>
          
          <TabsContent value="send" className="p-8 m-0">
            <div className="max-w-5xl mx-auto">
              <CleanSendTab />
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="p-8 m-0">
            <div className="max-w-5xl mx-auto">
              <CleanTransactionHistory />
            </div>
          </TabsContent>
          
          <TabsContent value="demo" className="p-8 m-0">
            <div className="max-w-5xl mx-auto">
              <RealTransaction />
            </div>
          </TabsContent>
          
        </div>
      </Tabs>
    </div>
  );
}