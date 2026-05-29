import Header from "../../../Header";
import { useEffect, useState } from "react";
import { BsLightbulbFill } from "react-icons/bs";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Button } from "@mui/material";
import DatePicker from "react-datepicker";
import { addDays, format, subDays, subMonths } from "date-fns";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import {
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  MenuList,
  Select,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Loader from "../../../../componets/loader/Loader";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { toast, ToastContainer } from "react-toastify";
const DoctorItemWise = () => {
  const history = useHistory();
  const token = localStorage.getItem("token");
  const [startDate, setStartDate] = useState(subDays(new Date(), 2));
  const [endDate, setEndDate] = useState(new Date());
  const [reportType, setReportType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [doctorSearch, setDoctorSearch] = useState();
  const [itemSearch, setItemSearch] = useState();
  const csvIcon = process.env.PUBLIC_URL + "/csv.png";
  const [total, setTotal] = useState(0);
  const [qTY, setQTY] = useState("");
  const [totalNetProfit, setTotalNetProfit] = useState("");
  const [errors, setErrors] = useState({});
  const rowsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * rowsPerPage + 1;
  const [doctorItemWiseData, setDoctorItemWiseData] = useState([]);
  const totalPages = Math.ceil(doctorItemWiseData.length / rowsPerPage);
  const DoctorItemWiseColumns = [
    { id: "bill_no", label: "Bill No", minWidth: 150 },
    { id: "bill_date", label: "Bill Date", minWidth: 150 },
    { id: "doctor_name", label: "Doctor Name ", minWidth: 150 },
    { id: "phone_number", label: "Mobile", minWidth: 150 },
    { id: "item_name", label: "Item Name", minWidth: 150 },
    { id: "unit", label: "Unit", minWidth: 150 },
    { id: "exp", label: "Expiry", minWidth: 150 },
    { id: "sales_rate", label: "Sale Rate", minWidth: 150 },
    { id: "qty", label: "Qty", minWidth: 150 },
    { id: "amount", label: "Amount", minWidth: 150 },
    { id: "net_profit", label: "Net Profit", minWidth: 150 },
  ];
  const fieldsWithCurrency = ["sales_rate", "amount", "net_profit"];
  const validateForm = () => {
    const newErrors = {};
    if (!reportType) {
      newErrors.reportType = "Select any Report Type.";
      toast.dismiss();
      toast.error(newErrors.reportType);
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlefilterData = async (currentPage) => {
    if (validateForm()) {
      let data = new FormData();
      setIsLoading(true);
      const params = {
        start_date: startDate ? format(startDate, "yyyy-MM-dd") : "",
        end_date: endDate ? format(endDate, "yyyy-MM-dd") : "",
        type: reportType,
        item_name: itemSearch,
        doctor_name: doctorSearch,
        page: currentPage,
      };
      try {
        await axios
          .post("item-wise-doctor", data, {
            params: params,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            setIsLoading(false);
            setDoctorItemWiseData(response.data.data);
            setTotal(response.data.data.total_amount);
            setTotalNetProfit(response.data.data.total_net_profite);
            setQTY(response.data.data.total_qty);
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
    if (doctorItemWiseData.length == 0) {
      toast.dismiss();
      toast.error("Apply filter and then after download records.");
    } else {
      const total_amount = doctorItemWiseData.total_amount;
      const total_net_profite = doctorItemWiseData.total_net_profite;
      const total_qty = doctorItemWiseData.total_qty;

      const filteredData = doctorItemWiseData?.doctor_report?.map(
        ({
          bill_no,
          bill_date,
          doctor_name,
          phone_number,
          net_profit,
          amount,
          sales_rate,
          qty,
          exp,
          unit,
          item_name,
        }) => ({
          BillNo: bill_no,
          BillDate: bill_date,
          DoctorName: doctor_name,
          MobileNo: phone_number,
          ItemName: item_name,
          Unit: unit,
          Expiry: exp,
          SaleRate: sales_rate,
          Qty: qty,
          Amount: amount,
          NetProfit: net_profit,
        })
      );

      // Custom data rows
      const customDataRows = [
        ["Total Amount", total_amount],
        ["Total Quantity", total_qty],
        ["Total Net Profit", total_net_profite],
        [],
      ];

      // Headers for filtered data
      const headers = [
        "BillNo",
        "BillDate",
        "DoctorName",
        "MobileNo",
        "ItemName",
        "Unit",
        "Expiry",
        "SaleRate",
        "Qty",
        "Amount",
        "NetProfit",
      ];

      // Convert filteredData to an array of arrays
      const filteredDataRows = filteredData.map((item) =>
        headers.map((header) => item[header])
      );

      // Combine custom data, headers, and filtered data rows
      const combinedData = [...customDataRows, headers, ...filteredDataRows];

      // Convert combined data to CSV format
      const csv = combinedData.map((row) => row.join(",")).join("\n");

      // Convert the CSV string to a Blob
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

      // Save the file using file-saver
      saveAs(blob, "Doctor_Item_Wise_Report.csv");
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
                </div>
                <span
                  className="report_hdr_txt_ec gap-2 txt_hdr_rpt"
                  style={{
                    color: "var(--color1)",
                    display: "flex",
                    fontWeight: 700,
                    fontSize: "20px",
                  }}
                >
                  {" "}
                  Item Wise Doctor Wise Report
                  <BsLightbulbFill className=" w-6 h-6 secondary hover-yellow" />
                </span>
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
                      alt="csv"
                    />
                  </div>
                  Download
                </Button>{" "}
              </div>
            </div>
            <div
              className="row border-b border-dashed"
              style={{ borderColor: "var(--color2)" }}
            ></div>
            <div className="mt-4 ">
              <div
                className="manageExpenseRow doc_type_hd item_btch_flddd oreder_list_fld_rp w-full flex flex-col gap-2 md:flex-row pb-2 csrtureddididid"
                style={{ alignItems: "end" }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-6 w-full gap-3 ttl_dldld purch_report_hdr">
                  <div className="detail_report detail_report_psss detailrep_100 flex flex-col detail_report_doc_btn">
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
                  <div className="detail_report detail_report_psss detailrep_100 flex flex-col detail_report_doc_btn">
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
                  <div className="detail_report detail_report_psss detailrep_100 flex flex-col detail_report_doc_btn justify-end">
                    <FormControl sx={{ width: "100%" }} size="small">
                      <InputLabel id="demo-select-small-label">
                        Report Type
                      </InputLabel>
                      <Select
                        labelId="demo-select-small-label"
                        sx={{ width: "100%" }}
                        id="demo-select-small"
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                        label="Report Type"
                      >
                        <MenuItem value="" disabled>
                          Select Report Type
                        </MenuItem>
                        <MenuItem value="0">Sale</MenuItem>
                        <MenuItem value="1">Sale Return</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <div className="detail_report detail_report_psss detailrep_100 flex flex-col detail_report_doc_btn justify-end">
                    <TextField
                      autoComplete="off"
                      id="outlined-basic"
                      value={doctorSearch}
                      sx={{ width: "100%" }}
                      size="small"
                      onChange={(e) => setDoctorSearch(e.target.value)}
                      variant="outlined"
                      placeholder="Doctor Name"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                        type: "search",
                      }}
                    />
                  </div>
                  <div className="detail_report detail_report_psss detailrep_100 flex flex-col detail_report_doc_btn justify-end">
                    <TextField
                      autoComplete="off"
                      id="outlined-basic"
                      value={itemSearch}
                      sx={{ width: "100%" }}
                      size="small"
                      onChange={(e) => setItemSearch(e.target.value)}
                      variant="outlined"
                      placeholder="item Name"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                        type: "search",
                      }}
                    />
                  </div>
                  <div className="detail_report detail_report_psss detailrep_100 flex flex-col detail_report_doc_btn justify-end">
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
                <div className="flex gap-2  ttl_dldld">
                  <div
                    className="total_mng_expn doc_summary_ttl  detail_report_totl"
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
              {doctorItemWiseData?.doctor_report?.length > 0 ? (
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
                          {/* <th>SR No.</th> */}
                          {DoctorItemWiseColumns.map((column) => (
                            <th
                              key={column.id}
                              style={{ minWidth: column.minWidth }}
                            >
                              {column.label}
                            </th>
                          ))}
                        </tr>
                        <tr>
                          {DoctorItemWiseColumns.map((column) => (
                            <th
                              key={column.id}
                              style={{ minWidth: column.minWidth }}
                            >
                              {column.id === "amount" ? (
                                <span className="secondary">Rs. {total}</span>
                              ) : column.id === "net_profit" ? (
                                <span className="secondary">
                                  Rs. {totalNetProfit}
                                </span>
                              ) : column.id === "qty" ? (
                                <span className="secondary">{qTY}</span>
                              ) : (
                                ""
                              )}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody style={{ background: "#3f621217" }}>
                        {doctorItemWiseData?.doctor_report?.map(
                          (item, index) => (
                            <tr key={index}>
                              {DoctorItemWiseColumns.map((column, colIndex) => (
                                <td
                                  key={column.id}
                                  style={
                                    colIndex === 0
                                      ? {
                                        borderRadius: "10px 0 0 10px",
                                      }
                                      : colIndex ===
                                        DoctorItemWiseColumns.length - 1
                                        ? {
                                          borderRadius: "0 10px 10px 0",
                                        }
                                        : {}
                                  }
                                >
                                  {fieldsWithCurrency.includes(column.id)
                                    ? `Rs.${item[column.id]}`
                                    : item[column.id]}
                                </td>
                              ))}
                            </tr>
                          )
                        )}

                        {/* {doctorItemWiseData?.doctor_report?.map((row, index) => {
                                                    return (
                                                        <tr hover role="checkbox" tabIndex={-1} key={row.code} >
                                                            <td>
                                                                {startIndex + index}
                                                            </td>
                                                            {DoctorItemWiseColumns.map((column) => {
                                                                const value = row[column.id];
                                                                return (
                                                                    <td key={column.id} align={column.align}>
                                                                        {column.format && typeof value === 'number'
                                                                                ? column.format(value)
                                                                                : value}
                                                                        
                                                                    </td>
                                                                );
                                                            })}
                                                        </tr>
                                                    );
                                                })} */}
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
                  <div className="vector-image">
                    <div style={{ maxWidth: "200px", marginBottom: "20px" }}>
                      <img src="../empty_image.png" alt="empty"></img>
                    </div>
                    <span className="text-gray-500 font-semibold">Oops !</span>
                    <p className="text-gray-500 font-semibold">
                      No Items found with your search criteria.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default DoctorItemWise;
