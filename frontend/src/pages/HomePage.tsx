import React from 'react';
import { Link } from 'react-router-dom';
import { Users, MapPin, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const HomePage: React.FC = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const scaleOnHover = {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative px-6 lg:px-8 overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5"
          animate={{
            background: [
              "linear-gradient(to right, rgba(59, 130, 246, 0.05), rgba(99, 102, 241, 0.05))",
              "linear-gradient(to right, rgba(99, 102, 241, 0.05), rgba(59, 130, 246, 0.05))",
              "linear-gradient(to right, rgba(59, 130, 246, 0.05), rgba(99, 102, 241, 0.05))"
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <div className="mx-auto max-w-7xl pt-20 pb-24 sm:pt-32 sm:pb-40 relative">
          <motion.div 
            className="text-center"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.div
              variants={fadeInUp}
              className="mb-8"
            >
              <motion.div
                className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium mb-6"
                {...scaleOnHover}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Trusted by 10,000+ citizens nationwide
              </motion.div>
            </motion.div>

            <motion.h1 
              variants={fadeInUp}
              className="text-5xl font-bold tracking-tight text-gray-900 sm:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800"
            >
              Welcome to{' '}
              <motion.span 
                className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                style={{ backgroundSize: "200% 200%" }}
              >
                SunoAid
              </motion.span>
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="mt-8 text-xl leading-8 text-gray-600 max-w-3xl mx-auto font-medium"
            >
              Your voice matters. Report civic issues, connect with your community, and help build a better tomorrow.
              Join thousands of citizens making their neighborhoods safer and more liveable.
            </motion.p>
            
            <motion.div 
              variants={fadeInUp}
              className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <motion.div {...scaleOnHover}>
                <Link
                  to="/register"
                  className="group relative inline-flex items-center px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <span className="relative z-10">Get Started</span>
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </motion.div>
              
              <motion.div {...scaleOnHover}>
                <Link
                  to="/dashboard"
                  className="group inline-flex items-center px-8 py-4 text-base font-semibold text-gray-700 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 hover:border-blue-300 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  View Issues 
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/70 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div 
            className="mx-auto max-w-2xl text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
              How SunoAid Works
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 font-medium">
              A simple yet powerful platform to connect citizens with their local government
            </p>
          </motion.div>
          
          <motion.div 
            className="mx-auto mt-20 max-w-2xl sm:mt-24 lg:mt-28 lg:max-w-none"
            initial="initial"
            whileInView="animate"
            variants={staggerContainer}
            viewport={{ once: true }}
          >
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <motion.div 
                variants={fadeInUp}
                className="group flex flex-col relative"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  whileHover={{ scale: 1.02 }}
                />
                <div className="relative p-8">
                  <dt className="flex items-center gap-x-3 text-base font-bold leading-7 text-gray-900">
                    <motion.div
                      className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <MapPin className="h-6 w-6" />
                    </motion.div>
                    Report Issues
                  </dt>
                  <dd className="mt-6 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto font-medium">
                      Take photos, add descriptions, and pinpoint exact locations of civic issues in your area.
                    </p>
                  </dd>
                </div>
              </motion.div>
              
              <motion.div 
                variants={fadeInUp}
                className="group flex flex-col relative"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  whileHover={{ scale: 1.02 }}
                />
                <div className="relative p-8">
                  <dt className="flex items-center gap-x-3 text-base font-bold leading-7 text-gray-900">
                    <motion.div
                      className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 text-white"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Users className="h-6 w-6" />
                    </motion.div>
                    Community Engagement
                  </dt>
                  <dd className="mt-6 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto font-medium">
                      Vote, comment, and collaborate with fellow citizens to prioritize important issues.
                    </p>
                  </dd>
                </div>
              </motion.div>
              
              <motion.div 
                variants={fadeInUp}
                className="group flex flex-col relative"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-purple-50 to-violet-50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  whileHover={{ scale: 1.02 }}
                />
                <div className="relative p-8">
                  <dt className="flex items-center gap-x-3 text-base font-bold leading-7 text-gray-900">
                    <motion.div
                      className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-500 text-white"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <TrendingUp className="h-6 w-6" />
                    </motion.div>
                    Track Progress
                  </dt>
                  <dd className="mt-6 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto font-medium">
                      Monitor the status of reported issues and receive updates when they're addressed.
                    </p>
                  </dd>
                </div>
              </motion.div>
            </dl>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-slate-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
                Making Real Impact
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-600 font-medium">
                Join our growing community of engaged citizens
              </p>
            </motion.div>
            
            <motion.dl 
              className="mt-20 grid grid-cols-1 gap-6 overflow-hidden sm:grid-cols-2 lg:grid-cols-4"
              initial="initial"
              whileInView="animate"
              variants={staggerContainer}
              viewport={{ once: true }}
            >
              {[
                { label: "Issues Reported", value: "12,345", color: "from-blue-500 to-indigo-500" },
                { label: "Issues Resolved", value: "8,762", color: "from-green-500 to-emerald-500" },
                { label: "Active Citizens", value: "5,432", color: "from-purple-500 to-violet-500" },
                { label: "Cities Covered", value: "127", color: "from-orange-500 to-red-500" }
              ].map((stat, index) => (
                <motion.div 
                  key={stat.label}
                  variants={fadeInUp}
                  className="group relative"
                >
                  <motion.div
                    className="flex flex-col bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300"
                    whileHover={{ y: -8, scale: 1.02 }}
                  >
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${stat.color} rounded-t-3xl`} />
                    <dt className="text-sm font-semibold leading-6 text-gray-600 uppercase tracking-wider">
                      {stat.label}
                    </dt>
                    <motion.dd 
                      className="order-first text-4xl font-bold tracking-tight text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                      viewport={{ once: true }}
                    >
                      {stat.value}
                    </motion.dd>
                  </motion.div>
                </motion.div>
              ))}
            </motion.dl>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        
        <div className="relative px-6 py-20 sm:px-6 sm:py-28 lg:px-8">
          <motion.div 
            className="mx-auto max-w-2xl text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-4xl font-bold tracking-tight text-white sm:text-5xl"
              animate={{
                textShadow: [
                  "0 0 20px rgba(255,255,255,0.5)",
                  "0 0 30px rgba(255,255,255,0.8)",
                  "0 0 20px rgba(255,255,255,0.5)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              Ready to Make a Difference?
            </motion.h2>
            <motion.p 
              className="mx-auto mt-8 max-w-xl text-lg leading-8 text-blue-100 font-medium"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              Join thousands of citizens who are actively improving their communities. Your voice can drive real change.
            </motion.p>
            
            <motion.div 
              className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.div {...scaleOnHover}>
                <Link
                  to="/register"
                  className="group relative inline-flex items-center px-8 py-4 text-base font-semibold text-blue-600 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <span className="relative z-10">Join SunoAid Today</span>
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                  <div className="absolute inset-0 bg-blue-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </motion.div>
              
              <motion.div {...scaleOnHover}>
                <Link
                  to="/dashboard"
                  className="group inline-flex items-center px-8 py-4 text-base font-semibold text-white bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 hover:border-white/50 hover:bg-white/30 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  Explore Issues 
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
