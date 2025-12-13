import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import SidelineApp from "./SidelineApp";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/app" element={<SidelineApp />} />
        {/* Optional: redirect or 404 */}
        {/* <Route path="*" element={<Navigate to="/" />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;