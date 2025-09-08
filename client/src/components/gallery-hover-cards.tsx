import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface GalleryCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  hoverGradient: string;
  onClick?: () => void;
}

const GalleryCard: React.FC<GalleryCardProps> = ({
  title,
  description,
  icon,
  gradient,
  hoverGradient,
  onClick
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className="relative overflow-hidden cursor-pointer transition-all duration-500 transform hover:scale-105 hover:shadow-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className={`absolute inset-0 transition-all duration-500 ${isHovered ? hoverGradient : gradient}`} />
      
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent transform rotate-12 scale-150" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-white/10 to-transparent transform -rotate-12 scale-150" />
      </div>

      <CardContent className="relative z-10 p-8 text-center">
        {/* Icon with glow effect */}
        <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center transition-all duration-500 ${
          isHovered ? "shadow-2xl shadow-white/30" : "shadow-lg"
        }`}>
          <div className="text-3xl text-white">
            {icon}
          </div>
        </div>

        {/* Title with gradient text */}
        <h3 className="text-2xl font-bold text-white mb-4 transition-all duration-300">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-200 mb-6 leading-relaxed">
          {description}
        </p>

        {/* Action button */}
        <button className={`px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 ${
          isHovered 
            ? "bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg" 
            : "bg-white/10 backdrop-blur-sm border border-white/20"
        }`}>
          Explore
        </button>

        {/* Hover overlay effect */}
        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
        )}
      </CardContent>
    </Card>
  );
};

export const GalleryHoverCards: React.FC = () => {
  const galleryItems = [
    {
      title: "NFT Gallery",
      description: "Discover and trade unique digital collectibles with stunning visual effects and rare attributes",
      icon: "",
      gradient: "bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800",
      hoverGradient: "bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700"
    },
    {
      title: "Art Collection",
      description: "Browse through curated digital art pieces from talented artists around the world",
      icon: "",
      gradient: "bg-gradient-to-br from-pink-600 via-rose-700 to-red-800",
      hoverGradient: "bg-gradient-to-br from-pink-500 via-rose-600 to-red-700"
    },
    {
      title: "Memes Vault",
      description: "Explore the funniest and most viral meme collections with community-driven content",
      icon: "",
      gradient: "bg-gradient-to-br from-yellow-600 via-orange-700 to-red-800",
      hoverGradient: "bg-gradient-to-br from-yellow-500 via-orange-600 to-red-700"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-transparent to-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-500 bg-clip-text text-transparent">
              Gallery Collection
            </span>
          </h2>
          <p className="text-xl text-gray-300">Explore our curated digital collections</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {galleryItems.map((item, index) => (
            <GalleryCard
              key={index}
              title={item.title}
              description={item.description}
              icon={item.icon}
              gradient={item.gradient}
              hoverGradient={item.hoverGradient}
              onClick={() => {
                console.log(`Clicked on ${item.title}`);
                // Add navigation logic here
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
