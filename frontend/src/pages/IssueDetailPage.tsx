import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, ThumbsUp, ThumbsDown, MessageCircle, Clock, ArrowLeft, Flag, Eye, Calendar, User } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface Issue {
  id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  severity: string;
  status: string;
  media_urls: string[];
  address: string;
  latitude: number;
  longitude: number;
  upvotes: number;
  downvotes: number;
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
  comments_count: number;
  resolved_at?: string;
}

interface Comment {
  id: number;
  content: string;
  created_at: string;
  user: {
    id: number;
    name: string;
    avatar_url?: string;
  };
  replies_count: number;
}

const IssueDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchIssue();
      fetchComments();
    }
  }, [id]);

  const fetchIssue = async () => {
    try {
      const response = await axios.get(`issues/${id}`);
      setIssue(response.data.issue);
    } catch (error) {
      setError('Failed to load issue details');
      console.error('Failed to fetch issue:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`issues/${id}/comments`);
      setComments(response.data.comments);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const handleVote = async (voteType: 'up' | 'down') => {
    if (!user) return;
    
    try {
      await axios.post(`issues/${id}/vote`, { vote_type: voteType });
      fetchIssue();
    } catch (error) {
      console.error('Failed to vote:', error);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setCommentLoading(true);
    try {
      await axios.post(`issues/${id}/comments`, { content: newComment });
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Failed to post comment:', error);
    } finally {
      setCommentLoading(false);
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

  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case 'low': return { color: 'text-emerald-700 bg-emerald-50 border-emerald-200', label: 'Low Priority' };
      case 'medium': return { color: 'text-amber-700 bg-amber-50 border-amber-200', label: 'Medium Priority' };
      case 'high': return { color: 'text-orange-700 bg-orange-50 border-orange-200', label: 'High Priority' };
      case 'critical': return { color: 'text-red-700 bg-red-50 border-red-200', label: 'Critical' };
      default: return { color: 'text-gray-700 bg-gray-50 border-gray-200', label: severity };
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'open': return { color: 'text-blue-700 bg-blue-50 border-blue-200', label: 'Open' };
      case 'in_progress': return { color: 'text-amber-700 bg-amber-50 border-amber-200', label: 'In Progress' };
      case 'resolved': return { color: 'text-emerald-700 bg-emerald-50 border-emerald-200', label: 'Resolved' };
      case 'closed': return { color: 'text-gray-700 bg-gray-50 border-gray-200', label: 'Closed' };
      default: return { color: 'text-gray-700 bg-gray-50 border-gray-200', label: status.replace('_', ' ') };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50/50 via-white to-amber-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading issue details...</p>
        </div>
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50/50 via-white to-amber-50/30 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Flag className="w-12 h-12 text-orange-600" />
          </div>
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">Issue Not Found</h2>
          <p className="text-gray-600 mb-8 text-lg">{error || 'The issue you\'re looking for doesn\'t exist or may have been removed.'}</p>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-8 py-4 bg-orange-600 text-white font-semibold rounded-2xl hover:bg-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <ArrowLeft className="w-5 h-5 mr-3" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const severityConfig = getSeverityConfig(issue.severity);
  const statusConfig = getStatusConfig(issue.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/50 via-white to-amber-50/30">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-orange-100/50 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-8 py-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-gray-600 hover:text-orange-600 font-medium transition-colors duration-200 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Issues
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12">
        {/* Main Issue Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-lg border border-orange-100/50 overflow-hidden mb-8">
          {/* Issue Header */}
          <div className="p-12">
            {/* Author & Meta Info */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  {issue.user.avatar_url ? (
                    <img className="h-16 w-16 rounded-full border-4 border-orange-100" src={issue.user.avatar_url} alt="" />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center border-4 border-orange-100">
                      <span className="text-white font-semibold text-xl">
                        {issue.user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                    <User className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{issue.user.name}</h3>
                  <div className="flex items-center space-x-4 text-gray-600 mt-1">
                    <span className="flex items-center text-sm">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatTimeAgo(issue.created_at)}
                    </span>
                    <span className="flex items-center text-sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      {issue.location.city}, {issue.location.province}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${severityConfig.color}`}>
                  {severityConfig.label}
                </span>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${statusConfig.color}`}>
                  {statusConfig.label}
                </span>
              </div>
            </div>

            {/* Issue Title */}
            <h1 className="text-4xl font-semibold text-gray-900 mb-6 leading-tight">{issue.title}</h1>

            {/* Category */}
            <div className="mb-8">
              <span
                className="inline-flex items-center px-6 py-3 rounded-2xl text-sm font-semibold"
                style={{ backgroundColor: issue.category.color + '20', color: issue.category.color }}
              >
                {issue.category.name}
              </span>
            </div>

            {/* Description */}
            <div className="prose prose-lg max-w-none mb-8">
              <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">{issue.description}</p>
            </div>

            {/* Address */}
            {issue.address && (
              <div className="mb-8 p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border border-orange-100">
                <div className="flex items-center text-gray-800">
                  <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center mr-4">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-600 uppercase tracking-wide">Location</p>
                    <p className="text-lg font-medium">{issue.address}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Media Grid */}
            {issue.media_urls && issue.media_urls.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Issue Photos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {issue.media_urls.map((url, index) => {
                    const imageUrl = url.startsWith('http') ? url : `http://localhost:5000${url}`;
                    return (
                      <div key={index} className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                        <img
                          src={imageUrl}
                          alt={`Issue photo ${index + 1}`}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            console.error('Failed to load image:', imageUrl);
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Engagement Stats */}
            <div className="flex items-center justify-between pt-8 border-t border-gray-200">
              <div className="flex items-center space-x-8">
                <button
                  onClick={() => handleVote('up')}
                  disabled={!user}
                  className="group flex items-center space-x-3 text-gray-600 hover:text-emerald-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="w-12 h-12 bg-gray-100 group-hover:bg-emerald-50 group-hover:text-emerald-600 rounded-2xl flex items-center justify-center transition-all duration-200">
                    <ThumbsUp className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{issue.upvotes}</p>
                    <p className="text-sm text-gray-500">Upvotes</p>
                  </div>
                </button>
                
                <button
                  onClick={() => handleVote('down')}
                  disabled={!user}
                  className="group flex items-center space-x-3 text-gray-600 hover:text-red-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="w-12 h-12 bg-gray-100 group-hover:bg-red-50 group-hover:text-red-600 rounded-2xl flex items-center justify-center transition-all duration-200">
                    <ThumbsDown className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{issue.downvotes}</p>
                    <p className="text-sm text-gray-500">Downvotes</p>
                  </div>
                </button>
                
                <div className="flex items-center space-x-3 text-gray-600">
                  <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{issue.comments_count}</p>
                    <p className="text-sm text-gray-500">Comments</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-6 text-gray-500">
                <div className="flex items-center space-x-2">
                  <Eye className="w-5 h-5" />
                  <span className="font-medium">{issue.views} views</span>
                </div>
                <button className="p-3 hover:bg-gray-100 rounded-2xl transition-colors duration-200">
                  <Flag className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-lg border border-orange-100/50 overflow-hidden">
          <div className="p-12">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-3xl font-semibold text-gray-900">
                Discussion ({comments.length})
              </h3>
            </div>

            {/* Add Comment Form */}
            {user ? (
              <form onSubmit={handleCommentSubmit} className="mb-12">
                <div className="flex space-x-6">
                  <div className="flex-shrink-0">
                    {user.avatar_url ? (
                      <img className="h-12 w-12 rounded-full border-2 border-orange-200" src={user.avatar_url} alt="" />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center border-2 border-orange-200">
                        <span className="text-white font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none transition-all duration-200"
                      rows={4}
                      placeholder="Share your thoughts on this issue..."
                    />
                    <div className="mt-4 flex justify-end">
                      <button
                        type="submit"
                        disabled={!newComment.trim() || commentLoading}
                        className="px-8 py-4 bg-orange-600 text-white font-semibold rounded-2xl hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        {commentLoading ? 'Posting...' : 'Post Comment'}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="mb-12 p-8 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl text-center border border-orange-100">
                <MessageCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <p className="text-gray-700 text-lg">
                  <Link to="/login" className="text-orange-600 hover:text-orange-700 font-semibold underline decoration-2 underline-offset-2">
                    Sign in
                  </Link>{' '}
                  to join the discussion and help solve this issue
                </p>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-8">
              {comments.map(comment => (
                <div key={comment.id} className="flex space-x-6">
                  <div className="flex-shrink-0">
                    {comment.user.avatar_url ? (
                      <img className="h-12 w-12 rounded-full border-2 border-gray-200" src={comment.user.avatar_url} alt="" />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center border-2 border-gray-200">
                        <span className="text-white font-medium">
                          {comment.user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="font-semibold text-gray-900">{comment.user.name}</span>
                        <span className="text-sm text-gray-500 flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatTimeAgo(comment.created_at)}
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {comments.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MessageCircle className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No comments yet</h3>
                  <p className="text-gray-600 text-lg">
                    Be the first to share your thoughts and help solve this community issue.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetailPage;