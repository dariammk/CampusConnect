import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

// Иконки для фона (можно использовать любые из heroicons)
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

const Success = () => {
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type');
    const navigate = useNavigate();

    const messages = {
        login: 'Вход выполнен успешно!',
        signup: 'Регистрация прошла успешно!'
    };

    const containerAnimation = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                stiffness: 120,
                staggerChildren: 0.2
            }
        }
    };

    const itemAnimation = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const iconAnimation = {
        hover: { scale: 1.05 },
        tap: { scale: 0.95 },
        bounce: {
            y: [0, -20, 0],
            transition: {
                duration: 1.5,
                repeat: Infinity,
                repeatType: 'loop'
            }
        }
    };

    // Анимация для фоновых иконок
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-8 overflow-hidden">
            {/* Анимированный фон */}
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

            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerAnimation}
                className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 space-y-6 text-center relative z-10"
            >
                {/* Остальной код компонента без изменений */}
                <motion.div
                    variants={itemAnimation}
                    className="flex justify-center"
                >
                    <motion.div
                        variants={iconAnimation}
                        whileHover="hover"
                        whileTap="tap"
                        animate="bounce"
                    >
                        <CheckCircleIcon className="w-20 h-20 text-green-500" />
                    </motion.div>
                </motion.div>

                <AnimatePresence>
                    <motion.div
                        variants={itemAnimation}
                        className="space-y-2"
                    >
                        <motion.h2
                            className="text-3xl font-bold text-gray-800"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            {messages[type] || 'Операция выполнена успешно!'}
                        </motion.h2>
                        <motion.p
                            className="text-gray-500"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            {type === 'signup'
                                ? 'Ваш аккаунт готов к использованию'
                                : 'Добро пожаловать обратно!'}
                        </motion.p>
                    </motion.div>
                </AnimatePresence>

                <motion.button
                    onClick={() => navigate('/main')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                >
                    Перейти на главную
                </motion.button>
            </motion.div>
        </div>
    );
};

export default Success;