import React, { useEffect, useState, useCallback } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { TablePagination, TextField, CircularProgress } from "@mui/material";
import axios from "axios";
import { InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import ReplyAllIcon from '@mui/icons-material/ReplyAll';
import { toast } from "react-toastify";
import { IconButton } from "@mui/material";
const Search = ({ searchPage, setSearchPage }) => {
  const history = useHistory();
  const token = localStorage.getItem("token");

  // State management
  const [searchType, setSearchType] = useState("1"); // Default to Medicine
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);

  // Unified configuration for all search types
  const searchConfigs = {
    "1": {
      label: "Medicine",
      endpoint: "item-search",
      key: "search",
      columns: [
        { id: "iteam_name", label: "Item Name", minWidth: 100 },
        { id: "weightage", label: "Weightage", minWidth: 100 },
        { id: "drug_group_name", label: "Drug Group", minWidth: 100 },
        { id: "mrp", label: "MRP", minWidth: 100 },
        { id: "stock", label: "Stock", minWidth: 100 },
      ],
      navigationPath: (id) => `/inventoryView/${id}`
    },
    "2": {
      label: "Drug Group",
      endpoint: "drug-list",
      key: "search",
      columns: [
        { id: "id", label: "Drug Group ID", minWidth: 100 },
        { id: "name", label: "Drug Group", minWidth: 100 },
        { id: "count", label: "Count", minWidth: 100 },
      ],
      navigationPath: (id) => `/drugGroupView/${id}`
    },
    "3": {
      label: "Distributor",
      endpoint: "list-distributer",
      key: "name_mobile_gst_search",
      columns: [
        { id: "name", label: "Distributor Name", minWidth: 100 },
        { id: "gst", label: "GST", minWidth: 100 },
      ],
      navigationPath: (id) => `/DistributerView/${id}`
    },
    "4": {
      label: "Customer",
      endpoint: "list-customer",
      key: "search",
      columns: [
        { id: "name", label: "Customer Name", minWidth: 100 },
        { id: "phone_number", label: "Mobile No.", minWidth: 100 },
        { id: "total_order", label: "Total Order", minWidth: 100 },
        { id: "roylti_point", label: "Loyalty Points", minWidth: 100 },
        { id: "total_amount", label: "Total Amount", minWidth: 100 },
      ],
      navigationPath: (id) => `/customerView/${id}`
    },
  };

  // Get current configuration
  const getCurrentConfig = () => searchConfigs[searchType] || searchConfigs["1"];

  // Debounced search function with proper dependency
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId;
      return (query, type) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (query.trim() && type) {
            searchData(query, type);
          }
        }, 300);
      };
    })(),
    []
  );

  // Handle search type change
  const handleSearchTypeChange = (value) => {
    const newSearchType = value.toString();
    setSearchType(newSearchType);
    setSearchQuery("");
    setPage(0);
    setTableData([]); // Clear previous results

    // If there's an existing search query, perform search with new type
    if (searchQuery.trim()) {
      debouncedSearch(searchQuery, newSearchType);
    }
  };

  // Handle search query change
  const handleSearchQueryChange = (e) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);

    if (newValue.trim()) {
      debouncedSearch(newValue, searchType);
    } else {
      setTableData([]);
    }
  };

  // Unified search function
  const searchData = async (query, type = searchType) => {
    if (!query.trim() || !type) {
      if (!type) {
        toast.dismiss();
        toast.error("Please select a search type");
      }
      return;
    }

    const config = searchConfigs[type];
    if (!config) {
      console.error("Invalid search type");
      toast.dismiss();
      toast.error("Invalid search type selected");
      return;
    }

    setIsLoading(true);

    const data = new FormData();
    data.append(config.key, query);

    try {
      const response = await axios.post(config.endpoint, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response?.data?.data) {
        let processedData = response.data.data;
        // Handle nested data structure for medicine search
        if (type === "1") {
          processedData = response.data.data.data || response.data.data;
        }
        setTableData(processedData || []);
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error("API error:", error);
      const errorMessage = error.response?.data?.message || "Search failed. Please try again.";
      toast.dismiss();
      toast.error(errorMessage);
      setTableData([]);
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

  const handleNavigation = (row) => {
    setSearchPage(false);
    const config = getCurrentConfig();
    if (config && row.id) {
      const path = config.navigationPath(row.id);
      if (history.location.pathname === path) {
        history.replace(path);
        window.location.reload();
      } else {
        history.push(path);
      }
    }
  };


  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Get current columns
  const getCurrentColumns = () => {
    const config = getCurrentConfig();
    return config ? config.columns : [];
  };

  // Effect for body overflow
  useEffect(() => {
    if (searchPage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [searchPage]);

  const currentColumns = getCurrentColumns();

  return (
    <>
      <div
        id="modal"
        value={searchPage}
        className={`fixed top-[calc(var(--header-height,25px))] left-0 right-0 bottom-0 p-4 flex flex-wrap justify-center items-center w-full h-[calc(100%-var(--header-height,15px))] z-[100] before:fixed before:top-[calc(var(--header-height,31px))] before:left-0 before:w-full before:h-[calc(100%-var(--header-height,5px))] before:bg-[rgba(0,0,0,0.6)] before:backdrop-blur-sm overflow-hidden font-[sans-serif] transition-all duration-300
            ${searchPage ? "block opacity-100" : "hidden opacity-0"}`}
      >
        <div />
        <div 
          className="bg-white shadow-2xl rounded-xl p-6 relative w-full max-w-4xl max-h-[85vh] flex flex-col transform transition-all duration-300 scale-100" 
          style={{ animation: 'fadeIn 0.2s ease-out' }}
        >
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <SearchIcon sx={{ color: 'var(--COLOR_UI_PHARMACY)' }} />
              Global Search
            </h2>
            <IconButton
              onClick={() => setSearchPage(false)}
              size="small"
              sx={{
                color: 'gray',
                '&:hover': {
                  backgroundColor: '#fee2e2',
                  color: '#ef4444',
                },
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z" />
              </svg>
            </IconButton>
          </div>

          <div className="flex gap-4 items-center mb-6 w-full">
            <Box sx={{ minWidth: "160px" }}>
              <FormControl fullWidth size="small">
                <InputLabel id="Select-label" sx={{ color: 'gray' }}>Category</InputLabel>
                <Select
                  labelId="Select-label"
                  id="select"
                  value={searchType}
                  label="Category"
                  onChange={(event) => handleSearchTypeChange(event.target.value)}
                  sx={{
                    borderRadius: '8px',
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'var(--COLOR_UI_PHARMACY)',
                    },
                  }}
                >
                  {Object.entries(searchConfigs).map(([value, config]) => (
                    <MenuItem key={value} value={value}>
                      {config.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <TextField
              autoComplete="off"
              id="outlined-basic"
              size="small"
              disabled={!searchType}
              autoFocus
              value={searchQuery.toUpperCase()}
              sx={{
                width: "100%",
                marginTop: "0px",
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: '#f9fafb',
                  '&.Mui-focused': {
                    backgroundColor: '#ffffff',
                    boxShadow: '0 0 0 2px rgba(98, 138, 47, 0.2)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'var(--COLOR_UI_PHARMACY)',
                  },
                },
              }}
              onChange={handleSearchQueryChange}
              variant="outlined"
              placeholder={`Search ${getCurrentConfig()?.label || 'items'}...`}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {isLoading ? <CircularProgress size={20} sx={{ color: 'var(--COLOR_UI_PHARMACY)' }} /> : <SearchIcon sx={{ color: 'gray' }} />}
                  </InputAdornment>
                ),
                type: "search",
              }}
            />
          </div>

          <div className="flex-1 overflow-hidden flex flex-col border border-gray-200 rounded-lg shadow-sm">
            <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: '45vh' }}>
              <table className="w-full border-collapse" style={{ whiteSpace: "nowrap" }}>
                <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">Sr No.</th>
                    {currentColumns.map((column) => (
                      <th key={column.id} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200" style={{ minWidth: 50 }}>
                        {column.label}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {tableData && tableData.length > 0 ? (
                    tableData
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => (
                        <tr 
                          key={`${searchType}-${row.id || index}-${page * rowsPerPage + index}`}
                          className="hover:bg-[#f0f5e9] transition-colors duration-150 group cursor-pointer"
                          onClick={() => handleNavigation(row)}
                        >
                          <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                            {page * rowsPerPage + index + 1}
                          </td>
                          {currentColumns.map((column) => (
                            <td key={column.id} className="px-4 py-3 text-sm text-gray-700 font-medium">
                              {row[column.id]
                                ? row[column.id].toString().slice(0, 50) + (row[column.id].toString().length > 50 ? "…" : "")
                                : row[column.id] === 0 ? "0" : "-"}
                            </td>
                          ))}
                          <td className="px-4 py-3 text-center">
                            <IconButton 
                              size="small" 
                              className="text-gray-400 group-hover:text-[var(--COLOR_UI_PHARMACY)] transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNavigation(row);
                              }}
                            >
                              <ReplyAllIcon fontSize="small" className="transform -scale-x-100" />
                            </IconButton>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan={currentColumns.length + 2} className="px-4 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center justify-center">
                          {isLoading ? (
                            <CircularProgress size={32} sx={{ color: 'var(--COLOR_UI_PHARMACY)', mb: 2 }} />
                          ) : (
                            <SearchIcon sx={{ fontSize: 48, color: '#e5e7eb', mb: 1 }} />
                          )}
                          <p className="text-base font-medium text-gray-600">
                            {isLoading ? "Searching..." : searchQuery && searchType ? "No results found" : "Enter a query to start searching"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {tableData.length > 0 && (
              <div className="border-t border-gray-200 bg-gray-50 px-4 py-1 rounded-b-lg flex justify-end">
                <TablePagination
                  rowsPerPageOptions={[10, 20, 50, 100]}
                  component="div"
                  count={tableData.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  sx={{
                    '& .MuiTablePagination-select': {
                      fontFamily: 'inherit',
                      fontWeight: 500,
                    },
                    '& .MuiTablePagination-displayedRows': {
                      fontFamily: 'inherit',
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Search;