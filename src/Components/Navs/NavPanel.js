import {
    Row,
    Col,
    Container,
    Navbar,
    Nav,
    Button,
    NavDropdown,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
const NavPanel = () => {
    let navigate = useNavigate();
    const linkNamesMap = {
        "https://uniserv.iis.nsk.su/rdms/index.php?r=site%2Fabout": "About",
        "https://uniserv.iis.nsk.su/rdms/index.php?r=site%2Findex": "Main",
        "/": "Ontology",
    };
    const titleStyle = {
        marginTop: "0px",
        paddingLeft: "20px",
        paddingBottom: "10px",
        fontFamily: "Play",
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: "32px",
        lineHeight: "39px",
        textTransform: "uppercase",
    };
    const linkStyle = {
        // marginLeft:"auto",
        color: "#CC7ED2B2",
    };
    const menuStyle = {
        color: "#CC7ED2B2",

        // backgroundColor:"#cc7ed25c",
    };

    return (
        <Container fluid style={{ borderBottom: "solid 1px" }}>
            <Row></Row>
            <Row className="mt-3">
                <Col className="mx-0" xs={9}>
                    <h1 style={titleStyle}>
                        ПОДДЕРЖКА ПРИНЯТИЯ РЕШЕНИЙ В СЛАБОФОРМАЛИЗОВАННЫХ
                        ОБЛАСТЯХ
                    </h1>
                </Col>
                <Col>
                    <Nav className="justify-content-end" style={linkStyle}>
                        <NavDropdown style={menuStyle} title="Menu">
                            {Object.entries(linkNamesMap).map(
                                ([href, text]) => (
                                    <NavDropdown.Item
                                        style={linkStyle}
                                        onClick={() => {
                                            window.location.href = href;
                                        }}
                                    >
                                        {text}
                                    </NavDropdown.Item>
                                )
                            )}
                        </NavDropdown>
                    </Nav>
                </Col>
            </Row>
        </Container>
    );
};
export default NavPanel;
