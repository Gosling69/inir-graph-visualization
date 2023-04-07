import logo from "./logo.svg";
import "./App.css";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Main from "./Pages/Main";
import Ontology from "./Pages/Ontology";
import Auth from "./Pages/Auth";
import About from "./Pages/About";
import NavPanel from "./Components/Navs/NavPanel";
import ClassObjectsList from "./Components/ClassObjectList/ClassObjectsList";
import ClassItem from "./Components/ClassItem/ClassItem";
import Footer from "./Components/Navs/Footer";

//Make Background animated as in landing sites

function App() {
    return (
        <>
            <NavPanel />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Main />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/ontology" element={<Ontology />}>
                        <Route
                            path="class/:classId"
                            element={<ClassObjectsList />}
                        />
                        <Route
                            path="object/:objectId"
                            element={<ClassItem />}
                        />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
