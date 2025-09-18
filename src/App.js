import { Routes, Route, Navigate } from "react-router-dom";
import Contact from "./components/Contact";
import CreateImage from "./service/CreateImage";
import Filter from "./components/Filter";
import LoginPage from "./components/LoginPage";
import ProtectedRoute from "./service/ProtectedRoute";
import Menu from "./layout/Menu";
import Footer from "./layout/Footer";
import NotFound from "./components/NotFound";
import Chat from "./components/Chat";
import AccountManagement from "./components/AccountManagement";
import CreateAccount from "./components/CreateAccount";
import Profile from "./components/Profile";
import SimImageGenerator from "./components/SimImageGenerator";

function App() {
    return (
        <>

            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={
                    <>
                        <LoginPage />
                        <Footer />
                    </>
                } />

              
                <Route path="/contact" element={
                    <ProtectedRoute>
                        <Menu/>
                        <Contact />
                        <Footer />
                    </ProtectedRoute>
                }/>
                <Route path="/filter" element={
                    <ProtectedRoute>
                        <Menu/>
                        <Filter />
                        <Footer />
                    </ProtectedRoute>
                }/>
                <Route path="/chat" element={
                    <ProtectedRoute>
                        <Menu/>
                        <Chat />
                        <Footer />
                    </ProtectedRoute>
                } />

                <Route path="/account" element={
                    <ProtectedRoute adminOnly={true}>
                        <Menu/>
                        <AccountManagement />
                        <Footer />
                    </ProtectedRoute>
                } />

                <Route path="/new" element={
                    <ProtectedRoute adminOnly={true}>
                        <Menu/>
                        <CreateAccount />
                        <Footer />
                    </ProtectedRoute>
                } />

                <Route path="/profile" element={
                    <ProtectedRoute>
                        <Menu/>
                        <Profile />
                        <Footer />
                    </ProtectedRoute>
                } />

                <Route path="/sim-generator" element={
                    <ProtectedRoute>
                        <Menu/>
                        <SimImageGenerator />
                        <Footer />
                    </ProtectedRoute>
                } />

                <Route path="*" element={
                    <>
                        <NotFound />
                        <Footer />
                    </>
                } />

            </Routes>
        </>

    );
}

export default App;
