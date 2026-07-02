import React, { useEffect, useState, useRef } from "react";
import useSubmitShortcut from "../../../hooks/useSubmitShortcut";
import Header from "../../Header";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Autocomplete from '@mui/material/Autocomplete';
import DatePicker from "react-datepicker";
import { addDays, format, subDays } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { MdOutlineDoDisturb } from "react-icons/md";

// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import dayjs from 'dayjs';
import {
  Alert,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Switch from "@mui/material/Switch";
import IconButton from "@mui/material/IconButton";
import RemoveIcon from "@mui/icons-material/Remove";
import axios from "axios";
import Loader from "../../../componets/loader/Loader";
import { toast, ToastContainer } from "react-toastify";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { image } from "d3";
import image1 from "../../../Image/no-bank-data.png";


const BankAccount = () => {
  const history = useHistory();

  const PassbookColumns = [
    { id: "date", label: "Date", minWidth: 150 },
    { id: "party_name", label: "Name", minWidth: 150 },
    { id: "deposit", label: "Credit", minWidth: 150 },
    { id: "withdraw", label: "Debit", minWidth: 150 },
    { id: "balance", label: "Balance", minWidth: 150 },
    { id: "remark", label: "Remark", minWidth: 150 },
  ];
  const PaymentInitiatedColumns = [
    { id: "bill_no", label: "Cheque Date  " },
    { id: "bill_date", label: "Party Name" },
    { id: "customer_name", label: "Entry By" },
    { id: "phone_number", label: "Cheque/Ref. No." },
    { id: "qty", label: "Amount" },
  ];
  const [openAddPopUpDownload, setOpenAddPopUpDownload] = useState(false);
  const token = localStorage.getItem("token");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [enterAmt, setEnterAmt] = useState(null);
  const [bankData, setBankData] = useState([]);
  const [errors, setErrors] = useState({});
  const [switchCheck, setSwitchChecked] = useState(false);
  const label = { inputProps: { "aria-label": "Size switch demo" } };
  const [passbookDetails, setPassbookDetails] = useState("");
  const [openAddPopUp, setOpenAddPopUp] = useState(false);
  const [openAddPopUpAdjust, setOpenAddPopUpAdjust] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  // const [startdate, setStartDate] = useState(dayjs().add(-30, 'day'));
  // const [enddate, setEndDate] = useState(dayjs());
  const [startDate, setStartDate] = useState(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState(new Date());
  const [search, setSearch] = useState("");
  const [remarks, setRemarks] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountType, setAccountType] = useState("");
  const [openingBalance, setOpeningBalance] = useState(0);
  const [asOfDate, setAsOfDate] = useState(new Date());
  const [adjustDate, setAdjustDate] = useState(new Date());
  const [accountNumber, setAccountNumber] = useState("");
  const [reEnterAccountNumber, setReEnterAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [latestAmt, setLatestAmt] = useState("");
  const [currentBalance, setCurrentBalance] = useState("");
  const [branchName, setBranchName] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [upiId, setUpiId] = useState("");
  const [finalValue, setFinalValue] = useState("");
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [paymentType, setPaymentType] = useState("");
  const [bankDetails, setBankDetails] = useState([]);
  const [details, setDetails] = useState({});
  const pdfIcon = process.env.PUBLIC_URL + "/pdf.png";
  const inputRefs = useRef([]);



  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const [clicked, setClicked] = useState(false);

  const [reduceclicked, setReduceClicked] = useState(false);
  const Reducebutton = reduceclicked
    ? {
      color: "white",
      background: "#F31C1C",
      textTransform: "none",
      borderRadius: 50,
    }
    : {
      color: "#F31C1C",
      border: "1px solid #F31C1C",
      textTransform: "none",
      borderRadius: 50,
    };

  const Addbutton = clicked
    ? {
      color: "white",
      background: "#628A2F",
      textTransform: "none",
      borderRadius: 50,
    }
    : {
      color: "#628A2F",
      border: "1px solid #628A2F",
      textTransform: "none",
      borderRadius: 50,
    };

  const handleAddBtn = () => {
    setClicked((prevState) => !prevState);
    setReduceClicked(false);

    setErrors((prev) => ({
      ...prev,
      reduceclicked: "",
    }));
  };

  const handleReduceBtn = () => {
    setReduceClicked((prevState) => !prevState);
    setClicked(false);


    setErrors((prev) => ({
      ...prev,
      reduceclicked: "",
    }));
  };

  const handleKeyDown = (event, index) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent default form submit

      const nextInput = inputRefs?.current[index + 1];

      if (nextInput) {
        nextInput?.focus();
      } else {
        handleAddBank();
      }
    }
  };

  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (selectedAccountId !== null && selectedAccountId !== undefined) {
        BankDetailgetByID(selectedAccountId);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [debouncedSearch, selectedAccountId, startDate, endDate]);

  useEffect(() => {
    BankList();
  }, []);

  useEffect(() => {
    if (bankData.length > 0) {
      if (selectedAccountId !== null && selectedAccountId !== undefined) {
        const selectedDetails = bankData.find((x) => x.id === selectedAccountId);
        setDetails(selectedDetails || {});
      } else {
        setDetails({});
      }
    }
  }, [bankData, selectedAccountId]);



  useEffect(() => {
    if (clicked) {
      setFinalValue(0);
      const x = parseFloat(currentBalance) + parseFloat(enterAmt);
      setLatestAmt(x);
    } else if (reduceclicked) {
      const x = parseFloat(currentBalance) - parseFloat(enterAmt);
      setLatestAmt(x);
      setFinalValue(1);
    }
  }, [enterAmt, clicked, reduceclicked, currentBalance]);



  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const validateAddForm = () => {
    const newErrors = {};
    if (!paymentType) newErrors.paymentType = "Account is required";
    if (!(clicked || reduceclicked)) {
      newErrors.reduceclicked = "Select any Credit/Debit method";
    } else if (clicked && reduceclicked) {
      newErrors.reduceclicked = "Only one method can be selected";
    }
    if (!enterAmt) newErrors.enterAmt = "Please Enter Any Amount";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdjustBalance = async () => {
    if (validateAddForm()) {
      let data = new FormData();
      data.append("payment_type", paymentType);
      data.append("add_or_reduce", finalValue);
      data.append("opening_balance", openingBalance);
      data.append("date", adjustDate ? format(adjustDate, "yyyy-MM-dd") : "");
      data.append("amount", enterAmt);
      data.append("total_amount", latestAmt);
      data.append("remark", remarks);
      try {
        await axios
          .post("add-balance", data, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            BankList();
            BankDetailgetByID();
            toast.dismiss();
            toast.success(response.data.message);
            setPaymentType("");
            setClicked(false);
            setOpenAddPopUpAdjust(false);
            setReduceClicked(false);
            setCurrentBalance("");
            setAdjustDate(new Date());
            setEnterAmt("");
            setLatestAmt("");
            setRemarks("");
            setTimeout(() => {
              setOpenAddPopUpAdjust(false);
            }, 3000);
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

  const validateForm = () => {
    const newErrors = {};

    if (!bankName) newErrors.bankName = "Bank Name is required";
    if (!accountType) newErrors.accountType = "Account Type is required";
    // if (switchCheck) {
    if (!accountNumber) {
      newErrors.accountNumber = "Account Number is required";
    }

    if (!reEnterAccountNumber) {
      newErrors.reEnterAccountNumber = "Re-Enter Account Number is required";
    }

    if (
      accountNumber &&
      reEnterAccountNumber &&
      accountNumber !== reEnterAccountNumber
    ) {
      newErrors.accountNumber = "Account Numbers do not match";
      newErrors.reEnterAccountNumber = "Account Numbers do not match";
    }
    if (!ifscCode) newErrors.ifscCode = "IFSC Code is required";
    if (!accountHolderName)
      newErrors.accountHolderName = "Account Holder Name is required";
    if (!branchName) newErrors.branchName = "Branch Name is required";
    // }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const BankList = async () => {
    let data = new FormData();
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const BankDetailgetByID = async (selectedAccountId) => {
    let data = new FormData();
    setIsLoading(true);
    const params = {
      bank_id: selectedAccountId,
      start_date: startDate ? format(startDate, "yyyy-MM-dd") : "",
      end_date: endDate ? format(endDate, "yyyy-MM-dd") : "",
      search: search ? search : "",
    };
    try {
      await axios
        .post("bank-details", data, {
          params: params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setBankDetails(response.data.data);
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
    } finally {
      setIsLoading(false);
    }
  };
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleAddBank = async () => {
    if (validateForm()) {
      let data = new FormData();
      data.append("bank_name", bankName);
      data.append("bank_account_name", accountType);
      data.append("opening_balance", openingBalance);
      data.append("date", asOfDate ? format(asOfDate, "yyyy-MM-dd") : "");
      data.append("bank_account_number", accountNumber);
      data.append("reenter_bank_account_number", reEnterAccountNumber);
      data.append("ifsc_code", ifscCode);
      data.append("bank_branch_name", branchName);
      data.append("account_holder_name", accountHolderName);
      data.append("upi_id", upiId);
      try {
        await axios
          .post("add-bank", data, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            BankList();
            setOpenAddPopUp(false);
            toast.dismiss();
            toast.success(response.data.message);
            setBankName("");
            setAccountType("");
            setSwitchChecked(false);
            setOpeningBalance(0);
            setAsOfDate(new Date());
            setAccountHolderName("");
            setAccountNumber("");
            setReEnterAccountNumber("");
            setIfscCode("");
            setBranchName("");
            setUpiId("");
            setTimeout(() => {
              setOpenAddPopUp(false);
            }, 3000);
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

  const handleCloseDialog = () => {
    setOpenAddPopUp(false);
    setBankName("");
    setAccountType("");
    setSwitchChecked(false);
    setOpeningBalance(0);
    setAsOfDate(new Date());
    setAccountHolderName("");
    setAccountNumber("");
    setReEnterAccountNumber("");
    setIfscCode("");
    setBranchName("");
    setUpiId("");
    setErrors("");
  };

  const resetAdjustDialog = () => {
    setOpenAddPopUpAdjust(false);
    setPaymentType("");
    setClicked(false);
    setReduceClicked(false);
    setCurrentBalance("");
    setAdjustDate(new Date());
    setEnterAmt("");
    setLatestAmt("");
    setErrors({});
    setRemarks("");
    setAccountHolderName("")
  };

  const handlePaymentTypeChange = async (e) => {
    const selectedPaymentType = e.target.value;

    setPaymentType(selectedPaymentType);
    const selectedBankData = bankData.find(
      (bank) => bank.id === selectedPaymentType);

    if (selectedPaymentType == "cash") {
      const selectedBankData = bankData[0];
      setCurrentBalance(selectedBankData.total_amount);

      setAccountHolderName(selectedBankData.account_holder_name);

    } else {
      setCurrentBalance(selectedBankData.total_amount);
      setAccountHolderName(selectedBankData.account_holder_name);

    }


  };

  const handleAccountClick = (id, index) => {
    setSelectedAccountId(id);
    const selectedDetails = bankData.find((x) => x.id === id);
    setDetails(selectedDetails);
  };

  const handlePdf = () => {
    setOpenAddPopUpDownload(true);
    pdfGenerator();
  };
  const isDateDisabled = (date) => {
    const today = new Date();
    // Set time to 00:00:00 to compare only date part
    today.setHours(0, 0, 0, 0);

    // Disable dates that are greater than today
    return date > today;
  };
  const pdfGenerator = async () => {
    let data = new FormData();
    data.append("bank_id", selectedAccountId);
    const params = {
      bank_id: selectedAccountId,
    };
    try {
      const response = await axios.post("pdf-bank", data, {
        params: params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status === 401) {
        history.push("/");
        localStorage.clear();
      }
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

  const handleStartDate = (newDate) => {
    setStartDate(newDate);
    if (selectedAccountId !== null && selectedAccountId !== undefined) {
      BankDetailgetByID(selectedAccountId);
    }
  };

  const handleEndDate = (newDate) => {
    setEndDate(newDate);
    if (selectedAccountId !== null && selectedAccountId !== undefined) {
      BankDetailgetByID(selectedAccountId);
    }
  };

  const handleSearch = (search) => {
    setSearch(search);
    if (selectedAccountId !== null && selectedAccountId !== undefined) {
      BankDetailgetByID(selectedAccountId);
    }
  };


  useSubmitShortcut(validateForm, openAddPopUp);
  useSubmitShortcut(handleAdjustBalance, openAddPopUpAdjust);



  useEffect(() => {
    const handleShortcut = (e) => {
      if (e.altKey && (e.key === "s" || e.key === "S")) {
        e.preventDefault();

        // Dialog open ho tabhi save chale
        if (openAddPopUp) {
          handleAddBank();
        }
      }
    };

    window.addEventListener("keydown", handleShortcut);

    return () => {
      window.removeEventListener("keydown", handleShortcut);
    };
  }, [openAddPopUp, bankName, accountType, accountNumber, reEnterAccountNumber, ifscCode, branchName, accountHolderName, upiId]);

  return (
    <>
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

        <Box className="flex flex-col sm:flex-row">

          <Box
            className="custom-scrolll p-6 fst_mdl_bnk"
            style={{ backgroundColor: "rgb(63 98 18 / 5%)" }}
            sx={{
              width: {
                xs: "100%",
                sm: "100%",
                md: "25%",
                lg: "18%",
                xl: "15%",
              },
              overflowY: "auto",
            }}
            role="presentation"
            onClick={() => toggleDrawer(false)}
          >
            {/* 💰 Savings Accounts */}


            {/* {bankData.filter(account => account.bank_account_name === "Saving").length > 0 && (
              <List>
                <h1
                  className="text-lg sm:text-base md:text-lg flex justify-start p-2"
                  style={{ color: "var(--color1)" }}
                >
                  Savings Accounts
                </h1>
                {bankData
                  .filter(account => account.bank_account_name === "Saving")
                  .map((account, index) => (
                    <ListItem
                      key={account.id}
                      className={`list-bank ${selectedAccountId === account.id ? "primary-bg text-white" : ""}`}
                      disablePadding
                    >
                      <ListItemButton
                        style={{ width: "100%", borderRadius: "10px" }}
                        onClick={() => handleAccountClick(account.id, index)}
                      >
                        <div className="w-full min-w-0 flex-1">
                          <p
                            className={`text-xs  ${selectedAccountId === account.id ? " text-white" : ""} text-gray-600 mb-1 font-mono tracking-wide`}
                            style={{
                              wordBreak: "break-all",
                              lineHeight: "1.2"
                            }}
                          >
                            {account.bank_account_number || "Empty"}
                          </p>
                          <h6
                            className={`font-semibold text-sm mb-1 ${selectedAccountId === account.id ? " text-white" : ""}`}
                            style={{
                              wordWrap: "break-word",
                              lineHeight: "1.3",
                              hyphens: "auto"
                            }}
                          >
                            {account.bank_name}
                          </h6>
                          <h6
                            className={`text-xs text-black font-semibold  ${selectedAccountId === account.id ? " text-white" : ""}`}
                            style={{
                              wordWrap: "break-word",
                              lineHeight: "1.4",
                              hyphens: "auto",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden"
                            }}
                          >
                            {account.account_holder_name}
                          </h6>
                        </div>
                      </ListItemButton>
                    </ListItem>
                  ))}
                <Divider style={{ borderColor: "var(--color2) !important", marginBlock: "10px" }} />
              </List>
            )} */}

            {bankData.length > 0 ? (
              <>
                {/* Savings Accounts */}
                {bankData.filter(account => account.bank_account_name === "Saving").length > 0 && (
                  <List>
                    <h1
                      className="text-lg sm:text-base md:text-lg flex justify-start p-2"
                      style={{ color: "var(--color1)" }}
                    >
                      Savings Accounts
                    </h1>

                    {bankData
                      .filter(account => account.bank_account_name === "Saving")
                      .map((account, index) => (
                        <ListItem
                          key={account.id}
                          className={`list-bank ${selectedAccountId === account.id ? "primary-bg text-white" : ""
                            }`}
                          disablePadding
                        >
                          <ListItemButton
                            style={{ width: "100%", borderRadius: "10px" }}
                            onClick={() => handleAccountClick(account.id, index)}
                          >
                            <div className="w-full min-w-0 flex-1">
                              <p
                                className={`text-xs ${selectedAccountId === account.id ? "text-white" : ""
                                  } text-gray-600 mb-1 font-mono tracking-wide`}
                              >
                                {account.bank_account_number || "-"}
                              </p>

                              <h6
                                className={`font-semibold text-sm mb-1 ${selectedAccountId === account.id ? "text-white" : ""
                                  }`}
                              >
                                {account.bank_name}
                              </h6>

                              <h6
                                className={`text-xs text-black font-semibold ${selectedAccountId === account.id ? "text-white" : ""
                                  }`}
                              >
                                {account.account_holder_name}
                              </h6>
                            </div>
                          </ListItemButton>
                        </ListItem>
                      ))}

                    <Divider
                      style={{
                        borderColor: "var(--color2)",
                        marginBlock: "10px",
                      }}
                    />
                  </List>
                )}

                {/* Current Accounts */}
                {bankData.filter(account => account.bank_account_name === "Current").length > 0 && (
                  <List>
                    <h1
                      className="text-lg sm:text-base md:text-lg flex justify-start p-2"
                      style={{ color: "var(--color1)" }}
                    >
                      Current Accounts
                    </h1>
                    {bankData
                      .filter(account => account.bank_account_name === "Current")
                      .map((account, index) => (
                        <ListItem
                          key={account.id}
                          className={`list-bank  ${selectedAccountId === account.id ? " text-white primary-bg" : ""}`}
                          disablePadding
                        >
                          <ListItemButton
                            style={{ width: "100%", borderRadius: "10px" }}
                            onClick={() => handleAccountClick(account.id, index)}
                          >
                            <div className={`w-full min-w-0 flex-1  ${selectedAccountId === account.id ? " text-white" : ""}`}>
                              <p
                                className={`text-xs text-gray-600 mb-1 font-mono tracking-wide  ${selectedAccountId === account.id ? " text-white" : ""}`}
                                style={{
                                  wordBreak: "break-all",
                                  lineHeight: "1.2"
                                }}
                              >
                                {account.bank_account_number || "Empty"}
                              </p>
                              <h6
                                className={`font-semibold text-sm mb-1 ${selectedAccountId === account.id ? " text-white" : ""}`}
                                style={{
                                  wordWrap: "break-word",
                                  lineHeight: "1.3",
                                  hyphens: "auto"
                                }}
                              >{account.bank_name}
                              </h6>
                              <h6
                                className={`font-medium text-xs text-gray-700 ${selectedAccountId === account.id ? " text-white" : ""}`}
                                style={{
                                  wordWrap: "break-word",
                                  lineHeight: "1.4",
                                  hyphens: "auto",
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden"
                                }}
                              >{account.account_holder_name}
                              </h6>
                            </div>
                          </ListItemButton>
                        </ListItem>
                      ))}
                    {/* <Divider style={{ borderColor: "var(--color2) !important", marginBlock: "10px" }} /> */}
                  </List>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center w-full h-[400px]">
                <img
                  src={image1}
                  alt="No Data"
                  className="w-48 h-auto object-contain  select-none pointer-events-none"
                  style={{ marginTop: "120%" }}
                />

                <p className="mt-4 text-black text-lg font-medium">
                  No Bank Details
                </p>
              </div>
            )}
          </Box>

          <Box className="flex-grow bnk_acc_mdl" style={{ width: "71%" }}>
            <Box
              sx={{
                width: "100%",
                bgcolor: "background.paper",
                padding: "0px 20px 0px",
              }}
            >
              <div className="flex justify-end py-3 bnk_acc_hdr gap-2">
                <Button
                  variant="contained"
                  className="gap-2 add_rdc_btn"
                  style={{ background: "var(--color1)", display: "flex" }}
                  onClick={() => {
                    setOpenAddPopUpAdjust(true);
                  }}
                >
                  <AddIcon />
                  Add/Reduce Money
                </Button>
                <Button
                  variant="contained"
                  className="gap-2 add_rdc_btn"
                  style={{ background: "var(--color1)", display: "flex" }}
                  onClick={() => {
                    setOpenAddPopUp(true);
                  }}
                >
                  <AddIcon />
                  Add New Bank
                </Button>
                <Button
                  variant="contained"
                  className="gap-7 downld_btn_csh"
                  style={{
                    background: "var(--color1)",
                    color: "white",
                    // paddingLeft: "35px",
                    textTransform: "none",
                    display: "flex",
                  }}
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

              {/* <Box
                sx={{
                  marginTop: "20px",
                  backgroundColor: "rgba(63, 98, 18, 0.09)",
                  borderRadius: "10px",
                }}
              >
                <div
                  className="firstrow p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
                  style={{ background: "none" }}
                >
                  <div
                    className="distributor-detail"
                  >
                    <span className="primary ">Bank Name</span>
                    <span className="primary font-bold">
                      {!details?.bank_name ? "-" : details?.bank_name}
                    </span>
                  </div>
                  <div
                    className="distributor-detail"
                  >
                    <span className="primary ">Bank Account Number</span>
                    <span className="primary font-bold">
                      {!details?.bank_account_number
                        ? "-"
                        : details?.bank_account_number}
                    </span>
                  </div>
                  <div
                    className="distributor-detail"
                  >
                    <span className="primary ">Account Type</span>
                    <span
                      className="primary font-bold"
                      style={{ textTransform: "lowercase" }}
                    >
                      {!details?.bank_account_name
                        ? "-"
                        : details?.bank_account_name}
                    </span>
                  </div>
                  <div
                    className="distributor-detail"
                  >
                    <span className="primary ">IFSC Code</span>
                    <span className="primary font-bold">
                      {!details?.ifsc_code ? "-" : details?.ifsc_code}
                    </span>
                  </div>
                  <div
                    className="distributor-detail"
                  >
                    <span className="primary ">Branch Name</span>
                    <span className="primary font-bold">
                      {!details?.bank_branch_name
                        ? "-"
                        : details?.bank_branch_name}
                    </span>
                  </div>
                  <div
                    className="distributor-detail"
                  >
                    <span className="primary ">Account Holder Name</span>
                    <span className="primary font-bold">
                      {!details?.account_holder_name
                        ? "-"
                        : details?.account_holder_name}
                    </span>
                  </div>
                  <div
                    className="distributor-detail"
                  >
                    <span className="primary">Current Balance</span>
                    <span className="primary font-bold">
                      {!details?.total_amount
                        ? "-"
                        : details?.total_amount}
                    </span>
                  </div>
                </div>
              </Box> */}


              <div className="scroll-wrapper">
                <div
                  className="firstrow"
                  style={{
                    display: "flex",
                    alignItems: "stretch",
                    marginTop: "0.5rem",
                    background: "#E0E3DC",
                    border: "1px solid #e7ebe0",
                    borderRadius: "12px",
                    boxShadow:
                      "0 1px 2px rgba(15,23,42,0.04), 0 8px 24px -12px rgba(63,98,18,0.15)",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  {/* Left accent */}
                  <div
                    style={{
                      width: "5px",
                      background: "linear-gradient(180deg, #3f6212 0%, #65a30d 50%, #84cc16 100%)",
                      flexShrink: 0,
                    }}
                  />
                  {/* Fields */}
                  <div
                    style={{
                      flex: 1,
                      display: "grid",
                      gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
                      alignItems: "center",
                    }}
                  >
                    {[
                      { label: "Bank Name", value: !details?.bank_name ? "-" : details?.bank_name },
                      {
                        label: "Bank Account Number", value: !details?.bank_account_number
                          ? "-"
                          : details?.bank_account_number
                      },
                      {
                        label: "Account Type", value: !details?.bank_account_name
                          ? "-"
                          : details?.bank_account_name
                      },
                      { label: "IFSC Code", value: !details?.ifsc_code ? "-" : details?.ifsc_code },
                      {
                        label: "Branch Name", value: !details?.bank_branch_name
                          ? "-"
                          : details?.bank_branch_name
                      },
                      {
                        label: "Account Holder Name", value: !details?.account_holder_name
                          ? "-"
                          : details?.account_holder_name
                      },
                      {
                        label: "Current Balance", value: !details?.total_amount
                          ? "-"
                          : details?.total_amount
                      },
                    ].map((item, idx, arr) => (
                      <div
                        key={item.label}
                        className="detail_main"
                        style={{
                          minWidth: 0,
                          padding: "12px 16px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          gap: "4px",
                          borderRight: idx < arr.length - 1 ? "1px solid #7c8d66" : "none",
                          position: "relative",
                        }}
                      >
                        <span
                          className="heading"
                          style={{
                            fontSize: "14px",
                            fontWeight: 700,
                            color: "#3f6212",
                            letterSpacing: "0.01em",
                          }}
                        >
                          {item.label}
                        </span>

                        {item.pill ? (
                          <span
                            style={{
                              alignSelf: "flex-start",
                              fontSize: "0.78rem",
                              fontWeight: 600,
                              color: "#3f6212",
                              background: "#ecfccb",
                              border: "1px solid #d9f99d",
                              padding: "2px 10px",
                              borderRadius: "999px",
                              textTransform: "capitalize",
                              whiteSpace: "nowrap",
                              maxWidth: "100%",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                            title={String(item.value ?? "")}
                          >
                            {item.value}
                          </span>
                        ) : (
                          <span
                            className="data"
                            style={{
                              fontSize: "15px",
                              fontWeight: 600,
                              color: item.accent || "#000000",

                              textTransform: item.cap ? "capitalize" : "none",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              letterSpacing: item.mono ? "-0.01em" : "normal",
                            }}
                            title={String(item.value ?? "")}
                          >
                            {item.value || "—"}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>



              <div
                className="flex  flex-row detail_st_ed_dt gap-6 mt-5"
                style={{ alignItems: "end" }}
              >
                <div className="detail" style={{ width: "100%" }}>
                  <TextField
                    autoComplete="off"
                    id="outlined-basic"
                    value={search}
                    size="small"
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setDebouncedSearch(e.target.value);
                    }}
                    variant="outlined"
                    placeholder="Type Here..."
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
                <div className="detail" style={{ width: "100%" }}>
                  <span className="primary">Start Date</span>
                  <DatePicker
                    label="Start Date"
                    className="custom-datepicker"
                    selected={startDate}
                    onChange={handleStartDate}
                    dateFormat="dd/MM/yyyy"
                    filterDate={(date) => !isDateDisabled(date)}
                  />
                </div>
                <div className="detail" style={{ width: "100%" }}>
                  <span className="primary">End Date</span>
                  <DatePicker
                    label="End Date"
                    className="custom-datepicker"
                    selected={endDate}
                    onChange={handleEndDate}
                    dateFormat="dd/MM/yyyy"
                    filterDate={(date) => !isDateDisabled(date)}
                  />
                </div>
              </div>
              {isLoading ? (
                <div className="loader-container">
                  <Loader />
                </div>
              ) : (
                <>
                  <div >
                    <div className="overflow-x-auto mt-4">
                      <table
                        className="table-cashManage w-full border-collapse"
                        style={{
                          whiteSpace: "nowrap",
                          borderCollapse: "separate",
                          borderSpacing: "0 6px",
                        }}
                      >
                        <thead>
                          <tr>
                            {PassbookColumns.map((column) => (
                              <th
                                key={column.id}
                                style={{ minWidth: column.minWidth }}
                              >
                                {column.label}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody style={{ backgroundColor: "#3f621217" }}>
                          {bankDetails?.length > 0 ? (
                            bankDetails.map((item, index) => (
                              // <tr key={index}>
                              //   {PassbookColumns.map((column, colIndex) => (

                              //     <td
                              //       key={column.id}
                              //       style={
                              //         colIndex === 0
                              //           ? { borderRadius: "10px 0 0 10px" }
                              //           : colIndex === PassbookColumns.length - 1
                              //             ? { borderRadius: "0 10px 10px 0" }
                              //             : {}
                              //       }
                              //       className={
                              //         column.id === "withdraw"
                              //           ? "debit-cell"
                              //           : column.id === "deposit"
                              //             ? "credit-cell"
                              //             : ""
                              //       }
                              //     >
                              //       {item[column.id]}
                              //     </td>
                              //   ))}
                              // </tr>

                              <tr key={index}>
                                {PassbookColumns.map((column, colIndex) => {
                                  let value = item[column.id];
                                  if (!value && value !== 0) {
                                    value = "-";
                                  }
                                  return (
                                    <td
                                      key={column.id}
                                      style={
                                        colIndex === 0
                                          ? { borderRadius: "10px 0 0 10px" }
                                          : colIndex === PassbookColumns.length - 1
                                            ? { borderRadius: "0 10px 10px 0" }
                                            : {}
                                      }
                                      className={
                                        column.id === "withdraw"
                                          ? "debit-cell"
                                          : column.id === "deposit"
                                            ? "credit-cell"
                                            : ""
                                      }
                                    >
                                      {value}
                                    </td>
                                  );
                                })}
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={PassbookColumns.length} style={{
                                textAlign: "center", padding: "20px",
                                color: "gray",
                              }}>
                                No Data Found
                              </td>
                            </tr>
                          )}

                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </Box>
          </Box>
        </Box>


        <Dialog className="custom-dialog" open={openAddPopUp} onClose={handleCloseDialog}>
          <DialogTitle id="alert-dialog-title" className="primary">
            Add Bank Account
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "#ffffff",
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <div
                className="flex my-4"
                style={{ flexDirection: "column", gap: "19px" }}
              >
                <div className="flex flex-col md:flex-row gap-5 ">
                  <div style={{ width: "100%" }}>
                    <div className="mb-2">
                      <span className="label primary mb-4">Bank Name</span>
                      <span className="text-red-600 ml-1">*</span>
                    </div>
                    <TextField
                      autoComplete="off"
                      id="outlined-multiline-static"
                      size="small"
                      value={bankName}
                      error={!!errors.bankName}
                      placeholder="Bank Name"
                      onChange={(e) => {
                        // Transform to uppercase
                        const uppercasedValue = e.target.value.toUpperCase();
                        setBankName(uppercasedValue);

                        setErrors((prev) => ({
                          ...prev,
                          bankName: "",
                        }));
                      }}
                      inputRef={(el) => (inputRefs.current[0] = el)}
                      onKeyDown={(e) => {
                        if (bankName) {
                          handleKeyDown(e, 0);
                        } else {
                          const isEnter = e.key === "Enter";

                          if (isEnter) {
                            e.preventDefault();
                            toast.dismiss();
                            toast.error("Bank Name is Required");
                          }
                          // Shift + Tab is allowed by default; do not prevent it
                        }
                      }}
                      sx={{
                        width: "100%",
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: errors.bankName ? "red" : "",
                          },
                          "&:hover fieldset": {
                            borderColor: errors.bankName ? "red" : "",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: errors.bankName ? "red" : "",
                          },
                        },
                      }}
                      style={{ width: "100%" }}
                      variant="outlined"
                      fullWidth={fullScreen}
                    />
                    {errors.bankName && (
                      <span className="error">{errors.bankName}</span>
                    )}
                  </div>
                  <div style={{ width: "100%" }}>






                    <div className="mb-2">
                      <span className="label primary">Account Type</span>
                      <span className="text-red-600 ml-1">*</span>
                    </div>






                    {/* <TextField
                      autoComplete="off"
                      id="outlined-multiline-static"
                      size="small"
                      type="text"
                      value={accountType}
                      error={!!errors.accountType}
                      placeholder="Account Type"
                      inputRef={(el) => (inputRefs.current[1] = el)}
                      onKeyDown={(e) => {
                        if (accountType) {
                          handleKeyDown(e, 1);
                        } else {
                          const isEnter = e.key === "Enter";

                          if (isEnter) {
                            e.preventDefault();
                            toast.dismiss();
                            toast.error("Account Type is Required");
                          }
                          // Shift + Tab is allowed by default; do not prevent it
                        }
                      }}
                      onChange={(e) => {
                        const capitalizedValue = e.target.value
                          .toLowerCase()
                          .replace(/\b\w/g, (char) => char.toUpperCase());
                        setAccountType(capitalizedValue);
                        setErrors((prev) => ({
                          ...prev,
                          accountType: "",
                        }))
                      }}
                      sx={{
                        width: "100%",
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: errors.accountType ? "red" : "",
                          },
                          "&:hover fieldset": {
                            borderColor: errors.accountType ? "red" : "",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: errors.accountType ? "red" : "",
                          },
                        },
                      }}
                      variant="outlined"
                      fullWidth={fullScreen}
                    /> */}

                    <Select
                      value={accountType}
                      size="small"
                      displayEmpty
                      error={!!errors.accountType}
                      onChange={(e) => {
                        setAccountType(e.target.value);
                        setErrors((prev) => ({
                          ...prev,
                          accountType: "",
                        }));
                      }}
                      sx={{
                        width: "100%",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: errors.accountType ? "red" : "",
                        },
                      }}
                    >
                      <MenuItem value="" disabled>
                        Select Account Type
                      </MenuItem>

                      <MenuItem value="Saving">Saving</MenuItem>
                      <MenuItem value="Current">Current</MenuItem>
                    </Select>



                    {errors.accountType && (
                      <span className="error">{errors.accountType}</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-5">
                  <div style={{ width: "100%" }}>
                    <div className="mb-2">
                      <span className="label primary mb-4">
                        Opening Balance
                      </span>
                    </div>
                    <TextField
                      autoComplete="off"
                      id="outlined-multiline-static"
                      size="small"
                      value={openingBalance}
                      placeholder="Opening Balance"
                      inputRef={(el) => (inputRefs.current[2] = el)}
                      onKeyDown={(e) => {
                        if (openingBalance) {
                          handleKeyDown(e, 2);
                        } else {
                          const isEnter = e.key === "Enter";

                          if (isEnter) {
                            e.preventDefault();
                            toast.dismiss();
                            toast.error("Opening Balance is Required");
                          }
                          // Shift + Tab is allowed by default; do not prevent it
                        }
                      }}
                      onChange={(e) => {
                        setOpeningBalance(e.target.value);
                      }}
                      style={{ width: "100%" }}
                      variant="outlined"
                      fullWidth={fullScreen}
                    />
                  </div>
                  <div style={{ width: "100%" }}>
                    <div className="mb-2">
                      <span className="label primary">As of Date</span>
                    </div>
                    <div className="detail">
                      <div style={{ width: "100%" }}>
                        <DatePicker
                          className="custom-datepicker"
                          selected={asOfDate}
                          onChange={(newDate) => setAsOfDate(newDate)}
                          dateFormat="dd/MM/yyyy"
                          minDate={new Date()}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-1 text-black font-bold secondary flex justify-between items-center bg-[#edf1e9] p-2">
                Add Bank Details
              </div>
              <>
                <div className="flex flex-col md:flex-row gap-5 my-4">
                  <div style={{ width: "100%" }}>
                    <div className="mb-2">
                      <span className="label primary mb-4">
                        Bank Account Number
                      </span>
                      <span className="text-red-600 ml-1">*</span>
                    </div>
                    <TextField
                      autoComplete="off"
                      id="outlined-multiline-static"
                      size="small"
                      value={accountNumber}
                      error={!!errors.accountNumber}
                      placeholder="Bank Account Number"
                      onChange={(e) => {
                        const numericValue = e.target.value.replace(
                          /[^0-9]/g,
                          ""
                        );
                        if (errors.accountNumber) {
                          setErrors((prev) => ({
                            ...prev,
                            accountNumber: "",
                          }));
                        }
                        setAccountNumber(numericValue);
                      }}
                      inputRef={(el) => (inputRefs.current[3] = el)}
                      onKeyDown={(e) => {
                        if (accountNumber) {
                          handleKeyDown(e, 3);
                        } else {
                          const isEnter = e.key === "Enter";

                          if (isEnter) {
                            e.preventDefault();
                            toast.dismiss();
                            toast.error("Bank Account Number is Required");
                          }
                          // Shift + Tab is allowed by default; do not prevent it
                        }
                      }}
                      style={{ width: "100%" }}
                      variant="outlined"
                      fullWidth={fullScreen}
                    />
                    {errors.accountNumber && (
                      <span className="error">{errors.accountNumber}</span>
                    )}
                  </div>

                  <div style={{ width: "100%" }}>
                    <div className="mb-2">
                      <span className="label primary">
                        Re-Enter Account Number
                      </span>
                      <span className="text-red-600 ml-1">*</span>
                    </div>
                    <TextField
                      autoComplete="off"
                      id="outlined-multiline-static"
                      size="small"
                      value={reEnterAccountNumber}
                      error={!!errors.reEnterAccountNumber}
                      placeholder="Re-Enter Account Number"
                      onChange={(e) => {
                        // Allow only numeric input
                        const numericValue = e.target.value.replace(/[^0-9]/g, "");
                        setReEnterAccountNumber(numericValue);
                        // Remove error while typing
                        setErrors((prev) => ({
                          ...prev,
                          reEnterAccountNumber: "",
                        }));
                      }}
                      inputRef={(el) => (inputRefs.current[4] = el)}
                      onKeyDown={(e) => {
                        const isEnter = e.key === "Enter";
                        const isTab = e.key === "Tab";

                        if (!reEnterAccountNumber) {
                          if (isEnter) {
                            e.preventDefault();
                            toast.dismiss();
                            toast.error("Re-Enter Account Number is Required");
                          }
                        } else if (isTab && accountNumber !== reEnterAccountNumber) {
                          // Block focus move if mismatch
                          e.preventDefault();
                          toast.dismiss();
                          toast.error("Account Numbers do not match");
                        } else {
                          handleKeyDown(e, 4);
                        }
                      }}
                      style={{ width: "100%" }}
                      variant="outlined"
                      fullWidth={fullScreen}
                    />

                    {errors.reEnterAccountNumber && (
                      <span className="error">
                        {errors.reEnterAccountNumber}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-5 my-4">
                  <div style={{ width: "100%" }}>
                    <div className="mb-2">
                      <span className="label primary mb-4">IFSC Code</span>
                      <span className="text-red-600 ml-1">*</span>
                    </div>
                    <TextField
                      autoComplete="off"
                      id="outlined-multiline-static"
                      size="small"
                      value={ifscCode}
                      placeholder="IFSC Code"
                      onChange={(e) => {
                        const uppercasedValue = e.target.value.toUpperCase();
                        setIfscCode(uppercasedValue);
                        // Remove error while typing
                        setErrors((prev) => ({
                          ...prev,
                          ifscCode: "",
                        }));
                      }}
                      inputRef={(el) => (inputRefs.current[5] = el)}
                      onKeyDown={(e) => {
                        if (ifscCode) {
                          handleKeyDown(e, 5);
                        } else {
                          const isEnter = e.key === "Enter";

                          if (isEnter) {
                            e.preventDefault();
                            toast.dismiss();
                            toast.error("IFSC Code is Required");
                          }
                          // Shift + Tab is allowed by default; do not prevent it
                        }
                      }}
                      sx={{
                        width: "100%",
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: errors.ifscCode ? "#d32f2f" : "",
                          },
                          "&:hover fieldset": {
                            borderColor: errors.ifscCode ? "#d32f2f" : "",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: errors.ifscCode ? "#d32f2f" : "",
                          },
                        },
                      }}
                      variant="outlined"
                      fullWidth={fullScreen}
                    />
                    {errors.ifscCode && (
                      <span className="error">{errors.ifscCode}</span>
                    )}
                  </div>
                  <div style={{ width: "100%" }}>
                    <div className="mb-2">
                      <span className="label primary">Branch Name</span>
                      <span className="text-red-600 ml-1">*</span>
                    </div>
                    <div className="detail">
                      <TextField
                        autoComplete="off"
                        id="outlined-multiline-static"
                        size="small"
                        value={branchName}
                        placeholder="Branch Name"
                        onChange={(e) => {
                          setBranchName(e.target.value);

                          setErrors((prev) => ({
                            ...prev,
                            branchName: "",
                          }));
                        }}
                        inputRef={(el) => (inputRefs.current[6] = el)}
                        onKeyDown={(e) => {
                          if (branchName) {
                            handleKeyDown(e, 6);
                          } else {
                            const isEnter = e.key === "Enter";

                            if (isEnter) {
                              e.preventDefault();
                              toast.dismiss();
                              toast.error("Branch Name is Required");
                            }
                            // Shift + Tab is allowed by default; do not prevent it
                          }
                        }}
                        sx={{
                          width: "100%",
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: errors.branchName ? "#d32f2f" : "",
                            },
                            "&:hover fieldset": {
                              borderColor: errors.branchName ? "#d32f2f" : "",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: errors.branchName ? "#d32f2f" : "",
                            },
                          },
                        }}
                        variant="outlined"
                        fullWidth={fullScreen}
                      />
                      {errors.branchName && (
                        <span className="error">{errors.branchName}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-5">
                  <div style={{ width: "100%" }}>
                    <div className="mb-2">
                      <span className="label primary mb-4">
                        Account Holder Name
                      </span>
                      <span className="text-red-600 ml-1">*</span>
                    </div>
                    <TextField
                      autoComplete="off"
                      id="outlined-multiline-static"
                      size="small"
                      value={accountHolderName}
                      placeholder="Account Holder Name"
                      onChange={(e) => {
                        const capitalizedValue = e.target.value
                          .toLowerCase()
                          .replace(/\b\w/g, (char) => char.toUpperCase());
                        setAccountHolderName(capitalizedValue);
                        // Remove error while typing
                        setErrors((prev) => ({
                          ...prev,
                          accountHolderName: "",
                        }));
                      }}
                      inputRef={(el) => (inputRefs.current[7] = el)}
                      onKeyDown={(e) => {
                        if (accountHolderName) {
                          handleKeyDown(e, 7);
                        } else {
                          const isEnter = e.key === "Enter";

                          if (isEnter) {
                            e.preventDefault();
                            toast.dismiss();
                            toast.error("Account Holder Name is Required");
                          }
                          // Shift + Tab is allowed by default; do not prevent it
                        }
                      }}
                      sx={{
                        width: "100%",
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: errors.accountHolderName ? "#d32f2f" : "",
                          },
                          "&:hover fieldset": {
                            borderColor: errors.accountHolderName ? "#d32f2f" : "",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: errors.accountHolderName ? "#d32f2f" : "",
                          },
                        },
                      }}
                      variant="outlined"
                      fullWidth={fullScreen}
                    />
                    {errors.accountHolderName && (
                      <span className="error">
                        {errors.accountHolderName}
                      </span>
                    )}
                  </div>
                  <div style={{ width: "100%" }}>
                    <div className="mb-2">
                      <span className="label primary">UPI ID</span>
                    </div>
                    <div className="detail">
                      <TextField
                        autoComplete="off"
                        id="outlined-multiline-static"
                        size="small"
                        value={upiId}
                        placeholder="UPI ID"
                        onChange={(e) => {
                          setUpiId(e.target.value);
                        }}
                        inputRef={(el) => (inputRefs.current[8] = el)}
                        onKeyDown={(e) => {
                          handleKeyDown(e, 8);
                        }}
                        style={{ width: "100%" }}
                        variant="outlined"
                        fullWidth={fullScreen}
                      />

                    </div>
                  </div>
                </div>
              </>
            </DialogContentText>
          </DialogContent>
          <DialogActions style={{ padding: "0px 24px 24px" }}>
            <Button
              style={{ background: "var(--COLOR_UI_PHARMACY)", }}
              autoFocus
              variant="contained"
              onClick={handleAddBank}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
        {/* className="custom-dialog" */}

        {/* Add Fund Dialog Box */}
        <Dialog
          open={openAddPopUpAdjust}
          className="custom-dialog"
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle
            id="alert-dialog-title"
            className="primary"
            sx={{
              backgroundColor: "var(--COLOR_UI_PHARMACY)",
              color: "#ffffff",
              padding: "16px 24px",
              fontSize: "1.25rem",
              fontWeight: 600
            }}
          >
            Adjust Balance
            <IconButton
              aria-label="close"
              onClick={resetAdjustDialog}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: "#ffffff",
                '&:hover': {
                  backgroundColor: "rgba(255, 255, 255, 0.1)"
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ padding: "24px", backgroundColor: "#f8f9fa" }}>
            <DialogContentText component="div" sx={{ margin: 0 }}>
              {/* Select Account */}
              <div className="detail mb-4 mt-4">
                <span className="label primary">Select Account   <span className="text-red-600 ml-1">*</span> </span>
                <Autocomplete
                  id="select-account-autocomplete"
                  // options={[
                  //   { value: "cash", label: "Cash" },
                  //   ...(bankData || []).map((option) => ({
                  //     value: option.id,
                  //     label: `${option.bank_user_name} (${option.bank_account_name})`
                  //   }))
                  // ]}
                  options={(bankData || []).map((option) => ({
                    value: option.id === 0 ? "cash" : option.id,
                    label: option.bank_user_name === "Cash"
                      ? "Cash"
                      : `${option.bank_user_name} (${option.bank_account_name})`
                  }))}
                  getOptionLabel={(option) => option.label || ""}
                  // value={
                  //   [
                  //     { value: "cash", label: "Cash" },
                  //     ...(bankData || []).map((option) => ({
                  //       value: option.id,
                  //       label: `${option.bank_user_name} (${option.bank_account_name})`
                  //     }))
                  //   ].find((option) => option.value === paymentType) || null
                  // }
                  value={
                    (bankData || [])
                      .map((option) => ({
                        value: option.id === 0 ? "cash" : option.id,
                        label:
                          option.bank_user_name === "Cash"
                            ? "Cash"
                            : `${option.bank_user_name} (${option.bank_account_name})`,
                      }))
                      .find((option) => option.value === paymentType) || null
                  }
                  onChange={(event, newValue) => {
                    const fakeEvent = { target: { value: newValue ? newValue.value : "" } };
                    handlePaymentTypeChange(fakeEvent);

                    setErrors((prev) => ({
                      ...prev,
                      paymentType: "",
                    }));
                  }}
                  size="small"
                  renderInput={(params) => (
                    <TextField
                      autoComplete="off"
                      {...params}
                      placeholder="Select Account"
                      error={!!errors.paymentType}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: errors.paymentType ? "red" : "",
                          },
                          "&:hover fieldset": {
                            borderColor: errors.paymentType ? "red" : "",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: errors.paymentType ? "red" : "",
                          },
                        },
                      }}
                    />
                  )}
                />
                {errors.paymentType && (
                  <div className="error" style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                    {errors.paymentType}
                  </div>
                )}
              </div>

              {/* Add or Reduce Buttons */}
              <div className="detail mb-4">
                <span className="label primary mb-2">Add or Reduce   <span className="text-red-600 ml-1">*</span></span>
                <div className="flex flex-col sm:flex-row gap-3 mb-2">
                  <Button
                    autoFocus
                    onClick={handleAddBtn}
                    variant="outlined"
                    startIcon={<AddIcon />}
                    sx={{
                      flex: 1,
                      backgroundColor: clicked ? "#3F6212" : "transparent",
                      color: clicked ? "#ffffff" : "#3F6212",
                      borderColor: "#3F6212",
                      '&:hover': {
                        backgroundColor: clicked ? "#2e480d !important" : "#f1f8e9 !important",
                        borderColor: "#3F6212 !important"
                      }
                    }}
                  >
                    Add Money
                  </Button>
                  <Button
                    autoFocus
                    onClick={handleReduceBtn}
                    variant="outlined"
                    startIcon={<RemoveIcon />}
                    sx={{
                      flex: 1,
                      backgroundColor: reduceclicked ? "#c62828" : "transparent",
                      color: reduceclicked ? "#ffffff" : "#c62828",
                      borderColor: "#c62828",
                      '&:hover': {
                        backgroundColor: reduceclicked ? "#b71c1c !important" : "#ffebee !important",
                        borderColor: "#c62828 !important"
                      }
                    }}
                  >
                    Reduce Money
                  </Button>
                </div>
                {errors.reduceclicked && (
                  <div className="error" style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                    {errors.reduceclicked}
                  </div>
                )}
              </div>

              {/* Current Balance & Date */}
              <div className="detail mb-4">
                <div className="grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <span className="label primary">Current Balance </span>
                    <OutlinedInput
                      type="number"
                      value={currentBalance}
                      disabled
                      placeholder="0"
                      startAdornment={<InputAdornment position="start">₹</InputAdornment>}
                      sx={{
                        width: "100%",
                        backgroundColor: "#f5f5f5",
                        '& .MuiOutlinedInput-input': {
                          fontWeight: 600,
                          color: "#1976d2"
                        }
                      }}
                      size="small"
                    />


                  </div>
                  <div>
                    <span className="label primary">Date</span>
                    <DatePicker
                      className="custom-datepicker"
                      selected={adjustDate}
                      onChange={(newDate) => setAdjustDate(newDate)}
                      dateFormat="dd/MM/yyyy"
                      customInput={
                        <OutlinedInput
                          size="small"
                          sx={{ width: "100%", backgroundColor: "#ffffff", padding: "0px !important" }}
                        />
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Enter Amount & Latest Balance */}
              <div className="detail mb-4">
                <div className="grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <span className="label primary">Enter Amount<span className="text-red-600 ml-1">*</span></span>
                    <OutlinedInput
                      type="number"
                      value={enterAmt}
                      placeholder="0"
                      error={!!errors.enterAmt}
                      onChange={(e) => {
                        setEnterAmt(e.target.value);

                        setErrors((prev) => ({
                          ...prev,
                          enterAmt: "",
                        }));
                      }}
                      startAdornment={<InputAdornment position="start">₹</InputAdornment>}

                      sx={{
                        width: "100%",
                        backgroundColor: "#fff",

                        "& .MuiOutlinedInput-input": {
                          fontWeight: 500,
                        },

                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: errors.enterAmt ? "red !important" : "",
                          borderWidth: errors.enterAmt ? "1px" : "",
                        },
                      }}
                      size="small"
                    />
                    {errors.enterAmt && (
                      <div className="error" style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                        {errors.enterAmt}
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="label primary">Latest Balance</span>
                    <OutlinedInput
                      type="number"
                      value={latestAmt}
                      disabled
                      placeholder="0"
                      startAdornment={<InputAdornment position="start">₹</InputAdornment>}
                      sx={{
                        width: "100%",
                        backgroundColor: "#e8f5e9",
                        '& .MuiOutlinedInput-input': {
                          fontWeight: 600,
                          color: "#2e7d32"
                        }
                      }}
                      size="small"
                    />
                  </div>
                </div>
              </div>

              {/* Remarks */}
              <div className="detail mb-2">
                <span className="label primary">Remarks</span>
                <OutlinedInput
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  sx={{
                    width: "100%",
                    backgroundColor: "#ffffff",
                    '& .MuiOutlinedInput-input': {
                      padding: "8.5px 0px"
                    }
                  }}
                  size="small"
                  placeholder="Add remarks here..."
                  multiline
                  rows={2}
                />
              </div>
            </DialogContentText>
          </DialogContent>

          <DialogActions sx={{
            padding: "16px 24px 24px",
            backgroundColor: "#f8f9fa",
            borderTop: "1px solid #e0e0e0"
          }}>
            <Button
              sx={{
                backgroundColor: "var(--COLOR_UI_PHARMACY)",
                color: "white",
                padding: "6px 20px",
                '&:hover': {
                  backgroundColor: "var(--COLOR_UI_PHARMACY_DARK)",
                  opacity: 0.9
                }
              }}
              autoFocus
              variant="contained"
              onClick={handleAdjustBalance}
            >
              Save Changes
            </Button>
            <Button
              onClick={resetAdjustDialog}
              variant="outlined"
              sx={{
                color: "#666",
                borderColor: "#ccc",
                '&:hover': {
                  borderColor: "#999",
                  backgroundColor: "#f5f5f5"
                }
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openAddPopUpDownload}
          sx={{
            "& .MuiDialog-container": {
              "& .MuiPaper-root": {
                width: "600px",
                maxWidth: "1500px",
                backgroundColor: "none",
                boxShadow: "none",
                marginBottom: "0",
              },
            },
          }}
        >
          <Alert
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setOpenAddPopUpDownload(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 2 }}
          >
            <h4 className="font-bold text-lg"> Please check your email. </h4>
            <span className="text-base">
              You will receive a maill from us within the next few minutes.
            </span>
          </Alert>
        </Dialog>

      </div>
    </>
  );
};
export default BankAccount;
