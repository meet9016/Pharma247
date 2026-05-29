import Header from "../../../Header";
import { BsLightbulbFill } from "react-icons/bs";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
  Button,
  Checkbox,
  FormControlLabel,
  ListItemText,
} from "@mui/material";
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
import FormLabel from "@mui/material/FormLabel";
import FormGroup from "@mui/material/FormGroup";
import { CheckBox } from "@mui/icons-material";
import axios from "axios";
import DatePicker from "react-datepicker";
import { addDays, format, subDays, subMonths } from "date-fns";
import { toast, ToastContainer } from "react-toastify";

const SaleSummary = () => {
  const csvIcon = process.env.PUBLIC_URL + "/csv.png";
  const history = useHistory();
  const token = localStorage.getItem("token");
  const [startDate, setStartDate] = useState(subDays(new Date(), 2));
  const [endDate, setEndDate] = useState(new Date());
  const [paymentMode, setPaymentMode] = useState([]);
  const [selectData, setSelectData] = useState();
  const [bankData, setBankData] = useState([]);
  const [saleSummaryData, setSaleSummaryData] = useState([]);
  const [totalSale, setTotalSale] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const allOptions = [
    "all",
    "cash",
    "credit",
    ...bankData.map((bank) => bank.id),
    "loyaltyPoints",
  ];

  useEffect(() => {
    BankList();
  }, []);

  const BankList = async () => {
    let data = new FormData();
    try {
      await axios
        .post("bank-list", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setBankData(response.data.data);
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
  };

  const validateForm = () => {
    const newErrors = {};
    if (!paymentMode) {
      newErrors.paymentMode = "Select any Payment Mode Type.";
      toast.dismiss();
      toast.error(newErrors.paymentMode);
    }
    if (!selectData) {
      newErrors.selectData = "Select any Report Type.";
      toast.dismiss();
      toast.error(newErrors.selectData);
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
        payment_mode: paymentMode.join(","),
        select_data: selectData,
      };
      try {
        await axios
          .post("sales-summary", data, {
            params: params,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            setIsLoading(false);
            setSaleSummaryData(response.data.data);
            setTotalSale(response.data.data.total_amount);
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
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleChange = (event) => {
    const { value } = event.target;

    if (value.includes("all")) {
      if (paymentMode.length === allOptions.length) {
        // Deselect all options
        setPaymentMode([]);
      } else {
        // Select all options
        setPaymentMode(allOptions);
      }
    } else {
      setPaymentMode(value);
    }

    // setPaymentMode(event.target.value);
  };

  const bankIdToNameMap = bankData.reduce((map, bank) => {
    map[bank.id] = bank.bank_name;
    return map;
  }, {});

  // Custom renderValue function
  const renderValue = (selected) => {
    return selected
      .map((value) => {
        // if (value === 'all') return 'All';
        if (value === "cash") return "Cash";
        if (value === "credit") return "Credit";
        if (value === "loyaltyPoints") return "Loyalty Points";
        return bankIdToNameMap[value] || value; // Return bank name or value if not found
      })
      .join(", ");
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
                    className="report_hdr_txt_ec gap-2"
                    style={{
                      color: "var(--color1)",
                      display: "flex",
                      fontWeight: 700,
                      fontSize: "20px",
                    }}
                  >
                    {" "}
                    Sales Summary
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
                <div className="manageExpenseRow">
                  <div
                    className="oreder_list_fld_rp flex flex-col gap-2 md:flex-row pb-2 csrtureddididid sale_summery_hdr"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                      alignItems: "end",
                    }}
                  >
                    <div
                      className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 w-full gap-3 ttl_dldld sale_summ_sec"
                      style={{ alignItems: "end" }}
                    >
                      <div className="detail_report detail_report_sss detail_report_sale_summery flex flex-col sale_summ_fldss_sec_inli detailrep_100 justify-end">
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
                      <div className="detail_report detail_report_sss detail_report_sale_summery flex flex-col sale_summ_fldss_sec_inli detailrep_100 justify-end">
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
                      <div className="detail_report detail_report_sss detail_report_sale_summery flex flex-col sale_summ_fldss_sec_inli detailrep_100 justify-end">
                        <FormControl sx={{ width: "100%" }} size="small">
                          <InputLabel id="demo-select-small-label">
                            All Payment Mode
                          </InputLabel>
                          <Select
                            labelId="demo-select-small-label"
                            id="demo-select-small"
                            multiple
                            value={paymentMode}
                            onChange={handleChange}
                            renderValue={renderValue}
                            label="All Payment Mode"
                          >
                            <MenuItem value="" disabled>
                              All Payment Mode
                            </MenuItem>

                            <MenuItem value="cash">
                              <Checkbox
                                sx={{
                                  color: "var(--COLOR_UI_PHARMACY)", // Color for unchecked checkboxes
                                  "&.Mui-checked": {
                                    color: "var(--COLOR_UI_PHARMACY)", // Color for checked checkboxes
                                  },
                                }}
                                checked={paymentMode.indexOf("cash") > -1}
                              />
                              <ListItemText
                                className="primary"
                                primary="Cash"
                              />
                            </MenuItem>
                            <MenuItem value="credit">
                              <Checkbox
                                sx={{
                                  color: "var(--COLOR_UI_PHARMACY)", // Color for unchecked checkboxes
                                  "&.Mui-checked": {
                                    color: "var(--COLOR_UI_PHARMACY)", // Color for checked checkboxes
                                  },
                                }}
                                checked={paymentMode.indexOf("credit") > -1}
                              />
                              <ListItemText
                                className="primary"
                                primary="Credit"
                              />
                            </MenuItem>
                            {bankData?.map((option) => (
                              <MenuItem key={option.id} value={option.id}>
                                <Checkbox
                                  sx={{
                                    color: "var(--COLOR_UI_PHARMACY)", // Color for unchecked checkboxes
                                    "&.Mui-checked": {
                                      color: "var(--COLOR_UI_PHARMACY)", // Color for checked checkboxes
                                    },
                                  }}
                                  checked={paymentMode.indexOf(option.id) > -1}
                                />
                                <ListItemText
                                  className="primary"
                                  primary={option.bank_name}
                                />
                              </MenuItem>
                            ))}
                            <MenuItem value="loyaltyPoints">
                              <Checkbox
                                sx={{
                                  color: "var(--COLOR_UI_PHARMACY)", // Color for unchecked checkboxes
                                  "&.Mui-checked": {
                                    color: "var(--COLOR_UI_PHARMACY)", // Color for checked checkboxes
                                  },
                                }}
                                checked={
                                  paymentMode.indexOf("loyaltyPoints") > -1
                                }
                              />
                              <ListItemText
                                className="primary"
                                primary="Loyalty Points"
                              />
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                      <div className="detail_report detail_report_sss detail_report_sale_summery flex flex-col sale_summ_fldss_sec_inli detailrep_100 justify-end">
                        <div className="detail">
                          <FormControl sx={{ width: "100%" }} size="small">
                            <InputLabel id="demo-select-small-label">
                              Select Data
                            </InputLabel>
                            <Select
                              labelId="demo-select-small-label"
                              id="demo-select-small"
                              value={selectData}
                              onChange={(e) => setSelectData(e.target.value)}
                              label="Select Data"
                            >
                              <MenuItem value="" disabled>
                                Select Data
                              </MenuItem>
                              <MenuItem value="total_sales" selected>
                                Total Sales
                              </MenuItem>
                              <MenuItem value="total_margin">
                                Total Margin(Rs.)
                              </MenuItem>
                              <MenuItem value="avrage_margin">
                                {" "}
                                Average Margin (%){" "}
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </div>
                      </div>
                      <div className="purch_report_hdr detail_report detail_report_sss detail_report_sss_btn detail_report_sale_summery justify-end">
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
                    <div className="flex gap-2  ttl_dldld ">
                      <div
                        className="total_mng_expn  detail_report_totl sale_summary_ttl"
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
                            Rs.{totalSale}
                          </span>
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>
                {saleSummaryData?.sales?.length > 0 ? (
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
                            {saleSummaryData.sales?.length > 0 &&
                              Object.keys(saleSummaryData.sales[0]).map(
                                (column) => (
                                  <th key={column}>
                                    {column === "total_sales"
                                      ? "Total Sale"
                                      : capitalizeFirstLetter(column)}
                                  </th>
                                )
                              )}
                          </tr>
                          {/* <tr>
                                                      
                                                        {saleSummaryData.sales?.length > 0 &&
                                                            Object.keys(saleSummaryData.sales[0]).map((column) => (
                                                                <th key={column}>
                                                                    {column === 'total_sales' ? 'Total Sale' : capitalizeFirstLetter(column)}
                                                                </th>
                                                            ))
                                                        }
                                                    </tr> */}
                        </thead>
                        <tbody style={{ background: "#3f621217" }}>
                          {saleSummaryData.sales?.map((item, index) => (
                            <tr key={index}>
                              {Object.keys(item).map((key, colIndex, array) => (
                                <td
                                  key={key}
                                  style={
                                    colIndex === 0
                                      ? { borderRadius: "10px 0 0 10px" }
                                      : colIndex === array.length - 1
                                        ? { borderRadius: "0 10px 10px 0" }
                                        : {}
                                  }
                                >
                                  {item[key]}
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
export default SaleSummary;
