import Header from "../../Header";
import {
  Button,
  TextField,
  Alert,
  AlertTitle,
  Select,
  TablePagination,
} from "@mui/material";
import { useEffect, useState } from "react";
import { BsLightbulbFill } from "react-icons/bs";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { MenuItem } from "@material-tailwind/react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import axios from "axios";
import Loader from "../../../componets/loader/Loader";
import DatePicker from "react-datepicker";
import { format, subDays } from "date-fns";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const CashManage = () => {
  const history = useHistory();

  const token = localStorage.getItem("token");
  const cashManageDetailscolumns = [
    { id: "date", label: "Date", minWidth: 150 },
    // { id: 'opining_balance', label: 'Opening Balance', minWidth: 100 },
    { id: "description", label: "Voucher", minWidth: 150 },
    { id: "description", label: "Ref. No", minWidth: 150 },
    { id: "credit", label: "Credit", minWidth: 150 },
    { id: "debit", label: "Debit", minWidth: 150 },
    { id: "amount", label: "Total Balance", minWidth: 150 },
  ];
  const paymentOptions = [
    { id: 1, label: "Credit" },
    { id: 2, label: "Debit" },
  ];
  const initialSearchTerms = cashManageDetailscolumns.map(() => "");
  const [searchTerms, setSearchTerms] = useState(initialSearchTerms);
  const [openAddPopUpDownload, setOpenAddPopUpDownload] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pdfIcon = process.env.PUBLIC_URL + "/pdf.png";
  const [tableData, setTableData] = useState([]);
  const [startdate, setStartDate] = useState(subDays(new Date(), 15));
  const [enddate, setEndDate] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [openAddPopUp, setOpenAddPopUp] = useState(false);
  const [catagory, setCatagory] = useState([]);
  const [description, setDescription] = useState([]);
  const [cashManageDetails, setCashmageDetails] = useState([]);
  const [cashType, setCashType] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(tableData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage + 1;
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  // const paginatedData = cashManage?.cash_list?.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const [data, setData] = useState([]);

  useEffect(() => {
    CatagoryList();
    CaseManageMentList();
  }, [page, rowsPerPage]);

  const CatagoryList = async () => {
    let data = new FormData();
    setIsLoading(true);
    try {
      await axios
        .post("cash-category-list", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setIsLoading(false);
          setCatagory(response.data.data);
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
  const CaseManageMentList = async () => {
    let data = new FormData();
    setIsLoading(true);
    const params = {
      start_date: startdate ? format(startdate, "yyyy-MM-dd") : "",
      end_date: enddate ? format(enddate, "yyyy-MM-dd") : "",
      page: page + 1,
      limit: rowsPerPage,
    };
    try {
      await axios
        .post("cash-managment-list", data, {
          params: params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setIsLoading(false);
          setCashmageDetails(response.data.data);
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

  // const filteredList = paginatedData.filter(row => {
  //     return searchTerms.every((term, index) => {
  //         const value = row[cashManageDetailscolumns[index].id];
  //         return String(value).toLowerCase().includes(term.toLowerCase());
  //     });
  // });
  const handlePdf = () => {
    setOpenAddPopUpDownload(true);
    pdfGenerator();
  };

  const pdfGenerator = async () => {
    let data = new FormData();
    const params = {
      start_date: startdate ? format(startdate, "yyyy-MM-dd") : "",
      end_date: enddate ? format(enddate, "yyyy-MM-dd") : "",
    };
    try {
      const response = await axios.post("cash-managment-pdf", data, {
        params: params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        // responseType: 'blob', // Ensure the response is in blob format
      });
      if (response.data.status === 401) {
        history.push("/");
        localStorage.clear();
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
  // const capitalizeFirstLetter = (string) => {
  //     return string.charAt(0).toUpperCase() + string.slice(1);
  // };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  return (
    <>
      <div>
        <Header />
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
                  className="mb-4 csh_mng_main_hdr"
                  style={{ display: "flex", gap: "4px" }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "7px",
                      alignItems: "center",
                    }}
                  >
                    <span
                      className="primary"
                      style={{
                        display: "flex",
                        fontWeight: 700,
                        fontSize: "20px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Cash Management
                    </span>
                    <BsLightbulbFill className="w-6 h-6 secondary hover-yellow " />
                  </div>
                  <div className="headerList">
                    <Button
                      className="gap-7 downld_btn_csh"
                      variant="contained"
                      style={{
                        background: "var(--color1)",
                        color: "white",
                        // paddingLeft: "35px",
                        textTransform: "none",
                        display: "flex",
                      }}
                      onClick={handlePdf}
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
                  </div>
                </div>
                <div
                  className="row border-b border-dashed"
                  style={{ borderColor: "var(--color2)" }}
                ></div>
                <div className="firstrow flex flex-col md:flex-row justify-between gap-4 md:gap-0 mt-4">
                  <div className="flex flex-col md:flex-row gap-5 oreder_list_fld">
                    <div className="detail flex flex-col">
                      <span className="text-gray-500">Start Date</span>
                      <DatePicker
                        className="custom-datepicker dst_fld_odr"
                        selected={startdate}
                        onChange={(newDate) => setStartDate(newDate)}
                        dateFormat="dd/MM/yyyy"
                      />
                    </div>
                    <div className="detail flex flex-col">
                      <span className="text-gray-500">End Date</span>
                      <DatePicker
                        className="mt-4 md:mt-0 min-h-[41px] h-[41px] flex items-center justify-center custom-datepicker dst_fld_odr"
                        selected={enddate}
                        onChange={(newDate) => setEndDate(newDate)}
                        dateFormat="dd/MM/yyyy"
                      />
                    </div>
                    <div className="flex flex-col  space-x-1">
                      <Button
                        variant="contained"
                        size="small"
                        onClick={CaseManageMentList}
                        className="mt-4 md:mt-0 min-h-[41px] h-[41px]  text-white flex items-center justify-center"
                        // style={{ background: "var(--COLOR_UI_PHARMACY)" }}
                        style={{
                          minHeight: "45px",
                          alignItems: "center",
                          marginTop: "23px",
                          background: "var(--color1)",
                          width: "100%",
                        }}
                      >
                        <FilterAltIcon className="text-white text-lg" />
                        Filter
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-6 bg-green-100 p-3 rounded-lg  md:mt-0 cash_mng_hed_ttl">
                    <div className="csh_tl_txt csh_tl_txt_1st">
                      <div className="relative">
                        <h2 className="primary font-medium text-md ml-6 ttl_txt_hd">
                          <FaArrowDown className="absolute left-0 bg-blue-500 text-white rounded-full p-1 mt-1" />
                          Total In
                        </h2>
                      </div>
                      <div className="flex">
                        <h2 className="secondary font-bold text-lg ml-6 ttl_csh_mng_txt">
                          Rs.{parseInt(cashManageDetails.credit).toFixed(2)}
                        </h2>
                      </div>
                    </div>
                    <div className="csh_tl_txt">
                      <div className="relative">
                        <h2 className="text-red-600 font-medium text-md ml-6 ttl_txt_hd">
                          <FaArrowUp className="absolute left-0 bg-red-600 text-white rounded-full p-1 mt-1" />
                          Total Out
                        </h2>
                      </div>
                      <div className="flex">
                        <h2 className="text-red-600 font-bold text-lg ml-6 ttl_csh_mng_txt">
                          Rs.{parseInt(cashManageDetails.debit).toFixed(2)}
                        </h2>
                      </div>
                    </div>
                    <div className="csh_tl_txt_lst">
                      <div className="relative">
                        <h2 className="primary font-medium text-md ml-6 ttl_txt_hd">
                          Net
                        </h2>
                      </div>
                      <div className="flex">
                        <h2 className="secondary font-bold text-lg ml-6 ttl_csh_mng_txt">
                          Rs.{parseInt(cashManageDetails.total).toFixed(2)}
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

                <div className=" firstrow px-4 ">

                  <div className="overflow-x-auto">
                    <table
                      className="w-full border-collapse custom-table"
                      style={{
                        whiteSpace: "nowrap",
                        borderCollapse: "separate",
                        borderSpacing: "0 6px",
                      }}
                    >
                      <thead>
                        <tr>
                          {cashManageDetailscolumns.map((column) => (
                            <th
                              key={column.id}
                              onClick={() => sortByColumn(column.id)}
                              className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              style={{ minWidth: column.minWidth }}
                            >
                              <div className="headerStyle">
                                <span style={{ minWidth: 150 }}>{column.label}</span>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody style={{ backgroundColor: "#3f621217" }}>
                        {cashManageDetails?.cash_list?.map((row) => {
                          return (
                            <tr
                              key={row.code}
                              className="hover:bg-gray-100 cursor-pointer"
                              tabIndex={-1}
                            >
                              {cashManageDetailscolumns.map((column, colIndex) => {
                                const value = row[column.id];
                                return (
                                  <td
                                    key={column.id}
                                    align={column.align}
                                    className={`px-4 py-2 whitespace-nowrap ${column.id === "debit"
                                      ? "debit-cell"
                                      : column.id === "credit"
                                        ? "credit-cell"
                                        : ""
                                      }`}
                                    style={
                                      colIndex === 0
                                        ? { borderRadius: "10px 0 0 10px" }
                                        : colIndex ===
                                          cashManageDetailscolumns.length - 1
                                          ? { borderRadius: "0 10px 10px 0" }
                                          : {}
                                    }
                                  >
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
                </div>
              </div>
            </div>


            {/*<====================================================================== pagination  =====================================================================> */}

            <div className="flex justify-center mt-4" style={{
              left: 0,
              right: 0,
              bottom: 50,
              display: 'flex',
              justifyContent: 'center',
              padding: '1rem',
              background: '#fff'
            }}>
              <button
                onClick={() => setPage(page - 1)}
                className={`mx-1 px-3 py-1 rounded ${page === 0 ? "bg-gray-200 text-gray-700" : "secondary-bg text-white"}`}
                disabled={page === 0}
              >
                Previous
              </button>
              {page > 1 && (
                <button onClick={() => setPage(page - 2)} className="mx-1 px-3 py-1 rounded bg-gray-200 text-gray-700">{page - 1}</button>
              )}
              {page > 0 && (
                <button onClick={() => setPage(page - 1)} className="mx-1 px-3 py-1 rounded bg-gray-200 text-gray-700">{page}</button>
              )}
              <button onClick={() => setPage(page)} className="mx-1 px-3 py-1 rounded secondary-bg text-white">{page + 1}</button>
              {page + 1 < Math.ceil((cashManageDetails?.count || 0) / rowsPerPage) && (
                <button onClick={() => setPage(page + 1)} className="mx-1 px-3 py-1 rounded bg-gray-200 text-gray-700">{page + 2}</button>
              )}
              <button
                onClick={() => setPage(page + 1)}
                className={`mx-1 px-3 py-1 rounded ${(page + 1) >= Math.ceil((cashManageDetails?.count || 0) / rowsPerPage) ? "bg-gray-200 text-gray-700" : "secondary-bg text-white"}`}
                disabled={(page + 1) >= Math.ceil((cashManageDetails?.count || 0) / rowsPerPage)}
              >
                Next
              </button>
            </div>

            <Dialog
              open={openAddPopUpDownload}
              sx={{
                "& .MuiDialog-container": {
                  "& .MuiPaper-root": {
                    width: "600px",
                    maxWidth: "1500px",
                    backgroundColor: "none",
                    boxShadow: "none",
                    marginBottom: "0",
                  },
                },
              }}
            >
              <Alert
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setOpenAddPopUpDownload(false);
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
                sx={{ mb: 2 }}
              >
                <h4 className="font-bold text-lg">
                  {" "}
                  Please check your email.{" "}
                </h4>
                <span className="text-base">
                  You will receive a maill from us within the next few minutes.
                </span>
              </Alert>
            </Dialog>
          </div>
        )}
      </div>
    </>
  );
};
export default CashManage;
