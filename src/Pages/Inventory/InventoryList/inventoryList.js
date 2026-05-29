import React, { useEffect, useRef, useState } from "react";
import Header from "../../Header";
import { saveAs } from "file-saver";
import AssignmentIcon from "@mui/icons-material/Assignment";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import DatePicker from "react-datepicker";
import {
  Box,
  ListItem,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  TableContainer,
  TablePagination,
  Paper,
  InputAdornment,
  IconButton,
  Button,
  Tooltip,
  Autocomplete,
  Menu,
  Drawer,
  OutlinedInput,

} from "@mui/material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
} from "@mui/material";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import { BsLightbulbFill } from "react-icons/bs";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import axios from "axios";
import Loader from "../../../componets/loader/Loader";
import tablet from "../../../componets/Images/tablet.png";
import SearchIcon from "@mui/icons-material/Search";
import { toast, ToastContainer } from "react-toastify";
import { format, subDays } from "date-fns";
import { GridCloseIcon } from "@mui/x-data-grid";
const InventoryList = () => {
  const csvIcon = process.env.PUBLIC_URL + "/csv-file.png";
  const [searchItem, setSearchItem] = useState("");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedOptionExpiry, setSelectedOptionEpiry] = useState([]);
  const [selectedOptionStock, setSelectedOptionStock] = useState("");
  const [manufacturer, setManufacturer] = useState(null);
  const [marginStart, setMarginStart] = useState("");
  const [marginEnd, setMarginEnd] = useState("");
  const [ptrStart, setPTRStart] = useState("");
  const [ptrEnd, setPTREnd] = useState("");
  const [mrpStart, setMRPStart] = useState("");
  const [mrpEnd, setMRPEnd] = useState("");
  const [location, setLocation] = useState(null);
  const [drugGroup, setDrugGroup] = useState(null);
  const [hsnCode, setHsnCode] = useState("");
  const token = localStorage.getItem("token");
  const defaultList = "../../pharmalogo.webp";
  const history = useHistory();
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [data, setData] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [packgingTypeList, setPackgingTypeList] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [selectedPackgingIds, setSelectedPackgingIds] = useState([]);
  const [gstList, setGstList] = useState([]);
  const [selectedGstIds, setSelectedGstIds] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [itemBatchData, setItemBatchData] = useState();
  const [openAddPopUp, setOpenAddPopUp] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [stock, setStock] = useState("");
  const [adjustStockListData, setAdjustStockListData] = useState([]);
  const [unit, setUnit] = useState("");
  const [remainingStock, setRemainingStock] = useState("");
  const [batchListData, setBatchListData] = useState([]);
  const [QRBatch, setQRBatch] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [expiry, setExpiry] = useState("");
  const [mrp, setMrp] = useState("");
  const [selectedItem, setSelectedItem] = useState();
  const [batch, setBatch] = useState();
  const [stockAdjust, setStockAdjust] = useState("");
  const [adjustmentDate, setAdjustDate] = useState(new Date());
  const [purchaseItemData, setpurchaseItemData] = useState([]);
  const [itemId, setItemId] = useState(null);
  const [companyList, setCompanyList] = useState([]);
  const [errors, setErrors] = useState({});
  const [locationBulk, setLocationBulk] = useState();
  const [drugGroupList, setDrugGroupList] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [bulkOrder, setBulkOrder] = useState(false);
  const [openQR, setOpenQR] = useState(false);
  const [barcode, setBarcode] = useState();
  const [selectedIndex, setSelectedIndex] = useState(-1); // -1 means no row is selected
  const [isAutocompleteFocused, setIsAutocompleteFocused] = useState(false);
  const autocompleteRef = useRef(null);

  const [missingData, setmissingData] = useState(false);

  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawerFilter = (open) => () => {
    setDrawerOpen(open);
  };
  /*<=============================================================================== handle key up and down ======================================================================> */

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isAutocompleteFocused) {
        if (e.key === "ArrowDown") {
          setSelectedIndex((prevIndex) =>
            prevIndex < data.length - 1 ? prevIndex + 1 : prevIndex
          );
          e.preventDefault();
        } else if (e.key === "ArrowUp") {
          setSelectedIndex((prevIndex) =>
            prevIndex > 0 ? prevIndex - 1 : prevIndex
          );
          e.preventDefault();
        } else if (e.key === "Enter" && selectedIndex !== -1) {
          history.push(`/inventoryView/${data[selectedIndex].id}`);
          e.preventDefault();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [data, selectedIndex, history, isAutocompleteFocused]);
  /*<=============================================================================== get intial data ======================================================================> */

  useEffect(() => {
    missingCount();

    listItemcatagory();
    listPackgingtype();
    listOfGst();
    listOfCompany();
    listDrougGroup();
    listLocation();
  }, []);



  useEffect(() => {
    const x = parseFloat(stock) + parseFloat(stockAdjust);
    setRemainingStock(x);
  }, [stockAdjust]);

  useEffect(() => {
    handleSearch();
  }, [page, rowsPerPage]);

  let missingCount = () => {
    axios
      .get("iteam-search-tags", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {

        setmissingData(response.data.data);
      })
      .catch((error) => {
        console.error("API Error:", error);
        if (error?.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          localStorage.removeItem("role");
          localStorage.clear();
          history.push("/");
        }
      });

  };

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
        if (error?.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          localStorage.removeItem("role");
          localStorage.clear();
          history.push("/");
        }
      });
  };

  let listItemcatagory = () => {
    axios
      .get("list-itemcategory", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setCategoryList(response.data.data);
        // setIsLoading(false);
      })
      .catch((error) => {
        if (error?.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          localStorage.removeItem("role");
          localStorage.clear();
          history.push("/");
        }

      });
  };

  let listDrougGroup = () => {
    axios

      .post("drug-list?", {}, {
        params: {},
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setDrugGroupList(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        if (error?.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          localStorage.removeItem("role");
          localStorage.clear();
          history.push("/");
        }

      });
  };

  let listLocation = () => {
    axios
      .get("item-location", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setLocationList(response.data.data);

      })
      .catch((error) => {
        if (error?.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          localStorage.removeItem("role");
          localStorage.clear();
          history.push("/");
        }
      });
  };

  let listPackgingtype = () => {
    axios
      .get("list-package", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setPackgingTypeList(response.data.data);

      })
      .catch((error) => {
        if (error?.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          localStorage.removeItem("role");
          localStorage.clear();
          history.push("/");
        }
      });
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
        if (error?.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          localStorage.removeItem("role");
          localStorage.clear();
          history.push("/");
        }
      });
  };

  /*<=============================================================================== handle more button ======================================================================> */

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  /*<=============================================================================== handle bulk order ======================================================================> */

  const handleBulkOrder = () => {
    setBulkOrder(true);
    handleClose();
  };
  /*<=============================================================================== handle bulk edit ======================================================================> */

  const handleBulkEdit = () => {
    setOpenEdit(true);
    setBarcode();
    handleClose();
  };

  /*<=============================================================================== handle bulk order ======================================================================> */
  const handleBulkQR = () => {
    batchID();

  };

  const batchID = async () => {
    let data = new FormData();
    data.append("item_bulk_id", selectedItems);

    try {
      const res = await axios.post("item-bulk-batch-list?", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const batchData = res.data.data;

      function extractBatchListData(batchData) {
        return batchData.map(item => ({
          item_name: item.iteam_name,
          item_id: item.item_id,
          batch_id: item.id,
          qty: item.qty
        }));
      }

      const extractBatch = extractBatchListData(batchData);
      setQRBatch(extractBatch);
      setOpenQR(true);

      if (res.data.status === 200) {

        // Call QR code API with 'data' key in body
        // await callBulkQRCode(batchListData);
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

  // Separate function, outside or inside as you want
  const callBulkQRCode = async () => {
    const cleanQRBatch = QRBatch.map(({ item_name, ...rest }) => rest);

    try {
      const response = await axios.post(
        "item-bulk-qr-code?",
        { data: cleanQRBatch },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === 200) {
        toast.dismiss();
        toast.success("QR code Print will be available soon");

        const url = response.data.pdf_url;

        if (typeof url === "string") {

          window.open(url, "_blank");
        } else {
          console.error("Invalid URL for the PDF");
        }

      }
    } catch (error) {
      console.error("QR code API error:", error);
      if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
    }
  };


  /*<=============================================================================== handle Checkbox ======================================================================> */

  const handleCheckbox = (itemId) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(itemId)
        ? prevSelected.filter((id) => id !== itemId)
        : [...prevSelected, itemId]
    );

  };

  /*<==================================================================================== pagination  ===========================================================================> */

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  /*<==================================================================================== checkbox  ===========================================================================> */

  const handleCheckboxChange = (event, categoryId) => {
    setSelectedCategoryIds((prevSelectedIds) => {
      if (event.target.checked) {
        // Add the category ID if the checkbox is checked
        return [...prevSelectedIds, categoryId];
      } else {
        // Remove the category ID if the checkbox is unchecked
        return prevSelectedIds.filter((id) => id !== categoryId);
      }
    });
  };
  const handleCheckboxPackging = (event, PackgingId) => {
    setSelectedPackgingIds((prevSelectedIds) => {
      if (event.target.checked) {
        // Add the category ID if the checkbox is checked
        return [...prevSelectedIds, PackgingId];
      } else {
        // Remove the category ID if the checkbox is unchecked
        return prevSelectedIds.filter((id) => id !== PackgingId);
      }
    });
  };
  const handleCheckboxChangeGst = (event, gstId) => {
    setSelectedGstIds((prevSelectedIds) => {
      if (event.target.checked) {
        // Add the category ID if the checkbox is checked
        return [...prevSelectedIds, gstId];
      } else {
        // Remove the category ID if the checkbox is unchecked
        return prevSelectedIds.filter((id) => id !== gstId);
      }
    });
  };
  /*<==================================================================================== expirydate  ===========================================================================> */

  const handleExpiryChange = (event) => {
    const { value } = event.target;
    setSelectedOptionEpiry((prevSelectedOptions) =>
      prevSelectedOptions.includes(value)
        ? prevSelectedOptions.filter((option) => option !== value)
        : [...prevSelectedOptions, value]
    );
  };
  /*<==================================================================================== batch list  ===========================================================================> */

  const ItemvisebatchList = async (itemId) => {
    let data = new FormData();
    data.append("iteam_id", itemId);
    const params = {
      iteam_id: itemId,
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
          setBatchListData(response.data.data);
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
  /*<==================================================================================== handle search  ===========================================================================> */

  const handleSearch = async (payload) => {
    let data = new FormData();
    data.append("search", searchItem);
    data.append("item", selectedOption);
    data.append("category", selectedCategoryIds.join(","));
    data.append("package", selectedPackgingIds.join(","));
    data.append("stock", selectedOptionStock);
    data.append("manufacturer", manufacturer == null ? "" : manufacturer?.id);
    data.append("drug_group", drugGroup == null ? "" : drugGroup?.id);
    data.append("gst", selectedGstIds.join(","));
    data.append("location", location == null ? "" : location);
    data.append("hsn_code", hsnCode);
    data.append("margin_end", marginEnd);
    data.append("margin_start", marginStart);
    data.append("mrp_end", mrpEnd);
    data.append("mrp_start", mrpStart);
    data.append("ptr_start", ptrStart);
    data.append("ptr_end", ptrEnd);
    data.append("expired", selectedOptionExpiry.join(","));
    data.append(payload, "1");
    // data.append("drug", drugGroup);
    const params = {
      page: page + 1,
      limit: rowsPerPage,
      search: searchItem,
      item: selectedOption,
      category: selectedCategoryIds.join(","),
      package: selectedPackgingIds.join(","),
      stock: selectedOptionStock,
      manufacturer: manufacturer == null ? "" : manufacturer?.id,
      drug_group: drugGroup == null ? "" : drugGroup?.id,
      gst: selectedGstIds.join(","),
      location: location,
      hsn_code: hsnCode,
      margin_end: marginEnd,
      margin_start: marginStart,
      mrp_start: mrpStart,
      mrp_end: mrpEnd,
      ptr_start: ptrStart,
      ptr_end: ptrEnd,
      expired: selectedOptionExpiry.join(","),
    };
    setIsLoading(true);
    try {
      const res = await axios
        .post("item-search?", data, {
          params: params,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setData(response.data.data.data);
          if (response.data.data.data.length == 0) {
            // toast.dismiss();
            toast.error("No Record Found");
          }
          setIsLoading(false);

          // setSearchItem("");
          setSelectedOption("");
          setHsnCode("");
          setSelectedCategoryIds([]);
          setSelectedPackgingIds([]);
          setSelectedOptionStock([]);
          setSelectedOptionEpiry([]);
          setManufacturer(null);
          setDrugGroup(null);
          setSelectedGstIds([]);
          setLocation("");
          setMarginStart("");
          setMarginEnd("");
          setMRPStart("");
          setMRPEnd("");
          setPTREnd("");
          setPTRStart("");
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
  /*<==================================================================================== handle search  ===========================================================================> */
  const handleReset = async () => {
    // Reset all states
    setSearchItem("");
    setSelectedOption("");
    setHsnCode("");
    setSelectedCategoryIds([]);
    setSelectedPackgingIds([]);
    setSelectedOptionStock([]);
    setSelectedOptionEpiry([]);
    setManufacturer(null);
    setDrugGroup(null);
    setSelectedGstIds([]);
    setLocation("");
    setMarginStart("");
    setMarginEnd("");
    setMRPStart("");
    setMRPEnd("");
    setPTREnd("");
    setPTRStart("");

    // Prepare API call
    let data = new FormData();
    const params = {};

    setIsLoading(true);
    try {
      const res = await axios.post("item-search?", data, {
        params: params,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setData(res.data.data.data);
      if (res.data.data.data.length == 0) {
        // toast.dismiss();
        toast.error("No Record Found");
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
    } finally {
      setIsLoading(false);
    }
  };

  /*<================================================================================= sort table data  ========================================================================> */

  const sortByColumn = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });

    const sortedData = [...data].sort((a, b) => {
      let aValue = a[key];
      let bValue = b[key];
      //     // Convert values to numbers if they are numeric
      if (
        key === "mrp" ||
        key === "stock" ||
        key === "discount" ||
        key === "barcode"
      ) {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }
      if (aValue < bValue) return direction === "ascending" ? -1 : 1;
      if (aValue > bValue) return direction === "ascending" ? 1 : -1;
      return 0;
    });

    setData(sortedData);
  };

  const handleOptionChange = (event, newValue) => {
    const itemName = newValue ? newValue.iteam_name : "";
    setSelectedItem(itemName);
    setItemId(newValue?.id);
  };

  /*<====================================================================================== bulk order  =============================================================================> */

  const resetAddDialog = () => {
    setOpenAddPopUp(false);
    setBatch();
    setSelectedCompany();
    setSelectedItem();
    setUnit("");
    setExpiry("");
    setMrp("");
    setStock("");
    setStockAdjust("");
    setRemainingStock("");
    setAdjustDate(new Date());
  };
  /*<====================================================================================== bulk order  =============================================================================> */

  const resetbulkDialog = () => {
    setOpenEdit(false);
    setBarcode("");
    setLocationBulk("");
  };

  const validateBulkOrder = async () => {
    const newErrors = {};
    if (selectedItems.length == 0) {
      newErrors.selectedItems = "Please First Select any Item.";
      toast.dismiss();
      toast.error(newErrors.selectedItems);
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      bulkOrderData();
    } else {
      return Object.keys(newErrors).length === 0;
    }
  };

  const handleInputChange = (event, newInputValue) => {
    setLocationBulk(newInputValue);
    // handleSearch(newInputValue);

  };

  const bulkOrderData = async () => {
    let data = new FormData();
    setIsLoading(true);
    data.append("item_id", selectedItems.join(","));
    // data.append('location', locationBulk);
    // data.append('barcode', barcode);

    try {
      await axios
        .post("online-bulck-order", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setIsLoading(false);
          toast.dismiss();
          toast.success(response.data.message);
          handleSearch();
          setBulkOrder(false);

          // setLocationBulk('');
          // setBarcode('');
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

  /*<====================================================================================== bulk edit  =============================================================================> */

  const validateBulkForm = async () => {
    const newErrors = {};
    if (selectedItems.length == 0) {
      newErrors.selectedItems = "Please First Select any Item.";
      toast.dismiss();
      toast.error(newErrors.selectedItems);
    } else if (!barcode && !locationBulk) {
      newErrors.locationBulk = "Please add Location or Barcode.";
      toast.dismiss();
      toast.error(newErrors.locationBulk);
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      bulkEdit();
    } else {
      return Object.keys(newErrors).length === 0;
    }
  };

  const bulkEdit = async () => {
    let data = new FormData();
    setIsLoading(true);
    data.append("item_id", selectedItems.join(","));
    data.append("location", locationBulk);
    data.append("barcode", barcode);

    try {
      await axios
        .post("bulk-edit", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setIsLoading(false);
          toast.dismiss();
          toast.success(response.data.message);
          handleSearch();
          setOpenEdit(false);
          setLocationBulk("");
          listLocation();
          setBarcode("");
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
  /*<===========================================================================  stock adjustment  ==================================================================> */
  const handleBatchData = (event, newValue) => {
    const batch = newValue ? newValue.batch_name : "";
    setBatch(batch);
    setUnit(newValue?.unit);
    setExpiry(newValue?.expiry_date);
    setMrp(newValue?.mrp);
    setStock(newValue?.qty);
    setSelectedCompany(newValue?.company_name);
  };
  const validateForm = async () => {
    const newErrors = {};

    if (!selectedItem) {
      newErrors.selectedItem = "select any Item Name.";
      toast.dismiss();
      toast.error(newErrors.selectedItem);
    } else if (!batch) {
      newErrors.batch = "Batch Number is required";
      toast.dismiss();
      toast.error(newErrors.batch);
      // } else if (!selectedCompany) {
      //   newErrors.selectedCompany = "select any Company Name";
      //   toast.dismiss();
      //   toast.error(newErrors.selectedCompany);
    } else if (!stockAdjust) {
      newErrors.stockAdjust = "please Enter any Adjust Stock Number";
      toast.dismiss();
      toast.error(newErrors.stockAdjust);
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      adjustStockAddData();
    } else {
      return Object.keys(newErrors).length === 0;
    }
  };

  const adjustStockAddData = async () => {
    let data = new FormData();
    setIsLoading(true);
    data.append(
      "adjustment_date",
      adjustmentDate ? format(adjustmentDate, "yyyy-MM-dd") : ""
    );
    data.append("item_name", selectedItem?.id);
    data.append("batch", batch);
    data.append("company", selectedCompany?.id);
    data.append("unit", unit);
    data.append("expiry", expiry);
    data.append("mrp", mrp);
    data.append("stock", stock);
    data.append("stock_adjust", stockAdjust);
    data.append("remaining_stock", remainingStock);

    try {
      await axios
        .post("adjust-stock", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setIsLoading(false);
          toast.dismiss();
          toast.success(response.data.message);
          setOpenAddPopUp(false);
          setBatch();
          setSelectedCompany();
          // adjustStockList();
          setSelectedItem();
          setUnit("");
          setExpiry("");
          setMrp("");
          setStock("");
          setStockAdjust("");
          setRemainingStock("");
          setAdjustDate(new Date());
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
  /*<=============================================================================== handle popup open ======================================================================> */

  const handelAddOpen = (item) => {
    setOpenAddPopUp(true);
    setSelectedItem(item);
    const company = companyList.find((x) => x.id == item?.company_id);
    setSelectedCompany(company);
    ItemvisebatchList(item?.id);
  };
  /*<================================================================================== handle serch  =========================================================================> */

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  /*<======================================================================== handle downoload batchwise data  ===============================================================> */

  const handleFilterData = async () => {
    let data = new FormData();
    setIsLoading(true);
    try {
      await axios
        .post("item-batch-imports", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setIsLoading(false);
          setItemBatchData(response.data.data);
          exportToCSV(response.data.data);
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

  const exportToCSV = (data) => {
    const csvRows = data
      .map((row) => {
        return Object.values(row)
          .map((value) => {
            const escaped = ("" + value).replace(/"/g, '""');
            return `"${escaped}"`;
          })
          .join(",");
      })
      .join("\n");

    // Combine the header and rows
    const csvString = csvRows;

    // Create a Blob object for the CSV and trigger the download
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "item_batch_data.csv");
  };

  /*<=============================================================================== ui ======================================================================> */

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
      {isLoading && (
        <div className="loader-container ">
          <Loader />
        </div>
      )}
      {/*<=============================================================================== side filter ======================================================================> */}

      <div className="filterDrawer_fld pt-5 pl-5">
        <Button
          variant="contained"
          onClick={toggleDrawerFilter(true)}
          style={{
            background: "var(--color1)",
            color: "white",
          }}
        >
          Filter
        </Button>

        {/* Drawer Component */}
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={toggleDrawerFilter(false)}
          PaperProps={{
            sx: { width: { xs: "100%", sm: 300 } },
          }}
        >
          <Box>
            <Box
              className="custom-scroll"
              role="presentation"
              onClick={() => toggleDrawerFilter(false)}
            >
              <IconButton
                aria-label="close"
                onClick={() => setDrawerOpen(false)}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: "#ffffff",
                }}
              >
                <CloseIcon />
              </IconButton>
              <Box>
                <h1
                  className="text-2xl flex items-center justify-start p-2"
                  style={{ color: "var(--COLOR_UI_PHARMACY)" }}
                >
                  Inventory
                  <BsLightbulbFill className="ml-4 secondary hover-yellow" />
                </h1>
              </Box>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography
                    style={{ color: "var(--COLOR_UI_PHARMACY)" }}
                    sx={{ my: 0 }}
                  >
                    Items
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ListItem disablePadding>
                    <FormControl>
                      <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="items"
                        name="radio-buttons-group"
                        value={selectedOption}
                        sx={{
                          color: "var(--COLOR_UI_PHARMACY)", // Apply color to labels
                          "& .MuiRadio-root": {
                            color: "var(--color2)", // Unchecked radio button color
                          },
                          "& .Mui-checked": {
                            color: "var(--COLOR_UI_PHARMACY)", // Checked radio button color
                          },
                        }}
                        onChange={(e) => setSelectedOption(e.target.value)}
                      >
                        <FormControlLabel
                          value="all_Items"
                          control={<Radio />}
                          label="All Items"
                        />
                        <FormControlLabel
                          value="only_Newly_Added_Items"
                          control={<Radio />}
                          label="Only Newly Added Items"
                        />
                        <FormControlLabel
                          value="discontinued_items"
                          control={<Radio />}
                          label="Discontinued Items"
                        />
                        <FormControlLabel
                          value="only_Not_Set_HSN_Code"
                          control={<Radio />}
                          label="Only Not Set HSN Code"
                        />
                        <FormControlLabel
                          value="only_Not_Set_Categories"
                          control={<Radio />}
                          label="Only Not Set Categories"
                        />
                      </RadioGroup>
                    </FormControl>
                  </ListItem>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography style={{ color: "var(--COLOR_UI_PHARMACY)" }}>
                    Category
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ListItem disablePadding>
                    <FormGroup>
                      {categoryList.map((category) => (
                        <FormControlLabel
                          key={category.id}
                          control={
                            <Checkbox
                              sx={{
                                color: "#628a2f", // Color for unchecked checkboxes
                                "&.Mui-checked": {
                                  color: "var(--COLOR_UI_PHARMACY)", // Color for checked checkboxes
                                },
                              }}
                              checked={selectedCategoryIds.includes(
                                category.id
                              )}
                              onChange={(event) =>
                                handleCheckboxChange(event, category.id)
                              }
                              name={category.name}
                            />
                          }
                          label={category.category_name}
                        />
                      ))}
                    </FormGroup>
                  </ListItem>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography style={{ color: "var(--COLOR_UI_PHARMACY)" }}>
                    Packging Type
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ListItem disablePadding>
                    <FormGroup>
                      {packgingTypeList.map((packging) => (
                        <FormControlLabel
                          key={packging.id}
                          control={
                            <Checkbox
                              sx={{
                                color: "#628a2f", // Color for unchecked checkboxes
                                "&.Mui-checked": {
                                  color: "var(--COLOR_UI_PHARMACY)", // Color for checked checkboxes
                                },
                              }}
                              checked={selectedPackgingIds.includes(
                                packging.id
                              )}
                              onChange={(event) =>
                                handleCheckboxPackging(event, packging.id)
                              }
                              name={packging.name}
                            />
                          }
                          label={packging.packging_name}
                        />
                      ))}
                    </FormGroup>
                  </ListItem>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography style={{ color: "var(--COLOR_UI_PHARMACY)" }}>
                    Expiry
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ListItem disablePadding>
                    <AccordionDetails>
                      <ListItem disablePadding>
                        <FormGroup
                          value={selectedOptionExpiry}
                          onChange={handleExpiryChange}
                        // onChange={(e) => setSelectedOptionEpiry(e.target.value)}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                sx={{
                                  color: "#628a2f", // Color for unchecked checkboxes
                                  "&.Mui-checked": {
                                    color: "var(--COLOR_UI_PHARMACY)", // Color for checked checkboxes
                                  },
                                }}
                                checked={selectedOptionExpiry.includes(
                                  "expired"
                                )}
                                value="expired"
                              />
                            }
                            label="Expired"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                sx={{
                                  color: "#628a2f", // Color for unchecked checkboxes
                                  "&.Mui-checked": {
                                    color: "var(--COLOR_UI_PHARMACY)", // Color for checked checkboxes
                                  },
                                }}
                                checked={selectedOptionExpiry.includes(
                                  "next_month"
                                )}
                                value="next_month"
                              />
                            }
                            label="Next Month"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                sx={{
                                  color: "#628a2f", // Color for unchecked checkboxes
                                  "&.Mui-checked": {
                                    color: "var(--COLOR_UI_PHARMACY)", // Color for checked checkboxes
                                  },
                                }}
                                checked={selectedOptionExpiry.includes(
                                  "next_two_month"
                                )}
                                value="next_two_month"
                              />
                            }
                            label="Next 2 Month"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                sx={{
                                  color: "#628a2f", // Color for unchecked checkboxes
                                  "&.Mui-checked": {
                                    color: "var(--COLOR_UI_PHARMACY)", // Color for checked checkboxes
                                  },
                                }}
                                checked={selectedOptionExpiry.includes(
                                  "next_three_month"
                                )}
                                value="next_three_month"
                              />
                            }
                            label="Next 3 Month"
                          />
                        </FormGroup>
                      </ListItem>
                    </AccordionDetails>
                  </ListItem>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography style={{ color: "var(--COLOR_UI_PHARMACY)" }}>
                    Stock
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ListItem disablePadding>
                    <FormControl>
                      <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="items"
                        name="radio-buttons-group"
                        sx={{
                          color: "var(--COLOR_UI_PHARMACY)", // Apply color to labels
                          "& .MuiRadio-root": {
                            color: "#628a2f", // Unchecked radio button color
                          },
                          "& .Mui-checked": {
                            color: "var(--COLOR_UI_PHARMACY)", // Checked radio button color
                          },
                        }}
                        value={selectedOptionStock}
                        onChange={(e) => setSelectedOptionStock(e.target.value)}
                      >
                        <FormControlLabel
                          value="0_15"
                          control={<Radio />}
                          label="0 to 15"
                        />
                        <FormControlLabel
                          value="15_30"
                          control={<Radio />}
                          label="15 to 30"
                        />
                        <FormControlLabel
                          value="above_30"
                          control={<Radio />}
                          label="Above 30"
                        />
                        <FormControlLabel
                          value="minus_one"
                          control={<Radio />}
                          label="Minus Stock"
                        />
                      </RadioGroup>
                    </FormControl>
                  </ListItem>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography style={{ color: "var(--COLOR_UI_PHARMACY)" }}>
                    Company
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ListItem disablePadding>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={companyList}
                      size="small"
                      value={manufacturer}
                      onChange={(e, value) => {
                        setManufacturer(value);
                        if (e.type === "keydown" && e.key === "Enter") {
                          handleSearch();
                        }
                      }}
                      sx={{ width: 350 }}
                      getOptionLabel={(option) => option.company_name}
                      renderInput={(params) => (
                        <TextField
                          autoComplete="off"
                          {...params}
                          label="Select Company"
                          onFocus={() => setIsAutocompleteFocused(true)}
                          onBlur={() => setIsAutocompleteFocused(false)}
                        />
                      )}
                      ref={autocompleteRef}
                    />
                    {/* <TextField
                 autoComplete="off" id="outlined-basic" label="Type Company" variant="outlined" size="small" value={manufacturer} onChange={(e) => { setManufacturer(e.target.value) }} /> */}
                  </ListItem>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography style={{ color: "var(--COLOR_UI_PHARMACY)" }}>
                    Drug Group
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ListItem disablePadding>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={drugGroupList}
                      size="small"
                      value={drugGroup}
                      sx={{ width: 350 }}
                      onChange={(e, value) => {
                        setDrugGroup(value);
                        if (e.type === "keydown" && e.key === "Enter") {
                          handleSearch();
                        }
                      }}
                      getOptionLabel={(option) => option.name}
                      renderInput={(params) => (
                        <TextField
                          autoComplete="off"
                          {...params}
                          label="Select DrugGroup"
                          onFocus={() => setIsAutocompleteFocused(true)}
                          onBlur={() => setIsAutocompleteFocused(false)}
                        />
                      )}
                      ref={autocompleteRef}
                    />
                    {/* <TextField
                 autoComplete="off" id="outlined-basic" label="Type DrugGroup" variant="outlined" size="small" value={drugGroup} onChange={(e) => { setDrugGroup(e.target.value) }} /> */}
                  </ListItem>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography style={{ color: "var(--COLOR_UI_PHARMACY)" }}>
                    GST
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ListItem disablePadding>
                    <FormGroup>
                      {gstList.map((gst) => (
                        <FormControlLabel
                          key={gst.id}
                          control={
                            <Checkbox
                              sx={{
                                color: "#628a2f", // Color for unchecked checkboxes
                                "&.Mui-checked": {
                                  color: "var(--COLOR_UI_PHARMACY)", // Color for checked checkboxes
                                },
                              }}
                              checked={selectedGstIds.includes(gst.id)}
                              onChange={(event) =>
                                handleCheckboxChangeGst(event, gst.id)
                              }
                              name={gst.name}
                            />
                          }
                          label={gst.name}
                        />
                      ))}
                    </FormGroup>
                  </ListItem>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography style={{ color: "var(--COLOR_UI_PHARMACY)" }}>
                    Location
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ListItem disablePadding>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={locationList}
                      size="small"
                      value={location}
                      sx={{ width: 350 }}
                      onChange={(e, value) => {
                        setLocation(value);
                        if (e.type === "keydown" && e.key === "Enter") {
                          handleSearch();
                        }
                      }}
                      getOptionLabel={(option) => option}
                      renderInput={(params) => (
                        <TextField
                          autoComplete="off"
                          {...params}
                          label="Select Location"
                          onFocus={() => setIsAutocompleteFocused(true)}
                          onBlur={() => setIsAutocompleteFocused(false)}
                        />
                      )}
                      ref={autocompleteRef}
                    />

                    {/* <TextField
                 autoComplete="off" id="outlined-basic" label="Type Location" variant="outlined" size="small" value={location} onChange={((e) => { setLocation(e.target.value) })} /> */}
                  </ListItem>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography style={{ color: "var(--COLOR_UI_PHARMACY)" }}>
                    HSN Code
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ListItem disablePadding>
                    <TextField
                      autoComplete="off"
                      id="outlined-basic"
                      label="Type HSN Code"
                      variant="outlined"
                      size="small"
                      value={hsnCode}
                      onChange={(e) => {
                        setHsnCode(e.target.value);
                      }}
                    />
                  </ListItem>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography style={{ color: "var(--COLOR_UI_PHARMACY)" }}>
                    Margin%
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ListItem disablePadding>
                    <TextField
                      autoComplete="off"
                      id="outlined-basic"
                      variant="outlined"
                      size="small"
                      placeholder="10"
                      value={marginStart}
                      onChange={(e) => {
                        setMarginStart(e.target.value);
                      }}
                      sx={{ mx: 1 }}
                    />
                    to
                    <TextField
                      autoComplete="off"
                      id="outlined-basic"
                      variant="outlined"
                      size="small"
                      placeholder="25"
                      value={marginEnd}
                      onChange={(e) => {
                        setMarginEnd(e.target.value);
                      }}
                      sx={{ mx: 1 }}
                    />
                  </ListItem>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography style={{ color: "var(--COLOR_UI_PHARMACY)" }}>
                    MRP
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ListItem disablePadding>
                    <TextField
                      autoComplete="off"
                      id="outlined-basic"
                      variant="outlined"
                      size="small"
                      value={mrpStart}
                      onChange={(e) => {
                        setMRPStart(e.target.value);
                      }}
                      placeholder="1"
                      sx={{ mx: 1 }}
                    />
                    to
                    <TextField
                      autoComplete="off"
                      id="outlined-basic"
                      variant="outlined"
                      size="small"
                      value={mrpEnd}
                      onChange={(e) => {
                        setMRPEnd(e.target.value);
                      }}
                      placeholder="100"
                      sx={{ mx: 1 }}
                    />
                  </ListItem>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography style={{ color: "var(--COLOR_UI_PHARMACY)" }}>
                    PTR
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ListItem disablePadding>
                    <TextField
                      autoComplete="off"
                      id="outlined-basic"
                      variant="outlined"
                      size="small"
                      value={ptrStart}
                      onChange={(e) => {
                        setPTRStart(e.target.value);
                      }}
                      placeholder="1"
                      sx={{ mx: 1 }}
                    />
                    to
                    <TextField
                      autoComplete="off"
                      id="outlined-basic"
                      variant="outlined"
                      size="small"
                      value={ptrEnd}
                      onChange={(e) => {
                        setPTREnd(e.target.value);
                      }}
                      placeholder="100"
                      sx={{ mx: 1 }}
                    />
                  </ListItem>
                </AccordionDetails>
              </Accordion>
              <Divider className="divider_btm" />
            </Box>
            <Box
              className="flex justify-around mt-8"
              style={{
                gap: "2%",
                paddingLeft: "15px",
                paddingRight: "15px",
                paddingBottom: "20px",
              }}
            >
              <Button
                variant="contained"
                style={{
                  background: "#f31c1c",
                  outline: "none",
                  boxShadow: "none",
                  width: "50%",
                }}
                onFocus={(e) => (e.target.style.boxShadow = "none")}
                onClick={() => {
                  handleReset();
                  setDrawerOpen(false);
                }}
              >
                Reset
              </Button>
              <Button
                variant="contained"
                style={{
                  background: "var(--COLOR_UI_PHARMACY)",
                  width: "50%",
                  color: "white",
                  size: "large",
                }}
                onClick={() => {
                  handleSearch();
                  setDrawerOpen(false);
                }}
              >
                Apply Filter
              </Button>
            </Box>
          </Box>
        </Drawer>
      </div>
      {/*<======================================================================== main table ========================================================================>*/}

      <Box
        className="flex flex-wrap md:flex-nowrap "
      // style={{ overflow: "hidden" }}
      >


        <Box className="p-6 tbl_content_inv" sx={{ width: "100%" }}>
          <div className="row gap-3 mb-3 flex-wrap">
            <Button
              variant="contained"
              style={{
                background: "rgb(14 86 143)",
                color: "white",
              }}
              onClick={() => {
                handleSearch("items_with_missing_hsn");
              }}
            >
              Missing HSN : {missingData.items_with_missing_hsn}
            </Button>
            <Button
              variant="contained"
              style={{
                background: "rgb(14 86 143)",
                color: "white",
              }}
              onClick={() => {
                handleSearch("items_with_invalid_mrp");
              }}
            >
              Missing MRP : {missingData.items_with_invalid_mrp}
            </Button>
            <Button
              variant="contained"
              style={{
                background: "rgb(14 86 143)",
                color: "white",
              }}
              onClick={() => {
                handleSearch("items_with_missing_location");
              }}
            >
              Missing Location : {missingData.items_with_missing_location}
            </Button>
            <Button
              variant="contained"
              style={{
                background: "rgb(14 86 143)",
                color: "white",
              }}
              onClick={() => {
                handleSearch("items_with_missing_category");
              }}
            >
              Missing Category :{missingData.items_with_missing_category}
            </Button>
            {/* <Button
              variant="contained"
              style={{
                background: "rgb(14 86 143)",
                color: "white",
                size: "large",
              }}
              onClick={() => {
                handleSearch("items_with_invalid_price");
              }}
            >
              Invalid Price : {missingData.items_with_invalid_price}
            </Button> */}
          </div>

          <div className="flex flex-wrap  justify-between relative inventory_search_main">
            <TextField
              autoComplete="off"
              className="inventory_search"
              id="outlined-basic"
              value={searchItem.toUpperCase()}
              size="small"
              autoFocus
              sx={{ width: "50%", marginTop: "5px" , }}
              onChange={(e) => setSearchItem(e.target.value)}
              onKeyDown={handleKeyPress}
              variant="outlined"
              placeholder="Please search any items.."
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
                type: "search",
              }}
            />


            <div className="flex gap-2 inventory_search_btn">
              {/* <Button
                variant="contained"
                className="mt-4 absolute"
                style={{
                  backgroundColor: "var(--color1)",
                  color: "white",
                  textTransform: "none",
                  size: "small",
                }}
                onClick={handleSearch}
              >
                Search
              </Button> */}
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
                onClick={handleFilterData}
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

              <Button
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleClick}
                style={{ background: "var(--color1)", textTransform: "none" }}
                variant="contained"
              >
                More <KeyboardArrowDownIcon />
              </Button>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleBulkEdit}>Bulk Edit</MenuItem>
                <MenuItem onClick={handleBulkOrder}>Bulk Order</MenuItem>
                <MenuItem onClick={handleBulkQR}>Bulk QR</MenuItem>

                {/* <MenuItem onClick={handleBulkOrder}>Bulk Print QR</MenuItem> */}
              </Menu>
            </div>
          </div>
          {data.length > 0 ? (
            <TableContainer
              component={Paper}
              style={{
                width: "100%",
                paddingInline: "25px",
                paddingBlock: "0px",
                marginInline: "10px",
              }}
            >
              <div className="table-responsive">
                <table
                  className="custom-table custom-table-invantory cusror-pointer"
                  style={{
                    whiteSpace: "nowrap",
                    borderCollapse: "separate",
                    borderSpacing: "0 6px",
                  }}
                >
                  <thead>
                    <tr>
                      <th>
                        {/* <input
                          type="checkbox"
                          onChange={() => {
                            if (selectedItems.length === data.length) {
                              setSelectedItems([]);
                            
                            } else {
                              setSelectedItems(data.map((item) => item.id));
                           
                            }
                          }}
                          checked={selectedItems.length === data.length}
                        /> */}

                        <Checkbox
                          sx={{
                            color: "#628a2f", // Color for unchecked checkboxes
                            "&.Mui-checked": {
                              color: "var(--COLOR_UI_PHARMACY)", // Color for checked checkboxes
                            },
                          }}
                          checked={selectedItems.length === data.length}
                          onChange={() => {
                            if (selectedItems.length === data.length) {
                              setSelectedItems([]);

                            } else {
                              setSelectedItems(data.map((item) => item.id));

                            }
                          }}
                        />
                      </th>
                      <th
                        className="cursor-pointer"
                        onClick={() => sortByColumn("iteam_name")}
                      >
                        Item Name
                        <SwapVertIcon />
                      </th>
                      <th
                        className="cursor-pointer"
                        onClick={() => sortByColumn("mrp")}
                      >
                        MRP
                        <SwapVertIcon />
                      </th>
                      <th
                        className="cursor-pointer"
                        onClick={() => sortByColumn("drug_group_name")}
                      >
                        Drug Group
                        <SwapVertIcon />
                      </th>
                      <th
                        className="cursor-pointer"
                        onClick={() => sortByColumn("stock")}
                      >
                        Stock
                        <SwapVertIcon />
                      </th>
                      <th
                        className="cursor-pointer"
                        onClick={() => sortByColumn("location")}
                      >
                        Loc
                        <SwapVertIcon />
                      </th>
                      <th
                        className="cursor-pointer"
                        onClick={() => sortByColumn("discount")}
                      >
                        Disc
                        <SwapVertIcon />
                      </th>
                      <th
                        className="cursor-pointer"
                        onClick={() => sortByColumn("barcode")}
                      >
                        Barcode No
                        <SwapVertIcon />
                      </th>

                      {/* <th onClick={() => sortByColumn("totalptr")}>Total PTR <SwapVertIcon /></th> */}
                    </tr>
                  </thead>
                  <tbody style={{ backgroundColor: "#3f621217" }}>
                    {data.map((item, index) => (
                      <tr
                        key={index}
                      // style={{
                      //   backgroundColor:
                      //     selectedIndex === index ? "#ceecfd" : "transparent",
                      //   color: selectedIndex === index ? "black" : "inherit",
                      // }}
                      >
                        <td style={{ borderRadius: "10px 0 0 10px" }}>
                          {/* <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={() => handleCheckbox(item.id)}
                          /> */}
                          <Checkbox
                            sx={{
                              color: "#628a2f", // Color for unchecked checkboxes
                              "&.Mui-checked": {
                                color: "var(--COLOR_UI_PHARMACY)", // Color for checked checkboxes
                              },
                            }}
                            checked={selectedItems.includes(item.id)}
                            onChange={() => handleCheckbox(item.id)}
                          />
                        </td>
                        <td
                          onClick={() => {
                            history.push(`/inventoryView/${item.id}`);
                          }}
                        >
                          <div className="itemContainer flex items-center">
                            <div
                              className="image-container flex mr-5"
                              style={{ minWidth: "45px" }}
                            >
                              <img
                                src={
                                  item.front_photo
                                    ? item.front_photo
                                    : "./Pharma Medicine-02.png"
                                }
                                alt={item.front_photo ? "Pharma" : "Tablet"}
                                className="w-10 h-10 ml-2 object-cover cursor-pointer"
                                style={{ width: "40px", height: "40px" }}
                              />
                            </div>
                            <div
                              className="itemName flex-1"
                              style={{ fontSize: "15px", paddingTop: "3px", }}
                            >
                              {item?.iteam_name?.toUpperCase()}
                              <div
                                className="text-gray-400 font-normal"
                                style={{ paddingBottom: "3px" }}
                              >
                                <span style={{ fontSize: "14px" }}>
                                  Pack | 1*{item.old_unit || 1}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td
                          onClick={() => {
                            history.push(`/inventoryView/${item.id}`);
                          }}
                        >
                          {item.mrp}
                        </td>
                        <td
                          onClick={() => {
                            history.push(`/inventoryView/${item.id}`);
                          }}
                        >
                          {
                            item.drug_group_name.length > 12
                              ? item.drug_group_name.slice(0, 12).toUpperCase() + "..."
                              : item.drug_group_name.toUpperCase()
                          }

                        </td>
                        <Tooltip title="Stock Adjusted" placement="left" arrow>
                          <td
                          // onClick={() => {
                          //   history.push(`/inventoryView/${item.id}`);
                          // }}
                          >
                            <span>
                              <img
                                src="./approve.png"
                                className="report-icon inline mr-2"
                                alt="csv "
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handelAddOpen(item);
                                }}
                              />

                              {item.stock == "null" ? "-" : item.stock}
                            </span>
                          </td>
                        </Tooltip>
                        {/* <td
                        onClick={() => {
                          history.push(`/inventoryView/${item.id}`);
                        }}
                      >
                        {item.stock == "null" ? "-" : item.stock}
                      </td> */}
                        <td
                          td
                          onClick={() => {
                            history.push(`/inventoryView/${item.id}`);
                          }}
                        >
                          {item.loaction == "null" ? "-" : item.location}
                        </td>
                        <td
                          onClick={() => {
                            history.push(`/inventoryView/${item.id}`);
                          }}
                        >
                          {item.discount == "null" ? "-" : item.discount}
                        </td>
                        <td
                          style={{ borderRadius: "0 10px 10px 0" }}
                          onClick={() => {
                            history.push(`/inventoryView/${item.id}`);
                          }}
                        >
                          {item.barcode == "null" ? "-" : item.barcode}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <TablePagination
                rowsPerPageOptions={[5, 10, 15]}
                component="div"
                count={data?.[0].count}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          ) : (
            <div>
              <div className="vector-image">
                <div className="inventory-gif">
                  <img src="../inventory_screen.png" alt="screen"></img>
                </div>
                <span className="text-gray-500 font-medium mt-5">
                  Apply filters and explore your inventory
                </span>
              </div>
            </div>
          )}
        </Box>

        <Box className="side_contn">
          <div className="sticky top-0">
            <Box
              className="custom-scroll invntry-filter"
              role="presentation"
              onClick={() => toggleDrawer(false)}
            >
              <Box>
                <h1
                  className="text-2xl flex items-center justify-start px-2 pb-2"
                  style={{ color: "var(--color1)" }}
                >
                  Inventory
                  <BsLightbulbFill className="ml-4 secondary hover-yellow" />
                </h1>
              </Box>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography style={{ color: "var(--color1)" }} sx={{ my: 0 }}>
                    Items
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ListItem disablePadding>
                    <FormControl>
                      <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="items"
                        name="radio-buttons-group"
                        value={selectedOption}
                        sx={{
                          color: "var(--color1)", // Apply color to labels
                          "& .MuiRadio-root": {
                            color: "var(--color2)", // Unchecked radio button color
                          },
                          "& .Mui-checked": {
                            color: "var(--color1)", // Checked radio button color
                          },
                        }}
                        onChange={(e) => setSelectedOption(e.target.value)}
                      >
                        <FormControlLabel
                          value="all_Items"
                          control={<Radio />}
                          label="All Items"
                        />
                        <FormControlLabel
                          value="only_Newly_Added_Items"
                          control={<Radio />}
                          label="Only Newly Added Items"
                        />
                        <FormControlLabel
                          value="discontinued_items"
                          control={<Radio />}
                          label="Discontinued Items"
                        />
                        <FormControlLabel
                          value="only_Not_Set_HSN_Code"
                          control={<Radio />}
                          label="Only Not Set HSN Code"
                        />
                        <FormControlLabel
                          value="only_Not_Set_Categories"
                          control={<Radio />}
                          label="Only Not Set Categories"
                        />
                      </RadioGroup>
                    </FormControl>
                  </ListItem>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography style={{ color: "var(--color1)" }}>
                    Category
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ListItem disablePadding>
                    <FormGroup>
                      {categoryList.map((category) => (
                        <FormControlLabel
                          key={category.id}
                          control={
                            <Checkbox
                              sx={{
                                color: "var(--color2)", // Color for unchecked checkboxes
                                "&.Mui-checked": {
                                  color: "var(--color1)", // Color for checked checkboxes
                                },
                              }}
                              checked={selectedCategoryIds.includes(
                                category.id
                              )}
                              onChange={(event) =>
                                handleCheckboxChange(event, category.id)
                              }
                              name={category.name}
                            />
                          }
                          label={category.category_name}
                        />
                      ))}
                    </FormGroup>
                  </ListItem>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography style={{ color: "var(--color1)" }}>
                    Packging Type
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ListItem disablePadding>
                    <FormGroup>
                      {packgingTypeList.map((packging) => (
                        <FormControlLabel
                          key={packging.id}
                          control={
                            <Checkbox
                              sx={{
                                color: "var(--color2)", // Color for unchecked checkboxes
                                "&.Mui-checked": {
                                  color: "var(--color1)", // Color for checked checkboxes
                                },
                              }}
                              checked={selectedPackgingIds.includes(
                                packging.id
                              )}
                              onChange={(event) =>
                                handleCheckboxPackging(event, packging.id)
                              }
                              name={packging.name}
                            />
                          }
                          label={packging.packging_name}
                        />
                      ))}
                    </FormGroup>
                  </ListItem>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography style={{ color: "var(--color1)" }}>
                    Expiry
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ListItem disablePadding>
                    <AccordionDetails>
                      <ListItem disablePadding>
                        <FormGroup
                          value={selectedOptionExpiry}
                          onChange={handleExpiryChange}
                        // onChange={(e) => setSelectedOptionEpiry(e.target.value)}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                sx={{
                                  color: "var(--color2)", // Color for unchecked checkboxes
                                  "&.Mui-checked": {
                                    color: "var(--color1)", // Color for checked checkboxes
                                  },
                                }}
                                checked={selectedOptionExpiry.includes(
                                  "expired"
                                )}
                                value="expired"
                              />
                            }
                            label="Expired"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                sx={{
                                  color: "var(--color2)", // Color for unchecked checkboxes
                                  "&.Mui-checked": {
                                    color: "var(--color1)", // Color for checked checkboxes
                                  },
                                }}
                                checked={selectedOptionExpiry.includes(
                                  "next_month"
                                )}
                                value="next_month"
                              />
                            }
                            label="Next Month"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                sx={{
                                  color: "var(--color2)", // Color for unchecked checkboxes
                                  "&.Mui-checked": {
                                    color: "var(--color1)", // Color for checked checkboxes
                                  },
                                }}
                                checked={selectedOptionExpiry.includes(
                                  "next_two_month"
                                )}
                                value="next_two_month"
                              />
                            }
                            label="Next 2 Month"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                sx={{
                                  color: "var(--color2)", // Color for unchecked checkboxes
                                  "&.Mui-checked": {
                                    color: "var(--color1)", // Color for checked checkboxes
                                  },
                                }}
                                checked={selectedOptionExpiry.includes(
                                  "next_three_month"
                                )}
                                value="next_three_month"
                              />
                            }
                            label="Next 3 Month"
                          />
                        </FormGroup>
                      </ListItem>
                    </AccordionDetails>
                  </ListItem>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography style={{ color: "var(--color1)" }}>
                    Stock
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ListItem disablePadding>
                    <FormControl>
                      <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="items"
                        name="radio-buttons-group"
                        sx={{
                          color: "var(--color1)", // Apply color to labels
                          "& .MuiRadio-root": {
                            color: "var(--color2)", // Unchecked radio button color
                          },
                          "& .Mui-checked": {
                            color: "var(--color1)", // Checked radio button color
                          },
                        }}
                        value={selectedOptionStock}
                        onChange={(e) => setSelectedOptionStock(e.target.value)}
                      >
                        <FormControlLabel
                          value="0_15"
                          control={<Radio />}
                          label="0 to 15"
                        />
                        <FormControlLabel
                          value="15_30"
                          control={<Radio />}
                          label="15 to 30"
                        />
                        <FormControlLabel
                          value="above_30"
                          control={<Radio />}
                          label="Above 30"
                        />
                        <FormControlLabel
                          value="minus_one"
                          control={<Radio />}
                          label="Minus Stock"
                        />
                      </RadioGroup>
                    </FormControl>
                  </ListItem>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography style={{ color: "var(--color1)" }}>
                    Company
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ListItem disablePadding>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={companyList}
                      size="small"
                      value={manufacturer}
                      onChange={(e, value) => {
                        setManufacturer(value);
                        if (e.type === "keydown" && e.key === "Enter") {
                          handleSearch();
                        }
                      }}
                      sx={{ width: 350 }}
                      getOptionLabel={(option) => option.company_name}
                      renderInput={(params) => (
                        <TextField
                          autoComplete="off"
                          {...params}
                          label="Select Company"
                          onFocus={() => setIsAutocompleteFocused(true)}
                          onBlur={() => setIsAutocompleteFocused(false)}
                        />
                      )}
                      ref={autocompleteRef}
                    />
                    {/* <TextField
                 autoComplete="off" id="outlined-basic" label="Type Company" variant="outlined" size="small" value={manufacturer} onChange={(e) => { setManufacturer(e.target.value) }} /> */}
                  </ListItem>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography style={{ color: "var(--color1)" }}>
                    Drug Group
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ListItem disablePadding>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={drugGroupList}
                      size="small"
                      value={drugGroup}
                      sx={{ width: 350 }}
                      onChange={(e, value) => {
                        setDrugGroup(value);
                        if (e.type === "keydown" && e.key === "Enter") {
                          handleSearch();
                        }
                      }}
                      getOptionLabel={(option) => option.name}
                      renderInput={(params) => (
                        <TextField
                          autoComplete="off"
                          {...params}
                          label="Select DrugGroup"
                          onFocus={() => setIsAutocompleteFocused(true)}
                          onBlur={() => setIsAutocompleteFocused(false)}
                        />
                      )}
                      ref={autocompleteRef}
                    />
                    {/* <TextField
                 autoComplete="off" id="outlined-basic" label="Type DrugGroup" variant="outlined" size="small" value={drugGroup} onChange={(e) => { setDrugGroup(e.target.value) }} /> */}
                  </ListItem>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography style={{ color: "var(--color1)" }}>
                    GST
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ListItem disablePadding>
                    <FormGroup>
                      {gstList.map((gst) => (
                        <FormControlLabel
                          key={gst.id}
                          control={
                            <Checkbox
                              sx={{
                                color: "var(--color2)", // Color for unchecked checkboxes
                                "&.Mui-checked": {
                                  color: "var(--color1)", // Color for checked checkboxes
                                },
                              }}
                              checked={selectedGstIds.includes(gst.id)}
                              onChange={(event) =>
                                handleCheckboxChangeGst(event, gst.id)
                              }
                              name={gst.name}
                            />
                          }
                          label={gst.name}
                        />
                      ))}
                    </FormGroup>
                  </ListItem>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography style={{ color: "var(--color1)" }}>
                    Location
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ListItem disablePadding>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={locationList}
                      size="small"
                      value={location}
                      sx={{ width: 350 }}
                      onChange={(e, value) => {
                        setLocation(value);
                        if (e.type === "keydown" && e.key === "Enter") {
                          handleSearch();
                        }
                      }}
                      getOptionLabel={(option) => option}
                      renderInput={(params) => (
                        <TextField
                          autoComplete="off"
                          {...params}
                          label="Select Location"
                          onFocus={() => setIsAutocompleteFocused(true)}
                          onBlur={() => setIsAutocompleteFocused(false)}
                        />
                      )}
                      ref={autocompleteRef}
                    />

                    {/* <TextField
                 autoComplete="off" id="outlined-basic" label="Type Location" variant="outlined" size="small" value={location} onChange={((e) => { setLocation(e.target.value) })} /> */}
                  </ListItem>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography style={{ color: "var(--color1)" }}>
                    HSN Code
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ListItem disablePadding>
                    <TextField
                      autoComplete="off"
                      id="outlined-basic"
                      label="Type HSN Code"
                      variant="outlined"
                      size="small"
                      value={hsnCode}
                      onChange={(e) => {
                        setHsnCode(e.target.value);
                      }}
                    />
                  </ListItem>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography style={{ color: "var(--color1)" }}>
                    Margin%
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ListItem disablePadding>
                    <TextField
                      autoComplete="off"
                      id="outlined-basic"
                      variant="outlined"
                      size="small"
                      placeholder="10"
                      value={marginStart}
                      onChange={(e) => {
                        setMarginStart(e.target.value);
                      }}
                      sx={{ mx: 1 }}
                    />
                    to
                    <TextField
                      autoComplete="off"
                      id="outlined-basic"
                      variant="outlined"
                      size="small"
                      placeholder="25"
                      value={marginEnd}
                      onChange={(e) => {
                        setMarginEnd(e.target.value);
                      }}
                      sx={{ mx: 1 }}
                    />
                  </ListItem>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography style={{ color: "var(--color1)" }}>
                    MRP
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ListItem disablePadding>
                    <TextField
                      autoComplete="off"
                      id="outlined-basic"
                      variant="outlined"
                      size="small"
                      value={mrpStart}
                      onChange={(e) => {
                        setMRPStart(e.target.value);
                      }}
                      placeholder="1"
                      sx={{ mx: 1 }}
                    />
                    to
                    <TextField
                      autoComplete="off"
                      id="outlined-basic"
                      variant="outlined"
                      size="small"
                      value={mrpEnd}
                      onChange={(e) => {
                        setMRPEnd(e.target.value);
                      }}
                      placeholder="100"
                      sx={{ mx: 1 }}
                    />
                  </ListItem>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography style={{ color: "var(--color1)" }}>
                    PTR
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ListItem disablePadding>
                    <TextField
                      autoComplete="off"
                      id="outlined-basic"
                      variant="outlined"
                      size="small"
                      value={ptrStart}
                      onChange={(e) => {
                        setPTRStart(e.target.value);
                      }}
                      placeholder="1"
                      sx={{ mx: 1 }}
                    />
                    to
                    <TextField
                      autoComplete="off"
                      id="outlined-basic"
                      variant="outlined"
                      size="small"
                      value={ptrEnd}
                      onChange={(e) => {
                        setPTREnd(e.target.value);
                      }}
                      placeholder="100"
                      sx={{ mx: 1 }}
                    />
                  </ListItem>
                </AccordionDetails>
              </Accordion>
              <Divider className="divider_btm" />
            </Box>
            <Box className="flex gap-2 mt-6 px-6">
              <Button className="w-full"
                variant="contained"
                style={{
                  background: "var(--color6)",
                  outline: "none",
                  boxShadow: "none",
                }}
                onFocus={(e) => (e.target.style.boxShadow = "none")}
                onClick={handleReset}
              >
                Reset
              </Button>
              <Button className="w-full"
                variant="contained"
                style={{
                  background: "var(--color1)",
                  color: "white",
                }}
                onClick={handleSearch}
              >
                Apply Filter
              </Button>
            </Box>
          </div>
        </Box>
      </Box>
      {/*<======================================================================== stock adjustment dialog ========================================================================>*/}

      <Dialog className="custom-dialog modal_991" open={openAddPopUp}>
        <DialogTitle id="alert-dialog-title" className="primary">
          Stock Adjustment
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
            {/* First row: Item & Company */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">
              <div className="w-full">
                <span className="title primary mb-2">Item Name</span>
                <Autocomplete
                  disablePortal
                  options={purchaseItemData}
                  size="small"
                  disabled
                  value={selectedItem}
                  onChange={handleOptionChange}
                  getOptionLabel={(option) => option.iteam_name}
                  renderInput={(params) => <TextField autoComplete="off" {...params} />}
                />
              </div>

              <div className="w-full">
                <span className="title primary mb-2">Company</span>
                <Autocomplete
                  disablePortal
                  options={companyList}
                  size="small"
                  value={selectedCompany}
                  disabled
                  getOptionLabel={(option) => option.company_name}
                  renderInput={(params) => <TextField autoComplete="off" {...params} />}
                />
              </div>
            </div>

            {/* Other fields in grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
              <div className="w-full">
                <span className="title primary mb-2">Adjustment Date</span>
                <DatePicker
                  className="custom-datepicker w-full"
                  selected={adjustmentDate}
                  onChange={(newDate) => setAdjustDate(newDate)}
                  dateFormat="dd/MM/yyyy"
                  minDate={subDays(new Date(), 15)}
                />
              </div>

              <div className="w-full">
                <span className="title primary mb-2">Batch</span>
                <Autocomplete
                  disablePortal
                  options={batchListData}
                  size="small"
                  value={batch}
                  onChange={handleBatchData}
                  getOptionLabel={(option) => option.batch_number}
                  renderInput={(params) => <TextField autoComplete="off" {...params} />}
                />
              </div>

              <div className="w-full">
                <span className="title primary mb-2">Unit</span>
                <TextField autoComplete="off" disabled size="small" value={unit} />
              </div>

              <div className="w-full">
                <span className="title primary mb-2">Expiry</span>
                <TextField autoComplete="off" disabled size="small" value={expiry} />
              </div>

              <div className="w-full">
                <span className="title primary mb-2">MRP</span>
                <TextField autoComplete="off" disabled size="small" type="number" value={mrp} />
              </div>

              <div className="w-full">
                <span className="title primary mb-2">Current Stock</span>
                <TextField autoComplete="off" disabled size="small" type="number" value={stock} />
              </div>

              <div className="w-full">
                <span className="title primary mb-2">Maintain Stock</span>
                <TextField
                  autoComplete="off"
                  size="small"
                  type="number"
                  value={stockAdjust}
                  onChange={(e) => {
                    const val = e.target.value;
                    setStockAdjust(val === "" ? "" : parseFloat(val));
                  }}
                />

              </div>

              <div className="w-full">
                <span className="title primary mb-2">Stock Adjust</span>
                <TextField autoComplete="off" disabled size="small" type="number" value={remainingStock} />
              </div>
            </div>
          </DialogContentText>
        </DialogContent>

        <DialogActions style={{ padding: "20px 24px" }}>
          <Button
            style={{
              background: "var(--COLOR_UI_PHARMACY)",
              color: "white",
            }}
            autoFocus
            variant="contained"
            onClick={validateForm}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>


      {/*<=========================================================================== Bulk QR dialog ===========================================================================>*/}

      <Dialog open={openQR} className="custom-dialog max-991">
        <DialogTitle id="alert-dialog-title" className="secondary">
          Batch List
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => setOpenQR(false)}
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
                    <th>Sr NO.</th>
                    <th>Item ID</th>
                    <th>Item Name</th>
                    <th>Batch ID</th>
                    <th>Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {QRBatch && QRBatch.length === 0 ? (
                    <tr>
                      <td colSpan={3}>No data found</td>
                    </tr>
                  ) : (
                    QRBatch.map((row, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{row.item_id}</td>
                        <td>{row.item_name}</td>
                        <td>{row.batch_id}</td>
                        <td>
                          <OutlinedInput
                            type="number"
                            value={row.qty}
                            onChange={e => {
                              // Update only qty in batchListData, keep logic as your current implementation
                              const newData = [...QRBatch];
                              newData[index].qty = e.target.value;
                              setQRBatch(newData);
                            }}
                            sx={{ width: 80, m: 1 }}
                            size="small"
                          />
                        </td>
                      </tr>
                    ))
                  )}
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
            onClick={callBulkQRCode}
          >
            Print QR
          </Button>
        </DialogActions>
      </Dialog>


      {/*<=========================================================================== Bulk edit dialog ===========================================================================>*/}

      <Dialog className="custom-dialog" open={openEdit}>
        <DialogTitle id="alert-dialog-title" className="primary">
          Bulk Edit
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={resetbulkDialog}
          sx={{
            position: "absolute",
            right: 12,
            top: 8,
            color: "#ffffff",
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {/* <div className="flex" style={{ flexDirection: 'column', gap: '19px' }}> */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex gap-4 flex-col">
                <span className="title mb-2">Location</span>

                <Autocomplete
                  value={locationBulk ?? ""}

                  inputValue={typeof locationBulk === "string" ? locationBulk : ""}

                  // sx={{ width: 200 }}
                  className="w-full"
                  size="small"
                  onChange={(event, newValue) => setLocationBulk(
                    typeof newValue === "string" ? newValue.toUpperCase() : newValue
                  )}
                  onInputChange={(event, newInputValue) =>
                    setLocationBulk(newInputValue.toUpperCase())
                  }
                  getOptionLabel={(option) =>
                    typeof option === "string" ? option : option
                  }
                  options={locationList}
                  renderOption={(props, option) => (
                    <ListItem {...props}>
                      <ListItemText primary={option} />
                    </ListItem>
                  )}
                  renderInput={(params) => (
                    <TextField
                      autoComplete="off"
                      {...params}
                      label="Select Location"
                    />
                  )}
                  freeSolo
                />
              </div>
              <div className="flex gap-4 flex-col">
                <span className="title mb-2">Barcode</span>
                <TextField
                  autoComplete="off"
                  id="outlined-number"
                  // sx={{ width: "200px" }}
                  className="w-full"
                  size="small"
                  value={barcode}
                  onChange={(e) => {
                    setBarcode(e.target.value.toUpperCase());
                  }}
                />
              </div>
            </div>

            {/* </div> */}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <div className="flex gap-4 mr-4 pb-4">
            <Button
              autoFocus
              variant="contained"
              className="p-5"
              style={{
                backgroundColor: "var(--COLOR_UI_PHARMACY)",
                color: "white",
              }}
              onClick={validateBulkForm}
            >
              Save
            </Button>
            <Button
              autoFocus
              variant="contained"
              onClick={resetbulkDialog}
              color="error"
            >
              Cancel
            </Button>
          </div>
        </DialogActions>
      </Dialog>

      {/*<=========================================================================== Bulk Order dialog===========================================================================>*/}
      <Dialog className="custom-dialog" open={bulkOrder}>
        <DialogTitle>
          <WarningAmberRoundedIcon
            sx={{ color: "#F31C1C", marginBottom: "5px", fontSize: "2.5rem" }}
          />
          Warning
        </DialogTitle>
        <DialogContent>
          <DialogContentText className="pt-5">
            Are you sure you want to Place Order?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <div className="pb-5 flex gap-2">
            <Button
              className="primary-bg"
              style={{ backgroundColor: "var(--COLOR_UI_PHARMACY)" }}
              autoFocus
              variant="contained"
              onClick={validateBulkOrder}
            >
              Yes
            </Button>
            <Button
              style={{ backgroundColor: "#F31C1C", color: "white" }}
              autoFocus
              variant="outlined"
              onClick={() => setBulkOrder(false)}
            >
              No
            </Button>
          </div>
        </DialogActions>
      </Dialog>

      {/* Bulk Print QR */}
      {/* <Dialog open={openEdit} >
                <DialogTitle id="alert-dialog-title" className="secondary">
                    Bulk Edit
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={resetbulkDialog}
                    sx={{ position: 'absolute', right: 12, top: 8, color: "#ffffff" }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <div className="flex gap-4">
                            <div>
                                <span className="title mb-2">Location</span>
                                <TextField
                 autoComplete="off"
                                    // disabled
                                    required
                                    id="outlined-number"
                                    sx={{ width: '200px' }}
                                    size="small"
                                    value={locationBulk}
                                    onChange={(e) => setLocationBulk(e.target.value)}
                                />
                            </div>
                            <div>
                                <span className="title mb-2">Barcode</span>
                                <TextField
                 autoComplete="off"
                                    id="outlined-number"
                                    sx={{ width: '200px' }}
                                    size="small"
                                    value={barcode}
                                    onChange={(e) => { setBarcode(e.target.value) }}
                                />
                            </div>
                        </div>

                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <div className="flex gap-4 mr-4 pb-4">

                        <Button autoFocus variant="contained" className="p-5" color="success" onClick={validateBulkForm}>
                            Save
                        </Button>
                        <Button autoFocus variant="contained" onClick={resetbulkDialog} color="error"  >
                            Cancel
                        </Button>
                    </div>
                </DialogActions>
            </Dialog> */}
    </>
  );
};

export default InventoryList;
