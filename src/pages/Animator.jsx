import { useState, useCallback, Suspense, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF, useAnimations } from '@react-three/drei';
import { useDropzone } from 'react-dropzone';
import { saveAs } from 'file-saver';

// Animations available for models
const ANIMATIONS = [
  { id: 'rotate', name: 'Rotate', description: 'Rotate the model around its Y axis' },
  { id: 'bounce', name: 'Bounce', description: 'Make the model bounce up and down' },
  { id: 'scale', name: 'Scale', description: 'Grow and shrink the model' },
  { id: 'walk', name: 'Walk', description: 'Make the model walk in place' },
  { id: 'custom', name: 'Custom', description: 'Create your own animation' }
];

// Model component with animations
const AnimatedModel = ({ url, animation, customAnimation }) => {
  const group = useRef();
  const { scene, animations } = useGLTF(url);
  const { actions, mixer } = useAnimations(animations, group);

  useEffect(() => {
    // Apply built-in animations if they exist
    if (animations.length > 0 && animation !== 'custom') {
      // Look for walking animation in the model's animations
      const walkAnimationName = Object.keys(actions).find(name => 
        name.toLowerCase().includes('walk') || 
        name.toLowerCase().includes('run') || 
        name.toLowerCase().includes('idle')
      );
      
      if (walkAnimationName && animation === 'walk') {
        actions[walkAnimationName].reset().play();
        return;
      }
      
      // Use the first animation action if no walking animation found
      const actionName = Object.keys(actions)[0];
      if (actionName) {
        actions[actionName].reset().play();
      }
      return;
    }

    // Apply custom animations
    if (animation === 'walk') {
      let time = 0;
      const animate = () => {
        if (group.current) {
          // Simulate walking motion
          time += 0.1;
          // Up/down bounce motion
          group.current.position.y = Math.sin(time * 2) * 0.1;
          // Slight left/right sway
          group.current.rotation.z = Math.sin(time) * 0.05;
          // Forward lean
          group.current.rotation.x = Math.sin(time * 2) * 0.05;
        }
        animationFrameId = requestAnimationFrame(animate);
      };
      let animationFrameId = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrameId);
    }
    
    if (animation === 'rotate') {
      const animate = () => {
        if (group.current) {
          group.current.rotation.y += 0.01;
        }
        animationFrameId = requestAnimationFrame(animate);
      };
      let animationFrameId = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrameId);
    }
    
    if (animation === 'bounce') {
      let direction = 1;
      let posY = 0;
      const animate = () => {
        if (group.current) {
          posY += 0.01 * direction;
          if (posY > 0.5) direction = -1;
          if (posY < -0.5) direction = 1;
          group.current.position.y = posY;
        }
        animationFrameId = requestAnimationFrame(animate);
      };
      let animationFrameId = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrameId);
    }
    
    if (animation === 'scale') {
      let scale = 1;
      let scaleDirection = 0.01;
      const animate = () => {
        if (group.current) {
          scale += scaleDirection;
          if (scale > 1.3) scaleDirection = -0.01;
          if (scale < 0.7) scaleDirection = 0.01;
          group.current.scale.set(scale, scale, scale);
        }
        animationFrameId = requestAnimationFrame(animate);
      };
      let animationFrameId = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrameId);
    }
    
    if (animation === 'custom' && customAnimation) {
      const animate = () => {
        if (group.current) {
          // Apply custom animation based on keyframes
          // This is simplified and would be more complex in a real app
          group.current.rotation.x += customAnimation.rotationX || 0;
          group.current.rotation.y += customAnimation.rotationY || 0;
          group.current.rotation.z += customAnimation.rotationZ || 0;
          
          group.current.position.x = Math.sin(Date.now() * 0.001) * (customAnimation.positionX || 0);
          group.current.position.y = Math.sin(Date.now() * 0.002) * (customAnimation.positionY || 0);
          group.current.position.z = Math.sin(Date.now() * 0.003) * (customAnimation.positionZ || 0);
        }
        animationFrameId = requestAnimationFrame(animate);
      };
      let animationFrameId = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrameId);
    }
  }, [animation, actions, animations, customAnimation]);

  return <primitive ref={group} object={scene} />;
};

const Animator = () => {
  const [modelUrl, setModelUrl] = useState('/sample-model.glb');
  const [fileName, setFileName] = useState('Sample Model');
  const [animation, setAnimation] = useState('rotate');
  const [customAnimation, setCustomAnimation] = useState({
    rotationX: 0,
    rotationY: 0.01,
    rotationZ: 0,
    positionX: 0.2,
    positionY: 0.2,
    positionZ: 0
  });

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

  const handleAnimationChange = (e) => {
    setAnimation(e.target.value);
  };

  const handleCustomAnimationChange = (e) => {
    const { name, value } = e.target;
    setCustomAnimation(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  // In a real app, this would export the animated GLB with the animation baked in
  const handleExportAnimated = () => {
    saveAs(modelUrl, `animated-${fileName}`);
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-700">GLB Model Animator</h1>
          <p className="text-xl text-gray-500">Current model: {fileName}</p>
        </div>
      </header>

      <div className="viewer-container neumorphic mt-4 flex flex-col flex-grow">
        <div className="preview-area neumorphic-inset flex-grow">
          {modelUrl ? (
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
              <Suspense fallback={null}>
                <Stage environment="city" intensity={0.5}>
                  <AnimatedModel 
                    url={modelUrl} 
                    animation={animation} 
                    customAnimation={animation === 'custom' ? customAnimation : null} 
                  />
                </Stage>
              </Suspense>
              <OrbitControls enableZoom={true} enablePan={true} />
            </Canvas>
          ) : (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed p-4 rounded-lg text-center ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}`}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className="text-blue-500">Drop the GLB file here...</p>
              ) : (
                <p className="text-gray-500">Drag & drop a GLB file here, or click to select a file</p>
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

      <div className="p-4 bg-white shadow-md mt-4">
        <div className="mb-6">
          <h3 className="font-medium text-gray-700 mb-2">Animation Type</h3>
          <div className="space-y-2">
            {ANIMATIONS.map(anim => (
              <div key={anim.id} className="flex items-center">
                <input
                  type="radio"
                  id={anim.id}
                  name="animation"
                  value={anim.id}
                  checked={animation === anim.id}
                  onChange={handleAnimationChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor={anim.id} className="ml-2 text-sm text-gray-700">
                  {anim.name} - {anim.description}
                </label>
              </div>
            ))}
          </div>
        </div>

        {animation === 'custom' && (
          <div className="mb-6">
            <h3 className="font-medium text-gray-700 mb-3">Custom Animation Controls</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Rotation X</label>
                <input
                  type="range"
                  name="rotationX"
                  min="-0.05"
                  max="0.05"
                  step="0.001"
                  value={customAnimation.rotationX}
                  onChange={handleCustomAnimationChange}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Rotation Y</label>
                <input
                  type="range"
                  name="rotationY"
                  min="-0.05"
                  max="0.05"
                  step="0.001"
                  value={customAnimation.rotationY}
                  onChange={handleCustomAnimationChange}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Rotation Z</label>
                <input
                  type="range"
                  name="rotationZ"
                  min="-0.05"
                  max="0.05"
                  step="0.001"
                  value={customAnimation.rotationZ}
                  onChange={handleCustomAnimationChange}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Position X Range</label>
                <input
                  type="range"
                  name="positionX"
                  min="0"
                  max="1"
                  step="0.1"
                  value={customAnimation.positionX}
                  onChange={handleCustomAnimationChange}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Position Y Range</label>
                <input
                  type="range"
                  name="positionY"
                  min="0"
                  max="1"
                  step="0.1"
                  value={customAnimation.positionY}
                  onChange={handleCustomAnimationChange}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Position Z Range</label>
                <input
                  type="range"
                  name="positionZ"
                  min="0"
                  max="1"
                  step="0.1"
                  value={customAnimation.positionZ}
                  onChange={handleCustomAnimationChange}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}

        <div className="mt-6">
          <button
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handleExportAnimated}
          >
            Export Animated Model
          </button>
        </div>
      </div>
    </div>
  );
};

export default Animator; 