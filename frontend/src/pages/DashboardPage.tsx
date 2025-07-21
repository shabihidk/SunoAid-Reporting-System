import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, MapPin, ThumbsUp, ThumbsDown, MessageCircle, Clock, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

interface Issue {
  id: number;
  title: string;
  description: string;
  created_at: string;
  severity: string;
  status: string;
  media_urls: string[];
  address: string;
  upvotes: number;
  downvotes: number;
  comments_count: number;
  views: number;
  user: {
    id: number;
    name: string;
    avatar_url?: string;
  };
  location: {
    id: number;
    name: string;
    city: string;
    province: string;
  };
  category: {
    id: number;
    name: string;
    color: string;
    icon: string;
  };
}

const DashboardPage: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [searchQuery, selectedCategory, selectedStatus, sortBy]);

  const fetchIssues = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedStatus) params.append('status', selectedStatus);
      if (sortBy) params.append('sort', sortBy);

      const response = await axios.get(`/issues?${params.toString()}`);
      setIssues(response.data.issues);
    } catch (error) {
      console.error('Failed to fetch issues:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (issueId: number, voteType: 'up' | 'down') => {
    try {
      await axios.post(`/issues/${issueId}/vote`, { vote_type: voteType });
      // Refresh the issues list to show updated vote counts
      fetchIssues();
    } catch (error) {
      console.error('Failed to vote:', error);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-blue-600 bg-blue-50';
      case 'in_progress': return 'text-yellow-600 bg-yellow-50';
      case 'resolved': return 'text-green-600 bg-green-50';
      case 'closed': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.p 
            className="text-lg font-medium text-gray-700"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Loading community issues...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <motion.h1 
              className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-blue-800"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Community Issues
            </motion.h1>
            <motion.p 
              className="mt-2 text-gray-600 font-medium"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Stay updated with civic issues in your area
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/report"
              className="mt-4 sm:mt-0 group relative inline-flex items-center px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              <span className="relative z-10">Report Issue</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Filters */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <motion.div 
              className="relative group"
              whileFocus={{ scale: 1.02 }}
            >
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
              <input
                type="text"
                placeholder="Search issues..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 focus:bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </motion.div>
            
            {[
              {
                value: selectedCategory,
                onChange: setSelectedCategory,
                placeholder: "All Categories",
                options: [
                  { value: "", label: "All Categories" },
                  { value: "infrastructure", label: "Infrastructure" },
                  { value: "sanitation", label: "Sanitation" },
                  { value: "water", label: "Water Supply" },
                  { value: "electricity", label: "Electricity" },
                  { value: "transportation", label: "Transportation" }
                ]
              },
              {
                value: selectedStatus,
                onChange: setSelectedStatus,
                placeholder: "All Status",
                options: [
                  { value: "", label: "All Status" },
                  { value: "open", label: "Open" },
                  { value: "in_progress", label: "In Progress" },
                  { value: "resolved", label: "Resolved" },
                  { value: "closed", label: "Closed" }
                ]
              },
              {
                value: sortBy,
                onChange: setSortBy,
                placeholder: "Sort By",
                options: [
                  { value: "recent", label: "Most Recent" },
                  { value: "popular", label: "Most Popular" },
                  { value: "urgent", label: "Most Urgent" }
                ]
              }
            ].map((select, index) => (
              <motion.select
                key={index}
                className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 focus:bg-white appearance-none cursor-pointer shadow-sm"
                value={select.value}
                onChange={(e) => select.onChange(e.target.value)}
                whileFocus={{ scale: 1.02 }}
              >
                {select.options.map((option) => (
                  <option key={option.value} value={option.value} className="text-gray-900 bg-white">
                    {option.label}
                  </option>
                ))}
              </motion.select>
            ))}
          </div>
        </motion.div>

        {/* Issues Feed */}
        <motion.div 
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {issues.length === 0 ? (
            <motion.div 
              className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20"
              variants={itemVariants}
            >
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  repeatDelay: 3 
                }}
              >
                <AlertTriangle className="mx-auto h-16 w-16 text-blue-400" />
              </motion.div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">No issues found</h3>
              <p className="mt-2 text-gray-600 max-w-md mx-auto">
                Be the first to report an issue in your community and help make it better.
              </p>
              <motion.div 
                className="mt-8"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/report"
                  className="inline-flex items-center px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Report Issue
                </Link>
              </motion.div>
            </motion.div>
          ) : (
            issues.map((issue) => (
              <motion.div 
                key={issue.id} 
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden group"
                variants={itemVariants}
                whileHover={{ 
                  y: -8, 
                  scale: 1.02,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                }}
                transition={{ duration: 0.3 }}
                layout
              >
                {/* Issue Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {issue.user.avatar_url ? (
                          <motion.img 
                            className="h-12 w-12 rounded-full border-2 border-white shadow-md" 
                            src={issue.user.avatar_url} 
                            alt=""
                            whileHover={{ scale: 1.1 }}
                          />
                        ) : (
                          <motion.div 
                            className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md"
                            whileHover={{ scale: 1.1, rotate: 360 }}
                            transition={{ duration: 0.6 }}
                          >
                            <span className="text-white font-bold text-lg">
                              {issue.user.name.charAt(0).toUpperCase()}
                            </span>
                          </motion.div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 flex-wrap">
                          <p className="text-sm font-semibold text-gray-900">{issue.user.name}</p>
                          <motion.span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getSeverityColor(issue.severity)}`}
                            whileHover={{ scale: 1.05 }}
                          >
                            {issue.severity}
                          </motion.span>
                          <motion.span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(issue.status)}`}
                            whileHover={{ scale: 1.05 }}
                          >
                            {issue.status.replace('_', ' ')}
                          </motion.span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mt-2">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatTimeAgo(issue.created_at)}
                          <MapPin className="w-4 h-4 ml-4 mr-1" />
                          {issue.location.city}, {issue.location.province}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <motion.span
                        className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-sm"
                        style={{ backgroundColor: issue.category.color + '20', color: issue.category.color }}
                        whileHover={{ scale: 1.05 }}
                      >
                        {issue.category.name}
                      </motion.span>
                    </div>
                  </div>

                  {/* Issue Content */}
                  <div className="mt-6">
                    <Link to={`/issue/${issue.id}`}>
                      <motion.h3 
                        className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200 mb-3"
                        whileHover={{ x: 4 }}
                      >
                        {issue.title}
                      </motion.h3>
                    </Link>
                    <p className="text-gray-700 line-clamp-3 leading-relaxed">{issue.description}</p>
                    {issue.address && (
                      <motion.p 
                        className="mt-3 text-sm text-gray-500 flex items-center bg-gray-50 rounded-lg px-3 py-2"
                        whileHover={{ backgroundColor: "#f8fafc" }}
                      >
                        <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                        {issue.address}
                      </motion.p>
                    )}
                  </div>

                  {/* Media */}
                  {issue.media_urls && issue.media_urls.length > 0 && (
                    <motion.div 
                      className="mt-6"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {issue.media_urls.slice(0, 3).map((url, index) => {
                          // Handle both relative and absolute URLs
                          const imageUrl = url.startsWith('http') ? url : `http://localhost:5000${url}`;
                          return (
                            <motion.img
                              key={index}
                              src={imageUrl}
                              alt={`Issue media ${index + 1}`}
                              className="w-full h-32 object-cover rounded-xl shadow-sm"
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.2 }}
                              onError={(e) => {
                                console.error('Failed to load image:', imageUrl);
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          );
                        })}
                        {issue.media_urls.length > 3 && (
                          <motion.div 
                            className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center shadow-sm"
                            whileHover={{ scale: 1.05 }}
                          >
                            <span className="text-gray-600 text-sm font-semibold">
                              +{issue.media_urls.length - 3} more
                            </span>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Actions */}
                  <div className="mt-8 flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-6">
                      <motion.button
                        onClick={() => handleVote(issue.id, 'up')}
                        className="flex items-center space-x-2 text-gray-500 hover:text-green-600 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-green-50"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ThumbsUp className="w-5 h-5" />
                        <span className="text-sm font-semibold">{issue.upvotes}</span>
                      </motion.button>
                      <motion.button
                        onClick={() => handleVote(issue.id, 'down')}
                        className="flex items-center space-x-2 text-gray-500 hover:text-red-600 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-red-50"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ThumbsDown className="w-5 h-5" />
                        <span className="text-sm font-semibold">{issue.downvotes}</span>
                      </motion.button>
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <Link
                          to={`/issue/${issue.id}`}
                          className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-blue-50"
                        >
                          <MessageCircle className="w-5 h-5" />
                          <span className="text-sm font-semibold">{issue.comments_count} comments</span>
                        </Link>
                      </motion.div>
                    </div>
                    <span className="text-sm text-gray-500 font-medium">{issue.views} views</span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
