import { isEmpty, uniq } from "lodash";

const color = "#B6F8F0";
const font = "Play";
const tableLabelStyle = {
    // "background-color":"#cc7ed25c",
    "background-color": "#6C447F",

    "border-radius": "10px",
    color: color,
    margin: "-10px",
    "font-family": font,
    padding: "10px",
};
const labelStyle = {
    color: color,
    margin: "-10px",
    // "background-color":"#cc7ed25c",
    "background-color": "#6C447F",
    "border-radius": "10px",
    "font-family": font,
    padding: "5px 10px 5px 10px",
};
const styleToString = (style) => {
    return Object.entries(style).reduce(
        (prev, [key, val]) => (prev += `${key}:${val};`),
        ""
    );
};
const makeTableHoverLabel = (data, style) => {
    if (isEmpty(data)) return "";
    return `<div style=${styleToString(style)}>${Object.values(data)
        .map(([prop]) => prop)
        .reduce(
            (prev, curr) =>
                prev +
                `<div>${curr.label} : ${curr.literal ?? curr.value}<div>`,
            ""
        )}</div>`;
};
const makeHoverLabel = (data, style) => {
    if (isEmpty(data)) return "";
    return `<div style=${styleToString(style)}>${data}</div>`;
};
const makeStraightRelations = (entry) => {
    let straightRelations = Object.entries(entry.straightRelations ?? {}).map(
        ([href, properties]) => {
            let childNodes =
                properties.map((prop) => {
                    let label = prop.arguments[1].label;
                    return {
                        type: "straight",
                        id: prop.arguments[1].id,
                        label: label,
                        hoverLabel: makeHoverLabel(label, labelStyle),
                        linkHoverLabel: makeTableHoverLabel(
                            prop.attributes ?? {},
                            tableLabelStyle
                        ),
                        linkLabel: properties?.[0].label ?? "",
                    };
                }) ?? [];
            let label = properties?.[0].arguments[1].conceptLabel ?? "";
            return {
                id: href,
                type: "straight",
                linkLabel: properties?.[0].label ?? "",
                label: label,
                linkHoverLabel: makeHoverLabel(
                    properties?.[0].label ?? "",
                    labelStyle
                ),
                hoverLabel: makeHoverLabel(label, labelStyle),
                childNodes: childNodes,
            };
        }
    );
    return straightRelations;
};
const makeReverseRelations = (entry) => {
    let reverseRelations = Object.entries(entry.reverseRelations ?? {}).map(
        ([href, properties]) => {
            let arrMap = Array.isArray(properties)
                ? properties
                : Object.values(properties);
            let childNodes =
                arrMap.map((prop) => {
                    let label = prop.arguments[0].label;
                    return {
                        type: "reverse",
                        id: prop.arguments[0].id,
                        label: label,
                        hoverLabel: makeHoverLabel(label, labelStyle),
                        linkHoverLabel: makeTableHoverLabel(
                            prop.attributes ?? {},
                            tableLabelStyle
                        ),
                        linkLabel: Array.isArray(properties)
                            ? properties?.[0].label
                            : properties?.[2].label ?? "",
                    };
                }) ?? [];
            let label = Array.isArray(properties)
                ? properties?.[0].arguments[0].conceptLabel
                : properties?.[2].label ?? "";
            let linkLabel = Array.isArray(properties)
                ? properties?.[0].label
                : properties?.[2].label ?? "";
            return {
                id: href,
                type: "reverse",
                label: label,
                linkLabel: linkLabel,
                linkHoverLabel: makeHoverLabel(linkLabel, labelStyle),
                hoverLabel: makeHoverLabel(label, labelStyle),
                childNodes: childNodes,
            };
        }
    );
    return reverseRelations;
};
const getUniqueNodes = (nodes) => {
    let uniqueNodes = [];
    for (let node of nodes) {
        let targetIndex = uniqueNodes.findIndex((el) => el.id === node.id);
        if (targetIndex !== -1) {
            uniqueNodes[targetIndex].type = "twoway";
        } else {
            uniqueNodes.push(node);
        }
    }
    return uniqueNodes;
};
const getUniqueLinks = (links) => {
    let uniqueLinks = [];
    for (let link of links) {
        let targetIndex = uniqueLinks.findIndex(
            (el) => el.source === link.target && el.target === link.source
        );
        if (targetIndex !== -1) {
            uniqueLinks[targetIndex].type = "twoway";
            link.type = "twoway";
            uniqueLinks.push(link);
        } else {
            uniqueLinks.push(link);
        }
    }
    return uniqueLinks;
};
const makeGraphData = (entry, filter = []) => {
    // console.log(entry)
    let nodes = [];
    let links = [];
    let root = {
        id: entry.label,
        type: "root",
        label: entry.label,
        hoverLabel: makeTableHoverLabel(
            entry.properties ?? {},
            tableLabelStyle
        ),
    };
    let straightRelations = makeStraightRelations(entry);
    straightRelations.forEach((node) => {
        node.childNodes.forEach((child) => {
            links.push({
                source: node.id,
                target: child.id,
                type: "straight",
                label: node.linkLabel,
                hoverLabel: child.linkHoverLabel ?? "NOT FOUND",
                skipLabel: true,
            });
        });
        links.push({
            source: root.id,
            target: node.id,
            type: "straight",
            hoverLabel: node.linkHoverLabel ?? "NOT FOUND",
            label: node.linkLabel,
        });
    });
    let reverseRelations = makeReverseRelations(entry);
    reverseRelations.forEach((node) => {
        if (node.childNodes) {
            node.childNodes.forEach((child) => {
                links.push({
                    source: child.id,
                    target: node.id,
                    type: "reverse",
                    label: node.linkLabel,
                    hoverLabel: child.linkHoverLabel ?? "NOT FOUND",
                    skipLabel: true,
                });
            });
        }
        links.push({
            source: node.id,
            target: root.id,
            type: "reverse",
            hoverLabel: node.linkHoverLabel ?? "NOT FOUND",
            label: node.linkLabel,
        });
    });
    nodes.push(
        root,
        ...straightRelations.reduce(
            (prev, curr) =>
                prev.concat(...curr.childNodes, {
                    id: curr.id,
                    label: curr.label,
                    type: curr.type,
                    linkLabel: curr.linkLabel,
                    hoverLabel: curr.hoverLabel,
                }),
            []
        ),
        ...reverseRelations.reduce(
            (prev, curr) =>
                prev.concat(...curr.childNodes, {
                    id: curr.id,
                    label: curr.label,
                    type: curr.type,
                    linkLabel: curr.linkLabel,
                    hoverLabel: curr.hoverLabel,
                }),
            []
        )
    );
    let uniqueNodes = getUniqueNodes(nodes);
    let uniqueLinks = getUniqueLinks(links);
    const relationTypes = new Set();
    nodes.forEach((node) => relationTypes.add(node.linkLabel));
    return {
        nodes: uniqueNodes.filter(
            (node) =>
                !filter.includes(node.type) && !filter.includes(node.linkLabel)
        ),
        links: uniqueLinks.filter(
            (link) =>
                !filter.includes(link.type) && !filter.includes(link.label)
        ),
        relationTypes: Array.from(relationTypes).filter(
            (el) => el !== undefined
        ),
    };
};

export default makeGraphData;
