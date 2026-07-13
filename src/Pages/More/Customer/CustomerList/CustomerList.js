import Loader from "../../../../componets/loader/Loader";
import useSubmitShortcut from "../../../../hooks/useSubmitShortcut";
import Header from "../../../Header";
import React, { useEffect, useState } from "react";
import { BsLightbulbFill } from "react-icons/bs";
import {
  Button,
  Chip,
  InputAdornment,
  OutlinedInput,
  TextField,
  Autocomplete,
} from "@mui/material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Select,
  MenuItem,
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
import ClearIcon from "@mui/icons-material/Clear";

const CustomerList = () => {
  const [isLoading, setIsLoading] = useState(true);
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
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const token = localStorage.getItem("token");
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [buttonLabel, setButtonLabel] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [header, setHeader] = useState("");
  const [customerID, setCustomerID] = useState(null);
  const [popupSearchOptions, setPopupSearchOptions] = useState([]);

  const searchCustomersForPopup = async (query) => {
    if (!query) {
      setPopupSearchOptions([]);
      return;
    }
    let data = new FormData();
    data.append("page", 1);
    data.append("iss_value", "search");
    data.append("customer_name", query);

    try {
      const response = await axios.post("list-customer?", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data && response.data.data) {
        setPopupSearchOptions(response.data.data);
      } else {
        setPopupSearchOptions([]);
      }
    } catch (error) {
      console.error("Popup search API error:", error);
    }
  };
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

      if (errors.mobileNo) {
        setErrors((prev) => ({
          ...prev,
          mobileNo: "",
        }));
      }
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
    setPopupSearchOptions([]);
    setCustomerID(null);
    setIsEditMode(false);
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

  const validateForm = () => {
    const newErrors = {};

    // 1. Customer Name validation (Compulsory *)
    if (!customer) {
      newErrors.customer = "Customer Name is required";
    } else if (!/^[a-zA-Z0-9\s.,&'-]{2,100}$/.test(customer)) {
      newErrors.customer = "Enter a valid Customer Name (2-100 characters)";
    }

    // 2. Mobile No validation (Compulsory *)
    if (!mobileNo) {
      newErrors.mobileNo = "Mobile No is required";
    } else if (!/^[6-9]\d{9}$/.test(mobileNo)) {
      newErrors.mobileNo = "Enter a valid 10-digit mobile number starting with 6-9";
    }

    // 3. Email ID validation (Optional)
    if (emailId && emailId.trim()) {
      if (!/^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com)$/i.test(emailId)) {
        newErrors.emailId = "Enter a valid email address";
      }
    }

    // 4. Amount validation (Optional)
    if (amount !== "" && amount !== null && amount !== undefined) {
      if (!/^\d+(\.\d{1,2})?$/.test(amount.toString()) || Number(amount) < 0) {
        newErrors.amount = "Enter a valid positive amount";
      }
    }

    // 5. Area validation (Optional)
    if (area && area.trim()) {
      if (!/^[a-zA-Z0-9\s.,'-]{2,50}$/.test(area)) {
        newErrors.area = "Enter a valid Area (2-50 characters)";
      }
    }

    // 6. City validation (Optional)
    if (city && city.trim()) {
      if (!/^[a-zA-Z\s.'-]{2,50}$/.test(city)) {
        newErrors.city = "Enter a valid City (2-50 characters)";
      }
    }

    // 7. State validation (Optional)
    if (state && state.trim()) {
      if (!/^[a-zA-Z\s.'-]{2,50}$/.test(state)) {
        newErrors.state = "Enter a valid State (2-50 characters)";
      }
    }

    // 8. Address validation (Optional)
    if (address && address.trim()) {
      if (address.length > 200) {
        newErrors.address = "Address must be under 200 characters";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const Addcustomer = () => {
    const isValid = validateForm();
    if (isValid) {
      if (isEditMode === false) {
        AddCustomerRecord();
      } else {
        EditCustomerRecord();
      }
    }
    return isValid;
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
        }, 500); // ✅ DEBOUNCE
      }
    }
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [searchTrigger]);

  useEffect(() => {
    customerAllData(currentPage, searchTerms, rowsPerPage);
  }, [currentPage, rowsPerPage]);


  const customerAllData = async (page = 1, customSearchTerms = searchTerms, limit = rowsPerPage) => {
    let data = new FormData();
    setIsLoading(true);
    data.append("page", page);
    data.append("limit", limit);
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

  useSubmitShortcut(Addcustomer, openAddPopUp);

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
                <AddIcon /> Add Customer
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

            <div className="overflow-x-auto " style={{ maxHeight: '75vh', overflowY: 'auto', scrollbarWidth: 'none', position: 'relative' }}>
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
                    <th>SR. No</th>
                    {columns.map((column, index) => (
                      <th key={column.id} style={{ minWidth: column.minWidth }}>
                        <div className="headerStyle">
                          <span>{column.label}</span>
                          <SwapVertIcon
                            style={{ cursor: "pointer" }}
                            onClick={() => sortByColumn(column.id)}
                          />
                          {/* <TextField
                            variant="outlined"
                            autoComplete="off"
                            label="Type Here"
                            size="small"
                            sx={{ width: "150px" }}
                            value={searchTerms[index]}
                            onChange={e => handleSearchChange(index, e.target.value)}
                          /> */}
                          <TextField
                            variant="outlined"
                            autoComplete="off"
                            label="Type Here"
                            size="small"
                            sx={{ width: "150px" }}
                            value={searchTerms[index]}
                            onChange={e => handleSearchChange(index, e.target.value)}
                            InputProps={{
                              endAdornment: searchTerms[index] ? (
                                <InputAdornment position="end">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleSearchChange(index, "")}
                                    edge="end"
                                  >
                                    <ClearIcon fontSize="small" />
                                  </IconButton>
                                </InputAdornment>
                              ) : null,
                            }}
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
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={columns.length + 2}
                        style={{ position: "relative", height: "400px" }}
                      >
                        <Loader />
                      </td>
                    </tr>
                  ) : tableData.length === 0 ? (
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
                            // Replace null, undefined, or empty string with "-"
                            if (!value && value !== 0) {
                              value = "-";
                            }

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
                                sx={{
                                  color: "#2563eb", // Blue
                                  cursor: "pointer",
                                  "&:hover": {
                                    color: "#1d4ed8", // Dark Blue on hover
                                  },
                                }}
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
                    <Autocomplete
                      freeSolo
                      id="customer-autocomplete"
                      options={popupSearchOptions}
                      getOptionLabel={(option) => {
                        if (typeof option === "string") return option;
                        return option.name || "";
                      }}
                      value={customer}
                      onInputChange={(event, newInputValue) => {
                        const formattedVal =
                          newInputValue.charAt(0).toUpperCase() +
                          newInputValue.slice(1).toLowerCase();
                        setCustomer(formattedVal);

                        if (errors.customer) {
                          setErrors((prev) => ({
                            ...prev,
                            customer: "",
                          }));
                        }

                        searchCustomersForPopup(formattedVal);
                      }}
                      onChange={(event, newValue) => {
                        if (newValue && typeof newValue === "object") {
                          setCustomerID(newValue.id);
                          setIsEditMode(true);
                          setHeader("Edit Customer");
                          setButtonLabel("Update");
                          setCustomer(newValue.name || "");
                          setMobileNo(newValue.phone_number || "");
                          setEmailId(newValue.email || "");
                          setAmount(newValue.balance || 0);
                          setArea(newValue.area || "");
                          setCity(newValue.city || "");
                          setState(newValue.state || "");
                          setAddress(newValue.address || "");
                          setErrors({});
                        } else if (!newValue) {
                          setCustomerID(null);
                          setIsEditMode(false);
                          setHeader("Add Customer");
                          setButtonLabel("Save");
                          setCustomer("");
                          setMobileNo("");
                          setEmailId("");
                          setAmount(0);
                          setArea("");
                          setCity("");
                          setState("");
                          setAddress("");
                          setErrors({});
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          autoComplete="off"
                          size="small"
                          placeholder="Customer Name"
                          error={!!errors.customer}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: errors.customer
                                  ? "#d32f2f"
                                  : "rgba(0, 0, 0, 0.23)",
                              },
                              "&.Mui-error .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#d32f2f !important",
                              },
                            },
                          }}
                          style={{ width: "100%" }}
                          variant="outlined"
                        />
                      )}
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
                      placeholder="Mobile Number"
                      error={!!errors.mobileNo}
                      sx={{
                        "&.Mui-error .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#d32f2f !important",
                        },
                      }}
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
                      placeholder="Email"
                      error={!!errors.emailId}
                      onChange={(e) => {
                        setEmailId(e.target.value);
                        if (errors.emailId) {
                          setErrors((prev) => ({
                            ...prev,
                            emailId: "",
                          }));
                        }
                      }}
                      style={{ width: "100%" }}
                      variant="outlined"
                    />
                    {errors.emailId && (
                      <span style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                        {errors.emailId}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col w-full md:w-1/2 lg:w-1/2">
                    <span className="label primary">Amount</span>
                    <TextField
                      autoComplete="off"
                      id="outlined-multiline-static"
                      size="small"
                      type="number"
                      value={amount}
                      placeholder="Amount"
                      error={!!errors.amount}
                      onChange={(e) => {
                        setAmount(e.target.value);
                        if (errors.amount) {
                          setErrors((prev) => ({
                            ...prev,
                            amount: "",
                          }));
                        }
                      }}
                      style={{ width: "100%" }}
                      variant="outlined"
                    />
                    {errors.amount && (
                      <span style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                        {errors.amount}
                      </span>
                    )}
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
                      placeholder="Area"
                      error={!!errors.area}
                      onChange={(e) => {
                        const amt =
                          e.target.value.charAt(0).toUpperCase() +
                          e.target.value.slice(1).toLowerCase();
                        setArea(amt);
                        if (errors.area) {
                          setErrors((prev) => ({
                            ...prev,
                            area: "",
                          }));
                        }
                      }}
                      style={{ width: "100%" }}
                      variant="outlined"
                    />
                    {errors.area && (
                      <span style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                        {errors.area}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col w-full md:w-1/2 lg:w-1/2">
                    <span className="label primary">City</span>
                    <TextField
                      autoComplete="off"
                      id="outlined-multiline-static"
                      size="small"
                      value={city}
                      placeholder="City"
                      error={!!errors.city}
                      onChange={(e) => {
                        const cityVal =
                          e.target.value.charAt(0).toUpperCase() +
                          e.target.value.slice(1).toLowerCase();
                        setCity(cityVal);
                        if (errors.city) {
                          setErrors((prev) => ({
                            ...prev,
                            city: "",
                          }));
                        }
                      }}
                      style={{ width: "100%" }}
                      variant="outlined"
                    />
                    {errors.city && (
                      <span style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                        {errors.city}
                      </span>
                    )}
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
                      placeholder="Address"
                      error={!!errors.address}
                      onChange={(e) => {
                        const addVal =
                          e.target.value.charAt(0).toUpperCase() +
                          e.target.value.slice(1).toLowerCase();
                        setAddress(addVal);
                        if (errors.address) {
                          setErrors((prev) => ({
                            ...prev,
                            address: "",
                          }));
                        }
                      }}
                      style={{ width: "100%" }}
                      variant="outlined"
                    />
                    {errors.address && (
                      <span style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                        {errors.address}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col w-full md:w-1/2 lg:w-1/2">
                    <span className="label primary">State</span>
                    <TextField
                      autoComplete="off"
                      id="outlined-multiline-static"
                      size="small"
                      value={state}
                      placeholder="State"
                      error={!!errors.state}
                      onChange={(e) => {
                        const stateVal =
                          e.target.value.charAt(0).toUpperCase() +
                          e.target.value.slice(1).toLowerCase();
                        setState(stateVal);
                        if (errors.state) {
                          setErrors((prev) => ({
                            ...prev,
                            state: "",
                          }));
                        }
                      }}
                      style={{ width: "100%" }}
                      variant="outlined"
                    />
                    {errors.state && (
                      <span style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                        {errors.state}
                      </span>
                    )}
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
              style={{
                marginLeft: "8px",
                backgroundColor: "#dbdce0",
                color: "#4b5563",
                border: "1px solid #d1d5db",
                boxShadow: "none",
                textTransform: "none",
              }}
              sx={{
                "&:hover": {
                  backgroundColor: "#c9cacd !important",
                  boxShadow: "none",
                },
              }}
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
