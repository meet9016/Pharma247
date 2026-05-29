import {
  Alert,
  AlertTitle,
  Button,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import Header from "../../../Header";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
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
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Loader from "../../../../componets/loader/Loader";
import { toast, ToastContainer } from "react-toastify";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

import usePermissions, {
  hasPermission,
} from "../../../../componets/permission";
import Switch from "@mui/material/Switch";

const columns = [
  { id: "name", label: "Name", minWidth: 150 },
  { id: "email", label: "Email", minWidth: 150 },
  { id: "gst", label: "GST", minWidth: 150 },
  { id: "phone_number", label: "Phone Number", minWidth: 150 },
];

const DistributerList = () => {
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
  const [openEdit, setOpenEdit] = useState(false);
  const [gstNumber, setGstnumber] = useState("");
  const [distributerName, setDistributerName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [whatsapp, setWhatsApp] = useState("");
  const [address, setAddress] = useState("");
  const [area, setArea] = useState("");
  const [pincode, setPincode] = useState("");
  const [state, setState] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [licenceNo, setLicenceNo] = useState("");
  const [distributorDrugLicenseNo, setDistributorDrugLicenseNo] = useState("");
  const [creditDuedays, setCreditDuedays] = useState("");
  const [distributerId, setDistributerId] = useState(null);
  const [errors, setErrors] = useState({});
  const excelIcon = process.env.PUBLIC_URL + "/excel.png";
  const [openUpload, setOpenUpload] = useState(false);
  const [file, setFile] = useState(null);
  const [switchCheck, setSwitchChecked] = useState(false);

  const searchKeys = ["search_name", "search_email", "search_gst", "search_phone_number"];

  // Search state management (copied from PurchaseList.js)
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchTrigger, setSearchTrigger] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeout = useRef(null);
  const currentSearchTerms = useRef(searchTerms);

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

  // Effect for pagination
  useEffect(() => {
    if (currentPage > 0) {
      DistList(currentPage);
    }
  }, [currentPage]);

  const resetAddDialog = () => {
    setOpenEdit(false);
  };

  const handleEditOpen = (row) => {
    setHeader("Edit Distributor");
    setDistributerId(row.id);
    setOpenEdit(true);
    setGstnumber(row.gst);
    setDistributerName(row.name);
    setEmail(row.email);
    setMobileNo(row.phone_number);
    setWhatsApp(row.whatsapp_number);
    setAddress(row.address);
    setArea(row.area);
    setPincode(row.pincode);
    setState(row.state);

    setBankName(row.bank_name);
    setAccountNo(row.account_no);
    setIfscCode(row.ifsc_code);
    setLicenceNo(row.food_licence_number);
    setDistributorDrugLicenseNo(row.distributer_drug_licence_no);
    setCreditDuedays(row.payment_drug_days);
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
    DistList(1);
  };

  // Handle search on Enter key press for specific field
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchSubmit();
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (value.length <= 10) {
      setMobileNo(value);
    }
  };

  const editDistributor = async () => {
    let data = new FormData();

    data.append("id", distributerId);
    data.append("gst_number", gstNumber);
    data.append("distributor_name", distributerName);
    data.append("email", email);
    data.append("whatsapp", whatsapp);
    data.append("mobile_no", mobileNo);
    data.append("address", address);
    data.append("area", area);
    data.append("pincode", pincode);
    data.append("state", state);
    data.append("bank_name", bankName);
    data.append("account_no", accountNo);
    data.append("ifsc_code", ifscCode);
    data.append("distributor_durg_distributor", distributorDrugLicenseNo);
    data.append("payment_due_days", creditDuedays);
    const params = {
      id: distributerId,
    };
    try {
      await axios
        .post("update-distributer?", data, {
          params: params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          DistList(currentPage);
          setOpenEdit(false);
          setGstnumber("");
          setDistributerName("");
          setEmail("");
          setMobileNo("");
          setPhoneNo("");
          setWhatsApp("");
          setAddress("");
          setArea("");
          setState("");
          setPincode("");
          setBankName("");
          setAccountNo("");
          setIfscCode("");
          setLicenceNo("");
          setDistributorDrugLicenseNo("");
          setCreditDuedays("");
          // setIsEditMode(false)
          toast.dismiss();
          toast.success(response.data.message);
        });
    } catch (error) {
      setIsLoading(false);
      toast.dismiss();
      toast.error(error.message);
         if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileType = selectedFile.type;
      if (fileType === "text/csv") {
        setFile(selectedFile);
      } else {
        toast.dismiss();
        toast.error("Please select an Excel or CSV file.");
      }
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/distributor.csv";
    link.download = "distributor.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const uploadDistributorFile = async () => {
    let data = new FormData();
    data.append("file", file);
    try {
      await axios
        .post("import-distributer", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          DistList(currentPage);
          setOpenUpload(false);
          toast.dismiss();
          toast.success(response.data.message);
        });
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.dismiss();
        toast.error("Please Select file");
      }
      console.error("API error:", error);
         if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
    }
  };

  const DistList = async (page, isSearch = false) => {
    if (!page) return;

    let data = new FormData();
    data.append("page", page);

    // Add search parameters when any search term has a value
    currentSearchTerms.current.forEach((term, index) => {
      if (term && term.trim()) {
        data.append(searchKeys[index], term.trim());
      }
    });

    // Use different loading states for search vs regular operations

    setIsSearchLoading(true);


    try {
      const response = await axios.post("list-distributer?", data, {
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
      const totalCount = response.data.total_records
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
      setIsSearchLoading(false);

    }
  };

  const exportToExcel = async () => {
    let data = new FormData();
    setIsLoading(true);
    data.append("page", currentPage);
    data.append("iss_value", "download");
    const params = {
      page: currentPage,
    };
    try {
      await axios
        .post("list-distributer?", data, {
          params: params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const csvData = response.data.data;
          if (csvData) {
            const csvString = convertToCSV(csvData);
            const blob = new Blob([csvString], {
              type: "text/csv;charset=utf-8;",
            });
            saveAs(blob, "Distributor.csv");
          }

          setTableData(response.data.data);
          setIsLoading(false);
        });
    } catch (error) {
      setIsLoading(false);
      console.error("API error:", error);
         if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
    }
  };

  const convertToCSV = (data) => {
    const array = [Object.keys(data[0])].concat(data);

    return array
      .map((it) => {
        return Object.values(it).toString();
      })
      .join("\n");
  };

  const openFilePopUP = () => {
    setOpenUpload(true);
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
                      Distributor List
                    </span>
                    <BsLightbulbFill className="w-6 h-6 secondary hover-yellow align-center" />
                  </div>
                  <div className="headerList cust_hdr_mn_bg">
                    {hasPermission(permissions, "distributor import") && (
                      <Button
                        variant="contained"
                        style={{
                          background: "var(--color1)",
                          display: "flex",
                        }}
                        className="gap-2"
                        onClick={openFilePopUP}
                      >
                        <CloudUploadIcon /> Import
                      </Button>
                    )}
                    {hasPermission(permissions, "distributor create") && (
                      <Button
                        variant="contained"
                        style={{ background: "var(--color1)", display: "flex" }}
                        onClick={() => {
                          history.push("/addDistributer");
                        }}
                        className="gap-2"
                      >
                        <AddIcon className="" />
                        Add Distributor
                      </Button>
                    )}
                    {hasPermission(permissions, "distributor download") && (
                      <Button
                        className="gap-7"
                        variant="contained"
                        style={{
                          background: "var(--color1)",
                          color: "white",
                          // paddingLeft: "35px",
                          textTransform: "none",
                          display: "flex",
                        }}
                        onClick={exportToExcel}
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <img
                            src="/csv-file.png"
                            className="report-icon absolute"
                            alt="csv "
                          />
                        </div>
                        Download
                      </Button>
                    )}
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
                                    onClick={() => {
                                      history.push(`/DistributerView/${row.id}`);
                                    }}
                                  >
                                    {column.format && typeof value === "number"
                                      ? column.format(value)
                                      : value}
                                  </td>
                                );
                              })}
                              <td className="rounded-r-[10px] px-4 py-2 text-center">
                                <div className="px-2 flex gap-1 justify-center">
                                  <VisibilityIcon
                                    style={{ color: "var(--color1)" }}
                                    onClick={() => {
                                      history.push(`/DistributerView/${row.id}`);
                                    }}
                                  />
                                  {hasPermission(permissions, "distributor edit") && (
                                    <BorderColorIcon
                                      style={{ color: "var(--color1)" }}
                                      onClick={() => handleEditOpen(row)}
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
          {/*<====================================================================== add distributor  =====================================================================> */}

          <Dialog open={openEdit}>
            <div className="flex justify-center items-center h-auto">
              <div className="bg-white rounded-lg p-6 w-full max-w-3xl">
                <div className="flex justify-between items-center">
                  <DialogTitle
                    id="alert-dialog-title"
                    style={{
                      color: "var(--COLOR_UI_PHARMACY)",
                      fontWeight: 700,
                    }}
                  >
                    {header}
                  </DialogTitle>
                  <IconButton
                    aria-label="close"
                    onClick={resetAddDialog}
                    className="text-gray-500"
                  >
                    <CloseIcon />
                  </IconButton>
                </div>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    <div className="flex flex-col gap-5">
                      <div className="flex flex-col md:flex-row gap-5">
                        <div className="flex flex-col w-full md:w-1/2 lg:w-1/2">
                          <div className="mb-1">
                            <span className="label primary">GST/IN Number</span>
                            <span className="text-red-600 ml-1">*</span>
                          </div>
                          <TextField
                            autoComplete="off"
                            id="outlined-multiline-static"
                            size="small"
                            type="text"
                            value={gstNumber}
                            onChange={(e) => {
                              const value = e.target.value
                                .toUpperCase()
                                .replace(/[^A-Z0-9]/g, "");
                              setGstnumber(value);
                            }}
                            className="w-full"
                            variant="outlined"
                          />
                          {errors.Doctor && (
                            <span className="text-red-600 text-xs">
                              {errors.Doctor}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col w-full md:w-1/2 lg:w-1/2">
                          <div className="mb-1">
                            <span className="label primary">
                              Distributor Name
                            </span>
                            <span className="text-red-600 ml-1">*</span>
                          </div>
                          <TextField
                            autoComplete="off"
                            id="outlined-multiline-static"
                            size="small"
                            type="text"
                            value={distributerName}
                            onChange={(e) => {
                              setDistributerName(e.target.value.toUpperCase());
                            }}
                            className="w-full"
                            variant="outlined"
                          />
                          {errors.clinic && (
                            <span className="text-red-600 text-xs">
                              {errors.clinic}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row gap-5">
                        <div className="flex flex-col w-full md:w-1/2 lg:w-1/2">
                          <span className="label primary">Email ID</span>
                          <TextField
                            autoComplete="off"
                            id="outlined-multiline-static"
                            size="small"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full"
                            variant="outlined"
                          />
                        </div>
                        <div className="flex flex-col w-full md:w-1/2 lg:w-1/2">
                          <div className="mb-1">
                            <span className="label primary">Mobile No</span>
                            <span className="text-red-600 ml-1">*</span>
                          </div>
                          <OutlinedInput
                            type="number"
                            value={mobileNo}
                            onChange={handleChange}
                            startAdornment={
                              <InputAdornment position="start">
                                +91
                              </InputAdornment>
                            }
                            className="w-full"
                            size="small"
                          />
                          {errors.mobileNo && (
                            <span className="text-red-600 text-xs">
                              {errors.mobileNo}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row gap-5">
                        <div className="flex flex-col w-full md:w-1/2 lg:w-1/2">
                          <span className="label primary">Whatsapp No.</span>
                          <TextField
                            autoComplete="off"
                            id="outlined-multiline-static"
                            size="small"
                            type="number"
                            value={whatsapp}

                            onChange={(e) => {
                              const value = e.target.value;
                              if (value.length <= 10) {
                                setWhatsApp(value);
                              }
                            }}
                            className="w-full"
                            variant="outlined"
                          />
                        </div>
                        <div className="flex flex-col w-full md:w-1/2 lg:w-1/2">
                          <span className="label primary"> Address</span>
                          <TextField
                            autoComplete="off"
                            id="outlined-multiline-static"
                            size="small"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full"
                            variant="outlined"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row gap-5">
                        <div className="flex flex-col w-full md:w-1/2 lg:w-1/2">
                          <span className="label primary">Area</span>
                          <TextField
                            autoComplete="off"
                            value={area}
                            onChange={(e) => setArea(e.target.value)}
                            className="w-full"
                            size="small"
                          />
                        </div>
                        <div className="flex flex-col w-full md:w-1/2 lg:w-1/2">
                          <span className="label primary">Pincode</span>
                          <TextField
                            autoComplete="off"
                            id="outlined-multiline-static"
                            size="small"
                            type="number"
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value)}
                            className="w-full"
                            variant="outlined"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row gap-5">
                        <div className="flex flex-col w-full md:w-1/2 lg:w-1/2">
                          <span className="label primary">State</span>
                          <TextField
                            autoComplete="off"
                            id="outlined-multiline-static"
                            size="small"
                            value={state}
                            onChange={(e) => {
                              const value = e.target.value.replace(
                                /[^a-zA-Z]/g,
                                ""
                              ); // Remove non-alphabetic characters
                              const formattedValue =
                                value.charAt(0).toUpperCase() +
                                value.slice(1).toLowerCase();
                              setState(formattedValue);
                            }}
                            className="w-full"
                            variant="outlined"
                          />
                        </div>

                        <div className="flex flex-col w-full md:w-1/2 lg:w-1/2">
                          <span className="label primary">Credit Due Days</span>
                          <TextField
                            autoComplete="off"
                            id="outlined-multiline-static"
                            size="small"
                            value={creditDuedays}
                            onChange={(e) =>
                              setCreditDuedays(Number(e.target.value))
                            }
                            className="w-full"
                            variant="outlined"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border-1 text-black font-bold secondary flex justify-between items-center mt-5">
                      Add More Details
                      <Switch
                        checked={switchCheck}
                        onChange={(e) => setSwitchChecked(e.target.checked)}
                        sx={{
                          "& .MuiSwitch-track": {
                            backgroundColor: "var(--COLOR_UI_PHARMACY)",
                          },
                          "&.Mui-checked .MuiSwitch-track": {
                            backgroundColor:
                              "var(--COLOR_UI_PHARMACY) !important",
                          },
                          "& .MuiSwitch-thumb": {
                            backgroundColor: "var(--COLOR_UI_PHARMACY)",
                          },
                          "&.Mui-checked .MuiSwitch-thumb": {
                            backgroundColor: "var(--COLOR_UI_PHARMACY)",
                          },
                          "& .css-byenzh-MuiButtonBase-root-MuiSwitch-switchBase.Mui-checked+.MuiSwitch-track":
                          {
                            backgroundColor:
                              "var(--COLOR_UI_PHARMACY) !important",
                          },
                        }}
                      />
                    </div>
                    {switchCheck && (
                      <div className="mt-5 flex flex-col gap-5">
                        <div className="flex flex-col md:flex-row gap-5">
                          <div className="flex flex-col w-full md:w-1/2 lg:w-1/2">
                            <span className="label primary">
                              Distributor Drug License No.
                            </span>
                            <OutlinedInput
                              type="text"
                              value={distributorDrugLicenseNo}
                              onChange={(e) => {
                                const value = e.target.value.toUpperCase(); // Convert to uppercase for uniformity
                                setDistributorDrugLicenseNo(value);
                              }}
                              className="w-full"
                              size="small"
                            />
                          </div>

                          <div className="flex flex-col w-full md:w-1/2 lg:w-1/2">
                            <span className="label primary">
                              Food Licence No.
                            </span>
                            <TextField
                              autoComplete="off"
                              id="outlined-multiline-static"
                              size="small"
                              value={licenceNo}
                              onChange={(e) => {
                                const value = e.target.value.toUpperCase(); // Convert to uppercase for uniformity
                                setLicenceNo(value);
                              }}
                              className="w-full"
                              variant="outlined"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col md:flex-row gap-5">
                          <div className="flex flex-col w-full md:w-1/2 lg:w-1/2">
                            <span className="label primary">Bank Name</span>
                            <TextField
                              autoComplete="off"
                              value={bankName}
                              onChange={(e) => {
                                const uppercasedValue = e.target.value
                                  .toUpperCase()
                                  .replace(/[^A-Z]/g, "");
                                setBankName(uppercasedValue);
                              }}
                              className="w-full"
                              size="small"
                            />
                          </div>
                          <div className="flex flex-col w-full md:w-1/2 lg:w-1/2">
                            <span className="label primary">IFSC Code</span>
                            <TextField
                              autoComplete="off"
                              value={ifscCode}
                              onChange={(e) => setIfscCode(e.target.value)}
                              // type="text"
                              // onChange={(e) => {
                              //     const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                              //     setIfscCode(value);
                              // }}
                              className="w-full"
                              size="small"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col md:flex-row gap-5">
                          <div className="flex flex-col w-full ">
                            <span className="label primary">Account No.</span>
                            <TextField
                              autoComplete="off"
                              id="outlined-multiline-static"
                              size="small"
                              type="number"
                              value={accountNo}
                              onChange={(e) => setAccountNo(e.target.value)}
                              className="w-full"
                              variant="outlined"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </DialogContentText>
                </DialogContent>
                <DialogActions style={{ padding: "16px 24px" }}>
                  <Button
                    autoFocus
                    variant="contained"
                    style={{
                      backgroundColor: "var(--COLOR_UI_PHARMACY)",
                      color: "white",
                    }}
                    onClick={editDistributor}
                  >
                    Update
                  </Button>
                  <Button
                    autoFocus
                    variant="contained"
                    color="error"
                    onClick={resetAddDialog}
                  >
                    Cancel
                  </Button>
                </DialogActions>
              </div>
            </div>
          </Dialog>
          {/*<====================================================================== upload import distributor  =====================================================================> */}

          <Dialog open={openUpload} className="custom-dialog">
            <DialogTitle id="alert-dialog-title " className="primary">
              Import Distributor
            </DialogTitle>
            <Alert severity="warning" className="">
              <AlertTitle>Warning</AlertTitle>
              Please Make Sure Repeated Email ID record is not accepted.
            </Alert>
            <div className="px-6 ">
            </div>
            <IconButton
              aria-label="close"
              onClick={() => setOpenUpload(false)}
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
                <div className="primary">Item File Upload</div>
                <div
                  style={{
                    display: "flex",
                    gap: "15px",
                    flexDirection: "column",
                  }}
                >
                  <div className="mt-2">
                    <input
                      className="File-upload"
                      type="file"
                      accept=".csv"
                      id="file-upload"
                      onChange={handleFileChange}
                    />
                    <span className="errorFile" style={{ fontSize: "small" }}>
                      *select only .csv File
                    </span>
                  </div>
                  <div className="mt-2">
                    <Button
                      onClick={handleDownload}
                      style={{
                        backgroundColor: "var(--COLOR_UI_PHARMACY)",
                        color: "white",
                      }}
                    >
                      <CloudDownloadIcon className="mr-2" />
                      Download Sample File
                    </Button>
                  </div>
                </div>
              </DialogContentText>
            </DialogContent>
            <DialogActions style={{ padding: "20px 24px" }}>
              <Button
                autoFocus
                style={{
                  backgroundColor: "var(--COLOR_UI_PHARMACY)",
                  color: "white",
                  width: "100%",
                }}
                variant="contained"
                onClick={uploadDistributorFile}
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </>
  );
};

export default DistributerList;
