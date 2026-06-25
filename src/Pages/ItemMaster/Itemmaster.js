import "../ItemMaster/itemMaster.css";
import Header from "../Header";
import {
  Box,
  Checkbox,
  TextField,
  Button,
  Typography,
  DialogContentText,
  ListItem,
  ListItemText,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import Select from "@mui/material/Select";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { FaPlusCircle } from "react-icons/fa";
import tablet from "../../componets/Images/tablet.png";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import Autocomplete from "@mui/material/Autocomplete";
import Loader from "../../componets/loader/Loader";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useSubmitShortcut from "../../hooks/useSubmitShortcut";

const Itemmaster = () => {
  const [item, setItem] = useState("");
  const [unit, setUnit] = useState(1);
  const [weightage, setWeightage] = useState(1);
  const [gst, setGST] = useState(null);
  const [hsn_code, sethsnCode] = useState(null);
  const [margin, setMargin] = useState(null);
  const [disc, setDisc] = useState(null);
  const [max, setMax] = useState(null);
  const [min, setMin] = useState(null);
  const [pack, setPack] = useState(`1 * ${unit}`);
  const [location, setLocation] = useState("");
  const [drugGroup, setDrugGroup] = useState(null);
  const [searchItem, setSearchItem] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [value, setValue] = useState(null);
  const [locationvalue, setLocationValue] = useState(null);
  const [itemList, setItemList] = useState([]);
  const [isAutocompleteDisabled, setAutocompleteDisabled] = useState(true);
  const [locationList, setLocationList] = useState([]);
  const generateRandomBarcode = () => {
    let barcode = "";
    for (let i = 0; i < 10; i++) {
      barcode += Math.floor(Math.random() * 12);
    }
    return barcode;
  };
  const [barcode, setBarcode] = useState(generateRandomBarcode());
  const [companyList, setCompanyList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [suppliersList, setSuppliersList] = useState([]);
  const [drugGroupList, setDrugGroupList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedSuppliers, setSelectedSuppliers] = useState(null);
  const [selectedFrontFile, setSelectedFrontFile] = useState(null);
  const [selectedBackFile, setSelectedBackFile] = useState(null);
  const [selectedMRPFile, setSelectedMRPFile] = useState(null);
  const [gstList, setGstList] = useState([]);
  const [packList, setPackList] = useState([]);
  const [packaging, setPackaging] = useState("");
  const [frontImgUrl, setFrontImgUrl] = useState(null);
  const [backImgUrl, setBackImgUrl] = useState(null);
  const [mrpImgUrl, setMrpImgUrl] = useState(null);
  const [message, setMessage] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [drugGroupName, setDrugGroupName] = useState("");
  const [open, setOpen] = useState(false);
  const [openDrugGroup, setOpenDrugGroup] = useState(false);
  const [openCompany, setOpenCompany] = useState(false);
  const [openDistributor, setOpenDistributor] = useState(false);
  const [distributorGSTNumber, setDistributorGSTNumber] = useState("");
  const [distributorName, setDistributorName] = useState("");
  const [distributorMobileNo, setDistributorMobileNo] = useState("");
  const [distributorAddress, setDistributorAddress] = useState("");
  const [selectedDistributorId, setSelectedDistributorId] = useState("");
  const [scheduleChecked, setScheduleChecked] = useState(true);
  const [onlineorderChecked, setOnlineOrderChecked] = useState(true);
  const [MRP, setMRP] = useState(null);
  const [unitOptions, setUnitOptions] = useState([]);
  const [taxNotApplicableChecked, setTaxNotApplicableChecked] = useState(true);
  const [openFile, setOpenFile] = useState(false);
  const token = localStorage.getItem("token");
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [error, setError] = useState({ searchItem: "", unit: "", weightage: "", pack: "", packaging: "", selectedCompany: "", selectedSuppliers: "", drugGroup: "", selectedCategory: "", selectedFrontFile: "", selectedMRPFile: "", selectedBackFile: "", });

  const [drugGroupSearch, setDrugGroupSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileType = selectedFile.type;
      if (fileType === "text/csv") {
        setFile(selectedFile);
      } else {
        toast.dismiss();
        toast.error("Please select an Excel or CSV file.");
      }
    }
  };

  const handleFileUpload = async () => {
    if (file) {
      let data = new FormData();
      data.append("file", file);
      setIsLoading(true);
      try {
        await axios
          .post("item-import", data, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            toast.dismiss();
            toast.success(response.data.message);
            setOpenFile(false);
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
    } else {
      toast.dismiss();
      toast.error("No file selected");
    }
  };

  useEffect(() => {
    listItemcatagory();
    listSuppliers();
    listOfGst();
    listOfPack();
    listOfCompany();
    listLocation();
  }, []);



  let listLocation = () => {
    axios
      .get("item-location", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setLocationList(response.data.data);
        // setIsLoading(false);
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

  const handleBackPhoto = (event) => {
    setSelectedBackFile(event.target.files[0]);
    const url = URL.createObjectURL(event.target.files[0]);
    setBackImgUrl(url);
  };

  const handleFrontPhoto = (event) => {
    setSelectedFrontFile(event.target.files[0]);
    const url = URL.createObjectURL(event.target.files[0]);
    setFrontImgUrl(url);
  };

  const handleMRPPhoto = (event) => {
    const file = event.target.files[0];
    setSelectedMRPFile(file);
    const url = URL.createObjectURL(file);
    setMrpImgUrl(url);
  };

  const handlePackagingChange = (e) => {
    const selectedPackagingId = e.target.value;
    setPackaging(selectedPackagingId);
    const selectedPackaging = packList.find(
      (option) => option.id === selectedPackagingId
    );
    // Update unit options based on selected packaging
    if (selectedPackaging) {
      setUnitOptions(selectedPackaging.unit);
      setUnit("");
    } else {
      setUnitOptions([]);
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
        // const pharma = JSON.parse(localStorage.getItem("pharma"));
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

  let listItemcatagory = () => {
    axios
      .get("list-itemcategory", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setCategoryList(response.data.data);
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

  let listOfGst = () => {
    axios
      .get("gst-list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {

        setGstList(response.data.data);
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

  let listSuppliers = (newlyAddedName) => {
    axios
      .post("list-distributer", {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const list = response.data.data || [];
        setSuppliersList(list);
        setIsLoading(false);
        if (newlyAddedName) {
          const found = list.find(d =>
            (d.name || d.distributor_name || "").toUpperCase() === newlyAddedName.toUpperCase()
          );
          if (found) {
            setSelectedSuppliers(found);
          }
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


  const submitCategory = () => {
    let data = new FormData();
    data.append("category_name", categoryName);
    try {
      const response = axios.post("create-itemcategory", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status === 401) {
        history.push('/');
        localStorage.clear();
      }
      listItemcatagory();
      setOpen(false);
      setCategoryName("");
      setIsLoading(false);

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

  const submitDrugGroup = () => {
    let data = new FormData();
    data.append("name", drugGroupName);
    try {
      axios
        .post("drug-group-store", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setOpenDrugGroup(false);
          setDrugGroupName("");
          setIsLoading(false);
          toast.dismiss();
          toast.success(response.data.message);
        });

    } catch (error) {
      console.error("API error:", error);
      toast.dismiss();
      toast.error(error);
      if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
    }
  };

  const submitCompany = async () => {
    let data = new FormData();
    if (!companyName) {
      toast.dismiss();
      toast.error("enter company name")
      return;
    }
    data.append("company_name", companyName);
    try {
      await axios
        .post("company-store", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setOpenCompany(false);
          setCompanyName("");
          listOfCompany();
          setIsLoading(false);
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

  const submitDistributor = async () => {
    if (!distributorName) {
      toast.dismiss();
      toast.error("Distributor Name is required");
      return;
    }
    if (!distributorMobileNo) {
      toast.dismiss();
      toast.error("Mobile Number is required");
      return;
    } else if (!/^\d{10}$/.test(distributorMobileNo)) {
      toast.dismiss();
      toast.error("Mobile number must be 10 digits");
      return;
    }
    if (!distributorGSTNumber) {
      toast.dismiss();
      toast.error("GST Number is required");
      return;
    }

    let finalDistributorVal = selectedDistributorId;
    if (!finalDistributorVal && distributorName) {
      const exactMatch = suppliersList.find(d =>
        (d.name || d.distributor_name || "").toUpperCase() === distributorName.trim().toUpperCase()
      );
      if (exactMatch) {
        finalDistributorVal = exactMatch.id;
      }
    }
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!gstRegex.test(distributorGSTNumber)) {
      toast.dismiss();
      toast.error("Please enter a valid GST Number");
      return;
    }

    let data = new FormData();
    data.append("gst_number", distributorGSTNumber);
    data.append("mobile_no", distributorMobileNo);
    data.append("address", distributorAddress);
    data.append("payment_due_days", "15");
    if (finalDistributorVal) {
      data.append("distributor_id", finalDistributorVal);
      data.append("distributor_name", "");
    } else {
      data.append("distributor_id", "");
      data.append("distributor_name", distributorName);
    }
    const nameToSelect = distributorName;
    try {
      await axios
        .post("create-distributer", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          toast.dismiss();
          toast.success(response.data.message);
          setOpenDistributor(false);
          setDistributorGSTNumber("");
          setDistributorName("");
          setDistributorMobileNo("");
          setDistributorAddress("");
          setSelectedDistributorId("");
          listSuppliers(nameToSelect);
        });
    } catch (error) {
      console.error("API error:", error);
      toast.dismiss();
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to add distributor");
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

  // const handle = () => {
  //   setOnlineOrderChecked(!onlineorderChecked)
  // }


  // const handleSubmit = () => {
  //   if (isSubmitting) return false;

  //   const newErrors = {};
  //   if (!searchItem.trim()) {
  //     newErrors.searchItem = "Item name is required.";
  //     // toast.dismiss();
  //     // toast.error(newErrors.searchItem);
  //     // return;
  //   } else {
  //     const disallowedCharsRegex = /[@$]/;
  //     if (disallowedCharsRegex.test(searchItem)) {
  //       newErrors.searchItem = "Enter valid Item name.";
  //       // toast.dismiss();
  //       // toast.error("Enter valid Item name.");
  //       // return;

  //     }
  //   }
  //   if (weightage == 0) {
  //     newErrors.weightage = "Unit is required.";
  //     toast.dismiss();
  //     toast.error(newErrors.weightage);
  //     return;
  //   }
  //   // if (packaging.length == 0) {
  //   //   newErrors.packaging = "Select any Packaging.";
  //   // toast.dismiss();
  //   // toast.error(newErrors.packaging);
  //   // }
  //   // if (!location) {
  //   //   newErrors.location = 'Location is required.'
  //   // toast.dismiss();
  //   // toast.error(newErrors.location);
  //   // }
  //   if (!selectedCompany) {
  //     newErrors.selectedCompany = "Select any Company.";
  //     toast.dismiss();
  //     toast.error(newErrors.selectedCompany);
  //     return;

  //   }
  //   // if (!selectedSuppliers) {
  //   //   newErrors.selectedSuppliers = 'Select any Supplier.'
  //   // }
  //   if (!drugGroup) {
  //     newErrors.drugGroup = "Drug Group is required.";
  //     toast.dismiss();
  //     toast.error(newErrors.drugGroup);
  //     return;

  //   }
  //   // if (!selectedCategory) {
  //   //   newErrors.selectedCategory = "Category is required.";
  //   // toast.dismiss();
  //   // toast.error(newErrors.selectedCategory);
  //   // }
  //   setError(newErrors);
  //   const isValid = Object.keys(newErrors).length === 0;
  //   if (isValid) {
  //     submitItemRecord();
  //   }
  //   return isValid;
  // };







  const handleSubmit = () => {
    if (isSubmitting) return false;

    const newErrors = {};

    if (!searchItem.trim()) {
      newErrors.searchItem = "Item name is required";
    } else {
      const disallowedCharsRegex = /[@$]/;
      if (disallowedCharsRegex.test(searchItem)) {
        newErrors.searchItem = "Enter valid Item name";
      }
    }

    if (weightage == 0) {
      newErrors.weightage = "Unit is required";
    }

    if (!selectedCompany) {
      newErrors.selectedCompany = "Select any Company";
    }

    if (!drugGroup) {
      newErrors.drugGroup = "Drug Group is required";
    }

    setError(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return false;
    }

    submitItemRecord();
    return true;
  };





  const submitItemRecord = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    let formData = new FormData();

    formData.append("item_id", value.id ? value.id : "");

    formData.append("item_name", searchItem ? searchItem : "");
    formData.append("packaging_id", packaging ? packaging : "");
    formData.append("old_unit", unit ? unit : "");
    formData.append("unit", weightage ? weightage : "");
    formData.append("pack", pack ? pack : "");
    formData.append("drug_group", drugGroup ? drugGroup.id : "");
    formData.append("gst", gst ? gst : "");
    formData.append("location", location ? location : "");
    formData.append("mrp", MRP ? MRP : "");
    formData.append("barcode", barcode ? barcode : "");
    formData.append("minimum", min ? min : "");
    formData.append("maximum", max ? max : "");
    formData.append("discount", disc ? disc : "");
    formData.append("margin", margin ? margin : "");
    formData.append("hsn_code", hsn_code ? hsn_code : "");
    formData.append("message", message ? message : "");
    formData.append("item_category_id", selectedCategory ? selectedCategory.id : "");
    formData.append("pahrma", selectedCompany ? selectedCompany.id : "");
    formData.append("distributer", selectedSuppliers ? selectedSuppliers.id : "");
    formData.append("front_photo", selectedFrontFile ? selectedFrontFile : "");
    formData.append("back_photo", selectedBackFile ? selectedBackFile : "");
    formData.append("mrp_photo", selectedMRPFile ? selectedMRPFile : "");
    try {
      const response = await axios.post("create-iteams", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === 200) {
        toast.dismiss();
        toast.success(response.data.message);
        setTimeout(() => {
          history.push("/inventory");
        }, 2000);
      } else if (response.data.status === 400) {
        toast.dismiss();
        toast.error(response.data.message);
        setIsSubmitting(false);
      } else {
        setIsSubmitting(false);
      }
    } catch (error) {
      setIsSubmitting(false);
      if (error.response && error.response.status === 400) {
        toast.dismiss();
        toast.error(error.response.data.message);
      } else {
        console.error("API error:", error);

        toast.dismiss();
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

  useEffect(() => {
    if (page > 1 && searchItem) {
      handleSearch(searchItem.toUpperCase(), page);
    }
  }, [page]);

  useEffect(() => {
    const SearchTimer = setTimeout(() => {
      if (!searchItem) {
        resetData()
      }

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



    return () => {

      clearTimeout(SearchTimer);

    };
  }, [searchItem]);

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

    const params = {
      search: searchValue,
      page: pageNumber,
      limit: 20,
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

  const handleDrugGroupSearch = async (keyword) => {
    if (keyword && keyword.trim() === "" && keyword.length > 0) {
      return;
    }

    let data = new FormData();
    data.append("search", keyword ? keyword.trim() : "");
    data.append("page", 1);


    try {
      const response = await axios.post("drug-list", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDrugGroupList(response.data.data);
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

  const showItemData = async (itemId) => {
    let data = new FormData();
    data.append("id", itemId);
    const params = {
      id: itemId,
    };
    try {
      const res = await axios
        .post("edit-iteam?", data, {
          params: params,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const data = response.data.data;
          setPackaging(data?.packaging_id || data?.package_id);
          setWeightage(data?.weightage);
          setPack(data?.packing_size);
          setMin(data?.minimum);
          setMax(data?.maximum);
          setMRP(data?.mrp);
          setGST(data?.gst_id || data?.gst);
          setBarcode(data?.barcode);
          setSelectedBackFile(data?.back_photo);
          setBackImgUrl(data?.back_photo);
          setFrontImgUrl(data?.front_photo);
          setSelectedFrontFile(data?.front_photo);
          setSelectedMRPFile(data?.mrp_photo);
          setMrpImgUrl(data?.mrp_photo);
          setMessage(data?.message);
          const category = categoryList.find(
            (cat) => cat.id == data?.category_id
          );
          setSelectedCategory(category);

          setDrugGroup(() => ({ id: data?.drug_group_id, name: data?.drug_group }));

          const company = companyList.find((comp) => comp.id == data?.company_id);

          setSelectedCompany(company);
          const supplier = suppliersList.find(
            (dis) => dis.id == data?.distributor_id
          );
          setSelectedSuppliers(supplier);

          const locationItem = locationList.find((x) => x === data?.loaction);

          setLocationValue(locationItem);

          if (locationItem) {
            setLocationValue(locationItem);
          } else {
            setLocationValue(data?.loaction);
            console.warn(
              "Location not found in locationList, keeping the previous value:",
              data?.loaction
            );
          }

          setDisc(data?.discount);
          setMargin(data?.margin);
          sethsnCode(data?.hsn_code);
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

  const handleLocationOptionChange = (event, newValue) => {
    setLocationValue(newValue);
    if (newValue) {
      setLocation(newValue);
    }
  };


  const handleOptionChange = async (event, newValue) => {
    setValue(newValue);
    if (newValue) {
      await resetData();
      const itemName = newValue.iteam_name;
      const itemId = newValue.id;
      setSearchItem(itemName);
      // await handleSearch(itemName);
      await showItemData(itemId);
    }
  };

  const handleLocationInputChange = (event, newInputValue) => {
    setLocation(newInputValue);
  };

  const handleInputChange = (event, newInputValue) => {

    setSearchItem(newInputValue);
    // handleSearch(newInputValue);
    setError((prev) => ({
      ...prev,
      searchItem: "",
    }));


  };

  const handlePack = (e) => {
    setWeightage(e.target.value);
    setPack("1*" + e.target.value);
    setError((prev) => ({
      ...prev,
      weightage: "",
    }));
  };

  const handleClose = () => {
    setCategoryName("");
    setOpen(false);
  };

  const handleCloseDrugGroup = () => {
    setOpenDrugGroup(false);
  };

  const handleCloseCompany = () => {
    setOpenCompany(false);
  };

  const handleFileClose = () => {
    setOpenFile(false);
  };

  const handleDownload = () => {

    const link = document.createElement("a");
    link.href = "/ItemSample_Data.csv";
    link.download = "ItemSample_Data.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetData = () => {
    setSearchItem("");
    setUnit(0);
    setWeightage(0);
    setGST("");
    sethsnCode("");
    setMargin("");
    setDisc("");
    setMax("");
    setMin("");
    setPack(`1 * 0`);
    setLocation("");
    setError("");
    setDrugGroup(null);
    setMRP(0);
    setBarcode("");
    setPackaging("");
    setSelectedCategory(null);
    setSelectedCompany(null);
    setSelectedSuppliers(null);
    setTaxNotApplicableChecked(false);
    setScheduleChecked(false);
    setOnlineOrderChecked(false);
    setSelectedFrontFile(null);
    setSelectedBackFile(null);
    setSelectedMRPFile(null);
  };

  const openFileUpload = () => {
    setOpenFile(true);
  };

  // Global submit shortcuts
  useSubmitShortcut(handleSubmit, !open && !openDrugGroup && !openCompany && !openDistributor && !openFile);
  useSubmitShortcut(submitCategory, open);
  useSubmitShortcut(submitDrugGroup, openDrugGroup);
  useSubmitShortcut(submitCompany, openCompany);
  useSubmitShortcut(submitDistributor, openDistributor);
  useSubmitShortcut(handleFileUpload, openFile);

  return (
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
        <Loader />
      ) : (
        <div className="item_add_box paddin12-8" style={{ gap: "0px" }}>
          {/* //content className*/}
          <div className="flex justify-between header_bx px-4 py-3">
            <h1
              style={{
                color: "var(--color1)",
                alignItems: "center",
                fontWeight: 700,
                fontSize: "28px",

              }}
            >
              Add Item Master
            </h1>
            {/* <Button
              variant="contained"
              style={{
                background: "var(--color1)",
                display: "flex",
                gap: "10px",
              }}
              onClick={openFileUpload}
            >
              <CloudUploadIcon /> Import
              </Button> */}
          </div>
          <div
            className="mainform bg-white rounded-lg px-4 pb-3 pt-0"
          >
            <div className="row border-b border-dashed" style={{ borderColor: "var(--color2)" }}></div>

            <div className="pt-2">
              <h1 className="product" style={{ color: "var(--color1)", textAlign: "center" }}>
                Product Information
              </h1>
            </div>
            <div className="row border-b border-dashed pt-2" style={{ borderColor: "var(--color2)" }}></div>

            <div className="row gap-4 item_boxes">
              <div className="bg-white rounded-lg items-center mt-4 mb-5 p-4 item_inner_box" style={{
                border: '1px solid #628a2f73',
                boxShadow: 'rgb(184 202 161 / 7%) 11px 12px 20px',
                width: '50%',
                height: '100%'
              }}>
                <div className="row">
                  <div className="fields" style={{ width: "100%", flexDirection: "column", borderColor: 'var(--color1)' }}>
                    <label className="label">Item Name <span className="text-red-600  ">*</span></label>
                    <Autocomplete
                      value={value}
                      error={!!error.searchItem}
                      inputValue={(searchItem || "").toUpperCase()}
                      size="small"
                      onChange={handleOptionChange}
                      onInputChange={handleInputChange} // Handles input changes while typing
                      ListboxProps={{
                        onScroll: handleScroll,
                      }}
                      getOptionLabel={(option) =>
                        typeof option === "string" ? option : option.iteam_name
                      }
                      options={itemList} // The list of available options
                      renderOption={(props, option) => (
                        <ListItem {...props}>
                          <ListItemText primary={option.iteam_name} />
                        </ListItem>
                      )}
                      renderInput={(params) => (
                        <TextField {...params} placeholder="Search Item Name" autoFocus />

                      )}
                      freeSolo
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: error.searchItem
                              ? "#d32f2f"
                              : "rgba(0, 0, 0, 0.38)",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: error.searchItem
                              ? "#d32f2f"
                              : "var(--color1)",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: error.searchItem
                              ? "#d32f2f"
                              : "var(--color1)",
                          },
                        },
                      }}
                    />

                    {error.searchItem && (
                      <div style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                        {error.searchItem}
                      </div>
                    )}

                  </div>
                </div>
                <div className="row item_fld_rw gap-3 md:pt-2">
                  <div className="fields Unit_divvv itm_divv_wid">
                    <label className="label">Unit <span className="text-red-600  ">*</span></label>
                    <TextField
                      id="outlined-number"
                      type="number"
                      size="small"
                      error={!!error.weightage}
                      value={weightage}
                      onChange={handlePack}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: error.weightage
                              ? "#d32f2f"
                              : "rgba(0, 0, 0, 0.38)",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: error.weightage
                              ? "#d32f2f"
                              : "var(--color1)",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: error.weightage
                              ? "#d32f2f"
                              : "var(--color1)",
                          },
                        },
                      }}
                    />

                    {error.weightage && (
                      <div style={{ color: "red", fontSize: "12px", marginTop: "4px", textAlign: "justify", }}>
                        {error.weightage}
                      </div>
                    )}
                  </div>
                  <div className="fields Unit_divvv itm_divv_wid">
                    <label className="label">Pack</label>
                    <TextField
                      id="outlined-number"
                      disabled
                      // style={{ width: "160px" }}
                      size="small"
                      value={pack}
                      onChange={(e) => {
                        setPack(e.target.value);
                      }}
                    />
                    {/* {error.pack && <span style={{ color: 'red', fontSize: '14px' }}>{error.pack}</span>} */}
                  </div>
                </div>
                <div className="row item_fld_rw gap-3 md:pt-2">
                  <div className="fields" style={{ width: "100%", flexDirection: "column" }}>
                    <div
                      style={{ display: "flex", gap: "10px", cursor: "pointer" }}
                    >
                      <label className="label">Drug Group <span className="text-red-600  ">*</span></label>
                      <FaPlusCircle
                        className="mt-1.5 cursor-pointer"
                        onClick={() => setOpenDrugGroup(true)}
                      />
                    </div>
                    <FormControl fullWidth>
                      <Autocomplete
                        disablePortal
                        options={drugGroupList}
                        size="small"
                        value={drugGroup}
                        style={{ width: "100%" }}
                        // onChange={(e, value) => setDrugGroup(value)}

                        onChange={(e, value) => {
                          setDrugGroup(value);

                          setError((prev) => ({
                            ...prev,
                            drugGroup: "",
                          }));
                        }}
                        onInputChange={(e, newInputValue) => {
                          setDrugGroupSearch(newInputValue);
                          if (newInputValue.trim() !== "") {
                            handleDrugGroupSearch(newInputValue);
                          }
                        }}
                        onOpen={() => {
                          handleDrugGroupSearch("");
                        }}
                        getOptionLabel={(option) => option ? (option.name || "") : ""}
                        renderInput={(params) => (
                          <TextField {...params} placeholder="Search Drug Group" />
                        )}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: error.drugGroup
                                ? "#d32f2f"
                                : "rgba(0, 0, 0, 0.38)",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: error.drugGroup
                                ? "#d32f2f"
                                : "var(--color1)",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: error.drugGroup
                                ? "#d32f2f"
                                : "var(--color1)",
                            },
                          },
                        }}
                      />
                      {error.drugGroup && (
                        <div style={{ color: "red", fontSize: "12px", marginTop: "4px", textAlign: "justify", }}>
                          {error.drugGroup}
                        </div>
                      )}
                    </FormControl>
                  </div>
                </div>

                <div className="row item_fld_rw gap-3 md:pt-2">
                  <div className="fields four_divv" style={{ width: "100%" }}>
                    <label className="label">Packaging In</label>
                    <Select
                      labelId="dropdown-label"
                      id="dropdown"
                      value={packaging || ""}
                      // sx={{ minWidth: "250px" }}
                      onChange={handlePackagingChange}
                      size="small"
                      displayEmpty
                      renderValue={(selected) => {
                        if (selected === "") {
                          return <span style={{ color: "rgba(0, 0, 0, 0.38)" }}>Select Packaging</span>;
                        }
                        const selectedOption = packList.find((option) => option.id == selected);
                        return selectedOption ? selectedOption.packging_name : "";
                      }}
                      sx={{
                        ".MuiSelect-select": {
                          color: packaging ? "inherit" : "rgba(0, 0, 0, 0.38)",
                          padding: "8.5px 6px !important",
                        },
                      }}
                    >
                      {packList.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.packging_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>
                </div>
              </div>


              <div className="bg-white rounded-lg items-center mt-4 mb-5 p-4 item_inner_box" style={{
                border: '1px solid #628a2f73',
                boxShadow: 'rgb(184 202 161 / 7%) 11px 12px 20px',
                width: "50%",
                height: '100%'

              }}>
                <div className="row gap-3 item_fld_rw">
                  <div className="fields Unit_divvv itm_divv_wid" style={{ width: "50%" }}>
                    <div
                      style={{ display: "flex", gap: "10px", cursor: "pointer" }}
                    >
                      <label className="label">Company <span className="text-red-600  ">*</span></label>
                      <FaPlusCircle
                        className="mt-1.5 cursor-pointer"
                        onClick={() => setOpenCompany(true)}
                      />
                    </div>
                    {/* <label className="label"></label> */}
                    <Box>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={companyList}
                        size="small"
                        value={selectedCompany}
                        // onChange={(e, value) => setSelectedCompany(value)}
                        onChange={(e, value) => {
                          setSelectedCompany(value);

                          setError((prev) => ({
                            ...prev,
                            selectedCompany: "",
                          }));
                        }}
                        error={!!error.selectedCompany}
                        getOptionLabel={(option) => option.company_name}
                        renderInput={(params) => (
                          <TextField {...params} placeholder="Select Company" />
                        )}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: error.selectedCompany
                                ? "#d32f2f"
                                : "rgba(0, 0, 0, 0.38)",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: error.selectedCompany
                                ? "#d32f2f"
                                : "var(--color1)",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: error.selectedCompany
                                ? "#d32f2f"
                                : "var(--color1)",
                            },
                          },
                        }}
                      />

                      {error.selectedCompany && (
                        <div style={{ color: "red", fontSize: "12px", marginTop: "4px", textAlign: "justify", }}>
                          {error.selectedCompany}
                        </div>
                      )}
                      {/* {error.selectedCompany && <span style={{ color: 'red', fontSize: '14px' }}>{error.selectedCompany}</span>} */}
                    </Box>
                  </div>

                  <div className="fields secrw_divvv itm_divv_wid" style={{ width: "50%" }}>
                    <div
                      style={{ display: "flex", gap: "10px", cursor: "pointer" }}
                    >
                      <label className="label">Suppliers </label>
                      <FaPlusCircle
                        className="mt-1.5 cursor-pointer"
                        onClick={() => setOpenDistributor(true)}
                      />
                    </div>
                    {/* <label className="label"></label> */}
                    {/* <Box sx={{ minWidth: 350 }}> */}
                    <Box >
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={suppliersList}
                        value={selectedSuppliers}
                        size="small"
                        // sx={{ width: 350 }}
                        onChange={(e, value) => setSelectedSuppliers(value)}
                        getOptionLabel={(option) => {
                          if (!option) return "";
                          return (option.name || option.distributor_name || "").toUpperCase();
                        }}
                        renderInput={(params) => (
                          <TextField {...params} placeholder="Select Suppliers" />
                        )}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "rgba(0, 0, 0, 0.38) "
                            },
                            "&:hover fieldset": {
                              borderColor: "var(--color1)", // Hover border color
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "var(--color1)", // Focused border color
                            },
                          },
                        }}
                      />
                      {error.selectedSuppliers && (
                        <span style={{ color: "var(--color6)", fontSize: "14px" }}>
                          {error.selectedSuppliers}
                        </span>
                      )}
                    </Box>
                  </div>
                </div>
                <div className="row item_fld_rw gap-3 md:pt-2">

                  <div className="fields secrw_divvv itm_divv_wid" style={{ width: "50%" }}>
                    <label className="label">GST%</label>
                    <Select
                      labelId="dropdown-label"
                      id="dropdown"
                      value={gst || ""}
                      onChange={(e) => {
                        setGST(e.target.value);
                      }}
                      size="small"
                      displayEmpty
                      renderValue={(selected) => {
                        if (selected === "") {
                          return <span style={{ color: "rgba(0, 0, 0, 0.38)" }}>Select GST%</span>;
                        }
                        const selectedOption = gstList.find((option) => option.id == selected);
                        return selectedOption ? selectedOption.name : "";
                      }}
                      sx={{
                        ".MuiSelect-select": {
                          color: gst ? "inherit" : "rgba(0, 0, 0, 0.38)",
                          padding: "8.5px 6px !important",
                        },
                      }}
                    >
                      {gstList.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>

                  {/* <div className="row border-b pb-6 " style={{ borderColor: "var(--color2)" }}> */}
                  <div className="fields secrw_divvv itm_divv_wid" style={{ width: "50%" }}>
                    <label className="label">MRP</label>
                    <TextField
                      required
                      id="outlined-number"
                      placeholder="Enter MRP"
                      // style={{ width: "350px" }}
                      size="small"
                      type="number"
                      value={MRP}
                      onChange={(e) => {
                        setMRP(e.target.value);
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(0, 0, 0, 0.38) "
                          },
                          "&:hover fieldset": {
                            borderColor: "var(--color1)", // Hover border color
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "var(--color1)", // Focused border color
                          },
                        },
                      }}
                    />
                  </div>
                </div>
                <div className="row item_fld_rw gap-3 md:pt-2">

                  <div className="fields secrw_divvv itm_divv_wid" style={{ width: "50%" }}>
                    <label className="label">Location</label>
                    {/* <TextField
                  id="outlined-number"
                  label="Location"
                  style={{ width: '350px' }}
                  size="small"
                  value={location.toUpperCase()}
                  onChange={(e) => { setLocation(e.target.value) }}
                /> */}

                    <Autocomplete
                      value={locationvalue}
                      inputValue={location}
                      size="small"
                      onChange={handleLocationOptionChange}
                      onInputChange={handleLocationInputChange}
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
                          {...params}
                          placeholder="Select Location"
                          InputProps={{
                            ...params.InputProps,
                          }}
                          inputProps={{
                            ...params.inputProps,
                            style: { textTransform: "capitalize" }, // ✅ Apply directly to input
                          }}
                        />
                      )}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(0, 0, 0, 0.38)"
                          },
                          "&:hover fieldset": {
                            borderColor: "var(--color1)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "var(--color1)",
                          },
                        },
                      }}
                    // freeSolo
                    />


                  </div>

                  <div className="fields secrw_divvv itm_divv_wid" style={{ width: "50%" }}>
                    <label className="label">Barcode</label>
                    <TextField
                      required
                      id="outlined-number"
                      placeholder="Enter Barcode"
                      // style={{ width: "350px" }}
                      size="small"
                      type="number"
                      value={barcode}
                      onChange={(e) => {
                        setBarcode(e.target.value);
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(0, 0, 0, 0.38) "
                          },
                          "&:hover fieldset": {
                            borderColor: "var(--color1)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "var(--color1)",
                          },
                        },
                      }}
                    />
                  </div>
                </div>


                <div className="row item_fld_rw gap-3 md:pt-2">
                  <div className="fields four_divv itm_divv_wid" style={{ width: "50%" }}>
                    <label className="label">HSN code</label>
                    <TextField
                      id="outlined-number"
                      placeholder="Enter HSN Code"
                      type="number"
                      // style={{ width: "232px" }}
                      size="small"
                      value={hsn_code}
                      onChange={(e) => {
                        sethsnCode(e.target.value);
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(0, 0, 0, 0.38) "
                          },
                          "&:hover fieldset": {
                            borderColor: "var(--color1)", // Hover border color
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "var(--color1)", // Focused border color
                          },
                        },
                      }}
                    />
                  </div>

                  <div className="fields four_divv itm_divv_wid" style={{ width: "50%" }}>
                    <div
                      style={{ display: "flex", gap: "10px", cursor: "pointer" }}
                    >
                      <label className="label">Category </label>
                      {/* <FaPlusCircle className='mt-1.5' onClick={() => setOpen(true)} /> */}
                    </div>
                    <Box>
                      <FormControl fullWidth>
                        <Autocomplete
                          disablePortal
                          id="combo-box-demo"
                          options={categoryList}
                          size="small"
                          value={selectedCategory}
                          // sx={{ width: 350 }}
                          onChange={(e, value) => setSelectedCategory(value)}
                          getOptionLabel={(option) => option.category_name}
                          renderInput={(params) => (
                            <TextField {...params} placeholder="Select Category " />
                          )}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "rgba(0, 0, 0, 0.38) "
                              },
                              "&:hover fieldset": {
                                borderColor: "var(--color1)", // Hover border color
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "var(--color1)", // Focused border color
                              },
                            },
                          }}
                        />
                      </FormControl>
                    </Box>
                  </div>
                </div>

              </div>
            </div>
            <div className="row border-b border-dashed " style={{ borderColor: "var(--color2)" }}></div>
            <div >
              <div className="row pb-2"></div>
              <div>
                <h1 className="product" style={{ color: "var(--color1)", textAlign: "center" }}>
                  Product Images
                </h1>
              </div>
              <div className="row border-b border-dashed pt-2" style={{ borderColor: "var(--color2)" }}></div>
              <div className="row justify-center product_img_divv mt-4 gap-4 ">
                <div className="upload_bx1 w-full">
                  <div className="uploadBox">
                    <h1 className="text-gray-600 font-semibold text-lg md:text-xl">
                      Front Photo
                    </h1>
                  </div>
                  <div className="upload w-full">
                    <input
                      accept="image/*"
                      style={{ display: "none" }}
                      id="front-photo-file"
                      type="file"
                      onChange={handleFrontPhoto}
                    />
                    {selectedFrontFile == null || selectedFrontFile === "null" || selectedFrontFile === "undefined" || selectedFrontFile === "" || !frontImgUrl || frontImgUrl === "null" || frontImgUrl.endsWith("/null") || frontImgUrl.endsWith("/undefined") ? (
                      <div className="UploadClass mt-4" style={{ justifyContent: "flex-end" }}>
                        <img src="./tablet_2.png" width="40%" height="40%" style={{
                          marginTop: "18px",
                          height: "200px",
                          width: "250px",
                          objectFit: "contain",
                        }} />
                        <span>Drop your image here</span>
                      </div>
                    ) : (
                      <img
                        src={frontImgUrl}
                        alt="Uploaded"
                        className="rounded-md"
                        style={{
                          marginTop: "18px",
                          height: "200px",
                          width: "250px",
                          objectFit: "contain",
                        }}
                      />
                    )}
                    <label
                      htmlFor="front-photo-file"
                      style={{ margin: "0px 0 16px" }}
                    >
                      <Button
                        variant="contained"
                        component="span"
                        style={{ padding: "7px", background: "var(--color1)" }}
                      >
                        Choose Photo
                      </Button>
                    </label>
                  </div>
                  {error.selectedFrontFile && (
                    <span style={{ color: "var(--color6)", fontSize: "14px" }}>
                      {error.selectedFrontFile}
                    </span>
                  )}
                </div>
                <div className="upload_bx2 w-full">
                  <div className="uploadBox">
                    <h1 className="text-gray-600 font-semibold text-lg md:text-xl">
                      Backside Photo
                    </h1>
                  </div>
                  <div className="upload w-full">
                    <input
                      accept="image/*"
                      style={{ display: "none" }}
                      id="back-button-file"
                      type="file"
                      onChange={handleBackPhoto}
                    />
                    {selectedBackFile == null || selectedBackFile === "null" || selectedBackFile === "undefined" || selectedBackFile === "" || !backImgUrl || backImgUrl === "null" || backImgUrl.endsWith("/null") || backImgUrl.endsWith("/undefined") ? (
                      <div className="UploadClass mt-4" style={{ justifyContent: "flex-end" }}>
                        <img src="./tablet_2.png" alt="tablet" width="40%" height="40%" style={{
                          marginTop: "18px",
                          height: "200px",
                          width: "250px",
                          objectFit: "contain",
                        }} />
                        <span>Drop your image here</span>
                      </div>
                    ) : (
                      <img
                        src={backImgUrl}
                        alt="Uploaded"
                        className="rounded-md"
                        style={{
                          marginTop: "18px",
                          height: "200px",
                          width: "250px",
                          objectFit: "contain",
                        }}
                      />
                    )}
                    <label
                      htmlFor="back-button-file"
                      style={{ margin: "0px 0 16px" }}
                    >
                      <Button
                        variant="contained"
                        component="span"
                        style={{ padding: "7px", background: "var(--color1)" }}
                      >
                        Choose Photo
                      </Button>
                    </label>
                  </div>
                  {error.selectedBackFile && (
                    <span style={{ color: "var(--color6)", fontSize: "14px" }}>
                      {error.selectedBackFile}
                    </span>
                  )}
                </div>
                <div className="upload_bx3 w-full">
                  <div className="uploadBox">
                    <h1 className="text-gray-600 font-semibold text-lg md:text-xl">
                      MRP Photo
                    </h1>
                  </div>
                  <div className="upload w-full">
                    <input
                      accept="image/*"
                      style={{ display: "none" }}
                      id="mrp-photo-file"
                      type="file"
                      onChange={handleMRPPhoto}
                    />
                    {selectedMRPFile == null || selectedMRPFile === "null" || selectedMRPFile === "undefined" || selectedMRPFile === "" || !mrpImgUrl || mrpImgUrl === "null" || mrpImgUrl.endsWith("/null") || mrpImgUrl.endsWith("/undefined") ? (
                      <div className="UploadClass mt-4" style={{ justifyContent: "flex-end" }}>
                        <img src="./tablet_2.png" alt="tablet" width="40%" height="40%" style={{
                          marginTop: "18px",
                          height: "200px",
                          width: "250px",
                          objectFit: "contain",
                        }} />
                        <span>Drop your image here</span>
                      </div>
                    ) : (
                      <img
                        src={mrpImgUrl}
                        alt="Uploaded"
                        className="rounded-md"
                        style={{
                          marginTop: "18px",
                          height: "200px",
                          width: "250px",
                          objectFit: "contain",
                        }}
                      />
                    )}
                    <label htmlFor="mrp-photo-file" style={{ margin: "0px 0 16px" }}>
                      <Button
                        variant="contained"
                        component="span"
                        style={{ padding: "7px", background: "var(--color1)" }}
                      >
                        Choose Photo
                      </Button>
                    </label>
                  </div>
                  {error.selectedMRPFile && (
                    <span style={{ color: "var(--color6)", fontSize: "14px" }}>
                      {error.selectedMRPFile}
                    </span>
                  )}
                </div>
              </div>

            </div>

            <div className="row item_add_box_1">
              <div className="w-full pt-4">
                <label className="label block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <TextField
                  id="outlined-multiline-static"
                  placeholder="Message"
                  multiline
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                  }}
                  className="w-full"
                  rows={4}
                  variant="outlined"
                  inputProps={{
                    style: { textTransform: "capitalize" }, // ✅ applies to textarea
                  }}
                />


              </div>
            </div>

            <div className="item_add_box_1" style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                style={{ margin: "10px", marginLeft: "0px", background: "var(--color1)" }}
                onClick={handleSubmit}
              >Submit</Button>

              <Button variant="contained" style={{ margin: "10px 0 10px 0", background: "var(--color6)" }} onClick={resetData}>
                Cancel
              </Button>
            </div>
          </div>
        </div >
      )
      }
      {/* Category Dialog Box */}
      <Dialog id="modal" className="custom-dialog" open={open} onClose={handleClose}>
        <DialogTitle>Create Catagory</DialogTitle>
        <DialogContent>
          <div className="dialog pt-4">
            <label className="mb-2">Catagory Name</label>
            <TextField
              id="outlined-number"
              placeholder="Enter Catagory Name"
              type="text"
              size="small"
              style={{ width: "400px" }}
              value={categoryName}
              onChange={(e) => {
                setCategoryName(e.target.value);
              }}
              required
            />
          </div>
        </DialogContent>
        <DialogActions>
          <div className="pb-3 flex gap-2">
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              type="submit"
              onClick={submitCategory}
              variant="contained"
              disabled={!categoryName}
              style={{ background: "var(--color1)" }}
            >
              Submit
            </Button>
          </div>
        </DialogActions>
      </Dialog>
      {/* DrugGroup dialog Box */}
      <Dialog id="modal" className="custom-dialog form-dialog add-company-dialog" open={openDrugGroup} onClose={handleCloseDrugGroup}>
        <DialogTitle id="alert-dialog-title" className="primary">
          Add Drug Group
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseDrugGroup}
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
          <div className="dialog pt-4">
            <label className="mb-2">Drug Group Name</label>

            <TextField
              id="outlined-number"
              placeholder="Enter DrugGroup Name"
              type="text"
              size="small"
              style={{ width: "100%" }}
              value={drugGroupName}
              onChange={(e) => {
                const value = e.target.value;
                const capitalized = value.charAt(0).toUpperCase() + value.slice(1);

                setDrugGroupName(capitalized);

              }}


              required

              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  submitDrugGroup();
                }
              }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <div className="row" style={{
            justifyContent: "flex-end",
          }}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#3f6212",
                "&:hover": { backgroundColor: "#3f6212" },
              }}
              onClick={submitDrugGroup}
              disabled={!drugGroupName}
            >
              Submit
            </Button>
          </div>

        </DialogActions>
      </Dialog>
      {/* Company Dialog Box */}
      <Dialog
        id="modal"
        className="custom-dialog add-company-dialog "
        open={openCompany}
        onClose={handleClose}
      >
        <DialogTitle id="alert-dialog-title" className="primary">
          Add Company
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseCompany}
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
          <div className="dialog pt-4">
            <label className="mb-2">Company Name</label>
            <TextField
              id="outlined-number"
              placeholder="Enter Company Name"
              type="text"
              size="small"
              style={{ width: "100%" }}
              value={companyName}
              onChange={(e) => {
                const value = e.target.value;
                const capitalized =
                  value.charAt(0).toUpperCase() + value.slice(1);
                setCompanyName(capitalized);
              }}

              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  submitCompany();
                }
              }}
              required
            />
          </div>
        </DialogContent>
        <DialogActions style={{ padding: "20px 24px" }}>
          <div className="row" style={{
            justifyContent: "flex-end",
          }}>
            <Button
              sx={{
                backgroundColor: "#3f6212",
                "&:hover": { backgroundColor: "#3f6212" },
              }}
              type="submit"
              onClick={submitCompany}
              variant="contained"
              disabled={!companyName}
            >
              Submit
            </Button>
          </div>
        </DialogActions>
      </Dialog>      {/* Distributor Dialog Box */}
      <Dialog
        id="modal"
        className="custom-dialog add-distributor-dialog modal_991"
        open={openDistributor}
        onClose={() => {
          setOpenDistributor(false);
          setDistributorAddress("");
          setDistributorMobileNo("");
          setDistributorName("");
          setDistributorGSTNumber("");
          setSelectedDistributorId("");
        }}
      >
        <DialogTitle id="alert-dialog-title" className="primary">
          Add Distributor
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => {
            setOpenDistributor(false);
            setDistributorAddress("");
            setDistributorMobileNo("");
            setDistributorName("");
            setDistributorGSTNumber("");
            setSelectedDistributorId("");
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

                {/* Row 1: Distributor Name */}
                <div className="row gap-5">
                  <div className="fields add_new_item_divv" style={{ width: "100%" }}>
                    <label className="label secondary">Distributor Name<span className="text-red-600">*</span></label>
                    <Autocomplete
                      freeSolo
                      options={Array.from(new Set(suppliersList.map(d => (d.name || d.distributor_name || "").toUpperCase().trim()).filter(Boolean)))}
                      value={distributorName}
                      onInputChange={(e, newValue) => {
                        const uppercased = newValue.toUpperCase();
                        setDistributorName(uppercased);
                        const found = suppliersList.find(d =>
                          (d.name || d.distributor_name || "").toUpperCase().trim() === uppercased.trim()
                        );
                        if (found) {
                          setSelectedDistributorId(found.id || "");
                          setDistributorMobileNo(found.phone_number || found.mobile_no || "");
                          setDistributorGSTNumber((found.gst || found.gst_number || "").toUpperCase().trim());
                          setDistributorAddress(found.address || found.area || "");
                        } else {
                          setSelectedDistributorId("");
                          if (!newValue) {
                            setDistributorMobileNo("");
                            setDistributorGSTNumber("");
                            setDistributorAddress("");
                          }
                        }
                      }}
                      onChange={(e, selectedValue) => {
                        if (selectedValue) {
                          const valString = String(selectedValue).toUpperCase().trim();
                          const found = suppliersList.find(d =>
                            (d.name || d.distributor_name || "").toUpperCase().trim() === valString
                          );
                          if (found) {
                            setSelectedDistributorId(found.id || "");
                            setDistributorName((found.name || found.distributor_name || "").toUpperCase().trim());
                            setDistributorMobileNo(found.phone_number || found.mobile_no || "");
                            setDistributorGSTNumber((found.gst || found.gst_number || "").toUpperCase().trim());
                            setDistributorAddress(found.address || found.area || "");
                          }
                        } else {
                          setSelectedDistributorId("");
                          setDistributorName("");
                          setDistributorMobileNo("");
                          setDistributorGSTNumber("");
                          setDistributorAddress("");
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Enter Distributor Name"
                          size="small"
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

                {/* Row 2: Mobile Number & GST */}
                <div className="row gap-5" style={{ display: "flex", gap: "20px", marginTop: "15px" }}>
                  <div className="fields add_new_item_divv" style={{ width: "50%" }}>
                    <label className="label secondary">Mobile Number<span className="text-red-600">*</span></label>
                    <Autocomplete
                      freeSolo
                      options={Array.from(new Set(suppliersList.map(d => (d.phone_number || d.mobile_no || "").toUpperCase()).filter(Boolean)))}
                      value={distributorMobileNo}
                      onInputChange={(e, newValue) => {
                        const numericValue = newValue.replace(/[^0-9]/g, "").slice(0, 10);
                        setDistributorMobileNo(numericValue);
                        setSelectedDistributorId("");
                      }}
                      onChange={(e, selectedValue) => {
                        if (selectedValue) {
                          const found = suppliersList.find(d =>
                            (d.phone_number || d.mobile_no || "").toUpperCase() === selectedValue.toUpperCase()
                          );
                          if (found) {
                            setSelectedDistributorId(found.id || "");
                            setDistributorName((found.name || found.distributor_name || "").toUpperCase());
                            setDistributorMobileNo(found.phone_number || found.mobile_no || "");
                            setDistributorGSTNumber((found.gst || found.gst_number || "").toUpperCase());
                            setDistributorAddress(found.address || found.area || "");
                          }
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Enter 10-digit Mobile Number"
                          size="small"
                          inputProps={{
                            ...params.inputProps,
                            autoComplete: "off",
                            inputMode: "numeric",
                            maxLength: 10,
                          }}
                        />
                      )}
                    />
                  </div>
                  <div className="fields add_new_item_divv" style={{ width: "50%" }}>
                    <label className="label secondary">Distributor GSTIN Number<span className="text-red-600">*</span></label>
                    <Autocomplete
                      freeSolo
                      options={Array.from(new Set(suppliersList.map(d => (d.gst || d.gst_number || "").toUpperCase()).filter(Boolean)))}
                      value={distributorGSTNumber}
                      onInputChange={(e, newValue) => {
                        setDistributorGSTNumber(newValue.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 15));
                        setSelectedDistributorId("");
                      }}
                      onChange={(e, selectedValue) => {
                        if (selectedValue) {
                          const found = suppliersList.find(d =>
                            (d.gst || d.gst_number || "").toUpperCase() === selectedValue.toUpperCase()
                          );
                          if (found) {
                            setSelectedDistributorId(found.id || "");
                            setDistributorName((found.name || found.distributor_name || "").toUpperCase());
                            setDistributorMobileNo(found.phone_number || found.mobile_no || "");
                            setDistributorGSTNumber((found.gst || found.gst_number || "").toUpperCase());
                            setDistributorAddress(found.address || found.area || "");
                          }
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Enter 15-digit GSTIN"
                          size="small"
                          inputProps={{
                            ...params.inputProps,
                            style: { textTransform: "uppercase" },
                            autoComplete: "off",
                            maxLength: 15,
                          }}
                        />
                      )}
                    />
                  </div>
                </div>

                {/* Row 3: Address */}
                <div className="row gap-5" style={{ marginTop: "15px" }}>
                  <div className="fields add_new_item_divv" style={{ width: "100%" }}>
                    <label className="label secondary">Address</label>
                    <TextField
                      placeholder="Enter Address"
                      autoComplete="off"
                      size="small"
                      value={distributorAddress}
                      onChange={(e) => setDistributorAddress(e.target.value)}
                    />
                  </div>
                </div>

                {/* Add Button */}
                <div className="row" style={{
                  justifyContent: "flex-end",
                  paddingRight: "4px",
                  paddingTop: "8%",
                  display: "flex",
                }}>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#3f6212",
                      "&:hover": { backgroundColor: "#3f6212" },
                    }}
                    onClick={submitDistributor}
                    disabled={!distributorName || !distributorMobileNo || !distributorGSTNumber}
                  >
                    Add Distributor
                  </Button>
                </div>

              </div>
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>

      {/*Bulk Item Data Added  */}
      <Dialog open={openFile} className="custom-dialog">
        <DialogTitle className="primary">Import Item</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleFileClose}
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
            <div className="primary">Item File Upload <span className="text-red-600  ">*</span></div>
            <div
              style={{ display: "flex", gap: "15px", flexDirection: "column" }}
            >
              <div>
                <input
                  className="File-upload"
                  type="file"
                  accept=".csv"
                  id="file-upload"
                  onChange={handleFileChange}
                />
                <span className="errorFile">*select only .csv File.</span>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button onClick={handleDownload} style={{ backgroundColor: "var(--COLOR_UI_PHARMACY)", color: "white" }}  >
                  <CloudDownloadIcon className="mr-2" />
                  Download Sample File
                </Button>
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            style={{ backgroundColor: "var(--color1)", color: "white" }}

            type="success"
            onClick={handleFileUpload}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

    </div >
  );
};
export default Itemmaster;