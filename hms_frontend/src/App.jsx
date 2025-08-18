import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/LeftSideBar.jsx";
import Header from "./components/Header.jsx";
import Home from "./pages/Home/Home.jsx";
// import Appointments from "./Appointments";
// import Patients from "./Patients";
// import Schedule from "./Schedule";
// ... add others

export default function App() {
  return (
    <Router>
      <div className="flex bg-black min-h-screen">
        {/* Sidebar (always visible) */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 ml-[341px]">
          <Header />
          <div className="mt-[60px] p-6">
            <Routes>
              <Route path="/" element={<Home />} />
              {/* <Route path="/appointments" element={<Appointments />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/schedule" element={<Schedule />} /> */}
              {/* ... other routes */}
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}
