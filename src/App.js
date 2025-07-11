import { Routes, Route, Navigate } from "react-router-dom";
import Contact from "./components/Contact";
import CreateImage from "./service/CreateImage";
import Filter from "./components/Filter";
import LoginPage from "./components/LoginPage";
import ProtectedRoute from "./service/ProtectedRoute";
import Menu from "./layout/Menu";
import NotFound from "./components/NotFound";
import Chat from "./components/Chat";
import AccountManagement from "./components/AccountManagement";
import CreateAccount from "./components/CreateAccount";
import Profile from "./components/Profile";

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

                <Route path="/account" element={
                    <ProtectedRoute adminOnly={true}>
                        <Menu/>
                        <AccountManagement />
                    </ProtectedRoute>
                } />

                <Route path="/new" element={
                    <ProtectedRoute adminOnly={true}>
                        <Menu/>
                        <CreateAccount />
                    </ProtectedRoute>
                } />

                <Route path="/profile" element={
                    <ProtectedRoute>
                        <Menu/>
                        <Profile />
                    </ProtectedRoute>
                } />

                <Route path="*" element={<NotFound />} />

            </Routes>
        </>

    );
}

export default App;
