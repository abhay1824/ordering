import { Navigate, Route, Routes } from "react-router-dom";
import MenuPage from "./pages/MenuPage";
import AdminPage from "./pages/AdminPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import { useDarkMode } from "./hooks/useDarkMode";

function App() {
  const { toggleTheme } = useDarkMode();

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/menu?table=1" replace />} />
      <Route path="/menu" element={<MenuPage onThemeToggle={toggleTheme} />} />
      <Route path="/admin" element={<AdminPage onThemeToggle={toggleTheme} />} />
      <Route path="/confirmation" element={<OrderConfirmationPage />} />
    </Routes>
  );
}

export default App;
