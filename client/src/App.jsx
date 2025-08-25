import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Share from "./pages/Share";
import View from "./pages/View";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/share" element={<Share />} />
        <Route path="/view/:id" element={<View />} />
      </Routes>
    </BrowserRouter>
  );
}

