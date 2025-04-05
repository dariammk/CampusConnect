import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    getFirestore,
    collection,
    query,
    onSnapshot,
    addDoc,
    doc,
    getDoc
} from 'firebase/firestore';
import { auth, db } from '../firebase'; // Проверь путь
import {
    BellIcon,
    UserGroupIcon,
    CalendarIcon,
    ArrowLeftOnRectangleIcon,
    ChevronRightIcon,
    UserCircleIcon
} from '@heroicons/react/24/outline';

const HomePage = () => {
    const [user, setUser] = useState(null);
    const [events, setEvents] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [newPostText, setNewPostText] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Реалтайм подписка на мероприятия
    useEffect(() => {
        const q = query(collection(db, 'events'));
        const unsubscribeEvents = onSnapshot(q,
            (snapshot) => {
                const processedEvents = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    date: doc.data().date?.toDate(),
                    createdAt: doc.data().createdAt?.toDate()
                }));
                setEvents(processedEvents);
                setLoading(false);
            },
            (error) => {
                console.error('Ошибка загрузки мероприятий:', error);
                setLoading(false);
            }
        );

        return () => unsubscribeEvents();
    }, []);

    // Загрузка данных пользователя
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
            if (!authUser) {
                navigate('/login');
                return;
            }

            try {
                const userDoc = await getDoc(doc(db, "users", authUser.uid));
                if (userDoc.exists()) {
                    setUser({
                        ...authUser,
                        ...userDoc.data() // Загружаем все данные пользователя
                    });
                } else {
                    setUser(authUser);
                }
            } catch (error) {
                console.error('Ошибка загрузки профиля:', error);
                setUser(authUser);
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    // Создание нового мероприятия
    const handleCreateEvent = async () => {
        if (!newPostText.trim() || !user) return;

        try {
            // Получаем актуальные данные пользователя
            const userDoc = await getDoc(doc(db, "users", user.uid));
            const userData = userDoc.data();

            await addDoc(collection(db, 'events'), {
                title: newPostText,
                description: 'Описание мероприятия',
                date: new Date(),
                location: userData?.university || 'Неизвестный вуз',
                university: userData?.university, // Сохраняем название вуза
                city: userData?.city, // Сохраняем город
                ownerId: user.uid,
                participants: [],
                createdAt: new Date()
            });
            setNewPostText('');
        } catch (error) {
            console.error('Ошибка создания мероприятия:', error);
        }
    };

    // Анимации
    const cardAnimation = {
        hover: { y: -5, scale: 1.02 },
        tap: { scale: 0.98 }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Шапка */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-800">CampusConnect</h1>
                    <div className="flex items-center gap-4">
                        <button className="p-2 hover:bg-gray-100 rounded-full relative">
                            <BellIcon className="w-6 h-6 text-gray-600" />
                            {notifications.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                                    {notifications.length}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => {
                                auth.signOut();
                                navigate('/login');
                            }}
                            className="flex items-center gap-2 text-gray-600 hover:text-red-600"
                        >
                            <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                            <span>Выйти</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Основной контент */}
            <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Левая панель - Профиль */}
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="bg-white p-6 rounded-xl shadow-sm"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <UserCircleIcon className="w-12 h-12 text-gray-400" />
                        <div>
                            <h2 className="font-semibold text-gray-800">
                                {user?.firstName || user?.displayName?.split(' ')[0] || 'Гость'}
                                {user?.lastName && ` ${user.lastName}`}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {user?.university || 'Университет не указан'}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                {user?.city && `Город: ${user.city}`}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                            <span>Друзья</span>
                            <ChevronRightIcon className="w-5 h-5" />
                        </button>
                        <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                            <span>Сообщения</span>
                            <ChevronRightIcon className="w-5 h-5" />
                        </button>
                    </div>
                </motion.div>

                {/* Центральная лента */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Создание поста */}
                    <motion.div
                        className="bg-white p-6 rounded-xl shadow-sm"
                        whileHover={{ scale: 1.005 }}
                    >
                        <div className="flex items-center gap-4">
                            <UserCircleIcon className="w-10 h-10 text-gray-400" />
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={newPostText}
                                    onChange={(e) => setNewPostText(e.target.value)}
                                    placeholder="Создать новое мероприятие..."
                                    className="w-full p-3 bg-gray-50 rounded-lg focus:outline-none"
                                />
                                <button
                                    onClick={handleCreateEvent}
                                    className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                    disabled={!newPostText.trim() || loading}
                                >
                                    {loading ? 'Создание...' : 'Создать'}
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Список мероприятий */}
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto" />
                        </div>
                    ) : (
                        events.map(event => (
                            <motion.div
                                key={event.id}
                                variants={cardAnimation}
                                whileHover="hover"
                                whileTap="tap"
                                className="bg-white p-6 rounded-xl shadow-sm"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="bg-blue-100 p-3 rounded-full">
                                        <CalendarIcon className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{event.title}</h3>
                                        <p className="text-sm text-gray-500">
                                            {event.date?.toLocaleDateString('ru-RU')} • {event.university || event.location}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {event.city && `Город: ${event.city}`}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-gray-600 mb-4">{event.description}</p>
                                <div className="flex items-center gap-4 text-sm">
                                    <button className="flex items-center gap-2 text-blue-600">
                                        <UserGroupIcon className="w-5 h-5" />
                                        <span>{event.participants?.length || 0} участников</span>
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Правая панель - Уведомления */}
                <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="bg-white p-6 rounded-xl shadow-sm"
                >
                    <h3 className="font-semibold mb-4">Уведомления</h3>
                    <div className="space-y-4">
                        {notifications.map((notification, index) => (
                            <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600">{notification.text}</p>
                                <span className="text-xs text-gray-400">
                                    {notification.date?.toLocaleDateString('ru-RU')}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Футер */}
            <footer className="border-t bg-white mt-8">
                <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
                    <p>© 2024 CampusConnect. Все права защищены.</p>
                    <p>Создано командой DEVINK</p>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
