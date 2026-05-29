import Header from "../../Header";
import React, { useEffect, useState } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { BsLightbulbFill } from "react-icons/bs";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import axios from "axios";
import { useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Autocomplete,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TablePagination,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import tablet from "../../../componets/Images/tablet.png";
import SouthIcon from "@mui/icons-material/South";
import Loader from "../../../componets/loader/Loader";
import { MdEdit } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import DatePicker from "react-datepicker";
import { addDays, format, subDays } from "date-fns";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import ListItem from "@mui/material/ListItem";
const InventoryView = () => {
  const { id } = useParams();
  const history = useHistory();
  const [hideZeroQuantity, setHideZeroQuantity] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [openImg, setOpenImg] = useState(false);
  const [batchId, setBatchId] = useState(null);
  const [IsDelete, setIsDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openAddPopUp, setOpenAddPopUp] = useState(false);
  const [header, setHeader] = useState("");
  const [errors, setErrors] = useState({});
  const [company, setCompany] = useState(null);
  const [category, setCategory] = useState(null);
  const [discount, setDiscount] = useState("");
  const [loc, setLoc] = useState("");
  const [companyList, setCompanyList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [packaging, setPackaging] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [packList, setPackList] = useState([]);
  const [drugGroup, setDrugGroup] = useState(null);
  const [drugGroupList, setDrugGroupList] = useState([]);
  const token = localStorage.getItem("token");
  const [distributorValue, setDistributorValue] = useState(null);
  const [customerValue, setCustomerValue] = useState(null);
  const [dateRange, setDateRange] = useState([
    subDays(new Date(), 30),
    new Date(),
  ]);
  const [startDate, endDate] = dateRange;
  const [searchQuery, setSearchQuery] = useState("");

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
    setPage(0);
    if (newValue == 1) {
      // purchaseData();
    } else if (newValue == 2) {
      // purchaseReturnData();
    } else if (newValue == 3) {
      // saleData();
    } else if (newValue == 4) {
      // saleReturnData();
    } else if (newValue == 5) {
      ledgerData();
    }
  };
  const [itemAllData, setItemAllData] = useState([]);
  const [batchListData, setBatchListData] = useState([]);
  const [purchaseListData, setPurchaseListData] = useState([]);
  const [purchaseReturnListData, setPurchaseReturnListData] = useState([]);
  const [saleListData, setsaleListData] = useState([]);
  const [saleReturnListData, setsaleReturnListData] = useState([]);
  const [ledgerListData, setLedgerListData] = useState([]);
  const [purchaseDate, setPurchaseDate] = useState(new Date());
  const [distributorList, setDistributorList] = useState([]);
  const [customerDetails, setCustomerDetails] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [staff, setStaff] = useState("");
  const [gstType, setGstType] = useState("");
  const [distributorId, setDistributorId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [customerNo, setCustomerNo] = useState("");
  const [customerName, setCustomerName] = useState("");

  const batchColumns = [
    { id: "batch_name", label: "Batch", minWidth: 100 },
    { id: "qty", label: "Qty", minWidth: 100 },
    { id: "expiry_date", label: "Exp Date", minWidth: 100 },
    { id: "mrp", label: "MRP", minWidth: 100 },
    { id: "ptr", label: "PTR", minWidth: 100 },
    { id: "discount", label: "Disc.%", minWidth: 100 },
    { id: "location", label: "Loc.", minWidth: 100 },
    { id: "margin", label: "Margin%", minWidth: 100 },
    { id: "total_mrp", label: "Total by MRP", minWidth: 100 },
    { id: "total_ptr", label: "Total by PTR", minWidth: 100 },
  ];

  const purchaseReturnColumns = [
    { id: "bill_no", label: "Bill No", minWidth: 100 },
    { id: "bill_date", label: "Bill Date", minWidth: 100 },
    { id: "entry_by", label: "Entry By", minWidth: 100 },
    { id: "distributor_name", label: "Distributor Name", minWidth: 100 },
    { id: "qty", label: "Quantity", minWidth: 100 },
    { id: "fr_qty", label: "Free Qty", minWidth: 100 },
    { id: "amount", label: "Amount", minWidth: 100 },
  ];

  const saleColumns = [
    { id: "bill_no", label: "Bill No", minWidth: 100 },
    { id: "bill_date", label: "Bill Date", minWidth: 100 },
    { id: "entry_by", label: "Entry By", minWidth: 100 },
    { id: "customer_name", label: "Customer Name", minWidth: 100 },
    { id: "customer_number", label: "Mobile No", minWidth: 100 },
    { id: "qty", label: "Quantity", minWidth: 100 },
    { id: "amt", label: "Amount", minWidth: 100 },
  ];

  const saleReturnColumns = [
    { id: "bill_no", label: "Bill No", minWidth: 100 },
    { id: "bill_date", label: "Bill Date", minWidth: 100 },
    { id: "entry_by", label: "Entry By", minWidth: 100 },
    { id: "customer_name", label: "Customer Name", minWidth: 100 },
    { id: "customer_number", label: "Mobile No", minWidth: 100 },
    { id: "qty", label: "Quantity", minWidth: 100 },
    { id: "amt", label: "Amount", minWidth: 100 },
  ];

  const ledger = [
    { id: "bill_no", label: "Bill No", minWidth: 100 },
    { id: "transction", label: "Transaction", minWidth: 100 },
    { id: "bill_date", label: "Bill Date", minWidth: 100 },
    { id: "batch", label: "Batch", minWidth: 100 },
    { id: "credit", label: "In", minWidth: 100 },
    { id: "debit", label: "Out", minWidth: 100 },
    { id: "balance", label: "Close", minWidth: 100 },
    { id: "name", label: "Distributor / Customer", minWidth: 100 },
  ];

  const purchaseColumns = [
    { id: "bill_no", label: "Bill No", minWidth: 100 },
    { id: "bill_date", label: "Bill Date", minWidth: 100 },
    { id: "entry_by", label: "Entry By", minWidth: 100 },
    { id: "distributor_name", label: "Distributor Name", minWidth: 100 },
    { id: "qty", label: "Quantity", minWidth: 100 },
    { id: "fr_qty", label: "Free Qty", minWidth: 100 },
    { id: "amount", label: "Amount", minWidth: 100 },
  ];

  const filteredData = hideZeroQuantity
    ? batchListData.filter((item) => item.qty > 0)
    : batchListData;

  const handleEditOpen = () => {
    setOpenAddPopUp(true);
    const category = categoryList.find((x) => x.id == itemAllData?.category_id);
    setCategory(category);
    const company = companyList.find((x) => x.id == itemAllData?.company_id);
    setCompany(company);
    const drugGroup = drugGroupList.find(
      (x) => x.id == itemAllData.druggroup_id
    );
    setDrugGroup(drugGroup);
    setPackaging(itemAllData?.packaging_id);
  };

  const resetAddDialog = () => {
    setOpenAddPopUp(false);
    const category = categoryList.find((x) => x.id == itemAllData?.category_id);
    const company = companyList.find((x) => x.id == itemAllData?.company_id);
    const drugGroup = drugGroupList.find(
      (x) => x.id == itemAllData.druggroup_id
    );
    setCategory(category);
    setCompany(company);
    setDrugGroup(drugGroup);
    setPackaging(itemAllData?.packaging_id);
    setLoc(itemAllData?.location);
  };

  useEffect(() => {
    if (tabValue === 1) {
      purchaseData();
    } else if (tabValue === 2) {
      purchaseReturnData();
    } else if (tabValue === 3) {
      saleData();
    } else if (tabValue === 4) {
      saleReturnData();
    }
  }, [
    distributorId,
    staff,
    gstType,
    startDate,
    customerId,
    endDate,
    customerValue,
    tabValue,
  ]);

  useEffect(() => {
    listOfCompany();
    listItemcatagory();
    listOfPack();
    listDrougGroup();
    listDistributor();
    listCustomer();
    listOfstaff();
  }, []);

  useEffect(() => {
    itemGetByID();
    batchData();
    // purchaseData()
    // purchaseReturnData()
    // saleData()
    // saleReturnData()
    // ledgerData()
  }, [page, rowsPerPage, id]);

  let listOfPack = () => {
    axios
      .get("list-package", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setPackList(response.data.data);
        setIsLoading(false);
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


    // Core List API (backend pagination + search)
    const listDrougGroup = (page = 1, isSearch = false) => {
      if (!page) return;
      setIsLoading(!isSearch);
      setIsSearching(isSearch);
  
      const formData = new FormData();
      
      formData.append("page", page);
      formData.append("limit", rowsPerPage);
      if (searchTerms[0] && searchTerms[0].trim()) {
        formData.append("search", searchTerms[0].trim());
      }
  
      axios
        .post("drug-list", formData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setDrugGroupList(response.data.data || []);
          setTotalRecords(Number(response.data.total_records) || 0);
          setIsLoading(false);
          setIsSearching(false);
        })
        .catch(() => {
          setIsLoading(false);
          setIsSearching(false);
          setDrugGroupList([]);
          setTotalRecords(0);
             if (error?.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          localStorage.removeItem("role");
          localStorage.clear();
          history.push("/");
        }
        });
    };

  // const validationUpdateItem = async () => {
  //     const newErrors = {};
  //     if (!packaging) {
  //         newErrors.loc = 'Packaging  is required.';
  //         toast.error(newErrors.loc);
  //     } else if (!category) {
  //         newErrors.category = 'category  is required.';
  //         toast.error(newErrors.category);
  //     } else if (!company) {
  //         newErrors.company = 'company  is required.';
  //         toast.error(newErrors.company);
  //     } else if (!drugGroup) {
  //         newErrors.drugGroup = 'drugGroup  is required.';
  //         toast.error(newErrors.drugGroup);
  //     } else if (!loc) {
  //         newErrors.loc = 'Location is required.';
  //         toast.error(newErrors.loc);
  //     }
  //     setErrors(newErrors);
  //     if (Object.keys(newErrors).length === 0) {
  //         updateItem();
  //     } else {
  //         return Object.keys(newErrors).length === 0;
  //     }
  // }

  const updateItem = async () => {
    let formData = new FormData();
    formData.append("id", itemAllData?.id);
    formData.append("packaging_id", packaging);
    // formData.append("unit", unit);
    // formData.append('weightage', weightage)
    // formData.append("pack", pack);
    formData.append("drug_group", drugGroup?.id);
    // formData.append("gst", gst);
    formData.append("location", loc);
    // formData.append("mrp", MRP);
    // formData.append("barcode", barcode);
    formData.append("item_category_id", category?.id);
    formData.append("pahrma", company?.id);
    // formData.append("minimum", min);
    // formData.append("maximum", max);
    // formData.append("discount", disc);
    // formData.append("margin", margin)
    // formData.append("hsn_code", hsn_code);
    // formData.append("message", message);
    // formData.append("distributer", selectedSuppliers?.id);
    // formData.append("front_photo", selectedFrontFile);
    // formData.append("back_photo", selectedBackFile);
    // formData.append("mrp_photo", selectedMRPFile);
    try {
      const response = await axios.post("update-iteam", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === 200) {
        toast.dismiss();
        toast.success(response.data.message);
        setOpenAddPopUp(false);
        itemGetByID();
      } else if (response.data.status === 400) {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Please try again later");
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

  const handleCheckboxChange = () => {
    setHideZeroQuantity(!hideZeroQuantity);
  };

  const EditDoctorRecord = async () => {
    let data = new FormData();

    // data.append('id', doctorId);
    // data.append('name', doctor);
    // data.append('email', emailId);
    // data.append('mobile', mobileNo);
    // data.append('license', licence);
    // data.append('address', address);
    // data.append('clinic', clinic);
    try {
      await axios
        .post("doctor-update", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setOpenAddPopUp(false);
        });
    } catch (error) {
      setIsLoading(false);
         if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
    }
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

  const listDistributor = async () => {
    try {
      const response = await axios.post(`list-distributer`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const distributors = response.data.data;
      localStorage.setItem("distributor", JSON.stringify(distributors));
      setDistributorList(distributors);

      return distributors;
    } catch (error) {
      console.error("API Error fetching distributors:", error);
         if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
      return [];
    }
  };

  const listCustomer = async () => {
    let data = new FormData();
    // const params = {
    //     search: searchQuery
    // };
    setIsLoading(true);
    try {
      const response = await axios.post("list-customer?", data, {
        // params: params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCustomerDetails(response.data.data);
      setIsLoading(false);
      if (response.data.status === 401) {
        history.push("/");
        localStorage.clear();
      }
    } catch (error) {
      setIsLoading(false);
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

  let listOfstaff = () => {
    axios
      .post("staff-list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setStaffList(response.data.data);
        setIsLoading(false);
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const deleteOpen = (id) => {
    setIsDelete(true);
    setBatchId(id);
  };

  const deleteClose = () => {
    setIsDelete(false);
  };

  const itemGetByID = async () => {
    let data = new FormData();
    data.append("id", id);
    setIsLoading(true);
    const params = {
      id: id,
      page: page + 1,
      limit: rowsPerPage,
    };
    try {
      await axios
        .post("item-view?", data, {
          params: params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setItemAllData(response.data.data);
          setLoc(response?.data?.data?.location);
          setIsLoading(false);
        });
    } catch (error) {
      setIsLoading(false);
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

  const batchData = async () => {
    let data = new FormData();
    data.append("id", id);
    setIsLoading(true);
    const params = {
      id: id,
      // page: page + 1,
      // limit: rowsPerPage
    };
    try {
      await axios
        .post("item-batch-list?", data, {
          params: params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setBatchListData(response.data.data);
          // setLoc(response?.data?.data?.location)
          setIsLoading(false);
        });
    } catch (error) {
      setIsLoading(false);
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
  const handleCustomerBillList = (e, value) => {
    setCustomerValue(value);
    setCustomerId(value ? value.id : "");
    // if (tabValue == 3) {
    // saleData();
    // } else if (tabValue == 4) {
    // setCustomerId(value.id);
    // saleReturnData();
    // }
    // purchaseData()
  };
  // const handleCustomerOption = (event, newValue) => {
  //     setCustomer(newValue);
  // };
  const handleDistributorBillList = (e, value) => {
    setDistributorValue(value);
    setDistributorId(value ? value.id : "");
    if (tabValue == 1) {
      purchaseData();
    } else if (tabValue == 2) {
      purchaseReturnData();
    } else if (tabValue == 3) {
      saleData();
    } else if (tabValue == 4) {
      saleReturnData();
    } else if (tabValue == 5) {
      ledgerData();
    }
    // purchaseData()
  };

  const handleStaff = (e) => {
    setStaff(e.target.value);
    if (tabValue == 1) {
      purchaseData();
    } else if (tabValue == 2) {
      purchaseReturnData();
    } else if (tabValue == 3) {
      saleData();
    } else if (tabValue == 4) {
      saleReturnData();
    } else if (tabValue == 5) {
      ledgerData();
    }
    // purchaseData();
  };

  const handleGstType = (e) => {
    setGstType(e.target.value);
    if (tabValue == 1) {
      purchaseData();
    } else if (tabValue == 2) {
      purchaseReturnData();
    } else if (tabValue == 3) {
      saleData();
    } else if (tabValue == 4) {
      saleReturnData();
    } else if (tabValue == 5) {
      ledgerData();
    }
    // purchaseData()
  };

  const purchaseData = async () => {
    let data = new FormData();
    data.append("id", id);
    data.append("start_date", startDate ? format(startDate, "yyyy-MM-dd") : "");
    data.append("end_date", endDate ? format(endDate, "yyyy-MM-dd") : "");
    data.append("distributor_id", distributorId);
    data.append("staff", staff);
    data.append("gst", gstType);
    setIsLoading(true);
    const params = {
      id: id,
    };
    try {
      await axios
        .post("purches-items?", data, {
          params: params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setPurchaseListData(response.data.data);
          setIsLoading(false);
        });
    } catch (error) {
      setIsLoading(false);
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

  const purchaseReturnData = async () => {
    let data = new FormData();
    data.append("id", id);
    data.append("start_date", startDate ? format(startDate, "yyyy-MM-dd") : "");
    data.append("end_date", endDate ? format(endDate, "yyyy-MM-dd") : "");
    data.append("distributor_id", distributorId);
    data.append("staff", staff);
    data.append("gst", gstType);
    setIsLoading(true);
    const params = {
      id: id,
      // page: page + 1,
      // limit: rowsPerPage
    };
    try {
      await axios
        .post("purche-return-item?", data, {
          params: params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setPurchaseReturnListData(response.data.data);
          setIsLoading(false);
        });
    } catch (error) {
      setIsLoading(false);
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

  const saleData = async () => {
    let data = new FormData();
    data.append("id", id);
    data.append("start_date", startDate ? format(startDate, "yyyy-MM-dd") : "");
    data.append("end_date", endDate ? format(endDate, "yyyy-MM-dd") : "");
    data.append("staff", staff);
    data.append("customer_mobileNo", customerId);
    // data.append("customer_mobileNo", staff);
    setIsLoading(true);
    const params = {
      id: id,
      // page: page + 1,
      // limit: rowsPerPage
    };
    try {
      await axios
        .post("invetory-sales-item?", data, {
          params: params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setsaleListData(response.data.data);
          setIsLoading(false);
        });
    } catch (error) {
      setIsLoading(false);
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

  const saleReturnData = async () => {
    let data = new FormData();
    data.append("id", id);
    data.append("start_date", startDate ? format(startDate, "yyyy-MM-dd") : "");
    data.append("end_date", endDate ? format(endDate, "yyyy-MM-dd") : "");
    data.append("staff", staff);
    data.append("customer_mobileNo", customerId);
    setIsLoading(true);
    const params = {
      id: id,
      // page: page + 1,
      // limit: rowsPerPage
    };
    try {
      await axios
        .post("invetory-sales-return?", data, {
          params: params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setsaleReturnListData(response.data.data);
          setIsLoading(false);
        });
    } catch (error) {
      setIsLoading(false);
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

  const ledgerData = async () => {
    let data = new FormData();
    data.append("id", id);
    setIsLoading(true);
    const params = {
      id: id,
      // page: page + 1,
      // limit: rowsPerPage
    };
    try {
      await axios
        .post("ledger-item?", data, {
          params: params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setLedgerListData(response.data.data);
          setIsLoading(false);
        });
    } catch (error) {
      setIsLoading(false);
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

  const deleteBatch = async (batchId) => {
    if (!batchId) return;
    let data = new FormData();
    data.append("id", batchId);
    const params = {
      id: batchId,
    };
    try {
      await axios
        .post("batch-delete?", data, {
          params: params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          itemGetByID();
          setIsDelete(false);
        });
    } catch (error) {
      setIsLoading(false);
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
  const openImage = () => {
    setOpenImg(true);
  };

  const openBill = (item) => {
    if (item.transction == "Purchase Invoice") {
      history.push(`/purchaseView/${item.bill_id}`);
    } else if (item.transction == "Purchase Return Invoice") {
      history.push(`/PurchaseReturnView${item.bill_id}`);
    } else if (item.transction == "Sales Invoice") {
      history.push(`/saleView/${item.bill_id}`);
    } else if (item.transction == "Sales Return Invoice") {
      history.push(`/SaleReturnView/${item.bill_id}`);
    }
  };

  const viewBill = (item) => {
    if (tabValue === 1) {
      history.push(`/purchaseView/${item.purchase_id}`);
    } else if (tabValue === 4) {
      history.push(`/SaleReturnView/${item.sales_id}`);
    } else if (tabValue === 3) {
      history.push(`/saleView/${item.sales_id}`);
    } else if (tabValue === 2) {
      history.push(`/PurchaseReturnView${item.purchase_return_id}`);
    } else {
      toast.error("Route not Found");
    }
  };

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
        <div className="p-6">
          <div className="avlblstoc-det">
            <div>
              <div className="row gap-2 item_edit_btn_inventory mb-5">
                <div
                  className="gap-2 justify-center"
                  style={{ display: "flex", whiteSpace: "nowrap" }}
                >
                  <span
                    className="text-blue-500 text-2xl secondary cursor-pointer inventory_txt_purchase"
                    onClick={() => history.push("/inventory")}
                  >
                    Inventory
                  </span>
                  <ArrowForwardIosIcon
                    style={{
                      fontSize: "20px",
                      marginTop: "8px",
                      color: "var(--color1)",
                    }}
                  />
                  <span
                    className="primary text-lg flex mt-1 inventory_txt_purchase_api"
                    style={{ width: "auto" }}
                  >
                    {itemAllData?.iteam_name}{" "}
                    <BsLightbulbFill className="ml-2 w-6 h-6 secondary hover-yellow" />{" "}
                  </span>
                </div>
                <div className="headerList">
                  <Button
                    variant="contained"
                    className="item_edit_btn_inventory_main"
                    style={{
                      marginBottom: "0",
                      backgroundColor: "var(--color1)",
                      whiteSpace: "nowrap",
                    }}
                    onClick={() => handleEditOpen()}
                  >
                    <MdEdit className="w-7 h-6  p-1 cursor-pointer" />
                    Item Edit
                  </Button>
                </div>
              </div>
              <div className="flex justify-between flex-wrap">
                <div className="img flex gap-10 inventory_header_txt">
                  <div className="relative w-28 h-28 mb-6 bg-white p-2">
                    <img
                      src={
                        itemAllData?.front_photo
                          ? itemAllData.front_photo
                          : tablet
                      }
                      alt={itemAllData?.front_photo ? "Pharma" : "Tablet"}
                      className="w-full h-full object-cover cursor-pointer"
                    />
                    <div
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                      onClick={openImage}
                    >
                      <p className="text-sm px-2">Click to zoom</p>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <span
                      className={`text-lg font-medium ${itemAllData.status === "Not Available"
                        ? "text-red-500"
                        : "text-emerald-500"
                        }`}
                    >
                      {itemAllData?.status}
                    </span>
                    <h1 className="text-black text-lg font-extrabold">
                      {itemAllData?.iteam_name?.toUpperCase()}
                    </h1>
                    <span className="text-gray-700">{itemAllData.company}</span>
                    <span className="text-gray-700">{itemAllData.pack}</span>
                    <span className="text-gray-700">
                      {itemAllData.drug_group}
                    </span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <div>
                    <table style={{ whiteSpace: "nowrap" }}>
                      <thead>
                        <tr className="primary text-sm border border-gray-300 font-bold">
                          <td className="px-12 py-2">Current Stock</td>
                          {/* <td className="px-12 py-2">Default Disc.</td> */}
                          <td className="px-12 py-2">Location</td>
                          <td className="px-12 py-2">HSN Code</td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="px-12 py-4 text-center">
                            {itemAllData.stock}
                          </td>
                          {/* <td className="px-12 py-4 text-center">
                            {itemAllData.discount}%
                          </td> */}
                          <td className="px-12 py-4 text-center">
                            {itemAllData.location}
                          </td>
                          <td className="px-12 py-4 text-center">
                            {!itemAllData.hsn_code
                              ? "---"
                              : itemAllData.hsn_code}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <table
                      className="border-collapse w-full"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      <thead>
                        <tr className="primary text-sm border border-gray-300 font-bold">
                          {/* <td className="px-12 py-2">Minimum Qty</td>
                          <td className="px-12 py-2">Maximum Qty</td> */}
                          <td className="px-12 py-2">GST</td>
                          <td className="px-12 py-2">Item Category</td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          {/* <td className="px-12 py-4 text-center">
                            {!itemAllData.minimum ? "---" : itemAllData.minimum}
                          </td>
                          <td className="px-12 py-4 text-center">
                            {!itemAllData.maximum ? "---" : itemAllData.maximum}
                          </td> */}
                          <td className="px-12 py-4 text-center">
                            {itemAllData.gst}%
                          </td>
                          <td className="px-12 py-4 text-center">
                            {itemAllData.category_name}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="row border-b border-dashed"
            style={{ borderColor: "var(--color2)" }}
          ></div>
          <div className="invntry-tab">
            <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
              <Tabs
                value={tabValue}
                onChange={handleChange}
                style={{ marginBottom: "0" }}
                sx={{
                  "& .MuiTabs-scroller.MuiTabs-fixed.css-jpln7h-MuiTabs-scroller":
                    { overflow: "auto !important" },
                }}
              >
                <Tab label="Batches" sx={{ mx: 0 }} />
                <Tab label="Purchases" sx={{ mx: 0 }} />
                <Tab label="Pu.return" sx={{ mx: 0 }} />
                <Tab label="Sales" sx={{ mx: 0 }} />
                <Tab label="Sales Return" sx={{ mx: 0 }} />
                <Tab label="Ledger" sx={{ mx: 0 }} />
              </Tabs>
              {isLoading ? (
                <div className="loader-container ">
                  <Loader />
                </div>
              ) : (
                <>
                  {tabValue === 0 && (
                    <>
                      <div className="pl-2">
                        {/* <input
                                                type="checkbox"
                                                checked={hideZeroQuantity}
                                                onChange={handleCheckboxChange}
                                            /> */}
                        <Checkbox
                          sx={{
                            color: "#628a2f", // Color for unchecked checkboxes
                            "&.Mui-checked": {
                              color: "var(--COLOR_UI_PHARMACY)", // Color for checked checkboxes
                            },
                          }}
                          checked={hideZeroQuantity}
                          onChange={handleCheckboxChange}
                        />
                        <span
                          style={{
                            color: "var(--color1)",
                            fontSize: "15px",
                            fontWeight: 800,
                            marginLeft: "10px",
                          }}
                        >
                          {" "}
                          Hide Zero Quantity
                        </span>
                      </div>

                      <div className="overflow-x-auto ">
                        <table
                          className="custom-table w-full"
                          style={{
                            whiteSpace: "nowrap",
                            borderCollapse: "separate",
                            borderSpacing: "0 6px",
                          }}
                        >
                          <thead>
                            <tr>
                              {batchColumns.map((column) => (
                                <th
                                  key={column.id}
                                  style={{ minWidth: column.minWidth }}
                                >
                                  {column.label}
                                </th>
                              ))}
                              <th>Delete</th>
                            </tr>
                          </thead>
                          <tbody style={{ backgroundColor: "#3f621217" }}>
                            {filteredData?.map((item, index) => (
                              <>
                                {hideZeroQuantity && item.qty == 0}
                                <tr key={index}>
                                  {batchColumns?.map((column, colIndex) => (
                                    <td
                                      key={column.id}
                                      style={
                                        colIndex === 0
                                          ? { borderRadius: "10px 0 0 10px" }
                                          : undefined
                                      }
                                    >
                                      {item[column.id]}
                                    </td>
                                  ))}
                                  <td
                                    style={{
                                      borderRadius: "0 10px 10px 0",
                                    }}
                                  >
                                    <button>
                                      <div>
                                        <DeleteIcon
                                          className="delete-icon"
                                          onClick={() => deleteOpen(item.id)}
                                        />
                                      </div>
                                    </button>
                                  </td>
                                </tr>
                              </>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {/* <TablePagination
                                            rowsPerPageOptions={[5, 10, 12]}
                                            component="div"
                                            count={itemAllData?.batch?.[0]?.count}
                                            rowsPerPage={rowsPerPage}
                                            page={page}
                                            onPageChange={handleChangePage}
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                        /> */}
                    </>
                  )}
                </>
              )}

              {isLoading ? (
                <div className="loader-container ">
                  <Loader />
                </div>
              ) : (
                <>
                  {tabValue === 1 && (
                    <>
                      <div className="row gap-4 inven_view_purchase_main mt-5">
                        <div className="row gap-4 inven_view_purchase">
                          <DatePicker
                            className="custom-datepicker w-full"
                            selected={startDate}
                            onChange={(update) => setDateRange(update)}
                            startDate={startDate}
                            endDate={endDate}
                            selectsRange
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Select Start and End Date"
                            sx={{
                              width: "15%",
                              minWidth: "150px",
                              "@media (max-width:600px)": {
                                minWidth: "100%",
                              },
                            }}
                          />

                          <Autocomplete
                            value={distributorValue}
                            sx={{
                              width: "15%",
                              minWidth: "180px",
                              "@media (max-width:600px)": {
                                minWidth: "100%",
                              },
                            }}
                            size="small"
                            onChange={handleDistributorBillList}
                            options={distributorList}
                            getOptionLabel={(option) => option.name}
                            renderInput={(params) => (
                              <TextField
                                autoComplete="off"
                                {...params}
                                label="Distributor Name"
                              />
                            )}
                          />
                        </div>
                        <div className="row gap-4 inven_view_purchase">
                          <Select
                            labelId="dropdown-label"
                            id="dropdown"
                            value={staff}
                            sx={{ minWidth: "200px" }}
                            onChange={handleStaff}
                            size="small"
                            displayEmpty
                            renderValue={(selected) => {
                              if (selected === "") {
                                return <em>Select Staff</em>;
                              }
                              const selectedOption = staffList.find(
                                (option) => option.id === selected
                              );
                              return selectedOption ? selectedOption.name : "";
                            }}
                          >
                            {staffList.map((option) => (
                              <MenuItem key={option.id} value={option.id}>
                                {option.name}
                              </MenuItem>
                            ))}
                          </Select>

                          <Select
                            labelId="dropdown-label"
                            id="dropdown"
                            value={gstType}
                            sx={{ minWidth: "150px" }}
                            onChange={handleGstType}
                            size="small"
                            displayEmpty
                          >
                            <MenuItem value={true}>With GST</MenuItem>
                            <MenuItem value={false}>Without GST</MenuItem>
                          </Select>
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table
                          className="custom-table w-full border-collapse mt-3"
                          style={{
                            whiteSpace: "nowrap",
                            borderCollapse: "separate",
                            borderSpacing: "0 6px",
                          }}
                        >
                          <thead>
                            <tr>
                              {purchaseColumns.map((column) => (
                                <th
                                  key={column.id}
                                  style={{ minWidth: column.minWidth }}
                                >
                                  {column.label}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          {/* <tbody style={{ backgroundColor: "#3f621217" }}>
                                                        {purchaseListData?.map((item, index) => (
                                                            <tr key={index} >
                                                                {purchaseColumns.map((column) => (
                                                                    <td key={column.id} >
                                                                        {column.id === 'bill_no' ? (
                                                                            <span
                                                                                style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                                                                                onClick={() => viewBill(item)}
                                                                            >
                                                                                {item[column.id]}
                                                                            </span>
                                                                        ) : (
                                                                            item[column.id]
                                                                        )}
                                                                    </td>
                                                                ))}

                                                            </tr>
                                                        ))}
                                                    </tbody> */}
                          <tbody style={{ backgroundColor: "#3f621217" }}>
                            {purchaseListData?.map((item, index) => (
                              <tr key={index}>
                                {purchaseColumns.map((column, colIndex) => (
                                  <td
                                    key={column.id}
                                    style={
                                      colIndex === 0 // Check if this is the first column
                                        ? { borderRadius: "10px 0 0 10px" }
                                        : colIndex ===
                                          purchaseColumns.length - 1 // Last column for right-side radius
                                          ? { borderRadius: "0 10px 10px 0" }
                                          : {}
                                    }
                                  >
                                    {column.id === "bill_no" ? (
                                      <span
                                        style={{
                                          cursor: "pointer",
                                          color: "blue",
                                          textDecoration: "underline",
                                        }}
                                        onClick={() => viewBill(item)}
                                      >
                                        {item[column.id]}
                                      </span>
                                    ) : (
                                      item[column.id]
                                    )}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {/* <TablePagination
                                                rowsPerPageOptions={[5, 10, 12]}
                                                component="div"
                                                count={itemAllData?.purches?.[0]?.count}
                                                rowsPerPage={rowsPerPage}
                                                page={page}
                                                onPageChange={handleChangePage}
                                                onRowsPerPageChange={handleChangeRowsPerPage}
                                            /> */}
                      {/* <TablePagination
                                        rowsPerPageOptions={[7, 10, 25]}
                                        component="div"
                                        count={itemAllData?.purches.length}
                                        rowsPerPage={purchaserowsPerPage}
                                        page={purchasepage}
                                        onPageChange={handleChangePurchasePage}
                                        onRowsPerPageChange={handleChangePurchaseRowsPerPage}
                                    /> */}
                    </>
                  )}
                </>
              )}

              {isLoading ? (
                <div className="loader-container ">
                  <Loader />
                </div>
              ) : (
                <>
                  {tabValue === 2 && (
                    <>
                      <div className="row gap-4 inven_view_purchase_main mt-5">
                        <div className="row gap-4 inven_view_purchase">
                          <DatePicker
                            className="custom-datepicker w-full"
                            selected={startDate}
                            onChange={(update) => setDateRange(update)}
                            startDate={startDate}
                            endDate={endDate}
                            selectsRange
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Select Start and End Date"
                            sx={{
                              width: "15%",
                              minWidth: "200px",
                              "@media (max-width:600px)": {
                                minWidth: "100%",
                              },
                            }}
                          />

                          <Autocomplete
                            value={distributorValue}
                            sx={{
                              width: "15%",
                              minWidth: "200px",
                              "@media (max-width:600px)": {
                                minWidth: "100%",
                              },
                            }}
                            size="small"
                            onChange={handleDistributorBillList}
                            options={distributorList}
                            getOptionLabel={(option) => option.name}
                            renderInput={(params) => (
                              <TextField
                                autoComplete="off"
                                {...params}
                                label="Distributor Name"
                              />
                            )}
                          />
                        </div>
                        <div className="row gap-4 inven_view_purchase">
                          <Select
                            labelId="dropdown-label"
                            id="dropdown"
                            value={staff}
                            sx={{ minWidth: "200px" }}
                            onChange={handleStaff}
                            size="small"
                            displayEmpty
                            renderValue={(selected) => {
                              if (selected === "") {
                                return <em>Select Staff</em>;
                              }
                              const selectedOption = staffList.find(
                                (option) => option.id === selected
                              );
                              return selectedOption ? selectedOption.name : "";
                            }}
                          >
                            {staffList.map((option) => (
                              <MenuItem key={option.id} value={option.id}>
                                {option.name}
                              </MenuItem>
                            ))}
                          </Select>

                          <Select
                            labelId="dropdown-label"
                            id="dropdown"
                            value={gstType}
                            sx={{ minWidth: "150px" }}
                            onChange={handleGstType}
                            size="small"
                            displayEmpty
                          >
                            <MenuItem value={true}>With GST</MenuItem>
                            <MenuItem value={false}>Without GST</MenuItem>
                          </Select>
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table
                          className="custom-table w-full border-collapse mt-3"
                          style={{
                            whiteSpace: "nowrap",
                            borderCollapse: "separate",
                            borderSpacing: "0 6px",
                          }}
                        >
                          <thead>
                            <tr>
                              {purchaseReturnColumns.map((column) => (
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
                            {purchaseReturnListData?.map((item, index) => (
                              <tr key={index}>
                                {purchaseReturnColumns.map(
                                  (column, colIndex) => (
                                    <td
                                      key={column.id}
                                      style={
                                        colIndex === 0
                                          ? {
                                            borderRadius: "10px 0 0 10px",
                                          }
                                          : colIndex ===
                                            purchaseReturnColumns.length - 1
                                            ? {
                                              borderRadius: "0 10px 10px 0",
                                            }
                                            : {}
                                      }
                                    >
                                      {column.id === "bill_no" ? (
                                        <span
                                          style={{
                                            cursor: "pointer",
                                            color: "blue",
                                            textDecoration: "underline",
                                          }}
                                          onClick={() => viewBill(item)}
                                        >
                                          {item[column.id]}
                                        </span>
                                      ) : (
                                        item[column.id]
                                      )}
                                    </td>
                                  )
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {/* <TablePagination
                                                rowsPerPageOptions={[5, 10, 12]}
                                                component="div"
                                                count={itemAllData?.purches_return?.[0]?.count}
                                                rowsPerPage={rowsPerPage}
                                                page={page}
                                                onPageChange={handleChangePage}
                                                onRowsPerPageChange={handleChangeRowsPerPage}
                                            /> */}
                    </>
                  )}
                </>
              )}

              {isLoading ? (
                <div className="loader-container ">
                  <Loader />
                </div>
              ) : (
                <>
                  {tabValue === 3 && (
                    <>
                      <div className="row gap-4 inven_view_purchase_main mt-5">
                        <div className="row gap-4 inven_view_purchase">
                          <DatePicker
                            className="custom-datepicker w-full"
                            selected={startDate}
                            onChange={(update) => setDateRange(update)}
                            startDate={startDate}
                            endDate={endDate}
                            selectsRange
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Select Start and End Date"
                            sx={{
                              width: "15%",
                              minWidth: "200px",
                              "@media (max-width:600px)": {
                                minWidth: "100%",
                              },
                            }}
                          />

                          <Autocomplete
                            value={customerValue}
                            sx={{
                              width: "15%",
                              minWidth: "200px",
                              "@media (max-width:600px)": {
                                minWidth: "100%",
                              },
                            }}
                            size="small"
                            onChange={handleCustomerBillList}
                            options={customerDetails}
                            getOptionLabel={(option) =>
                              option.name
                                ? `${option.name} [${option.phone_number}]`
                                : option.phone_number || ""
                            }
                            renderInput={(params) => (
                              <TextField
                                autoComplete="off"
                                {...params}
                                label="Customer Name/No"
                              />
                            )}
                            renderOption={(props, option) => (
                              <ListItem {...props}>
                                <ListItemText
                                  primary={`${option.name} `}
                                  secondary={`Mobile No: ${option.phone_number}`}
                                />
                              </ListItem>
                            )}
                          />
                        </div>
                        <div className="row gap-4 inven_view_purchase">
                          {/* <TextField
                 autoComplete="off"
                                                    id="outlined-number"
                                                    label="Mobile No"
                                                    style={{ width: '200px' }}
                                                    size="small"
                                                    value={customerNo}
                                                    onChange={(e) => { setCustomerNo(e.target.value) }}
                                                /> */}

                          <Select
                            labelId="dropdown-label"
                            id="dropdown"
                            value={staff}
                            sx={{ minWidth: "200px" }}
                            onChange={handleStaff}
                            size="small"
                            displayEmpty
                            renderValue={(selected) => {
                              if (selected === "") {
                                return <em>Select Staff</em>;
                              }
                              const selectedOption = staffList.find(
                                (option) => option.id === selected
                              );
                              return selectedOption ? selectedOption.name : "";
                            }}
                          >
                            {staffList.map((option) => (
                              <MenuItem key={option.id} value={option.id}>
                                {option.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table
                          className="custom-table w-full border-collapse  mt-3"
                          style={{
                            whiteSpace: "nowrap",
                            borderCollapse: "separate",
                            borderSpacing: "0 6px",
                          }}
                        >
                          <thead>
                            <tr>
                              {saleColumns.map((column) => (
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
                            {saleListData?.map((item, index) => (
                              <tr key={index}>
                                {saleColumns.map((column, colIndex) => (
                                  <td
                                    key={column.id}
                                    style={
                                      colIndex === 0
                                        ? {
                                          borderRadius: "10px 0 0 10px",
                                        }
                                        : colIndex === saleColumns.length - 1
                                          ? { borderRadius: "0 10px 10px 0" }
                                          : {}
                                    }
                                  >
                                    {column.id === "bill_no" ? (
                                      <span
                                        style={{
                                          cursor: "pointer",
                                          color: "blue",
                                          textDecoration: "underline",
                                        }}
                                        onClick={() => viewBill(item)}
                                      >
                                        {item[column.id]}
                                      </span>
                                    ) : (
                                      item[column.id]
                                    )}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {/* <TablePagination
                                                rowsPerPageOptions={[5, 10, 12]}
                                                component="div"
                                                count={itemAllData?.sales?.[0]?.count}
                                                rowsPerPage={rowsPerPage}
                                                page={page}
                                                onPageChange={handleChangePage}
                                                onRowsPerPageChange={handleChangeRowsPerPage}
                                            /> */}
                    </>
                  )}
                </>
              )}

              {isLoading ? (
                <div className="loader-container ">
                  <Loader />
                </div>
              ) : (
                <>
                  {tabValue === 4 && (
                    <>
                      <div className="row gap-4 inven_view_purchase_main mt-5">
                        <div className="row gap-4 inven_view_purchase">
                          <DatePicker
                            className="custom-datepicker w-full"
                            selected={startDate}
                            onChange={(update) => setDateRange(update)}
                            startDate={startDate}
                            endDate={endDate}
                            selectsRange
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Select Start and End Date"
                            sx={{
                              width: "15%",
                              minWidth: "200px",
                              "@media (max-width:600px)": {
                                minWidth: "100%",
                              },
                            }}
                          />
                          <Autocomplete
                            value={customerValue}
                            sx={{
                              width: "15%",
                              minWidth: "200px",
                              "@media (max-width:600px)": {
                                minWidth: "100%",
                              },
                            }}
                            size="small"
                            onChange={handleCustomerBillList}
                            options={customerDetails}
                            getOptionLabel={(option) =>
                              option.name
                                ? `${option.name} [${option.phone_number}]`
                                : option.phone_number || ""
                            }
                            renderInput={(params) => (
                              <TextField
                                autoComplete="off"
                                {...params}
                                label="Customer Name/No"
                              />
                            )}
                            renderOption={(props, option) => (
                              <ListItem {...props}>
                                <ListItemText
                                  primary={`${option.name} `}
                                  secondary={`Mobile No: ${option.phone_number}`}
                                />
                              </ListItem>
                            )}
                          />
                        </div>
                        <div className="row gap-4 inven_view_purchase">
                          {/* <Autocomplete
                                                    value={customerValue}
                                                    sx={{
                                                        width: '15%',
                                                        minWidth: '150px',
                                                        '@media (max-width:600px)': {
                                                            minWidth: '300px',
                                                        },
                                                    }}
                                                    size='small'
                                                    onChange={handleCustomerBillList}
                                                    options={customerDetails}
                                                    getOptionLabel={(option) => option.name}
                                                    renderInput={(params) => <TextField
                 autoComplete="off" {...params} label="Customer Name/No" />}
                                                /> */}

                          {/* <TextField
                 autoComplete="off"
                                                    id="outlined-number"
                                                    label="Mobile No"
                                                    style={{ width: '200px' }}
                                                    size="small"
                                                    value={customerNo}
                                                    onChange={(e) => { setCustomerNo(e.target.value) }}
                                                /> */}

                          <Select
                            labelId="dropdown-label"
                            id="dropdown"
                            value={staff}
                            sx={{ minWidth: "200px" }}
                            onChange={handleStaff}
                            size="small"
                            displayEmpty
                            renderValue={(selected) => {
                              if (selected === "") {
                                return <em>Select Staff</em>;
                              }
                              const selectedOption = staffList.find(
                                (option) => option.id === selected
                              );
                              return selectedOption ? selectedOption.name : "";
                            }}
                          >
                            {staffList.map((option) => (
                              <MenuItem key={option.id} value={option.id}>
                                {option.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table
                          className="custom-table w-full border-collapse mt-3"
                          style={{
                            whiteSpace: "nowrap",
                            borderCollapse: "separate",
                            borderSpacing: "0 6px",
                          }}
                        >
                          <thead>
                            <tr>
                              {saleReturnColumns.map((column) => (
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
                            {saleReturnListData?.map((item, index) => (
                              <tr key={index}>
                                {saleReturnColumns.map((column, colIndex) => (
                                  <td
                                    key={column.id}
                                    style={
                                      colIndex === 0
                                        ? { borderRadius: "10px 0 0 10px" }
                                        : colIndex ===
                                          saleReturnColumns.length - 1
                                          ? { borderRadius: "0 10px 10px 0" }
                                          : {}
                                    }
                                  >
                                    {column.id === "bill_no" ? (
                                      <span
                                        style={{
                                          cursor: "pointer",
                                          color: "blue",
                                          textDecoration: "underline",
                                        }}
                                        onClick={() => viewBill(item)}
                                      >
                                        {item[column.id]}
                                      </span>
                                    ) : (
                                      item[column.id]
                                    )}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {/* <TablePagination
                                                rowsPerPageOptions={[5, 10, 12]}
                                                component="div"
                                                count={itemAllData?.sales_return?.[0]?.count}
                                                rowsPerPage={rowsPerPage}
                                                page={page}
                                                onPageChange={handleChangePage}
                                                onRowsPerPageChange={handleChangeRowsPerPage}
                                            /> */}
                    </>
                  )}
                </>
              )}

              {isLoading ? (
                <div
                  className="loader-container "
                  style={{
                    overflow: "hidden", // Prevent corners from being overridden by table contents
                  }}
                >
                  <Loader />
                </div>
              ) : (
                <>
                  {tabValue === 5 && (
                    <>
                      <div className="overflow-x-auto">
                        <table
                          className="custom-table"
                          style={{
                            whiteSpace: "nowrap",
                            borderCollapse: "separate",
                            borderSpacing: "0 6px",
                          }}
                        >
                          <thead>
                            <tr>
                              {ledger.map((column) => (
                                <th
                                  key={column.id}
                                  style={{ minWidth: column.minWidth }}
                                >
                                  {column.label}
                                  {column.label == "In" && <ArrowUpwardIcon />}
                                  {column.label == "Out" && (
                                    <ArrowDownwardIcon />
                                  )}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody style={{ backgroundColor: "#3f621217" }}>
                            {ledgerListData?.map((item, index) => (
                              <tr key={index}>
                                {ledger.map((column, colIndex) => (
                                  <td
                                    key={column.id}
                                    style={
                                      colIndex === 0
                                        ? { borderRadius: "10px 0 0 10px" }
                                        : colIndex === ledger.length - 1
                                          ? { borderRadius: "0 10px 10px 0" }
                                          : {}
                                    }
                                  >
                                    {column.id === "bill_no" ? (
                                      <span
                                        style={{
                                          cursor: "pointer",
                                          color: "blue",
                                          textDecoration: "underline",
                                        }}
                                        onClick={() => openBill(item)}
                                      >
                                        {item[column.id]}
                                      </span>
                                    ) : (
                                      item[column.id]
                                    )}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>

                          {/* <tbody>
                                                {itemAllData?.ledger?.map((item, index) => (
                                                    <tr key={index} >
                                                        {ledger.map((column) => (
                                                            <td key={column.id}>
                                                                {item[column.id]}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody> */}
                        </table>
                      </div>
                      {/* <TablePagination
                                                rowsPerPageOptions={[5, 10, 12]}
                                                component="div"
                                                count={itemAllData?.ledger?.[0]?.count}
                                                rowsPerPage={rowsPerPage}
                                                page={page}
                                                onPageChange={handleChangePage}
                                                onRowsPerPageChange={handleChangeRowsPerPage}
                                            /> */}
                    </>
                  )}
                </>
              )}
            </Box>
          </div>
        </div>
        <Dialog className="custom-dialog modal_991 " open={openAddPopUp}>
          <DialogTitle id="alert-dialog-title" className="secondary">
            Edit Inventory Details
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col">
                  <span className="label primary">Packaging In</span>
                  <Select
                    labelId="dropdown-label"
                    id="dropdown"
                    className="w-full"
                    value={packaging}
                    // sx={{ minWidth: '250px' }}
                    onChange={(e) => setPackaging(e.target.value)}
                    size="small"
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      Select Packaging
                    </MenuItem>
                    {packList.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.packging_name}
                      </MenuItem>
                    ))}
                  </Select>
                </div>

                <div className="flex flex-col">
                  <span className="label primary">Category</span>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    className="w-full"
                    options={categoryList}
                    size="small"
                    // disabled
                    value={category}
                    onChange={(e, value) => setCategory(value)}
                    // sx={{ width: 250 }}
                    getOptionLabel={(option) => option.category_name}
                    renderInput={(params) => (
                      <TextField
                        autoComplete="off"
                        {...params}
                      // label="Select Company"
                      />
                    )}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="label primary">Company Name</span>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={companyList}
                    size="small"
                    className="w-full"
                    // disabled
                    value={company}
                    onChange={(e, value) => setCompany(value)}
                    // sx={{ width: 250 }}
                    getOptionLabel={(option) => option.company_name}
                    renderInput={(params) => (
                      <TextField autoComplete="off" {...params} />
                    )}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="label primary">DrugGroup</span>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    className="w-full"
                    options={drugGroupList}
                    size="small"
                    value={drugGroup}
                    // sx={{ width: 250 }}
                    onChange={(e, value) => setDrugGroup(value)}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => (
                      <TextField
                        autoComplete="off"
                        {...params}
                        label="Select DrugGroup"
                      />
                    )}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="label primary">Location</span>
                  <TextField
                    autoComplete="off"
                    id="outlined-multiline-static"
                    size="small"
                    value={loc}
                    onChange={(e) => {
                      setLoc((e.target.value).toUpperCase());
                    }}
                    className="w-full"
                    variant="outlined"
                  />
                </div>
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions style={{ padding: "24px" }}>
            <Button
              autoFocus
              variant="contained"
              color="success"
              onClick={updateItem}
            >
              Update
            </Button>
            <Button variant="contained" color="error" onClick={resetAddDialog}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openImg}>
          <IconButton
            aria-label="close"
            onClick={() => setOpenImg(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "#d61818ff",
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <img
                src={
                  itemAllData?.front_photo ? itemAllData.front_photo : tablet
                }
                alt={itemAllData?.front_photo ? "Pharma" : "Tablet"}
                className="w-full h-full object-cover cursor-pointer"
              />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            {/* <Button autoFocus variant="contained" color="success">
                            {buttonLabel}
                        </Button> */}
          </DialogActions>
        </Dialog>

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
              onClick={deleteClose}
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
                onClick={() => deleteBatch(batchId)}
              >
                Delete
              </button>
              <button
                type="button"
                className="px-6 py-2.5 w-44 rounded-md text-black text-sm font-semibold border-none outline-none bg-gray-200 hover:bg-gray-900 hover:text-white"
                onClick={deleteClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default InventoryView;
