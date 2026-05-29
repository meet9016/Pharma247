import Header from "../../../Header";
import Loader from "../../../../componets/loader/Loader";
import React, { useEffect, useState, useRef } from "react";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { BsLightbulbFill } from "react-icons/bs";
import {
  Alert,
  AlertTitle,
  Autocomplete,
  Button,
  InputAdornment,
  ListItem,
  OutlinedInput,
  TextField,
} from "@mui/material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import axios from "axios";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import AddIcon from "@mui/icons-material/Add";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast, ToastContainer } from "react-toastify";
import usePermissions, {
  hasPermission,
} from "../../../../componets/permission";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

const DoctorList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [openAddPopUp, setOpenAddPopUp] = useState(false);
  const [doctor, setDoctor] = useState(null);
  const [mobileNo, setMobileNo] = useState("");
  const [licence, setLicence] = useState("");
  const [clinic, setClinic] = useState();
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [emailId, setEmailId] = useState("");
  const [defaultDr, setDefaultDr] = useState("");
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  const history = useHistory();
  const rowsPerPage = 10;
  const permissions = usePermissions();

  const token = localStorage.getItem("token");
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [buttonLabel, setButtonLabel] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [header, setHeader] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const excelIcon = process.env.PUBLIC_URL + "/excel.png";

  const columns = [
    { id: "name", label: "Doctor Name", minWidth: 150 },
    { id: "phone_number", label: "Mobile No", minWidth: 150 },
    { id: "email", label: "Email ID", minWidth: 150 },
    { id: "clinic", label: "Clinic Name", minWidth: 150 },
  ];
  const searchKeys = ["name", "phone_number", "email", "clinic_name"];

  const initialSearchTerms = columns.map(() => "");
  const [searchTerms, setSearchTerms] = useState(initialSearchTerms);
  const currentSearchTerms = useRef(searchTerms);

  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * rowsPerPage + 1;
  const [totalRecords, setTotalRecords] = useState(0);
  const totalPages = Math.ceil(totalRecords / rowsPerPage);


  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const handlePrint = () => {
    window.print("/PurchaseReturnAdd");
  };
  const goIntoAdd = () => {
    history.push("/PurchaseReturnAdd");
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (value.length <= 10) {
      setMobileNo(value);
    }
  };

  // Handle search on Enter key press
  const handleSearchSubmit = () => {
    setCurrentPage(1);
    ListOfDoctor(1);
  };

  // Handle search on Enter key press for specific field
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchSubmit();
    }
  };

  const resetAddDialog = () => {
    setDoctor("");
    setMobileNo("");
    setEmailId("");
    setAddress("");
    setLicence("");
    setClinic("");
    setCity("");
    setDefaultDr("");
    setErrors({});
    setOpenAddPopUp(false);
  };

  const handleEditOpen = (row) => {
    setOpenAddPopUp(true);
    setIsEditMode(true);
    setHeader("Edit Doctor");
    setButtonLabel("Update");
    setDoctorId(row.id);
    setDoctor(row.name);
    setEmailId(row.email);
    setMobileNo(row.phone_number);
    setLicence(row.license);
    setClinic(row.clinic);
    setAddress(row.address);
    setDefaultDr(row.default_doctor ? row.default_doctor.toString() : "0");
  };

  const exportToCSV = async () => {
    let data = new FormData();
    setIsLoading(true);
    data.append("page", currentPage);
    data.append("iss_value", "download");
    const params = {
      page: currentPage,
    };
    try {
      await axios
        .post("doctor-list?", data, {
          params: params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const csvData = response.data.data;
          if (csvData) {
            const csvString = convertToCSV(csvData);
            const blob = new Blob([csvString], {
              type: "text/csv;charset=utf-8;",
            });
            saveAs(blob, "doctors.csv");
          }

          setTableData(response.data.data);
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

  const handelAddOpen = () => {
    setOpenAddPopUp(true);
    setHeader("Add Doctor");
    setButtonLabel("Save");
  };

  const AddDoctor = () => {
    if (isEditMode == false) {
      //  Add Doctor
      const newErrors = {};
      if (!doctor) newErrors.Doctor = "Doctor is required";
      if (!mobileNo) {
        newErrors.mobileNo = 'Mobile No is required';
      } else
        if (!/^\d{10}$/.test(mobileNo)) {
          newErrors.mobileNo = 'Mobile number must be 10 digits';
        }
      if (!clinic) newErrors.clinic = 'Clinic is required';

      setErrors(newErrors);
      const isValid = Object.keys(newErrors).length === 0;
      if (isValid) {
        AddDoctorRecord();
      }
      return isValid;
    } else {
      const newErrors = {};
      if (!doctor) newErrors.Doctor = "Doctor is required";
      // if (!mobileNo) {
      //     newErrors.mobileNo = 'Mobile No is required';
      // } else if (!/^\d{10}$/.test(mobileNo)) {
      //     newErrors.mobileNo = 'Mobile number must be 10 digits';
      // }
      // if (!clinic) newErrors.clinic = 'Clinic is required';

      setErrors(newErrors);
      const isValid = Object.keys(newErrors).length === 0;
      if (isValid) {
        EditDoctorRecord();
      }
      return isValid;
    }
  };

  const AddDoctorRecord = async () => {
    let data = new FormData();
    data.append("name", doctor);
    data.append("email", emailId);
    data.append("mobile", mobileNo);
    data.append("license", licence);
    data.append("address", address);
    data.append("clinic", clinic);
    data.append("default_doctor", defaultDr);
    try {
      await axios
        .post("doctor-create", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          ListOfDoctor();
          setOpenAddPopUp(false);
          setDoctor("");
          setEmailId("");
          setMobileNo("");
          setLicence("");
          setClinic("");
          setAddress("");
          setDefaultDr("");
          toast.dismiss();
          toast.success(response.data.message);
        });
    } catch (error) {
      setIsLoading(false);
      if (error.response.data.status == 400) {
        toast.dismiss();
        toast.error(error.response.data.message);
      }
         if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
      // console.error("API error:", error);
    }
  };

  const EditDoctorRecord = async () => {
    let data = new FormData();
    data.append("id", doctorId);
    data.append("name", doctor);
    data.append("email", emailId);
    data.append("mobile", mobileNo);
    data.append("license", licence);
    data.append("address", address);
    data.append("clinic", clinic);
    data.append("default_doctor", defaultDr);

    try {
      await axios
        .post("doctor-update", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          ListOfDoctor();
          setOpenAddPopUp(false);
          setDoctor("");
          setEmailId("");
          setMobileNo("");
          setLicence("");
          setClinic("");
          setAddress("");
          setDefaultDr("");
          setIsEditMode(false);
          toast.dismiss();
          toast.success(response.data.message);
        });
    } catch (error) {
      setIsLoading(false);
      toast.dismiss();
      toast.success(error.message);
         if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
    }
  };

  // const handleOptionChange = (event, newValue) => {
  //     setDoctor(newValue);
  // };
  const handleOptionChange = (event, newValue) => {
    if (newValue && typeof newValue === "object") {
      setDoctor(newValue.name);
    } else {
      setDoctor(newValue);
    }
  };
  const handleInputChange = (event, newInputValue) => {
    setDoctor(newInputValue);
  };
  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleClick = (pageNum) => {
    setCurrentPage(pageNum);
  };


  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileType = selectedFile.type;
      if (
        fileType === "application/vnd.ms-excel" ||
        fileType ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        fileType === "text/csv"
      ) {
        setFile(selectedFile);
      } else {
      }
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/Doctor_Sample_Data.csv";
    link.download = "Doctor_Sample_Data.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openFilePopUP = () => {
    setOpenUpload(true);
  };


  const sortByColumn = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });

    const sortedData = [...tableData].sort((a, b) => {
      if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
      if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
      return 0;
    });
    setTableData(sortedData);
  };

  // Update search term and trigger search API instantly (debounced recommended)
  const handleSearchChange = (index, value) => {
    const newSearchTerms = [...searchTerms];
    newSearchTerms[index] = value;
    setSearchTerms(newSearchTerms);
    currentSearchTerms.current = newSearchTerms;
    setCurrentPage(1);        // reset to first page when search changes
    ListOfDoctor(1, newSearchTerms); // pass the new search terms
  };


  useEffect(() => {
    ListOfDoctor(currentPage, searchTerms);
  }, [currentPage]);


  const convertToCSV = (data) => {
    const array = [Object.keys(data[0])].concat(data);

    return array
      .map((it) => {
        return Object.values(it).toString();
      })
      .join("\n");
  };

  const ListOfDoctor = async (currentPage = 1, searchValues = searchTerms) => {
    let data = new FormData();
    setIsSearchLoading(true);

    data.append("page", currentPage);
    // Use searchValues instead of ref
    searchValues.forEach((term, index) => {
      if (term && term.trim()) {
        data.append(searchKeys[index], term.trim());
      }
    });

    const params = {
      page: currentPage,
    };
    try {
      await axios
        .post("doctor-list?", data, {
          params: params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setTableData(response.data.data);
          setTotalRecords(response.data.total_records); // <-- Like in DistributerList

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
      setIsSearchLoading(false);

    }
  };

  const uploadDoctorFile = async () => {
    let data = new FormData();
    data.append("file", file);
    try {
      await axios
        .post("doctor-import", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          ListOfDoctor();
          setOpenUpload(false);
          toast.dismiss();
          toast.success(response.data.message);
        });
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.dismiss();
        toast.error("Please Select file");
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
      {isLoading ? (
        <div className="loader-container ">
          <Loader />
        </div>
      ) : (
        <div
          style={{
            minHeight: 'calc(100vh - 64px)',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
          }}
        >
          <div style={{ flex: 1, overflowY: 'auto', width: '100%' }}>
            <div className="paddin12-8">
              <div className="px-4 py-3">
                <div
                  className="cust_list_main_hdr_bg"
                  style={{ display: "flex", gap: "4px", marginBottom: "13px" }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "7px",
                      alignItems: "center",
                      whiteSpace: "nowrap",
                    }}
                    className=""
                  >
                    <span
                      style={{
                        color: "var(--color1)",
                        display: "flex",
                        alignItems: "center",
                        fontWeight: 700,
                        fontSize: "20px",
                        marginRight: "10px",
                        whiteSpace: "none"
                      }}
                    >
                      Doctor List
                    </span>
                    <BsLightbulbFill className="w-6 h-6 secondary hover-yellow align-center" />
                  </div>
                  <div className="headerList cust_hdr_mn_bg mt-2">
                    {hasPermission(permissions, "doctor import") && (
                      <Button
                        variant="contained"
                        className="gap-2"
                        style={{ background: "var(--color1)", display: "flex" }}
                        onClick={openFilePopUP}
                      >
                        <CloudUploadIcon /> Import
                      </Button>
                    )}
                    {hasPermission(permissions, "doctor create") && (
                      <Button
                        variant="contained"
                        className="gap-2"
                        style={{ background: "var(--color1)", display: "flex" }}
                        onClick={handelAddOpen}
                      >
                        <AddIcon /> Add Doctor
                      </Button>
                    )}
                    {hasPermission(permissions, "doctor download") && (
                      <Button
                        variant="contained"
                        className="gap-7"
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
                    )}
                  </div>
                </div>

                <div
                  className="row border-b border-dashed"
                  style={{ borderColor: "var(--color2)" }}
                ></div>
              </div>
              {/*<====================================================================== table  =====================================================================> */}

              <div className="firstrow px-4 ">
                <div className="overflow-x-auto">
                  <table
                    className="w-full border-collapse custom-table"
                    style={{
                      whiteSpace: "nowrap",
                      borderCollapse: "separate",
                      borderSpacing: "0 6px",
                    }}
                  >
                    <thead className="">
                      <tr>
                        <th style={{ minWidth: 150, padding: '8px' }}>SR. No</th>
                        {columns.map((column, index) => (
                          <th
                            key={column.id}
                            style={{ minWidth: column.minWidth, padding: '8px' }}
                          >
                            <div className="headerStyle" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                              <span >{column.label}</span>

                              <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>

                                <SwapVertIcon
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => sortByColumn(column.id)}
                                />
                                <TextField
                                  autoComplete="off"
                                  label="Type Here"
                                  id="filled-basic"
                                  size="small"
                                  sx={{ flex: 1, marginLeft: '4px', minWidth: '100px', maxWidth: '250px' }}
                                  value={searchTerms[index]}
                                  onChange={(e) => handleSearchChange(index, e.target.value)}
                                  InputProps={{
                                    endAdornment: searchTerms[index] && (
                                      <IconButton
                                        size="small"
                                        onClick={() => handleSearchChange(index, '')}
                                        sx={{ padding: 0 }}
                                      >
                                        <CloseIcon fontSize="small" />
                                      </IconButton>
                                    ),
                                  }}
                                />

                              </div>
                            </div>

                          </th>
                        ))}
                        <th>Action</th>
                      </tr>
                    </thead>
                    {isSearchLoading ? (
                      <div className="loader-container ">
                        <Loader />
                      </div>
                    ) : (
                      <tbody style={{ backgroundColor: "#3f621217" }}>
                        {tableData.length === 0 ? (
                          <tr>
                            <td
                              colSpan={columns.length + 2}
                              style={{
                                textAlign: "center",
                                color: "gray",
                                borderRadius: "10px 10px 10px 10px",
                              }}
                            >
                              No data found
                            </td>
                          </tr>
                        ) : (
                          tableData.map((row, index) => {
                            return (
                              <tr
                                hover
                                role="checkbox"
                                tabIndex={-1}
                                key={row.code}
                              >
                                <td style={{ borderRadius: "10px 0 0 10px" }}>
                                  {startIndex + index}
                                </td>
                                {columns.map((column) => {
                                  let value = row[column.id];
                                  if (column.id === "email") {
                                    if (
                                      value &&
                                      value[0] !== value[0].toLowerCase()
                                    ) {
                                      value = value.toLowerCase();
                                    }
                                  }

                                  if (column.id === "name") {
                                    return (
                                      <td
                                        key={column.id}
                                        align={column.align}
                                        onClick={() => history.push(`/doctor/${row.id}`)}
                                      >
                                        <div className="flex items-center gap-2">
                                          <span>{value}</span>
                                          {row.default_doctor === "1" && (
                                            <span className="cursor-pointer text-xs text-white bg-[var(--color2)] px-2 py-1 rounded-2xl">
                                              default
                                            </span>
                                          )}
                                        </div>
                                      </td>
                                    );
                                  }


                                  return (
                                    <td
                                      key={column.id}
                                      align={column.align}
                                      onClick={() => {
                                        history.push(`/doctor/${row.id}`);
                                      }}
                                      style={
                                        column.id === "email"
                                          ? { textTransform: "none" }
                                          : {}
                                      }
                                    >
                                      {column.format && typeof value === "number"
                                        ? column.format(value)
                                        : value}
                                    </td>
                                  );
                                })}
                                <td style={{ borderRadius: "0 10px 10px 0" }}>
                                  <div
                                    style={{
                                      fontSize: "15px",
                                      display: "flex",
                                      gap: "5px",
                                      color: "gray",
                                      cursor: "pointer",
                                    }}
                                  >
                                    <VisibilityIcon
                                      style={{ color: "var(--color1)" }}
                                      onClick={() => {
                                        history.push(`/doctor/${row.id}`);
                                      }}
                                    />
                                    {hasPermission(permissions, "doctor edit") && (
                                      <BorderColorIcon
                                        style={{ color: "var(--color1)" }}
                                        onClick={() => handleEditOpen(row)}
                                      />
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    )}
                  </table>
                </div>
              </div>
            </div>
          </div>
          {/*<====================================================================== pagination  =====================================================================> */}

          <div
            className="flex justify-center mt-4"
            style={{
              marginTop: 'auto',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '1rem',
            }}
          >
            <button
              onClick={handlePrevious}
              className={`mx-1 px-3 py-1 rounded ${currentPage === 1
                ? "bg-gray-200 text-gray-700"
                : "secondary-bg text-white"
                }`}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {currentPage > 2 && (
              <button
                onClick={() => handleClick(currentPage - 2)}
                className="mx-1 px-3 py-1 rounded bg-gray-200 text-gray-700"
              >
                {currentPage - 2}
              </button>
            )}
            {currentPage > 1 && (
              <button
                onClick={() => handleClick(currentPage - 1)}
                className="mx-1 px-3 py-1 rounded bg-gray-200 text-gray-700"
              >
                {currentPage - 1}
              </button>
            )}
            <button
              onClick={() => handleClick(currentPage)}
              className="mx-1 px-3 py-1 rounded secondary-bg text-white"
            >
              {currentPage}
            </button>
            {currentPage < totalPages && (
              <button
                onClick={() => handleClick(currentPage + 1)}
                className="mx-1 px-3 py-1 rounded bg-gray-200 text-gray-700"
              >
                {currentPage + 1}
              </button>
            )}
            <button
              onClick={handleNext}
              className={`mx-1 px-3 py-1 rounded ${currentPage >= totalPages
                ? "bg-gray-200 text-gray-700"
                : "secondary-bg text-white"
                }`}
              disabled={currentPage >= totalPages}
            >
              Next
            </button>
          </div>
          {/*<====================================================================== upload import doctor  =====================================================================> */}

          <Dialog open={openUpload} className="custom-dialog">
            <DialogTitle id="alert-dialog-title" className="primary">
              Import Doctor
            </DialogTitle>
            <div className="">
              <Alert severity="warning">
                <AlertTitle>Warning</AlertTitle>
                Please Make Sure Repeated Email ID record is not accepted.
              </Alert>
            </div>
            <IconButton
              aria-label="close"
              onClick={() => setOpenUpload(false)}
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
                <div className="primary">Item File Upload</div>
                <div
                  style={{
                    display: "flex",
                    gap: "15px",
                    flexDirection: "column",
                  }}
                >
                  <div className="mt-2">
                    <input
                      className="File-upload"
                      type="file"
                      accept=".csv"
                      id="file-upload"
                      onChange={handleFileChange}
                    />
                    <span className="errorFile" style={{ fontSize: "small" }}>
                      *select only .csv, File.
                    </span>
                  </div>
                  <div className="mt-2">
                    <Button
                      onClick={handleDownload}
                      style={{
                        backgroundColor: "var(--COLOR_UI_PHARMACY)",
                        color: "white",
                      }}
                      className="downloadFile"
                    >
                      <CloudDownloadIcon className="mr-2" />
                      Download Sample File
                    </Button>
                  </div>
                </div>
              </DialogContentText>
            </DialogContent>
            <DialogActions style={{ padding: "0 24px 24px" }}>
              <Button
                autoFocus
                variant="contained"
                style={{
                  backgroundColor: "var(--COLOR_UI_PHARMACY)",
                  color: "white",
                }}
                onClick={uploadDoctorFile}
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>

          {/*<====================================================================== Add edit doctor  =====================================================================> */}


          <Dialog open={openAddPopUp} className="custom-dialog modal_991">
            <DialogTitle id="alert-dialog-title" className="primary">
              {header}
            </DialogTitle>

            <IconButton
              aria-label="close"
              onClick={resetAddDialog}
              className="text-gray-500"
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
                <div className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-12 gap-5">

                    {/* Doctor Name - full width */}
                    <div className="flex flex-col col-span-8 ">
                      <div className="mb-1">
                        <span className="label primary mb-4">Doctor Name</span>
                        <span className="text-red-600 ml-1">*</span>
                      </div>
                      <Autocomplete
                        value={doctor}
                        size="small"
                        onChange={handleOptionChange}
                        onInputChange={(e, value) => handleInputChange(e, value.toUpperCase())}
                        getOptionLabel={(option) =>
                          typeof option === "string" ? option : option.name
                        }
                        options={tableData}
                        renderOption={(props, option) => (
                          <ListItem {...props}>
                            <ListItemText primary={option.name} />
                          </ListItem>
                        )}
                        renderInput={(params) => (
                          <TextField autoComplete="off" {...params} placeholder="Enter Doctor Name" />
                        )}
                        freeSolo
                      />
                      {errors.Doctor && (
                        <span style={{ color: "red", fontSize: "12px" }}>
                          {errors.Doctor}
                        </span>
                      )}

                    </div>


                    <div className="flex flex-col col-span-4">
                      <span className="label primary">Set Default Doctor ?</span>
                      <FormControl size="small" className="w-full">
                        <Select
                          value={defaultDr || ""}
                          onChange={(e) => setDefaultDr(e.target.value)}
                          displayEmpty
                          inputProps={{ 'aria-label': 'Default Doctor' }}
                        >
                          <MenuItem value="">
                            <em>Select Default Doctor</em>
                          </MenuItem>
                          <MenuItem value="1">Yes</MenuItem>
                          <MenuItem value="0">No</MenuItem>
                        </Select>
                      </FormControl>
                    </div>

                    {/* Clinic Name - full width */}
                    <div className="flex flex-col col-span-12 w-full">
                      <div className="mb-1">
                        <span className="label primary">Clinic Name</span>
                      </div>
                      <TextField
                        autoComplete="off"
                        size="small"
                        placeholder="Enter Clinic Name"
                        value={clinic}
                        onChange={(e) => setClinic(e.target.value.toUpperCase())}
                        className="w-full"
                        variant="outlined"
                      />
                      {errors.clinic && (
                        <span style={{ color: "red", fontSize: "12px" }}>
                          {errors.clinic}
                        </span>
                      )}
                    </div>

                    {/* Email ID */}
                    <div className="flex flex-col col-span-4">
                      <span className="label primary">Email ID</span>
                      <TextField
                        autoComplete="off"
                        size="small"
                        placeholder="Enter Email ID"
                        value={emailId}
                        onChange={(e) => {
                          // Remove spaces instantly
                          const value = e.target.value.replace(/\s/g, "");
                          setEmailId(value);
                        }}
                        className="w-full"
                        variant="outlined"
                        error={emailId !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailId)}
                        helperText={
                          emailId !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailId)
                            ? "Enter a valid email address"
                            : ""
                        }
                      />
                    </div>


                    {/* Mobile No */}
                    <div className="flex flex-col col-span-4">
                      <div className="mb-1">
                        <span className="label primary">Mobile No</span>
                      </div>
                      <OutlinedInput
                        type="number"
                        value={mobileNo}
                        placeholder="Enter Mobile Number"
                        onChange={handleChange}
                        startAdornment={<InputAdornment position="start">+91</InputAdornment>}
                        className="w-full"
                        size="small"
                      />
                      {errors.mobileNo && (
                        <span style={{ color: "red", fontSize: "12px" }}>
                          {errors.mobileNo}
                        </span>
                      )}
                    </div>

                    {/* Licence No */}
                    <div className="flex flex-col col-span-4">
                      <span className="label primary">Licence No.</span>
                      <OutlinedInput
                        type="text"
                        placeholder="Enter Licence No."
                        value={licence}
                        onChange={(e) => setLicence(e.target.value.toUpperCase())}
                        className="w-full"
                        size="small"
                      />
                    </div>

                    {/* Address - full width */}
                    <div className="flex flex-col col-span-12 w-full">
                      <span className="label primary">Address</span>
                      <TextField
                        autoComplete="off"
                        size="small"
                        placeholder="Enter Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value.toUpperCase())}
                        className="w-full"
                        variant="outlined"
                      />
                    </div>
                  </div>
                </div>
              </DialogContentText>
            </DialogContent>

            <DialogActions style={{ padding: "20px 24px" }}>
              <Button
                autoFocus
                variant="contained"
                style={{
                  backgroundColor: "var(--COLOR_UI_PHARMACY)",
                  color: "white",
                }}
                onClick={AddDoctor}
              >
                {buttonLabel}
              </Button>
              <Button
                autoFocus
                variant="contained"
                color="error"
                onClick={resetAddDialog}
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </>
  );
};
export default DoctorList;
