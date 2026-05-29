import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import Header from "../../../Header";
import Loader from "../../../../componets/loader/Loader";
import { TablePagination } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { toast, ToastContainer } from "react-toastify";

const DrugGroupView = () => {
    const { id } = useParams();
    const history = useHistory();
    const token = localStorage.getItem("token");

    const [drugGroupItems, setDrugGroupItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [drugGroupData, setDrugGroupData] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const columns = [
        { id: "Item_name", label: "Item Name", minWidth: 170 },
        { id: "company_name", label: "Company Name", minWidth: 100 },
        { id: "stock", label: "Stock", minWidth: 100 },
    ];

    useEffect(() => {
        if (id) {
            fetchDrugGroupItems();
        }
    }, [id]);

    const fetchDrugGroupItems = async () => {
        try {
            setIsLoading(true);
            const params = {
                id: id,
            };

            const response = await axios.post("drug-item", {}, {
                params: params,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.status === 200) {
                setDrugGroupItems(response.data.data);

                // Set drug group data - you might need to adjust this based on your API response
                setDrugGroupData(response?.data?.drug_group_name);
            }
        } catch (error) {
            console.error("API error:", error);
            toast.dismiss();
            toast.error("Failed to fetch drug group items");
               if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <div>
            <Header />
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

            {isLoading ? (
                <Loader />
            ) : (
                <div className="p-6">
                    {/* Breadcrumb Navigation */}
                    <div
                        className="mb-4"
                        style={{ display: "flex", gap: "4px", alignItems: "center" }}
                    >
                        <span
                            style={{
                                color: "var(--color2)",
                                display: "flex",
                                alignItems: "center",
                                fontWeight: 700,
                                fontSize: "20px",
                            }}
                            className="cursor-pointer cust_header_txt_main"
                            onClick={() => {
                                history.push("/drugGroup"); // Adjust path as needed
                            }}
                        >
                            Drug Groups
                        </span>
                        <ArrowForwardIosIcon
                            className="cust_header_txt"
                            style={{
                                fontSize: "20px",
                                color: "var(--color1)",
                            }}
                        />
                        <span
                            className="cust_header_txt"
                            style={{
                                color: "var(--color1)",
                                display: "flex",
                                alignItems: "center",
                                fontWeight: 700,
                                fontSize: "20px",
                            }}
                        >
                            View
                        </span>
                        <ArrowForwardIosIcon
                            className="cust_header_txt"
                            style={{
                                fontSize: "20px",
                                color: "var(--color1)",
                            }}
                        />
                        <span
                            className="cust_header_txt"
                            style={{
                                color: "var(--color1)",
                                display: "flex",
                                alignItems: "center",
                                fontWeight: 700,
                                fontSize: "20px",
                            }}
                        >
                            {drugGroupData.toString().slice(0, 100) + (drugGroupData.toString().length > 100 ? "..." : "")}
                        </span>
                    </div>

                    {/* Drug Group Details Section */}
                    <div className="p-3"
                        style={{
                            backgroundColor: "rgb(63 98 18 / 11%)",
                            borderRadius: "10px",
                        }}
                    >
                        <div
                            className="header_main_txt_CV mt-2 gap-3 "
                            style={{ background: "none" }}
                        >
                            <div className="detail_main_bg_CV">
                                <span className="heading_othr">Drug Group Name</span>
                                <span className="data_bg">
                                    {drugGroupData ? drugGroupData.toString().slice(0, 100) + (drugGroupData.toString().length > 100 ? "..." : "") : "____"}
                                </span>
                            </div>
                            <div className="detail_main_bg_CV">
                                <span className="heading_othr">Total Items</span>
                                <span className="data_bg">
                                    {drugGroupItems.length ? drugGroupItems.length : "0"}
                                </span>
                            </div>
                        </div>
                    </div>


                    <div className="bg-white rounded-lg shadow-sm">
                        {drugGroupItems.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <p>No items found for this drug group.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto mt-4">
                                <table
                                    className="w-full border-collapse custom-table"
                                    style={{
                                        whiteSpace: "nowrap",
                                        borderCollapse: "separate",
                                        borderSpacing: "0 6px",
                                        overflow: "auto",
                                    }}
                                >
                                    <thead>
                                        <tr>
                                            {columns.map((column) => (
                                                <th
                                                    key={column.id}
                                                    style={{ minWidth: column.minWidth }}
                                                >
                                                    {column.label}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody style={{ backgroundColor: "#3f621217" }}>
                                        {drugGroupItems
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((item, index) => (
                                                <tr key={item.id || index}>
                                                    {columns.map((column, colIndex) => (
                                                        <td
                                                            key={column.id}
                                                            style={
                                                                colIndex === 0 // Check if this is the first column
                                                                    ? { borderRadius: "10px 0 0 10px" }
                                                                    : colIndex === columns.length - 1 // Last column for right-side radius
                                                                        ? { borderRadius: "0 10px 10px 0" }
                                                                        : {}
                                                            }
                                                        >
                                                            {item[column.id] || "N/A"}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 12]}
                                    component="div"
                                    count={drugGroupItems.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DrugGroupView;