import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import React, { useState, useRef, useEffect } from "react";
import {
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Input,
  InputAdornment,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DatePicker from "react-datepicker";
import { addMonths, format, set, subDays, subMonths } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import Autocomplete from "@mui/material/Autocomplete";
import { Button, TextField } from "@mui/material";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import {
  useHistory,
  useLocation,
} from "react-router-dom/cjs/react-router-dom.min";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { BsLightbulbFill } from "react-icons/bs";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import axios from "axios";

import Header from "../../../Header";
import Loader from "../../../../componets/loader/Loader";
import { toast, ToastContainer } from "react-toastify";
import SearchIcon from "@mui/icons-material/Search";
import { Prompt } from "react-router-dom/cjs/react-router-dom";
import { FaPlusCircle, FaPowerOff } from "react-icons/fa";
import { VscDebugStepBack } from "react-icons/vsc";
import { Modal } from "flowbite-react";
import { IoMdClose } from "react-icons/io";
import { FaCaretUp } from "react-icons/fa6";
import SaveIcon from "@mui/icons-material/Save";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import IconButton from "@mui/material/IconButton";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import TipsModal from "../../../../componets/Tips/TipsModal";

const AddReturnbill = () => {
  const token = localStorage.getItem("token");
  const history = useHistory();
  const unblockRef = useRef(null);
  const [unsavedItems, setUnsavedItems] = useState(true);
  const [nextPath, setNextPath] = useState("");
  const [isOpenBox, setIsOpenBox] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(addMonths(new Date(), 6));
  const [isLoading, setIsLoading] = useState(false);
  const [mrp, setMRP] = useState();
  const [ptr, setPTR] = useState();
  const [billNo, setBillNo] = useState();
  const [gst, setGst] = useState();
  const [selectedEditItemId, setSelectedEditItemId] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(1);
  const [returnType, setReturnType] = useState(null);
  const [ItemId, setItemId] = useState("");
  const [IsDelete, setIsDelete] = useState(false);

  const [unit, setUnit] = useState("");
  const [schAmt, setSchAmt] = useState("");
  const [disc, setDisc] = useState(0);
  const [selectedEditItem, setSelectedEditItem] = useState(null);
  const [isDeleteAll, setIsDeleteAll] = useState(false);
  const [errors, setErrors] = useState({});
  const [batchList, setBatchList] = useState([]);
  const [gstList, setGstList] = useState([]);
  const [ItemTotalAmount, setItemTotalAmount] = useState(0);
  const [loc, setLoc] = useState("");
  const [distributorList, setDistributorList] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [distributor, setDistributor] = useState(null);
  const [distributorInput, setDistributorInput] = useState("");
  const selectedDistributorRef = useRef(null);
  const [remark, setRemark] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [free, setFree] = useState(0);
  const [error, setError] = useState({
    distributor: "",
    returnType: "",
    billNo: "",
    startDate: "",
    endDate: "",
  });
  const staffOptions = [
    { value: "Owner", id: 1 },
    { value: localStorage.getItem("UserName"), id: 2 },
  ];
  const [batch, setBatch] = useState("");
  const [searchItem, setSearchItem] = useState("");
  const [itemPurchaseId, setItemPurchaseId] = useState("");
  const [paymentType, setPaymentType] = useState("cash");
  const [bankData, setBankData] = useState([]);
  // const [roundOff, setRoundOff] = useState(0)
  // const [otherAmt, setOtherAmt] = useState("")
  // const [netAmount, setNetAmount] = useState(0)
  // const [finalAmount, setFinalAmount] = useState(0)
  const [selectedItem, setSelectedItem] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [saveValue, setSaveValue] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [netAmount, setNetAmount] = useState(0);
  const [roundOff, setRoundOff] = useState(0.0);
  const [otherAmount, setOtherAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [margin, setMargin] = useState(0);
  const [totalMargin, setTotalMargin] = useState(0);
  const [totalNetRate, setTotalNetRate] = useState(0);
  const [totalGST, setTotalGST] = useState(0);
  const [totalQty, setTotalQty] = useState(0);
  const [editQty, setEditQty] = useState("");
  const [qty, setQty] = useState(0);
  const [tempQty, setTempQty] = useState("");
  const [initialTotalStock, setInitialTotalStock] = useState(0); // or use null if you want
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  /*<============================================================================ Input ref on keydown enter ===================================================================> */

  const [selectedIndex, setSelectedIndex] = useState(-1); // Index of selected row
  const tableRef = useRef(null); // Reference for table container
  const [isAutocompleteDisabled, setAutocompleteDisabled] = useState(true);

  const inputRefs = useRef([]);
  const billDateRef = useRef(null);
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const nextElement = inputRefs.current[index + 1];

      if (!nextElement) {
        // If no next element, focus the first element or submit
        setTimeout(() => {
          inputRefs.current[5]?.focus();
        }, 10);
        return;
      }

      // Handle different input types
      if (nextElement.focus) {
        // Standard input elements
        nextElement.focus();
      } else if (nextElement.querySelector) {
        // For DatePicker or complex components, find the input inside
        const input = nextElement.querySelector('input');
        if (input) {
          input.focus();
        }
      } else if (nextElement.setFocus) {
        // For components with custom focus methods
        nextElement.setFocus();
      }
    }
  };

  /*<============================================================ disable autocomplete to focus when tableref is focused  ===================================================> */

  useEffect(() => {
    const handleTableFocus = () => setAutocompleteDisabled(false);
    const handleTableBlur = () => setAutocompleteDisabled(true);

    if (tableRef.current) {
      tableRef.current.addEventListener("focus", handleTableFocus);
      tableRef.current.addEventListener("blur", handleTableBlur);
    }

    return () => {
      if (tableRef.current) {
        tableRef.current.removeEventListener("focus", handleTableFocus);
        tableRef.current.removeEventListener("blur", handleTableBlur);
      }
    };
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!tableData?.item_list?.length) return;

      const activeElement = document.activeElement;
      const isDropdownFocused =
        activeElement &&
        (activeElement.tagName === "SELECT" ||
          activeElement.getAttribute("role") === "option" ||
          activeElement.getAttribute("role") === "listbox" ||
          activeElement.getAttribute("role") === "menuitem" ||
          activeElement.getAttribute("role") === "combobox");

      // Prevent table navigation when a dropdown is focused
      if (isDropdownFocused) return;
        if (e.key === "ArrowDown") {
          e.preventDefault();
          const nextIndex = Math.min(selectedIndex + 1, tableData.item_list.length - 1);
          setSelectedIndex(nextIndex);
          if (nextIndex !== selectedIndex) {
            const selectedRow = tableData.item_list[nextIndex];
            if (selectedRow) handleEditClick(selectedRow);
          }
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          const prevIndex = Math.max(selectedIndex - 1, 0);
          setSelectedIndex(prevIndex);
          if (prevIndex !== selectedIndex) {
            const selectedRow = tableData.item_list[prevIndex];
            if (selectedRow) handleEditClick(selectedRow);
          }
        } else if (e.key === "Enter" && selectedIndex !== -1) {
          const selectedRow = tableData.item_list[selectedIndex];
          if (!selectedRow) return;
          handleEditClick(selectedRow);
        }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [tableData, selectedIndex]);

  /*<================================================================================== handle shortcut  =========================================================================> */

  useEffect(() => {
    const handleKeyDown = (event) => {
      const isAltCombo = event.altKey || event.getModifierState("AltGraph");
      if (!isAltCombo || event.repeat) return;


      event.preventDefault(); // Prevent default browser behavior

      if (event.key.toLowerCase() === "s") {
        if (isSubmitting) return;

        handleSubmit();
      } else if (event.key.toLowerCase() === "g") {
        handleSubmit();
      } else if (event.key.toLowerCase() === "m") {

        removeItem();
        setSelectedIndex(-1);

        setSearchItem("");
        setTimeout(() => {
          inputRefs.current[5]?.focus();
        }, 10);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [distributor, billNo, tableData, isSubmitting]);

  /*<================================================================================== handle shortcut  =========================================================================> */

  useEffect(() => {
    if (otherAmount !== "") {
      const x = parseFloat(finalAmount) + parseFloat(otherAmount);
      setRoundOff((x % 1).toFixed(2));
      roundOff > 0.49
        ? setNetAmount(parseInt(x) + 1)
        : setNetAmount(parseInt(x));
    } else {
      const x = parseFloat(finalAmount).toFixed(2);
      setRoundOff((x % 1).toFixed(2));
      roundOff > 0.49
        ? setNetAmount(parseInt(x) + 1)
        : setNetAmount(parseInt(x));
    }

    if (netAmount < 0) {
      setOtherAmount(0);
    }
  }, [otherAmount, totalAmount, roundOff, netAmount, finalAmount]);

  useEffect(() => {
    // You can perform any additional action here after the state updates
  }, [editQty, selectedEditItemId]);

  useEffect(() => {
    if (selectedEditItem) {
      setSearchItem(selectedEditItem.item_name);
      setUnit(selectedEditItem.weightage);
      setBatch(selectedEditItem.batch_number);
      setExpiryDate(selectedEditItem.expiry);
      setMRP(selectedEditItem.mrp);
      setQty(selectedEditItem.total_stock);
      setFree(selectedEditItem.fr_qty);
      setPTR(selectedEditItem.ptr);
      setDisc(selectedEditItem.disocunt);
      setGst(selectedEditItem.gst_name);
      setLoc(selectedEditItem.location);
      setItemTotalAmount(selectedEditItem.amount);
    }
  }, [selectedEditItem]);

  const LogoutClose = () => {
    setIsOpenBox(false);
    setPendingNavigation(null);
  };

  /*<============================================================================ get data intially ===================================================================> */

  useEffect(() => {
    listOfGst();
    listDistributor();
    BankList();
    // restoreData()
    setBillNo(localStorage.getItem("Purchase_Return_BillNo"));
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

  let listOfGst = () => {
    axios
      .get("gst-list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setGstList(response.data.data);
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

  let listDistributor = () => {
    axios
      .get("list-distributer", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        localStorage.setItem("distributor", response.data.data.distributor);
        setDistributorList(response.data.data);
        if (response.data.status === 401) {
          history.push("/");
          localStorage.clear();
        }
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
  /*<============================================================================ handle leave page fuction  ===================================================================> */

  useEffect(() => {
    const initialize = async () => {
      try {
        await handleLeavePage();
      } catch (error) {
        console.error("Error during initialization:", error);
        if (error?.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          localStorage.removeItem("role");
          localStorage.clear();
          history.push("/");
        }
      }
    };

    initialize();
  }, []);

  const handleLeavePage = async () => {
    let data = new FormData();
    data.append("start_date", localStorage.getItem("StartFilterDate"));
    data.append("end_date", localStorage.getItem("EndFilterDate"));
    data.append("distributor_id", localStorage.getItem("DistributorId"));
    data.append("type", "0");

    try {
      const response = await axios.post("purches-return-iteam-histroy", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setUnsavedItems(false);
        setIsOpenBox(false);

        setTimeout(() => {
          if (nextPath) {
            history.push(nextPath);
          }
        }, 0);
      }
      setIsOpenBox(false);
      setUnsavedItems(false);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setUnsavedItems(false);

        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");

        setIsOpenBox(false);
        localStorage.setItem("unsavedItems", unsavedItems.toString());
        setTimeout(() => {
          history.push(nextPath);
        }, 0);
      } else {
        console.error("Error deleting items:", error);
      }
    }
  };
  /*<============================================================================ calculation  ===================================================================> */

  useEffect(() => {
    const validPtr = Number(ptr) || 0;
    const validDisc = Number(disc) || 0;
    const validQty = Number(qty) || 0;
    const validGst = Number(gst) || 0;

    const totalSchAmt = parseFloat((((validPtr * validDisc) / 100) * validQty).toFixed(2));
    const totalBase = parseFloat((validPtr * validQty - totalSchAmt).toFixed(2));
    const totalAmount = parseFloat(
      (totalBase + (totalBase * validGst) / 100).toFixed(2)
    );
    if (totalAmount) {
      setItemTotalAmount(totalAmount.toFixed(2));
    } else {
      setItemTotalAmount(totalAmount === 0 ? "0.00" : 0);
    }
    if (isDeleteAll == false) {
      // restoreData();
    }
  }, [ptr, qty, disc, gst]);

  const handleNavigation = (path) => {
    setIsOpenBox(true);
    setNextPath(path);
  };



  const paymentOptions = [
    { id: 1, label: "Cash" },
    { id: 2, label: "Credit" },
    { id: 3, label: "UPI" },
    { id: 4, label: "Cheque" },
    { id: 5, label: "Paytm" },
    { id: 6, label: "CC/DC" },
    { id: 7, label: "RTGS/NEFT" },
  ];

  const isDateDisabled = (date) => {
    const today = new Date();
    // Set time to 00:00:00 to compare only date part
    today.setHours(0, 0, 0, 0);
    // Disable dates that are greater than today
    return date > today;
  };

  const deleteOpen = (Id) => {
    setIsDelete(true);
    setUnsavedItems(true);
    setItemId(Id);
  };

  const handleDeleteItem = async (ItemId) => {
    if (!ItemId) return;
    let data = new FormData();
    data.append("purches_return_id", ItemId);
    const params = {
      purches_return_id: ItemId ? ItemId : "",
      type: 0,
    };
    try {
      await axios
        .post("purches-return-iteam-delete?", data, {
          params: params,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUnsavedItems(true);
          purcheseReturnFilter();
          setIsDelete(false);
          toast.dismiss();
          toast.success(response?.data?.message || "Item deleted successfully");
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
      toast.dismiss();
      toast.error(error?.response?.data?.message || "Item not deleted successfully");
    }
  };

  const filterData = async (searchItem) => {
    const newErrors = {};

    if (!distributor) {
      newErrors.distributor = "Distributor is required";
      toast.dismiss();
      toast.error("Distributor is required");
    }
    if (!startDate) {
      newErrors.startDate = "Start date is required";
      toast.dismiss();
      toast.error("Start date is required");
    }
    if (!endDate) {
      newErrors.endDate = "End date is required";
      toast.dismiss();
      toast.error("End date is required");
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      await purcheseReturnFilter();
      return true;
    }
    return false;
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setErrors((prev) => ({ ...prev, searchItem: "" }));

    if (!distributor) {
      toast.dismiss();
      toast.error("Please select distributor first");
      return;
    }

    purcheseReturnFilter(value);
  };

  const purcheseReturnFilter = async (value) => {
    let data = new FormData();
    // setIsLoading(true);
    data.append("start_date", startDate ? format(startDate, "MM/yy") : "");
    data.append("end_date", endDate ? format(endDate, "MM/yy") : "");
    data.append("distributor_id", distributor.id ? distributor.id : "");
    data.append("search", value ? value : "");
    try {
      await axios
        .post("purches-return-filter?", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setTableData(response.data.data);
          setFinalAmount(response.data.data?.final_amount);
          setNetAmount(response.data.data?.final_amount);
          setTotalMargin(Number(response.data.data?.total_margin));
          setMargin(Number(response.data.data?.margin));
          setTotalNetRate(response.data.data?.total_net_rate);
          setTotalGST(response.data.data?.total_gst);
          setTotalQty(response.data.data?.total_qty);

          // batchListAPI();
          // setIsLoading(false);
        });
      localStorage.setItem("StartFilterDate", format(startDate, "MM/yy"));
      localStorage.setItem("EndFilterDate", format(endDate, "MM/yy"));
      localStorage.setItem("DistributorId", distributor.id);
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

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };
  const handleSchAmt = (e) => {
    // Get the input value as a string
    const inputString = e.target.value;
    // Remove invalid characters from the string
    const sanitizedInput = inputString.replace(/[eE]/g, "");
    // Convert the sanitized string to a float
    const inputDiscount = parseFloat(sanitizedInput) || 0;
    setDisc(inputDiscount);
    // Calculate total scheme amount
    const totalSchAmt = parseFloat(
      (((ptr * inputDiscount) / 100) * qty).toFixed(2)
    );
    setSchAmt(totalSchAmt);
    // Calculate total base
    const totalBase = parseFloat((ptr * qty - totalSchAmt).toFixed(2));
    // setBase(totalBase); // Uncomment if needed
  };

  const removeItem = () => {
    setSelectedEditItem(null)
    setSelectedEditItemId(null)

    setUnit("");
    setBatch("");
    setSearchItem("");
    setExpiryDate("");
    setMRP("");
    setQty("");
    setFree("");
    setPTR("");
    setDisc(0);
    setGst("");
    setLoc("");
    setItemTotalAmount(0);
    setIsEditMode(false);


  };

  const handleSubmit = () => {
    if (isSubmitting) {
      toast.warning("Please wait, request in progress...");
      return;
    }
    const newErrors = {};
    if (!distributor) {
      newErrors.distributor = "Please select Distributor";
    }
    if (!startDate) {
      newErrors.startDate = "Start date is required";
    }
    if (!endDate) {
      newErrors.endDate = "End date is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    if (selectedItem.length === 0) {
      toast.dismiss();
      toast.error("Please select at least one item");
      return;
    }

    submitPurchaseData();
    setIsOpenBox(false);
    setPendingNavigation(null);
  };

  const submitPurchaseData = async () => {
    if (isSubmitting) {
      toast.warning("Please wait, request in progress...");
      return;
    }

    setIsSubmitting(true);

    const hasUncheckedItems = tableData?.item_list.every(
      (item) => item.iss_check === false
    );
    if (hasUncheckedItems) {
      toast.dismiss();
      toast.error("Please select at least one item");
    } else {
      let data = new FormData();
      const selectedItems = tableData.item_list.filter((item) =>
        selectedItem.includes(item.id)
      );
      setIsLoading(true);
      data.append("distributor_id", distributor.id ? distributor.id : "");
      data.append("bill_no", billNo ? billNo : "");
      data.append(
        "bill_date",
        selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""
      );
      data.append("remark", remark ? remark : "");
      data.append(
        "owner_type",
        localStorage.getItem("UserName") ? localStorage.getItem("UserName") : ""
      );
      data.append(
        "purches_return",
        JSON.stringify(selectedItems) ? JSON.stringify(selectedItems) : ""
      );
      data.append(
        "final_amount",
        tableData.final_amount ? tableData.final_amount : ""
      );
      data.append("payment_type", paymentType ? paymentType : "");
      // data.append('other_amount', otherAmt || 0);
      data.append("other_amount", otherAmount ? otherAmount : "" || 0);
      data.append("total_gst", totalGST ? totalGST : "" || 0);
      data.append("net_amount", netAmount ? netAmount : "");
      data.append("net_rate", totalNetRate ? totalNetRate : "");
      data.append("round_off", roundOff ? roundOff : "");
      data.append("start_date", startDate ? format(startDate, "MM/yy") : "");
      data.append("end_date", endDate ? format(endDate, "MM/yy") : "");
      data.append("draft_save", "1");

      try {
        await axios
          .post("purches-return-store", data, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            setIsLoading(false);
            setSaveValue(true);
            setUnsavedItems(false);
            toast.dismiss();
            toast.success(response.data.message);
            setTimeout(() => {
              setIsSubmitting(false);

              history.push("/purchaseReturn");
            }, 2000);
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
        setIsSubmitting(false);

      }
    }
  };

  const handleExpiryDateChange = (event) => {
    let inputValue = event.target.value;
    inputValue = inputValue.replace(/\D/g, "");

    if (inputValue.length > 2) {
      const month = inputValue.slice(0, 2);
      const year = inputValue.slice(2, 4);
      if (parseInt(month) > 12) {
        inputValue = "MM";
      } else if (parseInt(month) < 1) {
        inputValue = "01";
      }
      inputValue = `${inputValue.slice(0, 2)}/${inputValue.slice(2, 4)}`;
    }
    setExpiryDate(inputValue);
  };

  const handleEditClick = (item, value) => {
    setIsEditMode(true);
    setSelectedEditItem(item);
    setSelectedEditItemId(item.id);
    setItemPurchaseId(item.item_id);
    setQty(item.total_stock);
    setEditQty(item.total_stock);
    setFree(item.fr_qty);
    setInitialTotalStock(item.total_stock);
    setTimeout(() => {
      inputRefs.current[6]?.focus();
    }, 10);
  };

  const handleQtyChange = (value) => {
    // const inputQty = Number(e.target.value);

    const availableStockForEdit = initialTotalStock - free;

    if (value <= availableStockForEdit && value >= 0) {
      setQty(value);
    } else if (value > availableStockForEdit) {
      setQty(availableStockForEdit);
      toast.dismiss();
      toast.error(
        `Quantity exceeds the allowed limit. Max available: ${availableStockForEdit}`
      );
    }
  };

  const EditReturn = async () => {
    const newErrors = {};
    if (!unit) newErrors.unit = "Unit is required";
    if (!batch) newErrors.batch = "Batch is required";
    if (!expiryDate) newErrors.expiryDate = "Expiry date is required";
    if (!mrp) newErrors.mrp = "MRP is required";
    if (!qty) newErrors.qty = "Quantity is required";
    // if (gst != 12 && gst != 18 && gst != 5 && gst != 28) {
    //     newErrors.gst = "Enter valid GST";
    //     toast.dismiss();
    // toast.error("Enter valid GST")
    // };
    // if (!free) newErrors.free = 'Free quantity is required';
    if (!ptr) newErrors.ptr = "PTR is required";
    // if (!disc) newErrors.disc = 'Discount is required';
    if (!gst) newErrors.gst = "GST is required";
    // if (!loc) newErrors.loc = 'Location is required';
    if (gst != 18 && gst != 5 && gst != 0) {
      newErrors.gst = "Enter valid GST";
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    if (isValid) {
      setUnsavedItems(true);
      await handleEditItem(); // Call handleEditItem if validation passes
    }
    return isValid;
  };

  const restoreData = () => {
    let data = new FormData();
    const params = {
      start_date: localStorage.getItem("StartFilterDate")
        ? localStorage.getItem("StartFilterDate")
        : "",
      end_date: localStorage.getItem("EndFilterDate")
        ? localStorage.getItem("EndFilterDate")
        : "",
      distributor_id: localStorage.getItem("DistributorId")
        ? localStorage.getItem("DistributorId")
        : "",
      type: 0,
    };
    try {
      const res = axios
        .post("purches-return-iteam-histroy?", data, {
          params: params,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => { });
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

  const handleChecked = async (itemId, checked) => {
    let data = new FormData();
    data.append("id", itemId);
    try {
      const response = await axios.post("purchase-return-iteam-select", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data) {
        setSelectedItem((prevSelected) => {
          if (checked) {
            return [...prevSelected, itemId];
          } else {
            return prevSelected.filter((id) => id !== itemId);
          }
        });
        const allSelected =
          tableData?.item_list.every((item) => item.iss_check) || false;
        // setSelectAll(allSelected);
        purcheseReturnFilter();
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
  const handleSelectAll = async (checked) => {
    for (let i = 0; i < tableData?.item_list?.length; i++) {
      handleChecked(tableData?.item_list[i].id, checked);
    }
  };

  const handleEditItem = async () => {
    const gstMapping = {
      28: 6,
      18: 4,
      12: 3,
      5: 2,
      0: 1,
    };
    setUnsavedItems(true);
    let data = new FormData();
    data.append(
      "purches_return_id",
      selectedEditItemId ? selectedEditItemId : ""
    );
    data.append("iteam_id", itemPurchaseId ? itemPurchaseId : 0);
    data.append("weightage", unit ? unit : 0);
    data.append("batch", batch ? batch : "");
    data.append("exp_dt", expiryDate ? expiryDate : "");
    data.append("mrp", mrp ? mrp : "");
    data.append("ptr", ptr ? ptr : "");
    data.append("qty", qty ? qty : 0);
    data.append("fr_qty", free ? free : 0);
    data.append("disocunt", disc ? disc : 0);
    data.append("gst", gstMapping[gst] ?? gst);
    data.append("location", loc ? loc : "");
    data.append("amount", ItemTotalAmount ? ItemTotalAmount : "");

    const params = {
      id: selectedEditItemId,
    };
    try {
      const response = await axios.post("purches-return-edit-iteam?", data, {
        params: params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsDeleteAll(true);
      purcheseReturnFilter();
      setSearchItem("");
      setUnit("");
      setBatch("");
      setExpiryDate("");
      setMRP("");
      setQty("");
      setFree("");
      setPTR("");
      setGst("");
      setDisc(0);
      setBatch("");
      setLoc("");
      setIsEditMode(false);
      setUnsavedItems(true);
      if (isNaN(ItemTotalAmount)) {
        setItemTotalAmount(0);
      }
      if (inputRefs?.current[5]) {
        inputRefs?.current[5].focus();
      }
    } catch (e) {
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

  const handleOtherAmount = (event) => {
    setUnsavedItems(true);

    let value = event.target.value;

    value = Number(value) || "";

    if (value < -finalAmount) {
      value = -finalAmount;
    }

    // Update the state
    setOtherAmount(value);
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
      <>
        <div className="p-6"
          style={{
            height: "calc(-125px + 100vh)",
            overflow: "auto",
          }}>

          <div >

            {/*<========================================================== Top header & buttons   =========================================================> */}
            <div className="flex flex-wrap items-center justify-between gap-2 row border-b border-dashed pb-4 border-[var(--color1)]">

              <div className="flex items-center gap-2">
                <span
                  className="text-[var(--color2)] font-bold text-[20px] cursor-pointer"
                  onClick={() => {
                    history.push("/purchaseReturn");
                  }}
                >
                  Purchase Return
                </span>
                <span className="w-6 h-6">

                  <ArrowForwardIosIcon
                    fontSize="small"
                    className="text-[var(--color1)]"
                  />
                </span>

                <span className="text-[var(--color1)] font-bold text-[20px]">New</span>

                <BsLightbulbFill
                  className="w-6 h-6 text-[var(--color2)] hover-yellow"
                  onClick={() => setShowModal(true)}
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex items-center rounded-[4px] bg-[var(--color1)] px-4 py-2 text-white hover:bg-[var(--color2)] transition"
                  onClick={() => handleSubmit()}
                >
                  Save
                </button>
              </div>
            </div>

            {/*<============================================================= Top details   ============================================================> */}

            <div className="flex gap-4  mt-4">
              <div className="flex flex-row gap-4 overflow-x-auto w-full ">
                <div>
                  <span className="title mb-2 flex items-center gap-2">Distributor<span className="text-red-600">*</span></span>
                  <Autocomplete
                    value={distributor}
                    inputValue={distributorInput}
                    sx={{
                      width: "100%",
                      minWidth: "350px",
                      minHeight: "40px",
                      "@media (max-width:600px)": { minWidth: "250px" },
                    }}
                    freeSolo
                    size="small"
                    options={distributorList}
                    filterOptions={(options, state) => {
                      const search = state.inputValue.trim().toLowerCase();
                      if (!search) return options;
                      return options.filter((opt) =>
                        (opt.name || "").toLowerCase().includes(search)
                      );
                    }}
                    onChange={(e, newValue) => {
                      let finalValue = null;
                      if (typeof newValue === "string") {
                        finalValue = { id: null, name: newValue.toUpperCase() };
                      } else if (newValue && typeof newValue === "object") {
                        finalValue = {
                          id: newValue.id ?? null,
                          name: newValue.name?.toUpperCase() || "",
                        };
                      }
                      selectedDistributorRef.current = finalValue;
                      setDistributor(finalValue);
                      setDistributorInput(finalValue?.name ?? "");
                      setBillNo("");
                      setErrors((prev) => ({ ...prev, distributor: "" }));
                    }}
                    onInputChange={(event, newInputValue, reason) => {
                      if (reason === "input") {
                        setDistributorInput(newInputValue.toUpperCase());
                        selectedDistributorRef.current = null;
                        setBillNo("");
                        setErrors((prev) => ({ ...prev, distributor: "" }));
                      } else if (reason === "clear") {
                        setDistributorInput("");
                        setDistributor(null);
                        selectedDistributorRef.current = null;
                      }
                    }}
                    getOptionLabel={(option) =>
                      typeof option === "string" ? option : option?.name ?? ""
                    }
                    isOptionEqualToValue={(option, value) => option?.id === value?.id}
                    renderOption={(props, option, { index }) => {
                      const { key, ...restProps } = props;
                      return (
                        <li key={option.id || `${option.name}-${index}`} {...restProps}>
                          {option.name}
                        </li>
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        autoFocus
                        autoComplete="off"
                        variant="outlined"
                        error={!!errors.distributor}
                        helperText={errors.distributor}
                        placeholder="Select Distributor"
                        FormHelperTextProps={{
                          sx: {
                            color: "#ff0000ff !important",
                            ml: 0,
                          },
                        }}
                        {...params}
                        inputRef={(el) => (inputRefs.current[0] = el)}
                        inputProps={{
                          ...params.inputProps,
                          style: { textTransform: "" },
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === "Tab") {
                            const prevent = !selectedDistributorRef.current?.id;

                            setTimeout(() => {
                              if (selectedDistributorRef.current?.id) {
                                handleKeyDown(e, 0);
                              }
                            }, 100);

                            if (prevent) {
                              e.preventDefault();
                            }
                          }
                        }}
                      />
                    )}
                  />
                </div>

                <div >
                  <span className="title mb-2">Bill No.</span>
                  <TextField
                    autoComplete="off"
                    id="outlined-number"

                    size="small"
                    variant="outlined"
                    sx={{
                      width: "100%",
                      minWidth: "200px",
                      minHeight: "40px",
                      "@media (max-width:600px)": { minWidth: "200px" },
                    }}
                    value={billNo}
                    InputProps={{ readOnly: true }}
                    inputRef={(el) => (inputRefs.current[1] = el)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        setTimeout(() => billDateRef.current?.setFocus(), 10);
                      }
                    }}
                  />
                </div>


                <div >
                  <span className="title mb-2">Bill Date</span>
                  <div>
                    <DatePicker
                      className="custom-datepicker "
                      selected={selectedDate}
                      variant="outlined"
                      onChange={(newDate) => setSelectedDate(newDate)}
                      dateFormat="dd/MM/yyyy"
                      filterDate={(date) => !isDateDisabled(date)}
                      ref={(el) => {
                        inputRefs.current[2] = el;
                        billDateRef.current = el;
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowDown') {
                          billDateRef.current?.setOpen(true);
                        } else if (e.key === 'Enter') {
                          e.preventDefault();
                          billDateRef.current?.setOpen(false);
                          setTimeout(() => {
                            if (inputRefs.current[3]) {
                                inputRefs.current[3].focus();
                            }
                          }, 10);
                        }
                      }}
                    />
                  </div>
                </div>

                <div >
                  <span className="title mb-2">Expiry Start Date <span className="text-red-600">*</span></span>
                  <div>
                    <DatePicker
                      selected={startDate}
                      onChange={(newDate) => {
                        setStartDate(newDate);
                        setErrors((prev) => ({ ...prev, startDate: "" }));
                      }}
                      dateFormat="MM/yyyy"
                      showMonthYearPicker
                      ref={startDateRef}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowDown') {
                          startDateRef.current?.setOpen(true);
                        } else if (e.key === 'Enter') {
                          e.preventDefault();
                          startDateRef.current?.setOpen(false);
                          setTimeout(() => {
                            if (inputRefs.current[4]) {
                                inputRefs.current[4].focus();
                            }
                          }, 10);
                        }
                      }}
                      customInput={
                        <TextField
                          inputRef={(el) => (inputRefs.current[3] = el)}
                          size="small"
                          error={!!errors.startDate}
                          helperText={errors.startDate}
                          FormHelperTextProps={{
                            sx: { color: "#d32f2f !important", ml: 0 },
                          }}
                          sx={{
                            width: "100%",
                            minWidth: "200px",
                            backgroundColor: "#ffffff",
                          }}
                        />
                      }
                    />
                  </div>
                </div>

                <div>
                  <span className="title mb-2">Expiry End Date <span className="text-red-600">*</span></span>
                  <div>
                    <DatePicker
                      selected={endDate}
                      onChange={(newDate) => {
                        setEndDate(newDate);
                        setErrors((prev) => ({ ...prev, endDate: "" }));
                      }}
                      dateFormat="MM/yyyy"
                      showMonthYearPicker
                      ref={endDateRef}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowDown') {
                          endDateRef.current?.setOpen(true);
                        } else if (e.key === 'Enter') {
                          e.preventDefault();
                          endDateRef.current?.setOpen(false);
                          setTimeout(() => {
                            if (inputRefs.current[5]) {
                                inputRefs.current[5].focus();
                            }
                          }, 10);
                        }
                      }}
                      customInput={
                        <TextField
                          inputRef={(el) => (inputRefs.current[4] = el)}
                          size="small"
                          error={!!errors.endDate}
                          helperText={errors.endDate}
                          FormHelperTextProps={{
                            sx: { color: "#d32f2f !important", ml: 0 },
                          }}
                          sx={{
                            width: "100%",
                            minWidth: "200px",
                            backgroundColor: "#ffffff",
                          }}
                        />
                      }
                    />
                  </div>
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    className="inline-flex items-center rounded-[4px] bg-[var(--color1)] px-4 py-2 text-white hover:bg-[var(--color2)] transition"
                    ref={(el) => (inputRefs.current[5] = el)}
                    onClick={() => filterData(searchItem)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        filterData(searchItem);
                      }
                    }}>
                    <span className="flex align-center mr-4">
                      <svg width="20" height="20" fill="white" className="mr-4" ><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></svg>
                      Filter
                    </span>

                  </button>
                </div>

              </div>
            </div>

            {/*<================================================================Item Table ===============================================================> */}

            <div className="table-container">
              <table className="w-full border-collapse item-table" tabIndex={0} ref={tableRef}>
                <thead>
                  <tr className="input-row">
                    <th>
                      <div className="flex justify-start items-center gap-2">
                        Search Item Name <span className="text-red-600 ">*</span>
                        <FaPlusCircle
                          className="primary cursor-pointer"
                          onClick={() => history.push('/itemMaster')}

                        />
                      </div>
                    </th>
                    <th>Unit <span className="text-red-600">*</span></th>
                    <th>Batch <span className="text-red-600">*</span></th>
                    <th>Expiry <span className="text-red-600">*</span></th>
                    <th>MRP <span className="text-red-600">*</span></th>
                    <th>Qty.</th>
                    <th>Free</th>
                    <th>PTR <span className="text-red-600">*</span></th>
                    <th>CD%</th>
                    <th>GST%<span className="text-red-600">*</span></th>
                    <th>Loc.</th>
                    <th>Amount</th>
                  </tr>
                </thead>

                <tbody>
                  <tr className="input-row">
                    <td style={{ fontSize: 15, height: "47px", minWidth: 350, width: "350px", maxWidth: "350px" }}>
                      <div style={{ width: "100%", height: "100%", display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
                        {isEditMode ? (
                        <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'left', }}>
                          <DeleteIcon className="delete-icon mr-2" onClick={removeItem} />
                          {searchItem?.slice(0, 30)}{searchItem?.length > 30 ? '...' : ''}
                        </div>
                      ) : (
                        <TextField
                          autoComplete="off"
                          id="outlined-basic"
                          size="small"
                          fullWidth
                          sx={{
                            minWidth: "100%",
                            width: "100%",
                            textTransform: 'uppercase',

                          }}
                          value={searchQuery.toUpperCase()}
                          onChange={handleInputChange}

                          variant="outlined"
                          placeholder="Please search any items.."
                          inputRef={(el) => (inputRefs.current[5] = el)}
                          error={!!errors.searchItem}
                          onKeyDown={e => {
                            if (e.key === "Enter" && !searchQuery) {
                              e.preventDefault();
                              setErrors((prev) => ({ ...prev, searchItem: true }));
                            }
                          }}

                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="start">
                                <svg width="20" height="20" fill="gray"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></svg>
                              </InputAdornment>
                            ),
                            type: "search",
                          }}
                        />
                      )}
                      </div>
                    </td>

                    <td>
                      <TextField
                        autoComplete="off"
                        id="outlined-number"
                        type="number"
                        size="small"
                        placeholder="Unit"
                        error={!!errors.unit}
                        value={unit}
                        sx={{
                          minWidth: "40px",
                          width: "100%",
                          '& .MuiInputBase-input': {
                            textAlign: 'center',
                          },
                        }}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, "");
                          setUnit(value ? Number(value) : "");
                          setErrors((prev) => ({ ...prev, unit: "" }));
                        }}
                        inputRef={(el) => (inputRefs.current[6] = el)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            if (unit && unit !== 0) {
                              handleKeyDown(e, 6);
                            } else {
                              e.preventDefault();
                              setErrors((prev) => ({ ...prev, unit: true }));
                            }
                          }
                        }}
                      />
                    </td>

                    <td>
                      <TextField
                        autoComplete="off"
                        id="outlined-number"
                        size="small"
                        disabled
                        placeholder="Batch"
                        error={!!errors.batch}
                        value={batch}
                        sx={{
                          minWidth: "100px",
                          width: "100%",
                          '& .MuiInputBase-input': {
                            textAlign: 'center',
                          },
                        }}
                        onChange={(e) => {
                          setBatch(e.target.value);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleKeyDown(e, 13);
                          }
                        }}
                      />
                    </td>

                    <td>
                      <TextField
                        autoComplete="off"
                        id="outlined-number"
                        disabled
                        size="small"
                        sx={{
                          minWidth: "65px",
                          width: "100%",
                          '& .MuiInputBase-input': {
                            textAlign: 'center',
                          },
                        }}
                        error={!!errors.expiryDate}
                        value={expiryDate}
                        onChange={handleExpiryDateChange}
                        placeholder="MM/YY"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleKeyDown(e, 14);
                          }
                        }}
                      />
                    </td>

                    <td>
                      <TextField
                        autoComplete="off"
                        id="outlined-number"
                        type="number"
                        placeholder="Mrp"
                        sx={{
                          minWidth: "65px",
                          width: "100%",
                          '& .MuiInputBase-input': {
                            textAlign: 'center',
                          },
                        }}
                        size="small"
                        disabled
                        error={!!errors.mrp}
                        value={mrp}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*\.?\d*$/.test(value)) {
                            setMRP(value ? Number(value) : "");
                          }
                        }}
                        inputRef={(el) => (inputRefs.current[15] = el)}
                        onKeyDown={(e) => {
                          if (["e", "E", "+", "-", ","].includes(e.key) || (e.key === "." && e.target.value.includes("."))) {
                            e.preventDefault();
                          }
                          if (e.key === "Enter") {
                            handleKeyDown(e, 15);
                          }
                        }}
                      />
                    </td>

                    <td>
                      <TextField
                        autoComplete="off"
                        id="outlined-number"
                        type="number"
                        sx={{
                          minWidth: "65px",
                          width: "100%",
                          '& .MuiInputBase-input': {
                            textAlign: 'center',
                          },
                        }}
                        size="small"
                        error={!!errors.qty}
                        value={qty}
                        inputRef={(el) => (inputRefs.current[7] = el)}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, "");
                          handleQtyChange(value ? Number(value) : "");
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            if (qty && qty !== 0) {
                              handleKeyDown(e, 7);
                            } else {
                              handleKeyDown(e, 7); // Usually qty is not compulsory, but if it is, maybe set error. I will let it pass.
                            }
                          }
                        }}
                      />
                    </td>

                    <td>
                      <TextField
                        autoComplete="off"
                        id="outlined-number"
                        size="small"
                        sx={{
                          minWidth: "40px",
                          width: "100%",
                          '& .MuiInputBase-input': {
                            textAlign: 'center',
                          },
                        }}
                        value={free}
                        inputRef={(el) => (inputRefs.current[8] = el)}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, "");
                          setFree(value ? Number(value) : "");
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleKeyDown(e, 8);
                          }
                        }}
                      />
                    </td>

                    <td>
                      <TextField
                        autoComplete="off"
                        id="outlined-number"
                        type="number"
                        sx={{
                          minWidth: "65px",
                          width: "100%",
                          '& .MuiInputBase-input': {
                            textAlign: 'center',
                          },
                        }}
                        size="small"
                        value={ptr}
                        placeholder="Ptr"
                        inputRef={(el) => (inputRefs.current[9] = el)}
                        onChange={(e) => {
                          setPTR(e.target.value);
                          setErrors((prev) => ({ ...prev, ptr: "" }));
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            if (ptr && ptr !== 0) {
                              handleKeyDown(e, 9);
                            } else {
                              e.preventDefault();
                              setErrors((prev) => ({ ...prev, ptr: true }));
                            }
                          }
                        }}
                      />
                    </td>

                    <td>
                      <TextField
                        autoComplete="off"
                        id="outlined-number"
                        sx={{
                          minWidth: "40px",
                          width: "100%",
                          '& .MuiInputBase-input': {
                            textAlign: 'center',
                          },
                        }}
                        size="small"
                        type="number"
                        value={disc}
                        inputRef={(el) => (inputRefs.current[10] = el)}
                        onChange={(e) => {
                          handleSchAmt(e);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleKeyDown(e, 10);
                          }
                        }}
                      />
                    </td>

                    <td>
                      <TextField
                        labelId="dropdown-label"
                        id="dropdown"
                        value={gst}
                        sx={{
                          minWidth: "40px",
                          width: "100%",
                          '& .MuiInputBase-input': {
                            textAlign: 'center',
                          },
                        }}
                        select
                        // SelectProps={{ native: true }}
                        variant="outlined"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleKeyDown(e, 11);
                          }
                        }}
                        onChange={(e) => {
                          setGst(e.target.value);
                          setErrors((prev) => ({ ...prev, gst: "" }));
                        }}
                        inputRef={(el) => (inputRefs.current[11] = el)}
                        size="small"
                        error={!!errors.gst}
                      >
                        <MenuItem value="0">0</MenuItem>
                        <MenuItem value="5">5</MenuItem>
                        <MenuItem value="18">18</MenuItem>
                      </TextField>
                    </td>

                    <td>
                      <TextField
                        autoComplete="off"
                        id="outlined-number"
                        size="small"
                        placeholder="Loc"
                        sx={{
                          minWidth: "65px",
                          width: "100%",
                          '& .MuiInputBase-input': {
                            textAlign: 'center',
                          },
                        }}
                        value={loc}
                        inputRef={(el) => (inputRefs.current[12] = el)}
                        onChange={(e) => {
                          setLoc(e.target.value);
                        }}
                        onKeyDown={async (e) => {
                          if (e.key === "Enter") {
                            await EditReturn();
                            setSelectedIndex(-1);
                            if (inputRefs.current[5]) {
                              inputRefs.current[5].focus();
                            }
                          }
                        }}
                      />
                    </td>

                    <td>
                      <TextField
                        variant="outlined"
                        autoComplete="off"
                        id="outlined-number"
                        type="number"
                        disabled
                        size="small"
                        placeholder="0.00"
                        value={ItemTotalAmount ? Number(ItemTotalAmount).toFixed(2) : "0.00"}
                        sx={{
                          minWidth: "65px",
                          width: "100%",
                          '& .MuiInputBase-input': {
                            textAlign: 'center',
                          },
                        }}
                      />
                    </td>
                  </tr>

                  {/*<======================================================================Added Items Rows =====================================================================> */}

                  {isLoading ? (
                    <tr>
                      <td colSpan={15} style={{ padding: "20px" }}>
                        <div className="loader-container">
                          <Loader />
                        </div>
                      </td>
                    </tr>
                  ) : (tableData?.item_list?.map((item, index) => (
                    <tr
                      key={item.id}
                      onClick={() => {
                        setSelectedIndex(index);
                        handleEditClick(item);
                      }}
                      className={`item-List cursor-pointer ${index === selectedIndex ? "highlighted-row" : ""}`
                      }
                      style={{ borderBottom: index !== tableData.item_list.length - 1 ? '1px solid #e0e0e0' : 'none', }}>

                      <td style={{ display: "flex", gap: "5px", textAlign: "left", verticalAlign: "left" }}>
                        <div>

                          <Checkbox
                            sx={{
                              color: "var(--color2)",
                              "&.Mui-checked": { color: "var(--color1)" },
                              margin: 0,
                              padding: 0
                            }}
                            checked={item?.iss_check}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => handleChecked(item.id, e.target.checked)}
                          />
                          <BorderColorIcon style={{ color: "var(--color1)" }} />
                          <DeleteIcon style={{ color: "var(--color6)" }}
                            className="delete-icon bg-none" onClick={() => deleteOpen(item.id)} />
                        </div>

                        <span style={{ alignSelf: "center" }}>
                          {item.item_name ? item.item_name : "-"}
                        </span>
                      </td>
                      <td style={{ textAlign: "center", verticalAlign: "middle" }}>{item.weightage ? item.weightage : "-"}</td>
                      <td style={{ textAlign: "center", verticalAlign: "middle" }}>{item.batch_number ? item.batch_number : "-"}</td>
                      <td style={{ textAlign: "center", verticalAlign: "middle" }}>{item.expiry ? item.expiry : "-"}</td>
                      <td style={{ textAlign: "center", verticalAlign: "middle" }}>{item.mrp ? item.mrp : "-"}</td>
                      <td style={{ textAlign: "center", verticalAlign: "middle" }}>{item.total_stock ? item.total_stock : "-"}</td>
                      <td style={{ textAlign: "center", verticalAlign: "middle" }}>{item.fr_qty ? item.fr_qty : "-"}</td>
                      <td style={{ textAlign: "center", verticalAlign: "middle" }}>{item.ptr ? item.ptr : "-"}</td>
                      <td style={{ textAlign: "center", verticalAlign: "middle" }}>{item.disocunt ? item.disocunt : "-"}</td>
                      <td style={{ textAlign: "center", verticalAlign: "middle" }}>{item.gst_name ? item.gst_name : "-"}</td>
                      <td style={{ textAlign: "center", verticalAlign: "middle" }}>{item.location ? item.location : "-"}</td>
                      <td className="total" style={{ fontWeight: "bold", textAlign: "center", verticalAlign: "middle" }}>{item.amount ? item.amount : "-"}</td>
                    </tr>
                  )))}

                </tbody>
              </table>

            </div>
            {/*<========================================================= total and other details  ========================================================> */}

            <div
              className=""
              style={{
                background: "var(--color1)",
                color: "white",
                display: "flex",
                justifyContent: "space-between",
                position: "fixed",
                width: "100%",
                bottom: "0",
                left: "0",
                overflow: "auto",
              }}
            >
              <div
                className=""
                style={{
                  display: "flex",
                  gap: "40px",
                  whiteSpace: "nowrap",
                  left: "0",
                  padding: "20px",
                }}
              >
                <div
                  className="gap-2 invoice_total_fld"
                  style={{ display: "flex" }}
                >
                  <label className="font-bold">Total GST : </label>

                  <span style={{ fontWeight: 600 }}>{totalGST ? totalGST : 0} </span>
                </div>
                <div
                  className="gap-2 invoice_total_fld"
                  style={{ display: "flex" }}
                >
                  <label className="font-bold">Total Qty : </label>
                  <span style={{ fontWeight: 600 }}> {totalQty ? totalQty : 0}</span>
                </div>
                <div
                  className="gap-2 invoice_total_fld"
                  style={{ display: "flex" }}
                >
                  <label className="font-bold">Net Rate : </label>
                  <span style={{ fontWeight: 600 }}>{totalNetRate ? totalNetRate : 0}</span>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  padding: "0 20px",
                  whiteSpace: "noWrap",
                }}
              >
                <div
                  className="gap-2 "
                  onClick={() => {
                    setIsModalOpen(!isModalOpen);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <label className="font-bold">Net Amount : </label>
                  <span
                    className="gap-1"
                    style={{
                      fontWeight: 800,
                      fontSize: "22px",
                      whiteSpace: "nowrap",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {!netAmount ? 0 : netAmount}
                    <FaCaretUp />
                  </span>
                </div>

                <Modal
                  show={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  size="md"
                  position="bottom-center"
                  className="modal_amount"
                >
                  {/* ── Header ── */}
                  <div style={{
                    background: "linear-gradient(135deg, var(--COLOR_UI_PHARMACY) 0%, var(--color2, #2d6a2d) 100%)",
                    color: "white",
                    padding: "18px 24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: "8px 8px 0 0",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: "50%",
                        background: "rgba(255,255,255,0.2)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}><ReceiptLongIcon style={{ fontSize: 20 }} /></div>
                      <div>
                        <div style={{ fontSize: 11, opacity: 0.8, letterSpacing: 1.5, textTransform: "uppercase" }}>Purchase Return</div>
                        <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: 0.5 }}>Invoice Summary</div>
                      </div>
                    </div>
                    <div
                      onClick={() => setIsModalOpen(false)}
                      style={{
                        cursor: "pointer", width: 32, height: 32, borderRadius: "50%",
                        background: "rgba(255,255,255,0.15)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "background 0.2s",
                      }}
                    >
                      <IoMdClose size={20} />
                    </div>
                  </div>

                  {/* ── Body ── */}
                  <div style={{
                    background: "#f8fafc",
                    padding: "20px 24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 0,
                  }}>

                    {[
                      {
                        label: "Total Amount",
                        icon: <Inventory2Icon style={{ fontSize: 18, color: "var(--COLOR_UI_PHARMACY)" }} />,
                        value: <span style={{ fontWeight: 600, color: "#1e293b" }}>{totalAmount ? totalAmount : 0}</span>,
                      },
                      {
                        label: "Other Amount",
                        icon: <AddCircleOutlineIcon style={{ fontSize: 18, color: "#0ea5e9" }} />,
                        value: (
                          <Input
                            type="number"
                            value={otherAmount}
                            onChange={handleOtherAmount}
                            size="small"
                            style={{ width: "80px", background: "none", outline: "none" }}
                            sx={{
                              "& .MuiInputBase-root": { height: "32px" },
                              "& .MuiInputBase-input": { textAlign: "end", fontWeight: 600 },
                              "& .MuiInput-underline:before": { borderBottomColor: "var(--COLOR_UI_PHARMACY)" },
                            }}
                          />
                        ),
                      },
                      {
                        label: "Total Net Rate",
                        icon: <TrendingDownIcon style={{ fontSize: 18, color: "#e53e3e" }} />,
                        value: <span style={{ fontWeight: 600, color: "#e53e3e" }}>{totalNetRate}</span>,
                      },
                      {
                        label: "Round Off",
                        icon: <SyncAltIcon style={{ fontSize: 18, color: "#64748b" }} />,
                        value: (
                          <span style={{ fontWeight: 600, color: "#64748b" }}>
                            {roundOff === "0.00"
                              ? roundOff
                              : roundOff < 0.49
                                ? `- ${roundOff}`
                                : `${parseFloat(1 - roundOff).toFixed(2)}`}
                          </span>
                        ),
                        divider: true,
                      },
                    ].map((row, i) => (
                      <div key={i}>
                        {row.divider && (
                          <div style={{ borderTop: "1px dashed #cbd5e1", margin: "4px 0" }} />
                        )}
                        <div style={{
                          display: "flex", justifyContent: "space-between", alignItems: "center",
                          padding: "10px 14px",
                          background: i % 2 === 0 ? "#ffffff" : "#f1f5f9",
                          borderRadius: 8,
                          marginBottom: 6,
                          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#475569", fontWeight: 600, fontSize: 14 }}>
                            {row.icon}
                            {row.label}
                          </div>
                          {row.value}
                        </div>
                      </div>
                    ))}

                    {/* Net Amount highlighted block */}
                    <div style={{
                      marginTop: 10,
                      background: "linear-gradient(135deg, var(--COLOR_UI_PHARMACY) 0%, var(--color2, #2d6a2d) 100%)",
                      borderRadius: 12,
                      padding: "16px 20px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
                    }}>
                      <div style={{ color: "rgba(255,255,255,0.85)", fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
                        <CurrencyRupeeIcon style={{ fontSize: 18 }} /> Net Amount Payable
                      </div>
                      <div style={{
                        color: "white",
                        fontWeight: 800,
                        fontSize: 24,
                        letterSpacing: 0.5,
                        display: "flex", alignItems: "baseline", gap: 2,
                      }}>
                        <span style={{ fontSize: 16, fontWeight: 600, opacity: 0.9 }}>₹</span>
                        {!netAmount ? "0.00" : Number(netAmount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                </Modal>
              </div>
            </div>

          </div>


          <Dialog open={open}>
            <DialogContent style={{ fontSize: "20px" }}>
              <h2>Please select Return Type.</h2>
            </DialogContent>
            <DialogActions
              style={{ display: "flex", justifyContent: "space-around" }}
            >
              <Button onClick={() => setOpen(false)} variant="contained">
                OK !
              </Button>
            </DialogActions>
          </Dialog>

          {/*<=============================================================  Delete PopUP   ============================================================> */}
          <Dialog open={IsDelete} className="custom-dialog">
            <DialogTitle className="primary">Delete Confirmation</DialogTitle>
            <IconButton
              aria-label="close"
              onClick={() => setIsDelete(false)}
              sx={{ position: "absolute", right: 8, top: 8, color: "#ffffff" }}
            >
              <IoMdClose />
            </IconButton>
            <DialogContent>
              <div className="my-4 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-12 fill-red-500 inline" viewBox="0 0 24 24">
                  <path d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z" />
                  <path d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z" />
                </svg>
                <h4 className="text-lg font-semibold mt-6">Are you sure you want to delete it?</h4>
              </div>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center", gap: 2 }}>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleDeleteItem(ItemId)}
                sx={{ minWidth: 120 }}
              >
                Delete
              </Button>
              <Button
                variant="contained"
                color="inherit"
                onClick={() => setIsDelete(false)}
                sx={{ minWidth: 120 }}
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>

          {/*<========================================================= Leave page  PopUp Box  ========================================================> */}
          <Prompt
            when={unsavedItems}
            message={(location) => {
              handleNavigation(location.pathname);
              return false;
            }}
          />

          <div
            id="modal"
            value={isOpenBox}
            className={`fixed first-letter:uppercase inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif] ${isOpenBox ? "block" : "hidden"
              }`}
          >
            <div />
            <div className="w-full max-w-md bg-white shadow-lg rounded-md p-4 relative">
              <div className="my-4 logout-icon">
                <VscDebugStepBack
                  className="h-12 w-14"
                  style={{ color: "#628A2F" }}
                />
                <h4 className=" font-semibold mt-6 text-center">
                  <span style={{ textTransform: "none" }}>
                    Are you sure you want to leave this page?
                  </span>
                </h4>
              </div>
              <div className="flex gap-5 justify-center">
                <button
                  type="submit"
                  className="px-6 py-2.5 w-44 items-center rounded-md text-white text-sm font-semibold border-none outline-none primary-bg hover:primary-bg active:primary-bg"
                  onClick={handleLeavePage}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className="px-6 py-2.5 w-44 rounded-md text-black text-sm font-semibold border-none outline-none bg-gray-200 hover:bg-gray-400 hover:text-black"
                  onClick={LogoutClose}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
          {showModal && (
            <TipsModal
              id="add-purchase"
              onClose={() => setShowModal(false)}
            />
          )}
        </div>
      </>

    </>
  );
};
export default AddReturnbill;
