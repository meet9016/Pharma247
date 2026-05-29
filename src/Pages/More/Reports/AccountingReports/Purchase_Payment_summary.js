import Header from "../../../Header";
import { BsLightbulbFill } from "react-icons/bs";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Button } from "@mui/material";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useEffect, useState } from "react";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
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
import { FaReceipt } from "react-icons/fa";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import DatePicker from "react-datepicker";
import { addDays, format, subDays } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import Loader from "../../../../componets/loader/Loader";
import { toast, ToastContainer } from "react-toastify";
const PurchasePaymentSummary = () => {
  const history = useHistory();
  const token = localStorage.getItem("token");
  const [startDate, setStartDate] = useState(subDays(new Date(), 2));
  const [endDate, setEndDate] = useState(new Date());
  const [paymentStatus, setPaymnetStatus] = useState();
  const [paymentMode, setPaymentMode] = useState();
  const [searchDistributor, setSearchDistributor] = useState("");
  // const [searchBillNo, setSearchBillNo] = useState('')
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const csvIcon = process.env.PUBLIC_URL + "/csv.png";
  const GstSaleRegisterColumns = [
    { id: "bill_no", label: "Bill No", minWidth: 150 },
    { id: "bill_date", label: "Bill Date", minWidth: 150 },
    { id: "distributor_name", label: "Distributor Name", minWidth: 150 },
    { id: "payment_date", label: "Payment Date ", minWidth: 150 },
    { id: "due_amount", label: "Due Amount", minWidth: 150 },
    { id: "payment_mode", label: "Payment Mode", minWidth: 150 },
    { id: "status", label: "Payment Status", minWidth: 150 },
    { id: "total", label: "Amount", minWidth: 150 },
  ];
  const [purchasePaymentData, setPurchasepaymentData] = useState([]);
  // useEffect(() => {
  //     CaseManageMentList();
  // }, [])

  const validateForm = () => {
    const newErrors = {};
    if (!paymentStatus) {
      newErrors.paymentStatus = "Select Any Payment Status";
      toast.dismiss();
      toast.error(newErrors.paymentStatus);
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleFilterData = async () => {
    if (validateForm()) {
      let data = new FormData();
      let x = "";
      if (paymentMode !== "All") {
        let x = paymentMode;
      }
      setIsLoading(true);
      const params = {
        start_date: startDate ? format(startDate, "yyyy-MM-dd") : "",
        end_date: endDate ? format(endDate, "yyyy-MM-dd") : "",
        status: paymentStatus === "All" ? x : paymentStatus,
        search: searchDistributor,
      };
      setIsLoading(true);
      try {
        await axios
          .post("purches-payment-summary", data, {
            params: params,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            setIsLoading(false);
            setPurchasepaymentData(response.data.data);
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
    if (purchasePaymentData.length == 0) {
      toast.dismiss();
      toast.error("Apply filter and then after download records.");
    } else {
      const filteredData = purchasePaymentData?.map(
        ({
          bill_no,
          bill_date,
          distributor_name,
          payment_date,
          status,
          total,
          payment_mode,
          due_amount,
        }) => ({
          BillNo: bill_no,
          BillDate: bill_date,
          DistributorName: distributor_name,
          PaymentDate: payment_date,
          DueAmount: due_amount,
          PaymentMode: payment_mode,
          PaymentStatus: status,
          Amount: total,
        })
      );

      // Headers for filtered data
      const headers = [
        "BillNo",
        "BillDate",
        "DistributorName",
        "PaymentDate",
        "DueAmount",
        "PaymentMode",
        "PaymentStatus",
        "Amount",
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
      saveAs(blob, "Purchase_Payment_Summary.csv");
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
                    style={{ fontSize: "17px", color: "var(--color1)" }}
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
                    Purchase Payment Summary
                    <BsLightbulbFill className=" w-6 h-6 secondary hover-yellow" />
                  </span>
                </div>
                <div className="headerList">
                  <Button
                    variant="contained"
                    className="gap-7  report_btn_purch"
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
                <div
                  className="manageExpenseRow"
                //   style={{
                //     borderBottom: "2px solid rgb(0 0 0 / 0.1)",
                //   }}
                >
                  <div
                    className="oreder_list_fld_rp  grid grid-cols-1 sm:grid-cols-3  lg:grid-cols-5 gap-3 pb-3"
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
                      <FormControl style={{ width: "100% " }} size="small">
                        <InputLabel id="demo-select-small-label">
                          {" "}
                          Purchase Payment Status
                        </InputLabel>
                        <Select
                          labelId="demo-select-small-label"
                          id="demo-select-small"
                          value={paymentStatus}
                          onChange={(e) => setPaymnetStatus(e.target.value)}
                          label="Purchase Payment Status"
                          style={{ width: "100%" }}
                        >
                          <MenuItem value="" disabled>
                            Purchase Payment Status
                          </MenuItem>
                          <MenuItem value="All">All</MenuItem>
                          <MenuItem value="Partially_Paid">
                            Partially Paid
                          </MenuItem>
                          <MenuItem value="Paid">Paid</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    <div className="detail_report detail_report_sss flex flex-col detailrep_100 ">
                      {/* <div className="detail" > */}
                      <TextField
                        autoComplete="off"
                        id="outlined-basic"
                        value={searchDistributor}
                        sx={{ width: "100%" }}
                        size="small"
                        onChange={(e) => setSearchDistributor(e.target.value)}
                        variant="outlined"
                        placeholder="Search by Bill No"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <SearchIcon />
                            </InputAdornment>
                          ),
                          type: "search",
                        }}
                      />
                      {/* </div> */}
                    </div>

                    <div className="purch_report_hdr detail_report detail_report_sss">
                      <Button
                        // className="go_btn_divv"
                        style={{
                          background: "var(--color1)",
                          height: "40px",
                          width: "fit-content",
                        }}
                        variant="contained"
                        onClick={handleFilterData}
                      >
                        Go
                      </Button>
                    </div>
                  </div>
                </div>
                {purchasePaymentData.length > 0 ? (
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
                          {purchasePaymentData?.map((item, index) => (
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
                                    {column.id === "total"
                                      ? parseFloat(item[column.id]).toFixed(2)
                                      : item[column.id]
                                        ?.charAt(0)
                                        .toUpperCase() +
                                      item[column.id]?.slice(1)}
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
                    <div className="SearchIcon-bill">
                      <div>
                        <FaReceipt className="IconSize-bill" />
                      </div>
                      <p className="text-gray-500 font-semibold">
                        Outstanding bills are just a click away!
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
export default PurchasePaymentSummary;
