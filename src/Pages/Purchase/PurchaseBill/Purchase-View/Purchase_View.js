import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import "./Purchase_View.css";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Header from "../../../Header";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../../../../componets/loader/Loader";
import Button from "@mui/material/Button";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import usePermissions, {
  hasPermission,
} from "../../../../componets/permission";
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
import {
  IoArrowBackCircleOutline,
  IoArrowForwardCircleOutline,
} from "react-icons/io5";
import { BsLightbulbFill } from "react-icons/bs";
import { FaArrowDown, FaArrowUp, FaCaretUp, FaFilePdf } from "react-icons/fa6";
import { Modal } from "flowbite-react";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";

const PurchaseView = () => {
  const { id } = useParams();
  const history = useHistory();
  const permissions = usePermissions();
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [header, setHeader] = useState("");
  const [openAddPopUp, setOpenAddPopUp] = useState(false);
  const [roundOffAmount, setRoundOffAmount] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  {/*<=================================================================== get initial data  ===================================================================> */ }

  useEffect(() => {
    purchaseBillList();
  }, []);

  {/*<=============================================================== up down arrow functionality  ===============================================================> */ }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "PageDown" || e.key === "ArrowDown") {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % tableData.length;
        const nextId = tableData[nextIndex]?.id;
        if (nextId) {
          setCurrentIndex(nextIndex);
          history.push(`/purchaseView/${nextId}`);
        }
      } else if (e.key === "PageUp" || e.key === "ArrowUp") {
        e.preventDefault();
        const prevIndex =
          (currentIndex - 1 + tableData.length) % tableData.length;
        const prevId = tableData[prevIndex]?.id;
        if (prevId) {
          setCurrentIndex(prevIndex);
          history.push(`/purchaseView/${prevId}`);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentIndex, tableData, history]);

  useEffect(() => {
    if (tableData.length > 0) {
      const index = tableData.findIndex((item) => item.id == parseInt(id));
      if (index !== -1) {
        setCurrentIndex(index);
        purchaseBillGetByID(parseInt(id));
      }
    }
  }, [id, tableData]);

  {/*<================================================================ get purchase list data  ================================================================> */ }

  const purchaseBillList = async () => {

    let data = new FormData();

    setIsLoading(true);
    try {
      const response = await axios.post("purches-list?", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTableData(response.data.data);
      const index = response.data.data.findIndex((item) => item.id == parseInt(id));
      if (index !== -1) {
        setCurrentIndex(index);
        purchaseBillGetByID(response.data.data[index].id);
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
      setIsLoading(false);
    }
  };

  {/*<==================================================================== generate PDf  ====================================================================> */ }

  const pdfGenerator = async (id) => {
    let data = new FormData();
    data.append("id", id);
    setIsLoading(true);
    try {
      await axios
        .post("purches-pdf-downloads", data, {
          params: { id },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const PDFURL = response.data.data.pdf_url;
          toast.dismiss();
          toast.success(response.data.meassage);

          setIsLoading(false);
          handlePdf(PDFURL);
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


  const handlePdf = (url) => {
    if (typeof url === "string") {

      window.open(url, "_blank");
    } else {
      console.error("Invalid URL for the PDF");
    }
  };

  {/*<===================================================================== get bill details  =====================================================================> */ }

  const purchaseBillGetByID = async (billId = id) => {
    let data = new FormData();
    data.append("id", billId);
    const params = {
      id: billId,
    };
    setIsLoading(true);
    try {
      await axios
        .post("purches-details?", data, {
          params: params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setData(response.data.data);
          setRoundOffAmount(response.data.data.round_off);
          setIsLoading(false);
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

  {/*<====================================================================== total details  ======================================================================> */ }

  return (
    <>
      <Header />

      <div style={{ backgroundColor: 'rgb(240, 240, 240)', height: 'calc(100vh - 120px)', padding: "0px 20px 0px", alignItems: "center", overflow: "auto" }}>

        {/*<===================================================================== Header bottom  =====================================================================> */}

        <div>
          <div className="py-3 sal-rtn-fff sale_view_btns" style={{ display: "flex", gap: "4px" }}>
            <div className="flex flex-row gap-2 " style={{ alignItems: "center" }}>
              <span
                style={{
                  color: "var(--color2)",
                  display: "flex",
                  alignItems: "center",
                  fontWeight: 700,
                  fontSize: "20px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  history.push("/purchase");
                }}
              >
                Purchase
              </span>
              <ArrowForwardIosIcon
                style={{
                  fontSize: "20px",
                  color: "var(--color1)",
                }}
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
                style={{
                  fontSize: "20px",
                  color: "var(--color1)",
                }}
              />
              <span
                style={{
                  color: "var(--color1)",
                  display: "flex",
                  alignItems: "center",
                  fontWeight: 700,
                  fontSize: "20px",
                  whiteSpace: "nowrap",
                }}
              >
                {data.bill_no}
              </span>
              <BsLightbulbFill className="w-6 h-6 secondary hover-yellow" />
            </div>

            {hasPermission(permissions, "purchase bill edit") && (
              <div
                className="flex sale_ve_btnsss"
                style={{ width: "100%", justifyContent: "end", gap: "10px" }}
              >
                {data?.cn_bill_list?.length !== 0 && (
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ backgroundColor: "var(--color1)" }}


                    onClick={() => setOpenAddPopUp(true)}
                  >
                    <AddIcon className="mr-2" />
                    CN View
                  </Button>
                )}

                <Button
                  variant="contained"
                  className="sale_add_btn sale_dnls gap-2"
                  style={{ backgroundColor: "var(--color1)" }}
                  onClick={() => pdfGenerator(id)}
                >
                  <FaFilePdf
                    className="w-5 h-5 hover:text-secondary cursor-pointer"
                  />
                  Download
                </Button>

                {data?.item_list?.length !== 0 && (<Button
                  style={{ background: "var(--color1)" }}
                  variant="contained"
                  className="sale_add_btn sale_dnls"
                  onClick={() => {
                    history.push("/purchaseEdit/" + data.id + "/" + data?.item_list[0].random_number);
                  }}
                >
                  <BorderColorIcon className="w-7 h-6 text-white  p-1 cursor-pointer " />
                  Edit
                </Button>)
                }

              </div>
            )}
          </div>
        </div>

        {/*<===================================================================== top details  =====================================================================> */}

        <div>
          {/* <div className="firstrow flex mt-2 rounded-md p-3" style={{
            backgroundColor: 'rgb(63 98 18 / 11%)',
          }}>
            <div className="detail_main">
              <span className="heading mb-2">SR No.</span>
              <span className="data_bg">{data.sr_no}</span>
            </div>
            <div className="detail_main">
              <span className="heading mb-2 ">Bill Creator</span>
               <span className="data_bg">2 | Owner</span>
              <span className="data_bg capitalize">{data.user_name}</span>
            </div>
            <div className="detail_main">
              <span className="heading mb-2">Bill No.</span>
              <span className="data_bg">{data.bill_no}</span>
            </div>

            <div className="detail_main">
              <span className="heading mb-2">Bill Date</span>
              <span className="data_bg">{data.bill_date}</span>
            </div>
            <div className="detail_main">
              <span className="heading mb-2">Due Date</span>
              <span className="data_bg">{data.due_date}</span>
            </div>
            <div className="detail_main">
              <span className="heading mb-2">Distributer</span>
              <span className="data_bg">{data.distributor_name}</span>
            </div>
            <div className="detail_main">
              <span className="heading mb-2">Payment Type</span>
              <span className="data_bg">{data.payment_type}</span>
            </div>
            <div className="detail_main">
              <span className="heading mb-2">Entery By</span>
              <span className="data_bg">{localStorage.getItem("UserName")}</span>
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
                  SR
                </span> */}
                <span style={{ fontSize: "25px", fontWeight: 700, color: "#3f6212", lineHeight: 1.1 }}>
                  {data.sr_no}
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
                  { label: "Bill Creator", value: data.user_name, cap: true, accent: "#0f172a" },
                  { label: "Bill No", value: data.bill_no, mono: true },
                  { label: "Bill Date", value: data.bill_date },
                  { label: "Due Date", value: data.due_date, },
                  { label: "Distributor", value: data.distributor_name, cap: true },
                  { label: "Payment Type", value: data.payment_type, pill: true },
                  { label: "Entry By", value: localStorage.getItem("UserName"), cap: true },
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
                          color: item.accent || "#0f172a",
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

          {/*<===============================================================  table data  ===============================================================> */}

          <div
            className="overflow-x-auto mt-5"
            style={{
              maxHeight: "670px",
              overflowY: "auto",
              overflowX: "auto",
            }}
          >
            <table className="customtable  w-full border-collapse custom-table" style={{ whiteSpace: 'nowrap', borderCollapse: "separate", borderSpacing: "0 6px" }}>
              <thead>
                <tr>
                  <th style={{ position: "sticky", top: 0, zIndex: 10, background: "#E0E3DC" }}>Item Name</th>
                  <th style={{ position: "sticky", top: 0, zIndex: 10, background: "#E0E3DC" }}>Unit </th>
                  <th style={{ position: "sticky", top: 0, zIndex: 10, background: "#E0E3DC" }}>HSN</th>
                  <th style={{ position: "sticky", top: 0, zIndex: 10, background: "#E0E3DC" }}>Batch </th>
                  <th style={{ position: "sticky", top: 0, zIndex: 10, background: "#E0E3DC" }}>Expiry </th>
                  <th style={{ position: "sticky", top: 0, zIndex: 10, background: "#E0E3DC" }}>MRP </th>
                  <th style={{ position: "sticky", top: 0, zIndex: 10, background: "#E0E3DC" }}>Qty. </th>
                  <th style={{ position: "sticky", top: 0, zIndex: 10, background: "#E0E3DC" }}>Free </th>
                  <th style={{ position: "sticky", top: 0, zIndex: 10, background: "#E0E3DC" }}>PTR </th>
                  <th style={{ position: "sticky", top: 0, zIndex: 10, background: "#E0E3DC" }}>CD% </th>
                  <th style={{ position: "sticky", top: 0, zIndex: 10, background: "#E0E3DC" }}>Sch.Amt </th>
                  <th style={{ position: "sticky", top: 0, zIndex: 10, background: "#E0E3DC" }}>Base </th>
                  <th style={{ position: "sticky", top: 0, zIndex: 10, background: "#E0E3DC" }}>GST% </th>
                  <th style={{ position: "sticky", top: 0, zIndex: 10, background: "#E0E3DC" }}>Loc. </th>
                  <th style={{ position: "sticky", top: 0, zIndex: 10, background: "#E0E3DC" }}>Margin </th>
                  <th style={{ position: "sticky", top: 0, zIndex: 10, background: "#E0E3DC" }}>Net Rate </th>
                  <th style={{ position: "sticky", top: 0, zIndex: 10, background: "#E0E3DC" }}>Amount </th>
                </tr>
              </thead>
              {isLoading ? (
                <div className="loader-container ">
                  <Loader />
                </div>
              ) : (
                <tbody style={{ background: "#3f621217" }}>
                  {data?.item_list?.map((item, index) => (
                    <tr key={index}>
                      <td style={{ borderRadius: "10px 0 0 10px" }}>
                        <div>{item.item_name}</div>
                      </td>
                      <td>{item.weightage || "-"}</td>
                      <td>{item.hsn_code || "-"}</td>
                      <td>{item.batch_number || "-"}</td>
                      <td>{item.expiry || "-"}</td>
                      <td>{item.mrp || "-"}</td>
                      <td>{item.qty || "-"}</td>
                      <td>{item.fr_qty || "-"}</td>
                      <td>{item.ptr || "-"}</td>
                      <td>{item.disocunt || "-"}</td>
                      <td>{item.scheme_account || "-"}</td>
                      <td>{item.base_price || "-"}</td>
                      <td>{item.gst_name || "-"}</td>
                      <td>{item.location || "-"}</td>
                      <td>{item.margin || "-"}</td>
                      <td>{item.net_rate || "-"}</td>
                      <td className="amount" style={{ borderRadius: "0 10px 10px 0" }}>{item.amount || "-"}</td>
                    </tr>
                  ))}
                </tbody>)}
            </table>
          </div>
        </div>

        {/*<================================================================= total bottom details  =================================================================> */}

        <div className="" style={{ background: 'var(--color1)', color: 'white', display: "flex", justifyContent: 'space-between', position: 'fixed', width: '100%', bottom: '0', left: '0', overflow: 'auto' }}>
          {/* <div className="" style={{ display: 'flex', whiteSpace: 'nowrap', left: '0', padding: '20px' }}>
            <div className="gap-2 invoice_total_fld" style={{ display: 'flex' }}>
              <label className="font-bold">Total GST : </label>

              <span style={{ fontWeight: 600 }}>   {data?.total_gst ? data?.total_gst : 0}</span>
            </div>
            <div className="gap-2 invoice_total_fld" style={{ display: 'flex' }}>
              <label className="font-bold">Total Qty : </label>
              <span style={{ fontWeight: 600 }}> {data?.total_qty ? data?.total_qty : 0} {"+"}&nbsp;

                <span className="">
                  {data?.total_free_qty ? data?.total_free_qty : 0} Free
                </span>
              </span>
            </div>
            <div className="gap-2 invoice_total_fld" style={{ display: 'flex' }}>
              <label className="font-bold">Total Base : </label>
              <span style={{ fontWeight: 600 }}>{data?.total_base}</span>
            </div>
            <div className="gap-2 invoice_total_fld" style={{ display: 'flex' }}>
              <label className="font-bold">Total Net Rate : </label>
              <span style={{ fontWeight: 600 }}>&#8377; {data?.total_net_rate} </span>
            </div>
          </div> */}

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "20px",
              padding: "20px",
            }}
          >
            <div
              className="invoice_total_fld"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                minWidth: "180px",
              }}
            >
              <label className="font-bold">Total GST :</label>
              <span style={{ fontWeight: 600 }}>
                {data?.total_gst || 0}
              </span>
            </div>

            <div
              className="invoice_total_fld"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                minWidth: "220px",
              }}
            >
              <label className="font-bold">Total Qty :</label>
              <span style={{ fontWeight: 600 }}>
                {data?.total_qty || 0} + {data?.total_free_qty || 0} Free
              </span>
            </div>

            <div
              className="invoice_total_fld"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                minWidth: "200px",
              }}
            >
              <label className="font-bold">Total Base :</label>
              <span style={{ fontWeight: 600 }}>
                {data?.total_base || 0}
              </span>
            </div>

            <div
              className="invoice_total_fld"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                minWidth: "220px",
              }}
            >
              <label className="font-bold">Total Net Rate :</label>
              <span style={{ fontWeight: 600 }}>
                ₹ {data?.total_net_rate || 0}
              </span>
            </div>
          </div>


          <div style={{ display: 'flex' }}>
            <div
              className="invoice_total_fld"
              style={{
                display: "flex",
                flexDirection: "column",
                alignSelf: "center",
                fontSize: "14px",
              }}
            >
              {/* Previous Bill */}
              <div
                style={{
                  whiteSpace: "nowrap",
                  display: "flex",
                  cursor: "pointer",
                  width: "150px",
                  justifyContent: "space-between",
                }}
                onClick={() => {
                  const prevIndex = (currentIndex - 1 + tableData.length) % tableData.length;
                  const prevId = tableData[prevIndex]?.id;
                  if (prevId) {
                    setCurrentIndex(prevIndex);
                    history.push(`/purchaseView/${prevId}`);
                  }
                }}
              >
                <label style={{ textTransform: "uppercase" }}>Previous Bill</label>
                <FaArrowUp size={20} />
              </div>

              {/* Next Bill */}
              <div
                style={{
                  whiteSpace: "nowrap",
                  display: "flex",
                  cursor: "pointer",
                  width: "150px",
                  justifyContent: "space-between",
                }}
                onClick={() => {
                  const nextIndex = (currentIndex + 1) % tableData.length;
                  const nextId = tableData[nextIndex]?.id;
                  if (nextId) {
                    setCurrentIndex(nextIndex);
                    history.push(`/purchaseView/${nextId}`);
                  }
                }}
              >
                <label style={{ textTransform: "uppercase" }}>Next Bill</label>
                <FaArrowDown size={20} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', padding: '0 20px' }}>
              <div className="gap-2 " onClick={() => setIsModalOpen(!isModalOpen)} style={{ display: "flex", alignItems: "center", cursor: "pointer", whiteSpace: 'nowrap' }}>
                <label className="font-bold">Net Amount : </label>
                <span className="gap-1" style={{ fontWeight: 800, fontSize: "22px", whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }}>{data?.net_amount ? data?.net_amount : 0}
                  <FaCaretUp />
                </span>
              </div>




              <Modal
                show={isModalOpen}
                onClose={() => setIsModalOpen(!isModalOpen)}
                size="lg"
                position="bottom-center"
                className="modal_amount"
                style={{ background: "transparent" }}
              >
                <div style={{ backgroundColor: 'var(--COLOR_UI_PHARMACY)', color: 'white', padding: '20px', fontSize: 'larger', display: "flex", justifyContent: "space-between" }}>
                  <h2 style={{ textTransform: "uppercase" }}>invoice total </h2>
                  <IoMdClose onClick={() => setIsModalOpen(!isModalOpen)} cursor={"pointer"} size={30} />

                </div>
                <div
                  style={{
                    background: "white",
                    padding: "20px",
                    width: "100%",
                    maxWidth: "600px",
                    margin: "0 auto",
                    lineHeight: "2.5rem"
                  }}
                >

                  <div className="" style={{ display: 'flex', justifyContent: "space-between" }}>
                    <label className="font-bold">Total Amount : </label>
                    <span style={{ fontWeight: 600 }}> {data?.total_amount ? data?.total_amount : 0}</span>
                  </div>

                  <div className="" style={{ display: 'flex', justifyContent: "space-between", paddingBottom: '5px' }}>
                    <label className="font-bold">CN Amount : </label>
                    <span style={{ fontWeight: 600, color: "red" }}> {-(parseFloat(data?.cn_amount) || 0).toFixed(2)}</span>
                  </div>

                  <div className="" style={{ display: 'flex', justifyContent: "space-between", paddingBottom: '5px' }}>
                    <label className="font-bold">Round Off : </label>
                    <span style={{ fontWeight: 600 }}> {roundOffAmount === "0.00"
                      ? roundOffAmount
                      : roundOffAmount < 0
                        ? `-${Math.abs(roundOffAmount)}`
                        : `+${Math.abs(roundOffAmount)}`}</span>
                  </div>

                  <div className="" style={{ display: "flex", alignItems: "center", cursor: "pointer", justifyContent: "space-between", borderTop: '2px solid var(--COLOR_UI_PHARMACY)', paddingTop: '5px' }}>

                    <label className="font-bold">Net Amount: </label>
                    <span style={{ fontWeight: 800, fontSize: "22px", color: "var(--COLOR_UI_PHARMACY)" }}>{data?.net_amount ? data?.net_amount : 0}</span>
                  </div>
                </div>
              </Modal>



            </div>
          </div>
        </div>

        {/*<======================================================================== CN Popup  ========================================================================> */}
        {/* CN List PopUp Box */}

        <Dialog className="custom-dialog max-991" open={openAddPopUp}>
          <DialogTitle id="alert-dialog-title" className="secondary">
            Cn Amount List
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
          ><CloseIcon />
          </IconButton>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <div className="bg-white">
                <div className="bg-white">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Bill No</th>
                        <th>Bill Date</th>
                        <th>Amount</th>
                        <th>Adjust CN Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.cn_bill_list?.length === 0 ? (
                        <tr>
                          <td>No data found</td>
                        </tr>
                      ) : (
                        data?.cn_bill_list?.map((row, index) => (
                          <tr key={index}>
                            <td>{row.bill_no}</td>
                            <td>{row.bill_date}</td>
                            <td>{row.total_amount}</td>
                            <td>{row.cn_amount}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions></DialogActions>
        </Dialog>
      </div>

    </>
  );
};
export default PurchaseView;