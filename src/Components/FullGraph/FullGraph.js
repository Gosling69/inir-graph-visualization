import { useNavigate, useParams } from "react-router-dom";
import { Button, Spinner } from "react-bootstrap";
import { ForceGraphVR } from "react-force-graph";
import { useState, useEffect, useCallback, useMemo } from "react";
import ApiService from "../../Api/Api";
import makeGraphData from "../../GraphDataGenerator/graphDataGenerator";
const FullGraph = (props) => {
    const [data, setData] = useState({});
    const [rootId, setRootId] = useState("");
    const [filter, setFilter] = useState([]);
    const [graphData, setGraphData] = useState({
        nodes: [],
        links: [],
    });
    const paintNodes = (node) => {
        // console.log(node)
        if (node.id === rootId) return "#CC7ED2";
        if (node.type === "straight") return "#B6F8F0";
        if (node.type === "reverse") return "#89DC96";
        if (node.type === "twoway") return "yellow";
    };
    const paintLinks = (link) => {
        if (link.type === "straight") return "#B6F8F0";
        if (link.type === "reverse") return "#89DC96";
        if (link.type === "twoway") return "yellow";
        return "black";
    };

    const buttonStyle = {
        // width: "11rem",
        // paddingBottom: "10px",
        // marginBottom: "10px",
        border: "none",
        // borderRadius:"25px",
        // minHeight:"36px !important",
        cursor: "pointer",
        color: "#B6F8F0",
        backgroundColor: "#CC7ED25C",
        position: "absolute",
        border: "none",
        zIndex: 1,
        right: "3%",
        top: "25%",
    };
    let navigate = useNavigate();
    let params = useParams();
    const nodesById = useMemo(() => {
        const nodesById = Object.fromEntries(
            graphData.nodes.map((node) => [node.id, node])
        );
        // link parent/children
        graphData.nodes.forEach((node) => {
            node.collapsed = false;
            node.childLinks = [];
        });
        graphData.links.forEach((link) =>
            nodesById[link.source].childLinks.push(link)
        );
        return nodesById;
    }, [graphData]);
    const onButtonClick = () => {
        navigate("../object/" + encodeURIComponent(params.objectId));
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
    const handleNodeClick = useCallback((node) => {
        // console.log(node)
        switch (node.type) {
            case "reverse":
                if (!node.childLinks.find((el) => el.target.id === rootId))
                    navigate("../fullgraph/" + encodeURIComponent(node.id));
                break;
            case "straight":
                if (!node.childLinks.length)
                    navigate("../fullgraph/" + encodeURIComponent(node.id));
                break;
            default:
                break;
        }
    }, []);

    return (
        <>
            <Button style={buttonStyle} onClick={onButtonClick}>
                GO BACK
            </Button>
            {rootId ? (
                <ForceGraphVR
                    graphData={graphData}
                    width={window.innerWidth}
                    key={rootId}
                    linkColor={paintLinks}
                    linkWidth={2}
                    linkDirectionalParticles={2}
                    height={window.innerHeight}
                    nodeColor={paintNodes}
                    nodeLabel="id"
                    linkLabel="source.id"
                    onNodeClick={handleNodeClick}
                />
            ) : (
                <Spinner className="text-center" animation="border" />
            )}
        </>
    );
};
export default FullGraph;
