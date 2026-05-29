import Header from "../../../Header";
import { BsLightbulbFill } from "react-icons/bs";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Button } from "@mui/material";
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DatePicker from "react-datepicker";
import { format, subDays } from "date-fns";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { FaSearch } from "react-icons/fa";
import Loader from "../../../../componets/loader/Loader";
import { saveAs } from "file-saver";
import { toast, ToastContainer } from "react-toastify";

const Stock_AdjustMent_Report = () => {
  const history = useHistory();
  const token = localStorage.getItem("token");
  // const [startDate, setStartDate] = useState(dayjs().add(-2, 'day'));
  // const [endDate, setEndDate] = useState(dayjs())
  const [startDate, setStartDate] = useState(subDays(new Date(), 2));
  const [endDate, setEndDate] = useState(new Date());
  const [itemSearch, setItemSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const rowsPerPage = 10;
  const [adjustStockListData, setAdjustStockListData] = useState([]);
  const totalPages = Math.ceil(adjustStockListData.length / rowsPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  const GstSaleRegisterColumns = [
    { id: "adjusted_by", label: "Adjusted By", minWidth: 150 },
    { id: "adjustment_date", label: "Adjustment Date", minWidth: 10 },
    { id: "iteam_name", label: "Item Name", minWidth: 150 },
    { id: "batch_name", label: "Batch", minWidth: 150 },
    { id: "unit", label: "Unit", minWidth: 150 },
    { id: "expriy", label: "Expiry", minWidth: 150 },
    { id: "company_name", label: "Company Name", minWidth: 150 },
    { id: "mrp", label: "MRP", minWidth: 150 },
    { id: "stock", label: "Total Stock", minWidth: 150 },
    { id: "stock_adjust", label: "Stock Adjusted", minWidth: 150 },
    // { id: 'remaining_stock', label: 'Remaining Stock', minWidth: 150 },
    { id: "stock_adjust_amount", label: "Stock Adjust Amount", minWidth: 150 },
  ];
  const csvIcon = process.env.PUBLIC_URL + "/csv.png";

  const adjustStockList = async () => {
    let data = new FormData();
    const params = {
      page: currentPage,
      search: itemSearch,
      end_date: endDate ? format(endDate, "yyyy-MM-dd") : "",
      start_date: startDate ? format(startDate, "yyyy-MM-dd") : "",
    };
    try {
      const res = await axios
        .post("adjust-stock-list", data, {
          params: params,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setAdjustStockListData(response.data.data.data);
          setTotal(response.data.data.total_amount);
          toast.dismiss();
          toast.success(response.data.message);
        });
    } catch (error) {
      toast.dismiss();
      toast.success(error.data.message);
         if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
    }
  };

  const handleNext = () => {
    const newPage = currentPage + 1;
    setCurrentPage(newPage);
    adjustStockList(newPage);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      adjustStockList(newPage);
    }
  };

  const handleClick = (pageNum) => {
    setCurrentPage(pageNum);
    adjustStockList(pageNum);
  };

  const exportToCSV = () => {
    if (adjustStockListData?.length == 0) {
      toast.dismiss();
      toast.error("Apply filter and then after download records.");
    } else {
      // const total = adjustStockListData?.purches_return_total;

      const filteredData = adjustStockListData?.map(
        ({
          adjusted_by,
          adjustment_date,
          iteam_name,
          batch_name,
          unit,
          expriy,
          company_name,
          mrp,
          stock,
          stock_adjust,
          remaining_stock,
        }) => ({
          AdjustedBy: adjusted_by,
          AdjustDate: adjustment_date,
          ItemName: iteam_name,
          BatchName: batch_name,
          Expiry: expriy,
          CompanyName: company_name,
          MRP: mrp,
          Stock: stock,
          AdjustStock: stock_adjust,
          RemainingStock: remaining_stock,
        })
      );

      // Custom data rows
      const customDataRows = [["Total Amount", 0], []];

      // Headers for filtered data
      const headers = [
        "AdjustedBy",
        "AdjustDate",
        "ItemName",
        "BatchName",
        "Expiry",
        "CompanyName",
        "MRP",
        "Stock",
        "AdjustStock",
        "RemainingStock",
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
      saveAs(blob, "Stock_Adjustment_Report.csv");
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
                  </div>

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
                    Stock Adjustment Report
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
                    className="oreder_list_fld_rp flex flex-col gap-2 md:flex-row lg:flex-row pb-2 csrtureddididid"
                    style={{ width: "100%", alignItems: "end" }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2  md:grid-cols-4 w-full gap-3">
                      <div className="detail_report detailrep_100 flex flex-col">
                        <span className="primary">Start Date</span>
                        <div style={{ width: "100%" }}>
                          <DatePicker
                            className="custom-datepicker"
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
                            className="custom-datepicker"
                            selected={endDate}
                            onChange={(newDate) => setEndDate(newDate)}
                            dateFormat="dd/MM/yyyy"
                          />
                        </div>
                      </div>
                      <div className="detail_report detailrep_100 flex flex-col justify-end">
                        <div style={{ width: "100%" }}>
                          <TextField
                            autoComplete="off"
                            id="outlined-basic"
                            value={itemSearch}
                            sx={{ width: "100%" }}
                            size="small"
                            onChange={(e) => setItemSearch(e.target.value)}
                            variant="outlined"
                            placeholder="Search by Item name, adjusted by"
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
                      </div>
                      <div className="detail_report detailrep_100 flex flex-col justify-end">
                        <Button
                          // className="go_btn_divv"
                          style={{
                            background: "var(--color1)",
                            width: "fit-content",
                            height: "40px",
                          }}
                          variant="contained"
                          onClick={() => adjustStockList(currentPage)}
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

                {adjustStockListData.length > 0 ? (
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
                            {GstSaleRegisterColumns.map((column) => (
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
                          {adjustStockListData?.map((item, index) => (
                            <tr key={index}>
                              {GstSaleRegisterColumns.map(
                                (column, colIndex) => (
                                  <td
                                    key={column.id}
                                    style={
                                      colIndex === 0
                                        ? {
                                          borderRadius: "10px 0 0 10px",
                                        }
                                        : colIndex ===
                                          GstSaleRegisterColumns.length - 1
                                          ? {
                                            borderRadius: "0 10px 10px 0",
                                          }
                                          : {}
                                    }
                                  >
                                    {item[column.id] &&
                                      item[column.id].charAt(0).toUpperCase() +
                                      item[column.id].slice(1)}
                                  </td>
                                )
                              )}
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
                      // disabled={currentPage === totalPages}
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
          )}
        </div>
      </div>
    </>
  );
};
export default Stock_AdjustMent_Report;
