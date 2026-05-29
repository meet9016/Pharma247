import Header from "../../../Header";
import {
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  MenuList,
  Select,
  TextField,
} from "@mui/material";
import { BsLightbulbFill } from "react-icons/bs";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import axios from "axios";
import { saveAs } from "file-saver";
import { toast, ToastContainer } from "react-toastify";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Loader from "../../../../componets/loader/Loader";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { addDays, format, subDays, subMonths } from "date-fns";

const Gstr_3B = () => {
  const history = useHistory();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [isDownload, setIsDownload] = useState(false);

  const token = localStorage.getItem("token");
  const [nonMovingItemData, setNonMovingItemData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const excelIcon = process.env.PUBLIC_URL + "/excel.png";
  const [reportType, setReportType] = useState("");
  const [reportData, setReportData] = useState({});

  useEffect(() => {
    if (reportData && typeof reportData === "object") {
      if (isDownload) {
        exportToCSV();
      }
    }
  }, [reportData]);

  const downloadCSV = async () => {
    setIsDownload(true);
    try {
      let data = new FormData();
      data.append(
        "start_date",
        startDate ? format(startDate, "yyyy-MM-dd") : ""
      );
      data.append("end_date", endDate ? format(endDate, "yyyy-MM-dd") : "");

      const response = await axios.post("gst-three-report?", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 && response.data) {
        const parsedData = response.data;
        if (parsedData?.data) {
          setReportData(parsedData.data);
          toast.dismiss();
          toast.success("please wait ...downloading is in progress!");
          exportToCSV();
        } else {
          toast.dismiss();
          toast.error("No data available for the selected criteria.");
        }
      } else {
        toast.dismiss();
        toast.error("Failed to download records. Please try again.");
      }
    } catch (error) {
      console.error("API error:", error);

      toast.dismiss();
      toast.error("An error occurred while downloading the CSV.");
         if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
    } finally {
      setIsDownload(false);
    }
  };

  const exportToCSV = () => {
    if (!reportData || typeof reportData !== "object") {
      toast.dismiss();
      toast.error("No data available for download.");
      return;
    }

    const { invoice_details, summary, gst_liability } = reportData;

    const headers = [
      "Category",
      "Sub Category",
      "Total",
      "CGST",
      "SGST",
      "IGST",
    ];
    const csvRows = [headers.join(",")];

    csvRows.push("invoice detail,,,,,");
    csvRows.push(
      ...[
        [
          "",
          "Sales",
          invoice_details?.sales?.total || 0,
          invoice_details?.sales?.cgst || 0,
          invoice_details?.sales?.sgst || 0,
          invoice_details?.sales?.igst || 0,
        ],
        [
          "",
          "Sales Returns",
          invoice_details?.sales_returns?.total || 0,
          invoice_details?.sales_returns?.cgst || 0,
          invoice_details?.sales_returns?.sgst || 0,
          invoice_details?.sales_returns?.igst || 0,
        ],
        [
          "",
          "Purchases",
          invoice_details?.purchases?.total || 0,
          invoice_details?.purchases?.cgst || 0,
          invoice_details?.purchases?.sgst || 0,
          invoice_details?.purchases?.igst || 0,
        ],
        [
          "",
          "Purchase Returns",
          invoice_details?.purchase_returns?.total || 0,
          invoice_details?.purchase_returns?.cgst || 0,
          invoice_details?.purchase_returns?.sgst || 0,
          invoice_details?.purchase_returns?.igst || 0,
        ],
      ].map((row) => row.join(","))
    );
    csvRows.push(",");

    csvRows.push("summery,,,,,");
    csvRows.push(
      ...[
        [
          "",
          "Net Sales",
          summary?.net_sales?.taxable_amount || 0,
          summary?.net_sales?.cgst || 0,
          summary?.net_sales?.sgst || 0,
          summary?.net_sales?.igst || 0,
        ],
        [
          "",
          "Net Purchases",
          summary?.net_purchases?.taxable_amount || 0,
          summary?.net_purchases?.cgst || 0,
          summary?.net_purchases?.sgst || 0,
          summary?.net_purchases?.igst || 0,
        ],
      ].map((row) => row.join(","))
    );
    csvRows.push(",");

    csvRows.push("GST Liability,,,,,");
    csvRows.push(
      [
        "",
        "GST Liability",
        gst_liability?.total || 0,
        gst_liability?.cgst || 0,
        gst_liability?.sgst || 0,
        gst_liability?.igst || 0,
      ].join(",")
    );

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "GSTR3B_Report.csv");
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
          <div className="p-6"
          >
            <div style={{ display: "flex", gap: "4px" }}>
              <div
                style={{
                  display: "flex",
                  gap: "7px",
                  alignItems: "center",
                  marginBottom: "15px",
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
                  className="txt_hdr_rpt"
                  style={{
                    color: "var(--color1)",
                    display: "flex",
                    fontWeight: 700,
                    fontSize: "20px",
                    minWidth: "120px",
                  }}
                >
                  {" "}
                  GSTR-3B Report
                </span>
                <BsLightbulbFill className=" w-6 h-6 secondary hover-yellow" />
              </div>
            </div>
            <div className="IconNonMoving " style={{ background: "white" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div className="img_gst">
                    <img src="../imgpsh_fullsize_anim.png" alt="anim"></img>
                  </div>
                </div>
              </div>
              <div className="rept_date">
                <div
                  className="flex flex-col gap-2"
                  style={{
                    border: "1px solid lightgray",
                    padding: "25px",
                    borderRadius: "6px",
                  }}
                >
                  <span className="flex  secondary text-lg">Start Date</span>

                  <DatePicker
                    className="custom-datepicker mb-3"
                    selected={startDate}
                    onChange={(newDate) => setStartDate(newDate)}
                    dateFormat="yyyy-MM-dd"
                    showMonthYearPicker
                  />
                  <span className="flex  secondary text-lg">End Date</span>

                  <DatePicker
                    className="custom-datepicker mb-5"
                    selected={endDate}
                    onChange={(newDate) => setEndDate(newDate)}
                    dateFormat="yyyy-MM-dd"
                    showMonthYearPicker
                  ></DatePicker>

                  <Button
                    variant="contained"
                    className="gap-7 downld_btn_csh mt-5"
                    style={{
                      background: "var(--color1)",
                      color: "white",
                      // paddingLeft: "35px",
                      textTransform: "none",
                      display: "flex",
                    }}
                    onClick={downloadCSV}
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
                  <div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Gstr_3B;
