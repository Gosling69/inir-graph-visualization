import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

const Footer = (props) => {
    return (
        // <></>
        <Navbar
            // variant="dark"
            bg="dark"
            // style={{
            //     "borderRadius":"0 0 10px 10px",
            //     "backgroundColor":"#FBEA58",
            //     "boxShadow": "0px 4px 5px rgba(0, 0, 0, 0.25)",
            // }}
            fixed="bottom"
        >
            <Nav
                style={{
                    marginLeft: "auto",
                    color: "white",
                }}
            >
                <Nav.Item
                    // style={whereabouts === link ? style():{}}
                    className="mx-5"
                    style={{
                        display: "table-cell",
                        verticalAlign: "middle",
                    }}
                    // active={whereabouts === link}
                >
                    <p
                        style={{
                            display: "block",
                            textAlign: "center",
                            // color: #FFFFFF;
                            margin: "8px",
                        }}
                    >
                        Footer
                    </p>
                </Nav.Item>
            </Nav>
        </Navbar>
    );
};
export default Footer;
