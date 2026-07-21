import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../../Header";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import Loader from "../../../../componets/loader/Loader";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import usePermissions, {
  hasPermission,
} from "../../../../componets/permission";
import { FaArrowDown, FaArrowUp, FaCaretUp, FaFilePdf } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { Modal } from "flowbite-react";
import { toast } from "react-toastify";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

const ReturnView = () => {
  const history = useHistory();
  const token = localStorage.getItem("token");
  const permissions = usePermissions();
  const [currentIndex, setCurrentIndex] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [tableData, setTableData] = useState([]);
  const [IsDelete, setIsDelete] = useState(false);
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [returnData, setReturnData] = useState([]);
  const [roundOff, setRoundOff] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    const index = returnData.findIndex((item) => item.id == parseInt(id));
    if (index !== -1) {
      setCurrentIndex(index);
      returnBillGetByID(returnData[index].id);
    }
  }, [id, returnData]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "PageDown" || e.key === "ArrowDown") {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % returnData.length;
        const nextId = returnData[nextIndex]?.id;
        if (nextId) {
          setCurrentIndex(nextIndex);
          history.push(`/PurchaseReturnView${nextId}`);
        }
      } else if (e.key === "PageUp" || e.key === "ArrowUp") {
        e.preventDefault();
        const prevIndex =
          (currentIndex - 1 + returnData.length) % returnData.length;
        const prevId = returnData[prevIndex]?.id;
        if (prevId) {
          setCurrentIndex(prevIndex);
          history.push(`/PurchaseReturnView${prevId}`);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentIndex, returnData, history]);

  useEffect(() => {
    // returnBillGetByID();
    ReturnBillList();
  }, []);

  const ReturnBillList = async (currentPage) => {
    let data = new FormData();
    data.append("page", currentPage);
    const params = {
      page: currentPage,
    };
    setIsLoading(true);
    try {
      await axios
        .post("purches-return-list?", data, {
          params: params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setReturnData(response.data.data);
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

  const returnBillGetByID = (billId = id) => {
    let data = new FormData();
    data.append("id", billId);
    const params = {
      purches_return_id: billId,
    };
    setIsLoading(true);
    try {
      axios
        .post("purches-return-details?", data, {
          params: params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setTableData(response?.data?.data);
          setRoundOff(response?.data?.data?.round_off);
          setIsLoading(false);
        });
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

  const deleteOpen = (id) => {
    setIsDelete(true);
  };

  const pdfGenerator = async (id) => {
    let data = new FormData();
    data.append("id", id);
    setIsPdfLoading(true);
    try {
      await axios
        .post("purches-return-pdf", data, {
          params: { id },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const PDFURL = response.data.data.pdf_url;
          toast.dismiss();
          toast.success(response.data.meassage);

          setIsPdfLoading(false);
          handlePdf(PDFURL);
        });
    } catch (error) {
      setIsPdfLoading(false);
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



  return (
    <>
      <Header />
      {isLoading ? (
        <div className="loader-container ">
          <Loader />
        </div>
      ) : (
        <div className="p-6"
          style={{
            alignItems: "center",
            overflow: "auto",
          }}
        >
          <div>
            <div
              className="py-3 sal-rtn-fff sale_view_btns"
              style={{ display: "flex", gap: "4px" }}
            >
              <div
                className="flex flex-row gap-2"
                style={{ alignItems: "center" }}
              >
                <span
                  style={{
                    color: "var(--color2)",
                    display: "flex",
                    alignItems: "center",
                    fontWeight: 700,
                    fontSize: "20px",
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                  }}
                  onClick={() => history.push("/purchaseReturn")}
                >
                  Purchase Return
                </span>
                <ArrowForwardIosIcon
                  style={{ fontSize: "20px", color: "var(--color1)" }}
                />
                <span
                  style={{
                    color: "var(--color1)",
                    display: "flex",
                    alignItems: "center",
                    fontWeight: 700,
                    fontSize: "20px",
                  }}
                >
                  View
                </span>
                <ArrowForwardIosIcon
                  style={{ fontSize: "20px", color: "var(--color1)" }}
                />
                <span
                  style={{
                    color: "var(--color1)",
                    display: "flex",
                    alignItems: "center",
                    fontWeight: 700,
                    fontSize: "20px",
                  }}
                >
                  {tableData?.bill_no}
                </span>
              </div>
              {hasPermission(permissions, "purchase return bill edit") && (
                <div
                  className="flex sale_ve_btnsss"
                  style={{ width: "100%", justifyContent: "end", gap: "10px" }}
                >
                  <Button
                    variant="contained"
                    className="sale_add_btn sale_dnls gap-2"
                    style={{ backgroundColor: "var(--color1)", minWidth: 120 }}
                    disabled={isPdfLoading}
                    onClick={() => pdfGenerator(tableData.id)}
                  >
                    {isPdfLoading ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: "#fff", textColor: "#fff" }}>
                        <CircularProgress size={16} style={{ color: "#fff" }} />
                        Downloading...
                      </span>
                    ) : (
                      <>
                        <FaFilePdf className="w-5 h-5 hover:text-secondary cursor-pointer" />
                        Download
                      </>
                    )}
                  </Button>
                  <Button
                    className="sale_add_btn sale_dnls"
                    style={{ backgroundColor: "var(--color1)" }}
                    variant="contained"
                    onClick={() => {
                      history.push("/PurchaseReturnEdit/" + tableData.id);
                    }}
                  >
                    <BorderColorIcon className="w-7 h-6 text-white   p-1 cursor-pointer" />
                    Edit
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div>
            {/* <div
              className="firstrow flex"
              style={{
                backgroundColor: "rgb(63 98 18 / 11%)",
                borderRadius: "10px",
                padding: "2rem",
              }}
            >
              <div className="detail_main">
                <span className="heading">Bill Creator</span>
                <span className="data_bg">{tableData?.user_name}</span>
              </div>
              <div className="detail_main">
                <span className="heading">Bill No</span>
                <span className="data_bg">{tableData?.bill_no} </span>
              </div>
              <div className="detail_main">
                <span className="heading">Bill Date</span>
                <span className="data_bg">{tableData?.bill_date} </span>
              </div>
              <div className="detail_main">
                <span className="heading">start Date</span>
                <span className="data_bg">{tableData?.start_date} </span>
              </div>
              <div className="detail_main">
                <span className="heading">end Date</span>
                <span className="data_bg">{tableData?.end_date} </span>
              </div>
              <div className="detail_main">
                <span className="heading">Remark</span>
                <span className="data_bg">{tableData?.remark} </span>
              </div>
              <div className="detail_main">
                <span className="heading">Distributer</span>
                <span className="data_bg">{tableData?.distributor_name} </span>
              </div>
            </div> */}




            <div className="scroll-wrapper">
              <div
                className="firstrow"
                style={{
                  display: "flex",
                  alignItems: "stretch",
                  marginTop: "0.5rem",
                  background: "#E0E3DC",
                  border: "1px solid #e7ebe0",
                  borderRadius: "12px",
                  boxShadow:
                    "0 1px 2px rgba(15,23,42,0.04), 0 8px 24px -12px rgba(63,98,18,0.15)",
                  overflow: "hidden",
                  position: "relative",

                }}
              >
                {/* Left accent */}
                <div
                  style={{
                    width: "5px",
                    background: "linear-gradient(180deg, #3f6212 0%, #65a30d 50%, #84cc16 100%)",
                    flexShrink: 0,
                  }}
                />

                {/* SR No badge - compact */}
                <div
                  style={{
                    flex: "0 0 auto",
                    minWidth: "62px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "10px 14px",
                    background: "linear-gradient(180deg, #b8c7a1 0%, #a2b687 50%, #8fa46f 100%)",
                    borderRight: "1px solid #e7ebe0",
                  }}
                >
                  {/* <span style={{ fontSize: "0.82rem", color: "#65784a", fontWeight: 700, letterSpacing: "0.05em" }}>
                        Bill No
                      </span> */}
                  <span style={{ fontSize: "25px", fontWeight: 700, color: "#3f6212", lineHeight: 1.1 }}>
                    {tableData?.bill_no || "-"}
                  </span>
                </div>

                {/* Fields */}
                <div
                  style={{
                    flex: 1,
                    display: "grid",
                    gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
                    alignItems: "center",
                  }}
                >
                  {[
                    // { label: "Bill No", value: tableData.bill_no, mono: true },
                    { label: "Bill Creator", value: tableData?.user_name || "-" },
                    { label: "Bill Date", value: tableData?.bill_date || "-" },
                    { label: "start Date", value: tableData?.start_date || "-" },
                    { label: "end Date", value: tableData?.end_date || "-" },
                    { label: "Remark", value: tableData?.remark || "-" },
                    { label: "Distributer", value: tableData?.distributor_name || "-" },

                  ].map((item, idx, arr) => (
                    <div
                      key={item.label}
                      className="detail_main"
                      style={{
                        minWidth: 0,
                        padding: "12px 16px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        gap: "4px",
                        borderRight: idx < arr.length - 1 ? "1px solid #7c8d66" : "none",
                        position: "relative",
                      }}
                    >
                      <span
                        className="heading"
                        style={{
                          fontSize: "14px",
                          fontWeight: 700,
                          color: "#3f6212",
                          letterSpacing: "0.01em",
                        }}
                      >
                        {item.label}
                      </span>

                      {item.pill ? (
                        <span
                          style={{
                            alignSelf: "flex-start",
                            fontSize: "0.78rem",
                            fontWeight: 600,
                            color: "#3f6212",
                            background: "#ecfccb",
                            border: "1px solid #d9f99d",
                            padding: "2px 10px",
                            borderRadius: "999px",
                            textTransform: "capitalize",
                            whiteSpace: "nowrap",
                            maxWidth: "100%",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                          title={String(item.value ?? "")}
                        >
                          {item.value}
                        </span>
                      ) : (
                        <span
                          className="data"
                          style={{
                            fontSize: "15px",
                            fontWeight: 600,
                            color: item.accent || "#000000",
                            // fontFamily: item.mono
                            //   ? "'JetBrains Mono', ui-monospace, monospace"
                            //   : "inherit",
                            textTransform: item.cap ? "capitalize" : "none",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            letterSpacing: item.mono ? "-0.01em" : "normal",
                          }}
                          title={String(item.value ?? "")}
                        >
                          {item.value || "—"}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>







            <div className="overflow-x-auto mt-5">
              <table
                className="customtable  w-full border-collapse custom-table"
                style={{
                  whiteSpace: "nowrap",
                  borderCollapse: "separate",
                  borderSpacing: "0 6px",
                }}
              >
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Unit </th>
                    <th>Batch </th>
                    <th>Expiry </th>
                    <th>MRP </th>
                    <th>Qty. </th>
                    <th>Free </th>

                    <th>PTR </th>
                    <th>CD% </th>
                    <th>GST% </th>
                    <th>Loc </th>
                    <th>Amount </th>
                  </tr>
                </thead>
                {tableData.length == 0 ? (
                  <div
                    colSpan={16}
                    style={{
                      marginTop: "5px",
                      textAlign: "center",
                      fontSize: "16px",
                      fontWeight: 600,
                    }}
                  >
                    No record found
                  </div>
                ) : (
                  <tbody style={{ background: "#3f621217" }}>
                    {tableData?.item_list?.length > 0 ? (
                      tableData.item_list.map((item, index) => (
                        <tr key={index}>
                          <td style={{ borderRadius: "10px 0 0 10px" }}>
                            <div className="itemName">{item?.item_name || "-"}</div>
                          </td>
                          <td>{item?.weightage || "-"}</td>
                          <td>{item?.batch_number || "-"}</td>
                          <td>{item?.expiry || "-"}</td>
                          <td>{item?.mrp || "-"}</td>
                          <td>{item?.qty || "-"}</td>
                          <td>{item?.fr_qty || "-"}</td>
                          <td>{item?.ptr || "-"}</td>
                          <td>{item?.disocunt || "-"}</td>
                          <td>{item?.gst_name || "-"}</td>
                          <td>{item?.location || "-"}</td>
                          <td
                            className="amount"
                            style={{ borderRadius: "0 10px 10px 0" }}
                          >
                            {item?.amount || "-"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={12}
                          style={{
                            textAlign: "center",
                            padding: "20px",
                            fontSize: "16px",
                            fontWeight: 600,
                            color: "#666",
                          }}
                        >
<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px', width: '100%' }}>
  { !isLoading && <img src="/no-data.png" alt="No Items Available" style={{ maxWidth: '300px', height: 'auto' }} /> }
</div>
</td>
                      </tr>
                    )}
                  </tbody>
                )}
              </table>
            </div>

            <div
              className=""
              style={{
                background: "var(--color1)",
                color: "white",
                display: "flex",
                justifyContent: "space-between",
                position: "fixed",
                width: "100%",
                bottom: "0",
                left: "0",
                overflow: "auto",
              }}
            >
              <div
                className=""
                style={{
                  display: "flex",
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

                  <span style={{ fontWeight: 600 }}>
                    {" "}
                    {tableData?.total_gst ? tableData?.total_gst : 0}
                  </span>
                </div>
                <div
                  className="gap-2 invoice_total_fld"
                  style={{ display: "flex" }}
                >
                  <label className="font-bold">Total Qty : </label>
                  <span style={{ fontWeight: 600 }}>
                    {tableData?.total_qty ? tableData?.total_qty : 0}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex" }}>
                <div
                  className="invoice_total_fld"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignSelf: "center",
                    fontSize: "14px",
                  }}
                >
                  <div
                    className=""
                    style={{
                      whiteSpace: "nowrap",
                      display: "flex",
                      cursor: "pointer",
                      width: "150px",
                      justifyContent: "space-between",
                    }}
                    onClick={() => {
                      const prevIndex =
                        (currentIndex - 1 + returnData.length) %
                        returnData.length;
                      const prevId = returnData[prevIndex]?.id;
                      if (prevId) {
                        setCurrentIndex(prevIndex);
                        history.push(`/PurchaseReturnView${prevId}`);
                      }
                    }}
                  >
                    <label style={{ textTransform: "uppercase" }}>
                      Previous Bill
                    </label>
                    <FaArrowUp size={20} />
                  </div>

                  <div
                    className=""
                    style={{
                      whiteSpace: "nowrap",
                      display: "flex",
                      cursor: "pointer",
                      width: "150px",
                      justifyContent: "space-between",
                    }}
                    onClick={() => {
                      const nextIndex = (currentIndex + 1) % returnData.length;
                      const nextId = returnData[nextIndex]?.id;
                      if (nextId) {
                        setCurrentIndex(nextIndex);
                        history.push(`/PurchaseReturnView${nextId}`);
                      }
                    }}
                  >
                    <label style={{ textTransform: "uppercase" }}>
                      Next Bill
                    </label>
                    <FaArrowDown size={20} />
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "0 20px",
                  }}
                >
                  <div
                    className="gap-2 "
                    onClick={toggleModal}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
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
                      {tableData?.due_amount ? `₹${parseFloat(tableData.due_amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "₹0.00"}
                      <FaCaretUp />
                    </span>
                  </div>

                  <Modal
                    show={isModalOpen}
                    onClose={toggleModal}
                    size="md"
                    position="bottom-center"
                    className="modal_amount"
                  >
                    {/* Header */}
                    <div style={{ background: "linear-gradient(135deg, var(--COLOR_UI_PHARMACY) 0%, var(--color2, #2d6a2d) 100%)", color: "white", padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderRadius: "8px 8px 0 0" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <ReceiptLongIcon style={{ fontSize: 20 }} />
                        </div>
                        <div>
                          <div style={{ fontSize: 11, opacity: 0.8, letterSpacing: 1.5, textTransform: "uppercase" }}>Purchase Return</div>
                          <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: 0.5 }}>Invoice Summary</div>
                        </div>
                      </div>
                      <div onClick={toggleModal} style={{ cursor: "pointer", width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <IoMdClose size={20} />
                      </div>
                    </div>

                    {/* Body */}
                    <div style={{ background: "#f8fafc", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 0 }}>
                      {[
                        {
                          label: "Total Amount",
                          icon: <Inventory2Icon style={{ fontSize: 18, color: "var(--COLOR_UI_PHARMACY)" }} />,
                          value: <span style={{ fontWeight: 600, color: "#1e293b" }}>{tableData?.total_amount ? tableData?.total_amount : 0}</span>,
                        },
                        {
                          label: "Other Amount",
                          icon: <AddCircleOutlineIcon style={{ fontSize: 18, color: "#0ea5e9" }} />,
                          value: <span style={{ fontWeight: 600, color: "#0ea5e9" }}>{isNaN(Number(tableData?.other_amount)) ? tableData?.other_amount || "N/A" : Number(tableData?.other_amount).toFixed(2)}</span>,
                        },
                        {
                          label: "Total Net Rate",
                          icon: <TrendingDownIcon style={{ fontSize: 18, color: "#e53e3e" }} />,
                          value: <span style={{ fontWeight: 600, color: "#e53e3e" }}>{tableData?.total_net_rate ? tableData?.total_net_rate : 0}</span>,
                        },
                        {
                          label: "Round Off",
                          icon: <SyncAltIcon style={{ fontSize: 18, color: "#64748b" }} />,
                          value: <span style={{ fontWeight: 600, color: "#64748b" }}>{roundOff === "0.00" ? roundOff : roundOff < 0 ? `-${Math.abs(roundOff)}` : `+${Math.abs(roundOff)}`}</span>,
                          divider: true,
                        },
                      ].map((row, i) => (
                        <div key={i}>
                          {row.divider && <div style={{ borderTop: "1px dashed #cbd5e1", margin: "4px 0" }} />}
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: i % 2 === 0 ? "#ffffff" : "#f1f5f9", borderRadius: 8, marginBottom: 6, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#475569", fontWeight: 600, fontSize: 14 }}>
                              {row.icon}{row.label}
                            </div>
                            {row.value}
                          </div>
                        </div>
                      ))}

                      {/* Net Amount */}
                      <div style={{ marginTop: 10, background: "linear-gradient(135deg, var(--COLOR_UI_PHARMACY) 0%, var(--color2, #2d6a2d) 100%)", borderRadius: 12, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 4px 15px rgba(0,0,0,0.15)" }}>
                        <div style={{ color: "rgba(255,255,255,0.85)", fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
                          <CurrencyRupeeIcon style={{ fontSize: 18 }} /> Net Amount Payable
                        </div>
                        <div style={{ color: "white", fontWeight: 800, fontSize: 24, letterSpacing: 0.5, display: "flex", alignItems: "baseline", gap: 2 }}>
                          <span style={{ fontSize: 16, fontWeight: 600, opacity: 0.9 }}>₹</span>
                          {tableData?.due_amount ? Number(tableData.due_amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}
                        </div>
                      </div>
                    </div>
                  </Modal>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReturnView;
