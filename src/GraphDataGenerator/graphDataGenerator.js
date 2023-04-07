const makeGraphData = (entry, filter = []) => {
    console.log(filter);

    const color = "#B6F8F0";
    const font = "Play";
    const rootLabelStyle = {
        color: color,
        "font-family": font,
        padding: "10px",
    };
    const labelStyle = {
        color: color,
        "font-family": font,
        margin: "0 !important",
    };
    let nodes = [];
    let links = [];
    let rootLabel = Object.values(entry.properties ?? {})
        .map(([prop]) => prop)
        .reduce(
            (prev, curr) =>
                prev +
                `<div>${curr.label} : ${curr.literal ?? curr.value}<div>`,
            ""
        );

    let root = {
        id: entry.label,
        type: "root",
        label: entry.label,
        hoverLabel: `<div style="${Object.entries(rootLabelStyle).reduce(
            (prev, curr) => (prev += `${curr[0]}:${curr[1]};`),
            ""
        )}">${rootLabel}</div>`,
    };

    let straightRelations = Object.entries(entry.straightRelations ?? {}).map(
        ([href, properties]) => {
            let childNodes =
                properties.map((prop) => {
                    return {
                        type: "straight",
                        id: prop.arguments[1].id,
                        label: prop.arguments[1].label,
                        hoverLabel: `<div style=${Object.entries(
                            labelStyle
                        ).reduce(
                            (prev, curr) => (prev += `${curr[0]}:${curr[1]};`),
                            ""
                        )}>${prop.arguments[1].label}<div>`,
                        linkLabel: `<div>${Object.values(prop.attributes ?? {})
                            .map(([arg]) => arg)
                            .reduce((prev, curr) => prev +=`<p>${curr}</p>`,"")}</div>`,
                    };
                }) ?? [];
            return {
                id: href,
                type: "straight",
                linkLabel: properties?.[0].label ?? "",
                label: properties?.[0].arguments[1].conceptLabel ?? "",
                hoverLabel: `<div style=${Object.entries(labelStyle).reduce(
                    (prev, curr) => (prev += `${curr[0]}:${curr[1]};`),
                    ""
                )}>${properties?.[0].arguments[1].conceptLabel ?? ""}<div>`,
                childNodes: childNodes,
            };
        }
    );
    straightRelations.forEach((node) => {
        if (node.childNodes) {
            node.childNodes.forEach((child) => {
                console.log(node.linkLabel)
                links.push({
                    source: node.id,
                    target: child.id,
                    type: "straight",
                    label: node.linkLabel,
                    skipLabel: true,
                });
            });
        }
        links.push({
            source: root.id,
            target: node.id,
            type: "straight",
            label: node.linkLabel,
        });
    });
    let reverseRelations = Object.entries(entry.reverseRelations ?? {}).map(
        ([href, properties]) => {
            let arrMap = Array.isArray(properties)
                ? properties
                : Object.values(properties);
            let childNodes =
                arrMap.map((prop) => {
                    return {
                        type: "reverse",
                        id: prop.arguments[0].id,
                        label: prop.arguments[0].label,
                        hoverLabel: `<div style=${Object.entries(
                            labelStyle
                        ).reduce(
                            (prev, curr) => (prev += `${curr[0]}:${curr[1]};`),
                            ""
                        )}>${prop.arguments[0].label}<div>`,
                        linkLabel: `<div>${Object.values(prop.attributes ?? {})
                            .map(([arg]) => arg)
                            .reduce((prev, curr) => prev +=`<p>${curr}</p>`,"")}</div>`,
                        // linkLabel:  Array.isArray(properties)
                        //     ? properties?.[0].label
                        //     : properties?.[2].label ?? "",
                    };
                }) ?? [];
            let labelText = Array.isArray(properties)
                ? properties?.[0].arguments[0].conceptLabel
                : properties?.[2].label ?? "";
            return {
                id: href,
                type: "reverse",
                label: labelText,
                linkLabel: Array.isArray(properties)
                    ? properties?.[0].label
                    : properties?.[2].label ?? "",
                hoverLabel: `<div style=${Object.entries(labelStyle).reduce(
                    (prev, curr) => (prev += `${curr[0]}:${curr[1]};`),
                    ""
                )}>${labelText}<div>`,
                childNodes: childNodes,
            };
        }
    );
    reverseRelations.forEach((node) => {
        if (node.childNodes) {
            node.childNodes.forEach((child) => {
                links.push({
                    source: child.id,
                    target: node.id,
                    type: "reverse",
                    label: node.linkLabel,
                    skipLabel: true,
                });
            });
        }
        links.push({
            source: node.id,
            target: root.id,
            type: "reverse",
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
                }),
            []
        )
    );
    let uniqueNodes = [];
    let uniqueLinks = [];
    for (let node of nodes) {
        // console.log(node)
        let targetIndex = uniqueNodes.findIndex((el) => el.id === node.id);
        if (targetIndex !== -1) {
            // console.log(targetIndex)
            uniqueNodes[targetIndex].type = "twoway";
        } else {
            uniqueNodes.push(node);
        }
    }
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

export default makeGraphData