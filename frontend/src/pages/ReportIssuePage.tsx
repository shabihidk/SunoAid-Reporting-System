import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, AlertCircle, Upload, X } from 'lucide-react';
import axios from 'axios';

interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
}

interface Location {
  id: number;
  name: string;
  city: string;
  province: string;
}

const ReportIssuePage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    location_id: '',
    address: '',
    severity: 'medium',
    latitude: '',
    longitude: ''
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreview, setMediaPreview] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchLocations();
    getCurrentLocation();
  }, []);

  const fetchCategories = async () => {
    try {
      console.log('Fetching categories from:', 'issues/categories');
      const response = await axios.get('issues/categories');
      console.log('Categories response:', response.data);
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchLocations = async () => {
    try {
      console.log('Fetching locations from:', 'locations');
      const response = await axios.get('locations');
      console.log('Locations response:', response.data);
      setLocations(response.data.locations);
    } catch (error) {
      console.error('Failed to fetch locations:', error);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (mediaFiles.length + files.length > 5) {
        setError('You can upload a maximum of 5 images');
        return;
      }

      setMediaFiles(prev => [...prev, ...files]);
      
      // Create preview URLs
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setMediaPreview(prev => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeMedia = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    setMediaPreview(prev => prev.filter((_, i) => i !== index));
  };

  const uploadMediaFiles = async () => {
    if (mediaFiles.length === 0) return [];

    console.log('Starting media upload for', mediaFiles.length, 'files');
    const uploadPromises = mediaFiles.map(async (file, index) => {
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        console.log(`Uploading file ${index + 1}:`, file.name);
        const response = await axios.post('upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        console.log(`File ${index + 1} uploaded successfully:`, response.data.url);
        return response.data.url;
      } catch (error) {
        console.error(`Failed to upload file ${index + 1}:`, error);
        return null;
      }
    });

    const urls = await Promise.all(uploadPromises);
    const validUrls = urls.filter(url => url !== null);
    console.log('Upload complete. Valid URLs:', validUrls);
    return validUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Submitting issue with data:', formData);
      
      // Validate required fields
      if (!formData.title.trim()) {
        setError('Title is required');
        return;
      }
      if (!formData.description.trim()) {
        setError('Description is required');
        return;
      }
      if (!formData.category_id) {
        setError('Category is required');
        return;
      }
      if (!formData.location_id) {
        setError('Location is required');
        return;
      }

      // Upload media files
      console.log('Uploading media files:', mediaFiles.length);
      const mediaUrls = await uploadMediaFiles();
      console.log('Media URLs:', mediaUrls);

      // Submit the issue
      const issueData = {
        ...formData,
        media_urls: mediaUrls,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null
      };

      console.log('Final issue data being sent:', issueData);
      const response = await axios.post('issues', issueData);
      console.log('Issue creation response:', response.data);
      
      // Redirect to the created issue
      navigate(`/issue/${response.data.issue.id}`);
    } catch (err: any) {
      console.error('Error submitting issue:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.error || 'Failed to report issue. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-6 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Report an Issue</h1>
              <p className="mt-2 text-gray-600">
                Help improve your community by reporting civic issues that need attention.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 p-4 rounded-md">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}

              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Issue Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brief, descriptive title of the issue"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Provide detailed information about the issue..."
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              {/* Category and Severity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    id="category_id"
                    name="category_id"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.category_id}
                    onChange={handleInputChange}
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-2">
                    Severity
                  </label>
                  <select
                    id="severity"
                    name="severity"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.severity}
                    onChange={handleInputChange}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location_id" className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <select
                  id="location_id"
                  name="location_id"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.location_id}
                  onChange={handleInputChange}
                >
                  <option value="">Select a location</option>
                  {locations.map(location => (
                    <option key={location.id} value={location.id}>
                      {location.name}, {location.city}, {location.province}
                    </option>
                  ))}
                </select>
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Specific Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="address"
                    name="address"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter the specific address or landmark"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* GPS Coordinates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    id="latitude"
                    name="latitude"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Auto-detected"
                    value={formData.latitude}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    id="longitude"
                    name="longitude"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Auto-detected"
                    value={formData.longitude}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Media Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photos (Optional)
                </label>
                <div className="mt-2">
                  {mediaPreview.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      {mediaPreview.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => removeMedia(index)}
                            className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {mediaFiles.length < 5 && (
                    <label className="flex justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                      <span className="flex items-center space-x-2">
                        <Camera className="w-6 h-6 text-gray-600" />
                        <span className="font-medium text-gray-600">
                          Drop photos here, or{' '}
                          <span className="text-blue-600 underline">browse</span>
                        </span>
                      </span>
                      <input
                        type="file"
                        name="media"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleMediaUpload}
                      />
                    </label>
                  )}
                  
                  {mediaFiles.length > 0 && (
                    <p className="mt-2 text-sm text-gray-500">
                      {mediaFiles.length}/5 photos uploaded
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      <span>Report Issue</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportIssuePage;
