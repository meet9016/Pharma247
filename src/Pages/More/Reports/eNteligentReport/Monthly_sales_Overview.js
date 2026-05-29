import Header from "../../../Header";
import { Button } from "@mui/material";
import { BsLightbulbFill } from "react-icons/bs";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import DatePicker from "react-datepicker";
import { format, subDays, subMonths } from "date-fns";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Loader from "../../../../componets/loader/Loader";
import { toast, ToastContainer } from "react-toastify";
const Monthly_sales_Overview = () => {
  const history = useHistory();
  const [monthDate, setMonthDate] = useState(subMonths(new Date(), 1));
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");
  const [errors, setErrors] = useState({});
  const [monthlySaleData, setMonthlySaleData] = useState([]);
  const MonthlySaleColumns = [
    { id: "duration", label: "Duration", minWidth: 150 },
    { id: "total_amount", label: "Total Amount", minWidth: 150 },
    { id: "total_discount", label: "Total Discount", minWidth: 150 },
    { id: "net_sales", label: "Net Sales", minWidth: 150 },
    { id: "count", label: "Count", minWidth: 150 },
  ];
  const csvIcon = process.env.PUBLIC_URL + "/csv.png";
  const [tableData, setTableData] = useState([
    {
      item_name: "dolo fresh",
      pack: "strip",
      location: "d",
      last_Purchased: "-",
      stock: "54",
      nonMovingSincedays: "355",
      lp: "74.2",
      total_Stock: "3154",
      byLp: "-",
    },
  ]);

  const handlefilterData = async () => {
    let data = new FormData();
    setIsLoading(true);
    const params = {
      month_year: monthDate ? format(monthDate, "MM-yyyy") : "",
    };
    try {
      await axios
        .post("monthly-sales-overview?", data, {
          params: params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setIsLoading(false);
          setMonthlySaleData(response.data.data);
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

  const exportToCSV = () => {
    if (monthlySaleData.length == 0) {
      toast.dismiss();
      toast.error("Apply filter and then after download records.");
    } else {
      // const filteredData = companyData?.item_list?.map(({ iteam_name, unit, bill_no, bill_date, batch, free_qty, net_rate, qty, exp_dt }) => ({
      //     ItemName: iteam_name,
      //     Unit: unit,
      //     BillNo: bill_no,
      //     BillDate: bill_date,
      //     Batch: batch,
      //     Expiry: exp_dt,
      //     Qty: qty,
      //     Free: free_qty,
      //     Amount: net_rate,

      // }));

      // Custom data rows
      const customDataRows = [
        ["Duration", monthlySaleData.duration],
        ["Total Amount", monthlySaleData.total_amount],
        ["Total Discount", monthlySaleData.total_discount],
        ["Net Sales", monthlySaleData.net_sales],
        ["Count", monthlySaleData.count],
        [],
      ];

      // Headers for filtered data
      const headers = [
        "ItemName",
        "Unit",
        "BillNo",
        "BillDate",
        "Batch",
        "Expiry",
        "Qty",
        "Free",
        "Amount",
      ];

      // Convert filteredData to an array of arrays
      // const filteredDataRows = filteredData.map(item => headers.map(header => item[header]));

      // Combine custom data, headers, and filtered data rows
      const combinedData = [...customDataRows];

      // Convert combined data to CSV format
      const csv = combinedData.map((row) => row.join(",")).join("\n");

      // Convert the CSV string to a Blob
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

      // Save the file using file-saver
      saveAs(blob, "Monthly_Sales_OverView_Report.csv");
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
                  className="report_hdr_txt_ec gap-2"
                  style={{
                    color: "var(--color1)",
                    display: "flex",
                    fontWeight: 700,
                    fontSize: "20px",
                    alignItems: "center",
                  }}
                >
                  Monthly Sales Overview
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
                  className="oreder_list_fld_rp grid grid-cols-2 sm:grid-cols-3  lg:grid-cols-5 gap-3 pb-2"
                  style={{ width: "100%", alignItems: "end" }}
                >
                  <div className="detail_report detail_report_sss flex flex-col detailrep_100">
                    <div style={{ width: "100%" }}>
                      <DatePicker
                        className="custom-datepicker "
                        selected={monthDate}
                        onChange={(newDate) => setMonthDate(newDate)}
                        dateFormat="MM-yyyy"
                        showMonthYearPicker
                      />
                    </div>
                  </div>
                  <div className="purch_report_hdr detail_report detail_report_sss detailrep_100">
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
              </div>
              {!monthlySaleData?.duration ? (
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
              ) : (
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
                          {MonthlySaleColumns.map((column) => (
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
                        <tr>
                          <>
                            <td style={{ borderRadius: "10px 0 0 10px" }}>
                              {monthlySaleData?.duration}
                            </td>
                            <td>{monthlySaleData?.total_amount}</td>{" "}
                            <td>{monthlySaleData?.total_discount}</td>{" "}
                            <td>{monthlySaleData?.net_sales}</td>{" "}
                            <td style={{ borderRadius: "0 10px 10px 0" }}>
                              {monthlySaleData?.count}
                            </td>
                          </>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Monthly_sales_Overview;
