import Header from "../../../Header";
import { BsLightbulbFill } from "react-icons/bs";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Button } from "@mui/material";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useEffect, useState } from "react";
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
import { FaSearch } from "react-icons/fa";
import Loader from "../../../../componets/loader/Loader";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import DatePicker from "react-datepicker";
import { addDays, format, subDays, subMonths } from "date-fns";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
const StaffWiseActivity = () => {
  const history = useHistory();
  const token = localStorage.getItem("token");
  const [startDate, setStartDate] = useState(subDays(new Date(), 2));
  const [endDate, setEndDate] = useState(new Date());
  const [reportType, setReportType] = useState();
  const [staffActivityData, setStaffActivityData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const csvIcon = process.env.PUBLIC_URL + "/csv.png";
  const StaffActivityColumns = [
    { id: "staff_name", label: "Staff Name", minWidth: 100 },
    { id: "iteam_name", label: "Item Name", minWidth: 100 },
    { id: "unit", label: "Unit", minWidth: 100 },
    { id: "bill_no", label: "Bill No", minWidth: 100 },
    { id: "bill_date", label: "Bill Date", minWidth: 100 },
    { id: "batch", label: "Batch", minWidth: 100 },
    { id: "exp_dt", label: "Expiry", minWidth: 100 },
    { id: "qty", label: "Qty", minWidth: 100 },
    { id: "amount", label: "Amount", minWidth: 100 },
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
        start_date: startDate ? format(startDate, "yyyy-MM-dd") : "",
        end_date: endDate ? format(endDate, "yyyy-MM-dd") : "",
        type: reportType,
      };
      try {
        await axios
          .post("staff-activity", data, {
            params: params,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            setIsLoading(false);
            setStaffActivityData(response.data.data);
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
    if (staffActivityData.length == 0) {
      toast.dismiss();
      toast.error("Apply filter, then download records.");
    } else {
      const filteredData = staffActivityData?.bil_list?.map(
        ({
          staff_name,
          iteam_name,
          unit,
          bill_no,
          bill_date,
          batch,
          exp_dt,
          qty,
          amount,
        }) => ({
          BillNo: bill_no,
          BillDate: bill_date,
          StaffName: staff_name,
          ItemName: iteam_name,
          Unit: unit,
          Batch: batch,
          ExpiryDate: exp_dt,
          QTY: qty,
          TotalAmount: amount,
        })
      );
      // Create a new worksheet from the filtered data
      const worksheet = XLSX.utils.json_to_sheet(filteredData);

      // Convert the worksheet to CSV format
      const csv = XLSX.utils.sheet_to_csv(worksheet);

      // Convert the CSV string to a Blob
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

      // Save the file using file-saver
      if (reportType == 1) {
        saveAs(blob, "Purchase-Activity_Report.csv");
      } else if (reportType == 2) {
        saveAs(blob, "Purchase-Return-Activity_Report.csv");
      } else if (reportType == 3) {
        saveAs(blob, "Sales-Activity_Report.csv");
      } else if (reportType == 4) {
        saveAs(blob, "Sales-Return-Activity_Report.csv");
      }
    }
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
                    className="report_hdr_txt_ec txt_hdr_rpt gap-2"
                    style={{
                      color: "var(--color1)",
                      display: "flex",
                      fontWeight: 700,
                      fontSize: "20px",
                    }}
                  >
                    {" "}
                    Staff Wise Activity Summary
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
                  className="manageExpenseRow"
                >
                  <div
                    className="oreder_list_fld_rp flex flex-col gap-2 md:flex-row pb-2 csrtureddididid"
                    style={{ width: "100%", alignItems: "end" }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 w-full gap-3 ttl_dldld">
                      <div className="detail_report detailrep_100 flex flex-col">
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
                      <div className="detail_report detailrep_100 flex flex-col">
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
                      <div className="detail_report detailrep_100 flex flex-col justify-end">
                        <div style={{ width: "100%" }}>
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
                                Report Type
                              </MenuItem>
                              <MenuItem value="1">Purchase</MenuItem>
                              <MenuItem value="2">Purchase Return</MenuItem>
                              <MenuItem value="3">Sales</MenuItem>
                              <MenuItem value="4">Sales Return</MenuItem>
                            </Select>
                          </FormControl>
                        </div>
                      </div>
                      <div className="detail_report detailrep_100 flex flex-col justify-end">
                        <Button
                          className="go_btn_divv"
                          style={{
                            background: "var(--color1)",
                            width: "fit-content",
                            height: "40px",
                          }}
                          variant="contained"
                          onClick={handlefilterData}
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
                            Rs.{staffActivityData?.bil_total}
                          </span>
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>
                {staffActivityData?.bil_list?.length > 0 ? (
                  <div>
                    <div className="overflow-x-auto mt-4">
                      <table className="table-cashManage  w-full border-collapse">
                        <thead>
                          <tr>
                            {StaffActivityColumns.map((column) => (
                              <th
                                key={column.id}
                                style={{ minWidth: column.minWidth }}
                              >
                                {column.label}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {staffActivityData?.bil_list?.map((item, index) => (
                            <tr key={index}>
                              {StaffActivityColumns.map((column) => (
                                <td key={column.id}>
                                  {item[column.id] &&
                                    item[column.id].charAt(0).toUpperCase() +
                                    item[column.id].slice(1)}
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
        </div>
      </div>
    </>
  );
};
export default StaffWiseActivity;
