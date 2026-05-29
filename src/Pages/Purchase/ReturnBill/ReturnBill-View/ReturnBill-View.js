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
import usePermissions, {
  hasPermission,
} from "../../../../componets/permission";
import { FaArrowDown, FaArrowUp, FaCaretUp, FaFilePdf } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { Modal } from "flowbite-react";
import { toast } from "react-toastify";

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
    setIsLoading(true);
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
                    style={{ backgroundColor: "var(--color1)" }}
                    onClick={() => pdfGenerator(tableData.id)}
                  >
                    <FaFilePdf className="w-5 h-5 hover:text-secondary cursor-pointer" />
                    Download
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
            <div
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
                    {tableData?.item_list.map((item, index) => (
                      <tr key={index}>
                        <td style={{ borderRadius: "10px 0 0 10px" }}>
                          <div className="itemName">{item?.item_name}</div>
                        </td>
                        <td>{item?.weightage}</td>
                        <td>{item?.batch_number}</td>
                        <td>{item?.expiry}</td>
                        <td>{item?.mrp}</td>
                        <td>{item?.qty}</td>
                        <td>{item?.fr_qty}</td>
                        <td>{item?.ptr}</td>
                        <td>{item?.disocunt}</td>
                        <td>{item?.gst_name}</td>
                        <td>{item?.location}</td>
                        <td
                          className="amount"
                          style={{ borderRadius: "0 10px 10px 0" }}
                        >
                          {item?.amount}
                        </td>
                      </tr>
                    ))}
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
                      {tableData?.due_amount ? tableData?.due_amount : 0}
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
                          {tableData?.total_amount
                            ? tableData?.total_amount
                            : 0}
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
                        <span style={{ fontWeight: 600, color: "red" }}>
                          {" "}
                          {isNaN(Number(tableData?.other_amount))
                            ? tableData?.other_amount || "N/A"
                            : Number(tableData?.other_amount).toFixed(2)}
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
                        <label className="font-bold">Round Off : </label>
                        <span style={{ fontWeight: 600 }}>
                          {" "}
                          {roundOff === "0.00"
                            ? roundOff
                            : roundOff < 0
                              ? `-${Math.abs(roundOff)}`
                              : `+${Math.abs(roundOff)}`}
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
                        <label className="font-bold">Total Net Rate : </label>
                        <span style={{ fontWeight: 600 }}>
                          {tableData?.total_net_rate
                            ? tableData?.total_net_rate
                            : 0}{" "}
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
                          {tableData?.due_amount ? tableData?.due_amount : 0}
                        </span>
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
