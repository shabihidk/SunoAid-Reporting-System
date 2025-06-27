import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, ThumbsUp, ThumbsDown, MessageCircle, Clock, ArrowLeft, Flag } from 'lucide-react';
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
      fetchIssue(); // Refresh issue to show updated vote counts
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
      fetchComments(); // Refresh comments
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'in_progress': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'resolved': return 'text-green-600 bg-green-50 border-green-200';
      case 'closed': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Issue Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The issue you\'re looking for doesn\'t exist.'}</p>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to="/dashboard"
          className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Issues
        </Link>

        {/* Issue Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {issue.user.avatar_url ? (
                    <img className="h-12 w-12 rounded-full" src={issue.user.avatar_url} alt="" />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="text-white font-medium">
                        {issue.user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{issue.title}</h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="font-medium text-gray-900">{issue.user.name}</span>
                    <span>•</span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatTimeAgo(issue.created_at)}
                    </span>
                    <span>•</span>
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {issue.location.city}, {issue.location.province}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(issue.severity)}`}
                >
                  {issue.severity}
                </span>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(issue.status)}`}
                >
                  {issue.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Category */}
            <div className="mb-6">
              <span
                className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium"
                style={{ backgroundColor: issue.category.color + '20', color: issue.category.color }}
              >
                {issue.category.name}
              </span>
            </div>

            {/* Description */}
            <div className="mb-6">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{issue.description}</p>
            </div>

            {/* Address */}
            {issue.address && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center text-gray-700">
                  <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                  <span className="font-medium">Location:</span>
                  <span className="ml-2">{issue.address}</span>
                </div>
              </div>
            )}

            {/* Media */}
            {issue.media_urls && issue.media_urls.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Photos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {issue.media_urls.map((url, index) => {
                    // Handle both relative and absolute URLs
                    const imageUrl = url.startsWith('http') ? url : `http://localhost:5000${url}`;
                    return (
                      <img
                        key={index}
                        src={imageUrl}
                        alt={`Issue photo ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity duration-200"
                        onError={(e) => {
                          console.error('Failed to load image:', imageUrl);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => handleVote('up')}
                  disabled={!user}
                  className="flex items-center space-x-2 text-gray-500 hover:text-green-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ThumbsUp className="w-5 h-5" />
                  <span className="font-medium">{issue.upvotes}</span>
                </button>
                <button
                  onClick={() => handleVote('down')}
                  disabled={!user}
                  className="flex items-center space-x-2 text-gray-500 hover:text-red-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ThumbsDown className="w-5 h-5" />
                  <span className="font-medium">{issue.downvotes}</span>
                </button>
                <div className="flex items-center space-x-2 text-gray-500">
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-medium">{issue.comments_count} comments</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">{issue.views} views</span>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                  <Flag className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Comments ({comments.length})
            </h3>

            {/* Add Comment Form */}
            {user ? (
              <form onSubmit={handleCommentSubmit} className="mb-8">
                <div className="flex space-x-4">
                  <div className="flex-shrink-0">
                    {user.avatar_url ? (
                      <img className="h-10 w-10 rounded-full" src={user.avatar_url} alt="" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      placeholder="Add a comment..."
                    />
                    <div className="mt-3 flex justify-end">
                      <button
                        type="submit"
                        disabled={!newComment.trim() || commentLoading}
                        className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        {commentLoading ? 'Posting...' : 'Post Comment'}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-gray-600">
                  <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                    Sign in
                  </Link>{' '}
                  to join the discussion
                </p>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-6">
              {comments.map(comment => (
                <div key={comment.id} className="flex space-x-4">
                  <div className="flex-shrink-0">
                    {comment.user.avatar_url ? (
                      <img className="h-10 w-10 rounded-full" src={comment.user.avatar_url} alt="" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                        <span className="text-white font-medium">
                          {comment.user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-gray-900">{comment.user.name}</span>
                        <span className="text-sm text-gray-500">
                          {formatTimeAgo(comment.created_at)}
                        </span>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {comments.length === 0 && (
                <div className="text-center py-8">
                  <MessageCircle className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No comments yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Be the first to share your thoughts on this issue.
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
