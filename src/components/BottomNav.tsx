import { Link, useLocation } from 'react-router-dom';
import { Home, Users, PlusCircle, AlertCircle, User, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export const BottomNav = () => {
  const location = useLocation();
  const [session, setSession] = useState<any>(null);

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
    { 
      name: 'Home', 
      path: '/', 
      icon: Home,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    { 
      name: 'Donors', 
      path: '/donors', 
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    // Conditionally render Register or Profile based on session
    session ? {
      name: 'Profile',
      path: '/profile',
      icon: User,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    } : { 
      name: 'Register', 
      path: '/register', 
      icon: PlusCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      name: 'Requests', 
      path: '/requests', 
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      name: 'About',
      path: '/about',
      icon: Info,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden pb-safe">
      <nav className="bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] flex justify-between items-center px-2 py-2 w-full">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center justify-center w-full py-2"
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className={cn(
                    "absolute -top-8 w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-4 border-white",
                    item.bgColor
                  )}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Icon className={cn("w-6 h-6", item.color)} />
                </motion.div>
              )}
              
              <div className={cn(
                "flex flex-col items-center transition-all duration-300",
                isActive ? "opacity-0 translate-y-4" : "opacity-100"
              )}>
                <Icon className={cn("w-6 h-6 mb-1 text-gray-400 group-hover:text-gray-600")} />
              </div>
              
              {isActive && (
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("text-xs font-bold mt-6 absolute", item.color)}
                >
                  {item.name}
                </motion.span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
