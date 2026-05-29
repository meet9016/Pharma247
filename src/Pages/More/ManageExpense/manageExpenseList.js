import { BsLightbulbFill } from "react-icons/bs";
import Header from "../../Header";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import {
  AlertTitle,
  Autocomplete,
  Box,
  Button,
  Collapse,
  FormControl,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import axios from "axios";
import DatePicker from "react-datepicker";
import { format, subDays } from "date-fns";
// import dayjs from 'dayjs';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { FaArrowUp } from "react-icons/fa";
import Alert from "@mui/material/Alert";
import Loader from "../../../componets/loader/Loader";
import { toast, ToastContainer } from "react-toastify";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const ManageExpense = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState(subDays(new Date(), 15));
  const [endDate, setEndDate] = useState(new Date());
  const [expenseDate, setExpenseDate] = useState(new Date());
  const [paymentdate, setPaymentDate] = useState(new Date());
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedGSTOption, setSelectedGSTOption] = useState("withOut_GST");
  const [party, setParty] = useState("");
  const [gst, setGST] = useState("");
  const [gstIN, setGstIN] = useState("");
  const [total, setTotal] = useState(0);
  const [amount, setAmount] = useState(0);
  const [refNo, setRefNo] = useState("");
  const [remark, setRemark] = useState("");
  const [paymentType, setPaymentType] = useState("cash");
  const pdfIcon = process.env.PUBLIC_URL + "/pdf.png";

  // Pagination states
  const rowsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const paymentOptions = [
    { id: 1, label: "Cash" },
    { id: 2, label: "Credit" },
    { id: 3, label: "UPI" },
    { id: 4, label: "Cheque" },
    { id: 5, label: "Paytm" },
    { id: 6, label: "CC/DC" },
    { id: 7, label: "RTGS/NEFT" },
  ];

  const token = localStorage.getItem("token");

  const expenseColumns = [
    { id: "expense_date", label: "Expense Date ", minWidth: 100 },
    { id: "category", label: "Category", minWidth: 100 },
    { id: "payment_mode", label: "Payment Mode", minWidth: 100 },
    { id: "reference_no", label: "Ref.No", minWidth: 100 },
    { id: "remark", label: "Remark", minWidth: 100 },
    { id: "amount", label: "Amount", minWidth: 100 },
    { id: "gst", label: "GST (%)", minWidth: 100 },
    { id: "total", label: "Total", minWidth: 100 },
  ];
  const [errors, setErrors] = useState({});
  const [expenseData, setExpenseData] = useState([]);
  const [openAddPopUp, setOpenAddPopUp] = useState(false);
  const [openAddPopUpDownload, setOpenAddPopUpDownload] = useState(false);
  const [catagory, setCatagory] = useState("");
  const [catagoryList, setCatagoryList] = useState([]);
  const [bankData, setBankData] = useState([]);

  // Calculate total pages
  const totalPages = Math.ceil(totalRecords / rowsPerPage);

  useEffect(() => {
    CatagoryList();
    BankList();
  }, []);

  // Updated useEffect for pagination
  useEffect(() => {
    if (currentPage > 0) {
      expenseList();
    }
  }, [currentPage, catagory]);

  const CatagoryList = async () => {
    let data = new FormData();
    setIsLoading(true);
    try {
      await axios
        .post("cash-category-list", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setCatagoryList(response.data.data);
          setIsLoading(false);
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

  const BankList = async () => {
    let data = new FormData();
    setIsLoading(true);
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
          setIsLoading(false);
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

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  const handlePdf = () => {
    setOpenAddPopUpDownload(true);
    pdfGenerator();
  };
  const handleCloseDialog = () => {
    setOpenAddPopUp(false);
    setSelectedOption(null);
    setExpenseDate(new Date());
    setPaymentDate(new Date());
    setSelectedGSTOption("withOut_GST");
    setGST(null);
    setGstIN(null);
    setParty(null);
    setAmount(null);
    setTotal(null);
    setPaymentType(null);
    setRefNo(null);
    setErrors("");
    setRemark(null);
  };

  const handleGSTOption = (e) => {
    setSelectedGSTOption(e.target.value);
    setGST(null);
    setGstIN(null);
    setParty(null);
    setErrors("");
  };

  const handleGSTChange = (e) => {
    const value = e.target.value;
    if (value === "" || (Number(value) >= 0 && Number(value) <= 100)) {
      setGST(value);
    }
  };

  const handleCategoryFilter = (e) => {
    setCatagory(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  useEffect(() => {
    if (selectedGSTOption == "with_GST") {
      const gstAmount = (parseFloat(amount) * parseFloat(gst)) / 100;
      const total = parseFloat(amount) + parseFloat(gstAmount);
      setTotal(total);
    } else {
      setTotal(amount);
    }
  }, [gst, amount]);

  const handleStartDate = (newDate) => {
    setStartDate(newDate);
    setCurrentPage(1); // Reset to first page when filter changes
    setTimeout(() => expenseList(), 0);
  };

  const handleEndDate = (newDate) => {
    setEndDate(newDate);
    setCurrentPage(1); // Reset to first page when filter changes
    setTimeout(() => expenseList(), 0);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!selectedOption) newErrors.selectedOption = "Category is required";
    if (selectedGSTOption === "with_GST") {
      if (!gst) newErrors.gst = "GST is required";
      if (!gstIN) newErrors.gstIN = "GSTN Number is required";
      if (!party) newErrors.party = "Party Name is required";
      if (!amount) newErrors.amount = "Amount is required";
    } else {
      if (!amount) newErrors.amount = "Amount is required";
    }
    if (!paymentType) newErrors.paymentType = "Payment Mode is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const pdfGenerator = async () => {
    let data = new FormData();

    try {
      const response = await axios.post("pdf-expense", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        // responseType: 'blob', // Ensure the response is in blob format
      });
      if (response.data.status === 401) {
        history.push("/");
        localStorage.clear();
      }

      // Create a Blob from the PDF Stream
      // const file = new Blob([response.data], { type: 'application/pdf' });

      // Create a URL for the Blob
      // const fileURL = URL.createObjectURL(file);

      // Open the URL in a new window
      // window.open(fileURL);
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

  // Updated expenseList function with pagination
  const expenseList = () => {
    let data = new FormData();
    data.append("page", currentPage);

    const params = {
      start_date: startDate ? format(startDate, "yyyy-MM-dd") : "",
      end_date: endDate ? format(endDate, "yyyy-MM-dd") : "",
      category: catagory,
      page: currentPage,
      limit: rowsPerPage,
    };
    setIsLoading(true);

    try {
      axios
        .post("list-expense", data, {
          params: params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const responseData = response.data.data;
          
          if (response.data.status === 401) {
            history.push("/");
            localStorage.clear();
            return;
          }

          // Set the expense data
          setExpenseData(responseData || { expense_list: [], total: 0 });
          
          // Extract and set total count for pagination
          const totalCount = response.data.total_records || responseData?.expense_list?.length || 0;
          setTotalRecords(totalCount);
          
          setIsLoading(false);
        });
    } catch (error) {
      console.error("API error:", error);
      setExpenseData({ expense_list: [], total: 0 });
      setTotalRecords(0);
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

  const handleAddExpense = async () => {
    if (validateForm()) {
      // Proceed with saving the expense
      let data = new FormData();
      data.append("category", selectedOption||"");
      data.append(
        "expense_date",
        expenseDate ? format(expenseDate, "yyyy-MM-dd") : ""
      );
      data.append(
        "payment_date",
        paymentdate ? format(paymentdate, "yyyy-MM-dd") : ""
      );
      data.append("gst_type", selectedGSTOption||"");
      data.append("gst", gst||"");
      data.append("gstn_number", gstIN||"");
      data.append("party", party||"");
      data.append("amount", amount||"");
      data.append("total", total||"");
      data.append("payment_mode", paymentType||"");
      data.append("reference_no", refNo||"");
      data.append("remark", remark||"");

      try {
        await axios
          .post("add-expense", data, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            expenseList();
            setOpenAddPopUp(false);
            setSelectedOption(null);
            setExpenseDate(new Date());
            setPaymentDate(new Date());
            setSelectedGSTOption("withOut_GST");
            setGST(null);
            setGstIN(null);
            setParty(null);
            setAmount(null);
            setTotal(null);
            setPaymentType(null);
            setRefNo(null);
            setErrors("");
            setRemark(null);
             toast.dismiss();
toast.success(response.data.message);
            setTimeout(() => {
              setOpenAddPopUp(false);
            }, 2000);
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
    }
  };

  // Pagination handlers
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
                  className="mb-4 mng_expnse_main_hdr"
                  style={{ display: "flex", gap: "4px" }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "7px",
                      marginBottom: "10px",
                      alignItems: "center",
                    }}
                  >
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
                      Manage Expense
                    </span>
                    <BsLightbulbFill className="w-6 h-6 secondary hover-yellow" />
                  </div>
                  <div
                    className="headerList both_btn_expn"
                    style={{ marginBottom: "10px" }}
                  >
                    <Button
                      variant="contained"
                      className="gap-2 add_btn_expn"
                      style={{
                        textTransform: "none",
                        background: "var(--color1)",
                      }}
                      onClick={() => setOpenAddPopUp(true)}
                    >
                      {" "}
                      <AddIcon className="" />
                      Add
                    </Button>
                    <Button
                      variant="contained"
                      className="gap-7 add_btn_expn"
                      style={{
                        background: "var(--color1)",
                        color: "white",
                        // paddingLeft: "35px",
                        textTransform: "none",
                        display: "flex",
                      }}
                      onClick={handlePdf}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <img
                          src="/csv-file.png"
                          className="report-icon absolute mr-10"
                          alt="csv "
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
                <div className="csrtureddididid flex flex-col gap-3 justify-between md:flex-row mt-4 oreder_list_fld_rp pb-2" style={{ width: "100%", alignItems: "end" }}>
                  <div className="grid grid-cols-1 sm:grid-cols-2  md:grid-cols-4 w-full gap-3 ttl_dldld">
                    <div>
                      <span className="text-gray-500 py-2">Start Date</span>
                      <div>
                        <DatePicker
                          className="md:mt-0 min-h-[41px] h-[41px] flex items-center justify-center custom-datepicker"
                          selected={startDate}
                          onChange={handleStartDate}
                          dateFormat="dd/MM/yyyy"
                        />
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">End Date</span>
                      <div>
                        <DatePicker
                          className="md:mt-0 min-h-[41px] h-[41px] flex items-center justify-center custom-datepicker"
                          selected={endDate}
                          onChange={handleEndDate}
                          dateFormat="dd/MM/yyyy"
                        />
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-500">Category</span>
                      <div>
                        <Select
                          labelId="dropdown-label"
                          className="category_fld"
                          id="dropdown"
                          value={catagory}
                          sx={{ width: "100%" }}
                          onChange={handleCategoryFilter}
                          size="small"
                          displayEmpty
                        >
                          <MenuItem value="">All</MenuItem>
                          {catagoryList?.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                              {option.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ttl_dldld">
                    <div
                      className="total_mng_expn"
                      style={{
                        background: "#f3f3f3",
                        padding: "12px",
                        borderRadius: "10px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <h2 className="primary font-medium text-xl ">
                        Total{" "}
                        <span className="secondary font-bold text-xl ">
                          Rs.{Number(expenseData.total).toFixed(2)}
                        </span>
                      </h2> 
                    </div>
                  </div>
                </div>
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
                        <th style={{ minWidth: 150, padding: '8px' }}>SR. No</th>
                        {expenseColumns.map((column) => (
                          <th
                            key={column.id}
                            style={{ minWidth: column.minWidth, padding: '8px' }}
                          >
                            {column.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody style={{ backgroundColor: "#3f621217" }}>
                      {expenseData?.expense_list?.length === 0 ? (
                        <tr>
                          <td
                            colSpan={expenseColumns.length + 1}
                            className="text-center text-gray-500"
                            style={{ borderRadius: "10px 10px 10px 10px" }}
                          >
                            No data found
                          </td>
                        </tr>
                      ) : (
                        expenseData?.expense_list?.map((item, index) => (
                          <tr
                            key={index}
                            className="bg-[#f5f8f3] align-middle"
                          >
                            <td className="rounded-l-[10px] px-4 py-2 font-semibold text-center">
                              {((currentPage - 1) * rowsPerPage) + index + 1}
                            </td>
                            {expenseColumns.map((column, colIndex) => {
                              const tdClass = "px-4 py-2 font-semibold text-center";
                              return (
                                <td
                                  key={column.id}
                                  className={`capitalize ${tdClass} ${
                                    colIndex === expenseColumns.length - 1 ? 'rounded-r-[10px]' : ''
                                  }`}
                                >
                                  {item[column.id]}
                                </td>
                              );
                            })}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Updated Pagination Section */}
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
                className={`mx-1 px-3 py-1 rounded ${
                  currentPage === 1
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
                className={`mx-1 px-3 py-1 rounded ${
                  currentPage >= totalPages
                    ? "bg-gray-200 text-gray-700"
                    : "secondary-bg text-white"
                }`}
                disabled={currentPage >= totalPages}
              >
                Next
              </button>
            </div>

            <Dialog className="custom-dialog"
              open={openAddPopUpDownload}
              sx={{
                "& .MuiDialog-container": {
                  "& .MuiPaper-root": {
                    width: "600px",
                    maxWidth: "1500px",
                    backgroundColor: "none",
                    boxShadow: "none",
                    marginBottom: "0",
                  },
                },
              }}
            >
              <Alert
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setOpenAddPopUpDownload(false);
                    }}
                  >
                    <CloseIcon fontSize="inherit" style={{ cursor: "pointer", color: "black" }} />
                  </IconButton>
                }
                sx={{ mb: 2 }}
              >
                <h4 className="font-bold text-lg">
                  {" "}
                  Please check your email.{" "}
                </h4>
                <span className="text-base">
                  You will receive a maill from us within the next few minutes.
                </span>
              </Alert>
            </Dialog>

            <Dialog open={openAddPopUp} className="custom-dialog modal_991">
              <DialogTitle id="alert-dialog-title" className="primary">
                Add Expense
              </DialogTitle>
              <IconButton
                aria-label="close"
                onClick={handleCloseDialog}
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
                  <div className="flex flex-col sm:flex-col md:flex-row gap-4 mb-3">
                    <div
                      className="w-full lg:w-1/3 border-b md:border-b-0 md:border-r"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        lineHeight: "2rem",
                        width: "inherit",
                      }}
                    >
                      <span className="primary">Category</span>
                      <FormControl style={{ whiteSpace: "nowrap" }}>
                        <RadioGroup
                          aria-labelledby="demo-radio-buttons-group-label"
                          defaultValue="items"
                          name="radio-buttons-group"
                          sx={{
                            color: "var(--color1)", // Apply color to labels
                            "& .MuiRadio-root": {
                              color: "var(--color2)", // Unchecked radio button color
                            },
                            "& .Mui-checked": {
                              color: "var(--color1)", // Checked radio button color
                            },
                          }}
                          value={selectedOption}
                          onChange={(e) => setSelectedOption(e.target.value)}
                        >
                          {catagoryList.map((category) => (
                            <FormControlLabel
                              style={{ color: "var(--COLOR_UI_PHARMACY)" }}
                              key={category.id}
                              value={category.id}
                              control={<Radio />}
                              label={capitalizeFirstLetter(category.name)}
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                      {errors.selectedOption && (
                        <div className="error">{errors.selectedOption}</div>
                      )}
                    </div>
                    <div className="w-full lg:w-2/3 flex flex-col gap-5">
                      <div className="flex flex-col md:flex-row gap-5">
                        <div className="w-full md:w-1/2">
                          <span
                            className=""
                            style={{ color: "var(--COLOR_UI_PHARMACY)" }}
                          >
                            Expense Date
                          </span>
                          <DatePicker
                            className="custom-datepicker w-[170px]"
                            selected={expenseDate}
                            onChange={(newDate) => setExpenseDate(newDate)}
                            dateFormat="dd/MM/yyyy"
                          />
                          {errors.expenseDate && (
                            <div className="error">{errors.expenseDate}</div>
                          )}
                        </div>
                        <div className="w-full md:w-1/2">
                          <span
                            className=""
                            style={{ color: "var(--COLOR_UI_PHARMACY)" }}
                          >
                            Payment Date
                          </span>
                          <DatePicker
                            className="custom-datepicker w-[170px]"
                            selected={paymentdate}
                            onChange={(newDate) => setPaymentDate(newDate)}
                            dateFormat="dd/MM/yyyy"
                          />
                          {errors.paymentdate && (
                            <div className="error">{errors.paymentdate}</div>
                          )}
                        </div>
                      </div>
                      <div>
                        <FormControl className="flex">
                          <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue="items"
                            name="radio-buttons-group"
                            value={selectedGSTOption}
                            onChange={handleGSTOption}
                            className="flex"
                            sx={{
                              color: "var(--color1)", // Apply color to labels
                              "& .MuiRadio-root": {
                                color: "var(--color2)", // Unchecked radio button color
                              },
                              "& .Mui-checked": {
                                color: "var(--color1)", // Checked radio button color
                              },
                            }}
                          >
                            <FormControlLabel
                              value="with_GST"
                              style={{ color: "var(--COLOR_UI_PHARMACY)" }}
                              control={<Radio />}
                              label="With GST"
                            />
                            <FormControlLabel
                              value="withOut_GST"
                              style={{ color: "var(--COLOR_UI_PHARMACY)" }}
                              control={<Radio />}
                              label="Without GST"
                            />
                          </RadioGroup>
                        </FormControl>
                      </div>

                      {selectedGSTOption === "with_GST" && (
                        <>
                          <div className="flex flex-col md:flex-row gap-5">
                            <div
                              className="w-full md:w-1/2"
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <span
                                className=""
                                style={{ color: "var(--COLOR_UI_PHARMACY)" }}
                              >
                                GST(%)
                              </span>
                              <TextField
                                autoComplete="off"
                                required
                                type="number"
                                size="small"
                                value={gst}
                                onChange={handleGSTChange}
                                // inputProps={{ min: 0, max: 100 }}
                              />
                              {errors.gst && (
                                <div className="error">{errors.gst}</div>
                              )}
                            </div>
                            <div
                              className="w-full md:w-1/2"
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <span
                                className=""
                                style={{ color: "var(--COLOR_UI_PHARMACY)" }}
                              >
                                GSTN Number
                              </span>
                              <TextField
                                autoComplete="off"
                                required
                                size="small"
                                value={gstIN}
                                onChange={(e) =>
                                  setGstIN(e.target.value.toUpperCase())
                                }
                              />
                              {errors.gstIN && (
                                <div className="error">{errors.gstIN}</div>
                              )}
                            </div>
                          </div>
                          <div
                            className="w-full md:w-1/2"
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <span
                              className=""
                              style={{ color: "var(--COLOR_UI_PHARMACY)" }}
                            >
                              Party Name
                            </span>
                            <TextField
                              autoComplete="off"
                              required
                              size="small"
                              value={party}
                              onChange={(e) => setParty(e.target.value)}
                            />
                            {errors.party && (
                              <div className="error">{errors.party}</div>
                            )}
                          </div>
                        </>
                      )}

                      <div className="flex flex-col md:flex-row gap-5">
                        <div
                          className="w-full md:w-1/2"
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <span
                            className=""
                            style={{ color: "var(--COLOR_UI_PHARMACY)" }}
                          >
                            without GST Amount
                          </span>
                          {/* <span className="ExpenseBoxSubTitle">Amount(Excluding GST)</span> */}
                          <TextField
                            autoComplete="off"
                            required
                            type="number"
                            size="small"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                          />
                          {errors.amount && (
                            <div className="error">{errors.amount}</div>
                          )}
                        </div>
                        <div
                          className="w-full md:w-1/2"
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <span
                            className=""
                            style={{ color: "var(--COLOR_UI_PHARMACY)" }}
                          >
                            Total
                          </span>
                          <TextField
                            autoComplete="off"
                            required
                            type="number"
                            size="small"
                            value={total}
                            onChange={(e) => setTotal(e.target.value)}
                          />
                          {errors.total && (
                            <div className="error">{errors.total}</div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-5">
                        <div
                          className="w-full md:w-1/2"
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <span
                            className=""
                            style={{ color: "var(--COLOR_UI_PHARMACY)" }}
                          >
                            Payment Mode
                          </span>
                          <Select
                            className="w-full md:w-full"
                            value={paymentType}
                            onChange={(e) => setPaymentType(e.target.value)}
                            size="small"
                          >
                            <MenuItem value="cash">Cash</MenuItem>
                            {bankData?.map((option) => (
                              <MenuItem key={option.id} value={option.id}>
                                {option.bank_name}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.paymentType && (
                            <div className="error">{errors.paymentType}</div>
                          )}
                        </div>
                        <div
                          className="w-full md:w-1/2"
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <span
                            className=""
                            style={{ color: "var(--COLOR_UI_PHARMACY)" }}
                          >
                            Reference No.
                          </span>
                          <TextField
                            autoComplete="off"
                            required
                            type="number"
                            size="small"
                            value={refNo}
                            onChange={(e) => setRefNo(e.target.value)}
                          />
                          {errors.refNo && (
                            <div className="error">{errors.refNo}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row gap-5">
                        <div
                          className="w-full md:w-1/2"
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <span
                            className=""
                            style={{ color: "var(--COLOR_UI_PHARMACY)" }}
                          >
                            Remark
                          </span>
                          <TextField
                            autoComplete="off"
                            required
                            size="small"
                            value={remark}
                            onChange={(e) => setRemark(e.target.value)}
                          />
                          {errors.remark && (
                            <div className="error">{errors.remark}</div>
                          )}
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
                  style={{
                    background: "var(--COLOR_UI_PHARMACY)",
                    width: "fit-content",
                  }}
                  onClick={handleAddExpense}
                >
                  Save
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        )}
      </div>
    </>
  );
};
export default ManageExpense;