import CircularProgress from "@mui/material/CircularProgress";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import Header from "../../../Header";
import { useCallback, useEffect, useState } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Link,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";
import Loader from "../../../../componets/loader/Loader";
import { FaFilePdf } from "react-icons/fa6";
import { IoLogoWhatsapp } from "react-icons/io";

import usePermissions, {
  hasPermission,
} from "../../../../componets/permission";
import { toast } from "react-toastify";
import { format, subDays } from "date-fns";
import CloseIcon from "@mui/icons-material/Close";
import DatePicker from "react-datepicker";
import { WhatsApp } from "@mui/icons-material";

const columns = [
  { id: "bill_no", label: "Bill No", minWidth: 150, height: 100 },
  { id: "bill_date", label: "Bill Date", minWidth: 150 },
  // { id: 'name', label: 'Customer Name', minWidth: 100 },
  // { id: 'mobile_numbr', label: 'Mobile No. ', minWidth: 100 },
  { id: "customer_info", label: "Customer Info", minWidth: 150 },
  { id: "payment_name", label: "Payment Mode", minWidth: 150 },
  { id: "status", label: "Status", minWidth: 150 },
  { id: "net_amt", label: "Bill Amount", minWidth: 150 },
];
const Salelist = () => {
  const permissions = usePermissions();
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloadLoading, setIsDownloadLoading] = useState(false);
  const history = useHistory();
  const [tableData, setTableData] = useState([]);
  const rowsPerPage = 10;
  const initialSearchTerms = columns.map(() => "");
  const [searchTerms, setSearchTerms] = useState(initialSearchTerms);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [PdfstartDate, setPdfStartDate] = useState(subDays(new Date(), 15));
  const [PdfendDate, setPdfEndDate] = useState(new Date());
  const [openAddPopUp, setOpenAddPopUp] = useState(false);
  const [PDFURL, setPDFURL] = useState("");

  // No frontend filtering needed - all search is handled by backend
  const paginatedData = tableData;
  const totalPages = Math.ceil(totalRecords / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage + 1;
  const apiKeys = ["bill_no", "bill_date", "name_mobile", "payment_method", "status", "bill_amount"];

  const handleSearchChange = useCallback((index, value) => {
    setSearchTerms(prev => {
      const newSearchTerms = [...prev];
      newSearchTerms[index] = value;
      if (currentPage !== 1) setCurrentPage(1);
      saleBillList(1, newSearchTerms);
      return newSearchTerms;
    });
  }, [currentPage]);
  const goIntoAdd = () => {
    history.push("/saleAdd");
  };

  // const deleteOpen = (id) => {
  //   setIsDelete(true);
  //   setSaleId(id);
  // };

  // const deleteClose = () => {
  //   setIsDelete(false);
  // };

  useEffect(() => {
    if (tableData.length > 0) {
      localStorage.setItem("BillNo", tableData[0].count + 1);
    } else {
      localStorage.setItem("BillNo", 1);
    }
  }, [tableData, currentPage]);

  useEffect(() => {
    saleBillList(currentPage);
    localStorage.removeItem("RandomNumber");
    // eslint-disable-next-line
  }, [currentPage]);

  const saleBillList = async (page, customSearchTerms = searchTerms) => {
    setIsLoading(true);
    let data = new FormData();
    data.append("page", page);
    data.append("start_date", PdfstartDate ? format(PdfstartDate, "yyyy-MM-dd") : "");
    data.append("end_date", PdfendDate ? format(PdfendDate, "yyyy-MM-dd") : "");

    apiKeys.forEach((key, index) => {
      const term = customSearchTerms[index];
      if (term && term.trim()) {
        data.append(key, term.trim());
      }
    });
    try {
      const response = await axios.post("sales-list?", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      const responseData = response.data.data;
      setTableData(responseData);
      // Extract and set total count for pagination
      const totalCount = responseData?.length > 0 ? Number(responseData[0].count) : 0;
      setTotalRecords(totalCount);
      setIsLoading(false);
    } catch (error) {
      console.error("API error:", error);
      setTableData([]);
      setTotalRecords(0);
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


  const AllPDFGenerate = async () => {
    setOpenAddPopUp(false);

    let data = new FormData();
    data.append(
      "start_date",
      PdfstartDate ? format(PdfstartDate, "yyyy-MM-dd") : ""
    );
    data.append("end_date", PdfendDate ? format(PdfendDate, "yyyy-MM-dd") : "");

    setIsDownloadLoading(true);
    try {
      await axios
        .post("multiple-sale-pdf-downloads", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const PDFURL = response.data.data.pdf_url;
          toast.dismiss();
          toast.success(response.data.meassage);

          setOpenAddPopUp(false);
          setIsDownloadLoading(false);
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
    }
  };

  const pdfGenerator = async (id) => {
    let data = new FormData();
    data.append("id", id);
    setIsDownloadLoading(true);
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
          setPDFURL(PDFURL);
          setIsDownloadLoading(false);
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
    }
  };

  const handlePdf = (url) => {
    if (typeof url === "string") {
      // Open the PDF in a new tab
      window.open(url, "_blank");
    } else {
      console.error("Invalid URL for the PDF");
    }
  };

  const handleWhatsAppmsg = async (bill) => {
    if (!bill || !bill.mobile_numbr || bill.mobile_numbr.length !== 10) {
      console.error("Invalid mobile number");
      return;
    }

    let data = new FormData();
    data.append("id", bill.id);
    setIsLoading(true);

    try {
      const response = await axios.post("sales-pdf-downloads", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data?.data?.pdf_url) {
        const PDFURL = response.data.data.pdf_url;
        setIsLoading(false);
        setPDFURL(PDFURL);

        const message = `Dear ${bill.name},\n\nYour invoice for &#8377;${bill.net_amt
          } is ready.\n\nClick the link below to download:\n${PDFURL}\n\nFor any queries, contact us: ${localStorage.getItem(
            "contact"
          )}\n\nThank you,\n${localStorage.getItem("UserName")}`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/91${bill.mobile_numbr}?text=${encodedMessage}`;

        window.open(whatsappURL, "_blank");
      } else {
        console.error("PDF URL not found in response");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("API error:", error);
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

  const handleClick = (pageNum) => {
    setCurrentPage(pageNum);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
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


  return (
    <>
      <div>
        <Header />

        <div
          style={{
            minHeight: 'calc(100vh - 64px)',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
          }}
        >
          <div style={{ flex: 1, overflowY: 'auto', }}>

            <div className="px-4 py-3">
              <div
                className="sales_hdr_mn"
                style={{ display: "flex", gap: "4px", marginBottom: "15px" }}
              >
                <div
                  className="flex flex-row sale_list_pg"
                  style={{ display: "flex", gap: "4px", alignItems: "center" }}
                >
                  <div
                    className="flex flex-row gap-2 sale_lt_txt"
                    style={{ alignItems: "center" }}
                  >
                    <span
                      style={{
                        color: "var(--color2)",
                        display: "flex",
                        alignItems: "center",
                        fontWeight: 700,
                        fontSize: "20px",
                      }}
                    >
                      Sales
                    </span>
                    <div>
                      <ArrowForwardIosIcon
                        style={{ fontSize: "18px", color: "var(--color1)" }}
                      />
                    </div>
                  </div>
                  {hasPermission(permissions, "sale bill create") && (
                    <>
                      <Button
                        variant="contained"
                        className="sale_add_btn gap-2"
                        size="small"
                        style={{
                          backgroundColor: "var(--color1)",
                          fontSize: "12px",
                        }}
                        onClick={goIntoAdd}
                      >
                        <AddIcon />
                        New
                      </Button>
                    </>
                  )}
                </div>
                <div className="headerList">
                  <Button
                    variant="contained"
                    className="sale_add_pdf"
                    style={{ background: "var(--color1)", color: "white" }}
                    disabled={isDownloadLoading}
                    onClick={() => {
                      setOpenAddPopUp(true);
                    }}
                  >
                    {isDownloadLoading ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6, color:"#fff" }}>
                        <CircularProgress size={16} style={{ color: "white" }} />
                        Generating...
                      </span>
                    ) : (
                      "Generate PDF"
                    )}
                  </Button>
                </div>
              </div>
              <div
                className="row border-b px-4 border-dashed"
                style={{ borderColor: "var(--color2)" }}
              ></div>
            </div>

            <div className="firstrow px-4">
              <div className="oreder_list_fld flex flex-col gap-2 md:flex-row lg:flex-row ">
                <div className="detail flex flex-col">
                  <span className="text-gray-500 block">Start Date</span>
                  <div className="" style={{ width: "100%" }}>
                    <DatePicker
                      className="custom-datepicker"
                      selected={PdfstartDate}
                      onChange={(newDate) => setPdfStartDate(newDate)}
                      dateFormat="dd/MM/yyyy"
                    />
                  </div>
                </div>
                <div className="detail flex flex-col">
                  <span className="text-gray-500 block">End Date</span>
                  <div className="" style={{ width: "100%" }}>
                    <DatePicker
                      className="custom-datepicker"
                      selected={PdfendDate}
                      onChange={(newDate) => setPdfEndDate(newDate)}
                      dateFormat="dd/MM/yyyy"
                    />
                  </div>
                </div>
                <div
                  className=""
                  style={{
                    display: "flex",
                    alignItems: "end",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    variant="contained"
                    className=""
                    size="small"
                    style={{
                      minHeight: "38px",
                      alignItems: "center",
                      background: "var(--color1)",
                    }}
                    onClick={() => saleBillList(currentPage)}
                  >
                    <SwapVertIcon size="large" style={{ color: "white", fontSize: "20px" }} />
                    Filter
                  </Button>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="loader-container ">
                <Loader />
              </div>
            ) : (
              <div className="overflow-x-auto mt-4 px-4 py-3" style={{ overflowX: 'auto', width: '100%' }}>
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
                      <th>SR. No</th>
                      {columns.map((column, index) => (
                        <th
                          key={column.id}
                          style={{ minWidth: column.minWidth }}
                        >
                          <div className="headerStyle">
                            <span>{column.label}</span>
                            <SwapVertIcon
                              style={{ cursor: "pointer" }}
                              onClick={() => sortByColumn(column.id)}
                            />
                            <TextField
                              autoComplete="off"
                              // label={`Search ${column.label}`}
                              label="Type Here"
                              id="filled-basic"
                              size="small"
                              sx={{ width: "150px" }}
                              value={searchTerms[index]}
                              onChange={(e) =>
                                handleSearchChange(index, e.target.value)
                              }
                            />
                          </div>
                        </th>
                      ))}
                      <th> Action</th>
                    </tr>
                  </thead>

                  <tbody style={{ background: "#3f621217" }}>
                    {paginatedData.length === 0 ? (
                      <tr>
                        <td
                          colSpan={columns.length + 2}
                          style={{
                            textAlign: "center",
                            color: "gray",
                            borderRadius: "10px 10px 10px 10px",
                          }}
                        >
<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px', width: '100%' }}>
  <img src="/no-data.png" alt="No Items Available" style={{ maxWidth: '300px', height: 'auto' }} />
</div>
</td>
                      </tr>
                    ) : (
                      paginatedData.map((row, index) => {
                        return (
                          <tr key={row.id}>
                            <td style={{ borderRadius: "10px 0 0 10px" }}>
                              {startIndex + index}
                            </td>
                            {columns.map((column) => {
                              if (column.id === "customer_info") {
                                const name = row.name ? row.name : "";
                                const mobileNumber = row.mobile_numbr
                                  ? row.mobile_numbr
                                  : "";
                                return (
                                  <td
                                    key={column.id}
                                    onClick={() => {
                                      history.push("/saleView/" + row.id);
                                    }}
                                  >
                                    {name && mobileNumber
                                      ? `${name} / ${mobileNumber}`
                                      : name || mobileNumber || "-"}
                                  </td>
                                );
                              } else {
                                return (
                                  <td
                                    key={column.id}
                                    onClick={() => {
                                      history.push("/saleView/" + row.id);
                                    }}
                                  >
                                    {row[column.id]}
                                  </td>
                                );
                              }
                            })}
                            <td style={{ borderRadius: "0 10px 10px 0" }}>
                              <div className="flex gap-4">
                                <VisibilityIcon
                                  sx={{
                                    color: "#2563eb", // Blue
                                    cursor: "pointer",
                                    "&:hover": {
                                      color: "#1d4ed8", // Dark Blue on hover
                                    },
                                  }}
                                  onClick={() => {
                                    history.push(`/saleView/${row.id}`);
                                  }}
                                />
                                <FaFilePdf
                                  className="w-5 h-5 primary hover:text-secondary cursor-pointer"
                                  onClick={() => pdfGenerator(row.id)}
                                />
                                {hasPermission(permissions, "sale whatsapp bill status check") && (
                                  <IoLogoWhatsapp
                                    className="w-5 h-5 primary hover:text-secondary cursor-pointer"
                                    onClick={() => handleWhatsAppmsg(row)}
                                  />
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}


          </div>

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

          <Dialog
            open={openAddPopUp}
            className="order_list_ml custom-dialog"
            sx={{
              "& .MuiDialog-container": {
                "& .MuiPaper-root": {
                  width: "50%",
                  height: "50%",
                  maxWidth: "500px",
                  maxHeight: "80vh",
                  overflowY: "auto",
                },
              },
            }}
          >
            <DialogTitle id="alert-dialog-title" style={{ fontWeight: 700 }}>
              Generate PDF
            </DialogTitle>
            <IconButton
              aria-label="close"
              onClick={() => {
                setOpenAddPopUp(false);
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
                  className="flex"
                  style={{ flexDirection: "column", gap: "19px" }}
                >
                  <div className="flex gap-10">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                      }}
                    >
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                        <div className="flex flex-col md:flex-row w-full gap-2">
                          <div style={{ width: "100%" }}>
                            <span className="primary block">Start Date</span>
                            <div style={{ width: "100%" }}>
                              <DatePicker
                                className="custom-datepicker"
                                selected={PdfstartDate}
                                onChange={(newDate) =>
                                  setPdfStartDate(newDate)
                                }
                                dateFormat="dd/MM/yyyy"
                              />
                            </div>
                          </div>
                          <div style={{ width: "100%" }}>
                            <span className="primary block">End Date</span>
                            <div style={{ width: "100%" }}>
                              <DatePicker
                                className="custom-datepicker"
                                selected={PdfendDate}
                                onChange={(newDate) => setPdfEndDate(newDate)}
                                dateFormat="dd/MM/yyyy"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContentText>
            </DialogContent>
            <DialogActions style={{ padding: "20px 24px" }}>
              <Button
                autoFocus
                variant="contained"
                className="p-5"
                style={{
                  background: "var(--COLOR_UI_PHARMACY)",
                  color: "white",
                }}
                onClick={() => {
                  AllPDFGenerate();
                }}
               disabled={isDownloadLoading}>
{isDownloadLoading ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color:"#fff" }}>
              <CircularProgress size={16} style={{ color: "white" }} />
              Downloading...
            </span>
          ) : (
            <>
              
                generate
              
            </>
          )}
</Button>
              <Button
                autoFocus
                variant="contained"
                onClick={() => {
                  setOpenAddPopUp(false);
                }}
                color="error"
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </div>

      </div>
    </>
  );
};
export default Salelist;
