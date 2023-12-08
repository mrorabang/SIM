import "./App.css";
import Contact from "./Contact";
import Home from "./Home";
import HomeG from "./HomeG";
import Security from "./Security";
import { Routes,Route,Link } from "react-router-dom";
function App() {
 
  return ( 
    <>
  <div className="headerApp">
    <Link to="/homeg">Sim Trả Góp</Link>
    <Link to="/home">Sim Không Góp</Link>
    <Link to="/contact">Liên Hệ</Link>
  </div>
  <Routes>
    <Route path="/" element={<Security/>}/>
    <Route path="/home" element={<Home/>}/>
    <Route path="/homeg" element={<HomeG/>}/>
    <Route path="/contact" element={<Contact/>}/>
  </Routes>
    </>
   );
}
export default App;
