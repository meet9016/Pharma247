import Header from "../Header";
import { BsLightbulbFill } from "react-icons/bs";
import {
  Alert,
  AlertTitle,
  Autocomplete,
  Button,
  Checkbox,
  DialogActions,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState, useCallback, useRef } from "react";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Loader from "../../componets/loader/Loader";
import AddIcon from "@mui/icons-material/Add";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { toast, ToastContainer } from "react-toastify";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const OrderList = () => {
  const history = useHistory();
  const token = localStorage.getItem("token");

  const rowsPerPage = 10;
  const OnlineOrdercolumns = [
    { id: "company_name", label: "Company Name", minWidth: 150, height: 100 },
    { id: "iteam_name", label: "Item Name", minWidth: 150 },
    { id: "y_n", label: "Status", minWidth: 150 },
    { id: "supplier_name", label: "Last Purchase", minWidth: 150 },
    { id: "stock", label: "Stock", minWidth: 150 },
  ];

  const LastPurchaseListcolumns = [
    {
      id: "supplier_name",
      label: "Distributor Name",
      minWidth: 170,
      height: 100,
    },
    { id: "qty", label: "QTY", minWidth: 100 },
    { id: "fr_qty", label: "Free", minWidth: 100 },
    { id: "scheme_account", label: "Sch. Amt", minWidth: 100 },
    { id: "margin", label: "Margin%", minWidth: 100 },
    { id: "ptr", label: "PTR", minWidth: 100 },
    { id: "mrp", label: "MRP", minWidth: 100 },
    { id: "bill_date", label: "Date", minWidth: 100 },
    { id: "bill_no", label: "Bill No", minWidth: 100 },
  ];

  // Enhanced search and pagination state (copied from DistributerList)
  const initialSearchTerms = OnlineOrdercolumns.map(() => "");
  const [searchTerms, setSearchTerms] = useState(initialSearchTerms);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);

  // Search state management (copied from DistributerList)
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchTrigger, setSearchTrigger] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeout = useRef(null);
  const currentSearchTerms = useRef(searchTerms);

  // Search keys for API parameters
  const searchKeys = ["company_id", "item_name", "status", "distributor_id", "stock"];

  // Other existing state
  const [distributor, setDistributor] = useState(null);
  const [itemName, setItemName] = useState(null);
  const [items, setItems] = useState([]);
  const [onlineOrder, setOnlineOrder] = useState([]);
  const [statusName, setStatusName] = useState({ id: 2, name: "Order" });
  const [distributorList, setDistributorList] = useState([]);
  const [statusOption, setStatusOpation] = useState([]);
  const [company, setCompany] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [openAddPopUp, setOpenAddPopUp] = useState(false);
  const [openAddPopUpPlaceOrder, setOpenAddPopUpPlaceOrder] = useState(false);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [orderId, setOrderId] = useState(null);

  const totalPages = Math.ceil(totalRecords / rowsPerPage);

  // Effect for handling search with debouncing (copied from DistributerList)
  useEffect(() => {
    if (searchTrigger > 0) {
      // Clear previous timeout
      clearTimeout(searchTimeout.current);

      // Check if any search term has a value
      const hasSearchTerms = currentSearchTerms.current.some(term => term && term.trim());

      if (!hasSearchTerms) {
        // If no search terms, clear the search immediately
        setIsSearching(false);
        OnlineOrderList(1, true);
      } else {
        // Show searching state immediately
        setIsSearching(true);

        // Debounce the search to avoid too many API calls
        searchTimeout.current = setTimeout(() => {
          OnlineOrderList(1, true);
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
      OnlineOrderList(currentPage);
    }
  }, [currentPage]);

  useEffect(() => {
    OnlineOrderList(1);
    listDistributor();
    listOnlineSaleStatus();
  }, []);

  // Enhanced search functionality (copied from DistributerList)
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
    OnlineOrderList(1);
  };

  // Handle search on Enter key press for specific field
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchSubmit();
    }
  };

  // Enhanced OnlineOrderList function with search and pagination
  const OnlineOrderList = async (page, isSearch = false) => {
    if (!page) return;

    let data = new FormData();
    data.append("page", page);

    // Add search parameters when any search term has a value
    currentSearchTerms.current.forEach((term, index) => {
      if (term && term.trim()) {
        data.append(searchKeys[index], term.trim());
      }
    });

    // Add existing filter parameters
    if (company) data.append("company_id", company);
    if (distributor?.name) data.append("distributor_id", distributor.name);
    if (itemName?.iteam_name) data.append("item_id", itemName.iteam_name);

    // Use different loading states for search vs regular operations
    setIsSearchLoading(true);

    try {
      const response = await axios.post("online-sales-order?", data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const responseData = response.data.data;

      if (response.data.status === 401) {
        history.push("/");
        localStorage.clear();
        return;
      }

      // Set the table data directly from backend (paginated and filtered data)
      setOnlineOrder(responseData || []);

      // Extract and set total count for pagination
      const totalCount = response.data.total_records || responseData?.length || 0;
      setTotalRecords(totalCount);

    } catch (error) {
      console.error("API error:", error);
      setOnlineOrder([]);
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

  // New function to update individual order status
  const updateOrderStatus = async (itemId, newStatusId) => {
    setUpdatingStatus(itemId);
    let data = new FormData();
    const params = {
      id: itemId,
      status: newStatusId,
    };

    try {
      await axios
        .post("online-sales-status-changes?", data, {
          params: params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
           toast.dismiss();
toast.success(response.data.meassage || "Status updated successfully");
          OnlineOrderList(currentPage); // Refresh the current page data
          setUpdatingStatus(null);
        });
    } catch (error) {
      console.error("API error:", error);
      toast.dismiss();
toast.error("Failed to update status");
      setUpdatingStatus(null);
         if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
    }
  };

  const handleStatusChange = (itemId, newStatusId) => {
    updateOrderStatus(itemId, newStatusId);
  };

  const handelAddOpen = () => {
    setOpenAddPopUpPlaceOrder(true);
  };

  const PlaceOrder = async () => {
    let data = new FormData();
    const params = {
      id: items.join(","),
      status: statusName,
    };
    try {
      await axios
        .post("online-sales-status-changes?", data, {
          params: params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
           toast.dismiss();
toast.success(response.data.meassage);
          OnlineOrderList(currentPage);
          setOpenAddPopUpPlaceOrder(false);
          setItems([]);
          setStatusName({ id: 2, name: "Order" });
        });
    } catch (error) {
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

  let listDistributor = async () => {
    try {
      await axios
        .get("list-distributer", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          localStorage.setItem("distributor", response.data.data.distributor);
          setDistributorList(response.data.data);
        });
    } catch (error) {
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

  let listOnlineSaleStatus = async () => {
    try {
      await axios
        .get("order-status-list", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setStatusOpation(response.data.data);
        });
    } catch (error) {
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

  const lastPurchseHistory = async (orderId) => {
    let data = new FormData();
    const params = {
      item_id: orderId,
    };
    setIsLoading(true);
    try {
      await axios
        .post("online-order-item?", data, {
          params: params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setPurchaseHistory(response.data.data);
          setIsLoading(false);
        });
    } catch (error) {
      console.error("API error:", error);
      setIsLoading(false);
         if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
    }
  };

  const handleOpenDialog = (id) => {
    setOpenAddPopUp(true);
    setOrderId(id);
    lastPurchseHistory(id);
  };

  const resetAddDialog = () => {
    setOpenAddPopUpPlaceOrder(false);
    setItems([]);
    setStatusName({ id: 2, name: "Order" });
  };

  // Enhanced pagination functions (copied from DistributerList)
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

    const sortedData = [...onlineOrder].sort((a, b) => {
      if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
      if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
      return 0;
    });
    setOnlineOrder(sortedData);
  };

  const handleChangeFilter = (event) => {
    let value = event.target.value;

    // Check if the value is a string and contains commas
    if (typeof value === "string" && value.includes(",")) {
      // Split the string by commas and convert to an array of strings
      value = value.split(",").map((item) => item.trim());
    }

    if (value.includes("select-all")) {
      if (items.length === onlineOrder.length) {
        setItems([]);
      } else {
        setItems(onlineOrder.map((item) => item.item_id));
      }
    } else {
      setItems(value);
    }
  };

  const itemIdToNameMap = onlineOrder.reduce((map, item) => {
    map[item.item_id] = item.iteam_name;
    return map;
  }, {});

  const renderValue = (selected) => {
    return selected
      .map((value) => {
        return itemIdToNameMap[value] || value;
      })
      .join(", ");
  };

  // Helper function to get current status ID from status name
  const getStatusIdFromName = (statusName) => {
    const status = statusOption.find(option => option.name === statusName);
    return status ? status.id : null;
  };

  return (
    <>
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
                  className="mb-4 main_header_txt"
                  style={{ display: "flex", gap: "4px" }}
                >
                  <div style={{ display: "flex", gap: "7px" }}>
                    <span
                      style={{
                        color: "var(--color1)",
                        display: "flex",
                        alignItems: "center",
                        fontWeight: 700,
                        fontSize: "20px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Order List
                    </span>
                    <BsLightbulbFill className="mt-1 w-6 h-6 secondary hover-yellow" />
                  </div>
                  <div className="headerList ">
                    <Button
                      variant="contained"
                      className="order_list_btn"
                      style={{
                        display: "flex",
                        gap: "4px",
                        background: "var(--color1)",
                      }}
                      onClick={handelAddOpen}
                    >
                      <AddIcon className="" /> Pending Orders
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
                          {OnlineOrdercolumns.map((column, index) => (
                            <th key={column.id} style={{ minWidth: column.minWidth, padding: '8px' }}>
                              <div className="headerStyle" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                                <span>{column.label}</span>
                                <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                                  <SwapVertIcon
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => sortByColumn(column.id)}
                                  />
                                  {/* --- change below --- */}
                                  {column.id === "y_n" ? (
                                    <FormControl size="small" sx={{ minWidth: 100, marginLeft: '4px' }}>
                                      <Select
                                        displayEmpty
                                        value={searchTerms[index] || ""}
                                        onChange={e => handleSearchChange(index, e.target.value)}
                                        size="small"
                                        sx={{ fontSize: "0.9rem" }}
                                        renderValue={(selected) => {
                                          if (!selected) return "All";
                                          // You can use statusOption for mapping if dynamic, else static:
                                          if (selected === "1") return "Pending";
                                          if (selected === "2") return "Order";
                                          return selected;
                                        }}
                                      >
                                        <MenuItem value="">All</MenuItem>
                                        <MenuItem value="1">Pending</MenuItem>
                                        <MenuItem value="2">Order</MenuItem>
                                        {/* Or loop through statusOption if needed */}
                                      </Select>
                                    </FormControl>
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
                              </div>
                            </th>
                          ))}
                          <th style={{ minWidth: 120, padding: '8px' }}>Action</th>
                        </tr>
                      </thead>

                      {isSearchLoading ? (
                        <tbody>
                          <tr>
                            <td colSpan={OnlineOrdercolumns.length + 2} style={{ textAlign: 'center', padding: '20px' }}>
                              <Loader />
                            </td>
                          </tr>
                        </tbody>
                      ) : (
                        <tbody style={{ background: "#3f621217" }}>
                          {onlineOrder.length === 0 ? (
                            <tr>
                              <td
                                colSpan={OnlineOrdercolumns.length + 2}
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
                            onlineOrder.map((row, index) => (
                              <tr key={row.code || index} className="bg-[#f5f8f3] align-middle">
                                <td className="rounded-l-[10px] px-4 py-2 font-semibold text-center">
                                  {((currentPage - 1) * rowsPerPage) + index + 1}
                                </td>
                                {OnlineOrdercolumns.map((column, colIndex) => {
                                  const value = row[column.id] || "-";
                                  const isStatus = column.id === "y_n";

                                  if (isStatus) {
                                    return (
                                      <td
                                        key={column.id}
                                        className="px-4 py-2 font-semibold text-center"
                                        align={column.align}
                                      >
                                        <FormControl size="small" sx={{ minWidth: 120 }}>
                                          <Select
                                            value={getStatusIdFromName(value) || ""}
                                            onChange={(e) => handleStatusChange(row.item_id, e.target.value)}
                                            disabled={updatingStatus === row.item_id}
                                            variant="standard"
                                            disableUnderline
                                            sx={{
                                              "& .MuiSelect-select": {
                                                padding: "4px 8px",
                                                fontSize: "0.875rem",
                                                color: value === "Order" ? "#3f6212" : "#f6a609",
                                                backgroundColor: value === "Order" ? "#f0f9e8" : "#fef3e2",
                                                fontWeight: 700,
                                                borderRadius: "10px",
                                                border: "none",
                                                outline: "none",
                                              },
                                              "& .MuiSelect-icon": {
                                                color: value === "Order" ? "#3f6212" : "#f6a609",
                                              },
                                              "& .MuiInput-root": {
                                                "&:before": {
                                                  display: "none",
                                                },
                                                "&:after": {
                                                  display: "none",
                                                },
                                              },
                                            }}
                                          >
                                            {statusOption.map((option) => (
                                              <MenuItem key={option.id} value={option.id}>
                                                {option.name}
                                              </MenuItem>
                                            ))}
                                          </Select>
                                        </FormControl>
                                        {updatingStatus === row.item_id && (
                                          <div style={{ fontSize: "0.75rem", color: "#666", marginTop: "2px" }}>
                                            Updating...
                                          </div>
                                        )}
                                      </td>
                                    );
                                  } else {
                                    const tdClass = "px-4 py-2 font-semibold text-center capitalize";
                                    return (
                                      <td
                                        key={column.id}
                                        className={tdClass}
                                        align={column.align}
                                      >
                                        <span className="text">
                                          {column.format && typeof value === "number"
                                            ? column.format(value)
                                            : value}
                                        </span>
                                      </td>
                                    );
                                  }
                                })}
                                <td className="rounded-r-[10px] px-4 py-2 text-center">
                                  <div className="px-2 flex gap-1 justify-center">
                                    <VisibilityIcon
                                      className="cursor-pointer"
                                      onClick={() => handleOpenDialog(row.item_id)}
                                      style={{ color: "var(--color1)" }}
                                    />
                                  </div>
                                </td>
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
              className="order_list_ml custom-dialog"
              open={openAddPopUp}
              sx={{
                "& .MuiDialog-container": {
                  "& .MuiPaper-root": {
                    width: "100%",
                    maxWidth: "991px",
                  },
                },
              }}
            >
              <DialogTitle id="alert-dialog-title" className="primary">
                Item Purchase History
              </DialogTitle>
              <div className="px-6">
                <Alert severity="info" className="" style={{ width: "100%" }}>
                  <AlertTitle>Info</AlertTitle>
                  Lastest 5 Purchase History.
                </Alert>
              </div>
              <IconButton
                aria-label="close"
                onClick={() => setOpenAddPopUp(false)}
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
                    style={{
                      flexDirection: "column",
                      gap: "19px",
                      whiteSpace: "nowrap",
                    }}
                  >
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
                          {LastPurchaseListcolumns.map((column, index) => (
                            <th
                              key={column.id}
                              onClick={() => sortByColumn(column.id)}
                            >
                              <div className="headerStyle">
                                <span>{column.label}</span>
                                <SwapVertIcon />
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody style={{ background: "#3f621217" }}>
                        {purchaseHistory.map((row, index) => {
                          return (
                            <tr
                              hover
                              tabIndex={-1}
                              key={row.code}
                              onClick={() => setOpenAddPopUp(true)}
                            >
                              {LastPurchaseListcolumns.map(
                                (column, colIndex) => {
                                  const value = row[column.id];

                                  return (
                                    <td
                                      key={column.id}
                                      align={column.align}
                                      style={
                                        colIndex === 0
                                          ? {
                                            borderRadius: "10px 0 0 10px",
                                          }
                                          : colIndex ===
                                            LastPurchaseListcolumns.length - 1
                                            ? {
                                              borderRadius: "0 10px 10px 0",
                                            }
                                            : {}
                                      }
                                    >
                                      {column.format &&
                                        typeof value === "number"
                                        ? column.format(value)
                                        : value}
                                    </td>
                                  );
                                }
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </DialogContentText>
              </DialogContent>
            </Dialog>
          {/*<=============================================== order dialog  ==============================================> */}
            <Dialog className=" custom-dialog pending-orders-dialog" open={openAddPopUpPlaceOrder}>
              <DialogTitle
                id="alert-dialog-title"
                style={{ fontWeight: 700 }}
              >
                Pending Orders
              </DialogTitle>
              <IconButton
                aria-label="close"
                onClick={() => setOpenAddPopUpPlaceOrder(false)}
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
                  <div className="flex flex-col gap-5" style={{ width: "100%" }}>
                    <FormControl size="small" style={{ width: "100%" }}>
                      <InputLabel id="demo-select-small-label">
                        Item Name
                      </InputLabel>
                      <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        multiple
                        value={items}
                        sx={{ width: "100%" }}
                        onChange={handleChangeFilter}
                        renderValue={renderValue}
                        label="Item Name"
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 200,
                              overflowY: "auto",
                            },
                          },
                        }}
                      >
                        <MenuItem key="select-all" value="select-all">
                          <Checkbox
                            sx={{
                              color: "var(--color2)",
                              "&.Mui-checked": {
                                color: "var(--color1)",
                              },
                            }}
                            checked={items.length === onlineOrder.length}
                            indeterminate={
                              items.length > 0 &&
                              items.length < onlineOrder.length
                            }
                          />
                          <ListItemText primary="Select All" />
                        </MenuItem>
                        {onlineOrder?.map((option) => (
                          <MenuItem key={option.item_id} value={option.item_id}>
                            <Checkbox
                              sx={{
                                color: "var(--color2)",
                                "&.Mui-checked": {
                                  color: "var(--color1)",
                                },
                              }}
                              checked={items.indexOf(option.item_id) > -1}
                            />
                            <ListItemText primary={option.iteam_name} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl size="small" style={{ width: "100%" }}>
                      <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small-label"
                        value={statusName}
                        sx={{ width: "100%" }}
                        onChange={(e) => setStatusName(e.target.value)}
                        size="small"
                        displayEmpty
                      >
                        {statusOption.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                </DialogContentText>
              </DialogContent>
              <DialogActions style={{ padding: "24px" }}>
                <Button
                  autoFocus
                  variant="contained"
                  className="p-5"
                  style={{
                    textTransform: "none",
                    backgroundColor: "var(--COLOR_UI_PHARMACY)",
                  }}
                  onClick={PlaceOrder}
                >
                  Pending Orders
                </Button>
                <Button
                  autoFocus
                  variant="contained"
                  style={{ textTransform: "none", backgroundColor: "#F31C1C" }}
                  onClick={resetAddDialog}
                >
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        )}
      </div>
    </>
  );
};

export default OrderList;