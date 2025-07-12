import { CodingPage } from './components/CodingPage'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Landing } from './components/Landing';

function App() {
  return (
    <div className="h-screen w-screen bg-[#0d1117] text-[#e6edf3] overflow-hidden">
      <BrowserRouter>
        <Routes>
          <Route path="/coding" element={<CodingPage />} />
          <Route path="/" element={<Landing />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App