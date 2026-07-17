import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ClearIcon from "@mui/icons-material/Clear";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Button, Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Select,
  MenuItem
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { format, subDays } from "date-fns";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaFilePdf } from "react-icons/fa6";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../../../../componets/loader/Loader";
import usePermissions, {
  hasPermission,
} from "../../../../componets/permission";
import Header from "../../../Header";
import "./PurchaseList";

const columns = [
  { id: "sr_no", label: "Sr.", minWidth: 150 },
  { id: "bill_no", label: "Bill.", minWidth: 150 },
  { id: "bill_date", label: "Date", minWidth: 150 },
  { id: "distributor_name", label: "Distributor", minWidth: 150 },
  { id: "total_amount", label: "Amount", minWidth: 150 },
];

const Purchasebill = () => {
  const token = localStorage.getItem("token");
  const permissions = usePermissions();
  const history = useHistory();

  const [tableData, setTableData] = useState([]);
  const [id, setId] = useState(null);

  const initialSearchTerms = columns.map(() => "");
  const [searchTerms, setSearchTerms] = useState(initialSearchTerms);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [startDate, setStartDate] = useState(subDays(new Date(), 15));
  const [endDate, setEndDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [IsDelete, setIsDelete] = useState(false);
  const [openAddPopUp, setOpenAddPopUp] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [PdfstartDate, setPdfStartDate] = useState(subDays(new Date(), 15));
  const [PdfendDate, setPdfEndDate] = useState(new Date());

  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchTrigger, setSearchTrigger] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  const searchTimeout = React.useRef(null);
  const currentSearchTerms = React.useRef(searchTerms);

  const totalPages = Math.ceil(totalRecords / rowsPerPage);

  useEffect(() => {
    if (tableData.length > 0) {
      localStorage.setItem("Purchase_SrNo", tableData[0].count + 1);
    } else {
      localStorage.setItem("Purchase_SrNoPurchase_SrNo", 1);
    }
  }, [tableData, currentPage, rowsPerPage]);

  useEffect(() => {
    purchaseBillList(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, currentPage, rowsPerPage]);

  // Effect for handling search with debouncing
  useEffect(() => {
    if (searchTrigger > 0) {
      // Clear previous timeout
      clearTimeout(searchTimeout.current);

      // Check if any search term has a value
      const hasSearchTerms = currentSearchTerms.current.some(term => term && term.trim());

      if (!hasSearchTerms) {
        // If no search terms, clear the search immediately
        setIsSearching(false);
        purchaseBillList(1, true);
      } else {
        // Show searching state immediately
        setIsSearching(true);

        // Debounce the search to avoid too many API calls
        searchTimeout.current = setTimeout(() => {
          purchaseBillList(1, true);
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



  const handleClick = (pageNum) => {
    setCurrentPage(pageNum);
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

  const deleteOpen = (id) => {
    setIsDelete(true);
    setId(id);
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
    purchaseBillList(1);
  };

  // Handle search on Enter key press for specific field
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchSubmit();
    }
  };


  // No frontend filtering needed - all search is handled by backend
  const paginatedData = tableData;



  const purchaseBillList = async (page, isSearch = false) => {
    if (!page) return;

    let data = new FormData();
    data.append("start_date", startDate ? format(startDate, "yyyy-MM-dd") : "");
    data.append("from_date", endDate ? format(endDate, "yyyy-MM-dd") : "");
    data.append("page", page);
    data.append("limit", rowsPerPage);

    // Add search parameters when any search term has a value
    currentSearchTerms.current.forEach((term, index) => {
      if (term && term.trim()) {
        const fieldMap = {
          0: "sr_no",
          1: "bill_no",
          2: "bill_date",
          3: "distributor_name",
          4: "total_amount"
        };
        data.append(fieldMap[index], term.trim());
      }
    });

    // Use different loading states for search vs regular operations
    if (isSearch) {
      if (page !== 1) return setCurrentPage(1); // 👈 Ensure `setCurrentPage(1)` happens outside the render cycle
      setIsSearchLoading(true);
    }
    else {
      setIsLoading(true);
    }

    try {
      const response = await axios.post("purches-list?", data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const responseData = response.data.data;

      if (response.data.status === 401) {
        history.push("/");
        localStorage.clear();
        return;
      }

      // Set the table data directly from backend (paginated and filtered data)
      setTableData(responseData || []);

      // Extract and set total count for pagination
      const totalCount = responseData?.length > 0 ? Number(response.data.total_records) : 0;
      setTotalRecords(totalCount);
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
      if (isSearch) {
        if (page !== 1) return setCurrentPage(1); // 👈 Ensure `setCurrentPage(1)` happens outside the render cycle
        setIsSearchLoading(true);
      }
      else {
        setIsLoading(false);
      }
    }
  };

  const handleDeleteItem = async (id) => {
    if (!id) return;
    let data = new FormData();
    data.append("id", id);
    const params = {
      purches_id: id,
    };
    try {
  const response = await axios.post("purches-delete?", data, {
          params: params,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
  });

          setIsDelete(false);

          // Refresh current page after deletion
          purchaseBillList(currentPage);

  toast.dismiss();

  toast.success(response?.data?.message || "Purchase bill deleted successfully");

          if (response.data.status === 401) {
            history.push("/");
            localStorage.clear();
          }
    } catch (error) {
      console.error("API error:", error);

  toast.dismiss();
  toast.error(error?.response?.data?.message || "Something went wrong");

      if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
    }
  };

  const pdfGenerator = async (id) => {
    let data = new FormData();
    data.append("id", id);
    setIsPdfLoading(true);
    try {
      await axios
        .post("purches-pdf-downloads", data, {
          params: { id },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const PDFURL = response.data.data.pdf_url;
          toast.dismiss();
          toast.success(response.data.meassage);

          setIsPdfLoading(false);
          handlePdf(PDFURL);
          if (response.data.status === 401) {
            history.push("/");
            localStorage.clear();
          }
        });
    } catch (error) {
      console.error("API error:", error);
      setIsPdfLoading(false);
      if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
    }
  };

  const handlePdf = (url) => {
    if (typeof url === "string") {
      // Open the PDF in a new tab
      window.open(url, "_blank");
    } else {
      console.error("Invalid URL for the PDF");
    }
  };

  const AllPDFGenerate = async () => {

    setOpenAddPopUp(false);

    let data = new FormData();
    data.append(
      "start_date",
      PdfstartDate ? format(PdfstartDate, "yyyy-MM-dd") : ""
    );
    data.append("end_date", PdfendDate ? format(PdfendDate, "yyyy-MM-dd") : "");

    setIsPdfLoading(true);
    try {
      await axios
        .post("multiple-purches-pdf-downloads", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const PDFURL = response.data.data.pdf_url;
          toast.dismiss();
          toast.success(response.data.meassage);
          setIsPdfLoading(false);
          handlePdf(PDFURL);
          if (response.data.status === 401) {
            history.push("/");
            localStorage.clear();
          }
        });
    } catch (error) {
      console.error("API error:", error);
      setIsPdfLoading(false);
      if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
    }
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

      <div
        style={{
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        <div style={{ flex: 1, overflowY: 'auto', }}>

          <div className="px-4 py-3 ">
            <div
              className="sales_hdr_mn"
              style={{ display: "flex", gap: "4px", marginBottom: "15px" }}
            >
              <div
                className="flex flex-row sale_list_pg"
                style={{ display: "flex", gap: "4px", alignItems: "center" }}
              >
                <div
                  className="flex flex-row gap-2 sale_lt_txt"
                  style={{ alignItems: "center" }}
                >
                  <span
                    style={{
                      color: "var(--color2)",
                      display: "flex",
                      alignItems: "center",
                      fontWeight: 700,
                      fontSize: "20px",
                    }}
                    onClick={() => {
                      history.push("/purchase");
                    }}
                  >
                    Purchase
                  </span>
                  <div>
                    <ArrowForwardIosIcon
                      style={{
                        fontSize: "20px",
                        color: "var(--color1)",
                      }}
                    />
                  </div>
                </div>
                {hasPermission(permissions, "purchase bill create") && (
                  <>
                    <Button
                      variant="contained"
                      className="sale_add_btn gap-2"
                      size="small"
                      style={{ background: "var(--color1)", fontSize: "12px" }}
                      onClick={() => {
                        history.push("/purchaseAdd");
                      }}
                    >
                      <AddIcon />
                      New
                    </Button>
                  </>
                )}
              </div>
              <div className="headerList">
                <Button
                  variant="contained"
                  className="sale_add_pdf"
                  style={{ background: "var(--color1)", minWidth: 130 }}
                  disabled={isPdfLoading}
                  onClick={() => {
                    setOpenAddPopUp(true);
                  }}
                >
                  {isPdfLoading ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 ,color:"#fff",textColor:"#fff"}}>
                      <CircularProgress size={16} style={{ color: "white" }} />
                      Generating...
                    </span>
                  ) : (
                    "Generate PDF"
                  )}
                </Button>
              </div>
            </div>
            <div
              className="row border-b px-4 border-dashed"
              style={{ borderColor: "var(--color2)" }}
            ></div>
          </div>

          <div className="firstrow px-4" >
            <div className="oreder_list_fld flex flex-col gap-2 md:flex-row lg:flex-row ">
              <div className="detail flex flex-col">
                <span className="text-gray-500 block">Start Date</span>
                <div className="" style={{ width: "100%" }}>
                  <DatePicker
                    className="custom-datepicker"
                    selected={startDate}
                    onChange={(newDate) => setStartDate(newDate)}
                    dateFormat="dd/MM/yyyy"
                  />
                </div>
              </div>
              <div className="detail flex flex-col">
                <span className="text-gray-500 block">End Date</span>
                <div className="" style={{ width: "100%" }}>
                  <DatePicker
                    className="custom-datepicker"
                    selected={endDate}
                    onChange={(newDate) => setEndDate(newDate)}
                    dateFormat="dd/MM/yyyy"
                  />
                </div>
              </div>
              <div
                className=""
                style={{
                  display: "flex",
                  alignItems: "end",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  variant="contained"
                  className=""
                  size="small"
                  style={{
                    minHeight: "38px",
                    alignItems: "center",
                    background: "var(--color1)",
                  }}
                  onClick={() => purchaseBillList(currentPage)}
                >
                  <FilterAltIcon
                    size="large"
                    style={{ color: "white", fontSize: "20px" }}
                  />
                  Filter
                </Button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto mt-4 px-4 py-3 " style={{ overflowX: 'auto', width: '100%' }}>
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
                  <th style={{ minWidth: 150, padding: '8px' }}>Sr. No</th>
                  {columns.slice(1).map((column, index) => (
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
                            sx={{ marginLeft: '4px', minWidth: '100px', maxWidth: '250px', }}
                            value={searchTerms[index + 1]}
                            onChange={(e) => handleSearchChange(index + 1, e.target.value)}
                            onKeyDown={handleKeyDown}
                          />
                        </div>
                      </div>

                    </th>
                  ))}
                  <th style={{ minWidth: 120, padding: '8px' }}>Action</th>
                </tr>
              </thead>
              {isLoading ? (
                <div className="loader-container ">
                  <Loader />
                </div>
              ) : (
                <tbody style={{ background: "#3f621217" }}>
                  {paginatedData.length === 0 ? (
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
                    paginatedData.map((row) => (
                      <tr
                        className="cursor-pointer hover:bg-gray-100"
                        key={row.code}
                      >
                        {/* <td>{startIndex + index}</td> */}

                        {columns.map((column, colIndex) => {
                          const value = row[column.id];
                          return (
                            <td
                              style={
                                colIndex === 0
                                  ? { borderRadius: "10px 0 0 10px" }
                                  : colIndex === columns.length
                                    ? { borderRadius: "0 10px 10px 0" }
                                    : {}
                              }
                              key={column.id}
                              className="capitalize"
                              onClick={() =>
                                history.push(`/purchaseView/${row.id}`)
                              }
                            >
                              {column.format && typeof value === "number"
                                ? column.format(value)
                                : value}
                            </td>
                          );
                        })}
                        <td style={{ borderRadius: "0 10px 10px 0" }}>
                          <div className="flex gap-2 items-center">
                            <VisibilityIcon
                              className="cursor-pointer primary hover:secondary"
                              onClick={() =>
                                history.push(`/purchaseView/${row.id}`)
                              }
                            />
                            <FaFilePdf
                              className=" primary hover:secondary"
                              onClick={() => pdfGenerator(row.id)}
                            />
                            {hasPermission(
                              permissions,
                              "purchase bill delete"
                            ) && (
                                <DeleteIcon
                                  style={{ color: "#F31C1C" }}
                                  className="cursor-pointer "
                                  onClick={() => deleteOpen(row.id)}
                                />
                              )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>)}
            </table>
          </div>
        </div>

        {/*<=============================================================== pagination ===============================================================> */}

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '16px' }}>
            <span className="primary font-semibold" style={{ fontSize: '14px' }}>Rows per page:</span>
            <Select
              value={rowsPerPage}
              onChange={(e) => {
                const newRows = parseInt(e.target.value, 10);
                setRowsPerPage(newRows);
                setCurrentPage(1);
              }}
              size="small"
              sx={{
                height: '32px',
                borderRadius: '6px',
                color: 'var(--color1)',
                fontWeight: 'bold',
                fontFamily: 'inherit',
                fontSize: '14px',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--color2) !important',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--color2) !important',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--color1) !important',
                },
                '& .MuiSelect-select': {
                  paddingY: '4px',
                  paddingLeft: '12px',
                  paddingRight: '32px !important',
                  display: 'flex',
                  alignItems: 'center',
                }
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    '& .MuiMenuItem-root': {
                      fontFamily: 'inherit',
                      fontSize: '14px',
                      color: 'var(--color1)',
                      '&.Mui-selected': {
                        backgroundColor: 'var(--color1) !important',
                        color: 'white !important',
                      },
                      '&.Mui-selected:hover': {
                        backgroundColor: 'var(--color1) !important',
                        color: 'white !important',
                      },
                      '&:hover': {
                        backgroundColor: 'rgba(98, 138, 47, 0.1) !important',
                        color: 'var(--color1) !important',
                      }
                    }
                  }
                }
              }}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
          </div>
        </div>
      </div>


      {/*<======================================================= Delete Popup =======================================================> */}

      <div
        id="modal"
        value={IsDelete}
        className={`fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif] ${IsDelete ? "block" : "hidden"
          }`}
      >
        <div />
        <div className="w-full max-w-md bg-white shadow-lg rounded-md p-4 relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 cursor-pointer absolute top-4 right-4 fill-current text-gray-600 hover:text-red-500 "
            viewBox="0 0 24 24"
            onClick={() => setIsDelete(false)}
          >
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z" />
          </svg>
          <div className="my-4 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 fill-red-500 inline"
              viewBox="0 0 24 24"
            >
              <path
                d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
                data-original="#000000"
              />
              <path
                d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
                data-original="#000000"
              />
            </svg>
            <h4 className="text-lg font-semibold mt-6">
              Are you sure you want to delete it?
            </h4>
          </div>
          <div className="flex gap-5 justify-center">
            <button
              type="submit"
              className="px-6 py-2.5 w-44 items-center rounded-md text-white text-sm font-semibold border-none outline-none bg-red-500 hover:bg-red-600 active:bg-red-500"
              onClick={() => handleDeleteItem(id)}
            >
              Delete
            </button>
            <button
              type="button"
              className="px-6 py-2.5 w-44 rounded-md text-black text-sm font-semibold border-none outline-none bg-gray-200 hover:bg-gray-900 hover:text-white"
              onClick={() => setIsDelete(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      {/*<============================================================ Generate PDF ============================================================> */}

      <Dialog
        open={openAddPopUp}
        className="order_list_ml custom-dialog"
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: "50%",
              height: "50%",
              maxWidth: "500px",
              maxHeight: "80vh",
              overflowY: "auto",
            },
          },
        }}
      >
        <DialogTitle
          id="alert-dialog-title"
          style={{ fontWeight: 700 }}
        >
          Generate PDF
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => {
            setOpenAddPopUp(false);
          }}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "#ffffff",
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div
              className="flex"
              style={{ flexDirection: "column", gap: "19px" }}
            >
              <div className="flex gap-10">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div className="flex flex-col md:flex-row w-full h-full gap-2">
                      <div style={{ width: "100%" }}>
                        <span className="primary block">Start Date</span>
                        <div style={{ width: "100%" }}>
                          <DatePicker
                            className="custom-datepicker text-black"
                            selected={PdfstartDate}
                            onChange={(newDate) => setPdfStartDate(newDate)}
                            dateFormat="dd/MM/yyyy"
                            autoFocus
                          />
                        </div>
                      </div>
                      <div className="" style={{ width: "100%" }}>
                        <span className="primary block">End Date</span>
                        <div style={{ width: "100%" }}>
                          <DatePicker
                            className="custom-datepicker text-black"
                            selected={PdfendDate}
                            onChange={(newDate) => setPdfEndDate(newDate)}
                            dateFormat="dd/MM/yyyy"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ padding: "20px 24px" }}>
          <Button
            autoFocus
            variant="contained"
            className="p-5"
            color="success"
            onClick={() => {
              AllPDFGenerate();
            }}
          >
            generate
          </Button>
          <Button
            autoFocus
            variant="contained"
            onClick={() => {
              setOpenAddPopUp(false);
            }}
            color="error"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Purchasebill;