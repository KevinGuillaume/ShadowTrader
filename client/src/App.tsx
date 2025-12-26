import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import SidelineApp from "./SidelineApp";
import MarketPage from "./components/MarketPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/app" element={<SidelineApp />} />
        <Route path="/market/:id" element={<MarketPage />} />
        {/* Optional: redirect or 404 */}
        {/* <Route path="*" element={<Navigate to="/" />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;