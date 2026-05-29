import Header from "../../../Header";
import { BsLightbulbFill } from "react-icons/bs";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Button } from "@mui/material";
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import dayjs from 'dayjs';
import DatePicker from "react-datepicker";
import { addDays, format, subDays, subMonths } from "date-fns";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useState } from "react";
import * as XLSX from "xlsx";
import {
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { FaSearch } from "react-icons/fa";
import Loader from "../../../../componets/loader/Loader";
import axios from "axios";
import { saveAs } from "file-saver";
import { toast, ToastContainer } from "react-toastify";
const DayWiseSummary = () => {
  const history = useHistory();
  const [monthDate, setMonthDate] = useState(new Date());
  const [reportType, setReportType] = useState();
  const [dayWiseSummaryData, setDayWiseSummaryData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");
  const csvIcon = process.env.PUBLIC_URL + "/csv.png";
  const [errors, setErrors] = useState({});
  const [total, setTotal] = useState(0);
  const DayWiseSummaryColumns = [
    { id: "bill_date", label: "Bill Date", minWidth: 150 },
    { id: "bill_no", label: "Bill No", minWidth: 150 },
    { id: "name", label: "Person Name", minWidth: 150 },
    { id: "cgst", label: "CGST", minWidth: 150 },
    { id: "sgst", label: "SGST", minWidth: 150 },
    { id: "total_amount", label: "Total", minWidth: 150 },
  ];
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

  const handlefilterData = async () => {
    if (validateForm()) {
      let data = new FormData();
      setIsLoading(true);
      const params = {
        month_year: monthDate ? format(monthDate, "MM-yyyy") : "",
        type: reportType,
      };
      try {
        await axios
          .post("day-vise-summry?", data, {
            params: params,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            setIsLoading(false);
            setDayWiseSummaryData(response.data.data);
            setTotal(response.data.data.total);
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

  const exportToCSV = async () => {
    if (dayWiseSummaryData?.length == 0) {
      toast.dismiss();
      toast.error("Apply filter, then download records.");
    } else {
      let data = new FormData();
      const params = {
        month_year: monthDate.format("MM-YYYY"),
        type: reportType,
      };
      try {
        const response = await axios.post("day-vise-summry?", data, {
          params: params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(
          response.data.data.bill_list
        ); // Ensure bill_list is used
        const total = parseFloat(response.data.data.total).toFixed(2);

        // Add a row for total after the bill list
        const totalRow = {
          id: "",
          bill_no: "",
          bill_date: "",
          name: "",
          cgst: "",
          sgst: "Total",
          total_amount: total, // Show the calculated total here
        };
        const totalRowIndex = XLSX.utils.sheet_add_json(worksheet, [totalRow], {
          skipHeader: true,
          origin: XLSX.utils.decode_range(worksheet["!ref"]).e.r + 1, // Add the total row after the last row of bill_list
        });
        XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });
        const blob = new Blob([excelBuffer], {
          type: "application/octet-stream",
        });

        if (reportType == 0) {
          saveAs(blob, "Purchase-DayWise-Summary-Report.xlsx");
        } else if (reportType == 1) {
          saveAs(blob, "Purchase-Return-DayWise-Summary-Report.xlsx");
        } else if (reportType == 2) {
          saveAs(blob, "Sale-DayWise-Summary-Report.xlsx");
        } else if (reportType == 3) {
          saveAs(blob, "Sale-Return-DayWise-Summary-Report.xlsx");
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
      }
    }
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
      {isLoading ? (
        <div className="loader-container ">
          <Loader />
        </div>
      ) : (
        <div>
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
                  className="report_hdr_txt_ec gap-2 txt_hdr_rpt"
                  style={{
                    color: "var(--color1)",
                    display: "flex",
                    fontWeight: 700,
                    fontSize: "20px",
                    alignItems: "center",
                  }}
                >
                  {" "}
                  Day wise Summary
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
                  {" "}
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
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    alignItems: "end",
                  }}
                >
                  <div
                    className="grid grid-cols-2 sm:grid-cols-2  md:grid-cols-4 w-full gap-3 ttl_dldld day_wise_sum"
                    style={{ alignItems: "end" }}
                  >
                    <div className="detail_report flex flex-col detailrep_100">
                      <span className="primary">Start Date</span>
                      <div style={{ width: "100%" }}>
                        <DatePicker
                          className="custom-datepicker "
                          selected={monthDate}
                          onChange={(newDate) => setMonthDate(newDate)}
                          dateFormat="MM/yyyy"
                          showMonthYearPicker
                        />
                      </div>
                    </div>
                    <div className="detail_report detail_report_sss flex flex-col detailrep_100">
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
                          <MenuItem value="0">Purchase</MenuItem>
                          <MenuItem value="1">Purchase Return</MenuItem>
                          <MenuItem value="2">Sales</MenuItem>
                          <MenuItem value="3">Sales Return</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    <div className="detail_report detail_report_sss flex flex-col detailrep_100">
                      <Button
                        style={{
                          background: "var(--color1)",
                          height: "40px",
                          width: "fit-content",
                        }}
                        variant="contained"
                        onClick={handlefilterData}
                      >
                        Go
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-2  ttl_dldld">
                    <div
                      className="total_mng_expn  detail_report_totl"
                      style={{
                        background: "#f3f3f3",
                        padding: "12px",
                        borderRadius: "10px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <h2 className="primary font-medium text-xl ">Total  <span className="secondary font-bold text-xl ">
                        Rs.{total}
                      </span></h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {dayWiseSummaryData?.bill_list?.length > 0 ? (
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
                        {DayWiseSummaryColumns.map((column) => (
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
                      {dayWiseSummaryData?.bill_list?.map((item, index) => (
                        <tr key={index}>
                          {DayWiseSummaryColumns.map((column, colIndex) => (
                            <td
                              key={column.id}
                              style={
                                colIndex === 0
                                  ? {
                                    borderRadius: "10px 0 0 10px",
                                  }
                                  : colIndex ===
                                    DayWiseSummaryColumns.length - 1
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
      )}
    </>
  );
};
export default DayWiseSummary;
