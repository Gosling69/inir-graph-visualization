import { useState, useEffect } from "react";
import ApiService from "../../Api/Api";
import { Container, Row, Col } from "react-bootstrap";
import OntologyTree from "../../Components/Navs/OntologyTree";
import { Outlet } from "react-router-dom";
import NavPanel from "../../Components/Navs/NavPanel";

const Ontology = (props) => {
    const [ontologyTree, setOntologyTree] = useState([]);

    useEffect(() => {
        ApiService.getFullTree().then((res) => {
            // console.log(res)
            setOntologyTree(res);
        });
    }, []);

    return (
        <>
            <NavPanel />
            <Row className="mt-3 mb-0 mx-3">
                <Col id="ontologyCol" xs={3}>
                    <OntologyTree data={ontologyTree} />
                </Col>
                <Col id="contentCol">
                    <Outlet />
                </Col>
            </Row>
        </>
    );
};
export default Ontology;
