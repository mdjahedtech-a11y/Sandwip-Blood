import { Link, useLocation } from 'react-router-dom';
import { Home, Users, PlusCircle, AlertCircle, Facebook, User, Info, Trophy, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/Button';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { NotificationBell } from './NotificationBell';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';

export const Navbar = () => {
  const location = useLocation();
  const [session, setSession] = useState<any>(null);
  const { t } = useLanguage();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const navItems = [
    { name: t('nav.home'), path: '/', icon: Home },
    { name: t('nav.donors'), path: '/donors', icon: Users },
    { name: t('nav.register'), path: '/register', icon: PlusCircle },
    { name: t('nav.requests'), path: '/requests', icon: AlertCircle },
    { name: t('nav.about'), path: '/about', icon: Info },
    { name: t('nav.heroes'), path: '/leaderboard', icon: Trophy },
    { name: t('nav.certificate'), path: '/certificate', icon: Award },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-red-600 p-1.5 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="white"
                  className="w-6 h-6"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white">
                Sandwip<span className="text-red-600">Blood</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2',
                  location.pathname === item.path
                    ? 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400'
                    : 'text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            ))}
            
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>

            <LanguageToggle />
            <ThemeToggle />

            <NotificationBell />

            <a 
              href="https://www.facebook.com/share/17AipYKy6r/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20"
              title="Join our Facebook Group"
            >
              <Facebook className="w-5 h-5" />
            </a>

            {(session?.user?.email === '01580824066@sandwip.com' || session?.user?.email === 'mdjahedtech@gmail.com') && (
              <Link to="/admin">
                <Button variant="outline" size="sm">
                  {t('nav.admin')}
                </Button>
              </Link>
            )}
            
            {session ? (
              <Link to="/profile">
                <Button variant="default" size="sm" className="gap-2">
                  <User className="w-4 h-4" /> {t('nav.profile')}
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button variant="default" size="sm">
                  {t('nav.login')}
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button - Hidden since we have Bottom Nav */}
          <div className="flex items-center md:hidden gap-2">
            <LanguageToggle />
            <ThemeToggle />
            <NotificationBell />
            <a 
              href="https://www.facebook.com/share/17AipYKy6r/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              <Facebook className="w-5 h-5" />
            </a>
            {session ? (
              <Link to="/profile">
                 <Button variant="ghost" size="sm"><User className="w-5 h-5" /></Button>
              </Link>
            ) : (
              <Link to="/login">
                 <Button variant="ghost" size="sm">{t('nav.login')}</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
