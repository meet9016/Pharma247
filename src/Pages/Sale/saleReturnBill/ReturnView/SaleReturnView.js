import Header from "../../../Header";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../../../../componets/loader/Loader";
import Button from "@mui/material/Button";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { useEffect, useState } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { BsLightbulbFill } from "react-icons/bs";
import usePermissions, {
  hasPermission,
} from "../../../../componets/permission";
import {
  IoArrowBackCircleOutline,
  IoArrowForwardCircleOutline,
} from "react-icons/io5";
import { FaArrowDown, FaArrowUp, FaCaretUp, FaFilePdf } from "react-icons/fa6";
import { Modal } from "flowbite-react";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";

const SaleReturnView = () => {
  const [tableData, setTableData] = useState([]);
  const [saleReturnData, setSaleReturnData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const permissions = usePermissions();
  const [currentIndex, setCurrentIndex] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    saleReturnBillList();
  }, []);

  useEffect(() => {
    const index = saleReturnData.findIndex((item) => item.id == parseInt(id));
    if (index !== -1) {
      setCurrentIndex(index);
      saleReturnBillGetByID(saleReturnData[index].id);
    }
  }, [id, saleReturnData]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % saleReturnData.length;
        const nextId = saleReturnData[nextIndex]?.id;
        if (nextId) {
          setCurrentIndex(nextIndex);
          history.push(`/SaleReturnView/${nextId}`);
        }
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        const prevIndex =
          (currentIndex - 1 + saleReturnData.length) % saleReturnData.length;
        const prevId = saleReturnData[prevIndex]?.id;
        if (prevId) {
          setCurrentIndex(prevIndex);
          history.push(`/SaleReturnView/${prevId}`);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentIndex, saleReturnData, history]);

  const pdfGenerator = async (id) => {
    let data = new FormData();
    data.append("id", id);
    setIsLoading(true);
    try {
      await axios
        .post("sale-return-pdf-downloads", data, {
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

  const saleReturnBillList = async (currentPage) => {
    setIsLoading(true);
    let data = new FormData();
    data.append("page", currentPage);
    try {
      await axios
        .post("sales-return-list?", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setSaleReturnData(response.data.data);
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

  const saleReturnBillGetByID = async (billId = id) => {
    let data = new FormData();
    data.append("id", billId);
    const params = {
      id: billId,
    };
    setIsLoading(true);
    try {
      await axios
        .post("sales-return-view-details?", data, {
          params: params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setTableData(response.data.data);
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

  return (
    <>
      <div>
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
                  backgroundColor: "rgba(153, 153, 153, 0.1)",
                  height: "calc(100vh - 130px)",
                  alignItems: "center",
                  overflow: "auto",
                }}
              >
                <div>
                  <div
                    className="mb-4 sal-rtn-fff sale_view_btns"
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
                          minWidth: "105px",
                          flexWrap: "nowrap",
                          whiteSpace: "nowrap",
                        }}
                        onClick={() => {
                          history.push("/saleReturn");
                        }}
                      >
                        Sale Return
                      </span>
                      <ArrowForwardIosIcon
                        style={{ fontSize: "20px", color: "var(--color1)" }}
                      />
                      <span
                        style={{
                          color: "var(--color1)",
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
                          alignItems: "center",
                          fontWeight: 700,
                          fontSize: "20px",
                        }}
                      >
                        {tableData.bill_no}
                      </span>
                      <BsLightbulbFill className="w-6 h-6 secondary hover-yellow" />
                    </div>
                    {hasPermission(permissions, "sale return bill edit") && (
                      <div
                        className="flex sale_ve_btnsss"
                        style={{
                          width: "100%",
                          justifyContent: "end",
                          gap: "10px",
                        }}
                      >
                        <Button
                          variant="contained"
                          className="sale_add_btn sale_dnls gap-2"
                          style={{ backgroundColor: "var(--color1)" }}
                          onClick={() => pdfGenerator(tableData.id)}
                        >
                          <FaFilePdf className="w-5 h-5 hover:text-secondary cursor-pointer" />
                          Download
                        </Button>

                        <Button
                          variant="contained"
                          style={{ backgroundColor: "var(--color1)" }}
                          className="sale_add_btn sale_dnlssale_dnls gap-2"
                          onClick={() => {
                            history.push("/SaleReturnEdit/" + tableData.id);
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
                  <div
                    className="firstrow flex rounded-md p-3 gap-3 "
                    style={{
                      backgroundColor: "rgb(63 98 18 / 11%)",
                    }}
                  >
                    <div className="detail_main">
                      <span className="heading">Bill No</span>
                      <span className="data">{tableData.bill_no}</span>
                    </div>
                    <div className="detail_main">
                      <span className="heading">Bill Date</span>
                      <span className="data">{tableData.bill_date}</span>
                    </div>
                    <div className="detail_main">
                      <span className="heading">Customer </span>
                      <span className="data">{tableData.customer_name}</span>
                    </div>
                    <div className="detail_main">
                      <span className="heading">Mobile No.</span>
                      <span className="data">{tableData.customer_number}</span>
                    </div>
                    <div className="detail_main">
                      <span className="heading">Doctor </span>
                      <span className="data">
                        {tableData.doctor_name || "-"}
                      </span>
                    </div>
                    <div className="detail_main">
                      <span className="heading">Payment Mode</span>
                      <span className="data">{tableData.payment_name}</span>
                    </div>
                  </div>
                  <div className="overflow-x-auto mt-5">
                    <table
                      className="customtable w-full border-collapse custom-table"
                      style={{
                        whiteSpace: "nowrap",
                        borderCollapse: "separate",
                        borderSpacing: "0 6px",
                      }}
                    >
                      <thead>
                        <tr style={{ whiteSpace: "nowrap" }}>
                          <th>Item Name</th>
                          <th>Unit </th>
                          <th>Batch </th>
                          <th>Expiry </th>
                          <th>MRP </th>
                          <th>Base </th>
                          <th>GST% </th>
                          <th>QTY </th>
                          {/* <th >Order  </th> */}
                          <th>Loc. </th>
                          <th>Amount </th>
                        </tr>
                      </thead>
                      <tbody style={{ background: "#3f621217" }}>
                        {tableData?.sales_retur_view?.map((item, index) => (
                          <tr>
                            <td style={{ borderRadius: "10px 0 0 10px" }}>
                              <div className="itemName">{item.iteam_name}</div>
                            </td>
                            <td>{item.unit}</td>
                            <td>{item.batch}</td>
                            <td>{item.exp}</td>
                            <td>{item.mrp}</td>
                            <td>{item.base}</td>
                            <td>{item.gst}</td>
                            <td>{item.qty}</td>
                            {/* <td>{item.order}</td> */}
                            <td>{item.location}</td>
                            <td
                              className="amount"
                              style={{ borderRadius: "0 10px 10px 0" }}
                            >
                              {item.net_rate}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* <div className="flex gap-10 justify-end mt-4 flex-wrap mr-10"  >
                                        <div style={{ display: 'flex', gap: '25px', flexDirection: 'column' }}>
                                            <label className="font-bold">Total GST : </label>
                                            <label className="font-bold">Total Base : </label>
                                            <label className="font-bold">Profit : </label>
                                            <label className="font-bold">Total Net Rate : </label>
                                        </div>
                                        <div className="totals mr-5" style={{ display: 'flex', gap: '25px', flexDirection: 'column', alignItems: "end" }}>
                                            <span style={{ fontWeight: 600 }}> {tableData?.total_gst} </span>
                                            <span style={{ fontWeight: 600 }}> {tableData?.total_base} </span>
                                            <span style={{ fontWeight: 600 }}>  &#8377; {tableData?.margin_net_profit}({Number(tableData?.total_margin).toFixed(2)} %)   </span>
                                            <span style={{ fontWeight: 600 }}>  &#8377; {tableData?.total_net_rate} </span>
                                        </div>

                                        <div style={{ display: 'flex', gap: '25px', flexDirection: 'column' }}>
                                            <label className="font-bold">Total Amount : </label>
                                            <label className="font-bold">Other Amount : </label>
                                            <label className="font-bold">Round Off : </label>
                                            <label className="font-bold" >Net Amount : </label>
                                        </div>
                                        <div className="mr-5" style={{ display: 'flex', gap: '24px', flexDirection: 'column', alignItems: "end" }}>
                                            <span style={{ fontWeight: 600 }}>{tableData?.mrp_total}</span>
                                         
                                            <span style={{ fontWeight: 600 }}>{tableData?.other_amount}</span>
                                            <span style={{ fontWeight: 600 }}>{Number(tableData?.round_off || 0).toFixed(2)}</span>
                                            <span style={{ fontWeight: 800, fontSize: '22px', color: "Green" }}>{tableData?.net_amount}</span>
                                        </div>
                                    </div> */}
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
                    overflow: "auto",
                    bottom: "0",
                    left: "0",
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
                        {" "}
                        &#8377; {tableData?.margin_net_profit}(
                        {Number(tableData?.total_margin).toFixed(2)} %){" "}
                      </span>
                    </div>
                    <div
                      className="gap-2 invoice_total_fld"
                      style={{ display: "flex" }}
                    >
                      <label className="font-bold">Total Net Rate : </label>
                      <span style={{ fontWeight: 600 }}>
                        {" "}
                        &#8377; {tableData?.total_net_rate}{" "}
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
                            (currentIndex - 1 + saleReturnData.length) %
                            saleReturnData.length;
                          const prevId = saleReturnData[prevIndex]?.id;
                          if (prevId) {
                            setCurrentIndex(prevIndex);
                            history.push(`/SaleReturnView/${prevId}`);
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
                          const nextIndex =
                            (currentIndex + 1) % saleReturnData.length;
                          const nextId = saleReturnData[nextIndex]?.id;
                          if (nextId) {
                            setCurrentIndex(nextIndex);
                            history.push(`/SaleReturnView/${nextId}`);
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
                          {tableData?.net_amount}
                          <FaCaretUp />
                        </span>
                      </div>

                      <Modal
                        show={isModalOpen}
                        onClose={toggleModal}
                        size="lg"
                        position="bottom-center"
                        className="modal_amount custom_modal"
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
                              {tableData?.mrp_total}
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
                              borderTop:
                                "1px solid var(--toastify-spinner-color-empty-area)",
                              paddingTop: "5px",
                            }}
                          >
                            <label className="font-bold">Round Off : </label>
                            <span style={{ fontWeight: 600 }}>
                              {Number(tableData?.round_off || 0).toFixed(2)}
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
                              {tableData?.net_amount}
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
                                    const prevIndex = (currentIndex - 1 + saleReturnData.length) % saleReturnData.length;
                                    const prevId = saleReturnData[prevIndex]?.id;
                                    if (prevId) {
                                        history.push(`/SaleReturnView/${prevId}`);
                                    }
                                }} >
                                    <Button className="gap-4" variant="contained" style={{ background: 'var(--color1)', color: 'white', textTransform: 'none', display: 'flex', alignItems: 'center' }} >

                                        <IoArrowBackCircleOutline size={25} color="white" cursor='pointer' />
                                        PREVIOUS BILL
                                    </Button>
                                </span>
                                <span onClick={() => {
                                    const nextIndex = (currentIndex + 1) % saleReturnData.length;
                                    const nextId = saleReturnData[nextIndex]?.id;
                                    if (nextId) {
                                        history.push(`/SaleReturnView/${nextId}`);
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
      </div>
    </>
  );
};
export default SaleReturnView;
