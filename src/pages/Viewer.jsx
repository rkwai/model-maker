import { useState, useCallback, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF } from '@react-three/drei';
import { useDropzone } from 'react-dropzone';

// Model component that renders the GLB file
const Model = ({ url }) => {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
};

function ModelViewer({ url }) {
  if (!url) return null;
  
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <Suspense fallback={null}>
        <Stage environment="city" intensity={0.5}>
          <Model url={url} />
        </Stage>
      </Suspense>
      <OrbitControls autoRotate />
    </Canvas>
  );
}

const Viewer = () => {
  const [modelUrl, setModelUrl] = useState('/sample-model.glb');
  const [fileName, setFileName] = useState('Sample Model');

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setModelUrl(url);
      setFileName(file.name);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'model/gltf-binary': ['.glb']
    },
    maxFiles: 1
  });

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-700">GLB Model Viewer</h1>
          <p className="text-xl text-gray-500">Current model: {fileName}</p>
        </div>
      </header>
      <div className="viewer-container neumorphic mt-4">
        <div className="preview-area neumorphic-inset">
          {modelUrl ? (
            <ModelViewer url={modelUrl} />
          ) : (
            <div 
              {...getRootProps()} 
              className={`drop-zone ${isDragActive ? 'active' : ''}`}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the GLB file here...</p>
              ) : (
                <>
                  <p>Drag & drop a GLB file here</p>
                  <p>or click to select a file</p>
                </>
              )}
            </div>
          )}
        </div>
        {modelUrl && (
          <div className="flex justify-center mt-4 mb-8">
            <button
              {...getRootProps()}
              className="icon-button text-gray-700 font-medium hover:opacity-80 transition-opacity"
            >
              Change Model
              <input {...getInputProps()} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Viewer; 