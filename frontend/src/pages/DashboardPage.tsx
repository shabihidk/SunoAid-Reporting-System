import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, MapPin, ThumbsUp, ThumbsDown, MessageCircle, Clock } from 'lucide-react';
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
    color_code: string;
    icon_name: string;
  };
}

interface Category {
  id: number;
  name: string;
  description: string;
  color_code: string;
  icon_name: string;
}

const DashboardPage: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    fetchCategories();
    fetchIssues();
  }, [searchQuery, selectedCategory, selectedStatus, sortBy]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/issues/categories');
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchIssues = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory) params.append('category_id', selectedCategory);
      if (selectedStatus) params.append('status', selectedStatus);
      
      // Handle sorting
      switch (sortBy) {
        case 'popular':
          params.append('sort', 'popular');
          break;
        case 'urgent':
          params.append('sort', 'urgent');
          break;
        default:
          params.append('sort', 'recent');
      }

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
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'in_progress': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'resolved': return 'text-green-600 bg-green-50 border-green-200';
      case 'closed': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading issues...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Community Issues</h1>
            <p className="text-gray-600 mt-1">Browse and track civic issues in your area</p>
          </div>
          <Link
            to="/report"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Report Issue
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search issues..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Category Filter */}
            <select
              className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id.toString()}>{cat.name}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>

            {/* Sort */}
            <select
              className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="urgent">Most Urgent</option>
            </select>

          </div>
        </div>

        {/* Issues List */}
        <div className="space-y-6">
          {issues.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No issues found</h3>
              <p className="text-gray-600 mb-6">Be the first to report an issue in your community.</p>
              <Link
                to="/report"
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors duration-200 inline-flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Report Issue
              </Link>
            </div>
          ) : (
            issues.map((issue) => (
              <div key={issue.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
                
                {/* Issue Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {issue.user.avatar_url ? (
                        <img className="h-10 w-10 rounded-full" src={issue.user.avatar_url} alt="" />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {issue.user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-3">
                        <p className="font-medium text-gray-900">{issue.user.name}</p>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(issue.severity)}`}>
                          {issue.severity}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(issue.status)}`}>
                          {issue.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatTimeAgo(issue.created_at)}
                        <span className="mx-2">•</span>
                        <MapPin className="w-4 h-4 mr-1" />
                        {issue.location.city}, {issue.location.province}
                      </div>
                    </div>
                  </div>
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: issue.category.color_code + '20', color: issue.category.color_code }}
                  >
                    {issue.category.name}
                  </span>
                </div>

                {/* Issue Content */}
                <div className="mb-4">
                  <Link to={`/issue/${issue.id}`}>
                    <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200 mb-2">
                      {issue.title}
                    </h3>
                  </Link>
                  <p className="text-gray-700 line-clamp-3">{issue.description}</p>
                  {issue.address && (
                    <p className="text-sm text-gray-500 mt-2 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {issue.address}
                    </p>
                  )}
                </div>

                {/* Media */}
                {issue.media_urls && issue.media_urls.length > 0 && (
                  <div className="mb-4">
                    <div className="grid grid-cols-3 gap-3">
                      {issue.media_urls.slice(0, 3).map((url, index) => {
                        const imageUrl = url.startsWith('http') ? url : `http://localhost:5000${url}`;
                        return (
                          <img
                            key={index}
                            src={imageUrl}
                            alt={`Issue media ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-6">
                    <button
                      onClick={() => handleVote(issue.id, 'up')}
                      className="flex items-center space-x-2 text-gray-500 hover:text-green-600 transition-colors duration-200"
                    >
                      <ThumbsUp className="w-5 h-5" />
                      <span className="text-sm font-medium">{issue.upvotes}</span>
                    </button>
                    <button
                      onClick={() => handleVote(issue.id, 'down')}
                      className="flex items-center space-x-2 text-gray-500 hover:text-red-600 transition-colors duration-200"
                    >
                      <ThumbsDown className="w-5 h-5" />
                      <span className="text-sm font-medium">{issue.downvotes}</span>
                    </button>
                    <Link
                      to={`/issue/${issue.id}`}
                      className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors duration-200"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">{issue.comments_count} comments</span>
                    </Link>
                  </div>
                  <span className="text-sm text-gray-500">{issue.views} views</span>
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
