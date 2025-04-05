import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    createUserWithEmailAndPassword,
    signInWithPopup
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, db, googleProvider } from '../firebase';
import {
    EnvelopeIcon,
    LockClosedIcon,
    UserIcon,
    CheckCircleIcon,
    XCircleIcon,
    UserCircleIcon,
    AcademicCapIcon,
    BuildingLibraryIcon
} from '@heroicons/react/24/outline';

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

// Моковые данные университетов для основных городов
const universitiesData = {
    'Москва': [
        'Московский государственный университет',
        'НИУ ВШЭ',
        'МГТУ им. Баумана',
        'РЭУ им. Плеханова'
    ],
    'Санкт-Петербург': [
        'СПбГУ',
        'ИТМО',
        'Политех Петра Великого',
        'ГЭУ'
    ],
    'Новосибирск': [
        'НГУ',
        'НГТУ',
        'СибГУТИ'
    ],
    'Казань': [
        'КФУ',
        'КНИТУ',
        'КАИ'
    ],
    'Екатеринбург': [
        'УрФУ',
        'УрГЮУ',
        'УрГЭУ'
    ]
};

const Signup = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [universities, setUniversities] = useState([]);
    const [selectedUniversity, setSelectedUniversity] = useState('');
    const [error, setError] = useState('');
    const [requirements, setRequirements] = useState({
        length: false,
        uppercase: false,
        specialChar: false,
        cyrillic: false
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    useEffect(() => {
        const loadCities = async () => {
            try {
                // Загрузка городов через Dadata API
                const response = await fetch('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': '845295008e1796ca9da87f799cdcbccee0785659'
                    },
                    body: JSON.stringify({
                        query: 'Россия',
                        from_bound: { value: 'city' },
                        to_bound: { value: 'city' },
                        count: 100,
                        locations: [{ country: 'Россия' }]
                    })
                });

                const data = await response.json();
                const uniqueCities = Array.from(
                    new Set(
                        data.suggestions
                            .map(s => s.data.city)
                            .filter(Boolean)
                    )
                ).sort();

                setCities(uniqueCities);
                setIsDataLoading(false);
            } catch (error) {
                console.error('Ошибка загрузки городов:', error);
                setCities(['Москва', 'Санкт-Петербург', 'Новосибирск', 'Казань', 'Екатеринбург']);
                setIsDataLoading(false);
            }
        };

        loadCities();
    }, []);

    useEffect(() => {
        if (selectedCity && universitiesData[selectedCity]) {
            setUniversities(universitiesData[selectedCity]);
        } else {
            setUniversities([]);
        }
    }, [selectedCity]);

    useEffect(() => {
        const validate = () => {
            setRequirements({
                length: password.length >= 8,
                uppercase: /[A-Z]/.test(password),
                specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
                cyrillic: /[а-яА-ЯЁё]/.test(password)
            });
        };
        validate();
    }, [password]);

    const RequirementItem = ({ met, text }) => (
        <motion.li
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
        >
            {met ? (
                <CheckCircleIcon className="w-4 h-4 text-green-500" />
            ) : (
                <XCircleIcon className="w-4 h-4 text-red-500" />
            )}
            <span className={`text-sm ${met ? 'text-green-600' : 'text-gray-500'}`}>
                {text}
            </span>
        </motion.li>
    );

    const handleCityChange = (e) => {
        setSelectedCity(e.target.value);
        setSelectedUniversity('');
    };

    const validateForm = () => {
        return (
            firstName.trim() &&
            lastName.trim() &&
            selectedCity &&
            selectedUniversity &&
            !requirements.cyrillic &&
            requirements.length &&
            requirements.uppercase &&
            requirements.specialChar
        );
    };

    const handleGoogleSignup = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                firstName: user.displayName?.split(' ')[0] || '',
                lastName: user.displayName?.split(' ')[1] || '',
                city: selectedCity || 'Не указан',
                university: selectedUniversity || 'Не указан',
                photoURL: user.photoURL,
                createdAt: new Date(),
            });

            navigate('/success?type=signup');
        } catch (error) {
            setError(error.message);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!validateForm()) {
            setError('Заполните все обязательные поля и проверьте требования к паролю');
            setIsLoading(false);
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                firstName,
                lastName,
                city: selectedCity,
                university: selectedUniversity,
                createdAt: new Date(),
            });

            setTimeout(() => navigate('/success?type=signup'), 1000);
        } catch (error) {
            switch (error.code) {
                case 'auth/email-already-in-use':
                    setError('Пользователь с таким email уже зарегистрирован');
                    break;
                case 'auth/invalid-email':
                    setError('Неверный формат email');
                    break;
                default:
                    setError('Ошибка регистрации: ' + error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (!isMounted) return null;

    const fieldAnimation = {
        hover: { scale: 1.02 },
        tap: { scale: 0.98 },
        focus: {
            boxShadow: "0 0 0 2px rgba(147, 51, 234, 0.5)",
            backgroundColor: "rgba(245, 243, 255, 0.5)"
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-8 overflow-hidden">

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
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="z-10"
            >
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md"
                >
                    <motion.form
                        onSubmit={handleSignup}
                        className="bg-white rounded-2xl shadow-xl p-8 space-y-6"
                    >
                        <div className="text-center space-y-2">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                CampusConnect
                            </h2>
                            <p className="text-gray-500">Создавайте мероприятия между кампусами</p>
                        </div>

                        <motion.button
                            type="button"
                            onClick={handleGoogleSignup}
                            className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 rounded-lg flex items-center justify-center gap-3"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
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
                            <span>Продолжить с Google</span>
                        </motion.button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center">
                                <span className="px-2 bg-white text-gray-500 text-sm">или</span>
                            </div>
                        </div>

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

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <motion.div variants={fieldAnimation} whileHover="hover" whileTap="tap">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Имя
                                    </label>
                                    <div className="relative">
                                        <UserCircleIcon className="w-6 h-6 absolute left-2.5 top-1/4 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                                            placeholder="Иван"
                                            required
                                        />
                                    </div>
                                </motion.div>

                                <motion.div variants={fieldAnimation} whileHover="hover" whileTap="tap">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Фамилия
                                    </label>
                                    <div className="relative">
                                        <UserCircleIcon className="w-6 h-6 absolute left-2.5 top-1/4 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                                            placeholder="Иванов"
                                            required
                                        />
                                    </div>
                                </motion.div>
                            </div>

                            <motion.div variants={fieldAnimation} whileHover="hover" whileTap="tap">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Город
                                </label>
                                <div className="relative">
                                    <BuildingLibraryIcon className="w-6 h-6 absolute left-2.5 top-1/4 -translate-y-1/2 text-gray-400" />
                                    <select
                                        value={selectedCity}
                                        onChange={handleCityChange}
                                        className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-200 focus:border-purple-500 appearance-none"
                                        disabled={isDataLoading}
                                        required
                                    >
                                        <option value="" disabled>
                                            {isDataLoading ? 'Загрузка...' : 'Выберите город'}
                                        </option>
                                        {cities.map(city => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </select>
                                </div>
                            </motion.div>

                            {selectedCity && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-2"
                                >
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Университет
                                    </label>
                                    <div className="relative">
                                        <AcademicCapIcon className="w-6 h-6 absolute left-2.5 top-1/4 -translate-y-1/2 text-gray-400" />
                                        <select
                                            value={selectedUniversity}
                                            onChange={(e) => setSelectedUniversity(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-200 focus:border-purple-500 appearance-none"
                                            required
                                        >
                                            <option value="" disabled>Выберите вуз</option>
                                            {universities.map(uni => (
                                                <option key={uni} value={uni}>{uni}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {universities.length === 0 && (
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                value={selectedUniversity}
                                                onChange={(e) => setSelectedUniversity(e.target.value)}
                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-200"
                                                placeholder="Введите название университета"
                                                required
                                            />
                                            <p className="text-sm text-gray-500 mt-1">
                                                Если вашего вуза нет в списке, введите его название
                                            </p>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            <motion.div variants={fieldAnimation} whileHover="hover" whileTap="tap">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <EnvelopeIcon className="w-6 h-6 absolute left-2.5 top-1/4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                                        placeholder="example@mail.com"
                                        required
                                    />
                                </div>
                            </motion.div>

                            <motion.div variants={fieldAnimation} whileHover="hover" whileTap="tap">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Пароль
                                </label>
                                <div className="relative">
                                    <LockClosedIcon className="w-6 h-6 absolute left-2.5 top-1/4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                                <ul className="mt-3 space-y-2">
                                    <RequirementItem
                                        met={!requirements.cyrillic}
                                        text="Без русских букв"
                                    />
                                    <RequirementItem
                                        met={requirements.length}
                                        text="Минимум 8 символов"
                                    />
                                    <RequirementItem
                                        met={requirements.uppercase}
                                        text="Хотя бы одна заглавная"
                                    />
                                    <RequirementItem
                                        met={requirements.specialChar}
                                        text="Специальный символ"
                                    />
                                </ul>
                            </motion.div>
                        </div>

                        <motion.button
                            type="submit"
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg relative overflow-hidden"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isLoading || isDataLoading}
                        >
                            <AnimatePresence>
                                {isLoading && (
                                    <motion.div
                                        className="absolute inset-0 bg-purple-700"
                                        initial={{ width: 0 }}
                                        animate={{ width: "100%" }}
                                        exit={{ width: 0 }}
                                        transition={{ duration: 2 }}
                                    />
                                )}
                            </AnimatePresence>
                            <div className="relative z-10 flex items-center justify-center gap-2">
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
                                    <UserIcon className="w-5 h-5" />
                                </motion.div>
                                <span>{isLoading ? "Регистрация..." : "Создать аккаунт"}</span>
                            </div>
                        </motion.button>

                        <div className="text-center text-sm text-gray-600">
                            Уже есть аккаунт? {' '}
                            <Link
                                to="/"
                                className="text-purple-600 hover:text-purple-800 font-medium underline"
                            >
                                Войти
                            </Link>
                            <div className="mt-4">
                                <p className="text-gray-500">©2025 CampusConnect</p>
                            </div>
                        </div>
                    </motion.form>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Signup;