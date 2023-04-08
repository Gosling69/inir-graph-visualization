const paintNodes = (node, root) => {
    // console.log(node)
    if (node.id === root) return "#CC7ED2";
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

export { paintLinks, paintNodes };
