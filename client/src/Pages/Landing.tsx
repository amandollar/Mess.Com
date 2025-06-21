import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Landing = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [onlinePlayers, setOnlinePlayers] = useState(1240);
  const [isVisible, setIsVisible] = useState(true);

  // Simulate player count changes
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlinePlayers(prev => {
        const change = Math.floor(Math.random() * 10) - 3;
        return Math.max(1000, prev + change); // Ensure it doesn't go below 1000
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const playerAvatars = [
    'https://randomuser.me/api/portraits/men/21.jpg',
    'https://randomuser.me/api/portraits/women/22.jpg',
    'https://randomuser.me/api/portraits/men/23.jpg',
    'https://randomuser.me/api/portraits/women/24.jpg',
  ];

  const handlePlayNow = () => {
    setIsVisible(false);
    setTimeout(() => navigate('/game'), 500);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-x-hidden"
        >
          {/* Header - Responsive Nav */}
          <header className="container mx-auto px-4 py-6 md:py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <motion.h1 
                initial={{ x: -50 }}
                animate={{ x: 0 }}
                transition={{ type: 'spring', stiffness: 100 }}
                className="text-3xl sm:text-4xl font-bold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
              >
                OnlineMess
              </motion.h1>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="hidden md:flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full border border-gray-700"
              >
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                <span className="text-sm">Server: Online</span>
              </motion.div>
            </div>
          </header>

          {/* Main Content - Responsive Columns */}
          <main className="container mx-auto px-4 py-8 sm:py-12">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 xl:gap-16">
              {/* Text Content */}
              <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 md:mb-6 leading-tight"
                >
                  Play <span className="text-amber-400 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600">Real-Time</span> Mess
                </motion.h2>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg sm:text-xl text-gray-300 mb-6 md:mb-8 max-w-lg"
                >
                  Challenge opponents worldwide in fast-paced matches. No registration needed - just play and enjoy!
                </motion.p>

                {/* CTA Buttons */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col sm:flex-row gap-4 mb-8 w-full sm:w-auto"
                >
                  <button
                    onClick={handlePlayNow}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className={`px-8 py-3 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                      isHovered
                        ? "bg-gradient-to-r from-amber-500 to-amber-600 shadow-lg shadow-amber-500/30"
                        : "bg-gradient-to-r from-amber-600 to-amber-700 shadow-md"
                    }`}
                  >
                    Play Now →
                  </button>
                  
                  <button className="px-6 py-3 border border-amber-400 text-amber-400 rounded-lg font-bold text-lg hover:bg-amber-400/10 transition hover:border-amber-300 hover:text-amber-300">
                    How to Play
                  </button>
                </motion.div>

                {/* Online Players */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
                >
                  <div className="flex -space-x-3">
                    {playerAvatars.map((avatar, index) => (
                      <motion.img
                        key={index}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        src={avatar}
                        alt={`Player ${index + 1}`}
                        className="w-10 h-10 rounded-full border-2 border-gray-800 hover:border-amber-400 transition-all duration-300 hover:scale-110"
                        style={{ zIndex: playerAvatars.length - index }}
                      />
                    ))}
                  </div>
                  <p className="text-gray-400 text-sm sm:text-base">
                    <span className="text-amber-400 font-semibold">{onlinePlayers.toLocaleString()}</span> players online now
                  </p>
                </motion.div>
              </div>

              {/* Game Preview */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-full lg:w-1/2 mt-8 lg:mt-0 flex justify-center scale-90 sm:scale-100"
              >
                <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md">
                  <div className="aspect-square bg-gray-800 rounded-xl p-2 shadow-2xl border border-gray-700 hover:border-amber-400/50 transition-all duration-500 hover:shadow-amber-400/20 overflow-hidden">
                    <img 
                      src='https://images.chesscomfiles.com/proxy/d1lalstwiwz2br.cloudfront.net/images_users/tiny_mce/watcha/phpZ8f0Px/http/7e9b460073.gif' 
                      alt="Live game preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                  </div>
                  
                  {/* Live Badge */}
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 bg-gray-900 px-4 py-2 rounded-lg shadow-lg border border-gray-700 flex items-center gap-2 hover:bg-gray-800 transition"
                  >
                    <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></span>
                    <span className="text-sm font-medium">Live Match</span>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </main>

          {/* Features Grid */}
          <section className="container mx-auto px-4 py-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-center mb-8">Why Players Love MessOnline</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Instant Play",
                  desc: "No registration required. Start playing in seconds.",
                  icon: "⚡"
                },
                {
                  title: "Global Players",
                  desc: "Match with opponents from around the world.",
                  icon: "🌎"
                },
                {
                  title: "Real-Time",
                  desc: "Fast-paced matches with live interactions.",
                  icon: "⏱️"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-amber-400/30 transition"
                >
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <h4 className="text-xl font-bold mb-2">{feature.title}</h4>
                  <p className="text-gray-400">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Footer */}
          <footer className="container mx-auto px-4 py-8 border-t border-gray-800 mt-8 sm:mt-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-500 text-sm sm:text-base">
                © {new Date().getFullYear()} MessOnline. All rights reserved.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-amber-400 transition">Terms</a>
                <a href="#" className="text-gray-400 hover:text-amber-400 transition">Privacy</a>
                <a href="#" className="text-gray-400 hover:text-amber-400 transition">Contact</a>
              </div>
            </div>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Landing;