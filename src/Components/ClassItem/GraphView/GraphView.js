import {
    useState,
    useMemo,
    useCallback,
    useRef,
    useEffect,
    useLayoutEffect,
} from "react";
import { matchRoutes, useNavigate } from "react-router-dom";
import { ForceGraph3D, ForceGraph2D } from "react-force-graph";
import { Row, Col, Button } from "react-bootstrap";
import GraphControlPanel from "./GraphControlPanel";
import { cloneDeep } from "lodash";
import Link2dObject from "./Link2dObject";
import Node2dObject from "./Node2dObject";
import SpriteText from "three-spritetext";
import * as THREE from "three";
import {
    paintLinks,
    paintNodes,
} from "../../../GraphDataGenerator/commonGraphFuncs";

const GraphView = ({ graphData, root, filter, hideRelation }) => {
    let navigate = useNavigate();
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

    const [showLinks, setShowLinks] = useState(true);

    const hideLinks = useCallback(() => {
        setShowLinks(!showLinks);
    });

    const handleNodeClick = useCallback((node) => {
        // console.log(node)
        switch (node.type) {
            case "reverse":
                if (!node.childLinks.find((el) => el.target.id === root))
                    navigate("../object/" + encodeURIComponent(node.id));
                break;
            case "straight":
                if (!node.childLinks.length)
                    navigate("../object/" + encodeURIComponent(node.id));
                break;
            default:
                break;
        }
    }, []);

    const fgRef = useRef();
    const [dimensions, setDimensions] = useState({
        width: 900,
        height: 595,
    });
    useLayoutEffect(() => {
        // console.log(targetRef)
        // if (targetRef.current.parent){
        //     console.log("PARENT")
        // }
        // if (targetRef.current) {
        //     // console.log(targetRef)
        setDimensions({
            width: window.innerWidth - 500,
            height: window.innerHeight - 210,
        });
        // }
    }, [window]);
    useEffect(() => {
        function handleWindowResize() {
            //   console.log(targetRef)
            // console.log(window.innerHeight, window.innerWidth)
            setDimensions({
                width: window.innerWidth - 500,
                height: window.innerHeight - 210,
            });
        }
        window.addEventListener("resize", handleWindowResize);
        return () => {
            window.removeEventListener("resize", handleWindowResize);
        };
    }, []);
    // console.log(graphData)
    return (
        <>
            <ForceGraph2D
                ref={fgRef}
                backgroundColor={"rgba(204, 126, 210, 0)"}
                width={dimensions.width}
                height={dimensions.height}
                forceEngine="d3"
                graphData={graphData}
                linkColor={paintLinks}
                linkWidth={2}
                linkDirectionalParticles={showLinks ? 1 : 0}
                //   linkDirectionalParticles={(link) => nodesById[link.target]}
                // linkDirectionalParticleSpeed={1000}
                nodeColor={(node) => paintNodes(node, root)}
                nodeLabel="hoverLabel"
                linkLabel="hoverLabel"
                onNodeClick={handleNodeClick}
                linkCanvasObjectMode={() => "after"}
                linkCanvasObject={(link, ctx, globalScale) =>
                    Link2dObject(link, ctx, globalScale, showLinks, paintLinks)
                }
                nodeCanvasObject={(node, ctx, globalScale) => {
                    ctx.fillStyle = paintNodes(node, root);
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, 3, 0, 2 * Math.PI, false);
                    ctx.fill();
                    const label =
                        node.label.length > 10
                            ? node.label.slice(0, 10) + "..."
                            : node.label;
                    const fontSize = 12 / globalScale;
                    ctx.font = `${fontSize}px Play`;

                    const textWidth = ctx.measureText(label).width;
                    const bckgDimensions = [textWidth, fontSize].map(
                        (n) => n + fontSize * 0.2
                    ); // some padding
                    ctx.fillStyle = "#cc7ed2";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText(label, node.x, node.y);
                    node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
                }}

                // nodeCanvasObject={(node, ctx, globalScale) => Node2dObject(node, ctx, globalScale, paintNodes)}

                // linkDirectionalArrowLength={3.5}
                // linkDirectionalArrowRelPos={1}
                // cooldownTicks={100}
                // nodeVal="id"

                // nodeAutoColorBy={node => node.type}
                // linkAutoColorBy={link => link.type}
                // height={height}
                // warmupTicks={100}
                // width={width - 30}
                // numDimensions={2}
                // width={width}
                // height={height - 5}
                // onBackgroundRightClick={}
                // onNodeDragEnd={node => {
                //   node.fx = node.x;
                //   node.fy = node.y;
                //   // node.fz = node.z;
                // }}
                // graphData={prunedTree}

                // linkThreeObjectExtend={true}
                // linkThreeObject={link => {
                //   if (!showLinks) return new SpriteText()
                //   // extend link with text sprite
                //   // try three.canvasTexture
                //   const sprite = new SpriteText(link.label);
                //   sprite.color = '#B6F8F0';
                //   sprite.textHeight = 3;
                //   return sprite;
                // }}
                // linkPositionUpdate={(sprite, { start, end }) => {
                //   const vectorNorm = Math.sqrt(
                //     (start.x - end.x) ** 2 + (start.y - end.y) ** 2 + (start.z - end.z) ** 2
                //   )

                //   const middlePos = Object.assign(...['x', 'y', 'z'].map(c => ({
                //     [c]: start[c] + (end[c] - start[c]) / 2 // calc middle point
                //   })));
                //   const alignAngle = Object.assign(...['x', 'y', 'z'].map(c => ({
                //     [c]: Math.acos(Math.abs(start[c] - end[c])/vectorNorm) // calc middle point
                //   })));
                //   // Position sprite
                //   // console.log(alignAngle)
                //   Object.assign(sprite.position, middlePos);
                //   // Object.assign(sprite.rotation, alignAngle);

                // }}
                //   nodeThreeObject={(node) => {
                // let sphere = new THREE.Mesh(
                //   new THREE.SphereGeometry(5),
                //   new THREE.MeshLambertMaterial({
                //     color: node.color,
                //     transparent: false,
                //     // opacity: 0.7
                //     })
                // )
                //     // let sas = new THREE.Sprite()

                //     let text = new SpriteText(node.label.length > 12 ? node.label.slice(0,12) + "..." : node.label);
                //     text.color = node.color;
                //     text.textHeight = 8;
                //     sphere.add(text)
                //     return sphere
                //   }}
                // graphData={graphData}

                // linkLabel="label"
                // onEngineStop={() => fgRef.current.zoomToFit(200)}

                // linkCanvasObject={(link, ctx, globalScale) =>{
                //   if(!showLinks) return
                //   if (!link.label) return
                //   const MAX_FONT_SIZE = 15;
                //   const LABEL_NODE_MARGIN = 10;
                //   const start = link.source;
                //   const end = link.target;
                //   // ignore unbound links
                //   if (typeof start !== 'object' || typeof end !== 'object') return;
                //   // calculate label positioning
                //   switch(link.type){
                //       case "reverse":
                //           // ctx.beginPath();
                //           // ctx.moveTo(start.x, start.y);
                //           // ctx.lineTo(start.x - 5, start.y + 5);
                //           // ctx.moveTo(start.x, start.y);
                //           // ctx.lineTo(start.x + 5, start.y + 5);
                //           // ctx.stroke()
                //           break;
                //       case "straight":
                //           // ctx.beginPath();
                //           // ctx.moveTo(end.x, end.y);
                //           // ctx.lineTo(end.x - 5, end.y + 5);
                //           // ctx.moveTo(end.x, end.y);
                //           // ctx.lineTo(end.x + 5, end.y + 5);
                //           // ctx.stroke()
                //           break;
                //       case "twoway":
                //           // ctx.beginPath();
                //           // ctx.moveTo(start.x, start.y);
                //           // ctx.lineTo(start.x - 5, start.y + 5);
                //           // ctx.moveTo(start.x, start.y);
                //           // ctx.lineTo(start.x + 5, start.y + 5);
                //           // ctx.stroke()
                //           // ctx.beginPath();
                //           // ctx.moveTo(end.x, end.y);
                //           // ctx.lineTo(end.x - 5, end.y + 5);
                //           // ctx.moveTo(end.x, end.y);
                //           // ctx.lineTo(end.x + 5, end.y + 5);
                //           // ctx.stroke()
                //           break;
                //       default:
                //           break;
                //   }
                //   const textPos = Object.assign({},...['x', 'y'].map(c => ({
                //     [c]: start[c] + (end[c] - start[c]) / 2 // calc middle point
                //   })));
                //   const relLink = { x: end.x - start.x, y: end.y - start.y };
                //   const maxTextLength = Math.sqrt(Math.pow(relLink.x, 2) + Math.pow(relLink.y, 2)) - LABEL_NODE_MARGIN * 2;
                // let textAngle = Math.atan2(relLink.y, relLink.x);
                //   // maintain label vertical orientation for legibility
                //   if (textAngle > Math.PI / 2) textAngle = -(Math.PI - textAngle);
                //   if (textAngle < -Math.PI / 2) textAngle = -(-Math.PI - textAngle);
                //   const label = link.label;
                //   // estimate fontSize to fit in link length
                //   ctx.font = '1px Sans-Serif';
                //   const fontSize = Math.min(MAX_FONT_SIZE, maxTextLength / ctx.measureText(label).width) + 1.3;
                //   ctx.font = `${fontSize}px Sans-Serif`;
                //   const textWidth = ctx.measureText(label).width;
                //   const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding
                //   // draw text label (with background rect)
                //   ctx.save();
                //   ctx.translate(textPos.x, textPos.y);
                //   ctx.rotate(textAngle);
                //   ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                //   ctx.fillRect(- bckgDimensions[0] / 2, - bckgDimensions[1] / 2, ...bckgDimensions);
                //   ctx.textAlign = 'center';
                //   ctx.textBaseline = 'middle';
                //   ctx.fillStyle = 'darkgrey';
                //   ctx.setLineDash([5, 5]);
                //   ctx.fillText(label, 0, 0);
                //   ctx.restore();

                // }}
            />
            <GraphControlPanel
                hideRelation={hideRelation}
                hideLinks={hideLinks}
                filter={filter}
                showLinks={showLinks}
                relations={graphData.relationTypes}
            />
        </>
    );
};
export default GraphView;
