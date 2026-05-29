import React, { useState, useRef, useEffect } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import Autocomplete from "@mui/material/Autocomplete";
import {
  Button,
  CircularProgress,
  Input,
  InputAdornment,
  ListItem,
  ListItemText,
  OutlinedInput,
  TextField,
  Tooltip,
} from "@mui/material";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import SaveIcon from "@mui/icons-material/Save";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { FaPlusCircle } from "react-icons/fa";
import { MenuItem, Select } from "@mui/material";
import { BsLightbulbFill } from "react-icons/bs";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import Header from "../../../Header";
import DatePicker from "react-datepicker";
import { addDays, format, subDays } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { toast, ToastContainer } from "react-toastify";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { FaUserAlt } from "react-icons/fa";
import { IoCaretDown } from "react-icons/io5";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  FormControl,
  InputLabel,
} from "@mui/material";

import { Prompt } from "react-router-dom/cjs/react-router-dom";
import { VscDebugStepBack } from "react-icons/vsc";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { Modal } from "flowbite-react";
import { FaCaretUp } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import TipsModal from "../../../../componets/Tips/TipsModal";
import Loader from "../../../../componets/loader/Loader";

const AddPurchaseBill = () => {
  const timeoutRef = useRef(null);
  const [ItemPurchaseList, setItemPurchaseList] = useState({ item: [] });
  const [totalNetRate, setTotalNetRate] = useState(0);
  const [totalBase, setTotalBase] = useState(0);
  const [totalFree, setTotalFRee] = useState(0);
  const [totalGst, setTotalGst] = useState(0);
  const [totalQty, setTotalQty] = useState(0);
  const [searchItem, setSearchItem] = useState("");
  const [itemList, setItemList] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [distributor, setDistributor] = useState(null);
  const [billNo, setbillNo] = useState("");
  const [dueDate, setDueDate] = useState(addDays(new Date(), 15));
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [randomNumber, setRandomNumber] = useState(null);
  const [srNo, setSrNo] = useState();
  const history = useHistory();
  const token = localStorage.getItem("token");
  const [expiryDate, setExpiryDate] = useState("");
  const [mrp, setMRP] = useState(null);
  const [ptr, setPTR] = useState(null);
  const [qty, setQty] = useState("");
  const [value, setValue] = useState("");
  const [deleteAll, setDeleteAll] = useState(false);
  const [free, setFree] = useState("");
  const [loc, setLoc] = useState("");
  const [unit, setUnit] = useState("");
  const [schAmt, setSchAmt] = useState("");
  const [ItemTotalAmount, setItemTotalAmount] = useState(0);
  const [margin, setMargin] = useState("");
  const [disc, setDisc] = useState("");
  const [base, setBase] = useState("");
  const [gst, setGst] = useState("");
  const [batch, setBatch] = useState("");
  const [HSN, setHSN] = useState("");
  const [otherAmt, setOtherAmt] = useState("");
  const [gstList, setGstList] = useState([]);
  const userId = localStorage.getItem("userId");
  const [barcode, setBarcode] = useState("");
  const [netRate, setNetRate] = useState("");
  const [IsDelete, setIsDelete] = useState(false);
  const [ItemId, setItemId] = useState(0);
  const [autoCompleteOpen, setAutoCompleteOpen] = useState(false);
  const [isAutocompleteDisabled, setAutocompleteDisabled] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedEditItemId, setSelectedEditItemId] = useState(0);
  const [selectedEditItem, setSelectedEditItem] = useState(null);
  const [unitEditID, setUnitEditID] = useState(0);
  const [itemEditID, setItemEditID] = useState(0);
  const [distributorList, setDistributorList] = useState([]);
  const [batchListData, setBatchListData] = useState([]);
  const [openAddPopUp, setOpenAddPopUp] = useState(false);
  const [openAddItemPopUp, setOpenAddItemPopUp] = useState(false);
  const [openAddDistributorPopUp, setOpenAddDistributorPopUp] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [purchaseReturnPending, setPurchaseReturnPending] = useState([]);
  const [finalPurchaseReturnList, setFinalPurchaseReturnList] = useState([]);
  const [cnTotalAmount, setCnTotalAmount] = useState({});
  const [netAmount, setNetAmount] = useState(0);
  const [finalTotalAmount, setFinalTotalAmount] = useState(0);
  const [cnAmount, setCnAmount] = useState(0);
  const [roundOffAmount, setRoundOffAmount] = useState(0);
  const [finalCnAmount, setFinalCnAmount] = useState(0);
  const [isOpenBox, setIsOpenBox] = useState(false);
  const [nextPath, setNextPath] = useState("");
  const [unsavedItems, setUnsavedItems] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [addItemName, setAddItemName] = useState("");
  const [addBarcode, setAddBarcode] = useState("");
  const [addUnit, setAddUnit] = useState("");
  const [barcodeBatch, setBarcodeBatch] = useState("");
  const selectedDistributorRef = useRef(null);
  const [addDistributorName, setAddDistributorName] = useState("");
  const [addDistributorNo, setAddDistributorNo] = useState("");
  const [addDistributorMobile, setAddDistributorMobile] = useState("");
  const [addDistributorAddress, setAddDistributorAddress] = useState("");
  const [highlightedRowId, setHighlightedRowId] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [autocompleteKey, setAutocompleteKey] = useState(0);
  const [focusedField, setFocusedField] = useState("distributor");
  const [openFile, setOpenFile] = useState(false);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [billSaveDraft, setBillSaveDraft] = useState("1");
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitTimeout, setSubmitTimeout] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [dialogMode, setDialogMode] = useState("");

  const optionForCsv = {
    "Skyway": "purchase-item-import",
    "Pharma Byte": "pharmabyte-item-import",
    "Marg ERP": "mahalaxmi-item-import",
    "Techno Max": "techno-item-import",
  };
  const optionForStock = {
    "Visual": "visual-item-purchase-import",
  };

  const [error, setError] = useState({});
  const [paymentType, setPaymentType] = useState("credit");
  const [bankData, setBankData] = useState([]);
  const [id, setId] = useState(null);
  const [importConpany, setImportConpany] = useState("");


  let defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 3);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const [itemHistoryData, setItemHistoryData] = useState(null);
  const [openItemHistory, setOpenItemHistory] = useState(false);

  /*<================================================================== Input ref on keydown enter =========================================================> */

  const [selectedIndex, setSelectedIndex] = useState(-1); // Index of selected row
  const tableRef = useRef(null); // Reference for table container
  const inputRefs = useRef([]);
  const submitButtonRef = useRef(null);
  const addButtonref = useRef(null);
  /*<=================================================== disable autocomplete to focus when tableref is focused  ==========================================> */

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

  /*<=================================================== disable autocomplete to focus when tableref is focused  ==========================================> */

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!ItemPurchaseList?.item?.length) return; // Prevent error if list is empty

      const key = e.key;

      // Check if any input field inside inputRefs is focused
      const isInputFocused = inputRefs.current.some(
        (input) => input && document.activeElement === input
      );

      if (isInputFocused) return; // Prevent key navigation when an input is focused

      if (key === "ArrowDown") {
        // Move selection down
        setSelectedIndex((prev) =>
          prev < ItemPurchaseList.item.length - 1 ? prev + 1 : prev
        );
        setAutoCompleteOpen(false)
      } else if (key === "ArrowUp") {
        // Move selection up
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        setAutoCompleteOpen(false)

      } else if (key === "Enter" && selectedIndex !== -1) {
        if (!isInputFocused) {
          const selectedRow = ItemPurchaseList.item[selectedIndex];
          if (!selectedRow) return;

          setSelectedEditItemId(selectedRow.id);
          handleEditClick(selectedRow);

          // Delay focusing the Unit input to wait for render
          setTimeout(() => {
            if (inputRefs.current[3]) {
              inputRefs.current[3].focus();
            }
          }, 100); // 100ms delay ensures re-render completes
        }
      }

    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [selectedIndex, ItemPurchaseList]);

  /*<=================================================================== handle shortcut  ==========================================================> */

  useEffect(() => {
    const handleKeyDown = (event) => {
      const isAltCombo = event.altKey || event.getModifierState("AltGraph");

      if (!isAltCombo || event.repeat) return;

      const key = event.key.toLowerCase();

      event.preventDefault();

      switch (key) {
        case "s":
          if (isSubmitting) return;
          setBillSaveDraft("1");
          handleSubmit("1");
          break;
        case "g":
          handleSubmit();
          break;
        case "m":
          removeItem();
          setSelectedEditItemId(null);
          setSelectedIndex(-1);

          setSearchItem("");
          setValue("");
          setTimeout(() => {
            inputRefs.current[2]?.focus();
          }, 10);
          break;

      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [distributor, billNo, ItemPurchaseList, isSubmitting]);

  const handleKeyDown = (event, index) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission

      const nextInput = inputRefs?.current[index + 1];
      if (nextInput) {
        nextInput?.focus(); // Move to next input
      }
    }
  };
  /*<===================================================================== handle popup ============================================================> */

  useEffect(() => {
    if (openAddItemPopUp) {
      setTimeout(() => {
        if (inputRefs.current[13]) {
          inputRefs.current[13].focus();
        }
      }, 100); // Adjust delay if necessary
    }
  }, [openAddItemPopUp]);

  useEffect(() => {
    return () => {
      if (submitTimeout) {
        clearTimeout(submitTimeout);
      }
    };
  }, [submitTimeout]);

  /*<================================================================= Search Item Debouncing ========================================================> */

  useEffect(() => {
    const SearchTimer = setTimeout(() => {
      if (searchItem) {
        setPage(1);
        setHasMore(true);
        handleSearch(searchItem.toUpperCase(), 1);
      } else {
        setItemList([]);
        setPage(1);
        setHasMore(true);
      }
    }, 500);

    return () => clearTimeout(SearchTimer);
  }, [searchItem]);

  useEffect(() => {
    if (page > 1 && searchItem) {
      handleSearch(searchItem.toUpperCase(), page);
    }
  }, [page]);

  /*<================================================================= PTR and MRP validation ========================================================> */

  useEffect(() => {
    const newErrors = {};

    if (
      ptr !== null &&
      mrp !== null &&
      ptr !== "" &&
      mrp !== "" &&
      !isNaN(ptr) &&
      !isNaN(mrp)
    ) {
      if (Number(ptr) >= Number(mrp)) {
        newErrors.ptr = "PTR must be less than MRP";
        toast.dismiss();
        toast.error(newErrors.ptr);
      }
    }

    setError(newErrors);
  }, [ptr, mrp]);

  /*<================================================== Clear old purchase item if user leave the browswer ==========================================> */

  useEffect(() => {
    generateRandomNumber();
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

  /*<====================================== handle add item using barcode function if add value in barcode field ==================================> */

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      generateRandomNumber();

      handleBarcode();
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [barcode]);

  /*<============================================================ get essential details intially ==================================================> */

  useEffect(() => {
    if (id) {
      batchList(id);
    }

    setSrNo(localStorage.getItem("Purchase_SrNo"));
  }, [id]);

  useEffect(() => {
    // listOfGst();
    BankList();
    listDistributor();


  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (addDistributorName) {
        listDistributor({ search_name: addDistributorName });
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [addDistributorName]);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (addDistributorNo) {
        listDistributor({ search_gst: addDistributorNo });
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [addDistributorNo]);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (addDistributorMobile) {
        listDistributor({ search_phone_number: addDistributorMobile });
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [addDistributorMobile]);

  /*<============================================================= Clear old purchase item data =====================================================> */

  useEffect(() => {
    if (localStorage.getItem("RandomNumber") !== null) {
      if (deleteAll == false) {
        handlePopState();
      }
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  /*<================================================================== calculation ==========================================================> */

  useEffect(() => {
    /*<========================================================================== Calculate discount ===============================================================================> */

    const totalSchAmt = parseFloat((((ptr * disc) / 100) * qty).toFixed(2));
    setSchAmt(totalSchAmt);

    /*<========================================================================= Calculate totalBase ==============================================================================> */

    const totalBase = parseFloat((ptr * qty - totalSchAmt).toFixed(2));
    setItemTotalAmount(0);
    setBase(totalBase);

    /*<=========================================================================== Calculate totalAmount ============================================================================> */

    const totalAmount = parseFloat(
      (totalBase + (totalBase * gst) / 100).toFixed(2)
    );
    if (totalAmount) {
      setItemTotalAmount(totalAmount);
    } else {
      setItemTotalAmount(0);
    }

    /*<===================================================================================== Net Rate calculation ==================================================================> */

    const numericQty = parseFloat(qty) || 0;
    const numericFree = parseFloat(free) || 0;
    const netRate = parseFloat(
      (totalAmount / (numericQty + numericFree)).toFixed(2)
    );
    setNetRate(netRate);

    /*<================================================================================= Margin calculation =========================================================================> */

    const Margin = parseFloat((((mrp - netRate) / mrp) * 100).toFixed(2));
    setMargin(Margin);
  }, [qty, ptr, disc, mrp, gst, free, ItemTotalAmount, barcodeBatch]);

  /*<=============================================================== CN calculation realtime =========================================================> */

  useEffect(() => {
    const total = Object.values(cnTotalAmount)
      .map((amount) => parseFloat(amount) || 0)
      .reduce((acc, amount) => acc + amount, 0);
    setCnAmount(total);
  }, [cnTotalAmount]);

  /*<================================================================= get bank list ==============================================================> */

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
      if (error.response.status === 401) {
        setUnsavedItems(false);

        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      
      }
    }
  };

  /*<============================================================= expiry date validation ==========================================================> */

  const handleExpiryDate = (event) => {
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

  /*<================================================================ select file to upload ========================================================> */

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileType = selectedFile.type;

      // Allowed MIME types
      const allowedTypes = [
        "text/csv",
        "application/vnd.ms-excel",                     // .xls
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" // .xlsx
      ];

      if (allowedTypes.includes(fileType)) {
        setFile(selectedFile);
      } else {
        toast.dismiss();
        toast.error("Please select a valid Excel (.xls/.xlsx) or CSV file.");
      }
    }
  };

  /*<============================================================ upload selected file ================================================> */

  const handleFileUpload = async () => {
    generateRandomNumber();
    if (!file) {
      toast.dismiss();
      toast.error("No file selected");
      return;
    }

    let apiEndpoint = "";

    if (dialogMode === "csv") {
      apiEndpoint = optionForCsv[importConpany];
    } else if (dialogMode === "stock") {
      apiEndpoint = optionForStock[importConpany];
    }
    if (!apiEndpoint) {
      toast.dismiss();
      toast.error("Invalid option selected");
      return;
    }

    let data = new FormData();
    data.append("file", file);
    data.append("random_number", localStorage.getItem("RandomNumber"));
    data.append("distributor_id", distributor ? distributor.id : "");
    setIsLoading(true);
    setOpenFile(false);

    try {
      const response = await axios.post(apiEndpoint, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response?.data?.status === 200) {
        toast.dismiss();
        toast.success(response?.data?.message);
        setUnsavedItems(true);
      }
      itemPurchaseList();
      setTimeout(() => {
        inputRefs.current[2]?.focus();
      }, 100);
    } catch (error) {
      console.error("API error:", error);
      if (error.response?.data?.status === 400) {
        toast.dismiss();
        const messages = error.response.data.message;

        if (Array.isArray(messages)) {
          messages.forEach(msg => toast.error(msg));
        } else {
          toast.error(messages);
        }

      } else {
        toast.dismiss();
        toast.error(error?.message || "Something went wrong. Please try again.");
      }
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

  /*<============================================================= download selected file ==========================================================> */

  const handleDownload = () => {
    let fileName = "";
    let filePath = "";

    switch (importConpany) {
      case "Visual":
        fileName = "Visual.xls";
        filePath = "/Visual.xls";
        break;
      case "Skyway":
        fileName = "Skyway.csv";
        filePath = "/Skyway.csv";
        break;
      case "Pharma Byte":
        fileName = "Pharma Byte.csv";
        filePath = "/Pharma Byte.csv";
        break;
      case "Marg ERP":
        fileName = "Marg ERP.csv";
        filePath = "/Marg ERP.csv";
        break;
      case "Techno Max":
        fileName = "Techno Max.csv";
        filePath = "/Techno Max.csv";
        break;
      default:
        console.warn("Unknown company selected. Downloading default file.");
        toast.dismiss();
        toast.error("Unknown company selected. Downloading default file.");
        break;
    }

    const link = document.createElement("a");
    link.href = filePath;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /*<============================================================= barcode functionality ==========================================================> */

  /*<=========================================================================== get barcode batch list ========================================================================> */

  const handleBarcode = async () => {
    setIsEditMode(false);
    if (!barcode) {
      return;
    }

    try {
      const response = await axios.post(
        "barcode-batch-list?",
        { barcode: barcode },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status !== 200) {
        return;
      }

      // Rest of your existing code for handleBarcodeItem...
      setTimeout(() => {
        const handleBarcodeItem = async () => {
          setUnsavedItems(true);
          let data = new FormData();

          data.append(
            "random_number",
            localStorage.getItem("RandomNumber")
          );
          data.append(
            "weightage",
            Number(response?.data?.data[0]?.batch_list[0]?.unit) || 1
          );
          data.append(
            "batch_number",
            response?.data?.data[0]?.batch_list[0]?.batch_name
              ? response?.data?.data[0]?.batch_list[0]?.batch_name
              : 0
          );
          data.append(
            "expiry",
            response?.data?.data[0]?.batch_list[0]?.expiry_date
          );
          data.append(
            "mrp",
            Number(response?.data?.data[0]?.batch_list[0]?.mrp)
              ? Number(response?.data?.data[0]?.batch_list[0]?.mrp)
              : 0
          );
          data.append(
            "qty",
            Number(response?.data?.data[0]?.batch_list[0]?.unit)
              ? Number(response?.data?.data[0]?.batch_list[0]?.unit)
              : 0
          );
          data.append(
            "free_qty",
            Number(
              response?.data?.data[0]?.batch_list[0]?.purchase_free_qty
            )
              ? Number(
                response?.data?.data[0]?.batch_list[0]?.purchase_free_qty
              )
              : 0
          );
          data.append(
            "ptr",
            Number(response?.data?.data[0]?.batch_list[0]?.ptr)
              ? Number(response?.data?.data[0]?.batch_list[0]?.ptr)
              : 0
          );
          data.append(
            "discount",
            Number(response?.data?.data[0]?.batch_list[0]?.discount)
              ? Number(
                response?.data?.data[0]?.batch_list[0]?.scheme_account
              )
              : 0
          );
          data.append(
            "scheme_account",
            Number(response?.data?.data[0]?.batch_list[0]?.scheme_account)
              ? Number(
                response?.data?.data[0]?.batch_list[0]?.scheme_account
              )
              : 0
          );
          data.append(
            "base_price",
            Number(response?.data?.data[0]?.batch_list[0]?.base)
              ? Number(response?.data?.data[0]?.batch_list[0]?.base)
              : 0
          );
          const gstMapping = { 28: 6, 18: 4, 12: 3, 5: 2, 0: -1 };
          const gstValue = Number(
            response?.data?.data[0]?.batch_list[0]?.gst
          );
          data.append("gst", gstMapping[gstValue] ?? gstValue);

          data.append(
            "location",
            response?.data?.data[0]?.batch_list[0]?.location
              ? response?.data?.data[0]?.batch_list[0]?.location
              : 0
          );
          data.append(
            "margin",
            Number(response?.data?.data[0]?.batch_list[0]?.margin)
              ? Number(response?.data?.data[0]?.batch_list[0]?.margin)
              : 0
          );
          data.append(
            "net_rate",
            Number(response?.data?.data[0]?.batch_list[0]?.net_rate)
              ? Number(response?.data?.data[0]?.batch_list[0]?.net_rate)
              : 0
          );

          data.append(
            "item_id",
            Number(response?.data?.data[0]?.batch_list[0]?.item_id)
              ? Number(response?.data?.data[0]?.batch_list[0]?.item_id)
              : 0
          );
          data.append("unit", Number(1) || 1);
          data.append("user_id", userId);

          data.append(
            "id",
            Number(response?.data?.data[0]?.batch_list[0]?.item_id)
              ? Number(response?.data?.data[0]?.batch_list[0]?.item_id)
              : 0
          );

          data.append(
            "total_amount",
            Number(response?.data?.data[0]?.batch_list[0]?.total_amount)
              ? Number(response?.data?.data[0]?.batch_list[0]?.total_amount)
              : 0
          );

          const params = {
            id: selectedEditItemId,
          };
          /*<======================================================================= call add item api to add barcode item  ================================================================> */

          try {
            const response = await axios.post("item-purchase", data, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setItemTotalAmount(0);
            setDeleteAll(true);
            itemPurchaseList();
            setUnit("");
            setBatch("");
            setHSN("");
            setExpiryDate("");
            setMRP("");
            setQty("");
            setFree("");
            setPTR("");
            setGst("");
            setDisc("");
            setBase("");
            setNetRate("");
            setSchAmt("");
            setMargin("");
            setLoc("");
            setIsEditMode(false);
            setSelectedEditItemId(null);
            setBarcode("");
            setValue("");
            setValue("");
            setSearchItem("");

            if (ItemTotalAmount <= finalCnAmount) {
              setFinalCnAmount(0);
              setSelectedRows([]);
              setCnTotalAmount({});
            }
          } catch (error) {
            setUnsavedItems(false);
               if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
          }
        };
        handleBarcodeItem();
      }, 100);

    } catch (error) {
      console.error("Barcode API error:", error);
      // Optionally show user-friendly message
      if (error.response?.status === 400) {
        toast.error(error.response?.data?.message || "This barcode has no items");
      }
         if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
      setUnsavedItems(false);
    }
  };

  /*<=========================================================== delete purchase item data   ====================================================> */

  const handlePopState = () => {

    if (!randomNumber) return;
    let data = new FormData();
    data.append("random_number", randomNumber);
    const params = {
      random_number: localStorage.getItem("RandomNumber"),
    };
    try {
      const res = axios
        .post("item-purchase-delete-all?", data, {
          params: params,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          itemPurchaseList();
          localStorage.removeItem("RandomNumber");
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
      setUnsavedItems(false);
    }
  };

  /*<============================================================= Generate random number   =====================================================> */

  const generateRandomNumber = () => {
    if (localStorage.getItem("RandomNumber") == null) {
      const number = Math.floor(Math.random() * 100000) + 1;
      setRandomNumber(number);
      localStorage.setItem("RandomNumber", number);
    } else {
      return;
    }
  };

  /*<=================================================================== Get GST List   ====================================================================> */

  // let listOfGst = () => {
  //   axios
  //     .get("gst-list", {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //     .then((response) => {
  //       setGstList(response.data.data);
  //       // gstList.filer((gst) =>(
  //       //   return age >= 18;
  //       // )
  //     })
  //     .catch((error) => {
  //       setUnsavedItems(false);
  //     });
  // };

  /*<================================================================ Get Distributor List   =================================================================> */

  const listDistributor = (searchPayload = {}) => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    if (Object.keys(searchPayload).length > 0) {
      axios
        .post("list-distributer", searchPayload, { headers })
        .then((response) => {
          const list = response.data.data?.distributor || response.data.data || [];
          setDistributorList(list);
        })
        .catch((error) => {
          console.error("Search failed", error);
          setUnsavedItems(false);
             if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
        });
    } else {
      axios
        .get("list-distributer", { headers })
        .then((response) => {
          const list = response.data.data?.distributor || response.data.data || [];
          localStorage.setItem("distributor", JSON.stringify(list));
          setDistributorList(list);
        })
        .catch((error) => {
             if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
          console.error("Fetch failed", error);
          setUnsavedItems(false);
        });
    }
  };


  /*<=============================================================== Get Item purchase List   ================================================================> */

  const itemPurchaseList = async () => {
    let data = new FormData();
    data.append("random_number", localStorage.getItem("RandomNumber"));

    setIsLoading(true);
    setLoading(true)

    try {
      const response = await axios
        .post("item-purchase-list?", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setItemPurchaseList(response.data.data);
          setFinalTotalAmount(response.data.data.new_total_price);
          setTotalGst(response.data.data.total_gst);
          setTotalQty(response.data.data.total_qty);
          setTotalNetRate(response.data.data.total_net_rate);
          handleCalNetAmount(response.data.data.new_total_price);
          setTotalBase(response.data.data.total_base);
          setTotalFRee(response.data.data.total_free);
        });
    } catch (error) {
         if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
      console.error("API error:", error);
      setUnsavedItems(false);
    } finally {
      setIsLoading(false);
      setLoading(false)

    }
  };

  /*<============================================================= disable to select date of past  ========================================================> */

  const isDateDisabled = (date) => {
    const today = new Date();
    // Set time to 00:00:00 to compare only date part--------------------------
    today.setHours(0, 0, 0, 0);
    // Disable dates that are greater than today-------------------------------------
    return date > today;
  };

  /*<=================================================================== delete added  item  ==============================================================> */

  const deleteOpen = (Id) => {
    removeItem();
    setIsDelete(true);
    setItemId(Id);
  };

  /*<================================================================= get batch list to select item while add  ============================================================> */

  const batchList = async () => {
    let data = new FormData();
    data.append("iteam_id", id);
    const params = {
      iteam_id: id,
    };
    try {
      const res = await axios
        .post("batch-list?", data, {
          params: params,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response?.data?.alternative_item_check) {
            return;
          }
          const batchData = response.data.data;
          setBatchListData(response.data.data);
          if (batchData.length > 0) {
            setUnit(batchData[0].unit);
            setBatch(batchData[0].batch_name);
            setHSN(batchData[0].HSN);
            setExpiryDate(batchData[0].expiry_date);
            setMRP(batchData[0].mrp);
            setQty(batchData[0].purchase_qty);
            setFree(batchData[0].purchase_free_qty);
            setPTR(batchData[0].ptr);
            setDisc(batchData[0].discount);
            setLoc(batchData[0].location.toUpperCase());
            setGst(batchData[0].gst_name);
            // setUnit()
          } else {
            setUnit("");
            setBatch("");
            setHSN("");
            setExpiryDate("");
            setMRP("");
            setQty("");
            setFree("");
            setPTR("");
            setDisc("");
            setLoc("");
            setGst("");
          }
        });
    } catch (error) {
         if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
      console.error("API error:", error);
      setUnsavedItems(false);
    }
  };

  /*<========================================================================= Add and Edit validation  ====================================================================> */

  const handleAddButtonClick = async () => {
    // Prevent multiple submissions
    setFocusedField("item");
    setAutocompleteKey((prevKey) => prevKey + 1); // Re-render item Autocomplete

    generateRandomNumber();
    const newErrors = {};
    const expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    const numericQty = parseFloat(qty) || 0;
    const numericFree = parseFloat(free) || 0;

    if (numericQty === 0 && numericFree === 0) {
      toast.dismiss();
      toast.error("Free and Qty cannot both be 0");
      newErrors.qty = "Free and Qty cannot both be 0";
    }
    if (!unit) newErrors.unit = "Unit is required";

    if (
      (!numericFree || Number(numericFree) === 0) &&
      (!numericQty || Number(numericQty) === 0)
    ) {
      newErrors.quantity = "Qty is required";
    }

    if (!batch) {
      newErrors.batch = "Batch is required";
      toast.dismiss();
      toast.error(newErrors.batch);
    }
    if (!expiryDate) {
      newErrors.expiryDate = "Expiry date is required";
      toast.dismiss();
      toast.error(newErrors.expiryDate);
    } else if (!expiryDateRegex.test(expiryDate)) {
      newErrors.expiryDate = "Expiry date must be in MM/YY format";
      toast.dismiss();
      toast.error(newErrors.expiryDate);
    } else {
      const [expMonth, expYear] = expiryDate.split("/").map(Number);
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear() % 100;

      if (
        expYear < currentYear ||
        (expYear === currentYear && expMonth <= currentMonth)
      ) {
        newErrors.expiryDate =
          "Expiry date must be in the future and cannot be the current month";
        toast.dismiss();
        toast.error(newErrors.expiryDate);
      }
    }
    if (!mrp) {
      newErrors.mrp = "MRP is required";
      toast.dismiss();
      toast.error(newErrors.mrp);
    }
    // if (!ptr) {
    //   newErrors.ptr = "PTR is required";
    // } else if (ptr && parseFloat(ptr) >= parseFloat(mrp)) {
    //   newErrors.ptr = "PTR must be less than or equal to MRP";
    //   toast.dismiss();
    // toast.error("PTR must be less than or equal to MRP");
    // }
    if (gst === undefined || gst === null || gst === "") {
      newErrors.gst = "GST is required";
      toast.dismiss();
      toast.error(newErrors.gst);
    }
    if (gst != 12 && gst != 18 && gst != 5 && gst != 28 && gst != 0) {
      newErrors.gst = "Enter valid GST";
      toast.dismiss();
      toast.error("Enter valid GST");
    }

    if (!searchItem) {
      toast.dismiss();
      toast.error("Please Select any Item Name");
      newErrors.searchItem = "Select any Item Name";
    }

    setError(newErrors);
    const isValid = Object.keys(newErrors).length === 0;

    if (isValid) {
      if (isSubmitting) return; // ⛔ Block if already submitting
      else {
        await handleAddItem(); // Call handleEditItem if validation passes
      }
    }

    return false;
  };

  /*<================================================================= Add and Edit item function  ============================================================> */

  const handleAddItem = async () => {
    if (isSubmitting) return false; // Prevent double submissions
    setIsSubmitting(true); // Lock

    const gstMapping = {

      18: 4,
      5: 2,
      0: 1,
    };
    let data = new FormData();
    data.append("user_id", userId);
    if (isEditMode == true) {
      data.append("item_id", itemEditID);
      data.append("unit_id", unitEditID);
    } else {
      if (barcode) {
        data.append("item_id", ItemId);
        data.append("unit_id", Number(0) || 1);
      } else {
        data.append("item_id", value.id);
        data.append("unit_id", Number(value.unit_id) || 1);
      }
    }

    data.append("random_number", localStorage.getItem("RandomNumber"));
    data.append("weightage", unit ? Number(unit) : 1);
    data.append("batch_number", batch ? batch : 0);
    data.append("hsn_code", HSN ? HSN : 0);
    data.append("expiry", expiryDate);
    data.append("mrp", mrp ? mrp : 0);
    data.append("qty", qty ? qty : 0);
    data.append("free_qty", free ? free : 0);
    data.append("ptr", ptr ? ptr : 0);
    data.append("discount", disc ? disc : 0);
    data.append("scheme_account", schAmt ? schAmt : 0);
    data.append("base_price", base ? base : 0);
    data.append("gst", gstMapping[gst] ?? gst);
    data.append("location", loc ? loc.toUpperCase() : "");
    data.append("margin", margin ? margin : 0);
    data.append("net_rate", netRate ? netRate : 0);
    data.append("id", selectedEditItemId ? selectedEditItemId : 0);

    const totalAmount = isNaN(ItemTotalAmount) ? 0 : ItemTotalAmount;
    data.append("total_amount", totalAmount);
    const params = {
      id: selectedEditItemId,
    };

    try {
      const response = isEditMode
        ? await axios.post("item-purchase-update?", data, {
          params: params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        : await axios.post("item-purchase", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      setId(null)
      setSelectedOption(null);
      setSearchItem("");
      setItemTotalAmount(0);
      setDeleteAll(true);
      itemPurchaseList();
      setUnit("");
      setBatch("");
      setHSN("");
      setExpiryDate("");
      setMRP("");
      setQty("");
      setFree("");
      setPTR("");
      setGst("");
      setDisc("");
      setBase("");
      setNetRate("");
      setSchAmt("");
      setMargin("");
      setLoc("");
      setIsEditMode(false);
      setSelectedEditItemId(null);
      setBarcode("");
      setValue("");
      setSearchItem("");
      setUnsavedItems(true);

      if (ItemTotalAmount <= finalCnAmount) {
        setFinalCnAmount(0);
        setSelectedRows([]);
        setCnTotalAmount({});
      }

      // Delay focus to wait for rerender
      setTimeout(() => {
        if (inputRefs.current[2]) {
          inputRefs.current[2]?.focus(); // Item Name input
        }
      }, 100);

      if (inputRefs.current[2]) {
        inputRefs.current[2]?.focus(); // Item Name input
      }

    } catch (error) {
         if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
      throw error; // Re-throw to be caught by handleAddButtonClick
    } finally {
      setIsSubmitting(false);

    }
  };
  /*<================================================================= Add new disrtibutor to item master  ============================================================> */

  const handleAddNewDistributor = async () => {
    if (
      !addDistributorName ||
      !addDistributorNo ||
      !addDistributorMobile
    ) {
      toast.dismiss();
      toast.error("Please fill all the fields");
      return;
    }

    let data = new FormData();
    data.append("gst_number", addDistributorNo);
    data.append("distributor_name", addDistributorName);
    data.append("mobile_no", addDistributorMobile);
    data.append("area", addDistributorAddress);

    try {
      const response = await axios.post("create-distributer", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response?.status === 200) {
        setAddDistributorAddress("");
        setAddDistributorMobile("");
        setAddDistributorName("");
        setAddDistributorNo("");
        toast.dismiss();
        toast.success("Distributor Added successfully");
        setOpenAddDistributorPopUp(false);
        setTimeout(() => {
          if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
          }
        }, 100);
        listDistributor();
      }
    } catch (error) {
         if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
      console.error("API error:", error);
      setUnsavedItems(false);

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Something went wrong";
      toast.dismiss();
      toast.error(message)
    }

  };


  /*<======================================================================== Add new item to item master  ===================================================================> */

  const handleAddNewItem = async () => {
    if (!addItemName || !addUnit) {
      toast.dismiss();
      toast.error("Please fill required fields");
      return;
    }

    const formData = new FormData();
    formData.append("item_name", addItemName);
    formData.append("unit", addUnit);
    formData.append("weightage", addUnit);
    formData.append("pack", `1*${addUnit}`);
    formData.append("barcode", addBarcode);

    formData.append("packaging_id", "");
    formData.append("drug_group", "");
    formData.append("gst", "");
    formData.append("location", "");
    formData.append("mrp", "");
    formData.append("minimum", "");
    formData.append("maximum", "");
    formData.append("discount", "");
    formData.append("margin", "");
    formData.append("hsn_code", "");
    formData.append("message", "");
    formData.append("item_category_id", "");
    formData.append("pahrma", "");
    formData.append("distributer", "");
    formData.append("front_photo", "");
    formData.append("back_photo", "");
    formData.append("mrp_photo", "");

    try {
      const response = await axios.post("create-iteams", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response?.data?.status === 200) {
        setOpenAddItemPopUp(false);
        setOpenAddDistributorPopUp(false);
        setAddItemName("");
        setAddBarcode("");
        setAddUnit("");
        inputRefs.current[2]?.focus();
        toast.dismiss();
        toast.success("Item added successfully");
      } else {
        toast.dismiss();
        toast.error(response?.data?.message || "Something went wrong");
      }

    } catch (error) {
         if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
      setUnsavedItems(false);
      const errMsg = error?.response?.data?.message || "Please try again later";
      toast.dismiss();
      toast.error(errMsg);
    }
  };


  /*<======================================================================= search item name  ==================================================================> */
  const handleScroll = (event) => {
    const listboxNode = event.currentTarget;

    const { scrollTop, scrollHeight, clientHeight } = listboxNode;

    if (
      scrollTop + clientHeight >= scrollHeight - 10 &&
      hasMore &&
      !isFetchingMore
    ) {
      setPage((prev) => prev + 1);
    }
  };

  const handleSearch = async (searchValue, pageNumber = 1) => {
    if (!searchValue || isFetchingMore) return;
    setIsFetchingMore(true);


    let data = new FormData();
    data.append("search", searchItem);
    data.append("page", pageNumber);
    const params = {
      search: searchValue,
      page: pageNumber,
    };

    try {
      const res = await axios.post("items-list?", data, {
        params,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const newData = res?.data?.data || [];

      if (pageNumber === 1) {
        setItemList(newData);
      } else {
        setItemList((prev) => {
          const existingIds = new Set(prev.map((i) => i.id));
          const filtered = newData.filter((i) => !existingIds.has(i.id));
          return [...prev, ...filtered];
        });
      }

      if (newData.length < 20) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("API error:", error);
    } finally {
      setIsFetchingMore(false);
         if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
    }
  };

  /*<================================================================ select row using up down arrow  ===========================================================> */

  const handleRowSelect = (id, totalAmount) => {
    const newSelectedRows = selectedRows.includes(id)
      ? selectedRows.filter((rowId) => rowId !== id)
      : [...selectedRows, id];

    setSelectedRows(newSelectedRows);

    if (newSelectedRows.includes(id)) {
      setCnTotalAmount((prev) => ({ ...prev, [id]: totalAmount }));
      setCnAmount((prev) => prev + parseFloat(totalAmount));
    } else {
      setCnTotalAmount((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
      setCnAmount((prev) => prev - parseFloat(totalAmount));
    }
  };

  /*<============================================================================ delete added item  =======================================================================> */

  const handleDeleteItem = async (ItemId) => {
    if (!ItemId) return;
    let data = new FormData();
    data.append("id", ItemId);
    const params = {
      id: ItemId,
    };
    try {
      await axios
        .post("item-purchase-delete?", data, {
          params: params,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          itemPurchaseList();
          setIsDelete(false);
        });
    } catch (error) {
      console.error("API error:", error);
      setUnsavedItems(false);
         if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
    }
  };

  /*<========================================================================= Fetch customer history   ====================================================================> */

  const fetchItemHistory = async (selectedOption) => {
    let data = new FormData();
    data.append("item_id", selectedOption.id);
    setIsLoading(true);
    try {
      const response = await axios.post("item-purchase-history", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status === 200) {
        setItemHistoryData(response.data.data);
        setOpenItemHistory(true);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("API error:", error);
      toast.dismiss();
      toast.error("Failed to fetch customer history");
         if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
    }
  };
  /*<========================================================================= submit purchase bill  =====================================================================> */

  const submitPurchaseData = async (draft) => {
    if (isSubmitting) {
      toast.warning("Please wait, request in progress...");
      return;
    }

    setIsSubmitting(true);

    let data = new FormData();
    data.append("distributor_id", distributor?.id);
    data.append("bill_no", billNo);
    data.append(
      "bill_date",
      selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""
    );
    data.append("due_date", dueDate ? format(dueDate, "yyyy-MM-dd") : "");
    data.append("owner_type", localStorage.getItem("UserName"));
    data.append("user_id", localStorage.getItem("userId"));
    data.append("sr_no", srNo);
    data.append("payment_type", paymentType);
    data.append("total_amount", ItemPurchaseList.new_total_price);
    data.append("other_amount", otherAmt);
    data.append("net_amount", netAmount);
    data.append("cn_amount", cnAmount);
    data.append("total_gst", !totalGst ? 0 : totalGst);
    data.append("total_margin", ItemPurchaseList.total_margin);
    data.append("cn_amount", finalCnAmount);
    data.append("round_off", roundOffAmount?.toFixed(2));
    data.append("purches_data", JSON.stringify(ItemPurchaseList.item));
    data.append("purches_return_data", JSON.stringify(finalPurchaseReturnList));
    data.append("draft_save", !draft ? "1" : draft);

    try {
      const response = await axios.post("purches-store", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.removeItem("RandomNumber");
      setItemPurchaseList("");
      setDistributor(null)
      setbillNo("")
      setSelectedDate(new Date())
      setUnsavedItems(false);
      toast.dismiss();
      toast.success(response.data.message);

      // Add cooldown period
      const timeout = setTimeout(() => {
        setIsSubmitting(false);
        history.push("/purchase");
      }, 2000);
      setSubmitTimeout(timeout);

    } catch (error) {
      console.error("API error:", error);
      setUnsavedItems(false);
         if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }

      // Reset after error with shorter cooldown
      const timeout = setTimeout(() => {
        setIsSubmitting(false);
      }, 1000);
      setSubmitTimeout(timeout);
    }
  };

  /*<====================================================================== validation  purchase bill  ==================================================================> */

  const handleSubmit = (draft) => {
    if (isSubmitting) {
      toast.warning("Please wait, request in progress...");
      return;
    }

    const newErrors = {};
    if (!distributor) {
      newErrors.distributor = "Please select Distributor";
      toast.dismiss();
      toast.error("Please select Distributor");
    }
    if (!billNo) {
      newErrors.billNo = "Bill No is Required";
      toast.dismiss();
      toast.error("Bill No is Required");
    }
    if (ItemPurchaseList?.item?.length === 0) {
      toast.dismiss();
      toast.error("Please add atleast one item");
      newErrors.item = "Please add atleast one item";
    }

    setError(newErrors);
    if (Object.keys(newErrors)?.length > 0) {
      return;
    }
    submitPurchaseData(draft);
    setUnsavedItems(false);
  };

  useEffect(() => {
    if (selectedEditItem) {
      setUnitEditID(selectedEditItem.unit_id);
      setItemEditID(selectedEditItem.item_id);
      setSearchItem(selectedEditItem.iteam_name.toUpperCase());
      setUnit(selectedEditItem.weightage);
      setBatch(selectedEditItem.batch_number);
      setHSN(selectedEditItem.hsn_code);
      setExpiryDate(selectedEditItem.expiry);
      setMRP(selectedEditItem.mrp);
      setQty(selectedEditItem.qty);
      setFree(selectedEditItem.free_qty);
      setPTR(selectedEditItem.ptr);
      setDisc(selectedEditItem.discount);
      setSchAmt(selectedEditItem.scheme_account);
      setBase(selectedEditItem.base_price);
      setGst(selectedEditItem.gst);
      setLoc(selectedEditItem.location.toUpperCase());
      setMargin(selectedEditItem.margin);
      setNetRate(selectedEditItem.net_rate);
    }
  }, [selectedEditItem]);

  /*<=========================================================================== Handle edit =======================================================================> */

  const handleEditClick = (item) => {
    setSelectedEditItem(item);

    setIsEditMode(true);
    setSelectedEditItemId(item.id);
    setSelectedEditItemId(item.id);
    inputRefs.current[3]?.focus();
  };
  /*<=========================================================================== purchase return data =======================================================================> */

  const purchaseReturnData = async () => {
    let data = new FormData();
    data.append("distributor_id", distributor?.id);
    try {
      await axios
        .post("purchase-return-pending-bills", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setPurchaseReturnPending(response.data.data);
        });
    } catch (error) {
      setUnsavedItems(false);
      if (error.response.data.status == 400) {
        toast.dismiss();
        toast.error(error.response.data.message);
        
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      
      } else {
      }
    }
  };

  /*<===================================================================== open CN Adjust popup  =================================================================> */

  const handelAddOpen = () => {
    setUnsavedItems(true);
    setOpenAddPopUp(true);
    purchaseReturnData();
  };

  /*<===================================================================== open item master popup  =================================================================> */

  const handelAddItemOpen = () => {
    setUnsavedItems(true);
    setOpenAddItemPopUp(true);
    setFocusedField("add item");
  };

  /*<===================================================================== close CN Adjust popup  =================================================================> */

  const resetAddDialog = () => {
    setOpenAddPopUp(false);
    setOpenAddItemPopUp(false);
    // setCnAmount(0);
    // setSelectedRows("")
    // setCnTotalAmount("")
    // setCnAmount(0);
  };

  /*<============================================================================== Select Item  ==========================================================================> */

  const handleInputChange = (event, newInputValue) => {
    setSearchItem(newInputValue.toUpperCase());
    // handleSearch(newInputValue.toUpperCase());
  };

  const handleOptionChange = (event, newValue) => {
    setIsEditMode(false);
    removeItem()
    setValue(newValue);
    setSelectedOption(newValue);

    const itemName = newValue ? newValue.iteam_name : "";
    setSearchItem(itemName.toUpperCase());

    setId(newValue?.id);
    handleSearch(itemName);
  };

  /*<====================================================================== Discount calculation  ==================================================================> */

  const handleSchAmt = (e) => {
    const valueStr = String(e.target.value); // ensure string
    const inputDiscount =
      valueStr.replace(/[eE]/g, "") === ""
        ? ""
        : parseFloat(valueStr.replace(/[eE]/g, ""));

    if (isNaN(inputDiscount)) {
      setDisc(0);
      setSchAmt(0);
      setBase(ptr * qty);
      return;
    }

    setDisc(inputDiscount);

    // FIXED: Correct discount calculation
    const totalSchAmt = parseFloat(
      (((ptr * qty * inputDiscount) / 100)).toFixed(2)
    );
    setSchAmt(totalSchAmt);

    const totalBase = parseFloat((ptr * qty - totalSchAmt).toFixed(2));
    setBase(totalBase);
  };

  /*<============================================================================== Remove Item  ==========================================================================> */

  const removeItem = () => {
    setSelectedOption(null);
    setSelectedEditItemId(null);
    setSelectedIndex(-1);
    setSearchItem("");
    setId(null);
    setSelectedEditItem(null);
    setSelectedEditItemId(0);
    setIsEditMode(false);
    setUnit("");
    setBatch("");
    setHSN("");
    setExpiryDate("");
    setSearchItem("");
    setMRP("");
    setQty("");
    setFree("");
    setPTR("");
    setGst("");
    setDisc("");
    setBase("");
    setSchAmt("");
    setNetRate("");
    setMargin("");
    setLoc("");
  };

  /*<======================================================================== select all CN Bill ====================================================================> */

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(purchaseReturnPending.map((row) => row.id));
      const updatedAmounts = purchaseReturnPending.reduce((acc, row) => {
        acc[row.id] = row.total_amount;
        return acc;
      }, {});
      setCnTotalAmount(updatedAmounts);
      setCnAmount(
        purchaseReturnPending.reduce(
          (acc, row) => acc + parseFloat(row.total_amount || 0),
          0
        )
      );
    } else {
      setSelectedRows([]);
      setCnTotalAmount({});
      setCnAmount(0);
    }
  };

  /*<======================================================================= CN Amount Calculation ===================================================================> */

  const handleCnAmountChange = (id, value, totalAmount) => {
    const numericValue = parseFloat(value) || 0;

    const finalValue = Math.min(numericValue, totalAmount);

    setCnTotalAmount((prevAmounts) => ({
      ...prevAmounts,
      [id]: finalValue,
    }));

    const prevAmount = cnTotalAmount[id] || 0;

    setCnAmount((prev) => prev + finalValue - prevAmount);
  };

  const handleCalNetAmount = (total_price) => {
    const adjustedTotalAmount = total_price - finalCnAmount;

    const decimalPart = adjustedTotalAmount - Math.floor(adjustedTotalAmount);

    let netAmountCal;
    let roundOffAmountCal;

    if (decimalPart >= 0.5) {
      netAmountCal = Math.ceil(adjustedTotalAmount); // round up
      roundOffAmountCal = netAmountCal - adjustedTotalAmount; // calculate the round-off value
    } else {
      netAmountCal = Math.floor(adjustedTotalAmount);
      roundOffAmountCal = netAmountCal - adjustedTotalAmount; // calculate the round-off value
    }
    setNetAmount(netAmountCal);
    setRoundOffAmount(roundOffAmountCal);
  };

  const handleCnAmount = () => {
    const newErrors = {};

    if (finalTotalAmount <= cnAmount) {
      newErrors.finalTotalAmount =
        "You cannot adjust CN more than the total invoice amount";
      toast.dismiss();
      toast.error("You cannot adjust CN more than the total invoice amount");
      setError(newErrors);
      setSelectedRows([]);
      setCnTotalAmount({});
      setCnAmount(0);
      return;
    }
    setFinalCnAmount(cnAmount);
    const decimalTotalAmount = finalTotalAmount - Math.floor(finalTotalAmount);
    const decimalCNAmount = cnAmount - Math.floor(cnAmount);

    setRoundOffAmount(decimalTotalAmount - decimalCNAmount);

    const adjustedTotalAmount = finalTotalAmount - cnAmount;

    let netAmountCal, roundOffAmountCal;

    const decimalPart = adjustedTotalAmount - Math.floor(adjustedTotalAmount);

    if (decimalPart >= 0.5) {
      netAmountCal = Math.ceil(adjustedTotalAmount); // Round up
    } else {
      netAmountCal = Math.floor(adjustedTotalAmount); // Round down
    }

    roundOffAmountCal = netAmountCal - adjustedTotalAmount;

    // Update the states with the calculated values
    setNetAmount(netAmountCal);
    setRoundOffAmount(roundOffAmountCal);

    // handleCalNetAmount();
    const purchaseReturnList = selectedRows.map((rowId) => {
      return {
        purches_return_bill_id: rowId,
        amount: cnTotalAmount[rowId],
      };
    });
    setFinalPurchaseReturnList(purchaseReturnList);
    // Submit purchaseReturnList to the backend or handle it as needed
    resetAddDialog();
    // Reset dialog after submission
  };

  useEffect(() => {
    const baseNetAmount =
      finalTotalAmount - finalCnAmount + roundOffAmount;
    const other = Number(otherAmt) || 0;

    // Prevent reducing below zero
    if (other < 0 && Math.abs(other) > baseNetAmount) {
      setOtherAmt("");
      setNetAmount(baseNetAmount);
      return;
    }

    setNetAmount(baseNetAmount + other);
  }, [otherAmt, finalTotalAmount, finalCnAmount, roundOffAmount]);


  const handleNavigation = (path) => {
    setOpenAddPopUp(false);
    setIsOpenBox(true);
    setNextPath(path);
  };

  const LogoutClose = () => {
    setIsOpenBox(false);
    // setPendingNavigation(null);
  };

  /*<===================================================================== CN Amount Calculation =================================================================> */

  const handleLeavePage = async () => {
    let data = new FormData();
    data.append("random_number", localStorage.getItem("RandomNumber"));

    try {
      const response = await axios.post("item-purchase-delete-all", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
      localStorage.removeItem("RandomNumber");

      // history.replace(nextPath);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setUnsavedItems(false);
        setIsOpenBox(false);
        localStorage.setItem("unsavedItems", unsavedItems.toString());
        setTimeout(() => {
          history.push(nextPath);
        }, 0);
         
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      
      } else {
        setUnsavedItems(false);

        console.error("Error deleting items:", error);
      }
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

      <>
        <div className="p-6"
          style={{
            height: "calc(-125px + 100vh)",
            overflow: "auto",
          }}>
          <div >
            {/*<======================================================== Top header & buttons   =======================================================> */}
            <div className="flex flex-wrap items-center justify-between gap-2 row border-b border-dashed pb-4 border-[var(--color1)]">
              <div className="flex items-center gap-2">
                <span
                  className="text-[var(--color2)] font-bold text-[20px] cursor-pointer"
                  onClick={() => history.push("/purchase")}
                >
                  Purchase
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
                <Select
                  labelId="dropdown-label"
                  id="dropdown"
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value)}
                  size="small"
                  className="min-w-[150px] rounded-md"
                >
                  <MenuItem value="cash" className="hover:bg-[var(--color2)]">Cash</MenuItem>
                  <MenuItem value="credit" className="hover:bg-[var(--color2)]">Credit</MenuItem>
                  {bankData?.map((option) => (
                    <MenuItem
                      key={option.id}
                      value={option.id}
                      className="hover:bg-[var(--color2)]"
                    >
                      {option.bank_name}
                    </MenuItem>
                  ))}
                </Select>
                <button
                  type="button"
                  className="inline-flex items-center rounded-[4px] bg-[var(--color1)] px-4 py-2 text-white hover:bg-[var(--color2)] transition"
                  onClick={() => {
                    setDialogMode("csv");
                    setOpenFile(true);
                  }}
                ><CloudUploadIcon className="mr-2" />
                  Import CSV
                </button>

                {/* Import Stock button (directly set Visual) */}
                {distributor?.name === "OPENING DISTRIBUTOR" && (
                  <button
                    type="button"
                    onClick={() => {
                      setDialogMode("stock");
                      setImportConpany("Visual"); // auto select Visual
                      setOpenFile(true);
                    }}
                    disabled={distributor?.name !== "OPENING DISTRIBUTOR"}
                    className="inline-flex items-center rounded-[4px] bg-[var(--color1)] px-4 py-2 text-white transition hover:bg-[var(--color2)] disabled:bg-[var(--color3)] disabled:text-[var(--color1)] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <CloudUploadIcon className="mr-2" />
                    Opening Stock
                  </button>
                )}

                {distributor && (
                  <button
                    type="button"
                    onClick={handelAddOpen}
                    disabled={!distributor}
                    className="inline-flex items-center rounded-[4px] bg-[var(--color1)] px-4 py-2 text-white transition hover:bg-[var(--color2)] disabled:bg-[var(--color3)] disabled:text-[var(--color1)] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <AddIcon className="mr-2" />
                    CN Adjust
                  </button>
                )}

                <button
                  type="button"
                  className="inline-flex items-center rounded-[4px] bg-[var(--color1)] px-4 py-2 text-white hover:bg-[var(--color2)] transition"
                  onClick={handelAddItemOpen}
                >
                  <ControlPointIcon className="mr-2" />
                  Add Item
                </button>

                <div
                  className="relative inline-block"
                  onMouseEnter={() => {
                    clearTimeout(timeoutRef.current);
                    setIsOpen(true);
                  }}
                  onMouseLeave={() => {
                    timeoutRef.current = setTimeout(() => setIsOpen(false), 200);
                  }}
                >
                  <button
                    type="button"
                    className="h-10 rounded-l-[4px] bg-[var(--color1)] px-6 text-white hover:bg-[var(--color2)] transition align-middle"
                    onClick={() => {
                      setBillSaveDraft("1");
                      handleSubmit("1");
                    }}
                  >
                    Save
                  </button>

                  <button
                    type="button"
                    className="h-10 rounded-r-[4px] bg-[var(--color1)] px-2 text-white hover:bg-[var(--color2)] transition align-middle"
                    onClick={() => setIsOpen((v) => !v)}
                    ref={submitButtonRef}
                    aria-haspopup="menu"
                    aria-expanded={isOpen}
                  >
                    <IoCaretDown className="text-white" />
                  </button>
                  {isOpen && (
                    <div className="absolute right-1 top-14 w-36 bg-white shadow-lg  overflow-hidden ring-1 ring-[var(--color1)]">
                      <ul className="text-slate-800">
                        <li
                          onClick={() => {
                            setBillSaveDraft("1");
                            handleSubmit("1");
                          }}
                          className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-[var(--color2)] hover:text-white"
                          role="menuitem"
                        >
                          <SaveIcon />
                          Save
                        </li>
                        <li
                          onClick={() => {
                            setBillSaveDraft("0");
                            handleSubmit("0");
                          }}
                          className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-[var(--color2)] hover:text-white border-t border-[var(--color1)]"
                          role="menuitem"
                        >
                          <SaveAsIcon />
                          Draft
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/*<================================================================= Top details   ================================================================> */}

            <div className=" flex gap-4  mt-4">
              <div className="flex flex-row gap-4 overflow-x-auto w-full">
                <div>
                  <span className="title mb-2 flex  items-center gap-2">Distributor <span className="text-red-600">*</span>    <FaPlusCircle
                    className="primary cursor-pointer"
                    onClick={() => {
                      setOpenAddDistributorPopUp(true);
                    }}
                  /></span>

                  <Autocomplete
                    value={distributor ?? ""}
                    sx={{
                      width: "100%",
                      minWidth: "350px",
                      minHeight: "40px",

                      "@media (max-width:600px)": { minWidth: "250px" },
                    }}
                    freeSolo
                    size="small"
                    options={distributorList}
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
                      setbillNo("");
                    }}
                    onInputChange={(event, newInputValue, reason) => {
                      if (reason === "input") {
                        // User typing: keep ID only if still matches list
                        setDistributor((prev) => ({
                          id: null,
                          name: newInputValue.toUpperCase(),
                        }));
                        setbillNo("");
                      }
                    }}
                    getOptionLabel={(option) =>
                      typeof option === "string" ? option : option?.name ?? ""
                    }
                    renderInput={(params) => (
                      <TextField
                        autoFocus={focusedField === "distributor"}
                        autoComplete="off"
                        variant="outlined"
                        error={!!error.distributor}
                        {...params}
                        inputRef={(el) => (inputRefs.current[0] = el)}
                        inputProps={{
                          ...params.inputProps,
                          style: { textTransform: "uppercase" },
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

                <div>
                  <span className="title mb-2">Bill No. / Order No.<span className="text-red-600 ">*</span></span>
                  <TextField
                    autoComplete="off"
                    id="outlined-number"
                    size="small"
                    variant="outlined"
                    error={!!error.billNo}
                    value={billNo}
                    sx={{
                      width: "100%",
                      minWidth: "200px",
                      minHeight: "40px",
                      "@media (max-width:600px)": { minWidth: "200px" },
                    }}
                    onChange={(e) => {
                      setbillNo(e.target.value.toUpperCase());
                    }}
                    inputRef={(el) => (inputRefs.current[1] = el)}
                    onKeyDown={(e) => {
                      if (billNo) {
                        handleKeyDown(e, 1);
                      } else {
                        const isTab = e.key === 'Tab' && !e.shiftKey;
                        const isEnter = e.key === 'Enter';

                        if (isEnter || isTab) {
                          e.preventDefault();
                          toast.dismiss();
                          toast.error("Bill NO is Required");
                        }
                        // Shift + Tab is allowed by default; do not prevent it
                      }
                    }}

                  />
                </div>

                <div>
                  <span className="title mb-2">Bill Date</span>
                  <div>
                    <DatePicker
                      className="custom-datepicker "
                      selected={selectedDate}
                      variant="outlined"
                      onChange={(newDate) => setSelectedDate(newDate)}
                      dateFormat="dd/MM/yyyy"
                      filterDate={(date) => !isDateDisabled(date)}
                      inputRef={(el) => (inputRefs.current[2] = el)}
                      onKeyDown={(e) => handleKeyDown(e, 2)}
                    />
                  </div>
                </div>

                <div>
                  <span className="title mb-2">Due Date</span>
                  <div>
                    <DatePicker
                      className="custom-datepicker"
                      selected={dueDate}
                      variant="outlined"
                      onChange={(newDate) => setDueDate(newDate)}
                      dateFormat="dd/MM/yyyy"
                      minDate={new Date()}
                    />
                  </div>
                </div>

                <div>
                  <span className="title mb-2">Scan Barcode</span>

                  <TextField
                    autoComplete="off"
                    id="outlined-number"
                    type="number"
                    size="small"
                    variant="outlined"
                    value={barcode}
                    placeholder="scan barcode"
                    // inputRef={inputRef10}
                    // onKeyDown={handleKeyDown}

                    sx={{
                      width: "100%",
                      minWidth: "200px",
                      "@media (max-width:600px)": { minWidth: "200px" },
                    }}
                    onChange={(e) => {
                      generateRandomNumber();

                      setBarcode(e.target.value);

                    }}
                  />
                </div>

              </div>
            </div>
            {/*<=====================================================Item Table ====================================================> */}

            <div className="table-container">
              <table className="w-full border-collapse item-table" tabIndex={0} ref={tableRef}>
                <thead>
                  <tr className="input-row">
                    <th>
                      <div className="flex justify-center items-center gap-2">
                        Search Item Name <span className="text-red-600 ">*</span>
                        <FaPlusCircle
                          className="primary cursor-pointer"
                          onClick={() => { setOpenAddItemPopUp(true) }}
                        />
                      </div>
                    </th>
                    <th>Unit <span className="text-red-600 ">*</span></th>
                    <th>Batch <span className="text-red-600 ">*</span> </th>
                    <th>Expiry <span className="text-red-600 ">*</span></th>
                    <th>MRP <span className="text-red-600 ">*</span></th>
                    <th>Qty. </th>
                    <th>Free</th>
                    <th>PTR <span className="text-red-600 ">*</span></th>
                    <th>CD%</th>
                    <th>Base</th>
                    <th>GST%<span className="text-red-600 ">*</span></th>
                    <th>Loc.</th>
                    <th>Net Rate</th>
                    <th>Margin%</th>
                    <th>Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {/*<======================================================== Input row (add/edit)   =======================================================> */}
                  <tr className="input-row">

                    <td style={{ fontSize: 15, height: "47px", minWidth: 400, width: "100%", display: 'flex', alignItems: 'center', justifyContent: 'start', }}>
                      {isEditMode ? (
                        <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'left', }}>
                          <DeleteIcon
                            className="delete-icon mr-2"
                            onClick={() => {
                              setIsEditMode(false);
                              setTimeout(() => {
                                removeItem();
                                inputRefs.current[2]?.focus();
                              }, 0);
                            }}
                          />
                          {searchItem.slice(0, 30)}{searchItem.length > 30 ? '...' : ''}
                        </div>
                      ) : (
                        <Autocomplete
                          key={autocompleteKey}
                          value={selectedOption}
                          size="small"
                          onChange={handleOptionChange}
                          onInputChange={handleInputChange}
                          open={autoCompleteOpen}
                          onOpen={() => setAutoCompleteOpen(true)}
                          onClose={() => setAutoCompleteOpen(false)}
                          getOptionLabel={(option) =>
                            `${option.iteam_name} `
                          }
                          ListboxProps={{
                            onScroll: handleScroll,
                          }}
                          options={itemList}
                          renderOption={(props, option) => (
                            <ListItem {...props}>
                              <ListItemText
                                primary={`${option?.iteam_name}`}
                                secondary={`${option.company_name}`}
                              />
                            </ListItem>
                          )}
                          renderInput={(params) => (
                            <TextField
                              tabIndex={0}
                              variant="outlined"
                              autoComplete="off"
                              {...params}
                              value={searchItem?.iteam_name}
                              inputRef={(el) => (inputRefs.current[2] = el)}
                              onFocus={() => setSelectedIndex(-1)}
                              fullWidth
                              sx={{
                                minWidth: 400,
                                width: "100%",
                                '& .MuiInputBase-input': {
                                  // textAlign: 'center',
                                  textTransform: 'uppercase',
                                },
                              }}

                              InputProps={{
                                ...params.InputProps,
                                style: { textTransform: 'uppercase' },
                                endAdornment: (
                                  <>
                                    {selectedOption && (
                                      <Tooltip
                                        title="Item Purchase History"
                                        arrow
                                        componentsProps={{
                                          tooltip: {
                                            sx: {
                                              backgroundColor: "#3f6212",
                                              color: 'white',
                                              fontSize: '14px',
                                              fontWeight: '500',
                                              padding: '8px 12px',
                                              '& .MuiTooltip-arrow': {
                                                color: '#3f6212',
                                              }
                                            }
                                          }
                                        }}
                                      >
                                        <IconButton
                                          size="small"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            fetchItemHistory(selectedOption);
                                          }}
                                          sx={{
                                            marginRight: '-8px',
                                            zIndex: 1,
                                            width: '28px',
                                            height: '28px',
                                            border: '2px solid var(--color1)',
                                            borderRadius: '50%',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                              backgroundColor: 'var(--color1) !important',
                                              borderColor: 'var(--color1)',
                                            },
                                            '&:hover .sales-history-text': {
                                              color: 'white !important'
                                            }
                                          }}
                                        >
                                          <span
                                            className="sales-history-text"
                                            style={{
                                              color: 'var(--color1)',
                                              fontWeight: 'bold',
                                              fontSize: '14px',
                                              transition: 'color 0.3s ease'
                                            }}
                                          >
                                            P
                                          </span>
                                        </IconButton>
                                      </Tooltip>
                                    )}
                                    {params.InputProps.endAdornment}
                                  </>
                                ),
                              }}

                              onKeyDown={(e) => {
                                const { key, shiftKey } = e;
                                const isTab = key === "Tab";
                                const isShiftTab = isTab && shiftKey;
                                const isEnter = key === "Enter";
                                const isArrowKey = key === "ArrowDown" || key === "ArrowUp";

                                if (isShiftTab) return;

                                if (!searchItem && isArrowKey) {
                                  tableRef.current.focus();
                                  setTimeout(() => document.activeElement.blur(), 0);
                                  return;
                                }

                                if ((isEnter || isTab) && autoCompleteOpen) return;

                                if (isEnter || isTab) {
                                  e.preventDefault();

                                  if (!selectedOption) {
                                    e.preventDefault();
                                    setTimeout(() => {
                                      toast.dismiss();
                                      toast.error("Please select an Item")
                                    }, 100);
                                  } else {
                                    setTimeout(() => inputRefs?.current[3].focus(), 100);
                                  }
                                  return;
                                }
                              }}
                            />
                          )}
                        />
                      )}
                    </td>

                    <td>
                      <TextField
                        variant="outlined"
                        autoComplete="off"
                        id="outlined-number"
                        type="text"
                        size="small"
                        error={!!error.unit}
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
                        }}
                        onKeyDown={(e) => {
                          const isInvalidKey = ["e", "E", ".", "+", "-", ","].includes(e.key);
                          const isTab = e.key === "Tab";
                          const isShiftTab = isTab && e.shiftKey;
                          const isEnter = e.key === "Enter";

                          if (isInvalidKey) {
                            e.preventDefault();
                            return;
                          }

                          if (isShiftTab) return;

                          if (unit) {
                            handleKeyDown(e, 3);
                          } else if (isTab || isEnter) {
                            e.preventDefault();
                            toast.dismiss();
                            toast.error("Unit is Required");
                          }
                        }}
                        inputRef={(el) => (inputRefs.current[3] = el)}
                      />
                    </td>

                    <td>
                      <TextField
                        variant="outlined"
                        autoComplete="off"
                        id="outlined-number"
                        size="small"
                        error={!!error.batch}
                        value={batch}
                        sx={{
                          minWidth: "100px",
                          width: "100%",
                          '& .MuiInputBase-input': {
                            textAlign: 'center',
                          },
                        }}
                        onChange={(e) => {
                          setBatch((e.target.value).toUpperCase());
                        }}
                        inputRef={(el) => (inputRefs.current[4] = el)}
                        onKeyDown={(e) => {
                          if (batch) {
                            handleKeyDown(e, 4);
                          } else if (e.key === 'Tab' || e.key === 'Enter') {
                            e.preventDefault();
                            toast.dismiss();
                            toast.error("Batch is Required");
                          }
                        }}
                      />
                    </td>

                    <td>
                      <TextField
                        variant="outlined"
                        autoComplete="off"
                        id="outlined-number"
                        size="small"
                        sx={{
                          minWidth: "65px",
                          width: "100%",
                          '& .MuiInputBase-input': {
                            textAlign: 'center',
                          },
                        }}
                        error={!!error.expiryDate}
                        value={expiryDate}
                        onChange={handleExpiryDate}
                        placeholder="MM/YY"
                        inputRef={(el) => (inputRefs.current[5] = el)}
                        onKeyDown={(e) => {
                          const isTab = e.key === 'Tab';
                          const isEnter = e.key === 'Enter';
                          const isShiftTab = isTab && e.shiftKey;
                          const expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;

                          if (isShiftTab) return;

                          if (isTab || isEnter) {
                            if (!expiryDate) {
                              e.preventDefault();
                              toast.dismiss();
                              toast.error("Expiry is required");
                              return;
                            }

                            if (!expiryDateRegex.test(expiryDate)) {
                              e.preventDefault();
                              toast.dismiss();
                              toast.error("Expiry must be in MM/YY format");
                              return;
                            }

                            const [month, year] = expiryDate.split('/').map(Number);
                            const expiry = new Date(`20${year}`, month - 1, 1);
                            const now = new Date();
                            const sixMonthsLater = new Date();
                            sixMonthsLater.setMonth(now.getMonth() + 6);

                            if (expiry < now) {
                              e.preventDefault();
                              toast.dismiss();
                              toast.error("Product has expired");
                            } else if (expiry < sixMonthsLater) {

                              toast.warning("Product will expire within 6 months");
                              handleKeyDown(e, 5);
                            } else {
                              handleKeyDown(e, 5);
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
                        sx={{
                          minWidth: "65px",
                          width: "100%",
                          '& .MuiInputBase-input': {
                            textAlign: 'center',
                          },
                        }}
                        size="small"
                        error={!!error.mrp}
                        value={mrp}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*\.?\d*$/.test(value)) {
                            setMRP(value ? Number(value) : "");
                          }
                        }}
                        onKeyDown={(e) => {
                          const isTab = e.key === "Tab";
                          const isShiftTab = isTab && e.shiftKey;

                          if (isShiftTab) return;

                          if (
                            ["e", "E", "+", "-", ","].includes(e.key) ||
                            (e.key === "." && e.target.value.includes("."))
                          ) {
                            e.preventDefault();
                          }

                          if ((e.key === "Enter" || e.key === "Tab") && (!mrp || mrp === 0)) {
                            e.preventDefault();
                            toast.dismiss();
                            toast.error("MRP is required and must be greater than 0");
                            return;
                          }

                          handleKeyDown(e, 6);
                        }}
                        inputRef={(el) => (inputRefs.current[6] = el)}
                      />
                    </td>

                    <td>
                      <TextField
                        variant="outlined"
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
                        error={!!error.qty}
                        value={qty}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, "");
                          setQty(value ? Number(value) : "");
                        }}
                        inputRef={(el) => (inputRefs.current[7] = el)}
                        onKeyDown={(e) => {
                          const invalidKeys = ["e", "E", ".", "+", "-", ","];
                          const isEnter = e.key === "Enter";

                          if (invalidKeys.includes(e.key)) {
                            e.preventDefault();
                            return;
                          }

                          if (isEnter) {
                            e.preventDefault();
                            handleKeyDown(e, 7);
                          }
                        }}
                      />
                    </td>

                    <td>
                      <TextField
                        variant="outlined"
                        autoComplete="off"
                        id="outlined-number"
                        size="small"
                        type="number"
                        sx={{
                          minWidth: "40px",
                          width: "100%",
                          '& .MuiInputBase-input': {
                            textAlign: 'center',
                          },
                        }}

                        value={free}
                        error={!!error.free}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g);
                          setFree(value ? Number(value) : "");
                        }}
                        onKeyDown={(e) => {
                          const invalidKeys = ["e", "E", ".", "+", "-", ","];
                          if (invalidKeys.includes(e.key)) {
                            e.preventDefault();
                            return;
                          }

                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleKeyDown(e, 8);
                          }
                        }}
                        inputRef={(el) => (inputRefs.current[8] = el)}
                      />
                    </td>

                    <td>
                      <TextField
                        variant="outlined"
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
                        error={!!error.ptr}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*\.?\d*$/.test(value)) {
                            setPTR(value ? Number(value) : "");
                          }
                        }}
                        onKeyDown={(e) => {
                          const isTab = e.key === "Tab";
                          const isEnter = e.key === "Enter";
                          const isShiftTab = isTab && e.shiftKey;
                          const invalidKeys = ["e", "E", "+", "-", ","];

                          if (invalidKeys.includes(e.key) || (e.key === "." && e.target.value.includes("."))) {
                            e.preventDefault();
                            return;
                          }

                          if (isShiftTab) return;

                          if (isEnter || isTab) {
                            // if (!ptr || ptr === 0) {
                            //   e.preventDefault();
                            // toast.dismiss();
                            // toast.error("PTR is required and must be greater than 0");
                            //   return;
                            // }

                            if (Number(mrp) && Number(ptr) >= Number(mrp)) {
                              e.preventDefault();
                              toast.dismiss();
                              toast.error("PTR must be less than MRP");
                              return;
                            }
                          }

                          handleKeyDown(e, 9);
                        }}
                        inputRef={(el) => (inputRefs.current[9] = el)}
                      />
                    </td>

                    <td>
                      <TextField
                        variant="outlined"
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
                        type="text"
                        value={disc}
                        onKeyDown={(e) => {
                          const invalidKeys = ["e", "E", "+", "-", ","];
                          if (
                            invalidKeys.includes(e.key) ||
                            (e.key === "." && e.target.value.includes("."))
                          ) {
                            e.preventDefault();
                          }

                          handleKeyDown(e, 10);
                        }}
                        onChange={(e) => {
                          let value = Number(e.target.value);
                          if (value > 99) {
                            value = 99;
                            e.target.value = 99;
                          }
                          handleSchAmt({ ...e, target: { ...e.target, value } });
                        }}
                        inputRef={(el) => (inputRefs.current[10] = el)}
                      />
                    </td>

                    <td>
                      <TextField
                        variant="outlined"
                        autoComplete="off"
                        id="outlined-number"
                        type="number"
                        size="small"
                        value={base === 0 ? "" : base}
                        disabled

                        sx={{
                          minWidth: "65px",
                          width: "100%",
                          '& .MuiInputBase-input': {
                            textAlign: 'center',
                          },
                        }}
                        onChange={(e) => {
                          setBase(e.target.value);
                        }}
                      />
                    </td>

                    <td>
                      <TextField
                        variant="outlined"
                        size="small"
                        value={gst}

                        sx={{
                          minWidth: "40px",
                          width: "100%",
                          '& .MuiInputBase-input': {
                            textAlign: 'center',
                          },
                        }}
                        error={!!error.gst}
                        inputRef={(el) => (inputRefs.current[11] = el)}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*$/.test(value)) {
                            setGst(value ? Number(value) : "");
                          }
                        }}
                        onKeyDown={(e) => {
                          const isTab = e.key === "Tab";
                          const isEnter = e.key === "Enter";
                          const isShiftTab = isTab && e.shiftKey;

                          if (isShiftTab) return;

                          if (isEnter || isTab) {
                            const allowedGST = [0, 5, 18];

                            if (gst === "" || gst === null || gst === undefined) {
                              e.preventDefault();
                              toast.dismiss();
                              toast.error("GST is required !");
                              return;
                            }

                            if (!allowedGST.includes(Number(gst))) {
                              e.preventDefault();
                              toast.dismiss();
                              toast.error("Only 0%, 5%, 18% GST is allowed");
                              return;
                            }
                          }

                          handleKeyDown(e, 11);
                        }}
                      />
                    </td>

                    <td>
                      <TextField
                        variant="outlined"
                        autoComplete="off"
                        id="outlined-number"
                        size="small"
                        value={loc?.toUpperCase()}

                        sx={{
                          minWidth: "65px",
                          width: "100%",
                          '& .MuiInputBase-input': {
                            textAlign: 'center',
                          },
                        }}
                        onChange={(e) => {
                          setLoc(e.target.value.toUpperCase());
                        }}
                        inputRef={(el) => (inputRefs.current[12] = el)}
                        onKeyDown={async (e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();

                            handleAddButtonClick();
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
                        value={netRate === 0 ? "" : netRate}
                        sx={{
                          minWidth: "65px",
                          width: "100%",
                          '& .MuiInputBase-input': {
                            textAlign: 'center',
                          },
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
                        value={margin === 0 ? "" : margin}
                        sx={{
                          minWidth: "40px",
                          width: "100%",
                          '& .MuiInputBase-input': {
                            textAlign: 'center',
                          },
                        }}
                        onChange={(e) => {
                          setMargin(e.target.value);
                        }}
                      />
                    </td>

                    <td className="total">
                      <span className="font-bold">
                        {ItemTotalAmount.toFixed(2)}
                      </span>
                    </td>
                  </tr>

                  {loading && (
                    <div className="loader-container">
                      <Loader />
                    </div>
                  )}

                  {isLoading ? (
                    <tr>
                      <td colSpan={15} style={{ padding: "20px" }}>
                        <div className="loader-container">
                          <Loader />
                        </div>
                      </td>
                    </tr>
                  ) : (ItemPurchaseList?.item?.map((item, index) => (
                    <tr
                      key={item.id}
                      onClick={() => {
                        setSelectedIndex(index);
                        handleEditClick(item);
                      }}
                      className={`item-List cursor-pointer ${index === selectedIndex ? "highlighted-row" : ""}`}
                      style={{ borderBottom: index !== ItemPurchaseList.item.length - 1 ? '1px solid #e0e0e0' : 'none', }}
                    >
                      <td style={{ display: "flex", gap: "5px", textAlign: "left", verticalAlign: "left" }}>
                        <div>
                          <BorderColorIcon
                            style={{ color: "var(--color1)" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClick(item);
                            }}
                          />
                          <DeleteIcon
                            style={{ color: "var(--color6)" }}
                            className="delete-icon bg-none"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteOpen(item.id);
                            }}
                          />
                        </div>
                        <span style={{ alignSelf: "center" }}>
                          {item.iteam_name ? item.iteam_name : "-----"}
                        </span>
                      </td>
                      <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                        {item.weightage ? item.weightage : "-----"}
                      </td>
                      <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                        {item.batch_number ? item.batch_number : "-----"}
                      </td>
                      <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                        {item.expiry ? item.expiry : "-----"}
                      </td>
                      <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                        {item.mrp ? item.mrp : "-----"}
                      </td>
                      <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                        {item.qty ? item.qty : "-----"}
                      </td>
                      <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                        {item.free_qty ? item.free_qty : "-----"}
                      </td>
                      <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                        {item.ptr ? item.ptr : "-----"}
                      </td>
                      <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                        {item.discount ? item.discount : "-----"}
                      </td>
                      <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                        {item.base_price ? item.base_price : "-----"}
                      </td>
                      <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                        {item.gst ? item.gst : "-----"}
                      </td>
                      <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                        {item.location ? item.location : "-----"}
                      </td>
                      <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                        {item.net_rate ? item.net_rate : "-----"}
                      </td>
                      <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                        {item.margin ? item.margin : "-----"}
                      </td>
                      <td className="total" style={{ fontWeight: "bold", textAlign: "center", verticalAlign: "middle" }}>
                        {item.total_amount ? item.total_amount : "-----"}
                      </td>
                    </tr>
                  ))
                  )}
                </tbody>
              </table>
            </div>

            {/*<============================================== total and other details  =============================================> */}

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
                overflow: "auto",
                left: "0",
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

                  <span style={{ fontWeight: 600 }}>
                    {totalGst ? totalGst : 0}{" "}
                  </span>
                </div>
                <div
                  className="gap-2 invoice_total_fld"
                  style={{ display: "flex" }}
                >
                  <label className="font-bold">Total Qty : </label>
                  <span style={{ fontWeight: 600 }}>
                    {" "}
                    {totalQty ? totalQty : 0} +&nbsp;
                    <span className="">{totalFree ? totalFree : 0} Free</span>
                  </span>
                </div>
                <div
                  className="gap-2 invoice_total_fld"
                  style={{ display: "flex" }}
                >
                  <label className="font-bold">Total Base : </label>
                  <span style={{ fontWeight: 600 }}>
                    {" "}
                    {totalBase ? totalBase : 0}
                  </span>
                </div>
                <div
                  className="gap-2 invoice_total_fld"
                  style={{ display: "flex" }}
                >
                  <label className="font-bold">Total Net Rate : </label>
                  <span style={{ fontWeight: 600 }}>
                    &#8377; {totalNetRate ? totalNetRate : 0}
                  </span>
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
                  onClick={toggleModal}
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
                    {netAmount.toFixed(2)}
                    <FaCaretUp />
                  </span>
                </div>

                <Modal
                  show={isModalOpen}
                  onClose={toggleModal}
                  size="lg"
                  position="bottom-center"
                  className="modal_amount"
                // style={{ width: "50%" }}
                >
                  <div
                    style={{
                      backgroundColor: "var(--COLOR_UI_PHARMACY)",
                      color: "white",
                      padding: "20px",
                      fontSize: "larger",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <h2 style={{ textTransform: "uppercase" }}>invoice total</h2>
                    <IoMdClose onClick={toggleModal} cursor={"pointer"} size={30} />
                  </div>
                  <div
                    style={{
                      background: "white",
                      padding: "20px",
                      width: "100%",
                      maxWidth: "600px",
                      margin: "0 auto",
                      lineHeight: "2.5rem",
                    }}
                  >
                    <div
                      className=""
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <label className="font-bold">Total Amount : </label>
                      <span style={{ fontWeight: 600 }}>
                        {finalTotalAmount?.toFixed(2)}
                      </span>
                    </div>

                    <div
                      className=""
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <label className="font-bold">Other Amount : </label>
                      <span style={{ fontWeight: 600 }}>
                        <Input
                          type="text"
                          value={otherAmt}

                          onChange={(e) => {
                            const val = e.target.value;
                            if (/^-?\d*\.?\d*$/.test(val)) {
                              setOtherAmt(val);
                            }
                          }} size="small"
                          style={{
                            width: "70px",
                            background: "none",
                            // borderBottom: "1px solid gray",
                            justifyItems: "end",
                            outline: "none",
                          }}
                          sx={{
                            "& .MuiInputBase-root": {
                              height: "35px",
                            },
                            "& .MuiInputBase-input": { textAlign: "end" },
                          }}
                        />
                      </span>
                    </div>


                    <div
                      className=""
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        paddingBottom: "5px",
                      }}
                    >
                      <label className="font-bold">CN Amount : </label>
                      <span
                        style={{
                          fontWeight: 600,
                          color: "#F31C1C",
                        }}
                      >
                        -{finalCnAmount?.toFixed(2)}
                      </span>
                    </div>

                    <div
                      className="font-bold"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        paddingBottom: "5px",
                        borderTop:
                          "1px solid var(--toastify-spinner-color-empty-area)",
                        paddingTop: "5px",
                      }}
                    >
                      <label className="font-bold">Round Off : </label>
                      <span>
                        {" "}
                        {roundOffAmount === "0.00"
                          ? roundOffAmount
                          : roundOffAmount < 0
                            ? `-${Math.abs(roundOffAmount.toFixed(2))}`
                            : `${Math.abs(roundOffAmount.toFixed(2))}`}
                      </span>
                    </div>

                    <div
                      className=""
                      style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                        justifyContent: "space-between",
                        borderTop: "2px solid var(--COLOR_UI_PHARMACY)",
                        paddingTop: "5px",
                      }}
                    >
                      <label className="font-bold">Net Amount: </label>
                      <span
                        style={{
                          fontWeight: 800,
                          fontSize: "22px",
                          color: "var(--COLOR_UI_PHARMACY)",
                        }}
                      >
                        {netAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </Modal>
              </div>
            </div>

          </div>

          {/*<================================================== CN amount PopUp Box  =================================================> */}

          <Dialog open={openAddPopUp} className="custom-dialog max-991">
            <DialogTitle id="alert-dialog-title" className="secondary">
              Add Amount
            </DialogTitle>
            <IconButton
              aria-label="close"
              onClick={resetAddDialog}
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
                <div className="bg-white">
                  <div className="bg-white">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>
                            <input
                              type="checkbox"
                              onChange={handleSelectAll}
                              checked={
                                selectedRows.length ===
                                purchaseReturnPending.length &&
                                purchaseReturnPending.length > 0
                              }
                            />
                          </th>
                          <th>Bill No</th>
                          <th>Bill Date</th>
                          <th>Amount</th>
                          <th>Adjust CN Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {purchaseReturnPending.length === 0 ? (
                          <tr>
                            <td colSpan={5}>No data found</td>
                          </tr>
                        ) : (
                          purchaseReturnPending.map((row, index) => (
                            <tr key={index}>
                              <td>
                                <input
                                  type="checkbox"
                                  onChange={(e) =>
                                    handleRowSelect(row.id, row.total_amount || 0)
                                  }
                                  checked={selectedRows.includes(row.id)}
                                />
                              </td>
                              <td>{row.bill_no}</td>
                              <td>{row.bill_date}</td>
                              <td>{row.total_amount}</td>
                              <td>
                                <OutlinedInput
                                  type="number"
                                  value={cnTotalAmount[row.id] || ""}
                                  onChange={(e) =>
                                    handleCnAmountChange(
                                      row.id,
                                      e.target.value,
                                      row.total_amount
                                    )
                                  }
                                  startAdornment={
                                    <InputAdornment position="start">
                                      Rs.
                                    </InputAdornment>
                                  }
                                  sx={{ width: 130, m: 1 }}
                                  size="small"
                                  disabled={!selectedRows.includes(row.id)}
                                />
                              </td>
                            </tr>
                          ))
                        )}
                        <tr>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td>Selected Bills Amount</td>
                          <td>
                            <span
                              style={{
                                fontSize: "14px",
                                fontWeight: 800,
                                color: "black",
                              }}
                            >
                              Rs.{(parseFloat(cnAmount) || 0).toFixed(2)}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                autoFocus
                variant="contained"
                style={{ backgroundColor: "#3f6212", color: "white" }}
                onClick={handleCnAmount}
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>
          {/*<==================================================== Bulk Import csv ===================================================> */}

          <Dialog open={openFile} className="custom-dialog">
            <DialogTitle className="primary">Import Item</DialogTitle>
            <IconButton
              aria-label="close"
              onClick={() => {
                setOpenFile(false);
              }}
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
                  className="bg-white"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                    marginBlock: "20px",
                  }}
                >
                  {/* Different dropdowns for each mode */}
                  {dialogMode === "csv" && (
                    <FormControl size="small" sx={{ width: 200 }}>
                      <InputLabel>Select Software (CSV)</InputLabel>
                      <Select
                        value={importConpany}
                        onChange={(event) => setImportConpany(event.target.value)}
                        label="Select Software (CSV)"
                        autoFocus
                      >
                        {Object.keys(optionForCsv).map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}

                  {dialogMode === "stock" && (
                    <FormControl size="small" sx={{ width: 200 }}>
                      <InputLabel>Select Software (Stock)</InputLabel>
                      <Select
                        value={importConpany}
                        onChange={(event) => setImportConpany(event.target.value)}
                        label="Select Software (Stock)"
                        autoFocus
                      >
                        {Object.keys(optionForStock).map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}

                  {/* File Upload */}
                  <div>
                    <input
                      className="File-upload"
                      type="file"
                      accept=".csv, .xls, .xlsx"
                      id="file-upload"
                      onChange={handleFileSelect}
                    />

                  </div>
                </div>

                <Button
                  onClick={handleDownload}
                  style={{ backgroundColor: "#3f6212", color: "white" }}
                >
                  <CloudDownloadIcon className="mr-2 " />
                  Download Sample
                </Button>
              </DialogContentText>
            </DialogContent>

            <DialogActions>
              <Button
                autoFocus
                style={{ backgroundColor: "#3f6212", color: "white" }}
                type="success"
                onClick={handleFileUpload}
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>

          {/*<================================================= add Distributor PopUp Box  ==============================================> */}

          <Dialog open={openAddDistributorPopUp} className="custom-dialog add-distributor-dialog modal_991">
            <DialogTitle id="alert-dialog-title" className="primary">
              Add Distributor
            </DialogTitle>
            <IconButton
              aria-label="close"
              onClick={() => {
                setOpenAddDistributorPopUp(false);
                setAddDistributorAddress("");
                setAddDistributorMobile("");
                setAddDistributorName("");
                setAddDistributorNo("");
              }}

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
                <div className="bg-white" style={{
                  alignItems: "center",
                  gap: "15px",
                  overflow: "hidden"
                }}>
                  <div className="mainform bg-white rounded-lg">

                    {/* Row 1: Distributor Name + GST */}
                    <div className="row gap-5">

                      {/* Distributor Name */}
                      <div className="fields add_new_item_divv">
                        <label className="label secondary">Distributor Name<span className="text-red-600  ">*</span></label>
                        <Autocomplete
                          freeSolo
                          options={distributorList.map(d => d.name)}
                          value={addDistributorName}
                          onInputChange={(e, newValue) => {
                            setAddDistributorName(newValue.toUpperCase());
                          }}
                          onChange={(e, selectedValue) => {
                            const found = distributorList.find(d => d.name === selectedValue);
                            if (found) {
                              setAddDistributorName(found.name);
                              setAddDistributorMobile(found.phone_number);
                              setAddDistributorNo(found.gst);
                              setAddDistributorAddress(found.area || "");
                            }
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}

                              size="small"
                              inputRef={(el) => (inputRefs.current[16] = el)}
                              onKeyDown={(e) => handleKeyDown(e, 16)}
                              inputProps={{
                                ...params.inputProps,
                                style: { textTransform: "uppercase" },
                                autoComplete: "off",
                              }}
                            />
                          )}
                        />
                      </div>

                    </div>
                    <div className="row gap-5">

                      {/* Mobile Number */}
                      <div className="fields add_new_item_divv">
                        <label className="label secondary">Mobile Number<span className="text-red-600  ">*</span></label>
                        <Autocomplete
                          freeSolo
                          options={distributorList.map(d => d.phone_number)}
                          value={addDistributorMobile}
                          onInputChange={(e, newValue) => {
                            const numericValue = newValue.replace(/[^0-9]/g, "").slice(0, 10);

                            // Check if number already exists
                            const exists = distributorList.some(d => d.phone_number === numericValue);
                            if (exists) {
                              // Optional: show alert or set error state
                              console.warn("This number already exists!");
                            }

                            setAddDistributorMobile(numericValue);
                          }}
                          onChange={(e, selectedValue) => {
                            const found = distributorList.find(d => d.phone_number === selectedValue);
                            if (found) {
                              setAddDistributorName(found.name);
                              setAddDistributorMobile(found.phone_number);
                              setAddDistributorNo(found.gst);
                              setAddDistributorAddress(found.area || "");
                            }
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              inputRef={(el) => (inputRefs.current[17] = el)}
                              onKeyDown={(e) => handleKeyDown(e, 17)}
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: "off",
                                inputMode: "numeric",
                                maxLength: 10,
                                pattern: "[0-9]{10}",
                                onInput: (e) => {
                                  e.target.value = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
                                }
                              }}
                              error={distributorList.some(d => d.phone_number === addDistributorMobile)}
                              helperText={distributorList.some(d => d.phone_number === addDistributorMobile) ? "This number already exists" : ""}
                            />
                          )}
                        />
                      </div>
                      {/* GST Number */}
                      <div className="fields add_new_item_divv">
                        <label className="label secondary">Distributor GSTIN Number<span className="text-red-600  ">*</span></label>
                        <Autocomplete
                          freeSolo
                          options={distributorList.map(d => d.gst)}
                          getOptionLabel={(option) => (typeof option === "string" ? option : "")}
                          value={addDistributorNo}
                          onInputChange={(e, newValue) => {
                            setAddDistributorNo(newValue.toUpperCase());
                          }}
                          onChange={(e, selectedValue) => {
                            const found = distributorList.find(d => d.gst === selectedValue);
                            if (found) {
                              setAddDistributorName(found.name);
                              setAddDistributorMobile(found.phone_number);
                              setAddDistributorNo(found.gst);
                              setAddDistributorAddress(found.area || "");
                            }
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}

                              size="small"
                              inputRef={(el) => (inputRefs.current[18] = el)}
                              onKeyDown={(e) => handleKeyDown(e, 18)}
                              inputProps={{
                                ...params.inputProps,
                                style: { textTransform: "uppercase" },
                                autoComplete: "off",
                                maxLength: 15,
                                onInput: (e) => {
                                  e.target.value = e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 15);
                                }
                              }}

                            />
                          )}
                        />

                      </div>
                    </div>

                    {/* Row 3: Mobile + Address */}
                    <div className="row gap-5">


                      {/* Address */}
                      <div className="fields add_new_item_divv">
                        <label className="label secondary">Address</label>
                        <TextField
                          autoComplete="off"
                          size="small"
                          value={addDistributorAddress}
                          onChange={(e) => {
                            const value = e.target.value;
                            const capitalized = value.charAt(0).toUpperCase() + value.slice(1);
                            setAddDistributorAddress(capitalized);
                          }}
                          inputRef={(el) => (inputRefs.current[19] = el)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddNewDistributor();
                            }
                          }}
                        />
                      </div>

                    </div>

                    {/* Add Button */}
                    <div className="row" style={{
                      justifyContent: "flex-end",
                      paddingRight: "4px",
                      paddingTop: "8%",
                    }}>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "#3f6212",
                          "&:hover": { backgroundColor: "#3f6212" },
                        }}
                        onClick={handleAddNewDistributor}
                        ref={addButtonref}
                      >
                        <ControlPointIcon className="mr-2" />
                        Add Distributor
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContentText>
            </DialogContent>
          </Dialog>

          {/*<==================================================== add item PopUp Box  ===================================================> */}

          <Dialog open={openAddItemPopUp} className="custom-dialog add-item-dialog modal_991 ">
            <DialogTitle id="alert-dialog-title" className="primary">
              Add New Item
            </DialogTitle>
            <IconButton
              aria-label="close"
              onClick={resetAddDialog}
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
                <div className="bg-white">
                  <div className="mainform bg-white rounded-lg">
                    <div className="row gap-3 sm:flex-nowrap flex-wrap">
                      <div className="fields add_new_item_divv">
                        <label className="label secondary">Item Name <span className="text-red-600  ">*</span></label>
                        <TextField
                          autoComplete="off"
                          id="outlined-number"
                          size="small"
                          value={addItemName}
                          autoFocus
                          onChange={(e) =>
                            setAddItemName(e.target.value.toUpperCase())
                          }
                          inputRef={(el) => (inputRefs.current[13] = el)}
                          onKeyDown={(e) => handleKeyDown(e, 13)}
                        />
                      </div>
                    </div>

                    <div className="row gap-3 sm:flex-nowrap flex-wrap">

                      <div className="fields add_new_item_divv">
                        <label className="label  secondary">Barcode</label>
                        <TextField
                          autoComplete="off"
                          id="outlined-number"
                          type="number"
                          size="small"
                          value={addBarcode}
                          onChange={(e) => setAddBarcode(Number(e.target.value))}
                          inputRef={(el) => (inputRefs.current[14] = el)}
                          onKeyDown={(e) => handleKeyDown(e, 14)}
                        />
                      </div>
                      <div className="fields add_new_item_divv">
                        <label className="label secondary">Unit <span className="text-red-600  ">*</span></label>
                        <TextField
                          autoComplete="off"
                          id="outlined-number"
                          type="number"
                          size="small"
                          value={addUnit}
                          onChange={(e) => setAddUnit(e.target.value)}
                          inputRef={(el) => (inputRefs.current[15] = el)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault(); // Prevent form submission
                              handleAddNewItem();
                            }
                          }}
                        />
                      </div>
                      <div className="fields add_new_item_divv">
                        <label className="label secondary">Pack</label>
                        <TextField
                          autoComplete="off"
                          disabled
                          id="outlined-number"
                          size="small"
                          value={`1 * ${addUnit} `}
                        />
                      </div>
                    </div>
                    <div
                      className="row mt-3"
                      style={{
                        justifyContent: "flex-end",
                        paddingRight: "4px",
                      }}
                    >
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "#3f6212",
                          "&:hover": {
                            backgroundColor: "#3f6212",
                          },
                        }}
                        onClick={handleAddNewItem}
                        ref={addButtonref}
                      >
                        <ControlPointIcon className="mr-2" />
                        Add New Item
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContentText>
            </DialogContent>
          </Dialog>

          {/*<==================================================== Item History Modal  ===================================================> */}
          <Dialog
            open={openItemHistory}
            onClose={() => setOpenItemHistory(false)}
            className="custom-dialog"
            sx={{
              "& .MuiDialog-container": {
                "& .MuiPaper-root": {
                  width: "80%",
                  maxWidth: "1200px",
                },
              },
            }}
          >
            <DialogTitle id="alert-dialog-title" className="secondary">
              Item Purchase History
            </DialogTitle>
            <IconButton
              aria-label="close"
              onClick={() => setOpenItemHistory(false)}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: "#ffffff",
              }}
            >
              <CloseIcon />
            </IconButton>
            <DialogContent sx={{ padding: 0 }}>
              <DialogContentText id="alert-dialog-description" sx={{ margin: 0 }}>
                {isLoading ? (
                  <div className="flex justify-center items-center p-8">
                    <CircularProgress />
                  </div>
                ) : (
                  <div
                    className="flex"
                    style={{ flexDirection: "column", gap: "0" }}
                  >
                    <div className="custom-scroll-sale" style={{ width: "100%" }}>
                      <table className="custom-table" style={{ background: "none", margin: 0 }}>
                        <thead>
                          <tr className="customtable">
                            <th>
                              <div className="headerStyle" style={{ color: 'black', fontWeight: 600 }}>
                                <span>Distributor</span>
                              </div>
                            </th>
                            <th>
                              <div className="headerStyle" style={{ color: 'black', fontWeight: 600 }}>
                                <span>Bill No</span>
                              </div>
                            </th>
                            <th>
                              <div className="headerStyle" style={{ color: 'black', fontWeight: 600 }}>
                                <span>Bill Date</span>
                              </div>
                            </th>
                            <th>
                              <div className="headerStyle" style={{ color: 'black', fontWeight: 600 }}>
                                <span>Unit</span>
                              </div>
                            </th>
                            <th>
                              <div className="headerStyle" style={{ color: 'black', fontWeight: 600 }}>
                                <span>Batch</span>
                              </div>
                            </th>
                            <th>
                              <div className="headerStyle" style={{ color: 'black', fontWeight: 600 }}>
                                <span>Expiry Date</span>
                              </div>
                            </th>
                            <th>
                              <div className="headerStyle" style={{ color: 'black', fontWeight: 600 }}>
                                <span>Qty</span>
                              </div>
                            </th>
                            <th>
                              <div className="headerStyle" style={{ color: 'black', fontWeight: 600 }}>
                                <span>Free Qty</span>
                              </div>
                            </th>
                            <th>
                              <div className="headerStyle" style={{ color: 'black', fontWeight: 600 }}>
                                <span>Discount</span>
                              </div>
                            </th>
                            <th>
                              <div className="headerStyle" style={{ color: 'black', fontWeight: 600 }}>
                                <span>Rate</span>
                              </div>
                            </th>
                            <th>
                              <div className="headerStyle" style={{ color: 'black', fontWeight: 600 }}>
                                <span>MRP</span>
                              </div>
                            </th>
                            <th>
                              <div className="headerStyle" style={{ color: 'black', fontWeight: 600 }}>
                                <span>Margin</span>
                              </div>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {itemHistoryData && itemHistoryData.length > 0 ? (
                            itemHistoryData.map((item) => (
                              <tr
                                hover
                                tabIndex={-1}
                                key={item.id}
                                onClick={() => { history.push(`/purchaseView/${item.id}`) }}
                              >
                                <td>{item.party_name}</td>
                                <td>{item.bill_no}</td>
                                <td>{item.bill_date}</td>
                                <td>{item.unit}</td>
                                <td>{item.batch_name}</td>
                                <td>{item.expiry_date}</td>
                                <td>{item.qty}</td>
                                <td>{item.free_qty}</td>
                                <td>{item.sch}</td>
                                <td>{item.rate}</td>
                                <td>{item.mrp}</td>
                                <td>{item.margin}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan={12}
                                style={{
                                  textAlign: "center",
                                  fontSize: "16px",
                                  fontWeight: 600,
                                  padding: "20px"
                                }}
                              >
                                No history found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </DialogContentText>
            </DialogContent>
          </Dialog>

          {/*<======================================================  Delete PopUP   =====================================================> */}

          <div
            id="modal"
            value={IsDelete}
            className={`fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif] ${IsDelete ? "block" : "hidden"
              }`}
          >
            <div />
            <div className="w-full max-w-md bg-white shadow-lg rounded-md p-4 relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 cursor-pointer absolute top-4 right-4 fill-current text-gray-600 hover:text-red-500 "
                viewBox="0 0 24 24"
                onClick={() => setIsDelete(false)}
              >
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z" />
              </svg>
              <div className="my-4 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-12 fill-red-500 inline"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
                    data-original="#000000"
                  />
                  <path
                    d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
                    data-original="#000000"
                  />
                </svg>
                <h4 className=" font-semibold mt-6 first-letter:uppercase">
                  <span style={{ textTransform: "none" }}>
                    Are you sure you want to delete it?
                  </span>
                </h4>
              </div>
              <div className="flex gap-5 justify-center">
                <button
                  type="submit"
                  className="px-6 py-2.5 w-44 items-center rounded-md text-white text-sm font-semibold border-none outline-none bg-red-500 hover:bg-red-600 active:bg-red-500"
                  onClick={() => handleDeleteItem(ItemId)}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="px-6 py-2.5 w-44 rounded-md text-black text-sm font-semibold border-none outline-none bg-gray-200 hover:bg-gray-900 hover:text-white"
                  onClick={() => setIsDelete(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>

          {/*<================================================== Leave page  PopUp Box  =================================================> */}

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
export default AddPurchaseBill;
