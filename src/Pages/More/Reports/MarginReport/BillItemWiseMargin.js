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
import DatePicker from "react-datepicker";
import { addDays, format, subDays } from "date-fns";
import axios from "axios";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { FaSearch } from "react-icons/fa";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Loader from "../../../../componets/loader/Loader";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { toast, ToastContainer } from "react-toastify";
const BillItemWiseMargin = () => {
  const history = useHistory();
  const [startDate, setStartDate] = useState(subDays(new Date(), 2));
  const [endDate, setEndDate] = useState(new Date());
  const [reportType, setReprtType] = useState("");
  const [searchItem, setSearchItem] = useState("");
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [billMarginData, setBillMarginData] = useState([]);
  const csvIcon = process.env.PUBLIC_URL + "/csv.png";

  const BillItemWiseColumns = [
    { id: "entry_by", label: "Entry By", minWidth: 110 },
    { id: "bill_no", label: "Bill No.", minWidth: 110 },
    { id: "bill_date", label: "Bill Date", minWidth: 110 },
    { id: "patient_name", label: "Customer Name", minWidth: 110 },
    { id: "name", label: "Item Name", minWidth: 110 },
    { id: "category", label: "Category", minWidth: 110 },
    { id: "unit", label: "Unit", minWidth: 110 },
    { id: "company", label: "Manu.", minWidth: 110 },
    { id: "sales_count", label: "Sale", minWidth: 110 },
    { id: "stock", label: "Stock", minWidth: 110 },
    { id: "mrp", label: "MRP", minWidth: 110 },
    { id: "sales_amount", label: "Sale Amt.", minWidth: 110 },
    { id: "purches_amount", label: "Purchase", minWidth: 110 },
    { id: "net_gst", label: "Net GST", minWidth: 110 },
    { id: "net_profit", label: "Profit(%)", minWidth: 110 },
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
        item_name: searchItem,
      };
      try {
        await axios
          .post("item-bill-margin", data, {
            params: params,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            setIsLoading(false);
            setBillMarginData(response.data.data);
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
    if (billMarginData.length == 0) {
      toast.dismiss();
      toast.error("Apply filter and then after download records.");
    } else {
      const saleamt = billMarginData.total_sales;
      const total_purchase = billMarginData.total_purches;
      const total_net_gst = billMarginData.total_net_gst;
      const net_profit = billMarginData.total_net_profit;

      const filteredData = billMarginData?.bill_margin_report?.map(
        ({
          entry_by,
          bill_no,
          bill_date,
          patient_name,
          name,
          company,
          sales_count,
          unit,
          category,
          stock,
          mrp,
          sales_amount,
          purches_amount,
          net_gst,
          net_profit,
        }) => ({
          EntryBy: entry_by,
          BillNo: bill_no,
          BillDate: bill_date,
          CustomerName: patient_name,
          ItemName: name,
          Category: category,
          Unit: unit,
          Company_Name: company,
          Sale: sales_count,
          Stock: stock,
          MRP: mrp,
          Sale_Amt: sales_amount,
          Purchase: purches_amount,
          Net_GST: net_gst,
          Profit_PR: net_profit,
        })
      );

      // Custom data rows
      const customDataRows = [
        ["Total Sale Amt.", saleamt],
        ["Total Purchase", total_purchase],
        ["Total Net GST", total_net_gst],
        ["Total Profit", net_profit],
        [],
      ];

      // Headers for filtered data
      const headers = [
        "EntryBy",
        "BillNo",
        "BillDate",
        "CustomerName",
        "ItemName",
        "Category",
        "Unit",
        "Company_Name",
        "Sale",
        "Stock",
        "MRP",
        "Sale_Amt",
        "Purchase",
        "Net_GST",
        "Profit_PR",
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
      saveAs(blob, "BillItemWise_Report.csv");
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
                    {" "}
                    Bill-Item Wise Margin Report
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
                    className="oreder_list_fld_rp grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  lg:grid-cols-5 xl:grid-cols-6 gap-3 pb-2"
                    style={{ width: "100%", alignItems: "end" }}
                  >
                    <div className="detail_report detail_report_sss flex flex-col detailrep_100">
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
                    <div className="detail_report detail_report_sss flex flex-col detailrep_100">
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
                    <div className="detail_report detail_report_sss flex flex-col detailrep_100">
                      <FormControl sx={{ width: "100%" }} size="small">
                        <InputLabel id="demo-select-small-label">
                          Report Type
                        </InputLabel>
                        <Select
                          labelId="demo-select-small-label"
                          id="demo-select-small"
                          value={reportType}
                          onChange={(e) => setReprtType(e.target.value)}
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
                    <div className="detail_report detail_report_sss flex flex-col detailrep_100">
                      <div className="detail">
                        <TextField
                          autoComplete="off"
                          id="outlined-basic"
                          value={searchItem}
                          size="small"
                          onChange={(e) => setSearchItem(e.target.value)}
                          variant="outlined"
                          placeholder="Type Here..."
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <span className="text-black">Item Name</span>
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <SearchIcon />
                              </InputAdornment>
                            ),
                            type: "search",
                          }}
                        />
                      </div>
                    </div>
                    <div className="purch_report_hdr detail_report detail_report_sss detailrep_100">
                      <Button
                        style={{
                          background: "var(--color1)",
                          height: "40px",
                          width: "f"
                        }}
                        variant="contained"
                        onClick={handlefilterData}
                      >
                        Go
                      </Button>
                    </div>
                  </div>
                </div>
                {billMarginData?.bill_margin_report?.length > 0 ? (
                  <>
                    <div
                      style={{
                        backgroundColor: "white",
                        borderBottom: "2px solid rgb(0 0 0 / 0.1)",
                      }}
                    >
                      <div
                        className="flex gap-8 justify-end flex-wrap"
                        style={{ padding: "20px 24px" }}
                      >
                        <div
                          className="flex gap-8 justify-end flex-wrap itm_main_flds"
                          style={{
                            padding: "20px 24px",
                            background: "#3f621217",
                            borderRadius: "8px",
                          }}
                        >
                          <div className="sub_itm_mrg_fld">
                            <span className="primary font-bold">
                              Total Sale Amt.
                            </span>
                            <p className="secondary font-semibold bit_itm_summ">
                              Rs.{" "}
                              {parseFloat(billMarginData.total_sales).toFixed(
                                2
                              )}
                            </p>
                          </div>
                          <div className="sub_itm_mrg_fld">
                            <span className="primary font-bold">
                              Total Purchase
                            </span>
                            <p className="secondary font-semibold bit_itm_summ">
                              Rs.{" "}
                              {parseFloat(billMarginData.total_purches).toFixed(
                                2
                              )}
                            </p>
                          </div>
                          <div className="sub_itm_mrg_fld">
                            <span className="primary font-bold">
                              Total Net GST
                            </span>
                            <p className="secondary font-semibold bit_itm_summ">
                              Rs.{" "}
                              {parseFloat(billMarginData.total_net_gst).toFixed(
                                2
                              )}
                            </p>
                          </div>
                          <div className="sub_itm_mrg_fld">
                            <span className="primary font-bold">
                              Total Profit
                            </span>
                            <p
                              className="  font-semibold bit_itm_summ"
                              style={{ color: "var(--color2)" }}
                            >
                              Rs.{" "}
                              {parseFloat(
                                billMarginData?.total_net_profit
                              ).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
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
                              {BillItemWiseColumns.map((column) => (
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
                            {billMarginData?.bill_margin_report?.map(
                              (item, index) => (
                                <tr key={index}>
                                  {BillItemWiseColumns.map(
                                    (column, colIndex) => (
                                      <td
                                        key={column.id}
                                        style={
                                          colIndex === 0
                                            ? {
                                              borderRadius: "10px 0 0 10px",
                                            }
                                            : colIndex ===
                                              BillItemWiseColumns.length - 1
                                              ? {
                                                borderRadius: "0 10px 10px 0",
                                              }
                                              : {}
                                        }
                                      >
                                        {item[column.id] &&
                                          item[column.id]
                                            .charAt(0)
                                            .toUpperCase() +
                                          item[column.id].slice(1)}
                                      </td>
                                    )
                                  )}
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
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
        </div>
      )}
    </>
  );
};
export default BillItemWiseMargin;
