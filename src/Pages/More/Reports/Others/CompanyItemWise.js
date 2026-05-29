import Header from "../../../Header";
import { BsLightbulbFill } from "react-icons/bs";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Button } from "@mui/material";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useEffect, useState } from "react";
import { FormControl, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { FaSearch } from "react-icons/fa";
import Loader from "../../../../componets/loader/Loader";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import DatePicker from "react-datepicker";
import { addDays, format, subDays, subMonths } from "date-fns";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { toast, ToastContainer } from "react-toastify";
const CompanyItemWise = () => {
  const history = useHistory();
  const token = localStorage.getItem("token");
  const [startDate, setStartDate] = useState(subDays(new Date(), 2));
  const [endDate, setEndDate] = useState(new Date());
  const [reportType, setReportType] = useState();
  const [searchManu, setSearchManu] = useState();
  const [errors, setErrors] = useState({});
  const csvIcon = process.env.PUBLIC_URL + "/csv.png";
  const [companyData, setCompanyData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const GstSaleRegisterColumns = [
    { id: "iteam_name", label: "Item Name", minWidth: 150 },
    { id: "unit", label: "Unit", minWidth: 150 },
    { id: "bill_no", label: "Bill No", minWidth: 150 },
    { id: "bill_date", label: "Bill Date", minWidth: 150 },
    { id: "batch", label: "Batch", minWidth: 150 },
    { id: "exp_dt", label: "Expiry", minWidth: 150 },
    { id: "qty", label: "Qty", minWidth: 150 },
    { id: "free_qty", label: "Free", minWidth: 150 },
    { id: "net_rate", label: "Amount", minWidth: 150 },
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!searchManu) {
      newErrors.searchManu = "Search Any Company Name";
      toast.dismiss();
      toast.error(newErrors.searchManu);
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFilterData = async () => {
    if (validateForm()) {
      let data = new FormData();
      setIsLoading(true);
      const params = {
        start_date: startDate ? format(startDate, "yyyy-MM-dd") : "",
        end_date: endDate ? format(endDate, "yyyy-MM-dd") : "",
        company_name: searchManu,
      };
      setIsLoading(true);
      try {
        await axios
          .post("company-items-analysis-report", data, {
            params: params,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            setIsLoading(false);
            setCompanyData(response.data.data);
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
    if (companyData.length == 0) {
      toast.dismiss();
      toast.error("Apply filter and then after download records.");
    } else {
      const total_amount = companyData.total;
      const filteredData = companyData?.item_list?.map(
        ({
          iteam_name,
          unit,
          bill_no,
          bill_date,
          batch,
          free_qty,
          net_rate,
          qty,
          exp_dt,
        }) => ({
          ItemName: iteam_name,
          Unit: unit,
          BillNo: bill_no,
          BillDate: bill_date,
          Batch: batch,
          Expiry: exp_dt,
          Qty: qty,
          Free: free_qty,
          Amount: net_rate,
        })
      );

      // Custom data rows
      const customDataRows = [["Total Amount", total_amount], []];

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
      saveAs(blob, "Compaany_Item_Wise_Report.csv");
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
                    Company Items Analysis Report
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
                    <div className="grid grid-cols-1 sm:grid-cols-2  md:grid-cols-4 w-full gap-3 ttl_dldld">
                      <div className="detail_report flex flex-col detailrep_100">
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
                      <div className="detail_report flex flex-col detailrep_100">
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
                      <div className="detail_report flex flex-col detailrep_100 justify-end">
                        <div style={{ width: "100%" }}>
                          <TextField
                            autoComplete="off"
                            id="outlined-basic"
                            value={searchManu}
                            sx={{ width: "100%" }}
                            size="small"
                            onChange={(e) => setSearchManu(e.target.value)}
                            variant="outlined"
                            placeholder="Search by Company Name"
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
                      <div className="detail_report flex flex-col detailrep_100 justify-end">
                        <Button
                          className="go_btn_divv"
                          style={{
                            background: "var(--color1)",
                            width: "fit-content",
                            height: "40px",
                          }}
                          variant="contained"
                          onClick={handleFilterData}
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
                            Rs.{companyData.total}
                          </span>
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>
                {companyData?.item_list?.length > 0 ? (
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
                          {companyData?.item_list?.map((item, index) => (
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
export default CompanyItemWise;
