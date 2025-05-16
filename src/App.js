import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPages";
import MainPage from "./pages/MainPage";
import StudentProfile from "./pages/StudentProfile";
import ScheduleEdit from "./pages/ScheduleEdit";
import GradesModule from "./pages/GradesModule";
import RequestDocumentForm from "./pages/RequestDocumentForm";


// import AuthPage from "./pages/AuthPage";
// import MainPage from "./pages/MainPage";
// import StudentProfile from "./pages/StudentProfile";
// import ScheduleEdit from "./pages/ScheduleEdit";
// import GradesModule from "./pages/GradesModule";
// import RequestDocumentForm from "./pages/RequestDocumentForm";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/auth" />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/main" element={<MainPage />} />
                <Route path="/profile" element={<StudentProfile />} />
                <Route path="/schedule" element={<ScheduleEdit />} />
                <Route path="/grades" element={<GradesModule />} />
                <Route path="/documents" element={<RequestDocumentForm />} />
            </Routes>
        </Router>
    );
}

export default App;