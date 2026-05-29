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
import Header from "../../../Header";
import { BsLightbulbFill } from "react-icons/bs";
import axios from "axios";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import DatePicker from "react-datepicker";
import { addDays, format, subDays, subMonths } from "date-fns";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { FaSearch } from "react-icons/fa";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../../../../componets/loader/Loader";
const PurchaseBillReport = () => {
  const history = useHistory();
  const [lastMonth, setLastMonth] = useState(subMonths(new Date(), 1));
  const [reportType, setReportType] = useState(null);
  const [purchaseType, setPurchaseType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");
  const [errors, setErrors] = useState({});
  const csvIcon = process.env.PUBLIC_URL + "/csv.png";
  const [purchaseGSTData, setPurchaseGSTData] = useState([]);
  const [total, setTotal] = useState(0);

  const GSTPurchaseColumns = [
    { id: "bill_no", label: "Bill No", minWidth: 150 },
    { id: "bill_date", label: "Bill Date", minWidth: 150 },
    { id: "distributor", label: "Distributor", minWidth: 150 },
    { id: "sgst", label: "SGST", minWidth: 150 },
    { id: "cgst", label: "CGST", minWidth: 150 },
    { id: "igst", label: "IGST", minWidth: 150 },
    { id: "net_amount", label: "Bill Amount", minWidth: 150 },
  ];
  const [tableData, setTabledata] = useState([
    {
      id: "itemname",
      itemname: "dolo",
      category: "item",
      unit: 10,
      manu: "smart",
      sale: "10",
      stock: "50",
      mrp: "500",
      saleamt: "Rs.44.00",
      purchase: "Rs.445.00",
      netgst: "Rs.4.45",
      profit: "Rs.446(21)",
    },
    {
      id: "itemname",
      itemname: "dolo",
      category: "item",
      unit: 10,
      manu: "smart",
      sale: "10",
      stock: "50",
      mrp: "500",
      saleamt: "Rs.44.00",
      purchase: "Rs.445.00",
      netgst: "Rs.4.45",
      profit: "Rs.446(21)",
    },
  ]);

  const validateForm = () => {
    const newErrors = {};
    if (!reportType) {
      newErrors.reportType = "Select any Report Type.";
      toast.dismiss();
      toast.error(newErrors.reportType);
    } else if (reportType && !purchaseType) {
      newErrors.purchaseType = "Select any Purchase Type.";
      toast.dismiss();
      toast.error(newErrors.purchaseType);
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlefilterData = async () => {
    if (validateForm()) {
      let data = new FormData();
      setIsLoading(true);
      const params = {
        month_year: lastMonth ? format(lastMonth, "MM-yyyy") : "",
        type: reportType,
        purchase_type: purchaseType,
      };
      try {
        await axios
          .post("report-gst-purches", data, {
            params: params,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            setIsLoading(false);
            setPurchaseGSTData(response.data.data);
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
    const filteredData = purchaseGSTData?.purches?.map(
      ({ bill_no, bill_date, distributor, sgst, cgst, igst, net_amount }) => ({
        BillNo: bill_no,
        BillDate: bill_date,
        Distributor: distributor,
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
    saveAs(blob, "PurchaseBill_Report.csv");
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
                  className="report_hdr_txt_ec gap-2"
                  style={{
                    color: "var(--color1)",
                    display: "flex",
                    fontWeight: 700,
                    fontSize: "20px",
                    alignItems: "center",
                  }}
                >
                  GST Report Purchase Bills
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
                          className="custom-datepicker"
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
                          <MenuItem value="0">Purchase</MenuItem>
                          <MenuItem value="1">Purchase Return</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    <div className="detail_report flex flex-col detailrep_100">
                      <div style={{ width: "100%" }}>
                        <FormControl sx={{ width: "100%" }} size="small">
                          <InputLabel id="demo-select-small-label">
                            Purchase Type
                          </InputLabel>
                          <Select
                            labelId="demo-select-small-label"
                            id="demo-select-small"
                            value={purchaseType}
                            onChange={(e) => setPurchaseType(e.target.value)}
                            label="Purchase Type"
                          >
                            <MenuItem disabled>Select Purchase Type</MenuItem>
                            <MenuItem value="0">With GST</MenuItem>
                            <MenuItem value="1">Without GST</MenuItem>
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
                          Rs.{total}
                        </span>
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {purchaseGSTData?.purches?.length > 0 ? (
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
                        {GSTPurchaseColumns.map((column) => (
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
                      {purchaseGSTData?.purches?.map((item, index) => (
                        <tr key={index}>
                          {GSTPurchaseColumns.map((column, colIndex) => (
                            <td
                              key={column.id}
                              style={
                                colIndex === 0
                                  ? {
                                    borderRadius: "10px 0 0 10px",
                                  }
                                  : colIndex === GSTPurchaseColumns.length - 1
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
export default PurchaseBillReport;
