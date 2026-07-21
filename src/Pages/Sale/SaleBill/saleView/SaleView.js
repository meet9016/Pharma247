import CircularProgress from "@mui/material/CircularProgress";
import Header from "../../../Header";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../../../../componets/loader/Loader";
import Button from "@mui/material/Button";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { useEffect, useState } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import usePermissions, {
  hasPermission,
} from "../../../../componets/permission";
import {
  IoArrowBackCircleOutline,
  IoArrowForwardCircleOutline,
} from "react-icons/io5";
import { BsLightbulbFill } from "react-icons/bs";
import {
  FaArrowDown,
  FaArrowUp,
  FaCaretUp,
  FaFilePdf,
  FaStore,
} from "react-icons/fa6";
import { FaShippingFast, FaWalking } from "react-icons/fa";
import { Modal } from "flowbite-react";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";

const SaleView = () => {
  const permissions = usePermissions();
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloadLoading, setIsDownloadLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [saleData, setSaleData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [totalGST, setTotalGST] = useState();
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentType, setPaymentType] = useState("");
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const history = useHistory();
  const [pickup, setPickup] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    saleBillList();
  }, []);

  const pickupOptions = [
    { id: 1, label: "Counter", icon: <FaStore /> },
    { id: 2, label: "Pickup", icon: <FaWalking /> },
    { id: 3, label: "Delivery", icon: <FaShippingFast /> },
  ];

  const saleBillList = async (currentPage) => {
    setIsLoading(true);
    let data = new FormData();
    data.append("page", currentPage ? currentPage : "");
    try {
      const response = await axios.post("sales-list?", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSaleData(response.data.data);
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
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const index = saleData.findIndex((item) => item.id == parseInt(id));
    if (index !== -1) {
      setCurrentIndex(index);
      saleBillGetByID(saleData[index].id);
    }
  }, [id, saleData]);

  // useEffect(() => {
  //     localStorage.removeItem("RandomNumber")
  // }, [])

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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % saleData.length;
        const nextId = saleData[nextIndex]?.id;
        if (nextId) {
          setCurrentIndex(nextIndex);
          history.push(`/saleView/${nextId}`);
        }
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        const prevIndex =
          (currentIndex - 1 + saleData.length) % saleData.length;
        const prevId = saleData[prevIndex]?.id;
        if (prevId) {
          setCurrentIndex(prevIndex);
          history.push(`/saleView/${prevId}`);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentIndex, saleData, history]);


  const saleBillGetByID = async () => {
    let data = new FormData();
    data.append("sales_id", id);
    data.append("payment_name ", paymentType);

    const params = {
      sales_id: id,
    };
    setIsLoading(true);
    try {
      await axios
        .post("sales-view?", data, {
          params: params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setPaymentType(response.data.data.payment_name);
          setTableData(response.data.data);
          localStorage.setItem("Other_Amount", response.data.data.other_amount);
          setTotalGST(response.data.data.total_gst);
          setTotalAmount(response.data.data.total_amount);
          // setPickup(response.data.data.pickup);

          const selectedPickup = pickupOptions.find(
            (option) => option.label === response.data.data.pickup
          );
          setPickup(selectedPickup);

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

  return (
    <>
      <div>
        <Header />
        {isLoading ? (
          <div className="loader-container ">
            <Loader />
          </div>
        ) : (
          <>
            <div className="p-6"
              style={{
                backgroundColor: "rgb(240, 240, 240)",
                height: "calc(100vh - 125px)",
                alignItems: "center",
                overflow: "auto",
              }}
            >
              <div>
                <div
                  className="sal-rtn-fff mb-4 sale_view_btns"
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
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        history.push("/sale");
                      }}
                    >
                      Sale
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
                      {tableData.bill_no}
                    </span>
                    <BsLightbulbFill className="w-6 h-6 secondary hover-yellow" />
                  </div>
                  {hasPermission(permissions, "sale bill edit") && (
                    <div
                      className="flex sale_ve_btnsss"
                      style={{
                        width: "100%",
                        justifyContent: "end",
                        gap: "10px",
                      }}
                    >
                      {/* <Button variant="contained" style={{ backgroundColor: "var(--color1)" }} > <FaFilePdf className="w-5 h-5 text-gray-700 hover:text-black" onClick={() => pdfGenerator()} style={{ color: 'white' }} />Download PDF</Button> */}

                      <Button
                        variant="contained"
                        className="sale_add_btn sale_dnls gap-2"
                        style={{ backgroundColor: "var(--color1)" }}
                        onClick={() => pdfGenerator(tableData.id)}
                       disabled={isDownloadLoading}>
{isDownloadLoading ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color:"#fff" }}>
              <CircularProgress size={16} style={{ color: "white" }} />
              Downloading...
            </span>
          ) : (
            <>
              
                        <FaFilePdf className="w-5 h-5 hover:text-secondary cursor-pointer" />
                        Download
                      
            </>
          )}
</Button>
                      {tableData?.sales_item?.length !== 0 && (<Button
                        variant="contained"
                        className="sale_add_btn sale_dnls gap-2"
                        style={{ backgroundColor: "var(--color1)" }}
                        onClick={() => {
                          history.push({
                            pathname:
                              "/saleEdit/" +
                              tableData.id +
                              "/" +
                              tableData?.sales_item[0].random_number,
                            state: { paymentType },
                          });
                        }}
                      >
                        <BorderColorIcon className="w-7 h-6 text-white  p-1 cursor-pointer" />
                        Edit
                      </Button>)}

                    </div>
                  )}
                </div>
              </div>

              <div>
                {/* <div
                  className="firstrow flex rounded-md p-3 gap-3 "
                  style={{
                    backgroundColor: "rgb(63 98 18 / 11%)",
                    borderRadius: "10px",
                  }}
                >
                  <div className="detail_main">
                    <span className="heading mb-2">Bill No</span>
                    <span className="data">{tableData.bill_no}</span>
                  </div>
                  <div className="detail_main">
                    <span className="heading mb-2">Bill Date</span>
                    <span className="data">{tableData.bill_date}</span>
                  </div>
                  <div className="detail_main">
                    <span className="heading mb-2">Customer</span>
                    <span className="data">{tableData.customer_name}</span>
                  </div>
                  <div className="detail_main">
                    <span className="heading mb-2">Mobile No.</span>
                    <span className="data">{tableData.mobile_numbr}</span>
                  </div>
                  <div className="detail_main">
                    <span className="heading mb-2">Doctor </span>
                    <span className="data">
                      {tableData.doctor_name || " - "}
                    </span>
                  </div>
                  <div className="detail_main">
                    <span className="heading mb-2">Payment Mode</span>
                    <span className="data">{tableData.payment_name}</span>
                  </div>
                  <div className="detail_main">
                    <span className="heading mb-2">Pickup</span>
                    <span
                      className="data"
                      style={{
                        display: "flex",
                        whiteSpace: "nowrap",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                    >
                      {pickup?.icon} {pickup?.label}
                    </span>
                  </div>
                  <div className="detail">
                    <span className="heading mb-2">Address</span>
                    <span className="data">
                      {tableData.customer_address}

                    </span>
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
                        {tableData.bill_no}
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
                        { label: "Bill Date", value: tableData.bill_date },
                        { label: "Customer", value: tableData.customer_name },
                        { label: "Mobile No.", value: tableData.mobile_numbr },
                        { label: "Doctor", value: tableData.doctor_name || "-" },
                        { label: "Payment Mode", value: tableData.payment_name },
                        {
                          label: "Pickup",
                          value: pickup ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span style={{ color: '#65784a' }}>{pickup.icon}</span>
                              <span>{pickup.label}</span>
                            </span>
                          ) : "-"
                        }
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



                <div
                  className="overflow-x-auto mt-4"
                  style={{
                    maxHeight: "670px",
                    overflowY: "auto",
                    overflowX: "auto",
                  }}
                >
                  <table
                    className="customtable  w-full border-collapse custom-table"
                    style={{
                      whiteSpace: "nowrap",
                      borderCollapse: "separate",
                      borderSpacing: "0 6px",
                    }}
                  >
                    <thead>
                      <tr style={{ whiteSpace: "nowrap" }}>
                        <th style={{ position: "sticky", top: 0, zIndex: 1, background: "#E0E3DC" }}>Item Name</th>
                        <th style={{ position: "sticky", top: 0, zIndex: 1, background: "#E0E3DC" }}>Unit </th>
                        <th style={{ position: "sticky", top: 0, zIndex: 1, background: "#E0E3DC" }}>Batch </th>
                        <th style={{ position: "sticky", top: 0, zIndex: 1, background: "#E0E3DC" }}>Expiry </th>
                        <th style={{ position: "sticky", top: 0, zIndex: 1, background: "#E0E3DC" }}>MRP </th>
                        <th style={{ position: "sticky", top: 0, zIndex: 1, background: "#E0E3DC" }}>Base </th>
                        <th style={{ position: "sticky", top: 0, zIndex: 1, background: "#E0E3DC" }}>GST% </th>
                        <th style={{ position: "sticky", top: 0, zIndex: 1, background: "#E0E3DC" }}>QTY </th>
                        <th style={{ position: "sticky", top: 0, zIndex: 1, background: "#E0E3DC" }}>Order </th>
                        <th style={{ position: "sticky", top: 0, zIndex: 1, background: "#E0E3DC" }}>Loc. </th>
                        <th style={{ position: "sticky", top: 0, zIndex: 1, background: "#E0E3DC" }}>Amount </th>
                      </tr>
                    </thead>
                    <tbody style={{ background: "#3f621217" }}>
                      {tableData?.sales_item?.map((item, index) => (
                        <tr>
                          <td style={{ borderRadius: "10px 0 0 10px" }}>
                            <div className="itemName">{item.iteam_name || "-"}</div>
                          </td>
                          <td>{item.unit || "-"}</td>
                          <td>{item.batch || "-"}</td>
                          <td>{item.exp || "-"}</td>
                          <td>{item.mrp || "-"}</td>
                          <td>{item.base || "-"}</td>
                          <td>{item.gst || "-"}</td>
                          <td>{item.qty || "-"}</td>
                          <td>{item.order || "-"}</td>
                          <td>{item.location || "-"}</td>
                          <td
                            className="amount"
                            style={{ borderRadius: "0 10px 10px 0" }}
                          >
                            {item.net_rate || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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


                {/* <div
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
                      {tableData?.total_gst}{" "}
                    </span>
                  </div>
                  <div
                    className="gap-2 invoice_total_fld"
                    style={{ display: "flex" }}
                  >
                    <label className="font-bold">Total Base : </label>
                    <span style={{ fontWeight: 600 }}>
                      {" "}
                      {tableData?.total_base}{" "}
                    </span>
                  </div>
                  <div
                    className="gap-2 invoice_total_fld"
                    style={{ display: "flex" }}
                  >
                    <label className="font-bold">Profit : </label>
                    <span style={{ fontWeight: 600 }}>
                      &#8377; {tableData?.margin_net_profit} (
                      {Number(tableData?.total_margin).toFixed(2)}%){" "}
                    </span>
                  </div>
                  <div
                    className="gap-2 invoice_total_fld"
                    style={{ display: "flex" }}
                  >
                    <label className="font-bold">Total Net Rate : </label>
                    <span style={{ fontWeight: 600 }}>
                      &#8377; {tableData?.total_net_rate}{" "}
                    </span>
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
                    <span
                      title={String(tableData?.total_gst || 0)}
                      style={{
                        fontWeight: 600,
                      }}
                    >
                      {tableData?.total_gst || 0}
                    </span>
                  </div>

                  <div
                    className="invoice_total_fld"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      minWidth: "180px",
                    }}
                  >
                    <label className="font-bold">Total Base :</label>
                    <span
                      title={String(tableData?.total_base || 0)}
                      style={{
                        fontWeight: 600,
                      }}
                    >
                      {tableData?.total_base || 0}
                    </span>
                  </div>

                  <div
                    className="invoice_total_fld"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      minWidth: "250px",
                    }}
                  >
                    <label className="font-bold">Profit :</label>
                    <span
                      title={String(tableData?.margin_net_profit || 0)}
                      style={{
                        fontWeight: 600,
                      }}
                    >
                      ₹ {tableData?.margin_net_profit || 0} (
                      {Number(tableData?.total_margin || 0).toFixed(2)}%)
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
                    <label className="font-bold">Net Rate :</label>
                    <span
                      title={`₹ ${tableData?.total_net_rate || 0}`}
                      style={{
                        fontWeight: 600,
                      }}
                    >
                      ₹ {tableData?.total_net_rate || 0}
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
                        const prevIndex = (currentIndex - 1 + saleData.length) % saleData.length;
                        const prevId = saleData[prevIndex]?.id;
                        if (prevId) {
                          setCurrentIndex(prevIndex);
                          history.push(`/saleView/${prevId}`);
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
                        const nextIndex = (currentIndex + 1) % saleData.length;
                        const nextId = saleData[nextIndex]?.id;
                        if (nextId) {
                          setCurrentIndex(nextIndex);
                          history.push(`/saleView/${nextId}`);
                        }
                      }}
                    >
                      <label style={{ textTransform: "uppercase" }}>Next Bill</label>
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
                        {tableData?.net_amt}
                        <FaCaretUp />
                      </span>
                    </div>

                    <Modal
                      show={isModalOpen}
                      onClose={toggleModal}
                      size="lg"
                      position="bottom-center"
                      className="modal_amount"
                    // style={{ width: "50%" }}
                    >
                      <div
                        style={{
                          backgroundColor: "var(--COLOR_UI_PHARMACY)",
                          color: "white",
                          padding: "20px",
                          fontSize: "larger",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <h2 style={{ textTransform: "uppercase" }}>
                          invoice total
                        </h2>
                        <IoMdClose
                          onClick={toggleModal}
                          cursor={"pointer"}
                          size={30}
                        />
                      </div>
                      <div
                        style={{
                          background: "white",
                          padding: "20px",
                          width: "100%",
                          maxWidth: "600px",
                          margin: "0 auto",
                          lineHeight: "2.5rem",
                        }}
                      >
                        <div
                          className=""
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <label className="font-bold">Total Amount : </label>
                          <span style={{ fontWeight: 600 }}>
                            {tableData?.total_amount}
                          </span>
                        </div>

                        <div
                          className=""
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            paddingBottom: "5px",
                          }}
                        >
                          <label className="font-bold">Discount (%) : </label>
                          <span style={{ fontWeight: 600, color: "red" }}>
                            {tableData?.discount_amount !== 0 && (
                              <span>
                                {tableData?.discount_amount > 0
                                  ? `-${tableData?.discount_amount}`
                                  : tableData?.discount_amount}
                              </span>
                            )}{" "}
                            ({tableData?.total_discount}%)
                          </span>
                        </div>

                        <div
                          className=""
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            paddingBottom: "5px",
                          }}
                        >
                          <label className="font-bold">Other Amount : </label>
                          <span style={{ fontWeight: 600 }}>
                            {tableData?.other_amount}
                          </span>
                        </div>

                        <div
                          className=""
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            paddingBottom: "5px",
                          }}
                        >
                          <label className="font-bold">Loyalty Points : </label>
                          <span style={{ fontWeight: 600 }}>
                            {tableData?.roylti_point}
                          </span>
                        </div>

                        <div
                          className=""
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            paddingBottom: "5px",
                            borderTop:
                              "1px solid var(--toastify-spinner-color-empty-area)",
                            paddingTop: "5px",
                          }}
                        >
                          <label className="font-bold">Round Off : </label>
                          <span style={{ fontWeight: 600 }}>
                            {!tableData?.round_off ? 0 : tableData?.round_off}
                          </span>
                        </div>

                        <div
                          className=""
                          style={{
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                            justifyContent: "space-between",
                            borderTop: "2px solid var(--COLOR_UI_PHARMACY)",
                            paddingTop: "5px",
                          }}
                        >
                          <label className="font-bold">Net Amount: </label>
                          <span
                            style={{
                              fontWeight: 800,
                              fontSize: "22px",
                              color: "var(--COLOR_UI_PHARMACY)",
                            }}
                          >
                            {tableData?.net_amt}
                          </span>
                        </div>
                      </div>
                    </Modal>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="flex justify-between" style={{ width: '100%', position: 'absolute', bottom: '20px', padding: "0 20px" }}>
                            <span onClick={() => {
                                const prevIndex = (currentIndex - 1 + saleData.length) % saleData.length;
                                const prevId = saleData[prevIndex]?.id;
                                if (prevId) {
                                    history.push(`/saleView/${prevId}`);
                                }
                            }} >
                                <Button className="gap-4" variant="contained" style={{ background: 'var(--color1)', color: 'white', textTransform: 'none', display: 'flex', alignItems: 'center' }} >
                                    <IoArrowBackCircleOutline size={25} color="white" cursor='pointer' />
                                    PREVIOUS BILL</Button>
                            </span>
                            <span onClick={() => {
                                const nextIndex = (currentIndex + 1) % saleData.length;
                                const nextId = saleData[nextIndex]?.id;
                                if (nextId) {
                                    history.push(`/saleView/${nextId}`);
                                }
                            }}>
                                <Button className="gap-4" variant="contained" style={{ background: 'var(--color1)', color: 'white', textTransform: 'none', display: 'flex', alignItems: 'center' }} >
                                    <IoArrowForwardCircleOutline size={25} color="white" cursor='pointer' />
                                    NEXT BILL</Button>
                            </span>
                        </div> */}
          </>
        )}
      </div>
    </>
  );
};
export default SaleView;
