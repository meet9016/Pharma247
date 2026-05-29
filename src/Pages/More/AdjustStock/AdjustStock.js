import { BsLightbulbFill } from "react-icons/bs";
import Header from "../../Header";
import {
  Autocomplete,
  Button,
  IconButton,
  InputAdornment,
  ListItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { useEffect, useState, useCallback, useRef } from "react";
import TextField from "@mui/material/TextField";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import { format, subDays } from "date-fns";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import Loader from "../../../componets/loader/Loader";
import { toast, ToastContainer } from "react-toastify";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const AdjustStock = () => {
  const history = useHistory();

  const stockList = [
    { id: "adjustment_date", label: "Adjustment Date", minWidth: 150 },
    { id: "iteam_name", label: "Item Name", minWidth: 150 },
    { id: "batch_name", label: "Batch", minWidth: 150 },
    { id: "stock_adjust", label: "Stock Adjusted", minWidth: 150 },
  ];

  const [stock, setStock] = useState("");
  const [openAddPopUp, setOpenAddPopUp] = useState(false);
  const [selectedItem, setSelectedItem] = useState();
  const [batch, setBatch] = useState();

  const token = localStorage.getItem("token");
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const initialSearchTerms = stockList.map(() => "");
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);

  const [adjustStockListData, setAdjustStockListData] = useState([]);
  const totalPages = Math.ceil(totalRecords / rowsPerPage);
  const [searchTerms, setSearchTerms] = useState(initialSearchTerms);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  // Search state management (copied from DistributerList.js)
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchTrigger, setSearchTrigger] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeout = useRef(null);
  const currentSearchTerms = useRef(searchTerms);

  const [itemId, setItemId] = useState(null);
  const [errors, setErrors] = useState({});
  const [stockAdjust, setStockAdjust] = useState("");
  const [companyList, setCompanyList] = useState([]);
  const [purchaseItemData, setpurchaseItemData] = useState([]);
  const [unit, setUnit] = useState("");
  const [remainingStock, setRemainingStock] = useState("");
  const [batchListData, setBatchListData] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [adjustmentDate, setAdjustDate] = useState(new Date());
  const [expiry, setExpiry] = useState("");
  const [mrp, setMrp] = useState("");

  const [adjustType, setAdjustType] = useState(true)

  // Search functionality - using common search field
  const [search, setSearch] = useState("");

  const resetAddDialog = () => {
    setOpenAddPopUp(false);
    setBatch();
    setSelectedCompany(null);
    setSelectedItem();
    setUnit("");
    setExpiry("");
    setMrp("");
    setStock("");
    setStockAdjust("");
    setRemainingStock("");
    setAdjustDate(new Date());
  };

  useEffect(() => {
    listOfCompany();
    purchaseItemList();
  }, []);

  // Effect for handling search with debouncing
  useEffect(() => {
    if (searchTrigger > 0) {
      // Clear previous timeout
      clearTimeout(searchTimeout.current);

      // Check if search term has a value
      const hasSearchTerms = search && search.trim();

      if (!hasSearchTerms) {
        // If no search terms, clear the search immediately
        setIsSearching(false);
        adjustStockList(1, true);
      } else {
        // Show searching state immediately
        setIsSearching(true);

        // Debounce the search to avoid too many API calls
        searchTimeout.current = setTimeout(() => {
          adjustStockList(1, true);
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
      adjustStockList(currentPage);
    }
  }, [currentPage]);


  useEffect(() => {
    
    let y;

    if (adjustType === true) {
      y = parseFloat(stock) - parseFloat(stockAdjust)
      setRemainingStock(y);
    } else if (adjustType === false) {
      y = parseFloat(stock) + parseFloat(stockAdjust)
      setRemainingStock(y);
    }
  }, [stockAdjust, adjustType]);

  let listOfCompany = () => {
    axios
      .get("company-list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setCompanyList(response.data.data);
      })
      .catch((error) => {
        console.error("API error:", error);
           if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
      });
  };

  let purchaseItemList = () => {
    axios
      .post("purches-iteam-list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setpurchaseItemData(response.data.data);
      })
      .catch((error) => {
        console.error("API error:", error);
           if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
      });
  };

  const adjustStockList = async (page, isSearch = false) => {
    if (!page) return;

    let data = new FormData();
    data.append("page", page);

    // Add search parameter if search term has a value
    if (search && search.trim()) {
      data.append("search", search.trim());
    }

    // Use different loading states for search vs regular operations
    if (isSearch) {
      setIsSearchLoading(true);
    } else {
      setIsLoading(true);
    }

    try {
      const response = await axios.post("adjust-stock-list", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // handle auth out
      if (response.data.status === 401) {
        history.push("/");
        localStorage.clear();
        return;
      }

      // Set the table data directly from backend (paginated and filtered data)
      setAdjustStockListData(response.data.data?.data || []);
      setTableData(response.data.data?.data || []);

      // Extract and set total count for pagination
      const totalCount = response.data.data?.total || response.data.total_records || 0;
      setTotalRecords(totalCount);

    } catch (error) {
      console.error("API error:", error);
      setAdjustStockListData([]);
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
        setIsSearchLoading(false);
        setIsSearching(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  const ItemvisebatchList = async (itemId) => {
    let data = new FormData();
    data.append("iteam_id", itemId);
    const params = {
      iteam_id: itemId,
    };
    try {
      const res = await axios
        .post("batch-list?", data, {
          params: params,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const data = response.data.data;
          setBatchListData(response.data.data);
          if (response.data.status === 401) {
            history.push("/");
            localStorage.clear();
          }
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

  const filteredList = Array.isArray(adjustStockListData) ? adjustStockListData : [];

  const handleOptionChange = (event, newValue) => {
    setSelectedItem(newValue || null);
    setItemId(newValue?.id || null);

    // HARD reset batch + dependent fields
    setBatch(null);
    setBatchListData([]);
    setUnit("");
    setExpiry("");
    setMrp("");
    setStock("");
    setRemainingStock("");
    setSelectedCompany(null);
    setStockAdjust("");


    if (newValue?.id) {
      ItemvisebatchList(newValue.id);
    }
  };


  const handleBatchData = (event, newValue) => {


    setBatch(newValue);
    setUnit(newValue?.unit);
    setExpiry(newValue?.expiry_date);
    setMrp(newValue?.mrp);
    setStock(newValue?.qty);
    const company = companyList.find(
      (x) => x.id == batchListData[0]?.company_id
    );
    setSelectedCompany(company);
  };

  const handleSearchChange = (value) => {
    // Update search value
    setSearch(value);

    // Check if search term has a value
    const hasSearchTerms = value && value.trim();
    setIsSearchActive(hasSearchTerms);

    // Reset to page 1 when searching
    setCurrentPage(1);

    // Trigger search effect immediately
    setSearchTrigger(prev => prev + 1);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      adjustStockList(currentPage);
    }
  };

  const validateForm = async () => {
    const newErrors = {};

    if (!selectedItem) {
      newErrors.selectedItem = "select any Item Name.";
      toast.dismiss();
      toast.error(newErrors.selectedItem);
    } else if (!batch) {
      newErrors.batch = "Batch Number is required";
      toast.dismiss();
      toast.error(newErrors.batch);
    } else if (!stockAdjust) {
      newErrors.stockAdjust = "please Enter any Adjust Stock Number";
      toast.dismiss();
      toast.error(newErrors.stockAdjust);
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      adjustStockAddData();
    } else {
      return Object.keys(newErrors).length === 0;
    }
  };

  const adjustStockAddData = async () => {
    let data = new FormData();
    setIsLoading(true);
    data.append(
      "adjustment_date",
      adjustmentDate ? format(adjustmentDate, "yyyy-MM-dd") : ""
    );
    data.append("item_name", selectedItem ? selectedItem : "");
    data.append("batch", batch ? batch.batch_name : "");
    data.append("company", selectedCompany?.id ? selectedCompany?.id : "");
    data.append("unit", unit ? unit : "");
    data.append("expiry", expiry ? expiry : "");
    data.append("mrp", mrp ? mrp : "");
    data.append("stock", stock ? stock : "");
    data.append("stock_adjust", stockAdjust ? stockAdjust : "");
    data.append("remaining_stock", remainingStock ? remainingStock : "");

    try {
      await axios
        .post("adjust-stock", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setIsLoading(false);
          setOpenAddPopUp(false);
          setBatch();
          toast.dismiss();
          toast.success(response.data.message);
          setSelectedCompany(null);
          adjustStockList(currentPage);
          setSelectedItem();
          setUnit("");
          setExpiry("");
          setMrp("");
          setStock("");
          setStockAdjust("");
          setRemainingStock("");
          setAdjustDate(new Date());
          if (response.data.status === 401) {
            history.push("/");
            localStorage.clear();
          }
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

  const handelAddOpen = () => {
    setOpenAddPopUp(true);
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

  // ---------------------------------------  UI    ---------------------------------------------------
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
                      Adjust Stock
                    </span>
                    <BsLightbulbFill className="w-6 h-6 secondary hover-yellow align-center" />
                  </div>
                  <div className="headerList cust_hdr_mn_bg">
                    <Button
                      variant="contained"
                      style={{
                        background: "var(--color1)",
                        display: "flex",
                      }}
                      className="gap-2"
                      onClick={handelAddOpen}
                    >
                      <AddIcon className="" />
                      Adjust Stock
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
                        <th style={{ minWidth: 100, padding: '8px' }}>SR. No</th>
                        {stockList.map((column, index) => (
                          <th key={column.id} style={{ minWidth: column.minWidth, padding: '8px' }}>
                            <div className="headerStyle" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                              <span>{column.label}</span>
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                <SwapVertIcon
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => sortByColumn(column.id)}
                                />
                                {/* Show search field only for Item Name column */}
                                {column.id === 'iteam_name' && (
                                  <TextField
                                    autoComplete="off"
                                    label="Type Here"
                                    id="filled-basic"
                                    size="small"
                                    sx={{ flex: 1, marginLeft: '4px', minWidth: '100px', maxWidth: '250px' }}
                                    value={searchTerms[0] || ''}
                                    onChange={(e) => {
                                      const newSearchTerms = [e.target.value];
                                      setSearchTerms(newSearchTerms);
                                      handleSearchChange(e.target.value);
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        e.preventDefault();
                                        adjustStockList(1);
                                      }
                                    }}
                                    InputProps={{
                                      endAdornment: searchTerms[0] && (
                                        <IconButton
                                          size="small"
                                          onClick={() => {
                                            setSearchTerms(['']);
                                            handleSearchChange('');
                                          }}
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
                      </tr>
                    </thead>
                    {isSearchLoading ? (
                      <div className="loader-container ">
                        <Loader />
                      </div>
                    ) : (
                      <tbody style={{ background: "#3f621217" }}>
                        {filteredList.length === 0 ? (
                          <tr>
                            <td
                              colSpan={stockList.length + 1}
                              className="text-center text-gray-500"
                              style={{ borderRadius: "10px 10px 10px 10px" }}
                            >
                              No data found
                            </td>
                          </tr>
                        ) : (
                          filteredList.map((row, index) => (
                            <tr
                              className="bg-[#f5f8f3] align-middle"
                              key={row.code}
                            >
                              <td className="rounded-l-[10px] px-4 py-2 font-semibold text-center">
                                {((currentPage - 1) * rowsPerPage) + index + 1}
                              </td>

                              {stockList.map((column, colIndex) => {
                                const value = row[column.id];
                                const tdClass = "px-4 py-2 font-semibold text-center";
                                return (
                                  <td
                                    key={column.id}
                                    className={`capitalize ${tdClass} ${colIndex === stockList.length - 1 ? 'rounded-r-[10px]' : ''}`}
                                  >
                                    {column.format && typeof value === "number"
                                      ? column.format(value)
                                      : value}
                                  </td>
                                );
                              })}
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

          {/*<====================================================================== Adjust stock dialog  =====================================================================> */}
          <Dialog className="custom-dialog modal_991" open={openAddPopUp}>
            <DialogTitle id="alert-dialog-title" className="primary">
              Stock Adjustment
            </DialogTitle>
            <IconButton
              aria-label="close"
              onClick={resetAddDialog}
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
                {/* First row: Item & Company */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">
                  <div className="w-full">
                    <span className="title primary mb-2">Item Name</span>
                    <Autocomplete
                      disablePortal
                      options={purchaseItemData}
                      size="small"
                      value={selectedItem || null}
                      onChange={handleOptionChange}
                      getOptionLabel={(option) => option.iteam_name}
                      isOptionEqualToValue={(option, value) => option.id === value.id}

                      renderInput={(params) => (
                        <TextField autoComplete="off" {...params} placeholder="Enter Item Name" />
                      )}
                    />
                  </div>

                  <div className="w-full">
                    <span className="title primary mb-2">Company</span>
                    <Autocomplete
                      disablePortal
                      options={companyList}
                      size="small"
                      value={selectedCompany}
                      onChange={(e, value) => setSelectedCompany(value)}
                      getOptionLabel={(option) => option.company_name}
                      disabled
                      renderInput={(params) => (
                        <TextField autoComplete="off" {...params} placeholder="Enter Company Name" />
                      )}
                    />
                  </div>
                </div>

                {/* Other fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                  <div className="w-full">
                    <span className="title primary mb-2">Adjustment Date</span>
                    <DatePicker
                      className="custom-datepicker w-full"
                      selected={adjustmentDate}
                      onChange={(newDate) => setAdjustDate(newDate)}
                      dateFormat="dd/MM/yyyy"
                      minDate={subDays(new Date(), 15)}
                      disabled
                    />

                  </div>

                  <div className="w-full">
                    <span className="title primary mb-2">Batch</span>
                    <Autocomplete
                      disablePortal
                      options={batchListData}
                      size="small"
                      value={batch || null}
                      onChange={handleBatchData}
                      getOptionLabel={(option) => option?.batch_number || ""}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      renderInput={(params) => (
                        <TextField {...params} autoComplete="off" />
                      )}
                    />

                  </div>

                  <div className="w-full">
                    <span className="title primary mb-2">Unit</span>
                    <TextField
                      autoComplete="off"
                      disabled
                      size="small"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="w-full">
                    <span className="title primary mb-2">Expiry</span>
                    <TextField
                      autoComplete="off"
                      disabled
                      size="small"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="w-full">
                    <span className="title primary mb-2">MRP</span>
                    <TextField
                      autoComplete="off"
                      type="number"
                      disabled
                      size="small"
                      value={mrp}
                      onChange={(e) => setMrp(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="w-full">
                    <span className="title primary mb-2">Stock</span>
                    <TextField
                      autoComplete="off"
                      type="number"
                      disabled
                      size="small"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="w-full">
                    <span className="title primary mb-2">Stock Adjusted</span>
                    <div className="flex flex-row gap-3">


                      <Button
                        style={{
                          background: "var(--COLOR_UI_PHARMACY)",
                        }}
                        autoFocus
                        variant="contained"
                        className=""
                        onClick={() => setAdjustType((prev) => (!prev))}

                      >
                        {adjustType ? "-" : "+"}
                      </Button>
                      <TextField
                        autoComplete="off"
                        type="number"
                        size="small"
                        value={stockAdjust}
                        onChange={(e) => setStockAdjust(parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>

                  </div>

                  <div className="w-full">
                    <span className="title primary mb-2">Remaining Stock</span>
                    <TextField
                      autoComplete="off"
                      type="number"
                      disabled
                      size="small"
                      value={remainingStock}
                      className="w-full"
                    />
                  </div>
                </div>
              </DialogContentText>
            </DialogContent>

            <DialogActions style={{ padding: "20px 24px" }}>
              <Button
                style={{
                  background: "var(--COLOR_UI_PHARMACY)",
                }}
                autoFocus
                variant="contained"
                className=""
                onClick={validateForm}
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
export default AdjustStock;