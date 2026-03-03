import React from 'react';
import { Heart, Users, Shield, Globe, Award, Droplet } from 'lucide-react';
import { motion } from 'motion/react';
import { Card } from '@/components/ui/Card';

export const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 via-pink-600 to-purple-700 text-white p-10 md:p-16 text-center shadow-2xl"
      >
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative z-10"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Saving Lives, <br/>
            <span className="text-yellow-300">One Drop at a Time</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-red-100 font-medium">
            We are a community-driven platform dedicated to connecting blood donors with those in critical need across Sandwip.
          </p>
        </motion.div>
        
        {/* Decorative Circles */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl"></div>
      </motion.div>

      {/* Mission & Vision */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        <motion.div variants={itemVariants}>
          <Card className="h-full p-8 border-none shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 hover:shadow-xl transition-shadow duration-300">
            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
              <Globe className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              To create a seamless, efficient, and reliable network of blood donors in Sandwip, ensuring that no life is lost due to the unavailability of blood. We aim to bridge the gap between donors and patients through technology and community spirit.
            </p>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="h-full p-8 border-none shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 hover:shadow-xl transition-shadow duration-300">
            <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mb-6 text-green-600 dark:text-green-400">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Our Vision</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              A Sandwip where every emergency blood request is met within minutes. We envision a society where voluntary blood donation is a norm, and every citizen feels responsible for the well-being of their neighbors.
            </p>
          </Card>
        </motion.div>
      </motion.div>

      {/* Benefits of Blood Donation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-8"
      >
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100">The Power of Giving</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Duniya Benefits */}
          <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20">
            <h3 className="text-2xl font-bold text-orange-700 dark:text-orange-400 mb-4 flex items-center gap-2">
              <Heart className="w-6 h-6" />
              In This World (Duniya)
            </h3>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-2 h-2 bg-orange-400 rounded-full shrink-0" />
                <span><strong>Heart Health:</strong> Regular donation reduces the risk of heart attacks and strokes by lowering excess iron.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-2 h-2 bg-orange-400 rounded-full shrink-0" />
                <span><strong>Cell Renewal:</strong> Stimulates the production of new blood cells, keeping you healthy and energized.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-2 h-2 bg-orange-400 rounded-full shrink-0" />
                <span><strong>Free Health Check:</strong> Get a mini-physical and find out your blood type for free.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-2 h-2 bg-orange-400 rounded-full shrink-0" />
                <span><strong>Mental Well-being:</strong> The unparalleled joy and satisfaction of saving a human life.</span>
              </li>
            </ul>
          </Card>

          {/* Akhirat Benefits */}
          <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20">
            <h3 className="text-2xl font-bold text-teal-700 dark:text-teal-400 mb-4 flex items-center gap-2">
              <Award className="w-6 h-6" />
              In The Hereafter (Akhirat)
            </h3>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-2 h-2 bg-teal-400 rounded-full shrink-0" />
                <span><strong>Saving Humanity:</strong> "And whoever saves one - it is as if he had saved mankind entirely." (Quran 5:32)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-2 h-2 bg-teal-400 rounded-full shrink-0" />
                <span><strong>Sadqa-e-Jariyah:</strong> A continuous charity that benefits you even after death.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-2 h-2 bg-teal-400 rounded-full shrink-0" />
                <span><strong>Allah's Mercy:</strong> Helping someone in distress brings down the mercy and blessings of Allah.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-2 h-2 bg-teal-400 rounded-full shrink-0" />
                <span><strong>Forgiveness:</strong> Acts of kindness and charity are a means of forgiveness for sins.</span>
              </li>
            </ul>
          </Card>
        </div>
      </motion.div>

      {/* Video Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-4 ring-red-100 bg-black aspect-video group mx-auto max-w-4xl"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-red-600/20 to-purple-600/20 z-10 pointer-events-none group-hover:opacity-0 transition-opacity duration-500" />
        <iframe 
          className="w-full h-full"
          src="https://www.youtube.com/embed/ODRb1fP31L0?si=QOkAHqfnfG00lR5F" 
          title="Blood Donation Awareness"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowFullScreen
        ></iframe>
      </motion.div>

      {/* Why Choose Us */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-8"
      >
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-12">Why We Are Special</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Users, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-900/30", title: "Community Driven", desc: "Built by the people of Sandwip, for the people of Sandwip." },
            { icon: Shield, color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/30", title: "Verified Donors", desc: "We ensure authentic donor profiles for safety and reliability." },
            { icon: Droplet, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-100 dark:bg-rose-900/30", title: "Fast Response", desc: "Our platform connects you to the nearest donors instantly." },
            { icon: Award, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/30", title: "Recognized", desc: "Trusted by local hospitals and community leaders." }
          ].map((item, index) => (
            <motion.div 
              key={index}
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 text-center"
            >
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${item.bg} ${item.color}`}>
                <item.icon className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Developer Credit / Footer Note */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gray-900 dark:bg-gray-950 rounded-3xl p-8 md:p-12 text-center text-gray-300 relative overflow-hidden"
      >
        <div className="relative z-10">
          <h3 className="text-2xl font-bold text-white mb-4">Join Our Movement</h3>
          <p className="mb-8 max-w-2xl mx-auto text-gray-300">
            Become a hero today. Your one donation can save up to three lives. Join the Sandwip Blood Donor family and make a difference.
          </p>
          <div className="flex justify-center gap-4">
            <a href="/register" className="bg-white text-gray-900 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors">
              Register Now
            </a>
            <a href="/donors" className="bg-transparent border border-gray-600 text-white px-6 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors">
              Find Donors
            </a>
          </div>
        </div>
        
        {/* Background Gradient */}
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-gray-800 to-transparent opacity-50"></div>
      </motion.div>
    </div>
  );
};
