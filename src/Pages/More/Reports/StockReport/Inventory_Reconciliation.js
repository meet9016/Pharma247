import Header from "../../../Header";
import { BsLightbulbFill } from "react-icons/bs";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";

import DatePicker from "react-datepicker";
import { format, min, subDays } from "date-fns";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useEffect, useState } from "react";
import { FormControl, MenuList } from "@mui/material";
import Loader from "../../../../componets/loader/Loader";
import { toast, ToastContainer } from "react-toastify";
import {
  Box,
  ListItem,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  TableContainer,
  TablePagination,
  Paper,
  InputAdornment,
  IconButton,
  Button,
  Tooltip,
  Autocomplete,
  Menu,
} from "@mui/material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
} from "@mui/material";
import React from "react";
const Inventory_Reconciliation = () => {
  const history = useHistory();
  const token = localStorage.getItem("token");
  const [startDate, setStartDate] = useState(subDays(new Date(), 2));
  const [endDate, setEndDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [stockStatus, setStockStatus] = useState();
  const [reportData, setReportData] = useState({});
  const [reportType, setReportType] = useState("");
  const [isDownload, setIsDownload] = useState(false);

  const [tableData, setTableData] = useState([]);

  const [itemId, setItemId] = useState(null);

  const [openAddPopUp, setOpenAddPopUp] = useState(false);
  const [openPrintQR, setOpenPrintQR] = useState(false);
  const [stock, setStock] = useState("");
  const [adjustStockListData, setAdjustStockListData] = useState([]);
  const [unit, setUnit] = useState("");
  const [remainingStock, setRemainingStock] = useState("");
  const [batchListData, setBatchListData] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [expiry, setExpiry] = useState("");
  const [mrp, setMrp] = useState("");
  const [selectedItem, setSelectedItem] = useState();
  const [batch, setBatch] = useState();
  const [stockAdjust, setStockAdjust] = useState("");
  const [adjustmentDate, setAdjustDate] = useState(new Date());
  const [purchaseItemData, setpurchaseItemData] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [errors, setErrors] = useState({});
  const [locationBulk, setLocationBulk] = useState();
  const [drugGroupList, setDrugGroupList] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [bulkOrder, setBulkOrder] = useState(false);
  const [barcode, setBarcode] = useState();

  const columns = [
    { id: "sr_no", label: "Sr No.", minWidth: 10 },
    { id: "bill_no", label: "Bill No.", minWidth: 10 },
    { id: "bill_date", label: "Bill Date", minWidth: 100 },
    { id: "distributor_name", label: "Distributor", minWidth: 100 },
    { id: "total_amount", label: "Bill Amount", minWidth: 100 },
  ];

  const rowsPerPage = 10;
  const initialSearchTerms = columns.map(() => "");

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(tableData.length / rowsPerPage);
  const paginatedData = tableData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const [searchTerms, setSearchTerms] = useState(initialSearchTerms);

  const csvIcon = process.env.PUBLIC_URL + "/csv.png";
  const GstSaleRegisterColumns = [
    { id: "id", label: "Sr No.", minWidth: 150 },
    { id: "reported_by", label: "reported by", minWidth: 150 },
    { id: "location", label: "Location", minWidth: 150 },
    { id: "unit", label: "Unit", minWidth: 150 },
    { id: "iteam_name", label: "Item Name", minWidth: 150 },
    { id: "physical_stock", label: "Reported Stock", minWidth: 150 },
    { id: "current_stock", label: "System Stock", minWidth: 150 },
    { id: "mrp", label: "MRP", minWidth: 150 },
    // { id: 'company_name', label: 'company name', },
    { id: "rsImpact", label: "Rs. Impact", minWidth: 150 },
    { id: "AdjustStock", label: "Adjust Stock", minWidth: 150 },
  ];

  useEffect(() => {
    if (reportData && typeof reportData === "object") {
      if (isDownload) {
        exportToCSV();
      }
    }
  }, [reportData]);

  useEffect(() => {
    setRemainingStock(stockAdjust - stock);
  }, [stockAdjust]);

  const handleClick = (pageNum) => {
    setCurrentPage(pageNum);
    getData(pageNum);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      getData(newPage);
    }
  };

  const handleNext = () => {
    const newPage = currentPage + 1;
    setCurrentPage(newPage);
    getData(newPage);
  };

  //   const filteredList = paginatedData.filter(row => {
  //     return searchTerms.every((term, index) => {
  //       const value = row[columns[index].id];
  //       return String(value).toLowerCase().includes(term.toLowerCase());
  //     });
  //   });

  const handleBatchData = (event, newValue) => {
    const batch = newValue ? newValue.batch_name : "";
    setBatch(batch);
    setUnit(newValue?.unit);
    setExpiry(newValue?.expiry_date);
    setMrp(newValue?.mrp);
    setStock(newValue?.qty);
    setSelectedCompany(newValue?.company_name);
  };

  const resetAddDialog = () => {
    setOpenAddPopUp(false);
    setBatch();
    setSelectedCompany();
    setSelectedItem();
    setUnit("");
    setExpiry("");
    setMrp("");
    setStock("");
    setStockAdjust("");
    setRemainingStock("");
    setAdjustDate(new Date());
  };

  const handleOptionChange = (event, newValue) => {
    const itemName = newValue ? newValue.iteam_name : "";
    setSelectedItem(itemName);
    setItemId(newValue?.id);
  };
  const validateForm = async () => {
    const newErrors = {};

    if (!batchListData.iteam_name) {
      newErrors.selectedItem = "select any Item Name.";
      toast.dismiss();
      toast.error(newErrors.selectedItem);
    } else if (!batchListData.batch_number) {
      newErrors.batch = "Batch Number is required";
      toast.dismiss();
      toast.error(newErrors.batch);
    } else if (!batchListData.company_name) {
      newErrors.selectedCompany = "select any Company Name";
      toast.dismiss();
      toast.error(newErrors.selectedCompany);
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
    data.append("item_name", batchListData.item_id);
    data.append("batch", batchListData.batch);
    data.append("company", batchListData.company_id);
    data.append("unit", batchListData.unit);
    data.append("expiry", batchListData.expiry_date);
    data.append("mrp", batchListData.mrp);
    data.append("stock", batchListData.stock);
    data.append("stock_adjust", stockAdjust);
    data.append("remaining_stock", remainingStock);

    try {
      await axios
        .post("adjust-stock", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setIsLoading(false);
          toast.dismiss();
          toast.success(response.data.message);
          setOpenAddPopUp(false);
          setBatch();
          setSelectedCompany();
          // adjustStockList();
          setSelectedItem();
          setUnit("");
          setExpiry("");
          setMrp("");
          setStock("");
          setStockAdjust("");
          setRemainingStock("");
          setAdjustDate(new Date());
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

  const ItemvisebatchList = async (itemId) => {
    try {
      let data = new FormData();
      data.append("iteam_id", itemId);
      const params = {
        iteam_id: itemId,
      };
      const response = await axios
        .post("batch-list?", data, {
          // params: params,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setBatchListData(response.data.data[0]);
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

  const getData = async (currentPage) => {
    setIsDownload(true);
    try {
      let data = new FormData();
      data.append(
        "start_date",
        startDate ? format(startDate, "yyyy-MM-dd") : ""
      );
      data.append("end_date", endDate ? format(endDate, "yyyy-MM-dd") : "");
      data.append("status", stockStatus);
      data.append("page", currentPage);

      const response = await axios.post("reconciliation-report?", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 && response.data) {
        const parsedData = response.data;
        if (parsedData?.data) {
          setReportData(parsedData.data);
          //  toast.dismiss();
          toast.success("please wait ...downloading is in progress!")
        } else {
          toast.dismiss();
          toast.error("No data available for the selected criteria.");
        }
      }
    } catch (error) {
      console.error("API error:", error);
         if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }

      toast.dismiss();
      toast.error("An error occurred while downloading the CSV.");
    } finally {
      setIsDownload(false);
    }
  };
  const exportToCSV = () => {
    if (!reportData || reportData.length === 0) {
      toast.dismiss();
      toast.error("No data available for download.");
      return;
    }

    const headers = GstSaleRegisterColumns.map((col) => col.label).join(",");

    const rows = reportData.map((row) => {
      return GstSaleRegisterColumns.map((column) => {
        if (column.id === "rsImpact") {
          const rsImpact = (
            parseFloat(row.mrp || 0) * parseFloat(row.physical_stock || 0) -
            parseFloat(row.mrp || 0) * parseFloat(row.current_stock || 0)
          ).toFixed(2);
          return rsImpact;
        }
        return row[column.id] ? row[column.id] : "-";
      }).join(",");
    });

    const csvContent = [headers, ...rows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Reconciliation_Report.csv";
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.dismiss();
    toast.success("CSV downloaded successfully!");
  };

  const handelAddOpen = (item) => {
    setOpenAddPopUp(true);
    ItemvisebatchList(item.iteam_id);
  };

  return (
    <>
      <div>
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
            <div className="p-6">
              <div className="mb-4 flex report_hdr_main">
                <div
                  className="report_hdr_ec"
                  style={{
                    display: "flex",
                    gap: "7px",
                    alignItems: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  <div
                    className="invrnt_flddd"
                    style={{
                      display: "flex",
                      gap: "7px",
                      alignItems: "center",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span
                      style={{
                        color: "var(--color2)",
                        display: "flex",
                        fontWeight: 700,
                        gap: "7px",
                        fontSize: "20px",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                      onClick={() => history.push("/reports")}
                    >
                      {" "}
                      Reports
                      <ArrowForwardIosIcon
                        style={{ fontSize: "18px", color: "var(--color1)" }}
                      />
                    </span>
                    <span
                      className="report_hdr_txt_ec gap-2"
                      style={{
                        color: "var(--color1)",
                        display: "flex",
                        fontWeight: 700,
                        fontSize: "20px",
                        alignItems: "center",
                      }}
                    >
                      {" "}
                      Reconciliation Report (Audit)
                      <BsLightbulbFill className=" w-6 h-6 secondary hover-yellow" />
                    </span>
                  </div>
                </div>
                <div className="headerList">
                  <Button
                    variant="contained"
                    style={{
                      background: "var(--color1)",
                      color: "white",
                      // paddingLeft: "35px",
                      textTransform: "none",
                      display: "flex",
                    }}
                    className="gap-7 report_btn_purch"
                    onClick={exportToCSV}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <img
                        src="/csv-file.png"
                        className="report-icon absolute mr-10"
                        alt="download"
                      />
                    </div>
                    Download
                  </Button>
                </div>
              </div>
              <div
                className="row border-b border-dashed"
                style={{ borderColor: "var(--color2)" }}
              ></div>
              <div className="mt-4 ">
                <div className="manageExpenseRow">
                  <div
                    className="oreder_list_fld_rp grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  xl:grid-cols-5 gap-3 pb-2"
                    style={{ width: "100%", alignItems: "end" }}
                  >
                    <div className="detail_report flex flex-col detailrep_100">
                      <span className="primary">Start Date</span>
                      <div style={{ width: "100%" }}>
                        <DatePicker
                          className="custom-datepicker "
                          selected={startDate}
                          onChange={(newDate) => setStartDate(newDate)}
                          dateFormat="dd/MM/yyyy"
                        />
                      </div>
                    </div>
                    <div className="detail_report flex flex-col detailrep_100">
                      <span className="primary">End Date</span>
                      <div style={{ width: "100%" }}>
                        <DatePicker
                          className="custom-datepicker "
                          selected={endDate}
                          onChange={(newDate) => setEndDate(newDate)}
                          dateFormat="dd/MM/yyyy"
                        />
                      </div>
                    </div>
                    <div className="detail_report flex flex-col detailrep_100 justify-end">
                      <FormControl sx={{ width: "100%" }} size="small">
                        <InputLabel id="demo-select-small-label">
                          Stock Status
                        </InputLabel>
                        <Select
                          labelId="demo-select-small-label"
                          id="demo-select-small"
                          value={stockStatus}
                          onChange={(e) => setStockStatus(e.target.value)}
                          label="Stock Status"
                        >
                          <MenuItem value="" disabled>
                            Stock Status
                          </MenuItem>
                          <MenuItem value="0">All</MenuItem>
                          <MenuItem value="1">Correct Stock</MenuItem>
                          <MenuItem value="2">MisMatch Stock</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    <div className="detail_report flex flex-col detailrep_100 justify-end">
                      <Button
                        style={{
                          background: "var(--color1)",
                          width: "fit-content",
                          height: "40px",
                        }}
                        onClick={getData}
                        variant="contained"
                      >
                        Go
                      </Button>
                    </div>
                  </div>
                </div>
                {reportData.length > 0 ? (
                  <>
                    <div className="firstrow">
                      <div className="overflow-x-auto mt-4">
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
                              {GstSaleRegisterColumns.map((column) => (
                                <th
                                  key={column.id}
                                  style={{ minWidth: column.minWidth }}
                                >
                                  {column.label}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody style={{ background: "#3f621217" }}>
                            {reportData.map((row, index) => (
                              <tr key={index}>
                                {GstSaleRegisterColumns.map(
                                  (column, colIndex) => (
                                    <td
                                      key={column.id}
                                      style={
                                        colIndex === 0
                                          ? {
                                            borderRadius: "10px 0 0 10px",
                                          }
                                          : colIndex ===
                                            GstSaleRegisterColumns.length - 1
                                            ? {
                                              borderRadius: "0 10px 10px 0",
                                            }
                                            : {}
                                      }
                                    >
                                      {column.id === "rsImpact"
                                        ? (() => {
                                          const rsImpact = (
                                            parseFloat(row.mrp || 0) *
                                            parseFloat(
                                              row.physical_stock || 0
                                            ) -
                                            parseFloat(row.mrp || 0) *
                                            parseFloat(
                                              row.current_stock || 0
                                            )
                                          ).toFixed(2);

                                          return (
                                            <Tooltip
                                              title="click to adjust"
                                              placement="left-start"
                                              arrow
                                            >
                                              <span
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handelAddOpen(row);
                                                }}
                                                style={{
                                                  color:
                                                    rsImpact >= 0
                                                      ? "var(--color1)"
                                                      : "var(--color6)",
                                                }}
                                              >
                                                <img
                                                  src="/approve.png"
                                                  className="report-icon inline mr-2"
                                                  alt="csv"
                                                />

                                                {rsImpact}
                                              </span>
                                            </Tooltip>
                                          );
                                        })()
                                        : row[column.id]
                                          ? row[column.id]
                                            .charAt(0)
                                            .toUpperCase() +
                                          row[column.id].slice(1)
                                          : "-"}
                                    </td>
                                  )
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                ) : (
                  <div>
                    <div className="vector-image">
                      <div style={{ maxWidth: "200px", marginBottom: "20px" }}>
                        <img src="../empty_image.png" alt="empty"></img>
                      </div>
                      <span className="text-gray-500 font-semibold">
                        Oops !
                      </span>
                      <p className="text-gray-500 font-semibold">
                        No Items found with your search criteria.
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-center mt-4">
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
                  className={`mx-1 px-3 py-1 rounded ${currentPage === rowsPerPage
                      ? "bg-gray-200 text-gray-700"
                      : "secondary-bg text-white"
                    }`}
                //    disabled={filteredList.length === 0}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
        <Dialog open={openAddPopUp}>
          <DialogTitle id="alert-dialog-title" className="primary">
            Stock Adjustment
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={resetAddDialog}
            sx={{
              position: "absolute",
              right: 12,
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
                <div className="flex gap-4">
                  <div>
                    <span className="title primary mb-2">Adjustment Date</span>
                    <DatePicker
                      className="custom-datepicker "
                      selected={adjustmentDate}
                      onChange={(newDate) => setAdjustDate(newDate)}
                      dateFormat="dd/MM/yyyy"
                      minDate={subDays(new Date(), 15)} //
                    />
                  </div>
                  <div>
                    <span className="title mb-2">Item Name</span>
                    <TextField
                      autoComplete="off"
                      id="outlined-number"
                      // type="number"
                      disabled
                      sx={{ width: "195px" }}
                      size="small"
                      value={batchListData.iteam_name}
                    />

                    {/* <Autocomplete
                                            disablePortal
                                            id="combo-box-demo"
                                            options={purchaseItemData}
                                            size="small"
                                            // value={itemName}
                                            onChange={handleOptionChange}
                                            disabled
                                            sx={{ width: 200 }}
                                            getOptionLabel={(option) => option.iteam_name}
                                            
                                        /> */}
                  </div>
                </div>
                <div className="flex gap-4">
                  <div>
                    <span className="title mb-2">Batch</span>
                    <TextField
                      autoComplete="off"
                      id="outlined-number"
                      // type="number"
                      disabled
                      sx={{ width: "130px" }}
                      size="small"
                      value={batchListData.batch_name}
                    />
                    {/* <Autocomplete
                                            disablePortal
                                            id="combo-box-demo"
                                            options={batchListData}
                                            size="small"
                                            value={batchListData.batch_name}
                                            onChange={handleBatchData}
                                            sx={{ width: 200 }}
                                            getOptionLabel={(option) => option.batch_number}
                                            renderInput={(params) => (
                                                <TextField
                 autoComplete="off" {...params} label="Select Batch" />
                                            )}
                                        /> */}
                  </div>

                  <div>
                    <span className="title mb-2">Company</span>
                    <TextField
                      autoComplete="off"
                      id="outlined-number"
                      // type="number"
                      disabled
                      sx={{ width: "275px" }}
                      size="small"
                      value={batchListData.company_name}
                    />
                    {/* <Autocomplete
                                            disablePortal
                                            id="combo-box-demo"
                                            options={companyList}
                                            size="small"
                                            disabled
                                            value={selectedCompany}
                                            onChange={(e, value) => setSelectedCompany(value)}
                                            sx={{ width: 200 }}
                                            getOptionLabel={(option) => option.company_name}
                                            renderInput={(params) => (
                                                <TextField
                 autoComplete="off"
                                                    {...params}
                                                label="Select Company"
                                                />
                                            )}
                                        /> */}
                  </div>
                </div>
                <div className="flex gap-4">
                  <div>
                    <span className="title mb-2">Unit</span>
                    <TextField
                      autoComplete="off"
                      disabled
                      required
                      id="outlined-number"
                      sx={{ width: "130px" }}
                      size="small"
                      value={batchListData.unit}
                      onChange={(e) => setUnit(e.target.value)}
                    />
                  </div>
                  <div>
                    <span className="title mb-2">Expiry</span>
                    <TextField
                      autoComplete="off"
                      id="outlined-number"
                      sx={{ width: "130px" }}
                      size="small"
                      disabled
                      value={batchListData.expiry_date}
                      onChange={(e) => {
                        setExpiry(e.target.value);
                      }}
                    />
                  </div>
                  <div>
                    <span className="title mb-2">MRP</span>
                    <TextField
                      autoComplete="off"
                      id="outlined-number"
                      type="number"
                      sx={{ width: "130px" }}
                      size="small"
                      disabled
                      value={batchListData.mrp}
                      onChange={(e) => {
                        setMrp(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div>
                    <span className="title mb-2">Stock </span>
                    <TextField
                      autoComplete="off"
                      id="outlined-number"
                      type="number"
                      sx={{ width: "130px" }}
                      size="small"
                      disabled
                      value={batchListData.stock}
                      onChange={(e) => {
                        setStock(e.target.value);
                      }}
                    />
                  </div>
                  <div>
                    <span className="title mb-2">Stock Adjusted </span>
                    {/* <TextField
                 autoComplete="off"
                                        id="outlined-number"
                                        type="number"
                                        sx={{ width: '130px' }}
                                        size="small"
                                        value={stockAdjust}
                                        onChange={(e) => { setStockAdjust(e.target.value) }}
                                    /> */}
                    <TextField
                      autoComplete="off"
                      id="outlined-number"
                      type="number"
                      sx={{ width: "130px" }}
                      size="small"
                      value={stockAdjust}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        setStockAdjust(value);

                        // setStockAdjust(value > 0 ? -value : value);
                      }}
                    />
                  </div>
                  <div>
                    <span className="title mb-2">Remaining Stock </span>
                    <TextField
                      autoComplete="off"
                      disabled
                      id="outlined-number"
                      type="number"
                      sx={{ width: "130px" }}
                      size="small"
                      value={remainingStock}
                    />
                  </div>
                </div>
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <div className="flex gap-4 mr-4 pb-4">
              <Button
                autoFocus
                variant="contained"
                className="p-5"
                onClick={validateForm}
                style={{
                  color: "white",
                  background: "var(--COLOR_UI_PHARMACY)",
                  outline: "none",
                  boxShadow: "none",
                }}
              >
                Save
              </Button>
              <Button
                autoFocus
                variant="contained"
                onClick={resetAddDialog}
                color="error"
                style={{
                  color: "white",
                  background: "#F31C1C",
                  outline: "none",
                  boxShadow: "none",
                }}
              >
                Cancel
              </Button>
            </div>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};
export default Inventory_Reconciliation;
