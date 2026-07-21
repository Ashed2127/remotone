'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface LatestVideo {
  name: string;
  path: string;
  size: number;
  modified: Date;
}

export default function Dashboard() {
  const [prompt, setPrompt] = useState('A 30-second promotional video with dramatic transitions and upbeat music');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [renderStatus, setRenderStatus] = useState('');
  const [latestVideo, setLatestVideo] = useState<LatestVideo | null>(null);
  const [isLoadingVideo, setIsLoadingVideo] = useState(true);

  useEffect(() => {
    fetchLatestVideo();
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

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/timeline/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          projectId: 'test-project',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate timeline');
      }

      setResult(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRender = async () => {
    if (!result?.timelineId) return;

    setRenderStatus('Starting render job...');

    try {
      const response = await fetch('/api/render', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: 'test-project',
          timelineId: result.timelineId,
          outputFormat: 'mp4',
          outputResolution: '1080p',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to start render');
      }

      setRenderStatus(`Render job started: ${data.renderJobId} (simulated)`);
      
      setTimeout(() => {
        setRenderStatus(`Render job ${data.renderJobId} completed!`);
        fetchLatestVideo();
      }, 3000);
    } catch (err) {
      setError((err as Error).message);
      setRenderStatus('');
    }
  };

  return (
    <div className="min-h-screen">
      <canvas id="bg-canvas"></canvas>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-10 p-4 bg-black/80 backdrop-blur-sm border-b border-gray-800">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold tracking-tight hover:text-gray-400 transition-colors">
            RM.
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/dashboard" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
              Dashboard
            </Link>
          </div>
        </nav>
      </header>

      <div className="section pt-20">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-400 text-base sm:text-lg">AI-Driven Video Generation SaaS</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Generate Timeline Card */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-6">
                Generate Timeline
              </h2>
              <div className="mb-6">
                <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
                  Video Description
                </label>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your video idea... (e.g., 'A 30-second promotional video with dramatic transitions and upbeat music')"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-white placeholder-gray-500"
                  rows="4"
                  disabled={isGenerating}
                />
              </div>
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Generating...
                  </span>
                ) : (
                  'Generate Timeline'
                )}
              </button>
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-500/30 text-red-300 px-6 py-4 rounded-lg">
                <div className="flex items-center">
                  <span className="mr-2">⚠️</span>
                  {error}
                </div>
              </div>
            )}

            {renderStatus && (
              <div className="bg-green-900/30 border border-green-500/30 text-green-300 px-6 py-4 rounded-lg">
                <div className="flex items-center">
                  <span className="mr-2">✅</span>
                  {renderStatus}
                </div>
              </div>
            )}

            {result && (
              <div className="card">
                <h2 className="text-xl font-semibold mb-6">
                  Generated Timeline
                </h2>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { label: 'Timeline ID', value: result.timelineId, mono: true },
                    { label: 'Duration', value: `${result.timeline.duration}s` },
                    { label: 'Nodes', value: result.timeline.nodes.length },
                    { label: 'Resolution', value: `${result.timeline.resolution.width}x${result.timeline.resolution.height}` },
                    { label: 'FPS', value: result.timeline.fps },
                    { label: 'Schema Version', value: result.timeline.schemaVersion }
                  ].map((item, index) => (
                    <div key={index} className="p-4 bg-gray-800 rounded-lg">
                      <div className="text-sm text-gray-400 mb-1">{item.label}</div>
                      <div className={`font-medium ${item.mono ? 'font-mono text-sm' : ''}`}>{item.value}</div>
                    </div>
                  ))}
                </div>
                
                <details className="mb-6">
                  <summary className="cursor-pointer font-medium text-gray-300 hover:text-white transition-colors">
                    View Timeline JSON
                  </summary>
                  <pre className="mt-4 p-4 bg-gray-800 rounded-lg overflow-auto text-sm max-h-64 text-gray-300">
                    {JSON.stringify(result.timeline, null, 2)}
                  </pre>
                </details>

                <button
                  onClick={handleRender}
                  className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
                >
                  Start Render (Simulated)
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Latest Video Section */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-6">
                Latest Generated Video
              </h2>
              {isLoadingVideo ? (
                <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading...</p>
                  </div>
                </div>
              ) : latestVideo ? (
                <div className="space-y-4">
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <video
                      src={latestVideo.path}
                      controls
                      autoPlay
                      loop
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="font-medium">{latestVideo.name}</span>
                      </div>
                      <span className="text-sm text-gray-400">{(latestVideo.size / (1024 * 1024)).toFixed(2)} MB</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(latestVideo.modified).toLocaleString()}
                    </div>
                  </div>
                  <button
                    onClick={fetchLatestVideo}
                    className="w-full px-4 py-3 border border-gray-700 text-gray-300 font-medium rounded-lg hover:border-gray-500 hover:text-white transition-colors"
                  >
                    Refresh Video
                  </button>
                </div>
              ) : (
                <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎬</div>
                    <p className="text-gray-400 mb-2">No videos generated yet</p>
                    <p className="text-sm text-gray-500">Create your first video</p>
                  </div>
                </div>
              )}
            </div>

            {/* System Status */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-6">
                System Status
              </h2>
              <div className="space-y-3">
                {[
                  { name: 'Database', status: 'Active' },
                  { name: 'AI Engine', status: 'Active' },
                  { name: 'Rendering', status: 'Active' },
                  { name: 'Storage', status: 'Active' }
                ].map((system, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                    <span className="text-gray-300 font-medium">{system.name}</span>
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                      {system.status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg">
                <h3 className="font-semibold mb-2">Testing Mode</h3>
                <p className="text-sm text-gray-400">
                  All services are mocked for performance testing. No external dependencies required.
                </p>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-4">Recent Activity</h3>
                {result ? (
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <div className="flex items-center mb-2">
                      <span className="mr-2">✅</span>
                      <span className="text-gray-300 font-medium">Timeline generated</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date().toLocaleTimeString()}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Three.js Background Script */}
      <script dangerouslySetInnerHTML={{
        __html: `
          document.addEventListener('DOMContentLoaded', () => {
              let scene, camera, renderer, lines;
              const canvas = document.getElementById('bg-canvas');
              const lineCount = 100;
              const linesArray = [];
              
              function init() {
                  scene = new THREE.Scene();
                  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
                  camera.position.z = 400;
                  
                  renderer = new THREE.WebGLRenderer({
                      canvas: canvas,
                      antialias: true,
                  });
                  renderer.setSize(window.innerWidth, window.innerHeight);
                  renderer.setClearColor(0x000000, 1);
                  
                  const lineMaterial = new THREE.LineBasicMaterial({
                      color: 0xFFFFFF,
                      transparent: true,
                      opacity: 0.3
                  });
                  
                  for (let i = 0; i < lineCount; i++) {
                      const points = [];
                      const lineLength = 50 + Math.random() * 100;
                      
                      const y = (Math.random() - 0.5) * 600;
                      const z = (Math.random() - 0.5) * 600;
                      const startX = (Math.random() - 0.5) * 600;
                      
                      points.push(new THREE.Vector3(startX, y, z));
                      points.push(new THREE.Vector3(startX + lineLength, y, z));
                      
                      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
                      const line = new THREE.Line(lineGeometry, lineMaterial.clone());
                      
                      const direction = Math.random() > 0.5 ? 1 : -1;
                      const speed = 0.5 + Math.random() * 1.5;
                      
                      linesArray.push({
                          line: line,
                          velocity: { x: direction * speed, y: 0, z: 0 }
                      });
                      
                      scene.add(line);
                  }
                  
                  animate();
              }
              
              function animate() {
                  for (let i = 0; i < lineCount; i++) {
                      const lineObj = linesArray[i];
                      lineObj.line.position.x += lineObj.velocity.x;
                      
                      if (lineObj.line.position.x > 600) {
                          lineObj.line.position.x = -600;
                      } else if (lineObj.line.position.x < -600) {
                          lineObj.line.position.x = 600;
                      }
                  }
                  
                  renderer.render(scene, camera);
                  requestAnimationFrame(animate);
              }
              
              function onWindowResize() {
                  camera.aspect = window.innerWidth / window.innerHeight;
                  camera.updateProjectionMatrix();
                  renderer.setSize(window.innerWidth, window.innerHeight);
              }
              
              window.addEventListener('resize', onWindowResize, false);
              init();
          });
        `
      }} />
    </div>
  );
}