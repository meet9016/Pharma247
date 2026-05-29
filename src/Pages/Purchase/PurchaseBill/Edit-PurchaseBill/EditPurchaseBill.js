import Header from "../../../Header";

import React, { useState, useRef, useEffect } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import Autocomplete from "@mui/material/Autocomplete";

import {
  Button,
  Input,
  InputAdornment,
  ListItem,
  ListItemText,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useParams } from "react-router-dom";
import { MenuItem, Select } from "@mui/material";
import DatePicker from "react-datepicker";
import { addDays, format, subDays } from "date-fns";
import { BsLightbulbFill } from "react-icons/bs";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import Loader from "../../../../componets/loader/Loader";
import { toast, ToastContainer } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
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
import { Modal } from "flowbite-react";
import { FaCaretUp } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import TipsModal from "../../../../componets/Tips/TipsModal";
import { FaPlusCircle } from "react-icons/fa";

const EditPurchaseBill = () => {
  const [ItemPurchaseList, setItemPurchaseList] = useState({ item: [] });
  const [searchItem, setSearchItem] = useState("");
  const [itemList, setItemList] = useState([]);
  const [isOpenBox, setIsOpenBox] = useState(false);
  const [autoCompleteOpen, setAutoCompleteOpen] = useState(false);
  const [autocompleteKey, setAutocompleteKey] = useState(0);
  const [distributor, setDistributor] = useState(null);
  const [billNo, setbillNo] = useState("");
  // const [dueDate, setDueDate] = useState(dayjs().add(15, 'day'));
  // const [selectedDate, setSelectedDate] = useState(dayjs());
  const [dueDate, setDueDate] = useState(addDays(new Date(), 15));
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedOption, setSelectedOption] = useState(1);
  const history = useHistory();
  const token = localStorage.getItem("token");
  const [error, setError] = useState({ distributor: "", billNo: "" });
  const [expiryDate, setExpiryDate] = useState("");
  const [mrp, setMRP] = useState(null);
  const [ptr, setPTR] = useState(null);
  const [qty, setQty] = useState("");
  const [value, setValue] = useState("");
  const [deleteAll, setDeleteAll] = useState(false);
  const [free, setFree] = useState("");
  const [loc, setLoc] = useState("");
  const [unit, setUnit] = useState("");
  const [HSN, setHSN] = useState("");
  const [schAmt, setSchAmt] = useState("");
  const [ItemTotalAmount, setItemTotalAmount] = useState(0.00);
  const [baseNetAmount, setBaseNetAmount] = useState(0);
  const [margin, setMargin] = useState("");
  const [disc, setDisc] = useState("");
  const [base, setBase] = useState("");
  const [gst, setGst] = useState();
  const [batch, setBatch] = useState("");
  const [gstList, setGstList] = useState([]);
  const [historyList, setHistoryList] = useState([]);
  const userId = localStorage.getItem("userId");
  const [netRate, setNetRate] = useState("");
  const [IsDelete, setIsDelete] = useState(false);
  const [srNo, setSrNo] = useState("");
  const [ItemId, setItemId] = useState("");
  const [isAutocompleteDisabled, setAutocompleteDisabled] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedEditItemId, setSelectedEditItemId] = useState(null);
  const [itemEditID, setItemEditID] = useState(0);
  const [selectedEditItem, setSelectedEditItem] = useState(null);
  const [distributorList, setDistributorList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentType, setPaymentType] = useState("credit");
  const [bankData, setBankData] = useState([]);
  const [header, setHeader] = useState("");
  const [openAddPopUp, setOpenAddPopUp] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [purchaseReturnPending, setPurchaseReturnPending] = useState([]);
  // const [finalPurchaseReturnList, setFinalPurchaseReturnList] = useState([]);
  const [cnTotalAmount, setCnTotalAmount] = useState({});
  const [checkboxDisabled, setCheckboxDisabled] = useState(true);
  const [cnAmount, setCnAmount] = useState(0);
  const [disabledRows, setDisabledRows] = useState({});
  const [inputDisabled, setInputDisabled] = useState(true);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [otherAmt, setOtherAmt] = useState("");
  const [finalCnAmount, setFinalCnAmount] = useState(0);
  const [finalTotalAmount, setFinalTotalAmount] = useState(0);
  const [netAmount, setNetAmount] = useState(0);
  const [roundOffAmount, setRoundOffAmount] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [unsavedItems, setUnsavedItems] = useState(false);
  const [nextPath, setNextPath] = useState("");
  const [barcode, setBarcode] = useState("");
  const [batchListData, setBatchListData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [purchase, setPurchase] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  /*<=============================================================================== Input ref on keydown enter ======================================================================> */

  const [selectedIndex, setSelectedIndex] = useState(-1); // Index of selected row
  const tableRef = useRef(null); // Reference for table container
  const inputRefs = useRef([]);
  const [errors, setErrors] = useState({});

  let defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 3);
  const [showModal, setShowModal] = useState(false);

  const { id, randomNumber: paramRandomNumber } = useParams();
  const randomNumber = paramRandomNumber || localStorage.getItem("RandomNumber");

  /*<================================================================ disable autocomplete to focus when tableref is focused  =======================================================> */

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

  /*<================================================================ disable autocomplete to focus when tableref is focused  =======================================================> */

  useEffect(() => {
    const handleKeyPress = (e) => {
      const activeList = purchase?.item_list ?? [];

      if (!activeList.length) return;

      const key = e.key;

      // Prevent keyboard control if any input is focused
      const isInputFocused = inputRefs.current.some(
        (input) => input && document.activeElement === input
      );
      if (isInputFocused) return;

      if (key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < activeList.length - 1 ? prev + 1 : prev
        );
        setAutoCompleteOpen(false); // Close Autocomplete dropdown
      } else if (key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        setAutoCompleteOpen(false); // Close Autocomplete dropdown
      } else if (key === "Enter" && selectedIndex !== -1) {
        e.preventDefault();
        setAutoCompleteOpen(false); // Close Autocomplete dropdown
        const selectedRow = activeList[selectedIndex];
        if (!selectedRow) return;

        setSelectedEditItemId(selectedRow.id);
        handleEditClick(selectedRow);

        setTimeout(() => {
          if (inputRefs.current[1]) {
            inputRefs.current[1].focus(); // Focus item name
          }
        }, 150);
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [selectedIndex, purchase?.item_list]);

  /*<================================================================================== handle shortcut  =========================================================================> */

  useEffect(() => {

    const handleKeyDown = (event) => {
      if (!event.altKey) return;

      event.preventDefault();

      if (event.key.toLowerCase() === "s") {
        if (isSubmitting) return;
        handleSubmit();

      } else if (event.key.toLowerCase() === "g") {

        handleSubmit("0");
      } else if (event.key.toLowerCase() === "m") {
        removeItem();
      }

    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [distributor, billNo, ItemPurchaseList, purchase, isSubmitting]);

  const handleKeyDown = (event, index) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission

      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus(); // Move to next input
      }
    }
  };

  /*<================================================================= Search Item Debouncing ========================================================> */

  useEffect(() => {
    if (page > 1 && searchItem) {
      handleSearch(searchItem.toUpperCase(), page);
    }
  }, [page]);

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

  /*<================================================================================== handle Leave page  =========================================================================> */

  useEffect(() => {
    const initialize = async () => {
      try {
        await handleLeavePage();
      } catch (error) {
           if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
        console.error("Error during initialization:", error);
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    // Call API initially when the component mounts
    // handlePopState();

    // Listen to route changes
    const unlisten = history.listen((location, action) => {
      // Call API when route changes
      handlePopState();
    });

    // Clean up the listener on component unmount
    return () => {
      unlisten();
    };
  }, [history]); // Dependencies: history object

  const handlePopState = () => {
    // Call the delete API
    let data = new FormData();
    const params = {
      random_number: randomNumber,
    };
    try {
      const res = axios
        .post("purches-histroy?", data, {
          params: params,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          itemPurchaseList();
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
    }
  };

  const handleNavigation = (path) => {
    setOpenAddPopUp(false);
    setIsOpenBox(true);
    setNextPath(path);
  };

  /*<================================================================================== handle CN AMount  =========================================================================> */

  useEffect(() => {
    const total = Object.values(cnTotalAmount)
      .map((amount) => parseFloat(amount) || 0)
      .reduce((acc, amount) => acc + amount, 0);
    setCnAmount(total);
  }, [cnTotalAmount]);

  useEffect(() => {
    const defaultSelectedRows =
      purchase?.cn_bill_list?.map((row) => row.id) || [];
    setSelectedRows(defaultSelectedRows);

    const initialDisabledRows = purchase?.cn_bill_list?.reduce((acc, row) => {
      acc[row.id] = true; // Set all rows as disabled initially
      return acc;
    }, {});
    setDisabledRows(initialDisabledRows);
  }, [purchase]);

  /*<============================================================================== Handle barcode ====================================================================> */

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleBarcode();
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [barcode]);

  /*<============================================================================ get distributor list ==================================================================> */

  const listDistributor = async () => {
    try {
      const response = await axios.get("list-distributer", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const distributors = response.data.data;
      localStorage.setItem("distributor", JSON.stringify(distributors));
      setDistributorList(distributors);

      return distributors;
    } catch (error) {
         if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
      console.error("API Error fetching distributors:", error);
      return [];
    }
  };

  /*<================================================================================= get Bank list =======================================================================> */

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
         if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
      console.error("API error:", error);
    }
  };
  /*<========================================================================== get purchase bill by ID ================================================================> */

  const purchaseBillGetByID = async (distributors) => {
    setPurchase("");
    let data = new FormData();
    data.append("id", id);
    data.append("random_number", randomNumber);
    data.append("net_amount", netAmount);

    const params = {
      id: id,
      random_number: randomNumber,
    };
    setIsLoading(true);
    try {
      const response = await axios.post("purches-edit-data?", data, {
        params: params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const purchaseData = response?.data?.data;

      setPurchase(purchaseData);

      const apiNet = Number(response?.data?.data.net_amount) || 0;
      setBaseNetAmount(apiNet);
      setNetAmount(apiNet);


      if (purchaseData) {
        // const foundDistributor = distributors.find(option => option.id === purchaseData.distributor_id);
        const foundDistributor = distributors.find((option) => {
          return option.id == purchaseData.distributor_id;
        });

        if (foundDistributor) {
          setDistributor(foundDistributor);
        } else {
          console.warn(
            "Distributor not found for ID: ",
            purchaseData.distributor_id
          );
        }
        setbillNo(purchaseData?.bill_no || "");
        setSrNo(purchaseData?.sr_no || "");
        setSelectedDate(
          purchaseData?.bill_date ? purchaseData.bill_date : null
        );
        setDueDate(purchaseData?.due_date ? purchaseData?.due_date : null);
        // setCnAmount(purchase?.cn_amount || "")
        setFinalCnAmount(purchaseData?.cn_amount || "");
        setFinalTotalAmount(purchaseData?.total_amount || "");
        handleCalNetAmount(purchaseData?.net_amount || "");
        setRoundOffAmount(purchaseData?.round_off || "");
        // setCnTotalAmount(purchaseData?.cn_amount ? purchaseData.cn_amount : null)
      }
      setIsLoading(false);
      return purchaseData;
    } catch (error) {
         if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
      console.error("API error fetching purchase data:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (value?.id) {
      batchList(value?.id);
    }
  }, [value]);

  /*<======================================================================== get essential details intially  ==============================================================> */

  useEffect(() => {
    const initializeData = async () => {
      const distributors = await listDistributor();
      await purchaseBillGetByID(distributors);
    };
    BankList();
    initializeData();
    listOfGst();
    // listOfHistory()
  }, [id]);
  /*<=============================================================================== caculation =======================================================================> */
  useEffect(() => {
    const other = Number(otherAmt) || 0;
    // Prevent net amount going negative beyond base
    if (other < 0 && Math.abs(other) > baseNetAmount) {
      setOtherAmt("");
      setNetAmount(baseNetAmount);
      return;
    }
    setNetAmount(baseNetAmount + other);
  }, [otherAmt, baseNetAmount]);

  useEffect(() => {
    // Convert values to numbers, defaulting to 0 if undefined/null/empty
    const numericQty = parseFloat(qty) || 0;
    const numericPtr = parseFloat(ptr) || 0;
    const numericDisc = parseFloat(disc) || 0;
    const numericGst = parseFloat(gst) || 0;
    const numericFree = parseFloat(free) || 0;
    const numericMrp = parseFloat(mrp) || 0;

    /*<===================================================================== Calculate discount ==========================================================================> */
    // FIX: Correct discount calculation - discount on gross amount (PTR × Qty)
    const grossAmount = numericPtr * numericQty;
    const totalSchAmt = parseFloat(((grossAmount * numericDisc) / 100).toFixed(2));
    setSchAmt(totalSchAmt);

    /*<===================================================================== Calculate totalBase ==========================================================================> */
    const totalBase = parseFloat((grossAmount - totalSchAmt).toFixed(2));
    setBase(totalBase);

    /*<====================================================================== Calculate totalAmount =======================================================================> */
    const totalAmount = parseFloat((totalBase + (totalBase * numericGst) / 100).toFixed(2));
    setItemTotalAmount(totalAmount);

    /*<================================================================================= Net Rate calculation ==============================================================> */
    // FIX: Safe division to prevent NaN
    const totalUnits = numericQty + numericFree;
    const netRate = totalUnits > 0 ? parseFloat((totalAmount / totalUnits).toFixed(2)) : 0;
    setNetRate(netRate);

    /*<============================================================================= Margin calculation =====================================================================> */
    if (numericMrp > 0) {
      const margin = parseFloat((((numericMrp - netRate) / numericMrp) * 100).toFixed(2));
      setMargin(margin);
    } else {
      setMargin(0);
    }
  }, [qty, ptr, disc, gst, free, mrp]);

  const handleSchAmt = (e) => {
    const inputDiscount = e.target.value === "" ? "" : parseFloat(e.target.value);
    if (isNaN(inputDiscount)) {
      setDisc(0);
      setSchAmt(0);
      return;
    }
    setDisc(inputDiscount);

    // FIX: Calculate discount on (PTR × Qty), not (PTR × discount × Qty)
    const grossAmount = ptr * qty;
    const totalSchAmt = parseFloat(((grossAmount * inputDiscount) / 100).toFixed(2));
    setSchAmt(totalSchAmt);

    const totalBase = parseFloat((grossAmount - totalSchAmt).toFixed(2));
    setBase(totalBase);
  };


  /*<======================================================================= update selected item realtime  ===============================================================> */

  useEffect(() => {
    if (selectedEditItem) {
      setSearchItem(selectedEditItem.item_name);
      setUnit(selectedEditItem.weightage);
      setHSN(selectedEditItem.hsn_code);
      setBatch(selectedEditItem.batch_number);
      setExpiryDate(selectedEditItem.expiry);
      setMRP(selectedEditItem.mrp);
      setQty(selectedEditItem.qty || 0);
      setFree(selectedEditItem.fr_qty);
      setPTR(selectedEditItem.ptr);
      setDisc(selectedEditItem.disocunt);
      setSchAmt(selectedEditItem.scheme_account);
      setBase(selectedEditItem.base_price);
      setGst(selectedEditItem.gst_name);
      setLoc(selectedEditItem.location);
      setMargin(selectedEditItem.margin);
      setNetRate(selectedEditItem.net_rate);
    }
  }, [selectedEditItem]);

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
          // setCnTotalAmount(response.data.data.total_amount)

          //  toast.dismiss();
          toast.success(response.data.message);
        });
    } catch (error) {
         if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
      // setIsLoading(false);
      if (error.response.data.status == 400) {
        toast.dismiss();
        toast.error(error.response.data.message);
      }
    }
  };

  /*<=============================================================================== get list of gst  =====================================================================> */

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
        setUnsavedItems(false);
           if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
      });
  };

  /*<============================================================================== get list of purchase  ====================================================================> */

  const itemPurchaseList = async () => {
    let data = new FormData();
    const params = {
      random_number: randomNumber,
    };
    try {
      const res = await axios
        .post("item-purchase-list?", data, {
          params: params,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setItemPurchaseList(response.data.data);
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

  /*<================================================================= get batch list to select item while add  ============================================================> */

  const batchList = async (id) => {
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
            setLoc(batchData[0].location);
            setGst(batchData[0].gst_name);
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

  /*<================================================================= update purchase validation  ============================================================> */

  const updatePurchaseValidation = async () => {
    const newErrors = {};
    const numericQty = parseFloat(qty) || 0;
    const numericFree = parseFloat(free) || 0;
    if (numericQty === 0 && numericFree === 0) {
      toast.dismiss();
      toast.error("Free and Qty cannot both be 0");
      newErrors.qty = "Free and Qty cannot both be 0";
    }
    if (!unit) {
      newErrors.unit = "Unit is required";
      toast.dismiss();
      toast.error(newErrors.unit);
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
    } else {
      const [expMonth, expYear] = expiryDate.split("/").map(Number);
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1; // getMonth() returns month from 0 to 11
      const currentYear = currentDate.getFullYear() % 100; // get last two digits of year

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
    if (!mrp) newErrors.mrp = "MRP is required";
    // if (!ptr) {
    //   newErrors.ptr = "PTR is required";
    // } else if (ptr && parseFloat(ptr) > parseFloat(mrp)) {
    //   newErrors.ptr = "PTR must be less than or equal to MRP";
    //   toast.dismiss();
    // toast.error("PTR must be less than or equal to MRP");
    // }

    if (gst === undefined || gst === null || gst === "") {
      newErrors.gst = "GST is required";
      toast.dismiss();
      toast.error(newErrors.gst);
    }
    if (!searchItem) {
      toast.dismiss();
      toast.error("Please Select any Item Name");
      newErrors.searchItem = "Select any Item Name";
    }
    // if (!ItemTotalAmount) {
    //   toast.dismiss();
    // toast.error("Total amount is not available");
    //   newErrors.searchItem = "Total amount is not available";
    // }
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    if (isValid) {
      if (isSubmitting) return; // ⛔ Block if already submitting
      else {
        await handleEditItem(); // Call handleEditItem if validation passes

      }
    }
    return isValid;
  };

  /*<================================================================= update purchase item  ============================================================> */

  const handleEditItem = async () => {
    if (isSubmitting) return false; // Prevent double submissions
    setIsSubmitting(true); // Lock

    setUnsavedItems(true);

    const gstMapping = {

      18: 4,

      5: 2,
      0: 1,
    };

    let data = new FormData();
    data.append("user_id", userId);
    if (isEditMode == true) {
      data.append("item_id", selectedEditItemId);
      // data.append("unit_id", value?.unit_id);
    } else {
      if (barcode) {
        data.append("item_id", ItemId);
        data.append("unit_id", Number(0));
      } else {
        data.append("item_id", value?.id);
        data.append("unit_id", value?.unit_id);
      }
    }
    data.append("unit_id", unit);
    data.append("hsn_code", HSN ? HSN : 0);
    data.append("random_number", randomNumber);
    data.append("unit", !unit ? 0 : unit);
    data.append("batch_number", !batch ? 0 : batch);
    data.append("expiry", !expiryDate ? 0 : expiryDate);
    data.append("mrp", !mrp ? 0 : mrp);
    data.append("qty", !qty ? 0 : qty);
    data.append("free_qty", !free ? 0 : free);
    data.append("ptr", !ptr ? 0 : ptr);
    data.append("discount", !disc ? 0 : disc);
    data.append("scheme_account", !schAmt ? 0 : schAmt);
    data.append("base_price", !base ? 0 : base);
    data.append("gst", gstMapping[gst] ?? gst);
    data.append("location", !loc ? "" : loc.toUpperCase());
    data.append("margin", !margin ? 0 : margin);
    data.append("net_amount", !netAmount ? 0 : netAmount);
    data.append("cn_amount", !finalCnAmount ? 0 : finalCnAmount);
    data.append("net_rate", !netRate ? 0 : netRate);
    data.append("total_amount", !ItemTotalAmount ? 0 : ItemTotalAmount);
    data.append("weightage", !unit ? 0 : unit);
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
        : // Add record
        await axios.post("item-purchase", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      setDeleteAll(true);
      itemPurchaseList();
      purchaseBillGetByID();
      setSearchItem("");
      setAutocompleteDisabled(false);
      setUnit("");
      setHSN("");
      setBatch("");
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
      setBatch("");
      setMargin("");
      setLoc("");
      setBarcode("");
      if (ItemTotalAmount <= finalCnAmount) {
        setFinalCnAmount(0);
        setSelectedRows([]);
        setCnTotalAmount({});
      }
      // handleCalNetAmount()
      setItemTotalAmount(0.00);
      setIsEditMode(false);
      setSelectedEditItemId(null);


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

    } finally {
      setIsSubmitting(false);
    }
  };

  /*<============================================================================= leave page =====================================================================> */

  const handleLeavePage = async () => {
    let data = new FormData();
    data.append("start_date", localStorage.getItem("StartFilterDate"));
    data.append("end_date", localStorage.getItem("EndFilterDate"));
    data.append("distributor_id", localStorage.getItem("DistributorId"));
    data.append("type", "1");
    try {
      const response = await axios.post("purches-histroy", data, {
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
        setUnsavedItems(false);
      }
    }
  };
  /*<============================================================================= barcode =====================================================================> */

  const handleBarcode = async () => {
    if (!barcode) {
      return;
    }


    try {
      const response = await axios
        .post(
          "barcode-batch-list?",
          { barcode: barcode },
          {
            // params: params,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )


      if (response.status !== 200) {
        return;
      }


      setUnit(response?.data?.data[0]?.batch_list[0]?.unit);
      setHSN(response?.data?.data[0]?.batch_list[0]?.hsn_code);
      setBatch(response?.data?.data[0]?.batch_list[0]?.batch_name);
      setExpiryDate(response?.data?.data[0]?.batch_list[0]?.expiry_date);
      setMRP(response?.data?.data[0]?.batch_list[0]?.mrp);
      setQty(response?.data?.data[0]?.batch_list[0]?.purchase_qty);
      setFree(response?.data?.data[0]?.batch_list[0]?.purchase_free_qty);
      setPTR(response?.data?.data[0]?.batch_list[0]?.ptr);
      setDisc(response?.data?.data[0]?.batch_list[0]?.discount);
      setSchAmt(response?.data?.data[0]?.batch_list[0]?.scheme_account);
      setBase(response?.data?.data[0]?.batch_list[0]?.base);
      setGst(response?.data?.data[0]?.batch_list[0]?.gst_name);
      setLoc(response?.data?.data[0]?.batch_list[0]?.location);
      setMargin(response?.data?.data[0]?.batch_list[0]?.margin);
      setNetRate(response?.data?.data[0]?.batch_list[0]?.net_rate);
      setSearchItem(response?.data?.data[0]?.batch_list[0]?.iteam_name);

      setItemId(response?.data?.data[0]?.batch_list[0]?.item_id);

      setSelectedEditItemId(response?.data?.data[0]?.id);
      setItemEditID(response.data.data[0]?.id);

      // setIsEditMode(true)

      // handleAddBarcodeItem(data)


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
      if (error.response?.status === 400) {
        toast.error(error.response?.data?.message || "This barcode has no items");
      }
    }
  };
  /*<================================================================= expiry date validation ==============================================================> */

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
  /*<============================================================================== search  =========================================================================> */

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
    data.append("search", searchValue);
    data.append("page", pageNumber); // backend must support this
    data.append("limit", 20); // adjust if needed

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
         if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
      console.error("API error:", error);
    } finally {
      setIsFetchingMore(false);
    }
  };
  /*<================================================================================== delete item   ============================================================> */

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
          setUnsavedItems(true);

          itemPurchaseList();
          purchaseBillGetByID();
          setIsDelete(false);
          removeItem()
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
    }
  };
  /*<===================================================================== submit purchase bill   ================================================================> */
  const handleSubmit = async () => {
    if (isSubmitting) {
      toast.warning("Please wait, request in progress...");
      return;
    }

    setUnsavedItems(false);

    const newErrors = {};
    if (!distributor) {
      newErrors.distributor = "Please select Distributor";
    }
    if (!billNo) {
      newErrors.billNo = "Bill No is Required";
    }
    if (purchase?.item_list?.length === 0) {
      toast.dismiss();
      toast.error("Please add atleast one item");
      newErrors.item = "Please add atleast one item";

    }
    setError(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }


    // Fetch latest purchase data before submitting
    // const distributors = distributorList.length ? distributorList : await listDistributor();
    // await purchaseBillGetByID(distributors);

    // Wait a tick to ensure state is updated (React state is async)
    setTimeout(() => {
      updatePurchase();
    }, 0);
  };

  const updatePurchase = async () => {
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
    data.append("payment_type", paymentType);
    data.append("total_amount", Number(purchase.total_amount) || 0);
    data.append("otherAmt", Number(otherAmt) || 0);
    data.append("net_amount", Number(netAmount) || 0);
    data.append("total_margin", Number(purchase.total_margin) || 0);
    data.append("total_gst", Number(purchase?.total_gst) || 0);
    data.append("round_off", Number(roundOffAmount) || 0);
    data.append("cn_amount", Number(finalCnAmount) || 0);
    data.append("purches_data", JSON.stringify(purchase.item_list));
    data.append("draft_save", "1");


    const params = {
      id: id,
    };
    try {
      await axios
        .post("purches-update", data, {
          params: params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response?.data?.status === 200) {
            toast.dismiss();
            toast.success(response?.data?.message);
            setTimeout(() => {
              history.push("/purchase");
            }, 2000)
          }
        })
    } catch (error) {
         if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
      toast.dismiss();
      toast.error(error.data.message);
      console.error("API error:", error);
      setIsSubmitting(false);

    }
  };

  /*<================================================================= update  state on edit  ============================================================> */

  const handleEditClick = (item) => {
    setAutocompleteKey((prevKey) => prevKey + 1);
    setSelectedEditItem(item);
    setIsEditMode(true);
    setSelectedEditItemId(item.id);
    inputRefs.current[3].focus();

    if (selectedEditItem) {
      setSearchItem(selectedEditItem.item_name);
      setUnit(selectedEditItem.weightage);
      setHSN(selectedEditItem.HSN);
      setBatch(selectedEditItem.batch_number);
      setExpiryDate(selectedEditItem.expiry);
      setMRP(selectedEditItem.mrp);
      setQty(selectedEditItem.qty || 0);
      setFree(selectedEditItem.fr_qty);
      setPTR(selectedEditItem.ptr);
      setDisc(selectedEditItem.disocunt);
      setSchAmt(selectedEditItem.scheme_account);
      setBase(selectedEditItem.base_price);
      setGst(selectedEditItem.gst_name);
      setLoc(selectedEditItem.location);
      setMargin(selectedEditItem.margin);
      setNetRate(selectedEditItem.net_rate);
    }
  };

  /*<================================================================= Open cn popup   ============================================================> */

  const handelAddOpen = () => {
    setUnsavedItems(true);
    setOpenAddPopUp(true);
    purchaseReturnData();
    setHeader("Add Amount");
  };
  /*<================================================================= Handle item input  ============================================================> */

  const handleInputChange = (event, newInputValue) => {
    setSearchItem(newInputValue);
  };

  const handleOptionChange = (event, newValue) => {
    setValue(newValue);
    const itemName = newValue ? newValue.iteam_name : "";
    setSearchItem(itemName);
    setSelectedOption(itemName)
    handleSearch(itemName);
  };

  /*<================================================================= remove item  ============================================================> */

  const removeItem = () => {
    setAutocompleteDisabled(false);
    setSearchItem("");
    setValue("");
    setSelectedOption(null);
    setSearchItem("")
    setSelectedIndex(-1);
    setIsEditMode(false);
    setAutocompleteKey(autocompleteKey + 1)
    setValue("");
    setUnit("");
    setSearchItem("");
    setBatch("");
    setHSN("");
    setExpiryDate("");
    setMRP("");
    setQty("");
    setFree("");
    setPTR("");
    setGst("");
    setDisc("");
    setBase(0);
    setSchAmt(0);
    setBatch("");
    setNetRate(0);
    setMargin("");
    setLoc("");
    setItemTotalAmount(0.00);

    setTimeout(() => {
      inputRefs.current[2]?.focus();
    }, 50);
  };

  /*<================================================================= cn anount select ============================================================> */

  const handleRowSelect = (id, totalAmount) => {
    const newSelectedRows = selectedRows.includes(id)
      ? selectedRows.filter((rowId) => rowId !== id)
      : [...selectedRows, id];

    setSelectedRows(newSelectedRows);

    if (newSelectedRows.includes(id)) {
      setDisabledRows((prev) => ({ ...prev, [id]: false }));
      setCnTotalAmount((prev) => ({ ...prev, [id]: totalAmount }));
      setCnAmount((prev) => prev + parseFloat(totalAmount));
    } else {
      setCnTotalAmount((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
      setCnAmount(0);

      setDisabledRows((prev) => ({ ...prev, [id]: true }));
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(purchase?.cn_bill_list?.map((row) => row.id));
      const updatedAmounts = purchase?.cn_bill_list?.reduce((acc, row) => {
        acc[row.id] = row.total_amount;
        return acc;
      }, {});
      setCnTotalAmount(updatedAmounts);
      setCnAmount(
        purchase?.cn_bill_list?.reduce(
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

  const handleSelectAllPending = (e) => {
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

  const handleRowSelectPending = (id, totalAmount) => {
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
  /*<================================================================= hamdle cn anount  ============================================================> */

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

  const handleRevert = (rowId) => {
    // Clear selected rows
    setSelectedRows([]);

    setCheckboxDisabled(false);

    // Reset final CN amount
    setCnAmount(0);

    setCnTotalAmount((prev) => ({
      ...prev,
      [rowId]: 0,
    }));

    setInputDisabled(false);
  };

  /*<================================================================= hamdle calcualte net   ============================================================> */

  const handleCalNetAmount = (net_amount) => {
    const adjustedTotalAmount = net_amount - finalCnAmount;

    const decimalPart = adjustedTotalAmount - Math.floor(adjustedTotalAmount);

    let netAmountCal;
    let roundOffAmountCal;

    if (decimalPart >= 0.5) {
      netAmountCal = Math.ceil(adjustedTotalAmount); // round off
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
      setError(newErrors);
      setSelectedRows([]);
      setCnTotalAmount({});
      setCnAmount(0);
      return;
    }
    setFinalCnAmount(cnAmount);
    setUnsavedItems(true);
    // setNetAmount(finalTotalAmount - cnAmount)

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
    setOpenAddPopUp(false);
    ;
  };


  /*<================================================================================ ui   ===========================================================================> */

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

          <div>
            {/*<============================================================ Top header & buttons   ===========================================================> */}
            <div className="flex flex-wrap items-center justify-between gap-2 row border-b border-dashed pb-4 border-[var(--color1)]">

              <div className="flex items-center gap-2">
                <span
                  className="text-[var(--color2)] font-bold text-[20px] cursor-pointer"
                  onClick={() => history.push("/purchase")}>
                  Purchase
                </span>
                <span className="w-6 h-6">
                  <ArrowForwardIosIcon
                    fontSize="small"
                    className="text-[var(--color1)]"
                  />
                </span>

                <span className="text-[var(--color1)] font-bold text-[20px]">Edit</span>

                <BsLightbulbFill className="w-6 h-6 text-[var(--color2)] hover-yellow" onClick={() => setShowModal(true)} />

              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex items-center rounded-[4px] bg-[var(--color1)] px-4 py-2 text-white hover:bg-[var(--color2)] transition"
                  onClick={handelAddOpen}
                >
                  <AddIcon className="mr-2" />
                  CN Adjust

                </button>

                <button
                  type="button"
                  className="inline-flex items-center rounded-[4px] bg-[var(--color1)] px-4 py-2 text-white hover:bg-[var(--color2)] transition"
                  onClick={handleSubmit}
                >
                  Update
                </button>
              </div>
            </div>

            {/*<================================================================= Top details   ================================================================> */}

            <div className="flex gap-4  mt-4">
              <div className="flex flex-row gap-4 overflow-x-auto w-full">
                <div>
                  <span className="title mb-2 flex  items-center gap-2">Distributor<span className="text-red-600">*</span>    <FaPlusCircle
                    className="primary cursor-pointer"
                    onClick={() => {
                      history.push('/addDistributer');
                    }}
                  /></span>
                  <Autocomplete
                    value={distributor}
                    disabled
                    sx={{
                      width: "100%",
                      minWidth: "350px",
                      "@media (max-width:600px)": { minWidth: "250px" },
                    }}
                    size="small"
                    onChange={(e, value) => setDistributor(value)}
                    options={distributorList}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => (
                      <TextField
                        variant="outlined"
                        autoComplete="off"
                        {...params}
                        inputRef={(el) => (inputRefs.current[0] = el)}
                        onKeyDown={(e) => handleKeyDown(e, 0)}
                      />
                    )}
                  />
                </div>

                <div>
                  <span className="title mb-2 flex items-center gap-2">Bill No. / Order No.<span className="text-red-600 ">*</span></span>
                  <TextField
                    autoComplete="off"
                    id="outlined-number"
                    size="small"
                    variant="outlined"
                    error={!!error.billNo}
                    value={billNo}
                    disabled
                    sx={{
                      width: "100%",
                      minWidth: "200px",
                      minHeight: "40px",
                      "@media (max-width:600px)": { minWidth: "200px" },
                    }}
                  />
                </div>

                <div>
                  <span className="title mb-2">Bill Date</span>
                  <DatePicker
                    variant="outlined"
                    disabled
                    className="custom-datepicker "
                    selected={selectedDate}
                    onChange={(newDate) => setSelectedDate(newDate)}
                    dateFormat="dd/MM/yyyy"
                  />
                </div>

                <div>
                  <span className="title mb-2">Due Date</span>
                  <DatePicker
                    disabled
                    className="custom-datepicker "
                    selected={dueDate}
                    onChange={(newDate) => setDueDate(newDate)}
                    dateFormat="dd/MM/yyyy"
                    minDate={new Date()}
                  />
                </div>
                <div>
                  <span className="title  mb-2">Scan Barcode</span>

                  <TextField
                    variant="outlined"
                    autoComplete="off"
                    id="outlined-number"
                    type="number"
                    size="small"
                    value={barcode}
                    placeholder="scan barcode"
                    sx={{
                      width: "100%",
                      minWidth: "200px",
                      "@media (max-width:600px)": { minWidth: "200px" },
                    }}
                    onChange={(e) => {
                      setBarcode(e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
            {/*<================================================================Item Table ===============================================================> */}

            <div className="table-container">
              <table className="w-full border-collapse item-table" tabIndex={0} ref={tableRef}>
                <thead>
                  <tr className="input-row">
                    <th>
                      <div className="flex justify-center items-center gap-2">
                        Search Item Name <span className="text-red-600 ">*</span>
                        <FaPlusCircle
                          className="primary cursor-pointer"
                          onClick={() => history.push('/itemMaster')}
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
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'start', alignContent: 'center', }}>
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
                          <span >{searchItem.slice(0, 30)}{searchItem.length > 30 ? '...' : ''}</span>


                        </div>
                      ) : (
                        <Autocomplete
                          value={searchItem?.iteam_name}
                          size="small"
                          key={autocompleteKey}
                          onChange={handleOptionChange}
                          open={autoCompleteOpen}
                          onOpen={() => setAutoCompleteOpen(true)}
                          onClose={() => setAutoCompleteOpen(false)}
                          onInputChange={handleInputChange}
                          disabled={isAutocompleteDisabled}
                          getOptionLabel={(option) => `${option.iteam_name} `}
                          options={itemList}
                          ListboxProps={{
                            onScroll: handleScroll,
                          }}
                          renderOption={(props, option) => (
                            <ListItem {...props}>
                              <ListItemText
                                primary={`${option.iteam_name}`}
                                secondary={` ${option.company_name}`}
                              />
                            </ListItem>
                          )}
                          renderInput={(params) => (
                            <TextField
                              variant="outlined"
                              autoComplete="off"
                              {...params}
                              autoFocus
                              fullWidth
                              sx={{
                                minWidth: 400,
                                width: "100%",
                                '& .MuiInputBase-input': {
                                  // textAlign: 'center',
                                  textTransform: 'uppercase',
                                },
                              }}

                              inputRef={(el) => (inputRefs.current[2] = el)}
                              onKeyDown={(e) => {
                                const { key } = e;
                                const isNavKey = ["Enter", "Tab", "ArrowDown", "ArrowUp"].includes(key);
                                if (!searchItem) {
                                  if (isNavKey) {
                                    e.preventDefault();
                                    if (key === "ArrowDown" || key === "ArrowUp") {
                                      if (!searchItem) {
                                        tableRef.current.focus();
                                        setTimeout(() => document.activeElement.blur(), 0);
                                      }
                                    }
                                  }
                                } else {
                                  if (key === "Enter" || key === "Tab") {
                                    handleKeyDown(e, 2);
                                  }
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

                    <td >
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
                          setBatch(e.target.value.toUpperCase());
                        }}
                        inputRef={(el) => (inputRefs.current[4] = el)}
                        onKeyDown={(e) => {
                          if (batch) {
                            handleKeyDown(e, 4);
                          } else if (e.key === "Tab" || e.key === "Enter") {
                            e.preventDefault();
                            toast.dismiss();
                            toast.error("Batch is Required");
                          }
                        }}
                      />
                    </td>

                    <td >
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
                          const isTab = e.key === "Tab";
                          const isEnter = e.key === "Enter";
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
                            const [month, year] = expiryDate.split("/").map(Number);
                            const expiry = new Date(`20${year}`, month - 1, 1);
                            const now = new Date();
                            const sixMonthsLater = new Date();
                            sixMonthsLater.setMonth(now.getMonth() + 6);
                            if (expiry < now) {
                              e.preventDefault();
                              toast.dismiss();
                              toast.error("Product has expired");
                            } else if (expiry < sixMonthsLater) {
                              e.preventDefault();
                              toast.warning("Product will expire within 6 months");
                              handleKeyDown(e, 5);
                            } else {
                              handleKeyDown(e, 5);
                            }
                          }
                        }}
                      />
                    </td>
                    <td >
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
                          if (["e", "E", "+", "-", ","].includes(e.key) || (e.key === "." && e.target.value.includes("."))) {
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
                    <td >
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
                          const value = e.target.value.replace(/[^0-9]/g, "");
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
                            const isQtyEmptyOrZero = !qty || Number(qty) === 0;
                            const isFreeEmptyOrZero = !free || Number(free) === 0;
                            if (isQtyEmptyOrZero && isFreeEmptyOrZero) {
                              toast.dismiss();
                              toast.error("Quantity and free quantity both can't be empty or zero");
                              return;
                            }
                            handleKeyDown(e, 8);
                          }
                        }}
                        inputRef={(el) => (inputRefs.current[8] = el)}
                      />
                    </td>
                    <td >
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
                            //   toast.dismiss();
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
                    <td >
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
                        type="number"
                        value={disc}
                        onKeyDown={(e) => {
                          const invalidKeys = ["e", "E", "+", "-", ","];
                          if (invalidKeys.includes(e.key) || (e.key === "." && e.target.value.includes("."))) {
                            e.preventDefault();
                          }
                          handleKeyDown(e, 10);
                        }}
                        onChange={(e) => {
                          let value = Number(e.target.value);
                          if (value > 99) {
                            value = 99;
                          }
                          handleSchAmt({ ...e, target: { ...e.target, value: String(value) } });
                        }}
                        inputRef={(el) => (inputRefs.current[10] = el)}
                      />
                    </td>
                    <td >
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
                    <td >
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
                            const allowedGST = [0, 5, 18,];
                            if (gst === "" || gst === null || gst === undefined) {
                              e.preventDefault();
                              toast.dismiss();
                              toast.error("GST is required");
                              return;
                            }
                            if (!allowedGST.includes(Number(gst))) {
                              e.preventDefault();
                              toast.dismiss();
                              toast.error("Only 0%,5%,18%, GST is allowed");
                              return;
                            }
                          }
                          handleKeyDown(e, 11);
                        }}
                      />
                    </td>
                    <td >
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
                            updatePurchaseValidation();
                          }
                        }}
                      />
                    </td>
                    <td >
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
                    <td >
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
                    <td className="total" >
                      <span className="font-bold">{ItemTotalAmount.toFixed(2)}</span>
                    </td>
                  </tr>

                  {/*<==============================================================   item rows   =============================================================> */}

                  {purchase?.item_list?.map((item, index) => (

                    <>
                      <tr
                        key={item.id}
                        onClick={() => {
                          setSelectedIndex(index);
                          handleEditClick(item);
                        }}
                        className={`item-List cursor-pointer ${index === selectedIndex ? "highlighted-row" : ""}`}
                        style={{ borderBottom: index !== purchase.item_list.length - 1 ? '1px solid #e0e0e0' : 'none' }}
                      >
                        <td style={{ display: "flex", gap: "5px", textAlign: "left", verticalAlign: "left", }}>
                          <div>
                            <BorderColorIcon
                              style={{ color: "var(--color1)" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditClick(item);
                              }}
                            />
                            <DeleteIcon
                              className="delete-icon bg-none"
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsDelete(true)
                                setItemId(item.id)
                                setUnsavedItems(true)
                              }
                              }
                            />
                          </div>

                          <span style={{ alignSelf: "center" }}>{item.item_name ? item.item_name : "-----"}</span>
                        </td>
                        <td style={{ textAlign: "center", verticalAlign: "middle" }}>{item.weightage ? item.weightage : "-----"}</td>
                        <td style={{ textAlign: "center", verticalAlign: "middle" }}>{item.batch_number ? item.batch_number : "-----"}</td>
                        <td style={{ textAlign: "center", verticalAlign: "middle" }}>{item.expiry ? item.expiry : "-----"}</td>
                        <td style={{ textAlign: "center", verticalAlign: "middle" }}>{item.mrp ? item.mrp : "-----"}</td>
                        <td style={{ textAlign: "center", verticalAlign: "middle" }}>{item.qty ? item.qty : "-----"}</td>
                        <td style={{ textAlign: "center", verticalAlign: "middle" }}>{item.fr_qty ? item.fr_qty : "-----"}</td>
                        <td style={{ textAlign: "center", verticalAlign: "middle" }}>{item.ptr ? item.ptr : "-----"}</td>
                        <td style={{ textAlign: "center", verticalAlign: "middle" }}>{item.disocunt ? item.disocunt : "-----"}</td>
                        <td style={{ textAlign: "center", verticalAlign: "middle" }}>{item.base_price ? item.base_price : "-----"}</td>
                        <td style={{ textAlign: "center", verticalAlign: "middle" }}>{item.gst_name ? item.gst_name : "-----"}</td>
                        <td style={{ textAlign: "center", verticalAlign: "middle" }}>{item.location ? item.location : "-----"}</td>
                        <td style={{ textAlign: "center", verticalAlign: "middle" }}>{item.net_rate ? item.net_rate : "-----"}</td>
                        <td style={{ textAlign: "center", verticalAlign: "middle" }}>{item.margin ? item.margin : "-----"}</td>
                        <td className="total " style={{ fontWeight: "bold", textAlign: "center", verticalAlign: "middle" }}>{item.amount ? item.amount : "-----"}</td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </div>

            {/*<============================================================== total and other details  =============================================================> */}
            <div
              className=""
              style={{
                background: "var(--color1)",
                color: "white",
                display: "flex",
                justifyContent: "space-between",
                overflow: "auto",
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

                  <span style={{ fontWeight: 600 }}>{purchase?.total_gst} </span>
                </div>
                <div
                  className="gap-2 invoice_total_fld"
                  style={{ display: "flex" }}
                >
                  <label className="font-bold">Total Qty : </label>
                  <span style={{ fontWeight: 600 }}>
                    {purchase?.total_qty} +
                    <span className="">
                      {purchase?.total_free_qty ? purchase?.total_free_qty : 0}
                      Free
                    </span>
                  </span>
                </div>
                <div
                  className="gap-2 invoice_total_fld"
                  style={{ display: "flex" }}
                >
                  <label className="font-bold">Total Base : </label>
                  <span style={{ fontWeight: 600 }}>{purchase?.total_base}</span>
                </div>
                <div
                  className="gap-2 invoice_total_fld"
                  style={{ display: "flex" }}
                >
                  <label className="font-bold">Total Net Profit : </label>
                  <span style={{ fontWeight: 600 }}>
                    &#8377; {purchase?.total_net_rate}
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
                    {parseFloat(netAmount)}
                    <FaCaretUp />
                  </span>
                </div>

                <Modal
                  show={isModalOpen}
                  onClose={() => {
                    setIsModalOpen(!isModalOpen);
                  }}
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
                    <IoMdClose
                      onClick={() => {
                        setIsModalOpen(!isModalOpen);
                      }}
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
                      <span style={{ fontWeight: 600 }}>
                        {(parseFloat(purchase?.total_amount) || 0).toFixed(2)}
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
                        {-(parseFloat(finalCnAmount) || 0).toFixed(2)}
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
                          }}
                          size="small"
                          sx={{
                            "& .MuiInputBase-root": { height: "35px" },
                            "& .MuiInputBase-input": { textAlign: "end" },
                          }}
                        />

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
                      <span>{(parseFloat(roundOffAmount) || 0).toFixed(2)}</span>
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
                        {(parseFloat(netAmount) || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </Modal>
              </div>
            </div>
          </div>
          {/*<============================================================ Cn Adjust Edit Revert PopUp Box  ===========================================================> */}

          <Dialog open={openAddPopUp} className="custom-dialog max-991">
            <DialogTitle id="alert-dialog-title" className="secondary">
              {header}
            </DialogTitle>
            <IconButton
              aria-label="close"
              onClick={() => setOpenAddPopUp(false)}
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
                          <td>No data found</td>
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
          {/*<================================================================ Delete PopUP ===============================================================> */}

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
          {/*<================================================================ Leave page PopUP ===============================================================> */}

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
                  onClick={() => setIsOpenBox(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
          {showModal && (
            <TipsModal
              id="edit-purchase"
              onClose={() => setShowModal(false)}
            />
          )}
        </div >
      </>
    </>

  );
};

export default EditPurchaseBill;
