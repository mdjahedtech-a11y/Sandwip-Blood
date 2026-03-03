import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Users, Heart, Activity, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { useLanguage } from '@/contexts/LanguageContext';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export const Home = () => {
  const { t } = useLanguage();

  const sliderImages = [
    {
      url: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?q=80&w=2883&auto=format&fit=crop",
      caption: t('home.heroTitle')
    },
    {
      url: "https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=2940&auto=format&fit=crop",
      caption: t('home.heroSubtitle')
    },
    {
      url: "https://images.unsplash.com/photo-1584362917165-526a968579e8?q=80&w=2836&auto=format&fit=crop",
      caption: t('home.cta.desc')
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Slider Section */}
      <section className="rounded-2xl overflow-hidden shadow-lg dark:shadow-gray-800 relative">
        <Swiper
          spaceBetween={0}
          centeredSlides={true}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          className="w-full h-[180px] sm:h-[250px] md:h-[350px]"
        >
          {sliderImages.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-full">
                <img 
                  src={image.url} 
                  alt={`Slide ${index + 1}`} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <h2 className="text-white text-lg sm:text-2xl md:text-3xl font-bold text-center px-4 drop-shadow-lg">
                    {image.caption}
                  </h2>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Hero Text Section */}
      <section className="text-center py-6 px-4 bg-gradient-to-br from-red-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl border border-red-100 dark:border-gray-700 shadow-sm relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-red-100 dark:bg-red-900/20 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-red-100 dark:bg-red-900/20 rounded-full opacity-50 blur-3xl"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-3 tracking-tight">
            {t('home.heroTitle')}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-6 leading-relaxed">
            {t('home.heroSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link to="/register">
              <Button size="default" className="w-full sm:w-auto shadow-red-200 dark:shadow-none shadow-md text-sm sm:text-base">
                {t('home.beDonor')}
              </Button>
            </Link>
            <Link to="/donors">
              <Button variant="secondary" size="default" className="w-full sm:w-auto text-sm sm:text-base dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                <Search className="w-4 h-4 mr-2" />
                {t('home.findDonor')}
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-5">
        <Card className="p-4 flex items-center gap-3 hover:shadow-md dark:hover:shadow-gray-800 transition-shadow dark:bg-gray-800 dark:border-gray-700">
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full text-red-600 dark:text-red-400 shrink-0">
            <Users className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{t('home.stats.donors')}</p>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">1,200+</h3>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3 hover:shadow-md dark:hover:shadow-gray-800 transition-shadow dark:bg-gray-800 dark:border-gray-700">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400 shrink-0">
            <Heart className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{t('home.stats.lives')}</p>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">3,500+</h3>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3 hover:shadow-md dark:hover:shadow-gray-800 transition-shadow dark:bg-gray-800 dark:border-gray-700">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 shrink-0">
            <Activity className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{t('home.stats.districts')}</p>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">15+</h3>
          </div>
        </Card>
      </div>

      {/* Emergency CTA */}
      <section className="bg-red-600 dark:bg-red-700 rounded-xl p-6 text-white shadow-lg shadow-red-200 dark:shadow-none flex flex-col md:flex-row items-center justify-between gap-4 transition-colors duration-300">
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-1">{t('home.features.emergency.title')}</h2>
          <p className="text-red-100 text-sm md:text-base">{t('home.features.emergency.desc')}</p>
        </div>
        <Link to="/requests" className="w-full md:w-auto">
          <Button variant="secondary" size="default" className="w-full whitespace-nowrap dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
            {t('nav.requests')}
          </Button>
        </Link>
      </section>
    </div>
  );
};
