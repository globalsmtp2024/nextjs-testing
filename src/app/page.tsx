'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Autoplay prevented:", error);
      });
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section with Video */}
      <div className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <video
          ref={videoRef}
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          style={{
            objectFit: 'cover',
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <source
            src="/video/20250430_1935_Mystical Tropical Paradise_simple_compose_01jt4gwbdsfn0t6z0bc227t0mf.mp4"
            type="video/mp4"
          />
        </video>
        
        {/* Content Overlay */}
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-white px-4">
          <h1 className="text-6xl md:text-8xl font-light tracking-wider mb-6 text-center font-playfair">
            Travel Spoken
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-center max-w-2xl">
            Discover your next adventure with AI-powered travel planning
          </p>
          <Link 
            href="/chat"
            className="px-8 py-4 bg-white text-gray-900 rounded-full text-lg font-medium hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
          >
            Start your Journey
          </Link>
        </div>
      </div>
    </div>
  );
}
