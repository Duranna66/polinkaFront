import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import LoginForm from "./pages/LoginForm";
import ProfilePage from "./pages/ProfilePage";
import ContactPage from "./pages/ContactPage";
import CarDetails from "./pages/CarDetails";
import Catalog from "./pages/Catalog";
import TopNavbar, { Footer } from "./components/TopNavbar";
import LegalDoc from "./pages/ LegalDoc";

function App() {
    const [search, setSearch] = useState("");
    const [localCars, setLocalCars] = useState([]);
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem("user");
        return saved ? JSON.parse(saved) : null;
    });

    return (
        <div className="layout"> {/* ← обертка */}
            <Router>
                <TopNavbar user={user} setUser={setUser} localCars={localCars} setLocalCars={setLocalCars} />
                <main>
                    <Routes>
                        <Route path="/legal" element={<LegalDoc />} />
                        <Route path="/login" element={<LoginForm setUser={setUser} />} />
                        <Route path="/" element={<Home search={search} />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/contacts" element={<ContactPage />} />
                        <Route path="/catalog" element={<Catalog localCars={localCars} setLocalCars={setLocalCars} />} />
                        <Route path="/catalog/:id" element={<CarDetails />} />
                    </Routes>
                </main>
                <Footer />
            </Router>
        </div>
    );
}

export default App;