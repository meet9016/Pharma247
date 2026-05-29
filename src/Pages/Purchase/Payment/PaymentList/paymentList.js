import Header from "../../../Header";
import Autocomplete from "@mui/material/Autocomplete";
import Select from "@mui/material/Select";
import dayjs from "dayjs";
import {
  Box,
  Button,
  DialogContentText,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import axios from "axios";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import "./paymentList.css";
import Loader from "../../../../componets/loader/Loader";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { toast, ToastContainer } from "react-toastify";
import usePermissions, {
  hasPermission,
} from "../../../../componets/permission";

const PaymentList = () => {
  const history = useHistory();
  const rowsPerPage = 10;
  const token = localStorage.getItem("token");
  const permissions = usePermissions();

  const columns = [
    { id: "bill_no", label: "Bill No", minWidth: 150, height: 100 },
    { id: "distributor_name", label: "Distributor Name", minWidth: 150 },
    { id: "payment_date", label: "Payment Date", minWidth: 150 },
    { id: "payment_mode", label: "Payment Mode", minWidth: 150 },
    { id: "status", label: "Status", minWidth: 150 },
    { id: "bill_amount", label: "Bill Amount", minWidth: 150 },
    { id: "paid_amount", label: "Paid Amount", minWidth: 150 },
    { id: "due_amount", label: "Due Amount", minWidth: 150 },
  ];
  const searchKeys = [
    "bill_no",
    "distributor_id",
    "payment_date",
    "payment_mode",
    "status",
    "bill_amount",
    "paid_amount",
    "due_amount",
  ];

  // Enhanced search and pagination state (copied from OrderList)
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

  // Search state management (copied from OrderList)
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchTrigger, setSearchTrigger] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeout = useRef(null);
  const currentSearchTerms = useRef(searchTerms);

  const [editId, setEditId] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const [open, setOpen] = useState(false);
  const [openBill, setopenBill] = useState(false);
  const [showTable, setShowTable] = useState(true);
  const [totalpayAmount, setTotalpayAmount] = useState(0.0);
  const [pendingAmount, setPendingAmount] = useState(0);
  const [distributor, setDistributor] = useState(null);
  const [distributorValue, setDistributorValue] = useState(null);
  const [distributorId, setDistributorId] = useState(null);
  const [distributorsId, setDistributorsId] = useState(null);
  const [distributorList, setDistributorList] = useState([]);
  const [note, setNote] = useState("");
  const [paymentLabel, setPaymentLabel] = useState("");
  const [buttonLabel, setButtonLabel] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date());
  const [amounts, setAmounts] = useState({});

  const [payMode, setPayMode] = useState("");
  const [paymentList, setPaymentList] = useState("");
  const [errors, setErrors] = useState({});
  const [tableData, setTableData] = useState([]);
  const [purchaseBill, setPurchaseBill] = useState([]);

  const totalPages = Math.ceil(totalRecords / rowsPerPage);
  const [isEditMode, setIsEditMode] = useState(false);
  const [paymentType, setPaymentType] = useState("");
  const [bankData, setBankData] = useState([]);

  const paymentOptions = [
    { value: "cash", label: "Cash" },
    { value: "credit", label: "Credit" },
    { value: "upi", label: "UPI" },
    { value: "cheque", label: "Cheque" },
    { value: "paytm", label: "Paytm" },
    { value: "rtgs/neft", label: "RTGS/NEFT" },
  ];

  // Effect for handling search with debouncing (copied from OrderList)
  useEffect(() => {
    if (searchTrigger > 0) {
      // Clear previous timeout
      clearTimeout(searchTimeout.current);

      // Check if any search term has a value
      const hasSearchTerms = currentSearchTerms.current.some(term => {
        if (!term) return false;
        const stringTerm = String(term).trim();
        return stringTerm !== '';
      });
      if (!hasSearchTerms) {
        // If no search terms, clear the search immediately
        setIsSearching(false);
        paymentBillList(1, true);
      } else {
        // Show searching state immediately
        setIsSearching(true);

        // Debounce the search to avoid too many API calls
        searchTimeout.current = setTimeout(() => {
          paymentBillList(1, true);
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
      paymentBillList(currentPage);
    }
  }, [currentPage]);

  useEffect(() => {
    paymentBillList(1);
    listDistributor();
    BankList();
  }, []);

  useEffect(() => {
    if (distributorId && purchaseBill?.pruches_bill) {
      const initialAmounts = {};
      purchaseBill.pruches_bill.forEach((row, index) => {
        initialAmounts[index] = row.pending_amount;
      });
      setAmounts(initialAmounts);
    }
  }, [distributorId, purchaseBill]);

  useEffect(() => {
    const total = Object.values(amounts)
      .map((amount) => parseFloat(amount) || 0)
      .reduce((acc, amount) => acc + amount, 0);
    setTotalpayAmount(total);
  }, [amounts]);

  // Enhanced search functionality (copied from OrderList)
  const handleSearchChange = (index, value) => {
    const newSearchTerms = [...searchTerms];
    newSearchTerms[index] = value;

    // Update ref immediately for API calls
    currentSearchTerms.current = newSearchTerms;

    // Update state immediately for UI responsiveness
    setSearchTerms(newSearchTerms);

    // Check if any search term has a value
    const hasSearchTerms = currentSearchTerms.current.some(term => term && String(term).trim()); setIsSearchActive(hasSearchTerms);

    // Reset to page 1 when searching
    setCurrentPage(1);

    // Trigger search effect immediately
    setSearchTrigger(prev => prev + 1);
  };

  // Handle search on Enter key press
  const handleSearchSubmit = () => {
    setCurrentPage(1);
    paymentBillList(1);
  };

  // Handle search on Enter key press for specific field
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchSubmit();
    }
  };

  // Enhanced pagination functions (copied from OrderList)
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

  const handleEditOpen = (row) => {
    setOpen(true);
    setShowTable(false);
    setIsEditMode(true);
    setPaymentLabel("Edit Payment");
    setButtonLabel("Update");
    setPaymentType(row?.payment_mode);
    setEditId(row?.id);
    setDistributor(row?.distributor_name);
    setDistributorsId(row?.distributor_id);
    setNote(row?.note);
  };

  const handelAddOpen = () => {
    setOpen(true);
    setShowTable(true);
    setPaymentLabel("Add New Payment");
    setButtonLabel("Save ");
  };

  const handlePermission = () => {
    const newErrors = {};
    if (isEditMode == false) {
      if (!distributor) newErrors.distributor = "Distributor is required";
      if (!paymentType) newErrors.paymentType = "Select Any Payment Mode";
      setErrors(newErrors);
      const isValid = Object.keys(newErrors).length === 0;
      if (isValid) {
        setConfirm(true);
      }
      return isValid;
    } else {
      submitPayment();
    }
  };

  const openBillDetails = () => {
    const newErrors = {};
    if (!distributorValue) {
      newErrors.distributorValue = "Distributor is required";
      toast.dismiss();
toast.error(newErrors.distributorValue);
    }
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    if (isValid) {
      setopenBill(true);
    }
    return isValid;
  };

  const BankList = async () => {
    let data = new FormData();
    try {
      await axios
        .post("bank-list", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setBankData(response.data.data);
          if (response.data.status === 401) {
            history.push("/");
            localStorage.clear();
          }
        });
    } catch (error) {
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

  const submitPayment = async () => {
    let data = new FormData();
    if (isEditMode == true) {
      data.append("distributor_id", distributorsId);
      data.append("id", editId);
    } else {
      data.append("distributor_id", distributorId);
    }
    data.append(
      "payment_date",
      paymentDate ? format(paymentDate, "yyyy-MM-dd") : ""
    );
    data.append("payment_mode", paymentType);
    data.append("note", note);
    data.append("total", totalpayAmount);
    if (isEditMode == false) {
      const paymentList = purchaseBill?.pruches_bill.map((row, index) => {
        return {
          id: row.id,
          bill_no: row.bill_no,
          paid_amount:
            amounts[index] !== undefined ? amounts[index] : row.pending_amount,
          bill_date: row.date,
          bill_amount: row.net_amount,
          pending_amount: row.pending_amount,
        };
      });
      data.append("payment_list", JSON.stringify(paymentList));
    }
    setIsLoading(true);
    const params = {
      id: editId,
    };

    try {
      isEditMode == false
        ? await axios
          .post("purches-payment-store", data, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            setPaymentList(response?.data?.data);
            listDistributor();
            setIsLoading(false);
            setConfirm(false);
            setOpen(false);
            paymentBillList(currentPage);
            setDistributor(null);
            setPaymentType("");
            setErrors({});
            setNote("");
            setAmounts(0);
             toast.dismiss();
toast.success(response.data.meassage);
            setPurchaseBill([]);
            if (response.data.status === 401) {
              history.push("/");
              localStorage.clear();
            }
          })
        : await axios
          .post("purches-payment-edit", data, {
            params: params,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            setPaymentList(response?.data?.data);
            setIsLoading(false);
            setConfirm(false);
            setOpen(false);
            paymentBillList(currentPage);
            setDistributor(null);
            setPaymentType("");
            setErrors({});
            setNote("");
            setAmounts(0);
            setPurchaseBill([]);
            if (response.data.status === 401) {
              history.push("/");
              localStorage.clear();
            }
          });
    } catch (error) {
         if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
      setIsLoading(false);
      console.error("API error:", error);
    }
  };

  const PurchasePaymentList = async (distributorId) => {
    let data = new FormData();
    data.append("distributor_id", distributorId);
    const params = {
      distributor_id: distributorId,
    };
    try {
      await axios
        .post("purches-payment-list?", data, {
          params: params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setPurchaseBill(response?.data?.data);
        });
    } catch (error) {
         if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
      setIsLoading(false);
      console.error("API error:", error);
    }
  };

  const listDistributor = async () => {
    try {
      const response = await axios.post(`distributor-payment`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status === 401) {
        history.push("/");
        localStorage.clear();
      }
      const distributors = response.data.data;
      localStorage.setItem("distributor", JSON.stringify(distributors));
      setDistributorList(distributors);
      return distributors;
    } catch (error) {
         if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
      console.error("API Error fetching distributors:", error);
      return [];
      
    }
  };

  // Enhanced paymentBillList function with search and pagination (copied from OrderList)
  const paymentBillList = async (page, isSearch = false) => {
    if (!page) return;

    let data = new FormData();
    data.append("page", page);

    // Add search parameters when any search term has a value
    currentSearchTerms.current.forEach((term, index) => {
      if (term !== "" && term !== undefined && term !== null) {
        const value = String(term).trim();
        if (value !== "") {
          data.append(searchKeys[index], value);
        }
      }
    });


    // Use different loading states for search vs regular operations
    setIsSearchLoading(true);

    try {
      const response = await axios.post("payment-purches-list?", data, {
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
      const totalCount = response.data.total_records || responseData?.length || 0;
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

  const handleClose = () => {
    setOpen(false);
    setDistributor(null);
    setIsEditMode(false);
    setErrors({});
    setPaymentType("");
    setNote("");
    setAmounts(0);
    setPurchaseBill([]);
  };

  const handleDistributor = (e, value) => {
    setDistributor(value);
    setDistributorId(value?.id);
    if (value) {
      PurchasePaymentList(value?.id);
    }
  };

  const handleDistributorBillList = (e, value) => {
    setDistributorValue(value);
    if (value) {
      setDistributorId(value.id);
      PurchasePaymentList(value.id);
    }
  };

  const handleAmountChange = (index, row, value) => {
    const pendingAmount = row.pending_amount;
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      if (numericValue <= pendingAmount) {
        setAmounts((prevAmounts) => ({
          ...prevAmounts,
          [index]: numericValue,
        }));
      } else {
        setAmounts((prevAmounts) => ({
          ...prevAmounts,
          [index]: pendingAmount,
        }));
      }
    } else {
      setAmounts((prevAmounts) => ({
        ...prevAmounts,
        [index]: 0,
      }));
    }
  };

  // Render
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
            <div className="p-6">
              <div
                className="mb-4 purch_hdr_mn"
                style={{ display: "flex", gap: "2px" }}
              >
                <span
                  style={{
                    color: "var(--color1)",
                    display: "flex",
                    whiteSpace: "nowrap",
                    alignItems: "center",
                    fontWeight: 700,
                    fontSize: "20px",
                  }}
                >
                  Purchase Payment
                </span>
                {hasPermission(permissions, "purchase payment create") && (
                  <div className="headerList">
                    <Button
                      variant="contained"
                      className="sale_add_btns gap-2"
                      size="small"
                      style={{ fontSize: "14px", background: "var(--color1)" }}
                      onClick={handelAddOpen}
                    >
                      <AddIcon />
                      Add New Payment
                    </Button>
                  </div>
                )}
                <div className="detail drug_fltr_fld headerList">
                  <Autocomplete
                    value={distributorValue}
                    sx={{
                      width: "100%",
                    }}
                    size="small"
                    autoFocus
                    onChange={handleDistributorBillList}
                    options={distributorList}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => (
                      <TextField
                        autoFocus
                        {...params}
                        label="Search Distributor Name"
                      />
                    )}
                  />
                </div>
                <div style={{ justifyContent: "end", display: "flex" }}>
                  <Button
                    className="serch_btn_ad"
                    style={{ background: "var(--color1)" }}
                    variant="contained"
                    onClick={openBillDetails}
                  >
                    Search
                  </Button>
                </div>
              </div>
              <div
                className="row border-b border-dashed"
                style={{ borderColor: "var(--color2)" }}
              ></div>
              <div className="firstrow mt-4">
                <div className="overflow-x-auto mt-4 ">
                  <table
                    className="w-full bg-transparent border-collapse custom-table pt-2"
                    style={{
                      whiteSpace: "nowrap",
                      borderCollapse: "separate",
                      borderSpacing: "0 6px",
                    }}
                  >
                    <thead className="">
                      <tr>
                        <th style={{ minWidth: 150, padding: '8px' }}>SR. No</th>
                        {columns.map((column, index) => (
                          <th key={column.id} style={{ minWidth: column.minWidth, padding: '8px' }}>
                            <div className="headerStyle" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <span>{column.label}</span>
                                <SwapVertIcon
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => sortByColumn(column.id)}
                                />
                              </div>
                              {/* Search controls based on column type */}
                              {column.id === "distributor_name" ? (
                                <Autocomplete
                                  value={
                                    distributorList.find(
                                      (dist) => dist.name?.toString().toLowerCase() === searchTerms[index]?.toString().toLowerCase()
                                    ) || null
                                  }
                                  sx={{ width: 150 }}
                                  size="small"
                                  autoFocus
                                  onChange={(_, val) => handleSearchChange(index, val ? val.id : "")}

                                  options={distributorList}
                                  getOptionLabel={(opt) => opt.name || ""}


                                  renderInput={(params) => (
                                    <TextField {...params} placeholder="Distributor" variant="outlined" />
                                  )}
                                />
                              ) : column.id === "payment_mode" ? (
                                <Autocomplete
                                  options={[
                                    { id: "", name: "All" },
                                    { id: "cash", name: "Cash" },
                                    { id: "credit", name: "Credit" },
                                    ...bankData.map(bank => ({ id: bank.id, name: bank.bank_name }))
                                  ]}
                                  getOptionLabel={(opt) => opt.name || ""}
                                  value={
                                    [
                                      { id: "", name: "All" },
                                      { id: "cash", name: "Cash" },
                                      { id: "credit", name: "Credit" },
                                      ...bankData.map(bank => ({ id: bank.id, name: bank.bank_name }))
                                    ].find(mode => mode.id?.toString() === searchTerms[index]?.toString()) || { id: "", name: "All" }
                                  }
                                  onChange={(_, val) => handleSearchChange(index, val ? val.id : "")}
                                  size="small"
                                  sx={{ width: 150 }}
                                  renderInput={(params) => (
                                    <TextField {...params} placeholder="Payment Mode" variant="outlined" />
                                  )}
                                />
                              ) : column.id === "status" ? (
                                <Autocomplete
                                  options={[
                                    { value: "", label: "All" },
                                    { value: "paid", label: "Paid" },
                                    { value: "partially Paid", label: "Partially Paid" }
                                  ]}
                                  getOptionLabel={(opt) => opt.label || ""}
                                  value={
                                    [
                                      { value: "", label: "All" },
                                      { value: "paid", label: "Paid" },
                                      { value: "partially Paid", label: "Partially Paid" }
                                    ].find(status => status.value === searchTerms[index]) || { value: "", label: "All" }
                                  }
                                  onChange={(_, val) => handleSearchChange(index, val ? val.value : "")}
                                  size="small"
                                  sx={{ width: 150 }}
                                  renderInput={(params) => (
                                    <TextField {...params} placeholder="Status" variant="outlined" />
                                  )}
                                />
                              ) : (
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
                              )}
                            </div>
                          </th>
                        ))}
                        {hasPermission(permissions, "purchase payment edit") && (
                          <th style={{ minWidth: 120, padding: '8px' }}>Action</th>
                        )}
                      </tr>
                    </thead>

                    {isSearchLoading ? (
                      <tbody>
                        <tr>
                          <td colSpan={columns.length + 2} style={{ textAlign: 'center', padding: '20px' }}>
                            <Loader />
                          </td>
                        </tr>
                      </tbody>
                    ) : (
                      <tbody style={{ background: "#3f621217" }}>
                        {tableData.length === 0 ? (
                          <tr>
                            <td
                              colSpan={columns.length + 2}
                              className="text-center py-4 text-gray-500"
                              style={{
                                textAlign: "center",
                                borderRadius: "10px 10px 10px 10px",
                              }}
                            >
                              No data found
                            </td>
                          </tr>
                        ) : (
                          tableData.map((row, index) => (
                            <tr key={row.code || index} className="bg-[#f5f8f3] align-middle">
                              <td className="rounded-l-[10px] px-4 py-2 font-semibold text-center">
                                {((currentPage - 1) * rowsPerPage) + index + 1}
                              </td>
                              {columns.map((column) => {
                                const value = row[column.id] || "-";
                                const isDueAmount = column.id === "due_amount";
                                const isStatus = column.id === "status";
                                const dueAmountClass = isDueAmount && value > 0 ? "text-red-500" : "text-black";
                                const statusClass = isStatus && value === "Paid"
                                  ? "orderStatus"
                                  : isStatus && value === "Partially Paid"
                                    ? "pendingStatus"
                                    : "text-black";

                                return (
                                  <td
                                    key={column.id}
                                    className="px-4 py-2 font-semibold text-center capitalize"
                                    align={column.align}
                                  >
                                    <span
                                      className={`text ${isStatus ? statusClass : isDueAmount ? dueAmountClass : "text-black"}`}
                                    >
                                      {column.format && typeof value === "number"
                                        ? column.format(value)
                                        : value}
                                    </span>
                                  </td>
                                );
                              })}
                              {hasPermission(permissions, "purchase payment edit") && (
                                <td className="rounded-r-[10px] px-4 py-2 text-center">
                                  <div className="px-2 flex gap-1 justify-center">
                                    <BorderColorIcon
                                      className="cursor-pointer"
                                      onClick={() => handleEditOpen(row)}
                                      style={{ color: "var(--color1)" }}
                                    />
                                  </div>
                                </td>
                              )}
                            </tr>
                          ))
                        )}
                      </tbody>
                    )}
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

          <Dialog
            open={open}
            className="custom-dialog modal_991
          _991"
          >
            <DialogTitle style={{ fontWeight: 700 }} id="alert-dialog-title  ">
              {paymentLabel}
            </DialogTitle>
            <IconButton
              aria-label="close"
              onClick={handleClose}
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
                <div className="flex sm:flex-nowrap flex-wrap gap-4">
                  <div style={{ width: "100%" }}>
                    <span className="label primary">Distributor Name <span className="text-red-600">*</span></span>
                    {isEditMode == true ? (
                      <TextField
                        autoComplete="off"
                        id="outlined-multiline-static"
                        disabled
                        size="small"
                        value={distributor}
                        sx={{ width: "100%" }}
                        rows={2}
                        variant="outlined"
                      />
                    ) : (
                      <>
                        <Autocomplete
                          value={distributor}
                          disabled={!showTable}
                          // sx={{ minWidth: 730 }}
                          size="small"
                          autoFocus
                          onChange={handleDistributor}
                          options={distributorList}
                          getOptionLabel={(option) => option.name}
                          renderInput={(params) => <TextField {...params} />}
                        />
                        {errors.distributor && (
                          <span style={{ color: "red", fontSize: "12px" }}>
                            {errors.distributor}
                          </span>
                        )}
                      </>
                    )}
                  </div>

                </div>
                <div className="flex sm:flex-nowrap flex-wrap gap-4">

                  <div style={{ width: "100%" }}>
                    <span className="label primary">Payment Date <span className="text-red-600">*</span></span>
                    {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DatePicker
                                                        value={paymentDate}
                                                        onChange={(newDate) => setPaymentDate(newDate)}
                                                        format="DD/MM/YYYY"
                                                        sx={{ minWidth: 260 }}
                                                    />
                                                </LocalizationProvider> */}

                    <DatePicker
                      className="custom-datepicker "
                      selected={paymentDate}
                      onChange={(newDate) => setPaymentDate(newDate)}
                      dateFormat="dd/MM/yyyy"
                      minDate={new Date()} //
                    />
                  </div>
                  <div style={{ width: "100%" }}>
                    <span className="label primary">Payment Mode <span className="text-red-600">*</span></span>
                    <Select
                      labelId="dropdown-label"
                      id="dropdown"
                      value={paymentType}
                      sx={{ width: "100%" }}
                      onChange={(e) => {
                        setPaymentType(e.target.value);
                      }}
                      size="small"
                    >
                      <MenuItem selected value="cash">Cash</MenuItem>
                      <MenuItem value="credit">Credit</MenuItem>
                      {bankData?.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.bank_name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.paymentType && (
                      <span style={{ color: "red", fontSize: "12px" }}>
                        {errors.paymentType}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span className="label primary">Note</span>
                  <TextField
                    autoComplete="off"
                    id="outlined-multiline-static"
                    multiline
                    size="small"
                    value={note}
                    onChange={(e) => {
                      const input = e.target.value;
                      const formatted = input.replace(/\b\w/g, (char) => char.toUpperCase());
                      setNote(formatted);
                    }}
                    style={{ width: "100%" }}
                    rows={2}
                    variant="outlined"
                  />
                </div>
                <div className="overflow-x-auto mt-4">
                  {showTable && (
                    <table className="invoice-table w-full border-collapse custom-table">
                      <thead>
                        <tr style={{ whiteSpace: "nowrap" }}>
                          <th style={{ minWidth: "100px" }}>Bill No</th>
                          <th style={{ minWidth: "100px" }}>Date</th>
                          <th style={{ minWidth: "100px" }}>Bill Amount</th>
                          <th style={{ minWidth: "100px" }}>Action</th>
                        </tr>
                      </thead>
                      {purchaseBill?.pruches_bill && distributorId ? (
                        <tbody>
                          {purchaseBill?.pruches_bill.map((row, index) => {
                            return (
                              <>
                                <tr
                                  hover
                                  role="checkbox"
                                  tabIndex={-1}
                                  key={row.code}
                                  style={{ whiteSpace: "nowrap" }}
                                >
                                  <td>{row.bill_no}</td>
                                  <td>{row.date}</td>
                                  <td>
                                    <div>
                                      <div>
                                        <span>{row.net_amount}</span>
                                      </div>
                                      <div style={{ color: "red" }}>
                                        <span>
                                          Pending: Rs.{row.pending_amount}{" "}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <OutlinedInput
                                      type="number"
                                      value={
                                        amounts[index] !== undefined
                                          ? amounts[index]
                                          : pendingAmount
                                      }
                                      // value={amounts[index] || ''}
                                      onChange={(e) =>
                                        handleAmountChange(
                                          index,
                                          row,
                                          e.target.value
                                        )
                                      }
                                      startAdornment={
                                        <InputAdornment position="start">
                                          Rs.
                                        </InputAdornment>
                                      }
                                      sx={{ width: 150, m: 1 }}
                                      size="small"
                                    />
                                  </td>
                                </tr>
                              </>
                            );
                          })}
                          <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>
                              <span
                                style={{
                                  fontSize: "14px",
                                  fontWeight: 800,
                                  color: "var(--COLOR_UI_PHARMACY)",
                                }}
                              >
                                Rs.{totalpayAmount}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      ) : (
                        <tbody>
                          <tr>
                            <div
                              className="pt-3"
                              style={{
                                textAlign: "center",
                                whiteSpace: "nowrap",
                              }}
                            >
                              No Record Found
                            </div>
                          </tr>
                        </tbody>
                      )}
                    </table>
                  )}
                </div>
              </DialogContentText>
            </DialogContent>
            <DialogActions style={{ padding: "0 24px 24px" }}>
              <Button
                autoFocus
                style={{
                  backgroundColor: "var(--COLOR_UI_PHARMACY)",
                }}
                variant="contained"
                onClick={handlePermission}
              >
                {buttonLabel}
              </Button>
            </DialogActions>
          </Dialog>

          {/* warining */}
          <Dialog open={confirm}>
            <DialogTitle>
              {" "}
              <WarningAmberRoundedIcon
                sx={{ color: "red", marginBottom: "5px", fontSize: "2.5rem" }}
              />{" "}
              Warning
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                This amount is not editable. Are you sure you want to proceed
                with this amount?{" "}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button autoFocus variant="contained" onClick={submitPayment}>
                Yes
              </Button>
              <Button
                autoFocus
                variant="outlined"
                onClick={() => setConfirm(false)}
              >
                No
              </Button>
            </DialogActions>
          </Dialog>

          {/* Pending Purchase Bill List */}
          <Dialog open={openBill} className="custom-dialog modal_991">
            <DialogTitle> Distributor Pending Bill Details</DialogTitle>
            <DialogContent>
              <DialogContentText>
                <label className="block text-gray-700 font-bold mb-2 mt-3">
                  Distributor Name:- {distributorValue?.name}
                </label>
                <table className="invoice-table">
                  <thead>
                    <tr className="text-black">
                      <th>Bill No</th>
                      <th>Date</th>
                      <th>Bill Amount</th>
                    </tr>
                  </thead>
                  {purchaseBill?.pruches_bill && distributorId ? (
                    <tbody>
                      {purchaseBill?.pruches_bill.map((row, index) => {
                        return (
                          <>
                            <tr
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={row.code}
                              className="text-gray-900"
                            >
                              <td>{row.bill_no}</td>
                              <td>{row.date}</td>
                              <td>
                                <span>{row.net_amount}</span>
                              </td>
                            </tr>
                          </>
                        );
                      })}
                      <tr>
                        <td></td>
                        <td></td>
                        <td>
                          <span
                            style={{
                              fontSize: "14px",
                              fontWeight: 700,
                              color: "black",
                            }}
                          >
                            Rs.{parseFloat(purchaseBill.total.toFixed(3))}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  ) : (
                    <tbody>No record Found</tbody>
                  )}
                </table>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <div className="px-4 pb-3">
                <Button
                  style={{ backgroundColor: "var(--COLOR_UI_PHARMACY)" }}
                  autoFocus
                  variant="contained"
                  onClick={() => {
                    setopenBill(false);
                    setDistributorValue(null);
                    setDistributorId(null);
                  }}
                >
                  OK
                </Button>
              </div>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </>
  );
};
export default PaymentList;