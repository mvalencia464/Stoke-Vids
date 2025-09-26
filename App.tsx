import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ImageUploader } from './components/ImageUploader';
import { LoadingIndicator } from './components/LoadingIndicator';
import { VideoPlayer } from './components/VideoPlayer';
import { Login } from './components/Login';
import { generateVideoFromImage } from './services/geminiService';
import { AppState } from './types';
import { StartOverIcon, MagicWandIcon } from './components/icons';
import { AspectRatioSelector } from './components/AspectRatioSelector';
import { auth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from './services/firebase';
import type { User } from 'firebase/auth';

const LOADING_MESSAGES = [
  'Warming up the AI director...',
  'Scouting for the perfect shot...',
  'Setting up the virtual cameras...',
  'Applying cinematic magic...',
  'This can take a few minutes, sit tight...',
  'Adding some extra stoke...',
  'Rendering the final cut...',
];

export default function App() {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<string>('16:9');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>(LOADING_MESSAGES[0]);
  
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // Gracefully handle missing Firebase configuration
    if (!auth) {
      setAuthLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (appState === AppState.GENERATING) {
      const interval = setInterval(() => {
        setLoadingMessage(prev => {
          const currentIndex = LOADING_MESSAGES.indexOf(prev);
          const nextIndex = (currentIndex + 1) % LOADING_MESSAGES.length;
          return LOADING_MESSAGES[nextIndex];
        });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [appState]);

  const handleImageUpload = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageDataUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
    setAppState(AppState.IMAGE_SELECTED);
  };

  const handleGenerateVideo = useCallback(async () => {
    if (!imageFile || !prompt) return;

    setAppState(AppState.GENERATING);
    setError(null);
    setLoadingMessage(LOADING_MESSAGES[0]);

    try {
      const url = await generateVideoFromImage(imageFile, prompt, aspectRatio);
      setVideoUrl(url);
      setAppState(AppState.VIDEO_READY);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
      setAppState(AppState.ERROR);
    }
  }, [imageFile, prompt, aspectRatio]);

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setImageFile(null);
    setImageDataUrl(null);
    setPrompt('');
    setVideoUrl(null);
    setError(null);
    setAspectRatio('16:9');
  };
  
  const handleGoogleSignIn = async () => {
    if (!auth) {
      console.error("Firebase Auth is not initialized. Check your configuration.");
      setError("Authentication is not available. Please check the application configuration.");
      setAppState(AppState.ERROR);
      return;
    }
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Authentication error:", error);
      setError(`Failed to sign in: ${error.message}`);
      setAppState(AppState.ERROR);
    }
  };
  
  const handleSignOut = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      handleReset();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const isGenerateDisabled = appState === AppState.GENERATING || !prompt.trim();

  const renderContent = () => {
    switch (appState) {
      case AppState.GENERATING:
        return <LoadingIndicator message={loadingMessage} />;
      case AppState.VIDEO_READY:
        return videoUrl && <VideoPlayer src={videoUrl} onReset={handleReset} aspectRatio={aspectRatio} />;
      case AppState.ERROR:
      case AppState.IDLE:
      case AppState.IMAGE_SELECTED:
      default:
        return (
          <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-8">
            <ImageUploader onImageUpload={handleImageUpload} imageDataUrl={imageDataUrl} onImageRemove={handleReset} />
            
            {appState !== AppState.IDLE && (
              <div className="w-full flex flex-col gap-4 transition-opacity duration-500 animate-fade-in">
                 <AspectRatioSelector selectedRatio={aspectRatio} onRatioChange={setAspectRatio} />
                 <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the video you want to create... e.g., 'An epic cinematic shot of this car driving through a neon-lit city at night.'"
                  className="w-full p-4 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:outline-none placeholder-gray-400 transition-all duration-300 resize-none h-28"
                />
                <button
                  onClick={handleGenerateVideo}
                  disabled={isGenerateDisabled}
                  className="group w-full flex items-center justify-center gap-3 bg-purple-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-purple-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100"
                >
                  <MagicWandIcon />
                  Generate Video
                </button>
              </div>
            )}
             {appState === AppState.ERROR && (
                <div className="w-full mt-4 p-4 bg-red-900/50 border border-red-500 text-red-300 rounded-lg flex flex-col items-center gap-4 animate-fade-in">
                  <p className="font-semibold">Operation Failed</p>
                  <p className="text-sm text-center">{error}</p>
                   <button
                    onClick={handleReset}
                    className="group flex items-center justify-center gap-2 bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-700 transition-all duration-300"
                  >
                    <StartOverIcon />
                    Try Again
                  </button>
                </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <Header user={user} onSignOut={handleSignOut} />
      <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-8">
        {authLoading ? (
          <LoadingIndicator message="Initializing..." />
        ) : (user || !auth) ? (
          renderContent()
        ) : (
          <Login onSignIn={handleGoogleSignIn} />
        )}
      </main>
      <Footer />
    </div>
  );
}