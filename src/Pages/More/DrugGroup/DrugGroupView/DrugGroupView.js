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
                    {/* <div className="p-3"
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
                    </div> */}



                    <div className="scroll-wrapper">
                        <div
                            className="firstrow"
                            style={{
                                display: "flex",
                                alignItems: "stretch",
                                marginTop: "0.5rem",
                                background: "#E0E3DC",
                                border: "1px solid #e7ebe0",
                                borderRadius: "12px",
                                boxShadow:
                                    "0 1px 2px rgba(15,23,42,0.04), 0 8px 24px -12px rgba(63,98,18,0.15)",
                                overflow: "hidden",
                                position: "relative",
                            }}
                        >
                            {/* Left accent */}
                            <div
                                style={{
                                    width: "5px",
                                    background: "linear-gradient(180deg, #3f6212 0%, #65a30d 50%, #84cc16 100%)",
                                    flexShrink: 0,
                                }}
                            />
                            {/* Fields */}
                            <div
                                style={{
                                    flex: 1,
                                    display: "grid",
                                    gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
                                    alignItems: "center",
                                }}
                            >
                                {[
                                    { label: "Drug Group Name", value: drugGroupData },
                                    { label: "Total Items", value: drugGroupItems.length },
                                ].map((item, idx, arr) => (
                                    <div
                                        key={item.label}
                                        className="detail_main"
                                        style={{
                                            minWidth: 0,
                                            padding: "12px 16px",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            gap: "4px",
                                            borderRight: idx < arr.length - 1 ? "1px solid #7c8d66" : "none",
                                            position: "relative",
                                        }}
                                    >
                                        <span
                                            className="heading"
                                            style={{
                                                fontSize: "14px",
                                                fontWeight: 700,
                                                color: "#3f6212",
                                                letterSpacing: "0.01em",
                                            }}
                                        >
                                            {item.label}
                                        </span>

                                        {item.pill ? (
                                            <span
                                                style={{
                                                    alignSelf: "flex-start",
                                                    fontSize: "0.78rem",
                                                    fontWeight: 600,
                                                    color: "#3f6212",
                                                    background: "#ecfccb",
                                                    border: "1px solid #d9f99d",
                                                    padding: "2px 10px",
                                                    borderRadius: "999px",
                                                    textTransform: "capitalize",
                                                    whiteSpace: "nowrap",
                                                    maxWidth: "100%",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                }}
                                                title={String(item.value ?? "")}
                                            >
                                                {item.value}
                                            </span>
                                        ) : (
                                            <span
                                                className="data"
                                                style={{
                                                    fontSize: "15px",
                                                    fontWeight: 600,
                                                    color: item.accent || "#000000",

                                                    textTransform: item.cap ? "capitalize" : "none",
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    letterSpacing: item.mono ? "-0.01em" : "normal",
                                                }}
                                                title={String(item.value ?? "")}
                                            >
                                                {item.value || "—"}
                                            </span>
                                        )}
                                    </div>
                                ))}
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