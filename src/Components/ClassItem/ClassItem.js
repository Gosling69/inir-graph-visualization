import { useParams } from "react-router-dom";
import ApiService from "../../Api/Api";
import {
    useState,
    useEffect,
    useCallback,
    useLayoutEffect,
    useRef,
} from "react";
import { Tab, Button, Spinner, Row, Col } from "react-bootstrap";
import TableView from "./TableView/TableView";
import GraphView from "./GraphView/GraphView";
import makeGraphData from "../../GraphDataGenerator/graphDataGenerator";
import { cloneDeep } from "lodash";

const ClassItem = () => {
    const [activeTab, setActiveTab] = useState("tableView");
    const targetRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    //   useLayoutEffect(() => {
    //     // console.log(targetRef)
    //     // if (targetRef.current.parent){
    //     //     console.log("PARENT")
    //     // }
    //     if (targetRef.current) {
    //         // console.log(targetRef)
    //       setDimensions({
    //         width: targetRef.current.clientWidth,
    //         height: targetRef.current.clientHeight,
    //       });
    //     }
    //   }, []);
    //   useLayoutEffect(() => {
    //     // console.log(targetRef);
    //     // console.log(targetRef.current.offsetWidth, targetRef.current.offsetHeight);
    //     setDimensions({
    //         width: targetRef.current.clientWidth,
    //         height: targetRef.current.clientHeight,
    //     });
    //     // if (targetRef.current) {
    //     //     setDimensions({
    //     //         width: targetRef.current.offsetWidth,
    //     //         height: targetRef.current.offsetHeight
    //     //     });
    //     // }
    //   }, [targetRef]);

    let params = useParams();
    const [data, setData] = useState({});
    const [rootId, setRootId] = useState("");
    const [filter, setFilter] = useState([]);
    const [graphData, setGraphData] = useState({
        nodes: [],
        links: [],
    });

    const hideRelation = (relation) => {
        let optionIndex = filter.findIndex((el) => el === relation);
        let newFilter;
        if (optionIndex === -1) {
            newFilter = [...filter, relation];
        } else {
            newFilter = cloneDeep(filter);
            newFilter.splice(optionIndex, 1);
        }
        setFilter(newFilter);
        setGraphData(makeGraphData(data, newFilter));
    };

    const refresh = () => {
        setRootId("");
        setFilter([]);
        setTimeout(() => {
            ApiService.getObjectById(params.objectId).then((res) => {
                console.log(res);
                setGraphData(makeGraphData(res));
                setData(res);
                setTimeout(() => setRootId(res.label), 300);
            });
        }, 300);
    };
    useEffect(() => {
        refresh();
    }, []);
    useEffect(() => {
        refresh();
    }, [params.objectId]);

    //   useEffect(() => {
    //     function handleWindowResize() {
    //     //   console.log(targetRef)
    //       setDimensions({
    //         width: targetRef.current.clientWidth,
    //         height: targetRef.current.clientHeight,
    //       });
    //     }
    //     window.addEventListener("resize", handleWindowResize);
    //     return () => {
    //       window.removeEventListener("resize", handleWindowResize);
    //     };
    //   }, []);

    const buttonActiveStyle = {
        borderRadius: "10px 10px 0px 0px",
        border: "none",
        textDecoration: "underline",
        textUnderlinePosition: "under",
        textUnderlineOffset: "9px",
        backgroundColor: "rgba(204, 126, 210, 0)",
        color: "inherit",
        minWidth: "300px",
    };
    const buttonDefaultStyle = {
        border: "none",
        backgroundColor: "inherit",
        color: "inherit",
        minWidth: "300px",
    };

    const onButtonClick = (tab) => {
        setGraphData(makeGraphData(data));
        setRootId(rootId);
        setActiveTab(tab);
    };

    return (
        <Tab.Container id="itemContent" activeKey={activeTab}>
            <Button
                size="lg"
                style={
                    activeTab === "tableView"
                        ? buttonActiveStyle
                        : buttonDefaultStyle
                }
                onClick={() => onButtonClick("tableView")}
            >
                Table View
            </Button>

            <Button
                size="lg"
                style={
                    activeTab === "graphView"
                        ? buttonActiveStyle
                        : buttonDefaultStyle
                }
                onClick={() => onButtonClick("graphView")}
            >
                Graph View
            </Button>
            <Row ref={targetRef}>
                <Col>
                    {activeTab === "tableView" ? (
                        <>
                            {rootId.length ? (
                                <TableView data={data} />
                            ) : (
                                <Spinner
                                    className="text-center"
                                    animation="border"
                                />
                            )}
                        </>
                    ) : (
                        <>
                            {rootId.length ? (
                                <GraphView
                                    graphData={graphData}
                                    root={rootId}
                                    key={
                                        rootId +
                                        "graph" +
                                        filter.reduce(
                                            (prev, curr) => (prev += curr),
                                            ""
                                        )
                                    } //dont touch, without key wont redraw graph for new data
                                    filter={filter}
                                    hideRelation={hideRelation}
                                    width={dimensions.width}
                                    height={dimensions.height}
                                />
                            ) : (
                                <Spinner
                                    className="text-center"
                                    animation="border"
                                />
                            )}
                        </>
                    )}
                </Col>
            </Row>
        </Tab.Container>
    );
};

export default ClassItem;
