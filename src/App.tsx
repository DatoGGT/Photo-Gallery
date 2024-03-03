
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './Components/Home';
import History from './Components/History';




function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/History" element={<History/>} />
    </Routes>
    </BrowserRouter>
    
  );
}

export default App;
