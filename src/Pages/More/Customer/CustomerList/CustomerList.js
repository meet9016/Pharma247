import Loader from "../../../../componets/loader/Loader";
import Header from "../../../Header";
import React, { useEffect, useState } from "react";
import { BsLightbulbFill } from "react-icons/bs";
import {
  Button,
  Chip,
  InputAdornment,
  OutlinedInput,
  TextField,
} from "@mui/material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import axios from "axios";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import AddIcon from "@mui/icons-material/Add";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { toast, ToastContainer } from "react-toastify";
import usePermissions, {
  hasPermission,
} from "../../../../componets/permission";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

const CustomerList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [openAddPopUp, setOpenAddPopUp] = useState(false);
  const [paymentMode, setPaymentMode] = useState([]);
  const [customer, setCustomer] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [amount, setAmount] = useState("");
  const [area, setArea] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [emailId, setEmailId] = useState("");
  const history = useHistory();
  const rowsPerPage = 10;
  const token = localStorage.getItem("token");
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [buttonLabel, setButtonLabel] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [header, setHeader] = useState("");
  const [customerID, setCustomerID] = useState(null);
  const permissions = usePermissions();
  const [chipState, setChipState] = useState({
    variant: "default",
    value: "",
  });
  const columns = [
    { id: "name", label: "Customer Name", minWidth: 150 },
    { id: "phone_number", label: "Mobile No", minWidth: 150 },
    { id: "email", label: "Email ID", minWidth: 150 },
    { id: "area", label: "Area", minWidth: 150 },
    { id: "total_amount", label: "Amount", minWidth: 150 },
    { id: "state", label: "state", minWidth: 150 },

    // { id: 'due_amount', label: 'Due Amount', minWidth: 100 },
  ];
  const apiKeys = ["customer_name", "mobile_number", "email", "area", "amount", "state"];

  const initialSearchTerms = columns.map(() => "");
  const [searchTerms, setSearchTerms] = useState(initialSearchTerms);

  const [searchTrigger, setSearchTrigger] = useState(0);
  const searchTimeout = React.useRef(null);
  const currentSearchTerms = React.useRef(searchTerms);
  const [totalRecords, setTotalRecords] = useState(0); // ✅ ADD

  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * rowsPerPage + 1;
  const totalPages = Math.ceil(totalRecords / rowsPerPage); // ✅ FIX PAGINATION BASED ON SERVER

  const paginatedData = tableData; // ✅ SERVER-SIDE PAGINATED DATA


  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const excelIcon = process.env.PUBLIC_URL + "/excel.png";
  const handlePrint = () => {
    window.print("/PurchaseReturnAdd");
  };
  const goIntoAdd = () => {
    history.push("/PurchaseReturnAdd");
  };
  const allOptions = [
    "dueOnly",
    "active",
    "deactivate",
    // ...tableData.map(bank => bank.id),
    // 'loyaltyPoints'
  ];
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
        .post("list-customer?", data, {
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
            saveAs(blob, "customers.csv");
          }

          setTableData(response.data.data);
          if (response.data.status === 401) {
            history.push("/");
            localStorage.clear();
          }
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

  const handleChange = (e) => {
    const value = e.target.value;
    if (value.length <= 10) {
      setMobileNo(value);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      customerAllData(1, currentSearchTerms.current);
    }
  };

  const resetAddDialog = () => {
    setCustomer("");
    setMobileNo("");
    setEmailId("");
    setAddress("");
    setAmount(0);
    setArea("");
    setCity("");
    setState("");
    setErrors({});
    setOpenAddPopUp(false);
  };

  const handleEditOpen = (row) => {
    setOpenAddPopUp(true);
    setCustomerID(row.id);
    setIsEditMode(true);
    setHeader("Edit Customer");
    setButtonLabel("Update");
    setCustomer(row.name);
    setMobileNo(row.phone_number);
    setEmailId(row.email);
    setAmount(row.balance);
    setArea(row.area);
    setCity(row.city);
    setState(row.state);

    setAddress(row.address);
  };

  const handelAddOpen = () => {
    setOpenAddPopUp(true);
    setHeader("Add Customer");
    setButtonLabel("Save");
  };

  const Addcustomer = () => {
    if (isEditMode == false) {
      //  Add Customer
      const newErrors = {};
      if (!customer) newErrors.customer = "Customer Name is required";
      if (!state) newErrors.state = "State is required";

      if (!mobileNo) {
        newErrors.mobileNo = "Mobile No is required";
      } else if (!/^\d{10}$/.test(mobileNo)) {
        newErrors.mobileNo = "Mobile number must be 10 digits";
      }
      setErrors(newErrors);
      const isValid = Object.keys(newErrors).length === 0;
      if (isValid) {
        AddCustomerRecord();
      }
      return isValid;
    } else {
      const newErrors = {};
      if (!customer) newErrors.customer = "Customer Name is required";
      if (!mobileNo) {
        newErrors.mobileNo = "Mobile No is required";
      } else if (!/^\d{10}$/.test(mobileNo)) {
        newErrors.mobileNo = "Mobile number must be 10 digits";
      }
      setErrors(newErrors);
      const isValid = Object.keys(newErrors).length === 0;
      if (isValid) {
        EditCustomerRecord();
      }
      return isValid;
    }
  };

  const AddCustomerRecord = async () => {
    let data = new FormData();
    data.append("name", customer);
    data.append("email", emailId);
    data.append("mobile_no", mobileNo);
    data.append("city", city);
    data.append("area", area);
    data.append("amount", amount);
    data.append("address", address);
    data.append("state", state);

    try {
      await axios
        .post("create-customer", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          customerAllData();
          setOpenAddPopUp(false);
          setCustomer("");
          setEmailId("");
          setMobileNo("");
          setCity("");
          setState("");

          setArea("");
          setAmount("");
          setAddress("");
          toast.dismiss();
          toast.success(response.data.message);
        });
    } catch (error) {
      setIsLoading(false);
      if (error.response.data.status == 400) {
        toast.dismiss();
        toast.error(error.response.data.message);
      }
         if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
      // console.error("API error:", error);
    }
  };

  const uploadCustomerFile = async () => {
    let data = new FormData();
    data.append("file", file);
    try {
      await axios
        .post("import-customer", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          customerAllData();
          setOpenUpload(false);
          toast.dismiss();
          toast.success(response.data.message);
        });
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.dismiss();
        toast.error("Please Select file");
      }
         if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
      toast.dismiss();
      toast.error(error.data.message)
      console.error("API error:", error);
    }
  };

  const EditCustomerRecord = async () => {
    let data = new FormData();
    data.append("id", customerID);
    data.append("name", customer);
    data.append("email", emailId);
    data.append("mobile_no", mobileNo);
    data.append("city", city);
    data.append("area", area);
    data.append("amount", amount);
    data.append("address", address);
    data.append("state", state);
    try {
      await axios
        .post("update-customer", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          customerAllData();
          setOpenAddPopUp(false);
          toast.dismiss();
          toast.success(response.data.message);
          setCustomer("");
          setIsEditMode(false);
          setEmailId("");
          setMobileNo("");
          setCity("");
          setState("");

          setArea("");
          setAmount("");
          setAddress("");
        });
    } catch (error) {
      if (error.response.data.status == 400) {
        toast.dismiss();
        toast.error(error.response.data.message);
      }
         if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
      console.error("API error:", error);
    }
  };


  const handlePrevious = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      customerAllData(newPage);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      customerAllData(newPage);
    }
  };

  const handleClick = (pageNum) => {
    setCurrentPage(pageNum);
    customerAllData(pageNum);
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
    link.href = "/Customer_Sample_Data.csv";
    link.download = "Customer_Sample_Data.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const openFilePopUP = () => {
    setOpenUpload(true);
  };

  const handleChipClick = () => {
    if (chipState.value === "") {
      setChipState({
        variant: "outlined",
        value: "due_only",
      });
      customerAllData();
    } else {
      setChipState({
        variant: "default",
        value: "",
      });
      customerAllData();
    }
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

    // Save the latest search to the ref for effect/API use
    currentSearchTerms.current = newSearchTerms;
    setSearchTerms(newSearchTerms);
    setCurrentPage(1); // Always reset to page 1 on search
    setSearchTrigger(prev => prev + 1); // Fire effect for debounced API
  };


  useEffect(() => {
    if (searchTrigger > 0) {
      clearTimeout(searchTimeout.current);

      const hasSearchTerms = currentSearchTerms.current.some(
        (term) => term && term.trim()
      );

      if (!hasSearchTerms) {
        customerAllData(1, ["", "", "", "", "", ""]);
      } else {
        searchTimeout.current = setTimeout(() => {
          customerAllData(1, currentSearchTerms.current);
        }, 300); // ✅ DEBOUNCE
      }
    }
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [searchTrigger]);

  useEffect(() => {
    customerAllData(currentPage);
  }, [currentPage]);


  const customerAllData = async (page = 1, customSearchTerms = searchTerms) => {
    let data = new FormData();
    setIsLoading(true);
    data.append("page", page);
    data.append("due_only", chipState?.value);
    data.append("iss_value", "search");

    apiKeys.forEach((key, idx) => {
      const term = customSearchTerms[idx];
      if (term && term.trim()) {
        data.append(key, term.trim());
      }
    });

    try {
      const response = await axios.post("list-customer?", data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTableData(response.data.data);
      setTotalRecords(response.data.total_records || 0); // ✅ SET TOTAL

      if (response.data.status === 401) {
        history.push("/");
        localStorage.clear();
      }
      setIsLoading(false);
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



  const bankIdToNameMap = tableData.reduce((map, bank) => {
    map[bank.id] = bank.bank_name;
    return map;
  }, {});

  const handleChangeFilter = (event) => {
    const { value } = event.target;

    if (value.includes("all")) {
      if (paymentMode.length === allOptions.length) {
        // Deselect all options
        setPaymentMode([]);
      } else {
        // Select all options
        setPaymentMode(allOptions);
      }
    } else {
      setPaymentMode(value);
    }

    // setPaymentMode(event.target.value);
  };
  const renderValue = (selected) => {
    return selected
      .map((value) => {
        if (value === "dueOnly") return "Due Only";
        if (value === "active") return "Active";
        if (value === "deactivate") return "Deactivate";
        return bankIdToNameMap[value] || value;
      })
      .join(", ");
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

      <div style={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      }} className="p-6">
        <div
          className="mb-4 cust_list_main_hdr"
          style={{ display: "flex", gap: "4px" }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              width: "200px",
              gap: "7px",
            }}
          >
            <span
              style={{
                color: "var(--color1)",
                display: "flex",
                fontWeight: 700,
                fontSize: "20px",
              }}
            >
              Customers
            </span>
            <BsLightbulbFill className="mt-1 w-6 h-6 secondary hover-yellow" />
          </div>
          <div className="headerList cust_hdr_mn">
            {hasPermission(permissions, "customer import") && (
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
            {hasPermission(permissions, "customer create") && (
              <Button
                variant="contained"
                color="primary"
                style={{
                  background: "var(--color1)",
                  display: "flex",
                }}
                className="gap-2"
                onClick={handelAddOpen}
              >
                <AddIcon /> Add
              </Button>
            )}
            {hasPermission(permissions, "customer download") && (
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
          className="row border-b border-dashed"
          style={{ borderColor: "var(--color2)" }}
        ></div>
        <div className="mt-4">
          {/* <div className="flex gap-2 flex-row pb-2">
            <div className="detail drug_fltr_fld">
              <TextField
                variant="outlined"
                size="small"
                label="Search Customer"
                value={searchTerms}
                onChange={handleSearchChange}
                autoComplete="off"
                sx={{ width: "100%" }}
              />
            </div>
          </div> */}
          <div className=" firstrow px-4 ">

            <div className="overflow-x-auto ">
              <table
                className="w-full border-collapse custom-table"
                style={{
                  whiteSpace: "nowrap",
                  borderCollapse: "separate",
                  borderSpacing: "0 6px",
                }}
              >
                <thead className="">
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
                          <TextField
                            variant="outlined"
                            autoComplete="off"
                            label="Type Here"
                            size="small"
                            sx={{ width: "150px" }}
                            value={searchTerms[index]}
                            onChange={e => handleSearchChange(index, e.target.value)}
                          />
                          {column.label == "Amount" && (
                            <div className="flex mx-2 flex-wrap gap-6">
                              <Chip
                                label="Due Only"
                                style={{
                                  backgroundColor: "var(--COLOR_UI_PHARMACY)",
                                  color: "white",
                                }}
                                value={chipState.value}
                                variant={chipState.variant}
                                onClick={handleChipClick}
                              />
                            </div>
                          )}


                        </div>
                      </th>
                    ))}

                    <th>Action</th>
                  </tr>
                </thead>
                {isLoading ? (
                  <div className="loader-container ">
                    <Loader />
                  </div>
                ) : (
                  <tbody style={{ backgroundColor: "#3f621217" }}>
                    {tableData.length === 0 ? (
                      <tr>
                        <td
                          colSpan={columns.length + 2}
                          style={{
                            textAlign: "center",
                            color: "gray",
                            borderRadius: "10px 10px 10px 10px",
                          }}
                        >
                          No data found
                        </td>
                      </tr>
                    ) : (
                      tableData.map((row, index) => {
                        return (
                          <tr hover role="checkbox" tabIndex={-1} key={row.code}>
                            <td style={{ borderRadius: "10px 0 0 10px" }}>
                              {currentPage == 1 ? index : startIndex + index}

                            </td>
                            {columns.map((column) => {
                              let value = row[column.id];
                              let style = {};

                              // Apply red color if the column is 'due_amount' and status is 'due'
                              if (
                                column.id === "total_amount" &&
                                row.status === "due"
                              ) {
                                style.color = "var(--color6)";
                              } else if (
                                column.id === "total_amount" &&
                                row.status === ""
                              )

                                // Lowercase email if it's not already in lowercase
                                if (column.id === "email") {
                                  if (
                                    value &&
                                    value[0] !== value[0].toLowerCase()
                                  ) {
                                    value = value.toLowerCase();
                                  }
                                  style.textTransform = "none";
                                }

                              return (
                                <td
                                  key={column.id}
                                  align={column.align}
                                  onClick={() => {
                                    history.push(`/customerView/${row.id}`);
                                  }}
                                  style={style}
                                >
                                  {column.format && typeof value === "number"
                                    ? column.format(value)
                                    : value}
                                </td>
                              );
                            })}
                            <td style={{ borderRadius: "0 10px 10px 0" }}>
                              <div
                                style={{
                                  fontSize: "15px",
                                  display: "flex",
                                  gap: "6px",
                                  color: "gray",
                                  cursor: "pointer",
                                }}
                              >
                                <VisibilityIcon
                                  style={{ color: "var(--color1)" }}
                                  onClick={() => {
                                    history.push(`/customerView/${row.id}`);
                                  }}
                                />
                                {hasPermission(permissions, "customer edit") &&
                                  row.name !== "Direct Customers" && (
                                    <BorderColorIcon
                                      style={{ color: "var(--color1)" }}
                                      onClick={() => handleEditOpen(row)}
                                      disabled={row.name == "Direct Customers"}
                                    />
                                  )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                )}
              </table>
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
        {/*<====================================================================== customer upload  =====================================================================> */}
        <Dialog open={openUpload} className="custom-dialog">
          <DialogTitle id="alert-dialog-title " className="primary">
            Import Customer
          </DialogTitle>
          <div className="px-6 ">
            <Alert severity="warning">
              <AlertTitle>Warning</AlertTitle>
              Please Make Sure Repeated Email ID record is not accepted.
            </Alert>
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
                    className="downloadFile"
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
              variant="contained"
              style={{
                backgroundColor: "var(--COLOR_UI_PHARMACY)",
                color: "white",
                width: "100%",
              }}
              onClick={uploadCustomerFile}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
        {/*<====================================================================== add customer  =====================================================================> */}
        <Dialog
          open={openAddPopUp}
          className="custom-dialog"

        >
          <DialogTitle
            id="alert-dialog-title" className="primary"

          >
            {header}
          </DialogTitle>

          <IconButton
            aria-label="close"
            onClick={resetAddDialog}
            className="text-gray-500"
            // sx={{ position: 'absolute', right: 8, top: 8, color: "#ffffff" }}
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
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex flex-col w-full md:w-1/2 lg:w-1/2">
                    <div className="mb-2">
                      <span className="label primary mb-4">
                        Customer Name
                      </span>
                      <span className="text-red-600 ml-1">*</span>
                    </div>
                    <TextField
                      autoComplete="off"
                      id="outlined-multiline-static"
                      size="small"
                      type="name"
                      value={customer}
                      onChange={(e) => {
                        const cst =
                          e.target.value.charAt(0).toUpperCase() +
                          e.target.value.slice(1).toLowerCase();
                        setCustomer(cst);
                      }}

                      style={{ width: "100%" }}
                      variant="outlined"
                    />
                    {errors.customer && (
                      <span style={{ color: "red", fontSize: "12px" }}>
                        {errors.customer}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col w-full md:w-1/2 lg:w-1/2">
                    <div className="mb-2">
                      <span className="label primary mb-4">
                        Mobile No
                      </span>
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
                      style={{ width: "100%" }}
                      size="small"
                    />
                    {errors.mobileNo && (
                      <span style={{ color: "red", fontSize: "12px" }}>
                        {errors.mobileNo}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex flex-col w-full md:w-1/2 lg:w-1/2">
                    <span className="label primary">Email ID</span>
                    <TextField
                      autoComplete="off"
                      id="outlined-multiline-static"
                      size="small"
                      value={emailId}
                      onChange={(e) => {
                        setEmailId(e.target.value);
                      }}
                      style={{ width: "100%" }}
                      variant="outlined"
                    />
                  </div>
                  <div className="flex flex-col w-full md:w-1/2 lg:w-1/2">
                    <span className="label primary">Amount</span>
                    <TextField
                      autoComplete="off"
                      id="outlined-multiline-static"
                      size="small"
                      type="number"
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value);
                      }}
                      style={{ width: "100%" }}
                      variant="outlined"
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex flex-col w-full md:w-1/2 lg:w-1/2">
                    <span className="label primary">Area</span>
                    <TextField
                      autoComplete="off"
                      id="outlined-multiline-static"
                      size="small"
                      value={area}

                      onChange={(e) => {
                        const amt =
                          e.target.value.charAt(0).toUpperCase() +
                          e.target.value.slice(1).toLowerCase();
                        setArea(amt);
                      }}
                      style={{ width: "100%" }}
                      variant="outlined"
                    />
                  </div>
                  <div className="flex flex-col w-full md:w-1/2 lg:w-1/2">
                    <span className="label primary">City</span>
                    <TextField
                      autoComplete="off"
                      id="outlined-multiline-static"
                      size="small"
                      value={city}
                      onChange={(e) => {
                        const city =
                          e.target.value.charAt(0).toUpperCase() +
                          e.target.value.slice(1).toLowerCase();
                        setCity(city);
                      }}
                      style={{ width: "100%" }}
                      variant="outlined"
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex flex-col w-full md:w-1/2 lg:w-1/2">
                    <span className="label primary">Address</span>
                    <TextField
                      autoComplete="off"
                      id="outlined-multiline-static"
                      size="small"
                      value={address}
                      onChange={(e) => {
                        const add =
                          e.target.value.charAt(0).toUpperCase() +
                          e.target.value.slice(1).toLowerCase();
                        setAddress(add);
                      }}
                      style={{ width: "100%" }}
                      variant="outlined"
                    />
                  </div>
                  <div className="flex flex-col w-full md:w-1/2 lg:w-1/2">
                    <span className="label primary">State</span>
                    <TextField
                      autoComplete="off"
                      id="outlined-multiline-static"
                      size="small"
                      value={state}
                      onChange={(e) => {
                        const state =
                          e.target.value.charAt(0).toUpperCase() +
                          e.target.value.slice(1).toLowerCase();
                        setState(state);
                      }}
                      style={{ width: "100%" }}
                      variant="outlined"
                    />
                  </div>
                </div>
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions style={{ padding: "20px 24px" }}>
            <Button
              variant="contained"
              style={{
                backgroundColor: "var(--COLOR_UI_PHARMACY)",
                color: "white",
              }}
              autoFocus
              className="p-5"
              onClick={Addcustomer}
            >
              {buttonLabel}
            </Button>
            <Button
              autoFocus
              variant="contained"
              onClick={resetAddDialog}
              color="error"
            >
              Cancel
            </Button>
          </DialogActions>

        </Dialog>
      </div>

    </>
  );
};

export default CustomerList;
