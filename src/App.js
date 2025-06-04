import { Routes, Route, Navigate } from "react-router-dom";
import Contact from "./components/Contact";
import CreateImage from "./service/CreateImage";
import Filter from "./components/Filter";
import LoginPage from "./components/LoginPage";
import ProtectedRoute from "./service/ProtectedRoute";
import Menu from "./components/Menu";
import NotFound from "./components/NotFound";
import Chat from "./components/Chat";

function App() {
    return (
        <>

            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<LoginPage />} />

                <Route path="/create" element={
                    <ProtectedRoute>
                        <Menu/>
                        <CreateImage />
                    </ProtectedRoute>
                }/>
                <Route path="/contact" element={
                    <ProtectedRoute>
                        <Menu/>
                        <Contact />
                    </ProtectedRoute>
                }/>
                <Route path="/filter" element={
                    <ProtectedRoute>
                        <Menu/>
                        <Filter />
                    </ProtectedRoute>
                }/>
                <Route path="/chat" element={
                    <ProtectedRoute>
                        <Menu/>
                        <Chat />
                    </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />

            </Routes>
        </>

    );
}

export default App;
