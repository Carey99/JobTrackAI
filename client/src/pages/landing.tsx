import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Brain, TrendingUp, Users, ArrowRight, Menu, X } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Particles } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useCallback } from 'react';
import HeroBackground from '@/components/3d/HeroBackground';

export default function Landing() {
  const [, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const containerRef = useRef(null);
  
  // Parallax scrolling effect hooks
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, -200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacity1 = useTransform(scrollY, [0, 300, 500], [1, 0.5, 0]);
  const scale1 = useTransform(scrollY, [0, 500], [1, 0.8]);
  
  const handleSignIn = () => {
    setIsMobileMenuOpen(false);
    setLocation("/login");
  };
  const handleGetStarted = () => {
    setIsMobileMenuOpen(false);
    setLocation("/signup");
  };

  // Parallax image layer component
  const ParallaxLayer = ({ src, speed = 0, className = "", position = "center center", scale = 1.1 }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
      target: ref,
      offset: ["start end", "end start"]
    });
    
    const y = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 100}%`]);
    
    return (
      <motion.div 
        ref={ref}
        style={{ y }} 
        className={`absolute inset-0 w-full h-full ${className}`}
      >
        <div className="w-full h-full bg-cover"
             style={{ 
               backgroundImage: src ? `url(${src})` : null,
               backgroundColor: !src ? 'rgba(79, 70, 229, 0.1)' : null,
               backgroundPosition: position,
               backgroundRepeat: 'no-repeat',
               transform: `scale(${scale})`, // Scale up slightly to prevent edges showing
             }}>
        </div>
      </motion.div>
    );
  };

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <div className="font-body overflow-hidden">
      {/* Fixed navbar with glass effect */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div 
                className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center"
                whileHover={{ rotate: 10, scale: 1.1 }}
              >
                <Briefcase className="w-5 h-5 text-white" />
              </motion.div>
              <span className="text-2xl font-display font-bold text-slate-800 tracking-wider">JobTrackAI</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-4">
              <Button 
                variant="ghost"
                onClick={handleSignIn}
                className="font-display tracking-wide text-sm"
              >
                Sign In
              </Button>
              <Button 
                onClick={handleGetStarted}
                className="bg-primary hover:bg-indigo-600 font-display tracking-wide text-sm"
              >
                Start Now
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2"
              >
                <motion.div
                  animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </motion.div>
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="md:hidden overflow-hidden"
              >
                <div className="pt-4 pb-2 space-y-3">
                  <Button 
                    variant="ghost"
                    onClick={handleSignIn}
                    className="w-full justify-start font-display tracking-wide text-sm"
                  >
                    Sign In
                  </Button>
                  <Button 
                    onClick={handleGetStarted}
                    className="w-full bg-primary hover:bg-indigo-600 font-display tracking-wide text-sm"
                  >
                    Start Now
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Hero Section with Parallax */}
      <section className="relative h-screen flex items-center overflow-hidden">
        {/* 3D Background */}
        <HeroBackground />
        
        {/* Gradient overlay for better text visibility */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-indigo-900/30 to-black/50"></div>
        
        {/* Animated shapes - increase z-index */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 blur-3xl opacity-20 z-10"
          animate={{ 
            x: [0, 30, 0], 
            y: [0, -30, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
        
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 blur-3xl opacity-20"
          animate={{ 
            x: [0, -40, 0], 
            y: [0, 20, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
        
        {/* Content - highest z-index */}
        <div className="container relative z-20 mx-auto px-4 mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 tracking-tight leading-tight">
              <span className="relative">
                <span className="relative z-10">Track Applications.</span>
                <motion.span 
                  className="absolute -bottom-2 left-0 right-0 h-3 bg-primary/70 -z-10"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1, delay: 0.5 }}
                ></motion.span>
              </span>
              <br />
              <span className="text-primary">Land Your Dream Job.</span>
            </h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-white/80 mb-10 max-w-3xl mx-auto font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              Organize your job search with AI-powered insights, smart tracking, 
              and breakthrough analytics.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <Button 
                onClick={handleGetStarted}
                size="lg"
                className="bg-white text-primary hover:bg-gray-100 text-lg px-10 py-6 rounded-full font-display tracking-wider shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
              >
                <motion.div 
                  className="flex items-center"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  start tracking
                  <ArrowRight className="w-5 h-5 ml-2" />
                </motion.div>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>


      {/* 3D Features Section with Parallax */}
      <section className="relative py-32 overflow-hidden bg-gradient-to-br from-slate-100 to-white">
        <ParallaxLayer speed={0.3} className="opacity-10" src="/images/grid-pattern.png" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.h2 
            className="text-4xl md:text-5xl font-display font-bold text-center mb-20 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-800 to-purple-700">
              FEATURES THAT MAKE A DIFFERENCE
            </span>
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 perspective-1000">
            {[
              {
                icon: Briefcase,
                title: "INTELLIGENT TRACKING",
                description: "Monitor all your applications in one centralized dashboard with smart status updates.",
                image: "/images/intelligent.jpg",
                delay: 0
              },
              {
                icon: Brain,
                title: "AI APPLICATION REVIEW",
                description: "Get instant AI feedback comparing your resume to job descriptions for perfect targeting.",
                image: "/images/appreview.jpg",
                delay: 0.2
              },
              {
                icon: TrendingUp,
                title: "REAL-TIME ANALYTICS",
                description: "Visualize your application success rates, identify trends, and optimize your approach.",
                image: "/images/herosec.jpg",
                delay: 0.4
              }
            ].map((feature, i) => (
              <FeatureCard key={i} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Immersive Demo Section with Parallax */}
      <section className="relative py-32 overflow-hidden">
        <ParallaxLayer speed={-0.4} className="opacity-80" src="/images/bc.jpg" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
        
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-8 tracking-tight">
                  VISUALIZE YOUR <br />
                  <span className="text-primary">JOB SEARCH JOURNEY</span>
                </h2>
                <p className="text-xl text-white/80 mb-8">
                  Our intuitive dashboard helps you manage applications, track progress, and get insights 
                  in real time — all in one place.
                </p>
                <ul className="space-y-4 mb-10">
                  {["Real-time status updates", "Custom categorization", "Timeline visualization", "Interview preparation"].map((item, i) => (
                    <motion.li 
                      key={i}
                      className="flex items-center text-white/70"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      viewport={{ once: true }}
                    >
                      <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                      {item}
                    </motion.li>
                  ))}
                </ul>
                <Button
                  onClick={handleGetStarted}
                  size="lg" 
                  className="bg-primary hover:bg-indigo-600 text-white rounded-full px-8 font-display tracking-wider"
                >
                  EXPLORE DASHBOARD
                </Button>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Dashboard image */}
                <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl shadow-2xl overflow-hidden transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                  <img 
                    src="/images/jobtrackdash.jpg" 
                    alt="JobTrackAI Dashboard Preview" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/30 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-5 -left-5 w-32 h-32 bg-indigo-600/20 rounded-full blur-2xl"></div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section with Parallax */}
      <section className="relative py-32 overflow-hidden bg-gradient-to-br from-slate-100 to-white">
        <ParallaxLayer speed={0.2} className="opacity-5" src="/images/pattern-bg.jpg" />
        
        <div className="container relative z-10 mx-auto px-4">
          <motion.h2 
            className="text-4xl md:text-5xl font-display font-bold text-center mb-20 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-800 to-purple-700">
              SUCCESS STORIES
            </span>
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "JobTrackAI helped me land a senior developer position after just 14 applications. The AI feedback feature was a game-changer.",
                author: "Alex T.",
                role: "Software Engineer",
                image: "/images/alex.jpg",
                delay: 0
              },
              {
                quote: "I was applying to dozens of jobs with no callbacks until I started using JobTrackAI. The insights helped me improve my resume dramatically.",
                author: "Sophia K.",
                role: "Marketing Manager",
                image: "/images/sophia.jpg",
                delay: 0.2
              },
              {
                quote: "As someone switching careers, JobTrackAI was invaluable. It helped me track my progress and stay motivated throughout my job search.",
                author: "Marcus J.",
                role: "Data Analyst",
                image: "/images/marcus.jpg",
                delay: 0.4
              }
            ].map((testimonial, i) => (
              <TestimonialCard key={i} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-32 overflow-hidden bg-gradient-to-r from-indigo-900 to-purple-900">
        <ParallaxLayer speed={-0.3} className="opacity-10" src="/images/abstract-shapes.jpg" />
        
        {/* Animated shapes */}
        <motion.div 
          className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-white/5 blur-3xl"
          animate={{ 
            x: [0, 50, 0], 
            y: [0, -30, 0],
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
        
        <motion.div 
          className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl"
          animate={{ 
            x: [0, -30, 0], 
            y: [0, 50, 0],
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
        
        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-8 tracking-tight">
              START YOUR JOURNEY <br />
              <span className="text-primary">TO A BETTER CAREER</span>
            </h2>
            
            <p className="text-xl text-white/80 mb-12">
              Join others who've optimized their job search process and found their dream roles faster.
              It's free to get started.
            </p>
            
            <Button 
              onClick={handleGetStarted}
              size="lg"
              className="bg-white text-primary hover:bg-gray-100 text-lg px-12 py-7 rounded-full font-display tracking-wider shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
            >
              <motion.div 
                className="flex items-center"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                CREATE YOUR ACCOUNT
                <ArrowRight className="w-6 h-6 ml-3" />
              </motion.div>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-10 md:mb-0">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-display font-bold tracking-wider">JobTrackAI</span>
              </div>
              <p className="text-slate-400 max-w-sm">
                Revolutionizing job search tracking with intelligent AI insights and powerful analytics.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
              <div>
                <h4 className="text-sm font-display tracking-wider text-slate-300 mb-4">PRODUCT</h4>
                <ul className="space-y-2 text-slate-400">
                  {["Features", "Pricing", "Integrations", "FAQ"].map((item, i) => (
                    <li key={i}><a href="#" className="hover:text-primary transition-colors">{item}</a></li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-display tracking-wider text-slate-300 mb-4">COMPANY</h4>
                <ul className="space-y-2 text-slate-400">
                  {["About Us", "Careers", "Blog", "Legal"].map((item, i) => (
                    <li key={i}><a href="#" className="hover:text-primary transition-colors">{item}</a></li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-display tracking-wider text-slate-300 mb-4">CONNECT</h4>
                <ul className="space-y-2 text-slate-400">
                  {["Twitter", "LinkedIn", "Instagram", "Email Us"].map((item, i) => (
                    <li key={i}><a href="#" className="hover:text-primary transition-colors">{item}</a></li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-500 text-sm">
            © {new Date().getFullYear()} JobTrackAI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

// Feature Card Component
function FeatureCard({ icon: Icon, title, description, image, delay = 0 }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <motion.div 
      ref={ref} 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      viewport={{ once: true }}
      className="group"
    >
      <motion.div 
        whileHover={{ 
          y: -10,
          transition: { duration: 0.2 }
        }}
        className="relative overflow-hidden rounded-2xl shadow-xl h-full bg-white"
      >
        {/* Feature image/placeholder */}
        <div className="h-52 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-purple-900/40 z-10"></div>
          <div 
            className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 group-hover:scale-110 transition-transform duration-700"
            style={{
              backgroundImage: image ? `url(${image})` : null,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          ></div>
          
          <div className="absolute top-6 right-6 z-20">
            <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
              <Icon className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
        
        <div className="p-8">
          <h3 className="font-display font-bold text-xl mb-4 tracking-wide">{title}</h3>
          <p className="text-slate-600">{description}</p>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
      </motion.div>
    </motion.div>
  );
}

// Testimonial Card Component
function TestimonialCard({ quote, author, role, image, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      viewport={{ once: true }}
      className="group"
    >
      <motion.div 
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow relative"
      >
        <div className="mb-6 text-5xl text-primary/20">"</div>
        <p className="text-slate-700 mb-6">{quote}</p>
        
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-slate-200">
            {/* Image placeholder */}
            {image ? (
              <img src={image} alt={author} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                {author[0]}
              </div>
            )}
          </div>
          <div>
            <div className="font-bold text-slate-800">{author}</div>
            <div className="text-sm text-slate-500">{role}</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
