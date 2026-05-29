import Header from "../../../Header";
import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import DeleteIcon from "@mui/icons-material/Delete";
import DatePicker from "react-datepicker";
import Autocomplete from "@mui/material/Autocomplete";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { FaPlusCircle, FaPray, FaShippingFast, FaWalking } from "react-icons/fa";
import {
  Box,
  CircularProgress,
  Input,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
import { BsLightbulbFill } from "react-icons/bs";
import SearchIcon from "@mui/icons-material/Search";
import { Button, InputAdornment, ListItemText, TextField } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { GoInfo } from "react-icons/go";
import { toast, ToastContainer } from "react-toastify";
import { Prompt } from "react-router-dom/cjs/react-router-dom";
import { VscDebugStepBack } from "react-icons/vsc";
import { FaCaretUp, FaCropSimple, FaStore } from "react-icons/fa6";
import { Modal } from "flowbite-react";
import { IoMdClose } from "react-icons/io";
import SaveIcon from "@mui/icons-material/Save";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import { IoCaretDown } from "react-icons/io5";
import Checkbox from "@mui/material/Checkbox";
import { FaCloudMoon } from "react-icons/fa";
import { FaSun } from "react-icons/fa";
import { FaCloudSun } from "react-icons/fa";
import { FaCrown } from "react-icons/fa";

import TipsModal from "../../../../componets/Tips/TipsModal";
import Loader from "../../../../componets/loader/Loader";

const addSale = () => {
  const token = localStorage.getItem("token");
  const searchInputRef = useRef(null);
  const itemNameInputRef = useRef(null);
  const barcodeInputRef = useRef(null);
  const unitInputRef = useRef(null);
  const inputRef1 = useRef(null);
  const inputRef2 = useRef(null);
  const inputRef3 = useRef(null);
  const inputRef4 = useRef(null);
  const inputRef5 = useRef(null);
  const inputRef6 = useRef(null);
  const inputRef7 = useRef(null);
  const inputRef8 = useRef(null);
  const inputRef9 = useRef(null);
  const inputRef10 = useRef(null);

  const batchCache = useRef(new Map());
  const itemCache = useRef(new Map());
  const searchAbortController = useRef(null);
  const batchAbortController = useRef(null);
  const lastSearchTerm = useRef("");

  const lastInputTime = useRef(Date.now());

  const [item, setItem] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [saleItemId, setSaleItemId] = useState(null);
  const [itemId, setItemId] = useState(null);
  const history = useHistory();
  const paymentOptions = [
    { id: 1, label: "Cash" },
    { id: 2, label: "UPI" },
  ];
  const pickupOptions = [
    { id: 1, label: "Counter", icon: <FaStore /> },
    { id: 2, label: "Pickup", icon: <FaWalking /> },
    { id: 3, label: "Delivery", icon: <FaShippingFast /> },
  ];
  const [todayLoyltyPoint, setTodayLoyaltyPoint] = useState(0);
  const userId = localStorage.getItem("userId");
  const [customer, setCustomer] = useState(null);
  const [paymentType, setPaymentType] = useState("cash");
  const [pickup, setPickup] = useState("Counter");
  const [id, setId] = useState("");
  const [error, setError] = useState({ customer: "" });
  const [expiryDate, setExpiryDate] = useState("");
  const [selectedEditItemId, setSelectedEditItemId] = useState("");
  const [mrp, setMRP] = useState("");
  const [base, setBase] = useState("");
  const [barcode, setBarcode] = useState("");
  const [batchListData, setBatchListData] = useState([]);
  const [isAlternative, setIsAlternative] = useState(false);
  const [doctorName, setDoctorName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [randomNumber, setRandomNumber] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [ItemSaleList, setItemSaleList] = useState({ sales_item: [] });
  const [totalAmount, setTotalAmount] = useState(0);
  const [qty, setQty] = useState("");
  const [maxQty, setMaxQty] = useState("");
  const [tempQty, setTempQty] = useState("");
  const [uniqueItems, setUniqueItems] = useState([])
  const [order, setOrder] = useState("");
  const [roundOff, setRoundOff] = useState(0);
  const [itemEditID, setItemEditID] = useState(0);
  const [gst, setGst] = useState("");
  const [batch, setBatch] = useState("");
  const [unit, setUnit] = useState("");
  const [finalDiscount, setFinalDiscount] = useState(0);
  const [openAddPopUp, setOpenAddPopUp] = useState(false);
  const [openPurchaseHistoryPopUp, setOpenPurchaseHistoryPopUp] = useState(false);
  const [highlightedRowId, setHighlightedRowId] = useState(null);
  const [openCustomer, setOpenCustomer] = useState(false);
  const [doctor, setDoctor] = useState(null);
  const [clinic, setClinic] = useState();
  const [netAmount, setNetAmount] = useState(null);
  const [loc, setLoc] = useState("");
  const [itemAmount, setItemAmount] = useState(null);
  let defaultDate = new Date();
  const [IsDelete, setIsDelete] = useState(false);
  const [searchItem, setSearchItem] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [openAddItemPopUp, setOpenAddItemPopUp] = useState(false);
  const [openReminderPopUp, setOpenReminderPopUp] = useState(false);
  const [itemList, setItemList] = useState([]);
  const [customerDetails, setCustomerDetails] = useState([]);
  const [doctorData, setDoctorData] = useState([]);
  const [value, setValue] = useState("");
  const [address, setAddress] = useState("");
  defaultDate.setDate(defaultDate.getDate() + 3);
  const [selectedEditItem, setSelectedEditItem] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [totalgst, setTotalgst] = useState(0);
  const [totalBase, setTotalBase] = useState(0);
  const [marginNetProfit, setMarginNetProfit] = useState(0);
  const [totalMargin, setTotalMargin] = useState(0);
  const [totalNetRate, setTotalNetRate] = useState(0);
  const [dueAmount, setDueAmount] = useState(null);
  const [givenAmt, setGivenAmt] = useState(null);
  const [otherAmt, setOtherAmt] = useState(0);
  const [searchItemID, setSearchItemID] = useState("");
  const [bankData, setBankData] = useState([]);
  const [CustomerSearchQuery, setCustomerSearchQuery] = useState("");
  const [searchDoctor, setSearchDoctor] = useState("");
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [discountAmount, setDiscountAmount] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [unsavedItems, setUnsavedItems] = useState(false);
  const [nextPath, setNextPath] = useState("");
  const [ptr, setPtr] = useState();
  const [discount, setDiscount] = useState();
  const [barcodeItemName, setBarcodeItemName] = useState("");
  const [previousLoyaltyPoints, setPreviousLoyaltyPoints] = useState(0);
  const [loyaltyVal, setLoyaltyVal] = useState(0);
  const [maxLoyaltyPoints, setMaxLoyaltyPoints] = useState(0);
  const [addItemName, setAddItemName] = useState("");
  const [addBarcode, setAddBarcode] = useState("");
  const [addUnit, setAddUnit] = useState("");
  const [barcodeBatch, setBarcodeBatch] = useState("");
  const [billNo, setBillNo] = useState(localStorage.getItem("BillNo"));
  const tableRef = useRef(null);
  const [openCustomerHistory, setOpenCustomerHistory] = useState(false);
  const [customerHistoryData, setCustomerHistoryData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitTimeout, setSubmitTimeout] = useState(null);
  const [billSaveDraft, setBillSaveDraft] = useState("0");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const toggleModal = async () => {
    if (isModalOpen && netAmount >= 0) {
      await updateTodayPoints();
    }
    setIsModalOpen(!isModalOpen);
  };


  /*<=================================================== Input ref on keydown enter ==========================================> */

  const [selectedIndex, setSelectedIndex] = useState(-1);
  const tableRef1 = useRef(null);
  const [isAutocompleteDisabled, setAutocompleteDisabled] = useState(true);

  const inputRefs = useRef([]);
  const dateRefs = useRef([]);

  const submitButtonRef = useRef(null);
  const addButtonref = useRef(null);

  const timeoutRef = useRef(null);

  const [autoCompleteOpen, setAutoCompleteOpen] = useState(false);

  const [autocompleteKey, setAutocompleteKey] = useState(0);
  const [pillTimes, setPillTimes] = useState({});
  const [checkedItems, setCheckedItems] = useState({});
  const [showModal, setShowModal] = useState(false);

  const [itemHistoryData, setItemHistoryData] = useState(null);
  const [openItemHistory, setOpenItemHistory] = useState(false);

  /*<============================================ disable autocomplete to focus when tableref is focused  ===================================> */
  useEffect(() => {
    const handleTableFocus = () => setAutocompleteDisabled(false);
    const handleTableBlur = () => setAutocompleteDisabled(true);

    const tableElement = tableRef1.current;
    if (tableElement) {
      tableElement.addEventListener("focus", handleTableFocus);
      tableElement.addEventListener("blur", handleTableBlur);
    }

    return () => {
      if (tableElement) {
        tableElement.removeEventListener("focus", handleTableFocus);
        tableElement.removeEventListener("blur", handleTableBlur);
      }
    };
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {

      if (isVisible && !selectedOption && !searchItem && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
        e.preventDefault();

        setTimeout(() => {
          if (tableRef1.current) {
            tableRef1.current.focus();
          }
        }, 100);
        return;
      }


      if (!ItemSaleList?.sales_item?.length || isVisible) return;

      const isInputFocused = document.activeElement.tagName === "INPUT";
      const isTableFocused = document.activeElement === tableRef1.current;

      if (isInputFocused && !isTableFocused) return;

      e.preventDefault();

      setSelectedIndex((prevIndex) => {
        if (prevIndex === -1) {

          return e.key === "ArrowDown" ? 0 : ItemSaleList.sales_item.length - 1;
        }

        if (e.key === "ArrowDown") {
          return Math.min(prevIndex + 1, ItemSaleList.sales_item.length - 1);
        } else if (e.key === "ArrowUp") {
          return Math.max(prevIndex - 1, 0);
        }

        return prevIndex;
      });

      if (e.key === "Enter" && selectedIndex !== -1) {
        const selectedRow = ItemSaleList.sales_item[selectedIndex];
        if (selectedRow) handleEditClick(selectedRow);
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [ItemSaleList.sales_item, selectedIndex, isVisible, selectedOption, searchItem]);
  /*<============================================================= handle shortcut  ====================================================> */

  useEffect(() => {
    const handleKeyDown = async (event) => {
      if (!event.altKey || event.repeat) return;

      const key = event.key.toLowerCase();
      event.preventDefault();
      if (isSubmitting) return;

      switch (key) {
        case "s":
          if (isSubmitting) return;
          setBillSaveDraft("1");
          await handleSubmit("1");
          break;

        case "g":
          setBillSaveDraft("0");
          await handleSubmit("0");
          break;

        case "p":
          setBillSaveDraft("2");
          await handleSubmit("1");
          break;

        case "m":
          setSearchItem("");
          setValue("");
          setItem("");
          setItemId("");
          resetValue();
          setExpiryDate("");
          setMRP("");
          setBase("");
          setGst("");
          setQty("");
          setLoc("");
          setUnit("");
          setBatch("");
          setIsVisible(false);
          tableRef1.current?.blur();
          setSelectedEditItem(null);
          setIsEditMode(false);
          setSelectedEditItemId("");
          setItemEditID(0);
          resetValue();
          searchInputRef.current?.focus();

          if (isVisible && value && !batch) {
            tableRef.current.focus();
            if (!item) return;
          }
          setSelectedOption(null);
          if (searchInputRef.current) {
            searchInputRef.current.focus();
            setSelectedIndex(-1);
          }
          break;

        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [billNo, ItemSaleList, isSubmitting, netAmount, totalAmount, loyaltyVal, customer]);


  /*<========================================================== handle table and keyboard navigation  =====================================================> */

  const handleTableKeyDown = (e) => {
    const rows = Array.from(
      tableRef.current?.querySelectorAll("tr.cursor-pointer") || []
    );
    let currentIndex = rows.findIndex((row) => row === document.activeElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setAutoCompleteOpen(false);
      if (rows.length > 0) {
        const nextIndex = currentIndex + 1 < rows.length ? currentIndex + 1 : 0;
        rows[nextIndex]?.focus();
        setHighlightedRowId(rows[nextIndex]?.dataset.id);
      }
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setAutoCompleteOpen(false);
      if (rows.length > 0) {
        const prevIndex =
          currentIndex - 1 >= 0 ? currentIndex - 1 : rows.length - 1;
        rows[prevIndex]?.focus();
        setHighlightedRowId(rows[prevIndex]?.dataset.id);
      }
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (currentIndex >= 0 && rows[currentIndex]) {
        const itemId = rows[currentIndex].getAttribute("data-id");
        const item = batchListData.find(
          (item) => String(item.id) === String(itemId)
        );
        if (item) {
          handlePassData(item);
          setHighlightedRowId(itemId);
          setAutoCompleteOpen(false);
        }
      }
    }
  };

  {/*<================================================================= row select    ================================================================> */ }

  useEffect(() => {
    if (isVisible && tableRef.current) {
      const firstRow = tableRef.current.querySelector("tr.cursor-pointer");
      if (firstRow) {
        firstRow.focus();
        setHighlightedRowId(firstRow.getAttribute("data-id"));
      }
    }
  }, [isVisible, batchListData]);

  {/*<====================================================================== Autocomplete focus   =====================================================================> */ }

  useEffect(() => {
    function handleDocumentFocus() {
      if (autoCompleteOpen && searchInputRef.current && document.activeElement !== searchInputRef.current) {
        setAutoCompleteOpen(false);
      }
    }
    document.addEventListener('focusin', handleDocumentFocus);
    return () => {
      document.removeEventListener('focusin', handleDocumentFocus);
    };
  }, [autoCompleteOpen]);

  /*<============================================================ utils  ===================================================> */
  const LastPurchaseListcolumns = [
    {
      id: "supplier_name",
      label: "Distributor Name",
      minWidth: 170,
      height: 100,
    },
    { id: "qty", label: "QTY", minWidth: 100 },
    { id: "fr_qty", label: "Free", minWidth: 100 },
    { id: "scheme_account", label: "Sch. Amt", minWidth: 100 },
    { id: "ptr", label: "PTR", minWidth: 100 },
    { id: "mrp", label: "MRP", minWidth: 100 },
    { id: "bill_date", label: "Date", minWidth: 100 },
    { id: "bill_no", label: "Bill No", minWidth: 100 },
  ];

  const itemRowInputOrder = [
    inputRef1, // Unit
    inputRef3, // Batch
    inputRef4, // Expiry
    inputRef5, // MRP
    inputRef6, // Base
    inputRef7, // GST
    inputRef9, // Qty
    inputRef8, // Loc
    inputRef10 // Order
  ];

  const handleKeyDown = (event, index) => {
    if (event.key === "Enter") {
      event.preventDefault();
      for (let i = index + 1; i < itemRowInputOrder.length; i++) {
        const nextRef = itemRowInputOrder[i];
        if (nextRef && nextRef.current && !nextRef.current.disabled) {
          nextRef.current.focus();
          return;
        }
      }
    }
  };



  const hasSehatPlan = (option) =>
    option?.sehat_plan_name && option.sehat_plan_name.trim() !== "";

  const isDateDisabled = (date) => {
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    return date > today;
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

  /*<=============================================== On submit the today point update ===============================================> */

  useEffect(() => {

    if (netAmount) {
      updateTodayPoints()
    }

  }, [netAmount,customer])

  const updateTodayPoints = async () => {
    let data = new FormData();
    data.append("net_amount", netAmount || 0);
    data.append("customer_id", customer?.id ? customer?.id : "");

    try {
      const response = await axios.post("sales-update-today-points", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === 200) {
        const todayPoint = response.data.data[0]?.today_point || 0;
        setTodayLoyaltyPoint(todayPoint);
      }
    } catch (error) {
      console.error("Error updating today points:", error);
         if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
    }
  };

  /*<======================================================= Fetch customer history   ==================================================> */

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

  useEffect(() => {
    const discount = (totalAmount * finalDiscount) / 100;
    setDiscountAmount(discount.toFixed(2));

    if (otherAmt < 0 && Math.abs(otherAmt) > totalAmount) {
      setOtherAmt("");
    } else {


      let loyaltyPointsDeduction = loyaltyVal;
      let calculatedNetAmount =
        totalAmount - discount - loyaltyPointsDeduction + Number(otherAmt);

      if (calculatedNetAmount < 0) {
        setOtherAmt(-(totalAmount - discount - loyaltyPointsDeduction));
        calculatedNetAmount = 0;
      }

      const decimalPart = Number((calculatedNetAmount % 1).toFixed(2));
      const roundedDecimal = decimalPart;
      if (decimalPart < 0.5) {
        setRoundOff((-roundedDecimal).toFixed(2));
        setNetAmount(Math.floor(calculatedNetAmount));
      } else {
        setRoundOff((1 - roundedDecimal).toFixed(2));
        setNetAmount(Math.ceil(calculatedNetAmount));
      }

      const due = givenAmt - calculatedNetAmount;
      setDueAmount(due.toFixed(2));
    }
  }, [
    totalAmount,
    loyaltyVal,
    finalDiscount,
    otherAmt,
    givenAmt,
    barcodeBatch,
  ]);

  const handleOtherAmtChange = (e) => {
    const value = e.target.value;
    const numericValue = isNaN(value) || value === "" ? "" : Number(value);

    if (numericValue >= 0) {
      setOtherAmt(numericValue);
    } else {
      const negativeLimit = -totalAmount;
      if (numericValue < negativeLimit) {
        setOtherAmt(negativeLimit);
      } else {
        setOtherAmt(numericValue);
      }
    }
  };

  useEffect(() => {

    const handleClickOutside = (event) => {
      if (tableRef.current && !tableRef.current.contains(event.target)) {
        setIsVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!qty || !unit || !base) {
      setItemAmount(0);
      return;
    }

    const totalAmount = qty / unit;
    const total = parseFloat(base) * totalAmount;
    setItemAmount(total.toFixed(2));
  }, [base, qty, unit]);

  /*<========================================================================= update state   ====================================================================> */

  useEffect(() => {
    if (selectedEditItem) {
      setUnit(selectedEditItem.unit);
      setBatch(selectedEditItem.batch);
      setExpiryDate(selectedEditItem.exp);
      setMRP(selectedEditItem.mrp);
      setQty(selectedEditItem.qty);
      setBase(selectedEditItem.base);
      setGst(selectedEditItem.gst_name);
      setOrder(selectedEditItem.order);
      setItemAmount(selectedEditItem.net_rate);


      inputRef5.current.focus();
    }
  }, [selectedEditItem]);

  useEffect(() => {
    return () => {
      if (submitTimeout) clearTimeout(submitTimeout);
    };
  }, [submitTimeout]);

  /*<================================================================= Search Item Debouncing ========================================================> */
  useEffect(() => {
    if (!searchItem) {
      setItemList([]);
      return;
    }
    const now = Date.now();
    const inputSpeed = now - lastInputTime.current;
    lastInputTime.current = now;

    const isBarcodeInput = inputSpeed < 50;
    const debounceTime = isBarcodeInput ? 100 : 500;

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

    }, debounceTime);

    return () => {
      clearTimeout(SearchTimer);
    };
  }, [searchItem]);

  useEffect(() => {
    if (page > 1 && searchItem) {
      handleSearch(searchItem.toUpperCase(), page);
    }
  }, [page]);
  /*<========================================================================= search add item   ====================================================================> */

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

  const handleSearch = async (searchTerm, pageNumber = 1) => {
    if (!searchTerm || isFetchingMore) return;

    setIsFetchingMore(true);

    const normalizedTerm = searchTerm.toUpperCase();
    const cacheKey = `${normalizedTerm}_page_${pageNumber}`;

    // ✅ Cache only first page
    // if (pageNumber === 1 && itemCache.current.has(cacheKey)) {
    //   setItemList(itemCache.current.get(cacheKey));
    //   setIsFetchingMore(false);
    //   return;
    // }

    // if (searchAbortController.current) {
    //   searchAbortController.current.abort();
    // }

    // searchAbortController.current = new AbortController();
    // lastSearchTerm.current = normalizedTerm;

    let data = new FormData();
    data.append("search", normalizedTerm);
    data.append("page", pageNumber);      // ✅ FIXED
    data.append("limit", 20);             // ✅ FIXED

    try {
      const res = await axios.post("items-list", data, {
        // signal: searchAbortController.current.signal,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const newData = res?.data?.data || [];

      if (pageNumber === 1) {
        setItemList(newData);
        // itemCache.current.set(cacheKey, newData);
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
      if (error.name !== "AbortError") {
        console.error("API error:", error);
      }
         if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
    } finally {
      setIsFetchingMore(false);
    }
  };

  const handelAddItemOpen = () => {
    setUnsavedItems(true);
    setOpenAddItemPopUp(true);

    setTimeout(() => {
      if (itemNameInputRef.current) {
        itemNameInputRef.current.focus();
      }
    }, 0);
  };

  const handleInputChange = (event, newInputValue) => {
    setUnsavedItems(true);
    setSearchItem(newInputValue.toUpperCase());
  };

  const handleOptionChange = (event, newValue) => {
    setUnsavedItems(true);
    setSelectedOption(newValue);
    setValue(newValue);

    const itemName = newValue ? newValue.iteam_name : "";
    setSearchItem(itemName);
    setItemId(newValue?.id || "");
    setIsVisible(!!newValue);

    if (!itemName) {
      setExpiryDate("");
      setMRP("");
      setBase("");
      setGst("");
      setQty("");
      setLoc("");
      setUnit("");
      setBatch("");
      setIsVisible(false);
    }

    tableRef1.current?.blur();
    setSelectedEditItem(null);
    setIsEditMode(false);
    setSelectedEditItemId("");
    setItemEditID(0);
    resetValue();
    searchInputRef.current?.focus();

    if (isVisible && value && !batch) {
      tableRef.current.focus();
      if (!item) return;
    }
  };

  const handlePassData = (event) => {

    setItemId(event.item_id);
    setSelectedOption(event);
    setSelectedEditItemId(event.id);
    setSearchItem(event.iteam_name);
    setBatch(event.batch_number);
    setItem(event.iteam_name);
    setUnit(event.unit);
    setExpiryDate(event.expiry_date);
    setMRP(event.mrp);
    setMaxQty(event.qty);
    setBase(event.base);
    setGst(event.gst_name);
    setLoc(event.loc);
    setTempQty(event.tempQty);
    if (inputRef5.current) {
      inputRef5.current.focus();
    }

    setAutoCompleteOpen(false);

    setUniqueItems((uniqueItems) => {
      const exists = uniqueItems.some((item) => item.id === event.id);
      if (exists) return uniqueItems;
      return [...uniqueItems, { id: event.id, stock: event.stock }];
    });
  };

  /*<========================================================================= add new item   ====================================================================> */

  const handleAddNewItemValidation = () => {
    const newErrors = {};
    if (!addItemName) {
      newErrors.addItemName = "Item Name is required";
      toast.dismiss();
      toast.error(newErrors.addItemName);
    }
    if (!addUnit) {
      newErrors.addUnit = "Item Unit is required";
      toast.dismiss();
      toast.error(newErrors.addUnit);
    }
    const isValid = Object.keys(newErrors).length === 0;
    if (isValid) {
      handleAddNewItem();
    }
    return isValid;
  };

  const handleAddNewItem = async () => {
    let formData = new FormData();
    formData.append("item_name", addItemName ? addItemName : "");
    formData.append("unite", addUnit ? addUnit : "");
    formData.append("weightage", addUnit ? addUnit : "");
    formData.append("pack", addUnit ? "1" + addUnit : "");
    formData.append("barcode", addBarcode ? addBarcode : "");

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

      if (response.data.status === 200) {
        toast.dismiss();
        toast.success(response.data.message);
        setOpenAddItemPopUp(false);
        resetAddDialog();
      } else if (response.data.status === 400) {
        toast.dismiss();
        toast.error(response.data.message);
      } else if (response.data.status === 401) {
        history.push("/");
        localStorage.clear();
      }
    } catch (error) {
         if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
      if (error.response && error.response.status === 400) {
        toast.dismiss();
        toast.error(error.response.data.message);
      } else {
        toast.dismiss();
        toast.error("Please try again later");
      }
    }
  };

  /*<========================================================== Fetch customer history   =====================================================> */

  const fetchCustomerHistory = async (customerId) => {
    let data = new FormData();
    data.append("id", customerId);
    // setIsLoading(true);
    try {
      const response = await axios.post("customer-view", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status === 200) {
        setCustomerHistoryData(response.data.data);

        setOpenCustomerHistory(true);
      }
      // setIsLoading(false);
    } catch (error) {
      // setIsLoading(false);
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

  /*<============================================================== Find drug group   =========================================================> */

  const fetchItemDrugGroup = async (searchItem) => {
    let data = new FormData();
    data.append("search", searchItem);
    try {
      const res = await axios.post("iteam-drug-group", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data) {
        if (res.data.data) {
          const filteredItems = res.data.data.data.filter(
            (item) => item.stock > 0
          );
          setItemList(filteredItems);
        }
      }
    } catch (error) {
      console.error("Error fetching item-drug-group:", error);
         if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
    }
  };

  const resetAddDialog = () => {
    setOpenAddPopUp(false);
    setOpenAddItemPopUp(false);
    setAddItemName("");
    setAddUnit("");
    setAddBarcode("");
  };

  /*<============================================================== fetch doctor data   =========================================================> */

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchDoctor) {
        fetchDoctors(searchDoctor.toUpperCase());
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchDoctor]);

  const fetchDoctors = async (name = "") => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      if (name) formData.append("name", name);

      const res = await axios.post("doctor-list?", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const doctors = res.data.data || [];
      setDoctorData(doctors);

      if (!doctor && doctors.length) {
        setDoctor(doctors.find(d => d.default_doctor === "1") || doctors[0]);
      }

      if (res.data.status === 401) {
        localStorage.clear();
        history.push("/");
      }
    } catch (error) {
      console.error("API error:", err);
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

  /*<============================================================== fetch customer data   =========================================================> */

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const handleCustomerOption = (event, newValue) => {
    setCustomer(newValue);
    setUnsavedItems(true);

    if (newValue) {
      const points = newValue.roylti_point || 0;
      setPreviousLoyaltyPoints(points);
      setMaxLoyaltyPoints(points);
      setFinalDiscount(Number(newValue?.sehat_plan_discount))
    } else {
      setPreviousLoyaltyPoints(0);
      setMaxLoyaltyPoints(0);
      setLoyaltyVal(0);
    }
  };

  /*<======================================================= fetch essential data intially    ==================================================> */

  const fetchCustomers = async (search = "") => {
    if (isLoading) return;

    setIsLoading(true);

    let data = new FormData();
    data.append("search", search);

    try {
      const res = await axios.post("list-customer", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const customers = res.data.data || [];
      setCustomerDetails(customers);
      setCustomer(customers[0]);

      // if (!search && customers.length > 0) {
      //   setCustomer(customers[0]);
      //   setPreviousLoyaltyPoints(customers[0].roylti_point || 0);
      //   setMaxLoyaltyPoints(customers[0].roylti_point || 0);
      // }

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

  const CleanOldData = async () => {
    let data = new FormData()
    data.append("random_number", localStorage.getItem("RandomNumber") || "");
    axios.post("all-sales-item-delete", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

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
    } finally {
      CleanOldData();

    }

  };


  useEffect(() => {

    const loadData = async () => {
      try {
        await Promise.all([
          generateRandomNumber(),
          fetchCustomers(),
          fetchDoctors(),
          BankList(),
        ])
      } catch (error) {
        console.error(error)
           if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
      }
    }

    loadData()
  }, [])

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     if (CustomerSearchQuery) {
  //       fetchCustomers(CustomerSearchQuery.toUpperCase());
  //     }
  //   }, 500);
  //   return () => clearTimeout(timer);
  // }, [CustomerSearchQuery]);

  /*<========================================================================= add doctor   ====================================================================> */

  const AddDoctorRecord = async () => {
    if (!doctorName || !clinic) {
      toast.dismiss();
      toast.error("Please fill all required fields");
      return;
    }

    let data = new FormData();
    data.append("name", doctorName);
    data.append("clinic", clinic);

    try {
      await axios
        .post("doctor-create", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setOpenAddPopUp(false);
          setDoctorName("");
          setClinic("");
          toast.dismiss();
          toast.success(response.data.message);
        });
    } catch (error) {
      // setIsLoading(false);
      if (error.response?.data?.status === 400) {
        toast.dismiss();
        toast.error(error.response.data.message);
      } else {
        toast.dismiss();
        toast.error("An unexpected error occurred");
      }
         if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
    }
  };

  /*<========================================================================= add customer   ====================================================================> */

  const AddCustomerRecord = async () => {
    if (!customerName.trim() || !mobileNo.trim()) {
      toast.dismiss();
      toast.error("Please fill all the fields");
      return;
    }

    let data = new FormData();
    data.append("name", customerName.trim());
    data.append("mobile_no", mobileNo.trim());

    try {
      const response = await axios.post("create-customer", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOpenCustomer(false);
      setCustomerName("");
      setMobileNo("");
      toast.dismiss();
      toast.success(response.data.message);
    } catch (error) {
      if (error.response?.data?.status === 400) {
        toast.dismiss();
        toast.error(error.response.data.message);
      } else {
        toast.dismiss();
        toast.error("An unexpected error occurred");
      }
         if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
    }
  };

  /*<========================================================================= handle edit item  ====================================================================> */

  const handleEditClick = (item) => {
    console.log(item.qty,item.total_stock)
    if (!item) return;
    setSelectedEditItem(item);
    setIsEditMode(true);
    setSelectedEditItemId();

    setSelectedOption(item);
    setMaxQty(Number(item.total_stock)+Number(item.qty));

    // const found = uniqueItems.find(u => u.id === item.id);
    // if (found) {
    //   setMaxQty(found.total_stock);
    // } else {
    //   setMaxQty(item.total_stock);
    // }

  };

  useEffect(() => {
    if (selectedEditItem) {
      setSelectedEditItemId(selectedEditItem.id);
      setBarcodeItemName(selectedEditItem.iteam_name);
      setSearchItem(selectedEditItem.iteam_name);
      setItemEditID(selectedEditItem.item_id);
      setLoc(selectedEditItem.location);
    }
    setSelectedOption(selectedEditItem);

  }, [selectedEditItem]);

  /*<========================================================================= get added item  ====================================================================> */

  const saleItemList = async () => {
    let data = new FormData();
    data.append("random_number", localStorage.getItem("RandomNumber") || "");
    // const params = {
    //     random_number: localStorage.getItem('RandomNumber') || ''
    // };
    try {
      const res = await axios
        .post("sales-item-list?", data, {
          // params: params,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setItemSaleList(response.data.data);
          setTodayLoyaltyPoint(response.data.data.today_loylti_point);
          setTotalAmount(response.data.data.sales_amount);
          setTotalBase(response.data.data.total_base);
          setTotalgst(response.data.data.total_gst);
          setMarginNetProfit(response.data.data.margin_net_profit);
          setTotalMargin(response.data.data.total_margin);
          setTotalNetRate(response.data.data.total_net_rate);

          if (response.data.status == 401) {
            history.push("/");
            localStorage.clear();
               if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
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

  /*<========================================================================= handle barcode  ====================================================================> */

  const handleBarcode = async () => {
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

      setTimeout(() => {
        handleBarcodeItem();
      }, 100);

      const handleBarcodeItem = async () => {
        setUnsavedItems(true);
        let data = new FormData();
        data.append("random_number", localStorage.getItem("RandomNumber"));
        data.append(
          "unit",
          Number(response?.data?.data[0]?.batch_list[0]?.unit)
        );
        data.append(
          "batch",
          response?.data?.data[0]?.batch_list[0]?.batch_name
            ? response?.data?.data[0]?.batch_list[0]?.batch_name
            : 0
        );
        data.append(
          "exp",
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
          Number(response?.data?.data[0]?.batch_list[0]?.qty)
            ? Number(response?.data?.data[0]?.batch_list[0]?.qty)
            : 0
        );
        data.append(
          "free_qty",
          Number(response?.data?.data[0]?.batch_list[0]?.maxQty)
            ? Number(response?.data?.data[0]?.batch_list[0]?.maxQty)
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
            ? Number(response?.data?.data[0]?.batch_list[0]?.discount)
            : 0
        );
        data.append(
          "base",
          Number(response?.data?.data[0]?.batch_list[0]?.base)
            ? Number(response?.data?.data[0]?.batch_list[0]?.base)
            : 0
        );
        data.append(
          "gst",
          Number(response?.data?.data[0]?.batch_list[0]?.gst_name)
            ? Number(response?.data?.data[0]?.batch_list[0]?.gst_name)
            : 0
        );
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
        data.append(
          "id",
          Number(response?.data?.data[0]?.batch_list[0]?.item_id)
            ? Number(response?.data?.data[0]?.batch_list[0]?.item_id)
            : 0
        );
        data.append("user_id", userId);
        data.append("unit_id", Number(0));

        try {
          const addResponse = await axios.post("sales-item-add", data, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setTotalAmount(0);
          saleItemList();
          setUnit("");
          setBatch("");
          setExpiryDate("");
          setMRP("");
          setQty("");
          setBase("");
          setGst("");
          setBatch("");
          setBarcode("");
          setLoc("");
          setOrder("");
          setIsEditMode(false);
          setSelectedEditItemId(null);
          setBarcode("");
          setValue("");
          setSearchItem("");

          if (addResponse.data.status === 401) {
            history.push("/");
            localStorage.clear();
         
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      
          }
        } catch (error) {
          console.error("Sales item add error:", error);
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

    } catch (error) {
      console.error("Barcode API error:", error);
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

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleBarcode();
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [barcode]);

  /*<========================================================================= save sale bill  ====================================================================> */

  const handleSubmit = async (draft) => {
    if (isSubmitting) {
      toast.warning("Please wait, request in progress...");
      return;
    }


    await new Promise(resolve => setTimeout(resolve, 0));

    const newErrors = {};
    if (!customer) {
      newErrors.customer = "Please select Customer";
    }
    if (totalAmount < 1) {
      newErrors.totalAmount = "Total Amount must be greater than 0";
      toast.dismiss();
      toast.error("Total Amount must be greater than 0");
    }
    if (loyaltyVal > totalAmount) {
      newErrors.totalAmount = "Total Amount must be greater than Loyalty points";
      toast.dismiss();
      toast.error("Total Amount must be greater than Loyalty points");
    } else if (ItemSaleList?.sales_item.length == 0) {
      newErrors.item = "Please Add any Item in Sale Bill";
      toast.dismiss();
      toast.error("Please Add any Item in Sale Bill");
    }
    setError(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    setUnsavedItems(false);

    submitSaleData(draft);
  };

  const submitSaleData = async (draft) => {
    if (isSubmitting) {
      toast.warning("Please wait, request in progress...");
      return;
    }
    setIsSubmitting(true);


    let data = new FormData();
    // data.append("bill_no", localStorage.getItem('BillNo') ? localStorage.getItem('BillNo') : '');


    const prevPoints = Number(previousLoyaltyPoints) || 0;
    const redeemPoints = Number(loyaltyVal) || 0;

    const calculatedPreviousLoyaltyPoint = Math.max(0, prevPoints - redeemPoints);

    const calculatedTodayPoint = Number(todayLoyltyPoint) || 0;

    data.append("bill_no", billNo);
    data.append("customer_id", customer?.id ? customer?.id : "");
    data.append("status", "Completed");
    data.append(
      "bill_date",
      selectedDate ? new Date(selectedDate).toISOString().split("T")[0] : ""
    );

    data.append("customer_address", address || "");
    data.append("doctor_id", doctor?.id ? doctor?.id : "");
    data.append("igst", ItemSaleList?.igst || "");
    data.append(
      "cgst",
      (ItemSaleList?.cgst).toFixed(2) ? (ItemSaleList?.cgst).toFixed(2) : ""
    );
    data.append(
      "sgst",
      (ItemSaleList?.sgst).toFixed(2) ? (ItemSaleList?.sgst).toFixed(2) : ""
    );
    data.append("given_amount", givenAmt || 0);
    data.append("due_amount", dueAmount || 0);
    data.append("total_base", totalBase || 0);
    data.append("round_off", roundOff || 0);
    data.append("pickup", pickup ? pickup : "");
    data.append("owner_name", "0");
    data.append("payment_name", paymentType ? paymentType : "");
    data.append(
      "product_list",
      JSON.stringify(ItemSaleList.sales_item)
        ? JSON.stringify(ItemSaleList.sales_item)
        : ""
    );
    data.append("net_amount", netAmount.toFixed(2) || 0);
    data.append("other_amount", otherAmt || 0);
    data.append("total_discount", finalDiscount || "");
    data.append("discount_amount", discountAmount ? discountAmount : "");
    data.append("total_amount", totalAmount || 0);
    data.append("other_amount", otherAmt || 0);
    data.append("margin_net_profit", marginNetProfit || 0);
    data.append("margin", totalMargin || 0);
    data.append("net_rate", totalNetRate || 0);
    data.append("mrp", mrp ? mrp : "");
    data.append("ptr", ptr ? ptr : "");
    data.append("discount", discount ? discount : "");
    data.append("total_gst", totalgst || "");
    data.append("roylti_point", loyaltyVal || 0);
    data.append("previous_loylti_point", calculatedPreviousLoyaltyPoint || 0);
    data.append("today_loylti_point", calculatedTodayPoint || 0);
    data.append("draft_save", !draft ? "1" : draft);

    try {
      const response = await axios.post("create-sales", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status === 200) {
        setBillNo(billNo + 1);
        toast.dismiss();
        toast.success(response.data.message);
        localStorage.removeItem("RandomNumber");

        const lowStockItems = ItemSaleList.sales_item.filter(
          (item) => parseFloat(item.total_stock) <= 1
        );

        if (billSaveDraft == 1 && customer.id !== 1) {
          handleSendInvoice(customer, totalAmount, selectedDate, billNo);

        }

        if (billSaveDraft == 2) {
          const saleId = response?.data?.data?.id;
          setSelectedEditItemId(null);
          setSearchItem("");
          setValue("");
          setItem("");
          setItemId(null);
          resetValue();
          setSelectedOption(null);
          setSelectedEditItem(null);
          if (searchInputRef.current) {
            searchInputRef.current.focus();
            setSelectedIndex(-1);
          }
          pdfGenerator(saleId);
        }

        const timeout = setTimeout(() => {

          history.push("/sale");
        }, 2000);

        setSubmitTimeout(timeout);

      } else if (response.data.status === 400) {
        setIsSubmitting(false);
        toast.dismiss();
        toast.error(response.data.message);


      }


    } catch (error) {
      const timeout = setTimeout(() => {
        setIsSubmitting(false);
      }, 1000);
      setSubmitTimeout(timeout);

         if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
      if (error.response && error.response.status === 400) {
        toast.dismiss();
        toast.error(error.response.data.message);
      } else {
        toast.dismiss();
        toast.error("Please try again later");
      }
    }
  };


  /*<========================================================================= handle leave page  ====================================================================> */
  const handleNavigation = (path) => {
    setOpenModal(true);
    // setOpenCustomer(false);
    // setOpenAddPopUp(false);
    setNextPath(path);
  };

  const handleLeavePage = async () => {
    let data = new FormData();
    data.append("random_number", localStorage.getItem("RandomNumber") || "");
    setOpenModal(false);
    setUnsavedItems(false);

    // const params = {
    //     random_number: localStorage.getItem('RandomNumber')
    // };
    try {
      const response = await axios.post("all-sales-item-delete", data, {
        // params: params,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.status === 200) {
        setOpenModal(false);
        setUnsavedItems(false);
        setTimeout(() => {
          if (nextPath) {
            history.push(nextPath);
          }
        }, 0);
      }

      setOpenModal(false);
      setUnsavedItems(false);
      localStorage.removeItem("RandomNumber");

      // history.replace(nextPath);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setUnsavedItems(false);
        setOpenModal(false);
        localStorage.setItem("unsavedItems", unsavedItems.toString());
        setTimeout(() => {
          history.push(nextPath);
        }, 0);
           if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
      } else {
        console.error("Error deleting items:", error);
      }
    }
  };

  /*<========================================================================= get batch list  ====================================================================> */

  useEffect(() => {
    if (itemId) {
      batchList();
    }
  }, [itemId]);

  const batchList = async () => {
    if (!itemId) return;


    let data = new FormData();
    data.append("iteam_id", itemId);

    const params = {
      iteam_id: itemId,
    };

    try {
      const res = await axios.post("batch-list?", data, {
        params: params,
        // signal: batchAbortController.current.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const batchList = res.data.data;
      const isAlternative = res.data.alternative_item_check;


      setBatchListData(batchList);
      setIsAlternative(isAlternative);
    } catch (error) {
      if (error.name === 'AbortError') {

        return;
      }
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

  // useEffect(() => {
  //   return () => {
  //     if (searchAbortController.current) {
  //       searchAbortController.current.abort();
  //     }
  //     if (batchAbortController.current) {
  //       batchAbortController.current.abort();
  //     }
  //   };
  // }, []);

  /*<=============================================================== generate random number  ==========================================================> */

  const generateRandomNumber = () => {
    if (localStorage.getItem("RandomNumber") == null) {
      const number = Math.floor(Math.random() * 100000) + 1;
      setRandomNumber(number);
      localStorage.setItem("RandomNumber", number);
    } else {
      return;
    }
  };
  /*<=============================================================== Add and Edit validation  =========================================================> */

  const addItemValidation = async () => {

    setUnsavedItems(true);

    const newErrors = {};
    if (!mrp) {
      newErrors.mrp = "Please Select any Item Name";
      toast.dismiss();
      toast.error(newErrors.mrp);
    }
    if (!qty || qty <= 0) {
      newErrors.qty = "Please enter a valid quantity.";
      toast.dismiss();
      toast.error(newErrors.qty);
    } else {
      // addSaleItem();
      setIsVisible(false);
      setSearchItem("");
      setBarcodeItemName("");
      setSelectedOption(null);
    }

    const isValid = Object.keys(newErrors).length === 0;
    if (isValid) {
      await addSaleItem();
      if (searchInputRef.current) {
        searchInputRef.current.focus();
        setSelectedIndex(-1);
        setAutocompleteKey((prevKey) => prevKey + 1);

      }
    }
    return isValid;
  };

  /*<============================================================= Add and Edit item function  ========================================================> */

  const addSaleItem = async () => {
    if (isSubmitting) return false;
    setIsSubmitting(true);
    generateRandomNumber();
    let data = new FormData();

    if (isEditMode === true) {
      data.append("item_id", itemEditID);
    } else {
      if (barcode) {
        data.append("item_id", itemId);
      } else {
        data.append("item_id", itemId ? itemId : "");
      }
    }
    // data.append("id", selectedEditItemId ? selectedEditItemId : '')
    data.append("user_id", userId);
    // data.append("item_id", barcode ? itemId : value?.id || '');
    data.append("id", selectedEditItemId || "");
    data.append("qty", qty || "");
    data.append("max_qty", maxQty || "");
    data.append("exp", expiryDate ? expiryDate : "");
    data.append("gst", gst ? gst : "");
    data.append("mrp", mrp ? mrp : "");
    data.append("unit", unit ? unit : "");
    data.append(
      "random_number",
      Number(localStorage.getItem("RandomNumber")) || ""
    );
    data.append("batch", batch ? batch : "");
    data.append("location", loc ? loc : "");
    data.append("base", base ? base : "");
    data.append("amt", itemAmount ? itemAmount : "");
    data.append("net_rate", itemAmount ? itemAmount : "");
    data.append("total_amount", totalAmount);
    data.append("ptr", ptr ? ptr : "");
    if (tempQty - qty <= 2) {
      data.append("order", "O");
    } else {
      data.append("order", order ? order : "");
    }
    data.append("discount", discount ? discount : "");
    data.append("total_gst", totalgst || "");
    data.append("today_loylti_point ", todayLoyltyPoint || "");
    const params = {
      id: selectedEditItemId || "",
    };

    try {
      const response = isEditMode
        ? await axios.post("sales-item-edit?", data, {
          params: params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        : await axios.post("sales-item-add", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      if (response.data.status === 200) {

        setTotalAmount(0);
        saleItemList();
        setUnit("");
        setBatch("");
        setExpiryDate("");
        setMRP("");
        setQty("");
        setBase("");
        setGst("");
        setBatch("");
        setBarcode("");
        setLoc("");
        setOrder("");
        setIsEditMode(false);
        setItemId("");
        setTotalAmount(0);
        saleItemList();
      }


      //  toast.dismiss();
      // toast.success(response.data.message);

      // if (quantityDifference === 1) {
      //     bulkOrderData();
      // }
    } catch (error) {
      console.error("API error:", error);
      toast.error(error.response.data.message)
         if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  /*<=================================================================== reset item value  ==============================================================> */

  const resetValue = () => {
    setUnit("");
    setBatch("");
    setSearchItem("");
    setExpiryDate("");
    setMRP("");
    setBase("");
    setGst("");
    setQty("");
    setOrder("");
    setLoc("");
    setItemAmount(0);
    if (isNaN(itemAmount)) {
      setItemAmount(0);
    }
    setIsEditMode(false);
  };
  /*<=================================================================== delete item  ==============================================================> */

  const handleDeleteItem = async (saleItemId) => {
    if (!saleItemId) return;
    let data = new FormData();
    data.append("id", saleItemId ? saleItemId : "");
    const params = {
      id: saleItemId ? saleItemId : "",
    };
    try {
      await axios
        .post("sales-item-delete?", data, {
          params: params,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          saleItemList();
          setIsDelete(false);
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

  /*<============================================================ Pil remider  ===================================================> */

  useEffect(() => {
    if (!ItemSaleList?.sales_item?.length) return;

    const updated = {};
    ItemSaleList.sales_item.forEach((item) => {
      const totalDose = 1 + 0 + 1;
      const refillDays = totalDose > 0 ? Math.floor(item.qty / totalDose) : 0;
      const refillDate = new Date();
      refillDate.setDate(refillDate.getDate() + refillDays);

      updated[item.id] = {
        morning: 1,
        noon: 0,
        night: 1,
        refillDays,
        refillDate,
      };
    });

    setPillTimes(updated);
  }, [ItemSaleList]);

  {/*<====================================================================== pill /refill timing   =====================================================================> */ }

  const updatePillTiming = (item, updated) => {
    const total = Number(updated.morning || 0) + Number(updated.noon || 0) + Number(updated.night || 0);
    const refillDays = total > 0 ? Math.floor(item.qty / total) : 0;

    const refillDate = new Date();
    refillDate.setDate(refillDate.getDate() + refillDays);

    setPillTimes((prev) => ({
      ...prev,
      [item.id]: {
        ...updated,
        refillDays,
        refillDate,
      },
    }));
  };
  {/*<====================================================================== pill /refill remider   =====================================================================> */ }

  const handleReminder = async () => {
    const selectedItems = Object.keys(checkedItems).filter((id) => checkedItems[id]);

    for (const id of selectedItems) {
      const item = ItemSaleList.sales_item.find((i) => i.id === parseInt(id));
      const dose = pillTimes[id];

      if (!item || !dose) continue;

      const data = new FormData();
      data.append("item_id", item.id);
      data.append("refill_date", dose.refillDate.toLocaleDateString("en-GB"));
      data.append("morning", dose.morning);
      data.append("noon", dose.noon);
      data.append("night", dose.night);
      data.append("customer_id")

      try {
        const response = await axios.post("pill-refill-reminder?", data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.status === 200) {
          toast.dismiss();
          toast.success("Reminder(s) set successfully");
          setOpenReminderPopUp(false);


        } else if (response.data.status === 400) {
          toast.dismiss();
          toast.error(response.data.message);
        } else if (response.data.status === 401) {
          history.push("/");
          localStorage.clear();
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          toast.dismiss();
          toast.error(error.response.data.message);
        } else {
          toast.dismiss();
          toast.error("Error setting reminder. Please try again later.");
        }
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

  {/*<====================================================================== send whatsapp bil   =====================================================================> */ }

  const handleSendInvoice = async (customer, Amount, date, billNo) => {
    const url = "https://web.wabridge.com/api/createmessage";

    const two = 24;
    const three = "krishna";
    const four = 20 / 20 / 26;
    const five = 5;
    const six = "91986543210";
    const seven = "sagar";

    const payload = {
      "app-key": "db8ce965-029b-4f74-aade-04d137663b12",
      "auth-key": "039d46d11eab7e7863eb651db09f8eac63198154bf41302430",
      destination_number: customer.phone_number,
      template_id: "1291715845234841",
      device_id: "6747f73e1bcbc646dbdc8c5f",
      variables: [
        customer.name,
        Amount,
        localStorage.getItem("UserName"),
        date,
        billNo,
        localStorage.getItem("contact"),
        localStorage.getItem("UserName"),
      ],
      media: "",
      message: "",
    };

    try {
      const response = await axios.post(url, payload);
    } catch (error) {
      console.error("Error sending message:", error);
         if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
    }
  };
  {/*<====================================================================== Handle PDF download   =====================================================================> */ }

  const pdfGenerator = async (id) => {
    let data = new FormData();
    data.append("id", id);
    setIsLoading(true);
    try {
      await axios
        .post("sales-pdf-downloads", data, {
          params: { id },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const PDFURL = response.data.data.pdf_url;
          toast.dismiss();
          toast.success(response.data.meassage);
          handlePdf(PDFURL);
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

  const handlePdf = (url) => {
    if (typeof url === "string") {
      window.open(url, "_blank");
    } else {
      console.error("Invalid URL for the PDF");
    }
  };


  {/*<====================================================================== UI =====================================================================> */ }

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

      <div className="p-6"
        style={{
          height: "calc(-125px + 100vh)",
          overflow: "auto",
        }}>

        {/*<================================================================ header   =====================================================> */}

        <div className="flex flex-wrap items-center justify-between gap-2 row border-b border-dashed pb-4 border-[var(--color1)]" >

          <div className="flex items-center gap-2">
            <span
              className="text-[var(--color2)] font-bold text-[20px] cursor-pointer"
              onClick={() => {
                history.push("/sale");
              }}
            >
              Sales
            </span>
            <span className="w-6 h-6">

              <ArrowForwardIosIcon
                fontSize="small"
                className="text-[var(--color1)]"
              />
            </span>

            <span className="text-[var(--color1)] font-bold text-[20px]">New</span>

            <BsLightbulbFill className="w-6 h-6 text-[var(--color2)] hover-yellow"
              onClick={() => setShowModal(true)} />
          </div>

          <div className="flex items-center gap-2">


            <button
              type="button"
              className="inline-flex items-center rounded-[4px] bg-[var(--color1)] px-4 py-2 text-white hover:bg-[var(--color2)] transition"
              onClick={handelAddItemOpen}
            >
              Add New Item
            </button>

            {ItemSaleList?.sales_item?.length > 0 && (
              <button
                type="button"
                className="inline-flex items-center rounded-[4px] bg-[var(--color1)] px-4 py-2 text-white hover:bg-[var(--color2)] transition"
                onClick={() => setOpenReminderPopUp(true)}
              >pill /refill Reminder
              </button>)}


            <Select
              labelId="dropdown-label"
              id="dropdown"
              value={paymentType}
              className="payment_divv"
              onChange={(e) => {
                setPaymentType(e.target.value);
                setUnsavedItems(true);
              }}
              size="small"
              sx={{ minWidth: "150px" }}
            >
              <MenuItem value="cash">Cash</MenuItem>
              <MenuItem value="credit">Credit</MenuItem>
              {bankData?.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.bank_name}
                </MenuItem>
              ))}
            </Select>

            <Select
              labelId="dropdown-label"
              id="dropdown"
              value={pickup}
              className="payment_divv "
              onChange={(e) => {
                setPickup(e.target.value);
                setUnsavedItems(true);
              }}
              size="small"
              sx={{
                minWidth: "150px",
                "& .MuiInputBase-input": {
                  display: "flex",
                  whiteSpace: "nowrap",
                  alignItems: "center",
                  gap: "1rem",
                },
              }}
            >
              {pickupOptions.map((option) => (
                <MenuItem
                  key={option.id}
                  value={option.label}
                  className="gap-4"
                >
                  {option.icon && option.icon}
                  {option.label}
                </MenuItem>
              ))}
            </Select>

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
                disabled={isSubmitting}
                aria-disabled={isSubmitting}
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

        {/*<=========================================================== Top detail   ==========================================================> */}

        <div className=" flex gap-4  mt-4">
          <div className="flex flex-row gap-4 overflow-x-auto w-full">
            <div>
              <span
                className="title mb-2 flex  items-center gap-2"
              >
                Customer Mobile / Name <span className="text-red-600">*</span>
                <FaPlusCircle
                  className="primary cursor-pointer"
                  onClick={() => {
                    setOpenCustomer(true);
                  }}
                />
              </span>

              <Autocomplete
                value={customer}
                onChange={handleCustomerOption}
                inputValue={CustomerSearchQuery}
                options={customerDetails}
                onInputChange={(event, newInputValue) => {
                  setCustomerSearchQuery(newInputValue);
                }}
                getOptionLabel={(option) =>
                  option.name
                    ? `${option.name} [${option.phone_number}] [${option.roylti_point}] `
                    : option.phone_number || ""
                }
                isOptionEqualToValue={(option, value) =>
                  option.phone_number === value.phone_number
                }
                // loading={isLoading}

                sx={{

                  width: "100%",
                  minWidth: "350px",
                  minHeight: "40px",
                  "@media (max-width:600px)": { minWidth: "250px" },

                  '& .MuiAutocomplete-inputRoot': {
                    padding: '0 !important',
                    paddingRight: customer ? '65px !important' : '39px !important',
                  },
                  '& .MuiInputBase-root': {
                    padding: '0',
                  }
                }}

                renderOption={(props, option) => (
                  <ListItem {...props} className="flex items-center gap-2">

                    {hasSehatPlan(option) && (
                      <FaCrown
                        size={14}
                        color="#facc15"
                        title={option.sehat_plan_name}
                      />
                    )}

                    <ListItemText
                      primary={`${option.name} `}
                      secondary={`Mobile No: ${option.phone_number} | Loyalty Point: ${option.roylti_point} | Due Payment: ${option.roylti_point}`}
                    />
                  </ListItem>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Search by Mobile, Name"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {customer && hasSehatPlan(customer) && (
                            <Tooltip title={customer.sehat_plan_name} arrow>
                              <FaCrown
                                size={16}
                                color="#facc15"
                                style={{ marginRight: 6 }}
                              />
                            </Tooltip>
                          )}
                          {customer && (
                            <Tooltip
                              title="Sales History"
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
                                  fetchCustomerHistory(customer.id);
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
                                  S
                                </span>
                              </IconButton>
                            </Tooltip>
                          )}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />

            </div>
            <div>
              <span className="title mb-2 flex  items-center gap-2">
                <span className="flex flex-row gap-1">
                  Doctor
                  <FaPlusCircle
                    className="icon primary"
                    onClick={() => {
                      setOpenAddPopUp(true);
                      setUnsavedItems(true);
                    }}
                  />
                </span>

                <p
                  onClick={() => history.push("/doctors")}
                  className="cursor-pointer self-end text-xs text-white bg-[var(--color5)] px-2 rounded-sm"
                >
                  set default
                </p>

              </span>

              <Autocomplete
                value={doctor}
                onChange={(e, newVal) => setDoctor(newVal)}
                inputValue={searchDoctor}
                onInputChange={(event, newInputValue) => {
                  setSearchDoctor(newInputValue);
                }}
                options={doctorData}
                getOptionLabel={(option) =>
                  option?.name
                    ? `${option.name} [${option.phone_number || ''}]`
                    : option?.phone_number || ''
                }

                isOptionEqualToValue={(option, value) =>
                  option?.phone_number === value?.phone_number
                }

                // loading={isLoading}
                sx={{

                  width: "100%",
                  minWidth: "350px",
                  minHeight: "40px",
                  "@media (max-width:600px)": { minWidth: "250px" },

                  '& .MuiAutocomplete-inputRoot': {
                    padding: '0 !important',
                    paddingRight: customer ? '65px !important' : '39px !important',
                  },
                  '& .MuiInputBase-root': {
                    padding: '0',
                  }
                }}
                renderOption={(props, option) => (
                  <ListItem {...props}>
                    <ListItemText
                      primary={`${option.name} `}
                      secondary={`Mobile No: ${option.phone_number}`}
                    />
                  </ListItem>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Search by DR. Name, Mobile Number"
                    // InputProps={{
                    //   ...params.InputProps,
                    //   endAdornment: (
                    //     <>
                    //       {isLoading ? (
                    //         <CircularProgress color="inherit" size={20} />
                    //       ) : null}
                    //       {params.InputProps.endAdornment}
                    //     </>
                    //   ),
                    // }}
                    sx={{
                      "& .MuiInputBase-input::placeholder": {
                        fontSize: "1rem",
                        color: "black",
                      },
                    }}
                  />
                )}
              />
            </div>

            <div>
              <span
                className="heading mb-2 title"
                style={{
                  fontWeight: "500",
                  fontSize: "17px",
                  color: "var(--color1)",
                }}
              >
                Select Date{" "}

              </span>

              <DatePicker
                className="custom-datepicker"
                selected={selectedDate}
                variant="outlined"
                onChange={(newDate) => setSelectedDate(newDate)}
                dateFormat="dd/MM/yyyy"
                filterDate={(date) => !isDateDisabled(date)}
              />
            </div>
            <div

            >
              <span
                className="heading mb-2 title"
                style={{
                  fontWeight: "500",
                  fontSize: "17px",
                  color: "var(--color1)",
                }}
              >
                Scan Barcode
                {/* <FaPlusCircle
                        className="icon primary"
                        onClick={() => {
                          setOpenAddPopUp(true);
                          setUnsavedItems(true);
                        }}
                      /> */}
              </span>
              <TextField
                id="outlined-number"
                type="number"
                size="small"
                value={barcode}
                placeholder="Scan Barcode"
                sx={{
                  width: "100%",
                  minWidth: "200px",
                  minHeight: "40px",
                  "@media (max-width:600px)": { minWidth: "200px" },
                }}
                onChange={(e) => {
                  setBarcode(e.target.value);
                }}
              />
            </div>
          </div>

        </div>

        {/*<=========================================================== item table   ==========================================================> */}

        <div className="table-container">
          <table
            className="p-30 w-full border-collapse item-table"
            style={{ background: "#F5F5F5", padding: "10px 15px" }}>
            <thead>
              <tr className="input-row">
                <th>
                  <div className="flex justify-center items-center gap-2">
                    Search Item Name{" "}
                    <span className="text-red-600 ">*</span>
                    <FaPlusCircle
                      className="primary cursor-pointer"
                      onClick={() => {
                        setOpenAddItemPopUp(true);
                      }}
                    />
                  </div>
                </th>
                <th>
                  Unit <span className="text-red-600 ">*</span>
                </th>
                <th>
                  Batch <span className="text-red-600 ">*</span>{" "}
                </th>
                <th>
                  Expiry <span className="text-red-600 ">*</span>
                </th>
                <th>
                  MRP <span className="text-red-600 ">*</span>
                </th>
                <th>Base</th>
                <th>
                  GST%<span className="text-red-600 ">*</span>
                </th>
                <th>Qty. </th>
                <th>Loc.</th>
                <th >Order</th>
                <th>
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {/*<============================================== table for autocomplete/batch selection   =============================================> */}
              {isVisible && value && !batch && (
                <Box
                  sx={{
                    minWidth: {
                      xs: "200px",
                      sm: "500px",
                      md: "1000px",
                    },
                    backgroundColor: "white",
                    position: "absolute",
                    marginTop: "50px",
                    // left: "50%",
                    zIndex: 2,
                  }}
                  id="tempId"
                >
                  <div
                    className="custom-scroll-sale"
                    style={{ width: "100%" }}
                    tabIndex={0}
                    onKeyDown={handleTableKeyDown}
                  >
                    <table
                      ref={tableRef}
                      tabIndex={0}
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                      }}
                    >
                      <thead>
                        {isAlternative && (
                          <tr className="customtable">
                            <th
                              className="saleTable highlighted-row"
                              colSpan={8}
                            >
                              Alternate Medicine
                            </th>
                          </tr>
                        )}

                        <tr className="customtable">
                          <th>Item Name</th>
                          <th>Batch Number</th>
                          <th>Unit</th>
                          <th>Expiry Date</th>
                          <th>MRP</th>
                          <th>QTY</th>
                          <th>Loc</th>
                        </tr>
                      </thead>

                      <tbody>
                        {batchListData.length > 0 ? (
                          <>
                            {batchListData.map((item) => (
                              <tr
                                className={`cursor-pointer saleTable custom-hover ${highlightedRowId ===
                                  String(item.id)
                                  ? "highlighted-row"
                                  : ""
                                  }`}
                                key={item.id}
                                data-id={item.id}
                                tabIndex={0}
                                style={{
                                  border:
                                    "1px solid rgba(4, 76, 157, 0.1)",
                                  padding: "10px",
                                  outline: "none",
                                }}
                                onClick={() =>
                                  handlePassData(item)
                                }
                                onFocus={() => setAutoCompleteOpen(false)}
                                onMouseEnter={(e) => {
                                  const hoveredRow = e.currentTarget;
                                  setHighlightedRowId(hoveredRow);
                                }}

                              >
                                <td className="text-base font-semibold">
                                  {item.iteam_name}
                                </td>
                                <td className="text-base font-semibold">
                                  {item.batch_number}
                                </td>
                                <td className="text-base font-semibold">
                                  {item.unit}
                                </td>
                                <td className="text-base font-semibold">
                                  {item.expiry_date}
                                </td>
                                <td className="text-base font-semibold">
                                  {item.mrp}
                                </td>
                                <td className="text-base font-semibold">
                                  {item.qty}
                                </td>
                                <td className="text-base font-semibold">
                                  {item.location}
                                </td>
                              </tr>
                            ))}
                          </>
                        ) : (
                          <tr>
                            <td
                              colSpan={6}
                              style={{
                                textAlign: "center",
                                fontSize: "16px",
                                fontWeight: 600,
                              }}
                            >
                              No record found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </Box>
              )}
              <tr className="input-row">

                <td style={{ fontSize: 15, height: "47px", minWidth: 400, width: "100%", display: 'flex', alignItems: 'center', justifyContent: 'start', }}>
                  <>
                    <Autocomplete
                      key={autocompleteKey}
                      value={selectedOption}
                      size="small"
                      sx={{
                        width: "100%",
                        minWidth: "400px",
                      }}
                      onChange={handleOptionChange}
                      onInputChange={handleInputChange}
                      open={autoCompleteOpen}
                      onOpen={() => setAutoCompleteOpen(true)}
                      onClose={() => setAutoCompleteOpen(false)}
                      getOptionLabel={(option) => `${option.iteam_name || ""}`}
                      options={itemList}
                      ListboxProps={{
                        onScroll: handleScroll,
                      }}
                      renderOption={(props, option) => (
                        <ListItem {...props} key={option.id}>
                          <ListItemText
                            primary={`${option.iteam_name}`}
                            secondary={`${option.company_name}  (Qty:${option.stock})`}
                          />
                        </ListItem>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          inputRef={searchInputRef}
                          variant="outlined"
                          id="searchResults"
                          autoFocus
                          placeholder="Search Item Name..."
                          InputProps={{
                            ...params.InputProps,
                            style: {
                              height: 40,
                              textTransform: 'uppercase',
                            },
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon
                                  sx={{
                                    color: "var(--color1)",
                                    cursor: "pointer",
                                  }}
                                />
                              </InputAdornment>

                            ),
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
                          sx={{
                            "& .MuiInputBase-input": {
                              textTransform: "uppercase",
                            },
                            "& .MuiInputBase-input::placeholder": {
                              fontSize: "1rem",
                              color: "black",
                            },
                          }}
                          onFocus={() => setSelectedIndex(-1)}

                          onKeyDown={(e) => {
                            const key = e.key;
                            const isTab = key === "Tab";
                            const isShiftTab = isTab && e.shiftKey;
                            const isEnter = key === "Enter";
                            const isArrowKey = key === "ArrowDown" || key === "ArrowUp";

                            if (
                              isArrowKey &&
                              !isShiftTab &&
                              (searchItem === null || searchItem === "") &&
                              !selectedOption
                            ) {
                              e.preventDefault();
                              setAutocompleteDisabled(true);
                              setAutoCompleteOpen(false);
                              setTimeout(() => {
                                if (searchInputRef.current) searchInputRef.current.blur();
                                if (tableRef1.current) tableRef1.current.focus();
                                if (ItemSaleList?.sales_item?.length > 0) {
                                  setSelectedIndex(key === "ArrowDown" ? 0 : ItemSaleList.sales_item.length - 1);
                                } else {
                                  setSelectedIndex(-1);
                                }
                              }, 0);
                              return;
                            }

                            if ((isEnter || isTab) && autoCompleteOpen) return;

                            if (isEnter || isTab) {
                              e.preventDefault();
                              if (!selectedOption) {
                                setTimeout(() => {
                                  toast.dismiss();
                                  toast.error("Please select an Item")
                                }, 100);
                              } else {
                                setTimeout(() => {
                                  if (inputRef1.current) inputRef1.current.focus();
                                }, 100);
                              }
                              return;
                            }
                          }}
                        />
                      )}
                    />
                  </>
                </td>
                <td>
                  <TextField
                    id="outlined-number"
                    disabled
                    type="number"
                    inputRef={inputRef1}
                    onKeyDown={(e) => {
                      if (e.key === "Tab" && e.shiftKey) {
                        e.preventDefault();
                        return;
                      }
                      if (e.key === "Enter" || e.key === "Tab") {
                        e.preventDefault();
                        if (itemRowInputOrder[1]?.current) {
                          itemRowInputOrder[1].current.focus();
                        }
                      }
                    }}
                    size="small"
                    value={unit}
                    sx={{
                      minWidth: "40px",
                      width: "100%",
                      '& .MuiInputBase-input': {
                        textAlign: 'center',
                      },
                    }}
                    onChange={(e) => {
                      setUnit(e.target.value);
                    }}
                  />
                </td>
                <td >
                  <TextField
                    id="outlined-number"
                    sx={{
                      minWidth: "65px",
                      width: "100%",
                      '& .MuiInputBase-input': {
                        textAlign: 'center',
                      },
                    }}
                    size="small"
                    disabled
                    value={batch}
                    onKeyDown={(e) => {
                      if (e.key === "Tab" && e.shiftKey) {
                        e.preventDefault();
                        if (itemRowInputOrder[0]?.current) {
                          itemRowInputOrder[0].current.focus();
                        }
                        return;
                      }
                      if (e.key === "Enter" || e.key === "Tab") {
                        e.preventDefault();
                        if (itemRowInputOrder[2]?.current) {
                          itemRowInputOrder[2].current.focus();
                        }
                      }
                    }}
                    onChange={(e) => {
                      setBatch(e.target.value);
                    }}
                  />
                </td>
                <td>
                  <TextField
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
                    inputRef={inputRef3}
                    onKeyDown={(e) => {
                      if (e.key === "Tab" && e.shiftKey) {
                        e.preventDefault();
                        if (itemRowInputOrder[1]?.current) {
                          itemRowInputOrder[1].current.focus();
                        }
                        return;
                      }
                      if (e.key === "Enter" || e.key === "Tab") {
                        e.preventDefault();
                        if (itemRowInputOrder[3]?.current) {
                          itemRowInputOrder[3].current.focus();
                        }
                      }
                    }}
                    value={expiryDate}
                    onChange={handleExpiryDateChange}
                    placeholder="MM/YY"
                  />
                </td>
                <td>
                  <TextField
                    disabled
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
                    inputRef={inputRef4}
                    onKeyDown={(e) => {
                      if (e.key === "Tab" && e.shiftKey) {
                        e.preventDefault();
                        if (itemRowInputOrder[2]?.current) {
                          itemRowInputOrder[2].current.focus();
                        }
                        return;
                      }
                      if (e.key === "Enter" || e.key === "Tab") {
                        e.preventDefault();
                        if (itemRowInputOrder[4]?.current) {
                          itemRowInputOrder[4].current.focus();
                        }
                      }
                    }}
                    value={mrp}
                    onChange={(e) => {
                      setMRP(e.target.value);
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
                    inputRef={inputRef5}
                    onKeyDown={(e) => {
                      if (e.key === "Tab" && e.shiftKey) {
                        e.preventDefault();
                        if (itemRowInputOrder[3]?.current) {
                          itemRowInputOrder[3].current.focus();
                        }
                        return;
                      }
                      if (e.key === "Enter" || e.key === "Tab") {
                        if (base === "" || base === null || base === undefined) {
                          toast.dismiss();
                          toast.error("Base is required");
                          e.preventDefault();
                          return;
                        }
                        e.preventDefault();
                        if (itemRowInputOrder[5]?.current) {
                          itemRowInputOrder[5].current.focus();
                        }
                      }
                    }}
                    value={base}
                    onChange={(e) => {
                      setBase(e.target.value);
                    }}

                  />
                </td>
                <td>
                  <TextField
                    id="outlined-number"
                    type="number"
                    disabled
                    size="small"
                    inputRef={inputRef6}
                    onKeyDown={(e) => {
                      if (e.key === "Tab" && e.shiftKey) {
                        e.preventDefault();
                        if (itemRowInputOrder[4]?.current) {
                          itemRowInputOrder[4].current.focus();
                        }
                        return;
                      }
                      if (e.key === "Enter" || e.key === "Tab") {
                        e.preventDefault();
                        if (itemRowInputOrder[6]?.current) {
                          itemRowInputOrder[6].current.focus();
                        }
                      }
                    }}
                    sx={{
                      minWidth: "40px",
                      width: "100%",
                      '& .MuiInputBase-input': {
                        textAlign: 'center',
                      },
                    }}
                    value={gst}
                    onChange={(e) => {
                      setGst(e.target.value);
                    }}
                  />
                </td>
                <td >
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
                    inputRef={inputRef7}
                    value={qty}
                    onKeyDown={(e) => {
                      if (e.key === "Tab" && e.shiftKey) {
                        e.preventDefault();
                        if (itemRowInputOrder[5]?.current) {
                          itemRowInputOrder[5].current.focus();
                        }
                        return;
                      }
                      if (e.key === "Enter" || e.key === "Tab") {
                        if (qty === "" || qty === null || qty === undefined) {
                          toast.dismiss();
                          toast.error("Qty is required");
                          e.preventDefault();
                          return;
                        }
                        e.preventDefault();
                        if (itemRowInputOrder[7]?.current) {
                          itemRowInputOrder[7].current.focus();
                        }
                      }
                    }}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^0\d+/.test(val)) return;
                      const numVal = Number(val);
                      if (numVal <= maxQty) {
                        setQty(val);
                        setOrder(numVal === maxQty ? "O" : "");
                      } else {
                        setQty(maxQty);
                        toast.dismiss();
                        toast.error("Can't add qty more than stock");
                      }
                    }}
                  />
                </td>

                <td >
                  <TextField
                    id="outlined-number"
                    size="small"
                    inputRef={inputRef9}
                    onKeyDown={(e) => {
                      if (e.key === "Tab" && e.shiftKey) {
                        e.preventDefault();
                        if (itemRowInputOrder[6]?.current) {
                          itemRowInputOrder[6].current.focus();
                        }
                        return;
                      }
                      if (e.key === "Enter" || e.key === "Tab") {
                        e.preventDefault();
                        if (itemRowInputOrder[8]?.current) {
                          itemRowInputOrder[8].current.focus();
                        }
                      }
                    }}
                    disabled
                    sx={{
                      minWidth: "65px",
                      width: "100%",
                      '& .MuiInputBase-input': {
                        textAlign: 'center',
                      },
                    }}
                    value={loc}
                    onChange={(e) => {
                      setLoc(e.target.value);
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
                    value={order}
                    placeholder="O"
                    inputRef={inputRef8}
                    onKeyDown={(e) => {
                      if (e.key === "Tab" && e.shiftKey) {
                        e.preventDefault();
                        if (itemRowInputOrder[7]?.current) {
                          itemRowInputOrder[7].current.focus();
                        }
                        return;
                      }
                      handleKeyDown(e);
                      if (e.key === "Enter") {
                        addItemValidation();
                      }
                    }}
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase();
                      if (value === "" || value === "O") {
                        setOrder(value);
                      }
                    }}
                  />
                </td>
                <td className="total">
                  <span className="font-bold">
                    {itemAmount}
                  </span>
                </td>
              </tr>

              {ItemSaleList?.sales_item?.map((item, index) => (
                <tr
                  key={item.id}
                  onClick={() => {
                    handleEditClick(item);
                    setSelectedIndex(index);
                  }}
                  className={`item-List cursor-pointer ${index === selectedIndex ? "highlighted-row" : ""}`}
                  style={{ borderBottom: index !== ItemSaleList.sales_item.length - 1 ? '1px solid #e0e0e0' : 'none', }}>
                  <td style={{ display: "flex", gap: "5px", textAlign: "left", verticalAlign: "left" }}>
                    <div>
                      <BorderColorIcon
                        style={{ color: "var(--color1)" }}
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(item);
                        }}
                      />
                      <DeleteIcon
                        className="delete-icon bg-none"
                        style={{ color: "var(--color6)" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsDelete(true);
                          setSaleItemId(item.id);
                        }}
                      />
                    </div>
                    <span style={{ alignSelf: "center" }}>
                      {item.iteam_name || barcodeItemName || "-----"}
                    </span>
                  </td>
                  <td style={{ textAlign: "center", verticalAlign: "middle" }} >{item.unit || "-----"}</td>
                  <td style={{ textAlign: "center", verticalAlign: "middle" }} >{item.batch || "-----"}</td>
                  <td style={{ textAlign: "center", verticalAlign: "middle" }} >{item.exp || "-----"}</td>
                  <td style={{ textAlign: "center", verticalAlign: "middle" }} >{item.mrp || "-----"}</td>
                  <td style={{ textAlign: "center", verticalAlign: "middle" }} >{item.base || "-----"}</td>
                  <td style={{ textAlign: "center", verticalAlign: "middle" }} >{item.gst_name || "-----"}</td>
                  <td style={{ textAlign: "center", verticalAlign: "middle" }} >{item.qty || "-----"}</td>
                  <td style={{ textAlign: "center", verticalAlign: "middle" }} >{item.location || "-----"}</td>
                  <td style={{ textAlign: "center", verticalAlign: "middle" }} >{item.order ? item.order : "------"}</td>
                  <td className="total" style={{ fontWeight: "bold", textAlign: "center", verticalAlign: "middle" }} >{item.net_rate}</td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>

        {/*<==================================================== total and other details ===================================================> */}

        <div className="sale_filtr_add"
          style={{
            background: "var(--color1)",
            color: "white",
            display: "flex",
            flexDirection: "column",
            position: "fixed",
            width: "100%",
            bottom: "0",
            left: "0",
          }}
        >
          <div
            className=""
            style={{
              display: "flex",
              whiteSpace: "nowrap",
              position: "sticky",
              left: "0",
              overflow: "auto",
              padding: "20px",
            }}
          >
            <div
              className="gap-2 invoice_total_fld"
              style={{ display: "flex" }}
            >
              <label className="font-bold">Total GST : </label>

              <span style={{ fontWeight: 600 }}> {totalgst} </span>
            </div>
            <div
              className="gap-2 invoice_total_fld"
              style={{ display: "flex" }}
            >
              <label className="font-bold">Total Base : </label>
              <span style={{ fontWeight: 600 }}> {totalBase} </span>
            </div>
            <div
              className="gap-2 invoice_total_fld"
              style={{ display: "flex" }}
            >
              <label className="font-bold">Profit : </label>
              <span style={{ fontWeight: 600 }}>
                &#8377; {marginNetProfit || 0} (
                {Number(totalMargin || 0).toFixed(2)}%)
              </span>
            </div>
            <div
              className="gap-2 invoice_total_fld"
              style={{ display: "flex" }}
            >
              <label className="font-bold">Total Net Rate : </label>
              <span style={{ fontWeight: 600 }}>&#8377; {totalNetRate}</span>
            </div>
          </div>
          <hr
            style={{
              opacity: 0.5,
              position: "sticky",
              left: "0",
              width: "100%",
            }}
          />
          <div
            className=""
            style={{
              display: "flex",
              justifyContent: "space-between",
              whiteSpace: "nowrap",
              padding: "20px",
              alignItems: "baseline",
              overflow: "auto",
            }}
          >
            <div
              className=""
              style={{
                display: "flex",
                whiteSpace: "nowrap",
                left: "0",
              }}
            >
              <div
                className="gap-2 invoice_total_fld"
                style={{ display: "flex" }}
              >
                <label className="font-bold">Today Points : </label>
                {customer ? todayLoyltyPoint : 0}
              </div>

              <div
                className="gap-2 invoice_total_fld"
                style={{ display: "flex" }}
              >
                <label className="font-bold">Previous Points : </label>
                {Math.max(0, previousLoyaltyPoints - loyaltyVal) || 0}
              </div>

              <div
                className="gap-2 invoice_total_fld"
                style={{ display: "flex" }}
              >
                <label className="font-bold">Redeem : </label>
                <Input
                  type="number"
                  value={loyaltyVal}
                  onChange={(e) => {
                    const value = e.target.value;

                    const numericValue = Math.floor(Number(value));

                    const maxAllowedPoints = Math.min(
                      maxLoyaltyPoints,
                      totalAmount
                    );

                    if (
                      numericValue >= 0 &&
                      numericValue <= maxAllowedPoints
                    ) {
                      setLoyaltyVal(numericValue);
                    } else if (numericValue < 0) {
                      setLoyaltyVal(0);
                    }
                    setUnsavedItems(true);
                  }}
                  onKeyPress={(e) => {
                    const value = e.target.value;
                    const isMinusKey = e.key === "-";

                    if (!/[0-9.-]/.test(e.key) && e.key !== "Backspace") {
                      e.preventDefault();
                    }

                    if (isMinusKey && value.includes("-")) {
                      e.preventDefault();
                    }
                  }}
                  size="small"
                  style={{
                    width: "70px",
                    background: "none",
                    borderBottom: "1px solid gray",
                    justifyItems: "end",
                    outline: "none",
                    color: "white",
                  }}
                  sx={{
                    "& .MuiInputBase-root": {
                      height: "35px",
                    },
                    "& .MuiInputBase-input": { textAlign: "end" },
                  }}
                />
                {/* {previousLoyaltyPoints} */}
              </div>
            </div>

            <div style={{ display: "flex", whiteSpace: "nowrap" }}>
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
                  {netAmount}
                  <FaCaretUp />
                </span>
              </div>

              <Modal
                show={isModalOpen}
                onClose={toggleModal}
                size="lg"
                position="bottom-center"
                className="modal_amount"
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
                  <h2 style={{ textTransform: "uppercase" }}>
                    invoice total
                  </h2>
                  <IoMdClose
                    onClick={toggleModal}
                    cursor={"pointer"}
                    size={30}
                  />
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
                    <span style={{ fontWeight: 600 }}>{totalAmount}</span>
                  </div>
                  <div
                    className=""
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <label className="font-bold">Discount(%) : </label>
                    <Input
                      type="number"
                      value={finalDiscount}
                      onKeyPress={(e) => {
                        if (
                          !/[0-9.]/.test(e.key) &&
                          e.key !== "Backspace"
                        ) {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) => {
                        let newValue = e.target.value;

                        if (newValue > 100) {
                          setFinalDiscount(100);
                        } else if (newValue >= 0) {
                          setFinalDiscount(newValue);
                        }
                      }}
                      size="small"
                      style={{
                        width: "70px",
                        background: "none",
                        outline: "none",
                        justifyItems: "end",
                      }}
                      sx={{
                        "& .MuiInputBase-root": {
                          height: "35px",
                        },
                        "& .MuiInputBase-input": { textAlign: "end" },
                      }}
                    />
                  </div>
                  <div
                    className=""
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <label className="font-bold">Other Amount : </label>
                    <Input
                      type="number"
                      value={otherAmt}
                      onKeyPress={(e) => {
                        const value = e.target.value;
                        const isMinusKey = e.key === "-";

                        if (
                          !/[0-9.-]/.test(e.key) &&
                          e.key !== "Backspace"
                        ) {
                          e.preventDefault();
                        }

                        if (isMinusKey && value.includes("-")) {
                          e.preventDefault();
                        }
                      }}
                      onChange={handleOtherAmtChange}
                      size="small"
                      style={{
                        width: "70px",
                        background: "none",
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
                  </div>
                  <div
                    className=""
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <label className="font-bold">
                      Loyalty Points Redeem:{" "}
                    </label>
                    <span>{loyaltyVal || 0}</span>
                  </div>
                  <div
                    className=""
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingBottom: "5px",
                    }}
                  >
                    <label className="font-bold">
                      Discount Amount :{" "}
                    </label>
                    {discountAmount !== 0 && (
                      <span>
                        {discountAmount > 0
                          ? `-${discountAmount}`
                          : discountAmount}
                      </span>
                    )}
                  </div>

                  <div
                    className=""
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
                    <span>{!roundOff ? 0 : roundOff}</span>
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
                      {netAmount}
                    </span>
                  </div>
                </div>
              </Modal>
            </div>
          </div>
        </div>

        {/*<========================================================== Add Doctor  =========================================================> */}

        <Dialog open={openAddPopUp} className="custom-dialog add-company-dialog ">
          <DialogTitle id="alert-dialog-title" className="secondary">
            Add Doctor
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={() => {
              setOpenAddPopUp(false);
              setDoctorName("");
              setClinic("");
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
                  alignItems: "center",
                  gap: "15px",
                }}
              >
                <div
                  className="mainform bg-white rounded-lg gap-2"
                >
                  {/* Doctor Name */}
                  <div className="fields add_new_item_divv">
                    <label className="label secondary">
                      Doctor Name <span className="text-red-600">*</span>
                    </label>
                    <TextField
                      id="outlined-multiline-static"
                      size="small"
                      value={doctorName}
                      onChange={(e) => {
                        setDoctorName(e.target.value);
                        setUnsavedItems(true);
                      }}
                      style={{ minWidth: 300 }}
                      inputRef={(el) => (inputRefs.current[0] = el)}
                      onKeyDown={(e) => handleKeyDown(e, 0)}
                      inputProps={{
                        style: { textTransform: "uppercase" },
                        autoComplete: "off",
                      }}
                    />
                  </div>

                  {/* Clinic Name */}
                  <div className="fields add_new_item_divv">
                    <label className="label secondary">
                      Clinic Name <span className="text-red-600">*</span>
                    </label>
                    <TextField
                      id="outlined-multiline-static"
                      size="small"
                      value={clinic}
                      onChange={(e) => {
                        setClinic(e.target.value);
                        setUnsavedItems(true);
                      }}
                      style={{ minWidth: 300 }}
                      inputRef={(el) => (inputRefs.current[1] = el)}
                      onKeyDown={(e) => handleKeyDown(e, 1)}
                      inputProps={{
                        autoComplete: "off",
                      }}
                    />
                  </div>
                </div>
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <div className="px-3 pb-3">
              <Button
                autoFocus
                variant="contained"
                color="success"
                onClick={AddDoctorRecord}
                ref={(el) => (inputRefs.current[2] = el)}
              >
                Save
              </Button>
            </div>
          </DialogActions>
        </Dialog>

        {/*<========================================================== Add customer  =========================================================> */}
        <Dialog open={openCustomer} className="custom-dialog add-company-dialog">
          <DialogTitle id="alert-dialog-title" className="primary">
            Add Customer
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={() => {
              setOpenCustomer(false);
              setCustomerName("");
              setMobileNo("");
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
            <div className="dialog">
              <DialogContentText id="alert-dialog-description">
                <div
                  className="bg-white"
                  style={{
                    alignItems: "center",
                    gap: "15px",
                  }}
                >
                  <div
                    className="mainform bg-white rounded-lg gap-2"
                  >
                    {/* Customer Name */}
                    <div className="fields add_new_item_divv">
                      <label className="label secondary">
                        Customer Name <span className="text-red-600">*</span>
                      </label>
                      <TextField
                        id="outlined-multiline-static"
                        size="small"
                        value={customerName}
                        onChange={(e) => {
                          setCustomerName(e.target.value.toUpperCase());
                          setUnsavedItems(true);
                        }}
                        style={{ minWidth: 300 }}
                        inputRef={(el) => (inputRefs.current[0] = el)}
                        onKeyDown={(e) => handleKeyDown(e, 0)}
                        inputProps={{
                          style: { textTransform: "uppercase" },
                          autoComplete: "off",
                        }}
                      />
                    </div>

                    {/* Mobile Number */}
                    <div className="fields add_new_item_divv">
                      <label className="label secondary">
                        Mobile Number <span className="text-red-600">*</span>
                      </label>
                      <TextField
                        id="mobile-number"
                        size="small"
                        value={mobileNo}
                        onChange={(e) => {
                          const value = e.target.value
                            .split("")
                            .filter(char => /[0-9]/.test(char))
                            .join("")
                            .slice(0, 10);

                          setMobileNo(value);
                          setUnsavedItems(true);
                        }}
                        style={{ minWidth: 300 }}
                        inputRef={(el) => (inputRefs.current[1] = el)}
                        onKeyDown={(e) => handleKeyDown(e, 1)}
                      />

                    </div>
                  </div>
                </div>
              </DialogContentText>
            </div>
          </DialogContent>
          <DialogActions>
            <div className="row" style={{
              justifyContent: "flex-end",
              paddingRight: "4px",
            }}>
              <Button
                sx={{
                  backgroundColor: "#3f6212",
                  "&:hover": { backgroundColor: "#3f6212" },
                }}
                autoFocus
                variant="contained"
                onClick={AddCustomerRecord}
                ref={(el) => (inputRefs.current[2] = el)}
              >
                Save
              </Button>
            </div>
          </DialogActions>
        </Dialog>

        {/*<====================================================== item purchase history  =====================================================> */}

        <Dialog
          open={openPurchaseHistoryPopUp}
          sx={{
            "& .MuiDialog-container": {
              "& .MuiPaper-root": {
                width: "65%",
                maxWidth: "1900px",
              },
            },
          }}
        >
          <DialogTitle id="alert-dialog-title" className="secondary">
            Item Purchase History
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={() => setOpenPurchaseHistoryPopUp(false)}
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
                className="flex"
                style={{ flexDirection: "column", gap: "19px" }}
              >
                <table className="custom-table" style={{ background: "none" }}>
                  <thead>
                    <tr>
                      {LastPurchaseListcolumns.map((column, index) => (
                        <th key={column.id}>
                          <div className="headerStyle">
                            <span>{column.label}</span>
                            <SwapVertIcon />
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {purchaseHistory.map((row, index) => {
                      return (
                        <tr
                          hover
                          tabIndex={-1}
                          key={row.code}
                          onClick={() => setOpenPurchaseHistoryPopUp(true)}
                        >
                          {LastPurchaseListcolumns.map((column) => {
                            const value = row[column.id];

                            return (
                              <td key={column.id} align={column.align}>
                                {column.format && typeof value === "number"
                                  ? column.format(value)
                                  : value}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </DialogContentText>
          </DialogContent>
        </Dialog>
        {/*<======================================================== Add item  ===================================================================> */}

        <Dialog open={openAddItemPopUp} className="custom-dialog add-item-dialog modal_991 ">
          <DialogTitle id="alert-dialog-title" className="secondary">
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
          <DialogContent >
            <DialogContentText id="alert-dialog-description">
              <div className="bg-white">
                <div className="mainform bg-white rounded-lg">
                  <div className="row gap-3 sm:flex-nowrap flex-wrap">
                    <div className="fields add_new_item_divv">
                      <label className="label secondary">Item Name <span className="text-red-600  ">*</span></label>
                      <TextField
                        id="outlined-number"
                        inputRef={itemNameInputRef}
                        onKeyDown={handleKeyDown}
                        size="small"
                        value={addItemName}
                        onChange={(e) => setAddItemName(e.target.value.toUpperCase())}
                      />

                    </div>
                  </div>
                  <div className="row gap-3 sm:flex-nowrap flex-wrap">
                    <div className="fields add_new_item_divv">
                      <label className="label  secondary">Barcode</label>
                      <TextField
                        id="outlined-number"
                        inputRef={barcodeInputRef}
                        onKeyDown={handleKeyDown}
                        type="number"
                        size="small"
                        sx={{ minWidth: "150px" }}
                        value={addBarcode}
                        onChange={(e) => setAddBarcode(Number(e.target.value))}
                      />
                    </div>
                    <div className="fields add_new_item_divv">
                      <label className="label secondary">Unit <span className="text-red-600  ">*</span></label>
                      <TextField
                        id="outlined-number"
                        type="number"
                        inputRef={unitInputRef}
                        size="small"
                        sx={{ minWidth: "150px" }}
                        value={addUnit}
                        onChange={(e) => setAddUnit(e.target.value)}
                        onKeyDown={(e) => {
                          handleKeyDown(e);
                          if (e.key === "Enter") {
                            handleAddNewItemValidation();
                          }
                        }}
                      />
                    </div>
                    <div className="fields add_new_item_divv">
                      <label className="label secondary">Pack</label>
                      <TextField
                        disabled
                        id="outlined-number"
                        size="small"
                        sx={{ minWidth: "150px" }}
                        value={`1 * ${addUnit} `}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "var(--COLOR_UI_PHARMACY)",
                "&:hover": {
                  backgroundColor: "var(--COLOR_UI_PHARMACY)",
                },
              }}
              onClick={handleAddNewItemValidation}
            >
              <ControlPointIcon className="mr-2" />
              Add New Item
            </Button>
          </DialogActions>
        </Dialog>

        {/*<========================================================== Pill refill modal  =========================================================> */}

        <Dialog open={openReminderPopUp} className="custom-dialog modal_991 ">
          <DialogTitle id="alert-dialog-title" className="secondary">
            Set Pill/Refill Reminder
          </DialogTitle>


          <IconButton
            aria-label="close"
            onClick={() => setOpenReminderPopUp(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "#ffffff",
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent className="">
            <DialogContentText id="alert-dialog-description">
              <div className="bg-white">
                <div className="mainform bg-white rounded-lg">
                  <div className="flex flex-col md:flex-row gap-4">
                    <table className="item-table">
                      <thead>
                        <tr>
                          <th></th>
                          <th>Item Name</th>
                          <th>Quantity</th>
                          <th className="">
                            <span style={{ display: "flex", alignItems: "center", gap: "4px", justifyContent: "center" }}>
                              Morning <FaCloudSun />
                            </span>
                          </th>
                          <th className="">
                            <span style={{ display: "flex", alignItems: "center", gap: "4px", justifyContent: "center" }}>
                              Noon <FaSun />
                            </span>
                          </th>
                          <th className="">
                            <span style={{ display: "flex", alignItems: "center", gap: "4px", justifyContent: "center" }}>
                              Night <FaCloudMoon />
                            </span>
                          </th>

                          <th>Refill day</th>
                          <th>Refill Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ItemSaleList?.sales_item?.map((item) => (
                          <tr key={item.id} className="item-List" style={{ whiteSpace: "nowrap" }}>
                            <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                              <Checkbox
                                checked={checkedItems[item.id] || false}
                                onChange={(e) =>
                                  setCheckedItems((prev) => ({
                                    ...prev,
                                    [item.id]: e.target.checked,
                                  }))
                                }
                              />
                            </td>
                            <td style={{ textAlign: "center", verticalAlign: "middle" }}>{item.iteam_name || barcodeItemName}</td>
                            <td style={{ textAlign: "center", verticalAlign: "middle" }}>{item.qty || "-----"}</td>

                            {["morning", "noon", "night"].map((time) => (
                              <td key={time}>
                                <TextField
                                  type="number"
                                  size="small"
                                  sx={{ width: "100px" }}
                                  value={pillTimes[item.id]?.[time] || 0}
                                  onChange={(e) => {
                                    const updated = {
                                      ...pillTimes[item.id],
                                      [time]: Number(e.target.value),
                                    };
                                    updatePillTiming(item, updated);
                                  }}
                                />
                              </td>
                            ))}

                            <td>
                              <TextField
                                type="number"
                                size="small"
                                sx={{ width: "100px" }}
                                disabled
                                value={pillTimes[item.id]?.refillDays || 0}
                              />
                            </td>

                            <td>
                              <DatePicker
                                selected={pillTimes[item.id]?.refillDate || new Date()}
                                onChange={(date) => {
                                  setPillTimes((prev) => ({
                                    ...prev,
                                    [item.id]: {
                                      ...prev[item.id],
                                      refillDate: date,
                                    },
                                  }));
                                }}
                                dateFormat="dd/MM/yyyy"
                                customInput={
                                  <TextField
                                    size="small"
                                    sx={{ width: "130px" }}
                                  />
                                }
                              />
                            </td>

                          </tr>
                        ))}
                      </tbody>

                    </table>
                  </div>
                </div>
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "var(--COLOR_UI_PHARMACY)",
                "&:hover": {
                  backgroundColor: "var(--COLOR_UI_PHARMACY)",
                },
              }}
              onClick={() => {
                handleReminder();
              }}
            >
              <ControlPointIcon className="mr-2" />
              Set Reminder
            </Button>
          </DialogActions>
        </Dialog>

        {/*<======================================================== Customer History Modal  =======================================================> */}
        <Dialog
          open={openCustomerHistory}
          onClose={() => setOpenCustomerHistory(false)}
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
            Customer Sales History - {customerHistoryData?.name}
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={() => setOpenCustomerHistory(false)}
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
                              <span>Customer Name</span>
                            </div>
                          </th>
                          <th>
                            <div className="headerStyle" style={{ color: 'black', fontWeight: 600 }}>
                              <span>Area</span>
                            </div>
                          </th>
                          <th>
                            <div className="headerStyle" style={{ color: 'black', fontWeight: 600 }}>
                              <span>Doctor</span>
                            </div>
                          </th>
                          <th>
                            <div className="headerStyle" style={{ color: 'black', fontWeight: 600 }}>
                              <span>Bill No</span>
                            </div>
                          </th>
                          <th>
                            <div className="headerStyle" style={{ color: 'black', fontWeight: 600 }}>
                              <span>Date</span>
                            </div>
                          </th>
                          <th>
                            <div className="headerStyle" style={{ color: 'black', fontWeight: 600 }}>
                              <span>Type</span>
                            </div>
                          </th>
                          <th>
                            <div className="headerStyle" style={{ color: 'black', fontWeight: 600 }}>
                              <span>Amount</span>
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {customerHistoryData?.sales && customerHistoryData.sales.length > 0 ? (
                          customerHistoryData.sales.map((sale) => (
                            <tr
                              hover
                              tabIndex={-1}
                              key={sale.id}
                              onClick={() => {
                                history.push(`/saleView/${sale.id}`)
                              }}
                            >
                              <td>{customerHistoryData.name}</td>
                              <td>{sale.area}</td>
                              <td>{sale.doctor}</td>
                              <td>{sale.bill_no}</td>
                              <td>{sale.bill_date}</td>
                              <td>{sale.payment_mode}</td>
                              <td>&#8377;{sale.amt}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={7}
                              style={{
                                textAlign: "center",
                                fontSize: "16px",
                                fontWeight: 600,
                                padding: "20px"
                              }}
                            >
                              No sales history found
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

        {/*<========================================================== Item History Modal  =========================================================> */}
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
                              onClick={() => {
                                history.push(`/purchaseView/${item.id}`)
                              }}
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

        {/*<========================================================== Delete modal  =========================================================> */}

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
              <h4 className="text-lg font-semibold mt-6">
                Are you sure you want to delete it?
              </h4>
            </div>
            <div className="flex gap-5 justify-center">
              <button
                type="submit"
                className="px-6 py-2.5 w-44 items-center rounded-md text-white text-sm font-semibold border-none outline-none bg-red-500 hover:bg-red-600 active:bg-red-500"
                onClick={() => handleDeleteItem(saleItemId)}
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

        {/*<========================================================== Leave page modal  =========================================================> */}

        <Prompt
          when={unsavedItems}
          message={(location) => {
            handleNavigation(location.pathname);
            return false;
          }}
        />

        <div
          id="modal"
          value={openModal}
          style={{ zIndex: 9999 }}
          className={`fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif] ${openModal ? "block" : "hidden"
            }`}
        >
          <div />

          <div className="w-full max-w-md bg-white shadow-lg rounded-md p-4 relative">
            <div className="my-4 logout-icon">
              <VscDebugStepBack
                className=" h-12 w-14"
                style={{ color: "#628A2F" }}
              />
              <h4
                className="text-lg font-semibold mt-6 text-center"
                style={{ textTransform: "none" }}
              >
                Are you sure you want to leave this page ?
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
                onClick={() => setOpenModal(false)}
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
      </div >

    </>
  );
};
export default addSale;