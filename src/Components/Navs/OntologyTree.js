import { TreeList, Column } from "devextreme-react/tree-list";
import { useNavigate } from "react-router-dom";

const OntologyTree = (props) => {
    let navigate = useNavigate();

    const onCellClick = (e) => {
        if (!e.data || e.event.target.outerHTML === "<span></span>") return;
        navigate("class/" + e.data.href.split("class_id=")[1] ?? "");
    };

    return (
        <>
            <TreeList
                id="ontology"
                dataSource={props.data}
                showRowLines={false}
                height={600}
                showBorders={false}
                showColumnHeaders={false}
                columnAutoWidth={true}
                onCellClick={onCellClick}
                // onRowExpanded={(e) => console.log(e)}
                // onCellClick={(e) => console.log(e)}
                // onCellClick={(e) => navigate("class/" + e.data.href.split("class_id=")[1] ?? "")}
                itemsExpr="nodes"
                dataStructure="tree"
            >
                <Column dataField="text" />
            </TreeList>
        </>
    );
};
export default OntologyTree;
