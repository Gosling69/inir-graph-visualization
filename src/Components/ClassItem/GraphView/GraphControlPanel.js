import { text } from "d3";
import { useState } from "react";
import { Accordion, Button, Row, Container } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
// import { DropDownButton } from "devextreme-react"

const GraphControlPanel = ({
    hideRelation,
    hideLinks,
    filter,
    showLinks,
    relations,
}) => {
    let navigate = useNavigate();
    let params = useParams();
    // const bgColor = "rgba(182, 248, 240, 0.7)"
    const bgColor = "#5E5583";

    const textColor = "#B6F8F0";
    const buttonStyle = {
        backgroundColor: bgColor,
        borderRadius: "25px",
        border: "none",
        color: textColor,
    };

    const accordionStyle = {
        padding: 0,
    };
    const accordionItemStyle = {
        borderRadius: "25px",
        border: "none",
        backgroundColor: "rgb(204 126 210 / 0%)",
        color: textColor,
    };

    const accordionButtonStyle = {
        border: "none",
        // borderRadius:"25px",
        // minHeight:"36px !important",
        cursor: "pointer",
        color: textColor,
        backgroundColor: "rgb(204 126 210 / 0%)",
    };
    const accordionBodyStyle = {
        marginTop: "10px",
        marginBottom: "20px",
        height: "300px",
        borderRadius: "25px",
        overflowY: "scroll",
        backgroundColor: "rgb(204 126 210 / 36%)",
    };

    const containerStyle = {
        width: "11rem",
        paddingBottom: "10px",
        marginBottom: "10px",
        position: "absolute",
        border: "none",
        zIndex: 1,
        right: "3%",
        top: "25%",
    };

    //make position relative to graph
    return (
        <Container fluid style={containerStyle}>
            <Row className="mb-4">
                <Button
                    onClick={() =>
                        navigate(
                            "../fullgraph/" +
                                encodeURIComponent(params.objectId)
                        )
                    }
                    style={buttonStyle}
                >
                    3D Режим
                </Button>
            </Row>
            <Row className="mb-2">
                <Button
                    onClick={() => hideRelation("straight")}
                    style={buttonStyle}
                >
                    {filter.includes("straight") ? "Показать" : "Скрыть"} Прямые
                </Button>
            </Row>
            <Row className="mb-2">
                <Button
                    onClick={() => hideRelation("reverse")}
                    style={buttonStyle}
                >
                    {filter.includes("reverse") ? "Показать" : "Скрыть"} Обратные
                </Button>
            </Row>
            <Row className="mb-2">
                <Button onClick={hideLinks} style={buttonStyle}>
                    {showLinks ? "Скрыть" : "Показать"} Частицы на ребрах
                </Button>
            </Row>
            <Row>
                <Accordion style={accordionStyle}>
                    <Accordion.Item style={accordionItemStyle} eventKey="0">
                        <Accordion.Header
                            id="controlPanelButton"
                            style={accordionItemStyle}
                        >
                            Скрыть связи
                        </Accordion.Header>
                        <Accordion.Body
                            className="controlPanelAccordion"
                            style={accordionBodyStyle}
                        >
                            {relations.map((el) => (
                                <Row key={el + "sas"}>
                                    <p
                                        // variant="primary"
                                        onClick={() => hideRelation(el)}
                                        style={accordionButtonStyle}
                                    >
                                        {!filter.includes(el) ? "Скрыть" : "Показать"}{" "}
                                        {el}
                                    </p>
                                </Row>
                            ))}
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Row>
        </Container>
    );
};
export default GraphControlPanel;
GraphControlPanel.defaultProps = {
    hideRelation: () => {},
    hideLinks: () => {},
    filter: [],
    showLinks: false,
    relations: ["OIRRG", "WOEIGWOEI"],
};
