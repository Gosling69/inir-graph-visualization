import { useNavigate, useParams } from "react-router-dom";
import { Button, Spinner } from "react-bootstrap";
import { ForceGraphVR } from "react-force-graph";
import { useState, useEffect, useCallback, useMemo } from "react";
import ApiService from "../../Api/Api";
import makeGraphData from "../../GraphDataGenerator/graphDataGenerator";

import { paintLinks, paintNodes } from "../../GraphDataGenerator/commonGraphFuncs";
import CyrillicToTranslit from "cyrillic-to-translit-js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

const FullGraph = (props) => {
    const cyrillicToTranslit = new CyrillicToTranslit();

    const [data, setData] = useState({});
    const [rootId, setRootId] = useState("");
    const [filter, setFilter] = useState([]);
    const [graphData, setGraphData] = useState({
        nodes: [],
        links: [],
    });

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
                // console.log(res);
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
                    nodeColor={(node) => paintNodes(node, rootId)}
                    nodeLabel={(node) =>
                        cyrillicToTranslit.transform(node.label)
                    }
                    linkLabel={(link) =>
                        cyrillicToTranslit.transform(link.hoverLabelVR)
                    }
                    onNodeClick={handleNodeClick}
                    // nodeThreeObject={(node) => {
                    //     let sphere = new THREE.Mesh(
                    //         // new THREE.SphereGeometry(5),
                    //         new THREE.BoxGeometry(5, 5, 5),
                    //         new THREE.MeshLambertMaterial({
                    //             color: node.color,
                    //             transparent: true,
                    //             opacity: 0,
                    //         })
                    //     );
                    //     let loadedModel;
                    //     const glftLoader = new GLTFLoader();
                    //     glftLoader.load(
                    //         "/assets/models/pepe/scene.gltf",
                    //         (gltfScene) => {
                    //             loadedModel = gltfScene;
                    //             // console.log(loadedModel);
                    //             gltfScene.scene.rotation.y = Math.PI / 8;
                    //             gltfScene.scene.position.y = 3;
                    //             // gltfScene.scene.scale.set(0.5, 0.5, 0.5);
                    //             gltfScene.scene.scale.set(10, 10, 10);
                    //             // gltfScene.scene.scale.set(5, 5, 5);
                    //             sphere.add(gltfScene.scene);
                    //         }
                    //     );
                    //     return sphere;
                    // }}
                />
            ) : (
                <Spinner className="text-center" animation="border" />
            )}
        </>
    );
};
export default FullGraph;
