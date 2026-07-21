import CircularProgress from "@mui/material/CircularProgress";
import useSubmitShortcut from "../../../../hooks/useSubmitShortcut";
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
  Select,
  MenuItem,
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
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const initialSearchTerms = columns.map(() => "");
  const [searchTerms, setSearchTerms] = useState(initialSearchTerms);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloadLoading, setIsDownloadLoading] = useState(false);
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
  const [fileError, setFileError] = useState("");
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
      DistList(currentPage, false, rowsPerPage);
    }
  }, [currentPage, rowsPerPage]);


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
        }, 500);
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

  // Handled pagination above

  const resetAddDialog = () => {
    setOpenEdit(false);
    setErrors({});
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
      setErrors((prev) => ({
        ...prev,
        mobileNo: "",
      }));
    }
  };

  const editDistributor = async () => {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    const mobileRegex = /^[6-9][0-9]{9}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pincodeRegex = /^[1-9][0-9]{5}$/;
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    const accountRegex = /^[0-9]{9,18}$/;

    const newErrors = {};

    if (!gstNumber) {
      newErrors.gstNumber = "GST/IN Number is required";
    } else if (!gstRegex.test(gstNumber)) {
      newErrors.gstNumber = "Enter a valid 15-character GSTIN (e.g. 27AAACR5055K1Z7)";
    }

    if (!distributerName) {
      newErrors.distributerName = "Distributor Name is required";
    }

    if (!mobileNo) {
      newErrors.mobileNo = "Mobile number is required";
    } else if (!mobileRegex.test(mobileNo)) {
      newErrors.mobileNo = "Mobile number must be a valid 10-digit number";
    }

    if (email && !emailRegex.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (whatsapp && !mobileRegex.test(whatsapp)) {
      newErrors.whatsapp = "WhatsApp number must be a valid 10-digit number";
    }

    if (pincode && !pincodeRegex.test(pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }

    if (switchCheck) {
      if (ifscCode && !ifscRegex.test(ifscCode)) {
        newErrors.ifscCode = "Enter a valid 11-character IFSC code";
      }

      if (accountNo && !accountRegex.test(accountNo)) {
        newErrors.accountNo = "Account number must be 9 to 18 digits";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

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
          setErrors({});
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

  // const handleFileChange = (e) => {
  //   const selectedFile = e.target.files[0];
  //   if (selectedFile) {
  //     const fileType = selectedFile.type;
  //     if (fileType === "text/csv") {
  //       setFile(selectedFile);
  //     } else {
  //       toast.dismiss();
  //       toast.error("Please select an Excel or CSV file.");
  //     }
  //   }
  // };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (selectedFile.name.toLowerCase().endsWith(".csv")) {
      setFile(selectedFile);
      setFileError("");
    } else {
      setFile(null);
      setFileError("Please select only CSV file.");
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
    if (!file) {
      setFileError("Please select CSV file.");
      return;
    }
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
          setFile(null);
          setFileError("");
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

  const DistList = async (page, isSearch = false, limit = rowsPerPage) => {
    if (!page) return;

    let data = new FormData();
    data.append("page", page);
    data.append("limit", limit);

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
    setIsDownloadLoading(true);
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
    setFile(null);
    setFileError("");
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
  useSubmitShortcut(editDistributor, openEdit);
  useSubmitShortcut(uploadDistributorFile, openUpload);




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
                       disabled={isDownloadLoading}>
{isDownloadLoading ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color:"#fff" }}>
              <CircularProgress size={16} style={{ color: "white" }} />
              Downloading...
            </span>
          ) : (
            <>
              
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <img
                            src="/csv-file.png"
                            className="report-icon absolute"
                            alt="csv "
                          />
                        </div>
                        Download
                      
            </>
          )}
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
                <div className="overflow-x-auto" style={{ maxHeight: '75vh', overflowY: 'auto', scrollbarWidth: 'none', position: 'relative' }}>
                  <table
                    className="w-full border-collapse custom-table"
                    style={{
                      whiteSpace: "nowrap",
                      borderCollapse: "separate",
                      borderSpacing: "0 6px",
                    }}
                  >
                    <thead style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: 'white' }}>
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
                      <tbody>
                        <tr>
                          <td
                            colSpan={columns.length + 2}
                            style={{ position: "relative", height: "400px" }}
                          >
                            <Loader />
                          </td>
                        </tr>
                      </tbody>
                    ) : (
                      <tbody style={{ background: "#3f621217" }}>
                        {tableData.length === 0 ? (
                          <tr>
                            <td
                              colSpan={columns.length + 1}
                              className="text-center text-gray-500"
                              style={{ borderRadius: "10px 10px 10px 10px" }}
                            >
<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px', width: '100%' }}>
  { !isLoading && <img src="/no-data.png" alt="No Items Available" style={{ maxWidth: '300px', height: 'auto' }} /> }
</div>
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

                                if (!value || value === "") {
                                  value = "-";
                                }

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
                                    sx={{
                                      color: "#2563eb", // Blue
                                      cursor: "pointer",
                                      "&:hover": {
                                        color: "#1d4ed8", // Dark Blue on hover
                                      },
                                    }}
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
                            placeholder="GST/IN Number"
                            onChange={(e) => {
                              const value = e.target.value
                                .toUpperCase()
                                .replace(/[^A-Z0-9]/g, "");
                              setGstnumber(value);
                              setErrors((prev) => ({
                                ...prev,
                                gstNumber: "",
                              }));
                            }}
                            className="w-full"
                            variant="outlined"
                          />
                          {errors.gstNumber && (
                            <span className="text-red-600 text-xs">
                              {errors.gstNumber}
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
                            placeholder=" Distributor Name"
                            size="small"
                            type="text"
                            value={distributerName}
                            onChange={(e) => {
                              setDistributerName(e.target.value.toUpperCase());
                              setErrors((prev) => ({
                                ...prev,
                                distributerName: "",
                              }));
                            }}
                            className="w-full"
                            variant="outlined"
                          />
                          {errors.distributerName && (
                            <span className="text-red-600 text-xs">
                              {errors.distributerName}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row gap-5">
                        <div className="flex flex-col w-full md:w-1/2 lg:w-1/2">
                          <span className="label primary">Email ID</span>
                          <TextField
                            autoComplete="off"
                            placeholder="Email ID"
                            id="outlined-multiline-static"
                            size="small"
                            type="email"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              setErrors((prev) => ({
                                ...prev,
                                email: "",
                              }));
                            }}
                            className="w-full"
                            variant="outlined"
                          />
                          {errors.email && (
                            <span className="text-red-600 text-xs">
                              {errors.email}
                            </span>
                          )}
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
                            placeholder="Mobile Number"
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
                            placeholder="Whatsapp No."
                            id="outlined-multiline-static"
                            size="small"
                            type="number"
                            value={whatsapp}

                            onChange={(e) => {
                              const value = e.target.value;
                              if (value.length <= 10) {
                                setWhatsApp(value);
                                setErrors((prev) => ({
                                  ...prev,
                                  whatsapp: "",
                                }));
                              }
                            }}
                            className="w-full"
                            variant="outlined"
                          />
                          {errors.whatsapp && (
                            <span className="text-red-600 text-xs">
                              {errors.whatsapp}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col w-full md:w-1/2 lg:w-1/2">
                          <span className="label primary"> Address</span>
                          <TextField
                            placeholder="Address"
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
                            placeholder="Area"
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
                            placeholder="Pincode"
                            type="number"
                            value={pincode}
                            onChange={(e) => {
                              setPincode(e.target.value);
                              setErrors((prev) => ({
                                ...prev,
                                pincode: "",
                              }));
                            }}
                            className="w-full"
                            variant="outlined"
                          />
                          {errors.pincode && (
                            <span className="text-red-600 text-xs">
                              {errors.pincode}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row gap-5">
                        <div className="flex flex-col w-full md:w-1/2 lg:w-1/2">
                          <span className="label primary">State</span>
                          <TextField
                            autoComplete="off"
                            id="outlined-multiline-static"
                            placeholder="State"
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
                            placeholder="Credit Due Days"
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
                              onChange={(e) => {
                                setIfscCode(e.target.value);
                                setErrors((prev) => ({
                                  ...prev,
                                  ifscCode: "",
                                }));
                              }}
                              // type="text"
                              // onChange={(e) => {
                              //     const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                              //     setIfscCode(value);
                              // }}
                              className="w-full"
                              size="small"
                            />
                            {errors.ifscCode && (
                              <span className="text-red-600 text-xs">
                                {errors.ifscCode}
                              </span>
                            )}
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
                              onChange={(e) => {
                                setAccountNo(e.target.value);
                                setErrors((prev) => ({
                                  ...prev,
                                  accountNo: "",
                                }));
                              }}
                              className="w-full"
                              variant="outlined"
                            />
                            {errors.accountNo && (
                              <span className="text-red-600 text-xs">
                                {errors.accountNo}
                              </span>
                            )}
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

          <Dialog
            open={openUpload}
            className="custom-dialog"
            PaperProps={{
              sx: {
                borderRadius: "16px",
                boxShadow: "0 12px 40px rgba(0, 0, 0, 0.12)",
                border: "1px solid rgba(0, 0, 0, 0.05)",
                overflow: "hidden",
                maxWidth: "480px",
                width: "100%",
                marginTop: "12px"
              }
            }}
          >
            <DialogTitle
              id="alert-dialog-title"
              sx={{
                background: "#3F6212",
                color: "#ffffff !important",
                position: "relative",
                py: 2.2,
                px: 3,
                fontWeight: 600,
                fontSize: "1.15rem",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                boxShadow: "0 4px 12px rgba(63, 98, 18, 0.1)"
              }}
            >
              <CloudUploadIcon sx={{ fontSize: 24 }} />
              <span>Import Distributor</span>
              <IconButton
                aria-label="close"
                onClick={() => {
                  setOpenUpload(false);
                  setFile(null);
                  setFileError("");
                }}
                sx={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "rgba(255, 255, 255, 0.85)",
                  padding: "8px !important",
                  "&:hover": {
                    color: "#ffffff",
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                    transform: "translateY(-50%) scale(1.05)",
                  }
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 3, backgroundColor: "#fafbfa", }}>
              <Alert
                severity="warning"
                sx={{
                  borderRadius: "10px",
                  mb: 3,
                  marginTop: "12px",
                  border: "1px solid #ffeeba",
                  backgroundColor: "#fffdf5",
                  "& .MuiAlert-icon": {
                    color: "#ffc107"
                  }
                }}
              >
                <AlertTitle sx={{ fontWeight: 600 }}>Important Note</AlertTitle>
                Please make sure repeated Email ID records are not accepted.
              </Alert>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {/* Upload Area */}
                <div
                  style={{
                    border: "2px dashed #cbd5e1",
                    borderRadius: "12px",
                    padding: "24px",
                    textAlign: "center",
                    backgroundColor: file ? "#f8fafc" : "#ffffff",
                    borderColor: file ? "var(--COLOR_UI_PHARMACY, #3f6212)" : "#cbd5e1",
                    transition: "all 0.2s ease-in-out",
                    position: "relative",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "10px"
                  }}
                  onClick={() => document.getElementById("file-upload").click()}
                >
                  <input
                    type="file"
                    accept=".csv"
                    id="file-upload"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  <CloudUploadIcon sx={{ fontSize: 44, color: file ? "var(--COLOR_UI_PHARMACY, #3f6212)" : "#94a3b8" }} />
                  {file ? (
                    <div>
                      <div style={{ fontWeight: 600, color: "#1e293b", fontSize: "14px", wordBreak: "break-all" }}>
                        {file.name}
                      </div>
                      <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                        {(file.size / 1024).toFixed(2)} KB
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontWeight: 500, color: "#475569", fontSize: "14px" }}>
                        Click to select CSV File
                      </div>
                      <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>
                        *Select only .csv format files
                      </div>
                    </div>
                  )}
                </div>

                {fileError && (
                  <div style={{ color: "#e53e3e", fontSize: "12.5px", fontWeight: 500, textAlign: "center" }}>
                    {fileError}
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    variant="outlined"
                    onClick={handleDownload}
                    sx={{
                      borderColor: "#cbd5e1",
                      color: "#475569",
                      borderRadius: "8px",
                      px: 3,
                      py: 0.8,
                      textTransform: "none",
                      fontWeight: 500,
                      fontSize: "13px",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      "&:hover": {
                        borderColor: "#94a3b8",
                        backgroundColor: "#f8fafc !important"
                      }
                    }}
                   disabled={isDownloadLoading}>
{isDownloadLoading ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color:"#fff" }}>
              <CircularProgress size={16} style={{ color: "white" }} />
              Downloading...
            </span>
          ) : (
            <>
              
                    <CloudDownloadIcon sx={{ fontSize: 18 }} />
                    Download Sample File
                  
            </>
          )}
</Button>
                </div>
              </div>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3, pt: 1, backgroundColor: "#fafbfa", display: "flex", gap: "12px" }}>
              <Button
                variant="outlined"
                onClick={() => {
                  setOpenUpload(false);
                  setFile(null);
                  setFileError("");
                }}
                sx={{
                  flex: 1,
                  borderColor: "#cbd5e1",
                  color: "#475569",
                  borderRadius: "8px",
                  py: 1,
                  textTransform: "none",
                  fontWeight: 500,
                  "&:hover": {
                    borderColor: "#94a3b8",
                    backgroundColor: "#f8fafc"
                  }
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={uploadDistributorFile}
                sx={{
                  flex: 2,
                  backgroundColor: "var(--COLOR_UI_PHARMACY, #3f6212)",
                  borderRadius: "8px",
                  py: 1,
                  textTransform: "none",
                  fontWeight: 600,
                  boxShadow: "0 4px 12px rgba(63, 98, 18, 0.15)",
                  "&:hover": {
                    backgroundColor: "#314d0e",
                    boxShadow: "0 6px 16px rgba(63, 98, 18, 0.25)",
                  }
                }}
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
