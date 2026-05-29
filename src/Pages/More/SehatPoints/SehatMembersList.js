import {
    Alert,
    AlertTitle,
    Button,
    InputAdornment,
    OutlinedInput,
} from "@mui/material";

import { BsLightbulbFill } from "react-icons/bs";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { useEffect, useState, useCallback, useRef } from "react";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import TextField from "@mui/material/TextField";
import axios from "axios";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../../../componets/loader/Loader";
import usePermissions, { hasPermission } from "../../../componets/permission";
import Header from "../../Header";
import AddMemberDialog from "./AddMemberDialog";
import PlanDialog from "./Plandialog";
import MemberView from "./MemberView";

const columns = [
    { id: "name", label: "Name", minWidth: 150 },
    { id: "number", label: "Number", minWidth: 150 },
    { id: "plan_name", label: "Plan", minWidth: 150 },
    { id: "plan_payment_method", label: "Payment", minWidth: 150 },
    { id: "remaining_days", label: "Remaining days", minWidth: 150 },

];

const SehatMembersList = () => {
    const token = localStorage.getItem("token");
    const history = useHistory();
    const permissions = usePermissions();
    const [header, setHeader] = useState("");
    const [tableData, setTableData] = useState([]);
    const rowsPerPage = 10;
    const initialSearchTerms = columns.map(() => "");
    const [searchTerms, setSearchTerms] = useState(initialSearchTerms);
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: "ascending",
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);

    const searchKeys = ["search_name", "search_email", "search_gst", "search_phone_number"];

    // Search state management (copied from PurchaseList.js)
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [searchTrigger, setSearchTrigger] = useState(0);
    const [isSearching, setIsSearching] = useState(false);
    const searchTimeout = useRef(null);
    const currentSearchTerms = useRef(searchTerms);
    const [showPlans, setShowPlans] = useState(false);
    const [addMember, setAddMember] = useState(false);
    const [viewMember, setViewMember] = useState(false);
    const [customerId, setCustomerId] = useState()

    const [planList, setPlanList] = useState([])

    const [memberDetails, setMemberDetails] = useState([])

    /*<======================================================================== Fetch data from API ====================================================================> */

    useEffect(() => {
        getPlanList()
    }, []);

    /*<======================================================================== fetch plan list ====================================================================> */

    const getPlanList = async () => {

        try {
            await axios.get("sehat-membership-plan-list?", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => {
                    setPlanList(response.data.data);
                });
        } catch (error) {
            console.error("API error:", error?.response?.status);
               if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
        }
    };

    /*<======================================================================== Get member detail ====================================================================> */

    const getMember = async (id) => {

        setViewMember(true)
        const data = new FormData();
        data.append("customer_id", id)
        try {
            await axios.post("customer-sehat-membership-plan-view-details?", data, {

                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => {
                    setMemberDetails(response.data.data);
                });
        } catch (error) {
            console.error("API error:", error?.response?.status);
              if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
        }
    };
    /*<======================================================================== fetch plan list ====================================================================> */

    const totalPages = Math.ceil(totalRecords / rowsPerPage);


    useEffect(() => {
        if (currentPage > 0) {
            DistList(currentPage);
        }
    }, [currentPage]);


    // Effect for handling search with debouncing (copied from PurchaseList.js)
    useEffect(() => {
        if (searchTrigger > 0) {
            // Clear previous timeout
            clearTimeout(searchTimeout.current);

            // Check if any search term has a value
            const hasSearchTerms = currentSearchTerms.current.some(term => term && term.trim());

            if (!hasSearchTerms) {
                // If no search terms, clear the search immediately
                setIsSearching(false);
                DistList(1, true);
            } else {
                // Show searching state immediately
                setIsSearching(true);

                // Debounce the search to avoid too many API calls
                searchTimeout.current = setTimeout(() => {
                    DistList(1, true);
                }, 150);
            }
        }
    }, [searchTrigger]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (searchTimeout.current) {
                clearTimeout(searchTimeout.current);
            }
        };
    }, []);




    const handleSearchChange = (index, value) => {
        const newSearchTerms = [...searchTerms];
        newSearchTerms[index] = value;

        // Update ref immediately for API calls
        currentSearchTerms.current = newSearchTerms;

        // Update state immediately for UI responsiveness
        setSearchTerms(newSearchTerms);

        // Check if any search term has a value
        const hasSearchTerms = newSearchTerms.some(term => term && term.trim());
        setIsSearchActive(hasSearchTerms);

        // Reset to page 1 when searching
        setCurrentPage(1);

        // Trigger search effect immediately
        setSearchTrigger(prev => prev + 1);
    };

    // Handle search on Enter key press
    const handleSearchSubmit = () => {
        setCurrentPage(1);
        DistList(1);
    };

    // Handle search on Enter key press for specific field
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSearchSubmit();
        }
    };

    const DistList = async (page) => {
    if (!page) return;

    const params = {
        page: page,
    };

    currentSearchTerms.current.forEach((term, index) => {
        if (term && term.trim()) {
            params[searchKeys[index]] = term.trim();
        }
    });

    setIsSearchLoading(true);

    try {
        const response = await axios.get(
            "customer-sehat-membership-plan-list?",
            {
                params,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.data.status === 401) {
            history.push("/");
            localStorage.clear();
            return;
        }

        setTableData(response.data.data || []);
        setTotalRecords(response.data.total_records || 0);

    } catch (error) {
        console.error("API error:", error);
        setTableData([]);
        setTotalRecords(0);
           if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
    } finally {
        setIsSearchLoading(false);
    }
};


    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleClick = (pageNum) => {
        setCurrentPage(pageNum);
    };
    const sortByColumn = (key) => {
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });

        const sortedData = [...tableData].sort((a, b) => {
            if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
            if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
            return 0;
        });
        setTableData(sortedData);
    };

    return (
        <>
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
                <div className="loader-container ">
                    <Loader />
                </div>
            ) : (
                <div
                    style={{
                        minHeight: 'calc(100vh - 64px)',
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                    }}
                >
                    <div style={{ flex: 1, overflowY: 'auto', width: '100%' }}>
                        <div className="paddin12-8">
                            <div className="px-4 py-3">
                                <div
                                    className="cust_list_main_hdr_bg"
                                    style={{ display: "flex", gap: "4px", marginBottom: "13px" }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "7px",
                                            alignItems: "center",
                                            whiteSpace: "nowrap",
                                        }}
                                        className=""
                                    >
                                        <span
                                            style={{
                                                color: "var(--color1)",
                                                display: "flex",
                                                alignItems: "center",
                                                fontWeight: 700,
                                                fontSize: "20px",
                                                marginRight: "10px",
                                            }}
                                        >
                                            Members List
                                        </span>
                                        <BsLightbulbFill className="w-6 h-6 secondary hover-yellow align-center" />
                                    </div>
                                    <div className="headerList cust_hdr_mn_bg">


                                        <Button
                                            variant="contained"
                                            style={{ background: "var(--color1)", display: "flex" }}
                                            onClick={() => {
                                                setCustomerId(0)
                                                setAddMember(true)

                                            }}
                                            className="gap-2"
                                        >
                                            <AddIcon className="" />
                                            Add Member
                                        </Button>

                                        <Button
                                            variant="contained"
                                            style={{ background: "var(--color1)", display: "flex" }}
                                            onClick={() => { setShowPlans(true) }}
                                            className="gap-2"
                                        >
                                            <VisibilityIcon

                                            />
                                            View Plan
                                        </Button>
                                    </div>
                                </div>
                                <div
                                    className="row border-b px-4 border-dashed"
                                    style={{ borderColor: "var(--color2)" }}
                                ></div>
                            </div>
                            {/*<====================================================================== table  =====================================================================> */}

                            <div className=" firstrow px-4 ">
                                <div className="overflow-x-auto">
                                    <table
                                        className="w-full border-collapse custom-table"
                                        style={{
                                            whiteSpace: "nowrap",
                                            borderCollapse: "separate",
                                            borderSpacing: "0 6px",
                                        }}
                                    >
                                        <thead>
                                            <tr>
                                                <th style={{ minWidth: 150, padding: '8px' }}>SR. No</th>
                                                {columns.map((column, index) => (
                                                    <th key={column.id} style={{ minWidth: column.minWidth, padding: '8px' }}>
                                                        <div className="headerStyle" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                                                            <span>{column.label}</span>
                                                            <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                                                                <SwapVertIcon
                                                                    style={{ cursor: 'pointer' }}
                                                                    onClick={() => sortByColumn(column.id)}
                                                                />
                                                                <TextField
                                                                    autoComplete="off"
                                                                    label="Type Here"
                                                                    id="filled-basic"
                                                                    size="small"
                                                                    sx={{ flex: 1, marginLeft: '4px', minWidth: '100px', maxWidth: '250px' }}
                                                                    value={searchTerms[index]}
                                                                    onChange={(e) => handleSearchChange(index, e.target.value)}
                                                                    onKeyDown={handleKeyDown}
                                                                    InputProps={{
                                                                        endAdornment: searchTerms[index] && (
                                                                            <IconButton
                                                                                size="small"
                                                                                onClick={() => handleSearchChange(index, '')}
                                                                                sx={{ padding: 0 }}
                                                                            >
                                                                                <CloseIcon fontSize="small" />
                                                                            </IconButton>
                                                                        ),
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </th>
                                                ))}
                                                <th style={{ minWidth: 120, padding: '8px' }}>Action</th>
                                            </tr>
                                        </thead>
                                        {isSearchLoading ? (
                                            <div className="loader-container ">
                                                <Loader />
                                            </div>
                                        ) : (
                                            <tbody style={{ background: "#3f621217" }}>
                                                {tableData.length === 0 ? (
                                                    <tr>
                                                        <td
                                                            colSpan={columns.length + 1}
                                                            className="text-center text-gray-500"
                                                            style={{ borderRadius: "10px 10px 10px 10px" }}
                                                        >
                                                            No data found
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    tableData.map((row, index) => (
                                                        <tr
                                                            className="bg-[#f5f8f3] align-middle"
                                                            key={row.code}
                                                        >
                                                            <td className="rounded-l-[10px] px-4 py-2 font-semibold text-center">
                                                                {((currentPage - 1) * rowsPerPage) + index + 1}
                                                            </td>

                                                            {columns.map((column, colIndex) => {
                                                                let value = row[column.id];
                                                                if (column.id === "email") {
                                                                    if (value && value[0] !== value[0].toLowerCase()) {
                                                                        value = value.toLowerCase();
                                                                    }
                                                                }
                                                                // Remove right border radius from last data cell
                                                                const tdClass =
                                                                    "px-4 py-2 font-semibold text-center";
                                                                return (
                                                                    <td
                                                                        style={{
                                                                            textTransform: column.id === "email" ? "none" : "uppercase",
                                                                        }}
                                                                        key={column.id}
                                                                        className={`capitalize ${tdClass}`}
                                                               
                                                                    >
                                                                        {column.format && typeof value === "number"
                                                                            ? column.format(value)
                                                                            : value}
                                                                    </td>
                                                                );
                                                            })}
                                                            <td className="rounded-r-[10px] px-4 py-2 text-center">
                                                                <div
                                                                    className="px-2 flex gap-2 items-center justify-center"
                                                                    style={{ height: "100%" }}
                                                                >
                                                                    <VisibilityIcon
                                                                        style={{ color: "var(--color1)", cursor: "pointer" }}
                                                                        onClick={() => { getMember(row?.id) }}
                                                                    />
                                                                    <BorderColorIcon
                                                                        style={{ color: "var(--color1)", cursor: "pointer" }}
                                                                        onClick={() => {

                                                                            setCustomerId(row?.id)
                                                                            setAddMember(true)

                                                                        }}
                                                                    />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>)}
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*<====================================================================== pagination  =====================================================================> */}

                    <div
                        className="flex justify-center mt-4"
                        style={{
                            marginTop: 'auto',
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '1rem',
                        }}
                    >
                        <button
                            onClick={handlePrevious}
                            className={`mx-1 px-3 py-1 rounded ${currentPage === 1
                                ? "bg-gray-200 text-gray-700"
                                : "secondary-bg text-white"
                                }`}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        {currentPage > 2 && (
                            <button
                                onClick={() => handleClick(currentPage - 2)}
                                className="mx-1 px-3 py-1 rounded bg-gray-200 text-gray-700"
                            >
                                {currentPage - 2}
                            </button>
                        )}
                        {currentPage > 1 && (
                            <button
                                onClick={() => handleClick(currentPage - 1)}
                                className="mx-1 px-3 py-1 rounded bg-gray-200 text-gray-700"
                            >
                                {currentPage - 1}
                            </button>
                        )}
                        <button
                            onClick={() => handleClick(currentPage)}
                            className="mx-1 px-3 py-1 rounded secondary-bg text-white"
                        >
                            {currentPage}
                        </button>
                        {currentPage < totalPages && (
                            <button
                                onClick={() => handleClick(currentPage + 1)}
                                className="mx-1 px-3 py-1 rounded bg-gray-200 text-gray-700"
                            >
                                {currentPage + 1}
                            </button>
                        )}
                        <button
                            onClick={handleNext}
                            className={`mx-1 px-3 py-1 rounded ${currentPage >= totalPages
                                ? "bg-gray-200 text-gray-700"
                                : "secondary-bg text-white"
                                }`}
                            disabled={currentPage >= totalPages}
                        >
                            Next
                        </button>
                    </div>

                </div>
            )}

            {addMember && <AddMemberDialog addMember={addMember} setAddMember={setAddMember} customerId={customerId} />}
            {showPlans && <PlanDialog showPlans={showPlans} setShowPlans={setShowPlans} plans={planList} setAddMember={setAddMember} />}
            {viewMember && <MemberView viewMember={viewMember} setViewMember={setViewMember} memberDetails={memberDetails} />}
            
        </>
    );
};

export default SehatMembersList;
