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
import SaveAccount from "./components/SaveAccount";
import Profile from "./components/Profile";
import SimImageGenerator from "./components/SimImageGenerator";
import HomePage from "./components/HomePage";
import DDoSProtection from "./components/DDoSProtection";

function App() {
    return (
        <DDoSProtection>
            <Routes>
                <Route path="/" element={
                    <>
                        <Menu/>
                        <HomePage />
                        <Footer />
                    </>
                } />
                <Route path="/login" element={
                    <>
                        <LoginPage />
                    </>
                } />

              
                <Route path="/contact" element={
                    <>
                        <Menu/>
                        <Contact />
                        <Footer />
                    </>
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

                <Route path="/register" element={
                    <>
                        <SaveAccount />
                    </>
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

                <Route path="/unauthorized" element={
                    <ProtectedRoute>
                        <Menu/>
                        <div className="container mt-5">
                            <div className="row justify-content-center">
                                <div className="col-md-6">
                                    <div className="alert alert-warning text-center">
                                        <h4>Không có quyền truy cập</h4>
                                        <p>Bạn không có quyền truy cập vào trang này.</p>
                                        <a href="/sim-generator" className="btn btn-primary">Về trang chính</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ProtectedRoute>
                } />

                <Route path="*" element={
                    <>
                        <NotFound />
                    </>
                } />

            </Routes>
        </DDoSProtection>

    );
}

export default App;
