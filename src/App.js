import "./App.css";
import Contact from "./Contact";
import Home from "./Home";
import HomeExcel from "./HomeExcel";
import HomeG from "./HomeG";
import Security from "./Security";
import { Routes,Route,Link } from "react-router-dom";
function App() {
 
  return ( 
    <>
  <div className="headerApp">
    <Link to="/homeg9320">Sim Trả Góp</Link>
    <Link to="/home9320">Sim Không Góp</Link>
    <Link to="/homeExcel">Sim Không Góp Excel</Link>
    <Link to="/contact">Liên Hệ</Link>
  </div>
  <Routes>
    <Route path="/" element={<Security/>}/>
    <Route path="/home9320" element={<Home/>}/>
    <Route path="/homeg9320" element={<HomeG/>}/>
    <Route path="/contact" element={<Contact/>}/>
    <Route path="/homeExcel" element={<HomeExcel/>}/>

  </Routes>
    </>
   );
}
export default App;
