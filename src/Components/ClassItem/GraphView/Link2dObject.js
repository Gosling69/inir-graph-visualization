const Link2dObject = (link, ctx, globalScale, showLinks, paintLinks) => {
    if (!showLinks) return;
    if (!link.label) return;
    link.color = paintLinks(link);
    if (link.skipLabel) return;
    return
    const MAX_FONT_SIZE = 15;
    const LABEL_NODE_MARGIN = 10;
    const start = link.source;
    const end = link.target;
    // ignore unbound links
    if (typeof start !== "object" || typeof end !== "object") return;
    // calculate label positioning
    switch (link.type) {
        case "reverse":
            break;
        case "straight":
            break;
        case "twoway":
            break;
        default:
            break;
    }
    const textPos = Object.assign(
        {},
        ...["x", "y"].map((c) => ({
            [c]: start[c] + (end[c] - start[c]) / 2, // calc middle point
        }))
    );
    const relLink = { x: end.x - start.x, y: end.y - start.y };
    const maxTextLength =
        Math.sqrt(Math.pow(relLink.x, 2) + Math.pow(relLink.y, 2)) -
        LABEL_NODE_MARGIN * 2;
    let textAngle = Math.atan2(relLink.y, relLink.x);
    // maintain label vertical orientation for legibility
    if (textAngle > Math.PI / 2) textAngle = -(Math.PI - textAngle);
    if (textAngle < -Math.PI / 2) textAngle = -(-Math.PI - textAngle);
    const label = link.label;
    // estimate fontSize to fit in link length
    ctx.font = "1px Sans-Serif";
    const fontSize =
        Math.min(MAX_FONT_SIZE, maxTextLength / ctx.measureText(label).width) +
        1.3;
    ctx.font = `${fontSize}px Sans-Serif`;
    const textWidth = ctx.measureText(label).width;
    const bckgDimensions = [textWidth, fontSize].map((n) => n + fontSize * 0.2); // some padding
    // draw text label (with background rect)
    ctx.save();
    ctx.translate(textPos.x, textPos.y);
    ctx.rotate(textAngle);
    ctx.fillStyle = "rgba(255, 255, 255, 0)";
    ctx.fillRect(
        -bckgDimensions[0] / 2,
        -bckgDimensions[1] / 2,
        ...bckgDimensions
    );
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#B6F8F0";
    ctx.setLineDash([5, 5]);
    ctx.fillText(label, 0, 0);
    ctx.restore();
};
export default Link2dObject;
