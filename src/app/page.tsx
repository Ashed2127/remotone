'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface LatestVideo {
  name: string;
  path: string;
  size: number;
  modified: Date;
}

export default function Home() {
  const [latestVideo, setLatestVideo] = useState<LatestVideo | null>(null);
  const [isLoadingVideo, setIsLoadingVideo] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    fetchLatestVideo();
    
    const handleScroll = () => {
      setHeaderScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchLatestVideo = async () => {
    try {
      setIsLoadingVideo(true);
      const response = await fetch('/api/videos/latest');
      const data = await response.json();
      
      if (data.video) {
        setLatestVideo(data.video);
      }
    } catch (error) {
      console.error('Error fetching latest video:', error);
    } finally {
      setIsLoadingVideo(false);
    }
  };

  const initThreeJS = () => {
    if (typeof window === 'undefined') return;
    
    // Three.js initialization will be handled in a separate effect
    // For now, we'll create a simpler canvas-based background
  };

  const smoothScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen">
      <canvas ref={canvasRef} id="bg-canvas"></canvas>

      {/* Header */}
      <header id="header" className={`fixed top-0 left-0 right-0 z-10 p-4 transition-all duration-300 ${headerScrolled ? 'bg-black/80 backdrop-blur-sm' : ''}`}>
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold tracking-tight cursor-pointer hover:text-gray-400 transition-colors" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            RM.
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#about" className="hover:text-gray-400 transition-colors">About</a>
            <a href="#features" className="hover:text-gray-400 transition-colors">Features</a>
            <a href="#projects" className="hover:text-gray-400 transition-colors">Projects</a>
            <a href="#tech" className="hover:text-gray-400 transition-colors">Tech Stack</a>
            <Link href="/dashboard" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
              Dashboard
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-400 hover:text-white focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black/80 backdrop-blur-sm mt-2 rounded-lg shadow-lg">
            <a href="#about" className="block px-4 py-3 text-sm text-gray-200 hover:bg-gray-700" onClick={() => smoothScrollTo('about')}>About</a>
            <a href="#features" className="block px-4 py-3 text-sm text-gray-200 hover:bg-gray-700" onClick={() => smoothScrollTo('features')}>Features</a>
            <a href="#projects" className="block px-4 py-3 text-sm text-gray-200 hover:bg-gray-700" onClick={() => smoothScrollTo('projects')}>Projects</a>
            <a href="#tech" className="block px-4 py-3 text-sm text-gray-200 hover:bg-gray-700" onClick={() => smoothScrollTo('tech')}>Tech Stack</a>
            <Link href="/dashboard" className="block px-4 py-3 text-sm text-gray-200 hover:bg-gray-700" onClick={() => setMobileMenuOpen(false)}>
              Dashboard
            </Link>
          </div>
        )}
      </header>

      <main>
        {/* Hero Section */}
        <section id="home" className="h-screen flex items-center justify-center text-center relative overflow-hidden">
          <div className="z-10">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">Remotone</h1>
            <p className="text-xl md:text-2xl text-white">AI Video Generation Platform</p>
            <p className="text-lg md:text-xl shimmer-text italic">Focus on Speed & Quality</p>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="section">
          <h2 className="text-3xl font-bold text-center mb-10">About Remotone</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-lg mb-4 text-gray-300">
                Remotone is an AI-driven video generation SaaS platform that transforms your ideas into professional videos. Powered by advanced machine learning algorithms, we make video creation accessible to everyone.
              </p>
              <p className="text-lg text-gray-300">
                From content creators to businesses, our platform provides the tools you need to create stunning videos without any technical expertise. Built with a modular monolith architecture for scalability and performance.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-6">Our Tech Stack</h3>
              <div className="flex flex-wrap gap-3">
                <span className="tag">Next.js</span>
                <span className="tag">React</span>
                <span className="tag">Remotion</span>
                <span className="tag">PostgreSQL</span>
                <span className="tag">Redis</span>
                <span className="tag">Tailwind CSS</span>
                <span className="tag">TypeScript</span>
                <span className="tag">Anthropic AI</span>
                <span className="tag">AWS S3</span>
                <span className="tag">BullMQ</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="section">
          <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card">
              <h3 className="text-2xl font-bold mb-2">Describe</h3>
              <p className="text-gray-400 mb-4">Write a natural language description of your video concept and let AI understand your vision</p>
              <div className="flex flex-wrap gap-3">
                <span className="tag">Natural Language</span>
                <span className="tag">AI Understanding</span>
              </div>
            </div>
            <div className="card">
              <h3 className="text-2xl font-bold mb-2">Generate</h3>
              <p className="text-gray-400 mb-4">AI analyzes your prompt and creates a detailed video timeline with scenes and transitions</p>
              <div className="flex flex-wrap gap-3">
                <span className="tag">Timeline Generation</span>
                <span className="tag">Scene Planning</span>
              </div>
            </div>
            <div className="card">
              <h3 className="text-2xl font-bold mb-2">Render</h3>
              <p className="text-gray-400 mb-4">High-quality video rendering with professional output formats and resolution options</p>
              <div className="flex flex-wrap gap-3">
                <span className="tag">4K Output</span>
                <span className="tag">Multiple Formats</span>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="section">
          <h2 className="text-3xl font-bold text-center mb-10">Featured Videos</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-2xl font-bold">AuraMotion Video</h3>
                <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded">Latest</span>
              </div>
              <p className="text-gray-400 mb-4">A 15-second cinematic self-marketing video demonstrating the power of AI-driven video generation with premium motion design and visual effects.</p>
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="tag">Remotion</span>
                <span className="tag">TypeScript</span>
                <span className="tag">Motion Design</span>
              </div>
              {isLoadingVideo ? (
                <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading...</p>
                  </div>
                </div>
              ) : latestVideo ? (
                <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
                  <video src={latestVideo.path} controls autoPlay loop className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎬</div>
                    <p className="text-gray-400">No video available</p>
                  </div>
                </div>
              )}
              <button onClick={fetchLatestVideo} className="github-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"></path><path d="M1 20v-6h6"></path><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                <span>Refresh Video</span>
              </button>
            </div>
            <div className="card">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-2xl font-bold">Devin Marketing</h3>
                <span className="bg-purple-500/20 text-purple-400 text-xs px-2 py-1 rounded">Demo</span>
              </div>
              <p className="text-gray-400 mb-4">Marketing video showcasing AI software engineering capabilities with modern UI design and smooth animations.</p>
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="tag">React</span>
                <span className="tag">Animation</span>
                <span className="tag">UI Design</span>
              </div>
              <a href="/devin-marketing-video.mp4" target="_blank" rel="noopener noreferrer" className="github-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                <span>Watch Video</span>
              </a>
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section id="tech" className="section">
          <h2 className="text-3xl font-bold text-center mb-10">Architecture</h2>
          <div className="max-w-3xl mx-auto card text-center">
            <h3 className="text-3xl font-bold mb-2">Modular Monolith</h3>
            <p className="text-white font-semibold mb-4">Scalable AI Video Generation Platform</p>
            <p className="text-gray-300 mb-4">
              Built with a modular monolith architecture for the core application with isolated async worker pools for CPU/GPU-intensive rendering operations. Features include AI-powered timeline generation, asset management with S3 storage, background rendering with BullMQ, and multi-tenant PostgreSQL database with row-level security.
            </p>
            <div className="flex flex-wrap gap-3 justify-center mb-6">
              <span className="tag">PostgreSQL</span>
              <span className="tag">Redis</span>
              <span className="tag">AWS S3</span>
              <span className="tag">Clerk Auth</span>
              <span className="tag">Stripe Billing</span>
            </div>
            <Link href="/dashboard" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
              <span>Try Dashboard</span>
            </Link>
          </div>
        </section>

        {/* Contact Section */}
        <footer id="contact" className="section text-center border-t border-gray-700">
          <h2 className="text-3xl font-bold mb-4">Get Started</h2>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto">Ready to create stunning AI-generated videos? Access our dashboard to start transforming your ideas into professional video content.</p>
          <Link href="/dashboard" className="inline-block bg-white hover:bg-gray-200 text-black font-bold py-3 px-8 rounded-lg transition-colors">
            Launch Dashboard
          </Link>
          <div className="flex justify-center gap-6 mt-10">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
          </div>
          <p className="text-gray-500 mt-10 text-sm">&copy; 2024 Remotone. All Rights Reserved.</p>
        </footer>
      </main>
    </div>
  );
}