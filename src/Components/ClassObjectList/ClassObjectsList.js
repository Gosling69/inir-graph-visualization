import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useParams, Outlet } from "react-router-dom";
import ApiService from "../../Api/Api";
import { useNavigate } from "react-router-dom";
import ListItem from "./ListItem";

const ClassObjectsList = (props) => {
    const [data, setData] = useState({});

    let params = useParams();
    // console.log(params)

    const refresh = async () => {
        ApiService.getClassObjects(params.classId).then((res) => {
            console.log(res);
            setData(res);
        });
    };

    useEffect(() => {
        refresh();
    }, [params.classId]);
    //Add Classname and num of items in header

    return (
        <div id="classObjectList">
            <h2
                style={{ marginBottom: "20px", position: "sticky", top: 0 }}
            >{`Класс ${params.classId.split("#")[1]} (${
                Object.keys(data).length
            })`}</h2>
            <div
                style={{
                    overflowY: "scroll",
                    height: "90%",
                }}
            >
                {Object.entries(data).map(([href, realData], index) => (
                    <ListItem href={href} realData={realData} index={index} />
                ))}
                {/* <Outlet/> */}
            </div>
        </div>
    );
};
export default ClassObjectsList;
