# GLB Model Maker

A web application for viewing, generating, and animating 3D models in GLB format.

## Features

- **Model Viewer**: View and interact with GLB models in 3D space
- **Model Generator**: Generate 3D models from text descriptions or images
- **Model Animator**: Add and customize animations for GLB models

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm 7.x or higher

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/model-maker.git
   cd model-maker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Model Viewer
- Drag and drop a GLB file into the viewer
- Use mouse controls to interact with the model:
  - Left mouse: Rotate camera
  - Middle mouse: Pan camera
  - Scroll wheel: Zoom in/out
  - Right mouse + drag: Pan camera

### Model Generator
- Enter a text description or upload an image
- Click "Generate 3D Model" to create a new model
- Download the generated model in GLB format

### Model Animator
- Upload a GLB model
- Choose from preset animations or create custom animations
- Adjust animation parameters using the control panel
- Export the animated model

## Development

### Project Structure

```
model-maker/
├── public/
│   └── sample-model.glb
├── src/
│   ├── components/
│   ├── lib/
│   │   └── modelUtils.js
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Viewer.jsx
│   │   ├── Generator.jsx
│   │   └── Animator.jsx
│   ├── services/
│   └── styles/
│       └── global.css
├── package.json
└── README.md
```

### Technologies Used

- React
- Three.js
- React Three Fiber
- React Three Drei
- Tailwind CSS
- Vite

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.