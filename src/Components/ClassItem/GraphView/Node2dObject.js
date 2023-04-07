const Node2dObject = (node, ctx, globalScale, paintNodes) => {
    ctx.fillStyle = paintNodes(node);
    ctx.beginPath();
    ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false);
    ctx.fill();

    const label =
        node.label.length > 10 ? node.label.slice(0, 10) + "..." : node.label;
    const fontSize = 12 / globalScale;
    ctx.font = `${fontSize}px Sans-Serif`;

    const textWidth = ctx.measureText(label).width;
    const bckgDimensions = [textWidth, fontSize].map((n) => n + fontSize * 0.2); // some padding
    ctx.fillStyle = "#B6F8F0";
    // ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, node.x, node.y);
    node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
};
export default Node2dObject;
