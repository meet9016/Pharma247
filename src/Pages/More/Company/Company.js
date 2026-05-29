import React, { useEffect, useState, useRef } from "react";
import Header from "../../Header";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import { BsLightbulbFill } from "react-icons/bs";
import AddIcon from "@mui/icons-material/Add";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import {
  Autocomplete,
  Button,
  ListItem,
  ListItemText,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Loader from "../../../componets/loader/Loader";
import { toast, ToastContainer } from "react-toastify";

const companyColumns = [
  { id: "company_name", label: "Company Name", minWidth: 100 },
];

const Company = () => {
  const history = useHistory();
  const token = localStorage.getItem("token");
  const [companyData, setCompanyData] = useState([]);
  const [openAddPopUp, setOpenAddPopUp] = useState(false);
  const [header, setHeader] = useState("");
  const [buttonLabel, setButtonLabel] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyID, setCompanyID] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [rowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  // Search state
  const [searchTerms, setSearchTerms] = useState([""]);
  const searchTimeout = useRef(null);
  const currentSearchTerms = useRef(searchTerms);
  const [searchTrigger, setSearchTrigger] = useState(0);

  // Delete state
  const [deleteCompanyId, setDeleteCompanyId] = useState(null);
  const [IsDelete, setIsDelete] = useState(false);

  // Dialog helpers
  const resetAddDialog = () => {
    setCompanyName("");
    setErrors({});
    setOpenAddPopUp(false);
    setIsEditMode(false);
    setCompanyID(null);
  };

  const handelAddOpen = () => {
    setOpenAddPopUp(true);
    setHeader("Add Company");
    setButtonLabel("Save");
    setIsEditMode(false);
    setCompanyName("");
  };
  const handleEditOpen = (row) => {
    setOpenAddPopUp(true);
    setCompanyID(row.id);
    setCompanyName(row.company_name);
    setIsEditMode(true);
    setHeader("Edit Company");
    setButtonLabel("Update");
  };

  // Backend-driven Pagination + Search effect
  useEffect(() => {
    companyList(currentPage);
    // eslint-disable-next-line
  }, [currentPage]);

  // Debounced search effect
  useEffect(() => {
    if (searchTrigger > 0) {
      clearTimeout(searchTimeout.current);
      const hasSearchTerms = currentSearchTerms.current.some(
        (term) => term && term.trim()
      );
      if (!hasSearchTerms) {
        setIsSearching(false);
        companyList(1, true);
      } else {
        setIsSearching(true);
        searchTimeout.current = setTimeout(() => {
          companyList(1, true);
        }, 200);
      }
    }
    // eslint-disable-next-line
  }, [searchTrigger]);

  // Clean up debounce timeout on unmount
  useEffect(() => {
    return () => clearTimeout(searchTimeout.current);
  }, []);

  // Core List API (backend pagination + search)
  const companyList = (page = 1, isSearch = false) => {
    if (!page) return;
    setIsLoading(!isSearch);
    setIsSearching(isSearch);

    const params = {
      page,
      limit: rowsPerPage,
      ...(searchTerms[0]
        ? {name: searchTerms[0] }
        : {}),
    };
    axios
      .get("company-list", { params })
      .then((response) => {
        setCompanyData(response.data.data || []);
        setTotalRecords(Number(response.data.total_records) || 0);
        setIsLoading(false);
        setIsSearching(false);
        if (response.data.status === 401) {
          history.push("/");
          localStorage.clear();
        }
      })
      .catch(() => {
        setIsLoading(false);
        setIsSearching(false);
        setCompanyData([]);
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

  // Search input handler (debounced, backend)
  const handleSearchChange = (index, value) => {
    const newSearchTerms = [...searchTerms];
    newSearchTerms[index] = value;
    currentSearchTerms.current = newSearchTerms;
    setSearchTerms(newSearchTerms);
    setCurrentPage(1);
    setSearchTrigger((prev) => prev + 1);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      companyList(1, true);
    }
  };

  // Pagination controls
  const totalPages = Math.ceil(totalRecords / rowsPerPage);
  const handleClick = (pageNum) => setCurrentPage(pageNum);
  const handlePrevious = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  // Add/Edit Logic
  const validData = () => {
    const newErrors = {};
    if (!companyName) {
      newErrors.companyName = "Company Name is required";
      toast.dismiss();
toast.error(newErrors.companyName);
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      isEditMode ? EditCompany() : AddCompany();
    }
  };
  const AddCompany = async () => {
    let data = new FormData();
    data.append("company_name", companyName);
    try {
      await axios.post("company-store", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      resetAddDialog();
      companyList(currentPage);
       toast.dismiss();
toast.success("Company added!");
    } catch (error) {
      toast.dismiss();
toast.error(error?.response?.data?.message || "Error");
   if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
    }
  };
  const EditCompany = async () => {
    let data = new FormData();
    data.append("id", companyID);
    data.append("company_name", companyName);
    try {
      await axios.post("company-update", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      resetAddDialog();
      companyList(currentPage);
       toast.dismiss();
toast.success("Company updated!");
    } catch (error) {
      toast.dismiss();
toast.error(error?.response?.data?.message || "Error");
   if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
    }
  };

  // Autocomplete (edit dialog) handlers
  const handleOptionChange = (event, newValue) => {
    if (newValue && typeof newValue === "object") {
      setCompanyName(newValue.company_name);
    } else {
      setCompanyName(newValue || "");
    }
  };
  const handleInputChange = (event, newInputValue) => {
    setCompanyName((newInputValue || "").toUpperCase());
  };

  // Delete
  const companyDelete = async (id) => {
    let data = new FormData();
    data.append("id", id);
    try {
      await axios.post("company-delete", data, {
        headers: { "Content-Type": "application/json" },
      });
      setIsDelete(false);
      companyList(currentPage);
       toast.dismiss();
toast.success("Company deleted!");
    } catch (error) {
      toast.dismiss();
toast.error("Error deleting company");
   if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
    }
  };
  const deleteOpen = (id) => {
    setDeleteCompanyId(id);
    setIsDelete(true);
  };
  const deleteClose = () => setIsDelete(false);
  const handleDelete = () => companyDelete(deleteCompanyId);

  // Serial number
  const startIndex = (currentPage - 1) * rowsPerPage + 1;

  return (
    <div>
      <Header />
      <ToastContainer position="top-right" autoClose={5000} />
      <div style={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      }}>
        <div style={{ flex: 1, overflowY: 'auto', width: '100%' }}>
          <div className="p-6">
            <div className="mb-4 add_company_hdr" style={{ display: "flex", gap: "4px" }}>
              <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                <span className="primary" style={{ fontWeight: 700, fontSize: "20px", width: "140px" }}>
                  Company List
                </span>
                <BsLightbulbFill className="w-6 h-6 secondary hover-yellow" />
              </div>
              <div className="headerList">
                <Button
                  variant="contained"
                  className="order_list_btn"
                  style={{ background: "var(--color1)" }}
                  size="small"
                  onClick={handelAddOpen}
                >
                  <AddIcon />
                  Add Company
                </Button>
              </div>
            </div>
            <div className="row border-b border-dashed" style={{ borderColor: "var(--color2)" }}></div>
            <div className="overflow-x-auto mt-4 px-4 py-3 " style={{ overflowX: 'auto', width: '100%' }}>
              <table
                className="w-full border-collapse custom-table"
                style={{
                  whiteSpace: "nowrap",
                  borderCollapse: "separate",
                  borderSpacing: "0 6px",
                }}
              >
                <thead>
                  <tr >
                    <th style={{ minWidth: 150, padding: '8px' }}>SR. No</th>
                    {companyColumns.map((column, colIndex) => (
                      <th key={column.id} style={{ minWidth: column.minWidth, padding: '8px' }}>
                        <div className="headerStyle" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                          <span>{column.label}</span>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <SwapVertIcon style={{ cursor: 'pointer' }} />
                            <TextField
                              autoComplete="off"
                              label="Type Here"
                              size="small"
                              sx={{ flex: 1, marginLeft: '4px', minWidth: '100px', maxWidth: '250px' }}
                              value={searchTerms[colIndex]}
                              onChange={e => handleSearchChange(colIndex, e.target.value)}
                              onKeyDown={handleKeyDown}
                            />
                          </div>
                        </div>
                      </th>
                    ))}
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody style={{ background: "#3f621217" }}>
                  {isLoading || isSearching ? (
                    <tr>
                      <td colSpan={companyColumns.length + 2} style={{ textAlign: "center", padding: "24px" }}>
                        <Loader />
                      </td>
                    </tr>
                  ) : companyData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={companyColumns.length + 2}
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
                    companyData.map((item, index) => (
                      <tr key={item.id || index}>
                        <td style={{ borderRadius: "10px 0 0 10px" }}>
                          {startIndex + index}
                        </td>
                        {companyColumns.map((column) => (
                          <td key={column.id}>{item[column.id]}</td>
                        ))}
                        <td style={{ borderRadius: "0 10px 10px 0" }}>
                          <div className="px-2 flex gap-1 justify-center">
                            <BorderColorIcon
                              style={{ color: "var(--color1)" }}
                              onClick={() => handleEditOpen(item)}
                            />
                            <DeleteIcon
                              style={{ color: "var(--color6)" }}
                              onClick={() => deleteOpen(item.id)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Pagination UI like PurchaseList */}
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
      </div>
      {/* Add/Edit Dialog */}
      <Dialog className="custom-dialog add-company-dialog" open={openAddPopUp}>
        <DialogTitle id="alert-dialog-title" style={{ fontWeight: 700 }}>
          {header}
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
            <div className="flex flex-col gap-5" style={{ width: "100%" }}>
              <FormControl size="small" style={{ width: "100%" }}>
                <span className="label primary">Company Name</span>
                <Autocomplete
                  value={companyName}
                  sx={{ width: "100%" }}
                  size="small"
                  onChange={handleOptionChange}
                  onInputChange={handleInputChange}
                  getOptionLabel={(option) =>
                    typeof option === "string" ? option : option.company_name
                  }
                  options={companyData}
                  renderOption={(props, option) => (
                    <ListItem {...props}>
                      <ListItemText primary={option.company_name} />
                    </ListItem>
                  )}
                  renderInput={(params) => (
                    <TextField autoComplete="off" {...params} />
                  )}
                  freeSolo
                />
              </FormControl>
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
            onClick={validData}
          >
            {buttonLabel}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Delete PopUp */}
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
              onClick={handleDelete}
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
  );
};

export default Company;
