import { Row, Col, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
// import Accordion from 'devextreme-react/accordion';
import AccordItem from "./AccordItem";
import AccordTitle from "./AccordTitle";
import { Accordion } from "react-bootstrap";
import { isEmpty } from "lodash";
import { v4 as uuidv4 } from "uuid";

const TableView = ({ data }) => {
    const style = {
        overflowY: "scroll",
        height: "74vh",
    };
    const titleStyle = {
        paddingLeft: "10px",
        paddingTop: "18px",
    };
    const bodyStyle = {
        paddingLeft:0,
    }
    // fix accordions, add key for uniqueness
    return (
        <div
            style={{
                paddingLeft: "20px",
                // paddingRight:"20px"
            }}
        >
            {/* <h2 style={titleStyle} >{data.label}</h2> */}
            <Container style={style} fluid>
                <Row style={{ marginTop: "35px" }}>
                    <Col xs={3}>Properties</Col>
                    <Col>
                        {Object.values(data.properties ?? {}).map(([prop]) => (
                            <Row key={prop.id}>
                                <Col xs={3}>
                                    <p>{`${prop.label}`}</p>
                                </Col>
                                <Col>
                                    <p>{`${prop.literal ?? prop.value}`}</p>
                                </Col>
                                <Col xs={3}></Col>
                            </Row>
                        ))}
                    </Col>
                </Row>
                <Row className="mt-3">
                    {!isEmpty(data.straightRelations) && (
                        <>
                            <Col xs={3}>Straight Relations</Col>
                            <Col>
                                <Accordion
                                    className="relationAccordion"
                                    alwaysOpen
                                    flush
                                >
                                    {Object.values(
                                        data.straightRelations ?? {}
                                    ).map((entry, index) => (
                                        <>
                                            <Accordion.Item eventKey={index}>
                                                <Accordion.Header>
                                                    {
                                                        <AccordTitle
                                                            type="straight"
                                                            data={entry}
                                                        />
                                                    }
                                                </Accordion.Header>
                                                <Accordion.Body style={bodyStyle}>
                                                    <AccordItem
                                                        type="straight"
                                                        data={entry}
                                                    />
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        </>
                                    ))}
                                </Accordion>
                            </Col>
                        </>
                    )}
                </Row>
                <Row className="mt-3 mb-5">
                    {!isEmpty(data.reverseRelations) && (
                        <>
                            <Col xs={3}>Reverse Relations</Col>
                            <Col>
                                <Accordion
                                    className="relationAccordion"
                                    alwaysOpen
                                    flush
                                >
                                    {Object.values(
                                        data.reverseRelations ?? {}
                                    ).map((entry, index) => (
                                        <>
                                            <Accordion.Item eventKey={index}>
                                                <Accordion.Header>
                                                    {
                                                        <AccordTitle
                                                            type="straight"
                                                            data={entry}
                                                        />
                                                    }
                                                </Accordion.Header>
                                                <Accordion.Body style={bodyStyle}>
                                                    <AccordItem
                                                        type="reverse"
                                                        data={entry}
                                                    />
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        </>
                                    ))}
                                </Accordion>
                            </Col>
                        </>
                    )}
                </Row>
            </Container>
        </div>
    );
};
export default TableView;
TableView.defaultProps = {
    data: {},
};
