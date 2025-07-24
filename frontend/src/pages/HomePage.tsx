import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Camera, MessageSquare, TrendingUp, CheckCircle, Users } from 'lucide-react';
import handsImage from '../assets/images/hands.jpg';
import exampleImage from '../assets/images/example.jpeg';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
          style={{
            backgroundImage: `url(${handsImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/90 via-amber-50/80 to-yellow-50/90" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Content */}
            <div className="lg:pr-8">
              <h1 className="text-7xl font-semibold text-gray-900 leading-[0.9] mb-8">
                Make your
                <br />
                <span className="text-orange-600">community</span>
                <br />
                better.
              </h1>
              
              <p className="text-2xl text-gray-700 mb-12 leading-relaxed max-w-lg">
                Report civic issues, collaborate with neighbors, and track real progress in your area.
              </p>
              
              <div className="flex gap-6">
                <Link
                  to="/register"
                  className="bg-orange-600 text-white px-10 py-5 rounded-2xl font-semibold text-lg hover:bg-orange-700 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl"
                >
                  Get Started
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Link>
                <Link
                  to="/dashboard"
                  className="border-2 border-orange-200 text-orange-800 px-10 py-5 rounded-2xl font-semibold text-lg hover:border-orange-300 hover:bg-orange-50 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                >
                  Browse Issues
                </Link>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative lg:pl-8">
              <div className="bg-gradient-to-br from-orange-100/80 to-amber-100/80 rounded-3xl p-12 relative overflow-hidden backdrop-blur-sm border border-orange-200/50">
                
                {/* Floating Elements */}
                <div className="relative z-10">
                  
                  {/* Mock Issue Card */}
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-6 transform rotate-1 border border-orange-100">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-semibold">JS</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Muhammad Shabih</p>
                        <p className="text-sm text-gray-600">2 hours ago</p>
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Broken streetlight on Main St</h3>
                    <div className="bg-orange-50 h-24 rounded-lg mb-3 border border-orange-100 overflow-hidden">
                      <img 
                        src={exampleImage} 
                        alt="Broken streetlight issue" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center text-emerald-600">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          <span className="text-sm font-medium">24</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          <span className="text-sm">8</span>
                        </div>
                      </div>
                      <span className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-medium border border-amber-200">
                        In Progress
                      </span>
                    </div>
                  </div>

                </div>

                {/* Background Decorations */}
                <div className="absolute top-8 right-8 w-16 h-16 bg-orange-200/60 rounded-full"></div>
                <div className="absolute bottom-12 left-8 w-12 h-12 bg-amber-200/70 rounded-full"></div>
                <div className="absolute top-1/2 right-16 w-8 h-8 bg-yellow-200/60 rounded-full"></div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-gradient-to-b from-orange-50/50 to-white">
        <div className="max-w-7xl mx-auto px-8">
          
          {/* Section Header */}
          <div className="text-center mb-20">
            <h2 className="text-5xl font-semibold text-gray-900 mb-6">
              Everything you need to
              <br />
              make change happen.
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A complete platform designed to connect citizens, track issues, and drive real improvements in your community.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid lg:grid-cols-3 gap-12">
            
            {/* Feature 1 */}
            <div className="group">
              <div className="bg-white rounded-3xl p-8 h-full shadow-sm hover:shadow-lg transition-all duration-300 border border-orange-100 hover:border-orange-200">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                  <Camera className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Report with Ease</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Snap a photo, describe the issue, and pinpoint the exact location. Our smart forms make reporting quick and comprehensive.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group">
              <div className="bg-white rounded-3xl p-8 h-full shadow-sm hover:shadow-lg transition-all duration-300 border border-emerald-100 hover:border-emerald-200">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Community Power</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Vote on issues, add comments, and collaborate with neighbors. Together, your voices create real change and accountability.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group">
              <div className="bg-white rounded-3xl p-8 h-full shadow-sm hover:shadow-lg transition-all duration-300 border border-amber-100 hover:border-amber-200">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Track Progress</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Follow your reports from submission to resolution. Real-time updates keep you informed every step of the way.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Community CTA Section with Background Image */}
      <section className="relative py-32 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${handsImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gray-900/75" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-6xl font-semibold text-white mb-8 leading-tight">
            Ready to transform
            <br />
            <span className="text-orange-300">your community?</span>
          </h2>
          <p className="text-2xl text-orange-100 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of engaged citizens who are already making their neighborhoods better, one report at a time.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/register"
              className="bg-orange-600 text-white px-12 py-6 rounded-2xl font-semibold text-xl hover:bg-orange-700 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
            >
              Start Making Change
              <ArrowRight className="ml-3 w-6 h-6" />
            </Link>
            
            <Link
              to="/dashboard"
              className="border-2 border-orange-300 text-white px-12 py-6 rounded-2xl font-semibold text-xl hover:border-orange-200 hover:bg-orange-600/20 transition-all duration-300 flex items-center justify-center backdrop-blur-sm"
            >
              See It In Action
            </Link>
          </div>
          
          <p className="text-orange-200 mt-8 text-lg">
            Free to use • No credit card required
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
