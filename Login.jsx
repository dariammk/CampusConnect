import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    signInWithEmailAndPassword,
    signInWithPopup
} from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, googleProvider } from '../firebase';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const backgroundIcons = [
    { icon: '📘', size: 70 },
    { icon: '🎓', size: 80 },
    { icon: '📚', size: 65 },
    { icon: '🏫', size: 75 },
    { icon: '✏️', size: 55 },
    { icon: '📝', size: 60 },
    { icon: '🎩', size: 70 },
    { icon: '🐶', size: 80 },
    { icon: '🎆', size: 65 },
    { icon: '📱', size: 75 },
    { icon: '💵', size: 55 },
    { icon: '🧲', size: 60 },
    { icon: '📩', size: 70 },
    { icon: '🟣', size: 80 },
    { icon: '♠️', size: 65 },
    { icon: '💬', size: 75 },
    { icon: '🎈', size: 55 },
    { icon: '📆', size: 60 },
];

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            await new Promise(resolve => setTimeout(resolve, 1000));
            navigate('/success?type=login');
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            navigate('/success?type=login');
        } catch (error) {
            setError(error.message);
        }
    };

    if (!isMounted) return null;

    const fieldAnimation = {
        hover: { scale: 1.02 },
        tap: { scale: 0.98 },
        focus: {
            boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)",
            backgroundColor: "rgba(239, 246, 255, 0.5)"
        }
    };

    const iconAnimation = {
        hover: { rotate: [0, -10, 10, 0], scale: 1.1 },
        tap: { scale: 0.9 }
    };

    const backgroundIconAnimation = {
        animate: {
            x: ["-50%", "150%"],
            y: ["0%", "100%"],
            rotate: [0, 360],
            transition: {
                duration: 20 + Math.random() * 20,
                repeat: Infinity,
                repeatType: 'loop',
                ease: 'linear'
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-8 overflow-hidden gap-8">
            {/* Background Icons */}
            <div className="absolute inset-0 pointer-events-none">
                {backgroundIcons.map((icon, index) => (
                    <motion.div
                        key={index}
                        className="absolute text-gray-100 opacity-30"
                        style={{
                            fontSize: `${icon.size}px`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        variants={backgroundIconAnimation}
                        animate="animate"
                    >
                        {icon.icon}
                    </motion.div>
                ))}
            </div>

            {/* Video Section */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="hidden md:block flex-1 max-w-xl w-full"
            >
                <div className="relative w-full rounded-2xl shadow-xl overflow-hidden"
                    style={{ paddingTop: '56.25%' }}> {/* 16:9 Aspect Ratio */}
                    <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&loop=1&playlist=dQw4w9WgXcQ"
                        title="Demo video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            </motion.div>

            {/* Login Form Section */}
            <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                transition={{ type: 'spring', stiffness: 120 }}
                className="flex-1 max-w-md z-10"
            >
                <motion.form
                    onSubmit={handleLogin}
                    className="bg-white rounded-2xl shadow-xl p-8 space-y-6"
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                >
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-center space-y-2"
                    >
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            CampusConnect
                        </h2>
                        <p className="text-gray-500">Введите свои данные для входа</p>
                    </motion.div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="p-3 bg-red-50 text-red-700 rounded-lg text-sm"
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-lg flex items-center justify-center gap-3"
                    >
                        <motion.svg
                            className="w-5 h-5"
                            viewBox="0 0 48 48"
                            variants={iconAnimation}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                        </motion.svg>
                        <span>Войти через Google</span>
                    </motion.button>

                    <motion.div
                        className="relative"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="absolute inset-0 flex items-center">
                            <motion.div
                                className="w-full border-t border-gray-300"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                            />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">или</span>
                        </div>
                    </motion.div>

                    <motion.div
                        className="space-y-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <motion.div
                            variants={fieldAnimation}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <motion.div
                                className="relative"
                                whileFocus="focus"
                            >
                                <motion.div
                                    variants={iconAnimation}
                                    whileHover=""
                                    whileTap=""
                                >
                                    <EnvelopeIcon className="w-6 h-6 absolute left-2.5 top-1/4 -translate-y-1/2 text-gray-400" />
                                </motion.div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300"
                                    placeholder="example@mail.ru"
                                    required
                                />
                            </motion.div>
                        </motion.div>

                        <motion.div
                            variants={fieldAnimation}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Пароль
                            </label>
                            <motion.div
                                className="relative"
                                whileFocus="focus"
                            >
                                <motion.div
                                    variants={iconAnimation}
                                    whileHover=""
                                    whileTap=""
                                >
                                    <LockClosedIcon className="w-6 h-6 absolute left-2.5 top-1/4 -translate-y-1/2 text-gray-400" />
                                </motion.div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300"
                                    placeholder="••••••••"
                                    required
                                />
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    <motion.button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg flex items-center justify-center space-x-2 relative overflow-hidden"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isLoading}
                    >
                        <AnimatePresence>
                            {isLoading && (
                                <motion.div
                                    className="absolute inset-0 bg-blue-700 z-0"
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    exit={{ width: 0 }}
                                    transition={{ duration: 2 }}
                                />
                            )}
                        </AnimatePresence>

                        <div className="relative z-10 flex items-center gap-2">
                            <motion.div
                                animate={{
                                    rotate: isLoading ? 360 : 0,
                                    scale: isLoading ? 1.2 : 1
                                }}
                                transition={{
                                    rotate: {
                                        repeat: Infinity,
                                        duration: 1,
                                        ease: "linear"
                                    }
                                }}
                            >
                                <LockClosedIcon className="w-5 h-5 text-white" />
                            </motion.div>
                            <span>
                                {isLoading ? "Вход..." : "Войти в аккаунт"}
                            </span>
                        </div>
                    </motion.button>

                    <motion.div
                        className="text-center text-sm text-gray-600"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        Нет аккаунта? {' '}
                        <motion.span
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                to="/signup"
                                className="text-blue-600 hover:text-blue-800 font-medium underline transition-colors duration-300"
                            >
                                Создать аккаунт
                            </Link>
                        </motion.span>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-700 to-gray-700 bg-clip-text text-transparent">‎ </h2>
                        <h2 className="text-2xl font-bold text-gray-500">DEVINK</h2>
                        <p className="text-gray-500">©2025</p>
                    </motion.div>
                </motion.form>
            </motion.div>
        </div>
    );
};

export default Login;