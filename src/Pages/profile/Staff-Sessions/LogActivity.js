import { useEffect, useState } from "react";
import Loader from "../../../componets/loader/Loader"
import Header from "../../Header"
import ProfileView from "../ProfileView";

import { Box, TablePagination } from "@mui/material";
import { BsLightbulbFill } from "react-icons/bs";
import axios from "axios";

const LogActivity = () => {
    const [isLoading, setIsLoading] = useState(false);

    const [logAllData, setLogAllData] = useState([])
    const token = localStorage.getItem("token");
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [page, setPage] = useState(0);
    const logactivityColumn = [
        // { id: 'UserID', label: 'UserID', minWidth: 100 },
        { id: 'user_name', label: 'UserName', minWidth: 150 },
        { id: 'message', label: 'Meassage', minWidth: 150 },
        { id: 'date_time', label: 'Date/Time', minWidth: 150 },
    ];

    useEffect(() => {
        listOfRolePermission();
    }, []);

    const listOfRolePermission = () => {
        setIsLoading(true)
        const params = {
            page: page + 1,
            limit: rowsPerPage,
        }
        axios.post("logs-activity?", {
            params: params,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                setIsLoading(false)
                setLogAllData(response.data.data);

            })
            .catch((error) => {
                console.error("API error:", error);
   if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
            });
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <>
            <Header />

            {isLoading ? <div className="loader-container ">
                <Loader />
            </div> :
                <div>
                    <Box className="cdd_mn_hdr" sx={{ display: "flex" }}>
                        <ProfileView />
                        <div className="p-8" style={{ width: "100%", minWidth: '50px' }}>
                            <div className="flex justify-between items-center">
                                <div>
                                    <h1 className="text-2xl flex items-center primary font-semibold  p-2 mb-5" style={{ marginBottom: "25px" }} >Log Activity
                                        <BsLightbulbFill className="ml-4 secondary  hover-yellow" />
                                    </h1>
                                </div>
                            </div>

                            <div className="overflow-x-auto border-t pt-4 mt-4" style={{ overflowX: "auto" }}>
                                <table className="w-full border-collapse custom-table" style={{
                                    whiteSpace: "nowrap",
                                    borderCollapse: "separate",
                                    borderSpacing: "0 6px",
                                }}>
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            {logactivityColumn.map((column) => (
                                                <th key={column.id} style={{ minWidth: column.minWidth }}>
                                                    {column.label}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody style={{ background: "#3f621217" }}>
                                        {logAllData?.map((item, index) => (
                                            <tr key={index} >
                                                <td style={{ borderRadius: "10px 0 0 10px" }}>
                                                    {index + 1}</td>
                                                {logactivityColumn.map((column, colIndex) => (
                                                    <>
                                                        <td key={column.id} style={
                                                            colIndex === logactivityColumn.length - 1 ? { borderRadius: '0 10px 10px 0' } : {}
                                                        }
                                                        // style={{
                                                        //     color: (item.status === 'Active' ? 'green' : 'red')
                                                        // }}
                                                        >
                                                            {/* {item.status == 1 ? item.status = 'Active' : item.status == 0 ? item.status = 'Disactive ' :  */}
                                                            {item[column.id]}
                                                            {/* // } */}
                                                        </td>

                                                    </>
                                                ))}

                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <TablePagination
                                rowsPerPageOptions={[5, 10, 12]}
                                component="div"
                                count={logAllData?.[0]?.count}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />

                        </div>
                    </Box >
                </div >
            }
        </>
    )
}
export default LogActivity