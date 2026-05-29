import Header from "../../../Header";
import { BsLightbulbFill } from "react-icons/bs";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Button } from "@mui/material";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { addDays, format, subDays, subMonths } from "date-fns";
import {
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  MenuList,
  Select,
  TextField,
} from "@mui/material";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { toast, ToastContainer } from "react-toastify";
const SalesBill = () => {
  const history = useHistory();
  const token = localStorage.getItem("token");
  // const [startDate, setStartDate] = useState(dayjs().add(-3, 'day'));
  const [lastMonth, setLastMonth] = useState(subMonths(new Date(), 1));
  const [reportType, setReportType] = useState();
  const [paymentMode, setPaymentMode] = useState();
  const [total, setTotal] = useState(0);
  const [bankData, setBankData] = useState([]);
  const [saleGSTData, setSaleGSTData] = useState([]);
  const csvIcon = process.env.PUBLIC_URL + "/csv.png";
  const GstSaleBillColumns = [
    { id: "bill_no", label: "Bill No", minWidth: 150 },
    { id: "bill_date", label: "Bill Date", minWidth: 150 },
    { id: "customer", label: "Customer Name", minWidth: 150 },
    { id: "payment_type", label: "Payment Type ", minWidth: 150 },
    { id: "sgst", label: "SGST", minWidth: 150 },
    { id: "cgst", label: "CGST", minWidth: 150 },
    { id: "igst", label: "IGST ", minWidth: 150 },
    { id: "net_amount", label: "Total Bill Amount", minWidth: 150 },
  ];
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const rowsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * rowsPerPage + 1;
  const totalPages = Math.ceil(saleGSTData?.sales?.length / rowsPerPage);

  useEffect(() => {
    BankList();
  }, []);

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

  const validateForm = () => {
    const newErrors = {};
    if (!reportType) {
      newErrors.reportType = "Select any Report Type.";
      toast.dismiss();
      toast.error(newErrors.reportType);
    } else if (reportType && !paymentMode) {
      newErrors.paymentMode = "Select any Purchase Type.";
      toast.dismiss();
      toast.error(newErrors.paymentMode);
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlefilterData = async (currentPage) => {
    if (validateForm()) {
      let data = new FormData();
      let x = "";
      if (paymentMode !== "all") {
        let x = paymentMode;
      }
      setIsLoading(true);
      const params = {
        month_year: lastMonth ? format(lastMonth, "MM-yyyy") : "",
        type: reportType,
        payment_mode: paymentMode === "all" ? x : paymentMode,
        page: currentPage,
      };
      try {
        await axios
          .post("report-gst-sales", data, {
            params: params,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            setIsLoading(false);
            setSaleGSTData(response.data.data);
            setTotal(response.data.data.net_amount);
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

  const exportToCSV = () => {
    if (saleGSTData.length == 0) {
      toast.dismiss();
      toast.error("Apply filter, then download records.");
    } else {
      const filteredData = saleGSTData?.sales?.map(
        ({
          bill_no,
          bill_date,
          customer,
          payment_type,
          sgst,
          cgst,
          igst,
          net_amount,
        }) => ({
          BillNo: bill_no,
          BillDate: bill_date,
          Customer: customer,
          PaymentType: payment_type,
          SGST: sgst,
          CGST: cgst,
          IGST: igst,
          BillAmount: net_amount,
        })
      );
      // Create a new worksheet from the filtered data
      const worksheet = XLSX.utils.json_to_sheet(filteredData);

      // Convert the worksheet to CSV format
      const csv = XLSX.utils.sheet_to_csv(worksheet);

      // Convert the CSV string to a Blob
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

      // Save the file using file-saver
      saveAs(blob, "Sales_Bill_Report.csv");
    }
  };

  const handleClick = (pageNum) => {
    setCurrentPage(pageNum);
    handlefilterData(pageNum);
  };
  const handlePrevious = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      handlefilterData(newPage);
    }
  };

  const handleNext = () => {
    const newPage = currentPage + 1;
    setCurrentPage(newPage);
    handlefilterData(newPage);
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
              <span
                style={{
                  color: "var(--color2)",
                  display: "flex",
                  fontWeight: 700,
                  fontSize: "20px",
                  cursor: "pointer",
                }}
                onClick={() => history.push("/reports")}
              >
                {" "}
                Reports
              </span>

              <ArrowForwardIosIcon
                style={{ fontSize: "18px", color: "var(--color1)" }}
              />

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
                GST Sales Bill
                <BsLightbulbFill className=" w-6 h-6 secondary hover-yellow" />
              </span>
            </div>
            <div className="headerList">
              <Button
                variant="contained"
                className="gap-7 report_btn_purch"
                style={{
                  background: "var(--color1)",
                  color: "white",
                  // paddingLeft: "35px",
                  textTransform: "none",
                  display: "flex",
                }}
                onClick={exportToCSV}
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
          <div className="mt-4 ">
            <div className="manageExpenseRow">
              <div
                className="oreder_list_fld_rp flex flex-col gap-2 md:flex-row pb-2 csrtureddididid"
                style={{ width: "100%", alignItems: "end" }}
              >
                <div
                  className="grid grid-cols-1 sm:grid-cols-2  md:grid-cols-4 w-full gap-3 ttl_dldld"
                  style={{ alignItems: "end" }}
                >
                  <div className="detail_report flex flex-col detailrep_100">
                    <span className="primary">Start Date</span>
                    <div style={{ width: "100%" }}>
                      <DatePicker
                        className="custom-datepicker "
                        selected={lastMonth}
                        onChange={(newDate) => setLastMonth(newDate)}
                        dateFormat="MM/yyyy"
                        showMonthYearPicker
                      />
                    </div>
                  </div>
                  <div className="detail_report flex flex-col detailrep_100">
                    <FormControl sx={{ width: "100%" }} size="small">
                      <InputLabel id="demo-select-small-label">
                        Report Type
                      </InputLabel>
                      <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                        label="Report Type"
                      >
                        <MenuItem value="" disabled>
                          Select Report Type
                        </MenuItem>
                        <MenuItem value="0">Sales</MenuItem>
                        <MenuItem value="1">Sales Return</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <div className="detail_report flex flex-col detailrep_100">
                    <div style={{ width: "100%" }}>
                      <FormControl sx={{ width: "100%" }} size="small">
                        <InputLabel id="demo-select-small-label">
                          Payment Mode
                        </InputLabel>
                        <Select
                          labelId="demo-select-small-label"
                          id="demo-select-small"
                          value={paymentMode}
                          onChange={(e) => setPaymentMode(e.target.value)}
                          label="Payment Mode"
                        >
                          <MenuItem value="" disabled>
                            Select Payment Mode
                          </MenuItem>
                          <MenuItem value="all">All</MenuItem>
                          <MenuItem value="cash">Cash</MenuItem>
                          {bankData?.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                              {option.bank_name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                  <div className="detail_report flex flex-col detailrep_100">
                    <Button
                      style={{
                        background: "var(--color1)",
                        height: "40px",
                        width: "fit-content",
                      }}
                      variant="contained"
                      onClick={() => handlefilterData(currentPage)}
                    >
                      Go
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2 ttl_dldld">
                  <div
                    className="total_mng_expn  detail_report_totl"
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
                        Rs.{total}
                      </span>
                    </h2>
                  </div>
                </div>
              </div>
            </div>
            {saleGSTData?.sales?.length > 0 ? (
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
                        {GstSaleBillColumns.map((column) => (
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
                      {saleGSTData?.sales?.map((item, index) => (
                        <tr key={index}>
                          {GstSaleBillColumns.map((column, colIndex) => (
                            <td
                              key={column.id}
                              style={
                                colIndex === 0
                                  ? {
                                    borderRadius: "10px 0 0 10px",
                                  }
                                  : colIndex === GstSaleBillColumns.length - 1
                                    ? {
                                      borderRadius: "0 10px 10px 0",
                                    }
                                    : {}
                              }
                            >
                              {item[column.id]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div
                  className="mt-4 space-x-1"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
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
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => handleClick(i + 1)}
                      className={`mx-1 px-3 py-1 rounded ${currentPage === i + 1
                          ? "secondary-bg text-white"
                          : "bg-gray-200 text-gray-700"
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={handleNext}
                    className={`mx-1 px-3 py-1 rounded ${currentPage === rowsPerPage
                        ? "bg-gray-200 text-gray-700"
                        : "secondary-bg text-white"
                      }`}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="SearchIcon">
                  <div>
                    <FaSearch className="IconSize" />
                  </div>
                  <p className="text-gray-500 font-semibold">
                    Apply filter to get records.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default SalesBill;
