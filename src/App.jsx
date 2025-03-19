import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Viewer from './pages/Viewer';
import Generator from './pages/Generator';
import Animator from './pages/Animator';
import './App.css'

function App() {
  return (
    <Router>
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
