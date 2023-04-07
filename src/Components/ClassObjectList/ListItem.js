import { useNavigate } from "react-router-dom";
import { Row, Col, Container } from "react-bootstrap";
const ListItem = ({ href, realData, index }) => {
    let navigate = useNavigate();

    const style = {
        cursor: "pointer",
    };

    return (
        <Container>
            <Row>
                <Col>
                    <p
                        key={href}
                        style={style}
                        onClick={() =>
                            navigate("../object/" + encodeURIComponent(href))
                        }
                    >
                        {`${index} - ${realData.label}`}
                    </p>
                </Col>
                <Col>
                    {/* {Object.keys(realData.straightRelations).length} */}
                </Col>
                <Col></Col>
            </Row>
        </Container>
        // <p
        //     key={href}
        //     style={style}
        //     onClick={() => navigate("../object/" + encodeURIComponent(href) )}
        // >
        //     {`${index} - ${realData.label}`}
        // </p>
    );
};
export default ListItem;
