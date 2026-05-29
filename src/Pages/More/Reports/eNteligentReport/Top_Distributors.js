import Header from "../../../Header";
import {
  Autocomplete,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { BsLightbulbFill } from "react-icons/bs";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import DatePicker from "react-datepicker";
import { format, subDays } from "date-fns";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Loader from "../../../../componets/loader/Loader";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { toast, ToastContainer } from "react-toastify";
const Top_Distributor = () => {
  const history = useHistory();
  const [startDate, setStartDate] = useState(subDays(new Date(), 2));
  const [endDate, setEndDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");
  const [errors, setErrors] = useState({});
  const [topSellingBy, setTopSellingBy] = useState("");
  const [limit, setLimit] = useState("");
  const [topDistributorData, setTopDistributorData] = useState([]);
  const csvIcon = process.env.PUBLIC_URL + "/csv.png";
  const TopDistributorColumns = [
    { id: "distributor_name", label: "Distributor Name", minWidth: 150 },
    { id: "gst_in", label: "GSTIN", minWidth: 150 },
    { id: "total", label: "Total Amount", minWidth: 150 },
    { id: "count", label: "Orders Count", minWidth: 150 },
    // { id: 'uniqueMedicines', label: 'Unique Medicines', minWidth: 100 },
  ];

  const rowsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(topDistributorData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage + 1;
  const handlefilterData = async () => {
    let data = new FormData();
    setIsLoading(true);
    const params = {
      start_date: startDate ? format(startDate, "yyyy-MM-dd") : "",
      end_date: endDate ? format(endDate, "yyyy-MM-dd") : "",
    };
    try {
      await axios
        .post("top-distributor", data, {
          params: params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setIsLoading(false);
          setTopDistributorData(response.data.data);
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
    if (topDistributorData.length == 0) {
      toast.dismiss();
      toast.error("Apply filter and then after download records.");
    } else {
      const filteredData = topDistributorData?.map(
        ({ distributor_name, gst_in, total, count }) => ({
          DistributorName: distributor_name,
          GSTIN: gst_in,
          TotalAmount: total,
          OrderCount: count,
        })
      );

      // Headers for filtered data
      const headers = ["DistributorName", "GSTIN", "TotalAmount", "OrderCount"];

      // Convert filteredData to an array of arrays
      const filteredDataRows = filteredData.map((item) =>
        headers.map((header) => item[header])
      );

      // Combine custom data, headers, and filtered data rows
      const combinedData = [headers, ...filteredDataRows];

      // Convert combined data to CSV format
      const csv = combinedData.map((row) => row.join(",")).join("\n");

      // Convert the CSV string to a Blob
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

      // Save the file using file-saver
      saveAs(blob, "Top_Distributors.csv");
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
                  {" "}
                  Top Distributors
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
                    <Button
                      style={{
                        background: "var(--color1)",
                        height: "40px",
                      }}
                      variant="contained"
                      onClick={handlefilterData}
                    >
                      Go
                    </Button>
                  </div>
                </div>
              </div>
              {topDistributorData.length > 0 ? (
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
                          <th>SR. No</th>
                          {TopDistributorColumns.map((column) => (
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
                        {topDistributorData.map((row, index) => {
                          return (
                            <tr
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={row.code}
                            >
                              <td style={{ borderRadius: "10px 0 0 10px" }}>
                                {startIndex + index}
                              </td>
                              {TopDistributorColumns.map((column, colIndex) => {
                                const value = row[column.id];
                                const formattedValue =
                                  typeof value === "string" && value.length > 0
                                    ? value.charAt(0).toUpperCase() +
                                    value.slice(1)
                                    : value;

                                return (
                                  <td
                                    key={column.id}
                                    align={column.align}
                                    style={
                                      colIndex ===
                                        TopDistributorColumns.length - 1
                                        ? { borderRadius: "0 10px 10px 0" }
                                        : {}
                                    }
                                  >
                                    {column.format && typeof value === "number"
                                      ? column.format(value)
                                      : formattedValue}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
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
        </div>
      )}
    </>
  );
};
export default Top_Distributor;
