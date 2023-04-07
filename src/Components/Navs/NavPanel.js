import { Row, Col, Container, Navbar, Nav, Button } from "react-bootstrap";

const NavPanel = (props) => {
    const linkNamesMap = {
        "/admin": "Admin",
        "/about": "About",
        "/": "Main",
        "/ontology": "Ontology",
    };
    const titleStyle = {
        marginTop: "30px",
        paddingLeft: "20px",
        paddingBottom: "10px",
        fontFamily: "Play",
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: "32px",
        lineHeight: "39px",
        textTransform: "uppercase",
    };

    return (
        <Container fluid style={{ borderBottom: "solid 1px" }}>
            {/* <Navbar 
            // variant="dark"
            // bg="dark"
            // style={{
            //     "borderRadius":"0 0 10px 10px",
            //     "backgroundColor":"#FBEA58",
            //     "boxShadow": "0px 4px 5px rgba(0, 0, 0, 0.25)",
            // }} 
            sticky='top' 
        > */}
            <Row>
                {/* <Col xs={1}>
                    <Button>Main</Button>
                </Col>
                <Col xs={1}>
                    <Button>Ontology</Button>
                </Col>
                <Col xs={1}>
                    <Button>About</Button>
                </Col>
                <Col></Col> */}
                {/* <Nav
                    style={{
                        "marginRight":"auto",
                        "color":"black"
                    }}
                >
                    {Object.entries(linkNamesMap).map(([link, name]) =>
                        <Nav.Link 
                            // style={whereabouts === link ? style():{}} 
                            className='mx-5' 
                            // active={whereabouts === link} 
                            href={link}
                            key={name}
                        >
                            {name}
                        </Nav.Link>
                    )}
                </Nav> */}
            </Row>
            <Row>
                <h1 style={titleStyle}>
                    ПОДДЕРЖКА ПРИНЯТИЯ РЕШЕНИЙ В СЛАБОФОРМАЛИЗОВАННЫХ ОБЛАСТЯХ
                </h1>
            </Row>
            {/* </Navbar> */}
        </Container>
    );
};
export default NavPanel;
