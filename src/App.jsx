import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Viewer from './pages/Viewer';
import Generator from './pages/Generator';
import Animator from './pages/Animator';
import './App.css'

function App() {
  return (
    <Router>
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex space-x-8">
            <Link to="/viewer" className="connect-button text-xl font-semibold text-white hover:text-blue-200 transition duration-300 ease-in-out">
              Viewer
            </Link>
            <Link to="/generator" className="connect-button text-xl font-semibold text-white hover:text-blue-200 transition duration-300 ease-in-out">
              Generator
            </Link>
            <Link to="/animator" className="connect-button text-xl font-semibold text-white hover:text-blue-200 transition duration-300 ease-in-out">
              Animator
            </Link>
          </div>
        </div>
      </header>
      <Routes>
        <Route path="/" element={<Viewer />} />
        <Route path="/viewer" element={<Viewer />} />
        <Route path="/generator" element={<Generator />} />
        <Route path="/animator" element={<Animator />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
