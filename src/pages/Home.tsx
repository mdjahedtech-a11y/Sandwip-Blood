import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Users, Heart, Activity, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export const Home = () => {
  const sliderImages = [
    {
      url: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?q=80&w=2883&auto=format&fit=crop",
      caption: "Every drop counts. Be a hero."
    },
    {
      url: "https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=2940&auto=format&fit=crop",
      caption: "Your blood can save a life today."
    },
    {
      url: "https://images.unsplash.com/photo-1584362917165-526a968579e8?q=80&w=2836&auto=format&fit=crop",
      caption: "Join our community of lifesavers."
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Slider Section */}
      <section className="rounded-3xl overflow-hidden shadow-lg relative">
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
          className="w-full h-[300px] md:h-[400px]"
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
                  <h2 className="text-white text-2xl md:text-4xl font-bold text-center px-4 drop-shadow-lg">
                    {image.caption}
                  </h2>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Hero Text Section */}
      <section className="text-center py-8 px-4 bg-gradient-to-br from-red-50 to-white rounded-3xl border border-red-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-red-100 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-red-100 rounded-full opacity-50 blur-3xl"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Donate Blood, <span className="text-red-600">Save Life</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Your donation can be the reason for someone's heartbeat. Join the Sandwip Blood Donor community today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto shadow-red-200 shadow-lg">
                Register as Donor
              </Button>
            </Link>
            <Link to="/donors">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                <Search className="w-4 h-4 mr-2" />
                Find Donors
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <Card className="p-4 md:p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-red-100 rounded-full text-red-600 shrink-0">
            <Users className="w-6 h-6 md:w-8 md:h-8" />
          </div>
          <div>
            <p className="text-xs md:text-sm text-gray-500 font-medium">Active Donors</p>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900">1,200+</h3>
          </div>
        </Card>
        <Card className="p-4 md:p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-green-100 rounded-full text-green-600 shrink-0">
            <Heart className="w-6 h-6 md:w-8 md:h-8" />
          </div>
          <div>
            <p className="text-xs md:text-sm text-gray-500 font-medium">Lives Saved</p>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900">3,500+</h3>
          </div>
        </Card>
        <Card className="p-4 md:p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-blue-100 rounded-full text-blue-600 shrink-0">
            <Activity className="w-6 h-6 md:w-8 md:h-8" />
          </div>
          <div>
            <p className="text-xs md:text-sm text-gray-500 font-medium">Requests Fulfilled</p>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900">98%</h3>
          </div>
        </Card>
      </div>

      {/* Emergency CTA */}
      <section className="bg-red-600 rounded-2xl p-8 text-white shadow-xl shadow-red-200 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Need Blood Urgently?</h2>
          <p className="text-red-100">Post an emergency request and notify nearby donors instantly.</p>
        </div>
        <Link to="/requests">
          <Button variant="secondary" size="lg" className="whitespace-nowrap">
            Post Request
          </Button>
        </Link>
      </section>
    </div>
  );
};
