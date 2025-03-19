import { useState, useRef } from 'react';
import { saveAs } from 'file-saver';

// Mock service for model generation - would be replaced with actual API call
const generateMockModel = async (prompt, imageFile) => {
  // This is a mock implementation
  // In a real app, you would call an API like Shap-E, Point-E, or other 3D generation services
  console.log('Generating model from:', prompt, imageFile);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Return a mock glb URL - in a real app this would be the URL returned by the API
  // For demo purposes, we're using a static sample file
  return '/sample-model.glb';
};

const Generator = () => {
  const [prompt, setPrompt] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [modelUrl, setModelUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGenerateClick = async () => {
    if (!prompt && !imageFile) {
      alert('Please provide a text prompt or upload an image');
      return;
    }

    setLoading(true);
    try {
      const url = await generateMockModel(prompt, imageFile);
      setModelUrl(url);
    } catch (error) {
      console.error('Error generating model:', error);
      alert('Failed to generate model. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (modelUrl) {
      // In a real app, this would download the file from the API
      saveAs(modelUrl, 'generated-model.glb');
    }
  };

  const resetForm = () => {
    setPrompt('');
    setImageFile(null);
    setImagePreview('');
    setModelUrl(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-700">GLB Model Generator</h1>
          <p className="text-gray-500">Generate 3D models from text or images</p>
        </div>
      </header>

      <main className="flex-grow container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Create a 3D Model</h2>
            
            {/* Text Prompt */}
            <div className="mb-6">
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">
                Text Description
              </label>
              <textarea
                id="prompt"
                placeholder="Describe what you want to generate: e.g., 'A red apple with a bite taken out'"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={loading}
              />
            </div>
            
            {/* Image Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Or Upload an Image
              </label>
              <div className="flex items-center">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() => fileInputRef.current.click()}
                  disabled={loading}
                >
                  Choose Image
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={loading}
                />
                {imageFile && (
                  <span className="ml-3 text-sm text-gray-500">
                    {imageFile.name}
                  </span>
                )}
              </div>
              
              {imagePreview && (
                <div className="mt-3">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-32 object-contain rounded-md"
                  />
                </div>
              )}
            </div>
            
            {/* Generate Button */}
            <div className="flex justify-center mt-8 mb-4">
              <button
                className={`px-8 py-3 rounded-full text-white font-semibold ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
                onClick={handleGenerateClick}
                disabled={loading}
              >
                {loading ? 'Generating...' : 'Generate 3D Model'}
              </button>
            </div>
          </div>

          {/* Results Section */}
          {modelUrl && (
            <div className="p-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Generated Model</h3>
              <p className="text-sm text-gray-500 mb-4">
                Your 3D model has been generated! You can now download it or create a new one.
              </p>
              
              <div className="flex space-x-4">
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  onClick={handleDownload}
                >
                  Download GLB File
                </button>
                
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  onClick={resetForm}
                >
                  Create New Model
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Generator; 