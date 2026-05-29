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
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import dayjs from 'dayjs';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
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
const Top_Selling_Items = () => {
  const history = useHistory();
  const [startDate, setStartDate] = useState(subDays(new Date(), 2));
  const [endDate, setEndDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");
  const [errors, setErrors] = useState({});
  // const [topSellingBy, setTopSellingBy] = useState()
  // const [limit, setLimit] = useState('')
  const [topSellingData, setTopSellingData] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const csvIcon = process.env.PUBLIC_URL + "/csv.png";
  const [topSaleData, setTopSaleData] = useState([]);
  const rowsPerPage = 10;

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(topSaleData.length / rowsPerPage);

  const TopSallingColumns = [
    { id: "iteam_name", label: "Medicine Name", minWidth: 150 },
    { id: "company_name", label: "Company Name", minWidth: 150 },
    { id: "qty", label: "Total Quantity", minWidth: 150 },
    { id: "amt", label: "Sales Amount", minWidth: 150 },
    // { id: 'uniqueorder', label: 'Unique Orders', minWidth: 100 },
  ];
  const startIndex = (currentPage - 1) * rowsPerPage + 1;

  useEffect(() => {
    listOfCompany();
  }, []);
  let listOfCompany = () => {
    axios
      .get("company-list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setCompanyList(response.data.data);
      })
      .catch((error) => {
        console.error("API error:", error);
           if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
      });
  };

  const handlefilterData = async (currentPage) => {
    let data = new FormData();
    setIsLoading(true);
    const params = {
      // start_date: startDate.format('YYYY-MM-DD'),
      // end_date: endDate.format('YYYY-MM-DD'),
      start_date: startDate ? format(startDate, "yyyy-MM-dd") : "",
      end_date: endDate ? format(endDate, "yyyy-MM-dd") : "",
      page: currentPage,
      company_name: selectedCompany?.id,
    };
    try {
      await axios
        .post("top-selling-items?", data, {
          params: params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setIsLoading(false);
          setTopSaleData(response.data.data);
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

  const exportToCSV = () => {
    if (topSaleData.length == 0) {
      toast.dismiss();
      toast.error("Apply filter and then after download records.");
    } else {
      const filteredData = topSaleData?.map(
        ({ iteam_name, company_name, qty, amt }) => ({
          MedicineName: iteam_name,
          CompanyName: company_name,
          TotalQuantity: qty,
          SalesAmount: amt,
        })
      );

      // Headers for filtered data
      const headers = [
        "MedicineName",
        " CompanyName",
        "TotalQuantity",
        "SalesAmount",
      ];

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
      saveAs(blob, "Top_Selling_Items.csv");
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
                  Top Selling Items
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
                </Button>{" "}
              </div>
            </div>
            <div
              className="row border-b border-dashed"
              style={{ borderColor: "var(--color2)" }}
            ></div>
            <div className="mt-4 ">
              <div className="manageExpenseRow">
                <div
                  className="oreder_list_fld_rp grid grid-cols-1 sm:grid-cols-3  lg:grid-cols-5 gap-3 pb-2"
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
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={companyList}
                      size="small"
                      value={selectedCompany}
                      onChange={(e, value) => setSelectedCompany(value)}
                      sx={{ width: "100%" }}
                      getOptionLabel={(option) => option.company_name}
                      renderInput={(params) => (
                        <TextField
                          autoComplete="off"
                          {...params}
                          label="Select Company"
                        />
                      )}
                    />
                  </div>
                  <div className="detail_report detail_report_sss flex flex-col detailrep_100">
                    <Button
                      style={{
                        background: "var(--color1)",
                        height: "40px",
                      }}
                      variant="contained"
                      onClick={() => handlefilterData(currentPage)}
                    >
                      Go
                    </Button>
                  </div>
                </div>
              </div>
              {topSaleData.length > 0 ? (
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
                          {TopSallingColumns.map((column) => (
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
                        {topSaleData.map((row, index) => {
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
                              {TopSallingColumns.map((column, colIndex) => {
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
                                      colIndex === TopSallingColumns.length - 1
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
                      disabled={currentPage != totalPages}
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
      )}
    </>
  );
};
export default Top_Selling_Items;
