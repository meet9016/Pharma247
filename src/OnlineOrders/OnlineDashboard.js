import React, { useEffect, useState } from 'react';
import Header from '../Pages/Header';
import { Button } from "@mui/material";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import Loader from '../componets/loader/Loader';
import { BsLightbulbFill } from "react-icons/bs";
import axios from "axios";
import ConfirmedOrder from "./ConfirmedOrder";
import ReadyForPickup from "./ReadyForPickup";
import Delivered from "./Completed";
import Rejected from "./Cancelled";
import AssignedPharmacy from "./AssignedPharmacy";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const OnlineDashboard = () => {

  const history = useHistory();

  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState(1);
  const token = localStorage.getItem("token");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [billData, setBilldata] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    orderdata();
    // eslint-disable-next-line
  }, [currentPage, selectedStatus]);

  const statusOptions = [
    { id: "", value: "All Orders", count: billData.length },
    { id: "1", value: "Assigned Pharmacy", count: 0 },
    { id: "2", value: "Cancel By Customer", count: 0 },
    { id: "4", value: "Confirmed Orders", count: 0 },
    { id: "5", value: "Ready For Pickup", count: 0 },
    { id: "6", value: "Completed", count: 0 },
    { id: "3", value: "Cancel By Pharmacy", count: 0 },
  ];

  const orderdata = async () => {
    let data = new FormData();
    data.append("order_status", selectedStatus);
    data.append("page", currentPage);
    try {
      setIsLoading(true);
      await axios
        .post("chemist-order-list?", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setIsLoading(false);
          setBilldata(response.data.data);
          const records = response?.data?.total_records;
          const pages = Math.ceil(Number(records) / 10);
          setTotalPages(pages);
        });
    } catch (error) {
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

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
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

  const getStatusBadgeStyle = (status) => {
    const baseStyle = "px-3 py-1 rounded-full text-xs font-medium";
    const statusClassMap = {
      "Assigned Pharmacy": "bg-blue-100 text-blue-800",
      "Order Confirmed": "bg-yellow-100 text-yellow-800",
      "Ready For Pickup": "bg-orange-100 text-orange-800",
      "Completed": "bg-emerald-100 text-emerald-800",
      "Cancelled By Customer": "bg-red-100 text-red-800",
      "Cancelled By Pharmacy": "bg-red-100 text-red-800",
    };
    return `${baseStyle} ${statusClassMap[status] || "bg-gray-100 text-gray-800"}`;
  };


  const getButtonStatusStyle = (statusId) => {
    const classMap = {
      "1": "bg-blue-100 text-blue-800 hover:bg-blue-200",
      "4": "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
      "5": "bg-orange-100 text-orange-800 hover:bg-orange-200",
      "6": "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
      "2": "bg-red-100 text-red-800 hover:bg-red-200",
      "3": "bg-red-100 text-red-800 hover:bg-red-200",
      "": "bg-gray-100 text-gray-700 hover:bg-gray-200", // All orders
    };
    return classMap[statusId] || "bg-gray-100 text-gray-700 hover:bg-gray-200";
  };


  {/*<========================================================================= ui ===================================================================> */ }

  return (
    <div>
      <Header />

      {isLoading ? (
        <div className="loaderdash">
          <Loader />
        </div>
      ) : (
        <div
          className="p-4"
          style={{ background: "rgb(231 230 230 / 36%)", height: "100%" }}
        >
          <div
            className="flex flex-col h-full w-full md:w-1/2"
            style={{ width: "100%" }}
          >
            <div className="flex  justify-between items-center">
              <div
                className="flex flex-row gap-2"
                style={{ alignItems: "center" }}
              >
                <div className='cursor-pointer' onClick={() => setSelectedOrder(null)}>
                  <h1 className="text-xl  flex items-center primary font-semibold  text-nowrap">
                    Online Orders
                  </h1>
                </div>

                <ArrowForwardIosIcon
                  style={{ fontSize: "20px", color: "var(--color1)" }}
                />
                <span className='text-xl flex items-center secondary font-semibold text-nowrap'>
                  {(statusOptions.find((s) => s.id === selectedStatus)?.value) || "All Orders"}
                  <BsLightbulbFill className="ml-2 secondary hover-yellow" />
                </span>
              </div>

              <div className="headerList">
                <Button
                  variant="contained"
                  className="sale_add_pdf"
                  style={{ background: "var(--color1)" }}
                  onClick={() => {
                    history.push("/onlineOrders");
                  }}
                >
                  Settings
                </Button>
              </div>
            </div>

            {/*<========================================================================= status cards ===================================================================> */}

            <div className=" bg-gray-50">
              {selectedOrder ? (
                <div className="p-6">
                  {selectedOrder.status === "Assigned Pharmacy" && (
                    <AssignedPharmacy orderid={selectedOrder.id} />
                  )}
                  {selectedOrder.status === "Order Confirmed" && (
                    <ConfirmedOrder orderid={selectedOrder.id} />
                  )}
                  {selectedOrder.status === "Completed" && (
                    <Delivered orderid={selectedOrder.id} />
                  )}
                  {selectedOrder.status === "Ready For Pickup" && (
                    <ReadyForPickup orderid={selectedOrder.id} />
                  )}
                  {(selectedOrder.status === "Cancelled By Customer" ||
                    selectedOrder.status === "Cancelled By Pharmacy") && (
                      <Rejected orderid={selectedOrder.id} />
                    )}
                </div>
              ) : (
                <div className="p-6">
                  <div
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                    style={{ height: "calc(80vh - 150px)", display: "flex", flexDirection: "column" }}
                  >

                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                        <div className="flex flex-wrap gap-3">
                          {statusOptions.map((status) => (
                            <button
                              key={status.id}
                              onClick={() => {
                                setSelectedStatus(status.id)
                                setCurrentPage(1); // Reset to first page when changing status
                              }}
                              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${selectedStatus === status.id
                                ? "text-white shadow-lg transform scale-105"
                                : getButtonStatusStyle(status.id)
                                }`}
                              style={{
                                backgroundColor: selectedStatus === status.id ? "var(--color1)" : undefined,
                              }}
                            >
                              {status.value}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="overflow-x-auto overflow-y-auto overflow-x-auto flex-grow" style={{ height: "calc(100% - 80px)" }}>
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                          <tr>
                            <th className="text-left px-6 py-2 font-semibold text-gray-800 text-sm">Order ID</th>
                            <th className="text-left px-6 py-2 font-semibold text-gray-800 text-sm">Patient Info</th>
                            <th className="text-left px-6 py-2 font-semibold text-gray-800 text-sm">Date</th>
                            <th className="text-left px-6 py-2 font-semibold text-gray-800 text-sm">Delivery</th>
                            <th className="text-left px-6 py-2 font-semibold text-gray-800 text-sm">Status</th>
                            <th className="text-right px-6 py-2 font-semibold text-gray-800 text-sm">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {billData?.map((order, index) => (
                            <tr
                              key={index}
                              onClick={() => openOrderDetails(order)}
                              className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                            >
                              <td className="px-6 py-2">
                                <div className="font-medium text-gray-900">{order.order_id}</div>
                              </td>
                              <td className="px-6 py-2">
                                <div>
                                  <span className="font-medium text-gray-900">{order.patient_name}</span> (
                                  <span className="text-sm text-gray-500">{order.patient_number}</span>
                                  )
                                </div>
                              </td>
                              <td className="px-6 py-2">
                                <div className="text-sm text-gray-900">{order.date}</div>
                              </td>
                              <td className="px-6 py-2">
                                <div className="text-sm text-gray-900">{order.delivery_status}</div>
                              </td>
                              <td className="px-6 py-2">
                                <span className={getStatusBadgeStyle(order.status)}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="px-6 py-2 text-right">
                                <div>
                                  <div className="font-semibold text-gray-900">&#8377;{order.total_amount}</div>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {billData?.length === 0 && (
                            <tr>
                              <td colSpan="6" className="px-6 py-12 text-center">
                                <div className="text-gray-500">
                                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  <p className="text-lg font-medium">No orders found</p>
                                  <p className="text-sm">Try adjusting your filters</p>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Pagination */}
                  <div
                    className="flex justify-center mt-4"
                    style={{
                      marginTop: "auto",
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "1rem",
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
                    >Next</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OnlineDashboard; 