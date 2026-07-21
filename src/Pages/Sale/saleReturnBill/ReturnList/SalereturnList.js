import CircularProgress from "@mui/material/CircularProgress";
import Header from "../../../Header";
import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import DatePicker from "react-datepicker";
import { BsLightbulbFill } from "react-icons/bs";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import Loader from "../../../../componets/loader/Loader";
import usePermissions, {
  hasPermission,
} from "../../../../componets/permission";
import { FaFilePdf } from "react-icons/fa6";
import { toast } from "react-toastify";
import { format, subDays } from "date-fns";
import CloseIcon from "@mui/icons-material/Close";

const columns = [
  { id: "bill_no", label: "Bill No", minWidth: 150 },
  { id: "bill_date", label: "Bill Date", minWidth: 150 },
  { id: "customer_info", label: "Customer Info", minWidth: 200 }, // You can keep as is
  { id: "payment_name", label: "Payment Mode", minWidth: 150 },
  { id: "net_amount", label: "Bill Amount", minWidth: 150 },
];

// Only these fields are searchable (id to API param mapping)
const searchKeys = {
  bill_no: "bill_no",
  customer_info: "customer_name", // Adjust if your API expects something else
  net_amount: "bill_amount",
};


const SalereturnList = () => {
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloadLoading, setIsDownloadLoading] = useState(false);
  const history = useHistory();
  const [tableData, setTableData] = useState([]);
  const permissions = usePermissions();
  const rowsPerPage = 10; // Changed from 1 to 10 for proper pagination
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [IsDelete, setIsDelete] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0); // Added for server-side pagination
  const totalPages = Math.ceil(totalRecords / rowsPerPage);
  // Remove client-side pagination slice since API handles pagination
  const paginatedData = tableData;
  const [PdfstartDate, setPdfStartDate] = useState(subDays(new Date(), 15));
  const [PdfendDate, setPdfEndDate] = useState(new Date());
  const [openAddPopUp, setOpenAddPopUp] = useState(false);

  const options = ["Option 1", "Option 2", "Option 3"];
  const startIndex = (currentPage - 1) * rowsPerPage + 1;
  const [saleId, setSaleId] = useState(null);

  const initialSearchTerms = columns.map(() => "");
  const [searchTerms, setSearchTerms] = useState(initialSearchTerms);
  const [searchTrigger, setSearchTrigger] = useState(0);
  const searchTimeout = useRef(null);
  const currentSearchTerms = useRef(searchTerms);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [openStartCalendar, setOpenStartCalendar] = useState(false);


  useEffect(() => {
    saleReturnBillList(currentPage); // Always call with currentPage
    // eslint-disable-next-line
  }, [currentPage]);

  // Fixed dependency array to prevent infinite loops

  useEffect(() => {
    if (searchTrigger > 0) {
      clearTimeout(searchTimeout.current);

      const hasSearchTerms = currentSearchTerms.current.some(term => String(term).trim() !== '');
      if (!hasSearchTerms) {
        saleReturnBillList(1, true);
      } else {
        searchTimeout.current = setTimeout(() => {
          saleReturnBillList(1, true);
        }, 200);
      }
    }
  }, [searchTrigger]);

  useEffect(() => () => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
  }, []);

  useEffect(() => {
    if (openAddPopUp) {
      setOpenStartCalendar(true);
    }
  }, [openAddPopUp]);


  const saleReturnBillList = async (page = 1, isSearch = false) => {
    setIsSearchLoading(isSearch);
    setIsLoading(true)
    let data = new FormData();
    data.append("page", page);
    data.append("per_page", rowsPerPage);

    // Search params
    columns.forEach((column, index) => {
      const value = String(currentSearchTerms.current[index] || '').trim();
      const apiKey = searchKeys[column.id];
      if (apiKey && value) data.append(apiKey, value);
    });

    try {
      const response = await axios.post("sales-return-list", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTableData(response.data.data || []);
      setTotalRecords(Number(response.data.total_records) || 0);
      setCurrentPage(page);
      setIsSearchLoading(false);
      localStorage.setItem(
        "SaleRetunBillNo",
        (response.data.total || response.data.data?.length || 0) + 1
      );
    } catch (error) {
      setIsSearchLoading(false);
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
      setIsLoading(false)

    }
  };


  const handleClick = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages && pageNum !== currentPage) {
      setCurrentPage(pageNum); // REMOVE direct API call
    }
  };
  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };


  const deleteOpen = (id) => {
    setIsDelete(true);
    setSaleId(id);
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
    currentSearchTerms.current = newSearchTerms;
    setSearchTerms(newSearchTerms);
    setCurrentPage(1);
    setSearchTrigger(prev => prev + 1);
  };


  // Apply filtering to server-paginated data
  const filteredList = tableData.filter((row) => {
    const billNo = row.bill_no ? row.bill_no.toLowerCase() : "";
    const billDate = row.bill_date ? row.bill_date.toLowerCase() : "";
    const customerName = row.customer_name
      ? row.customer_name.toLowerCase()
      : "";
    const mobileNumber = String(row.phone_number || "").toLowerCase(); // Added null check
    const paymentName = row.payment_name ? row.payment_name.toLowerCase() : "";
    const netAmt = String(row.net_amount || "").toLowerCase(); // Added null check

    const billNoSearchTerm = searchTerms[0]
      ? String(searchTerms[0]).toLowerCase()
      : "";
    const billDateSearchTerm = searchTerms[1]
      ? String(searchTerms[1]).toLowerCase()
      : "";
    const customerSearchTerm = searchTerms[2] ? searchTerms[2].toLowerCase() : ""; // Fixed null check
    const paymentSearchTerm = searchTerms[3]
      ? searchTerms[3].toLowerCase()
      : "";
    const netAmtSearchTerm = searchTerms[4]
      ? String(searchTerms[4]).toLowerCase()
      : "";

    return (
      (billNo.includes(billNoSearchTerm) || billNoSearchTerm === "") &&
      (billDate.includes(billDateSearchTerm) || billDateSearchTerm === "") &&
      ((customerName.includes(customerSearchTerm) ||
        mobileNumber.includes(customerSearchTerm)) || customerSearchTerm === "") && // Fixed logic
      (paymentName.includes(paymentSearchTerm) || paymentSearchTerm === "") &&
      (netAmt.includes(netAmtSearchTerm) || netAmtSearchTerm === "")
    );
  });

  const goIntoAdd = () => {
    history.push("/saleReturnAdd");
  };

  const AllPDFGenerate = async () => {
    let data = new FormData();
    data.append(
      "start_date",
      PdfstartDate ? format(PdfstartDate, "yyyy-MM-dd") : ""
    );
    data.append("end_date", PdfendDate ? format(PdfendDate, "yyyy-MM-dd") : "");

    setIsDownloadLoading(true);
    try {
      await axios
        .post("sale-return-multiple-pdf-downloads", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const PDFURL = response.data.data.pdf_url;
          toast.dismiss();
          toast.success(response.data.meassage);
          setOpenAddPopUp(false);
          setIsDownloadLoading(false);
          handlePdf(PDFURL);
        });
    } catch (error) {
      console.error("API error:", error);
      setIsDownloadLoading(false);
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
    setIsDownloadLoading(true);
    try {
      await axios
        .post("sale-return-pdf-downloads", data, {
          params: { id },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const PDFURL = response.data.data.pdf_url;
          toast.dismiss();
          toast.success(response.data.meassage);
          setIsDownloadLoading(false);
          handlePdf(PDFURL);
        });
    } catch (error) {
      console.error("API error:", error);
      setIsDownloadLoading(false);
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

  return (
    <>

      <Header />
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
            <div className="p-6">

              <div
                className=" mb-4 sales_RTN_hdr_mn"
                style={{ display: "flex", gap: "4px" }}
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
                        whiteSpace: "nowrap",
                      }}
                    >
                      Sales Return
                    </span>
                    <div>
                      <ArrowForwardIosIcon
                        style={{ fontSize: "18px", color: "var(--color1)" }}
                      />
                    </div>
                  </div>
                  {hasPermission(permissions, "sale return bill create") && (
                    <>
                      <Button
                        variant="contained"
                        size="small"
                        className="sale_add_btn gap-2"
                        style={{
                          backgroundColor: "var(--color1)",
                          fontSize: "12px",
                          marginLeft: "5px",
                        }}
                        onClick={goIntoAdd}
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
                    style={{ background: "var(--color1)", color: "white" }}
                    disabled={isDownloadLoading}
                    onClick={() => {
                      setOpenAddPopUp(true);
                    }}
                  >
                    {isDownloadLoading ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6, color:"#fff" }}>
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
                className="row border-b border-dashed"
                style={{ borderColor: "var(--color2)" }}
              ></div>
              <div className="firstrow ">
                <div className="overflow-x-auto">
                  {isLoading ? (
                    <div className="loader-container ">
                      <Loader />
                    </div>
                  ) : (
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
                          <th>SR. No</th>
                          {columns.map((column, index) => (
                            <th key={column.id} style={{ minWidth: column.minWidth }}>
                              <div className="headerStyle">
                                <span>{column.label}</span>
                                <SwapVertIcon
                                  style={{ cursor: "pointer" }}
                                  onClick={() => sortByColumn(column.id)}
                                />
                                {/* Only show search for searchable columns */}
                                {searchKeys[column.id] && (
                                  <TextField
                                    autoComplete="off"
                                    label="Type Here"
                                    id="filled-basic"
                                    size="small"
                                    sx={{ width: "150px" }}
                                    value={searchTerms[index]}
                                    onChange={(e) =>
                                      handleSearchChange(index, e.target.value)
                                    }
                                  />
                                )}
                              </div>
                            </th>
                          ))}
                          <th>Action</th>
                        </tr>
                      </thead>

                      <tbody style={{ background: "#3f621217" }}>
                        {isSearchLoading ? (
                          <tr>
                            <td colSpan={columns.length + 2} style={{ textAlign: 'center', padding: '20px' }}>
                              <Loader />
                            </td>
                          </tr>
                        ) : tableData.length === 0 ? (
                          <tr>
                            <td colSpan={columns.length + 2} style={{ textAlign: "center", color: "gray" }}>
<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px', width: '100%' }}>
  <img src="/no-data.png" alt="No Items Available" style={{ maxWidth: '300px', height: 'auto' }} />
</div>
</td>
                          </tr>
                        ) : (
                          tableData.map((row, index) => (
                            <tr
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={row.code}
                            >
                              <td style={{ borderRadius: "10px 0 0 10px" }}>
                                {startIndex + index}
                              </td>
                              {columns.map((column) => {
                                if (column.id === "customer_info") {
                                  const name = row.customer_name
                                    ? row.customer_name
                                    : "";
                                  const mobileNumber = row.phone_number
                                    ? row.phone_number
                                    : "";
                                  return (
                                    <td
                                      key={column.id}
                                      onClick={() => {
                                        history.push(
                                          "/SaleReturnView/" + row.id
                                        );
                                      }}
                                    >
                                      {name && mobileNumber
                                        ? `${name} / ${mobileNumber}`
                                        : name || mobileNumber || "-"}
                                    </td>
                                  );
                                } else {
                                  return (
                                    <td
                                      key={column.id}
                                      onClick={() => {
                                        history.push(
                                          "/SaleReturnView/" + row.id
                                        );
                                      }}
                                    >
                                      {row[column.id]}
                                    </td>
                                  );
                                }
                              })}
                              <td style={{ borderRadius: "0 10px 10px 0" }}>
                                <div className="flex gap-5 justify-center">
                                  <VisibilityIcon
                                    sx={{
                                      color: "#2563eb",
                                      cursor: "pointer",
                                      "&:hover": {
                                        color: "#1d4ed8",
                                      },
                                    }}
                                    onClick={() => {
                                      history.push(`/SaleReturnView/${row.id}`);
                                    }}
                                  />
                                  <FaFilePdf
                                    className="w-5 h-5 primary"
                                    onClick={() => pdfGenerator(row.id)}
                                  />
                                </div>
                              </td>
                            </tr>
                          ))
                        )}

                      </tbody>
                    </table>)}
                </div>
              </div>
            </div>

          </div>
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
                  onClick={() => deleteOpen()}
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
          <Dialog
            open={openAddPopUp}
            sx={{
              "& .MuiDialog-container": {
                "& .MuiPaper-root": {
                  width: "50%",
                  height: "50%",
                  maxWidth: "500px", // Set your width here
                  maxHeight: "80vh", // Set your height here
                  overflowY: "auto", // Enable vertical scrolling if content overflows
                },
              },
            }}
            className="order_list_ml custom-dialog"
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
                        <div className="flex flex-col md:flex-row w-full gap-2">
                          <div style={{ width: "100%" }}>
                            <span className="primary block">
                              Start Date
                            </span>
                            <div className="" style={{ width: "100%" }}>
                              <DatePicker
                                className="custom-datepicker"
                                selected={PdfstartDate}
                                onChange={(newDate) =>
                                  setPdfStartDate(newDate)
                                }
                                dateFormat="dd/MM/yyyy"
                                open={openStartCalendar}
                                onClickOutside={() => setOpenStartCalendar(false)}
                                onSelect={() => setOpenStartCalendar(false)}
                                onCalendarClose={() => setOpenStartCalendar(false)}
                                onCalendarOpen={() => setOpenStartCalendar(true)}
                              />
                            </div>
                          </div>
                          <div className="" style={{ width: "100%" }}>
                            <span className="primary block">
                              End Date
                            </span>
                            <div className="" style={{ width: "100%" }}>
                              <DatePicker
                                className="custom-datepicker "
                                selected={PdfendDate}
                                onChange={(newDate) =>
                                  setPdfEndDate(newDate)
                                }
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
                style={{
                  backgroundColor: "var(--COLOR_UI_PHARMACY)",
                  color: "white",
                }}
                onClick={() => {
                  AllPDFGenerate();
                }}
               disabled={isDownloadLoading}>
{isDownloadLoading ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color:"#fff" }}>
              <CircularProgress size={16} style={{ color: "white" }} />
              Downloading...
            </span>
          ) : (
            <>
              
                generate
              
            </>
          )}
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
        </div>

      )}



    </>
  );
};
export default SalereturnList;
