import { Row, Col } from "react-bootstrap";

const AccordTitle = ({ data, type }) => {
    const headerStyle = {
        paddingLeft: 0,
    };

    const numProp = Array.isArray(data)
        ? data.length
        : Object.values(data).length;
    const mapArr = Array.isArray(data) ? data : Object.values(data);
    return (
        <>
            {mapArr.map((prop, index) => (
                <>
                    {index === 0 ? (
                        <>
                            {/* //    <Row className="px-0" key={prop.id}>
                //         <Col xs={6} className="px-0"> */}
                            <p>
                                {prop.label} {`(${numProp})`}
                            </p>
                            {/* // </Col>
                        // <Col className="px-0"> */}
                            {type === "straight" ? (
                                <p style={{ marginLeft: "auto" }}>
                                    {prop.arguments[1].conceptLabel}
                                </p>
                            ) : (
                                <p>{prop.arguments[0].conceptLabel}</p>
                            )}

                            {/* //     </Col>
                    // </Row> */}
                        </>
                    ) : (
                        <></>
                    )}
                </>
            ))}
        </>
    );
};
export default AccordTitle;
