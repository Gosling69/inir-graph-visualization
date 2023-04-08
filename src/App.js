import logo from "./logo.svg";
import "./App.css";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Ontology from "./Pages/Ontology";
import ClassObjectsList from "./Components/ClassObjectList/ClassObjectsList";
import ClassItem from "./Components/ClassItem/ClassItem";
import Footer from "./Components/Navs/Footer";
import FullGraph from "./Pages/FullGraph/FullGraph";
//Make Background animated as in landing sites

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Ontology />}>
                        <Route
                            path="class/:classId"
                            element={<ClassObjectsList />}
                        />
                        <Route
                            path="object/:objectId"
                            element={<ClassItem />}
                        />
                    </Route>
                    <Route
                        path="/fullgraph/:objectId"
                        element={<FullGraph />}
                    />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
