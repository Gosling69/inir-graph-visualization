import { useNavigate } from "react-router-dom";
import {Row, Col, Container} from "react-bootstrap"
const AccordItem = ({ data, type }) => {
    console.log(data)
    let navigate = useNavigate();
    const displayIndex = type === "reverse" ? 0 : 1;
    const linkStyle = {
        cursor: "pointer",
    };
    const mapArr = Array.isArray(data) ? data : Object.values(data);
    return (
        <div>
            {mapArr.map((prop, index) => (
                <>
                    <p
                        key={prop.arguments[displayIndex].id}
                        style={linkStyle}
                        onClick={() =>
                            navigate(
                                "../object/" +
                                    encodeURIComponent(
                                        prop.arguments[displayIndex].id
                                    )
                            )
                        }
                    >
                        {prop.arguments[displayIndex].label}
                    </p>
                    {prop.attributes &&
                        <Container className="mb-3 mt-1">
                        {Object.values(prop.attributes).map(([arg]) =>
                            <Row>
                                <Col>{arg.label}</Col>
                                <Col>{arg.literal ?? arg.value}</Col>
                            </Row>
                        )}
                        </Container>
                    }
                </>
            ))}
        </div>
    );
};
export default AccordItem;
