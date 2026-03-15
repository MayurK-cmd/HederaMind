import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Landing } from "./pages/Landing";
import { Connect } from "./pages/Connect";
import { Chat } from "./pages/Chat";
import  Docs  from "./pages/Docs"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"        element={<Landing />} />
        <Route path="/connect" element={<Connect />} />
        <Route path="/chat"    element={<Chat />} />
        <Route path="/docs"    element={<Docs />} />
        <Route path="*"        element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}