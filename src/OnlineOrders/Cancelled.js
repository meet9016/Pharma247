import React, { useState, useEffect } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuItem from "@mui/material/MenuItem";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { GoInfo } from "react-icons/go";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { FaUser } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import axios from "axios";
import InputLabel from "@mui/material/InputLabel";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from "@mui/icons-material/Close";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

const Cancelled = ({ orderid }) => {
  const [isLoading, setIsLoading] = useState(false);

  const [value, setValue] = useState(1);

  const token = localStorage.getItem("token");
  const history = useHistory();

  const [orderData, setOrderData] = useState([]);
  const [roleList, setRolelist] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedRider, setSelectedRider] = useState("");


  // Carousel hooks (moved to top level)
  const scrollRef = React.useRef(null);
  const [modal, setModal] = React.useState({ open: false, index: -1 });
  const [imageUrls, setImageUrls] = useState([])

  // Responsive scroll offset
  const getScrollOffset = () => {
    if (window.innerWidth < 640) return 120;
    if (window.innerWidth < 1024) return 160;
    return 200;
  };
  // Scroll by a fixed amount
  const scroll = (offset) => {
    scrollRef.current?.scrollBy({ left: offset, behavior: "smooth" });
  };
  const openModal = (index) => setModal({ open: true, index });
  const closeModal = () => setModal({ open: false, index: -1 });
  const navigate = (direction) => {
    const newIndex = modal.index + direction;
    if (newIndex >= 0 && newIndex < imageUrls.length) {
      setModal((prev) => ({ ...prev, index: newIndex }));
    }
  };
  React.useEffect(() => {
    if (!modal.open) return;
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") navigate(-1);
      if (e.key === "ArrowRight") navigate(1);
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [modal.open, modal.index, imageUrls.length]);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = () => {
    setIsLoading(true);
    axios
      .post("manage-list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setIsLoading(false);
        setRolelist(response.data.data);
      })
      .catch((error) => {
        console.error("API error:", error);
        
           if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
      });
  };

  useEffect(() => {
    orderdata();
  }, [orderid]);

  const orderdata = async () => {
    let data = new FormData();
    data.append("order_id", orderid);
    // data.append("order_status", 0)
    // data.append("start_date", "2025-03-10")
    // data.append("end_date", "2025-03-31")
    // data.append("patient_name", "shailesh")

    try {
      await axios
        .post("patient-order-details?", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setIsLoading(false);
          setOrderData(response.data.data);
          setImageUrls(response.data.data.prescrption_list)
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
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col  rounded-lg shadow-[0_0_16px_rgba(0,0,0,0.16)] my-4">
      <div className="bg-red-500/5 border border-red-600 p-4 rounded-t-xl flex flex-row w-full justify-between items-center shadow-sm">
        <span className="text-lg font-medium text-red-800">
          Orders ID : {orderData?.bill_no}
        </span>
        <span className="text-lg font-medium text-red-800">
          Date/Time : {orderData?.date}
        </span>
        <span className="text-lg font-medium text-red-800">
          Amount : {orderData?.total_amount}
        </span>
      </div>

      <div className="flex flex-row w-full h-full">
        {/* Left: Grid */}
        <div className="grid grid-cols-2 w-1/2 gap-x-8 gap-y-4 p-6 flex-grow overflow-auto">
          <div className="font-semibold">Patient</div>
          <div>{orderData?.patient_name}</div>

          <div className="font-semibold">Patient No</div>
          <div>{orderData?.patient_number}</div>

          <div className="font-semibold">Address</div>
          <div>{orderData?.address}</div>
          <div className="font-semibold">Landmark</div>
          <div>{orderData?.area_landmark}</div>
          <div className="font-semibold">City</div>
          <div>{orderData?.city}</div>
          <div className="font-semibold">Pincode</div>
          <div>{orderData?.pincode}</div>
          <div className="font-semibold">Date</div>
          <div>{orderData?.date}</div>

          <div className="font-semibold">Delivery type</div>
          <div>{orderData?.delivery_status}</div>

          <div className="font-semibold">Payment mode</div>
          <div>{orderData?.payment_method}</div>
          {/* 
          <div className="font-semibold">Patient Location</div>
          <div className="break-all">https://maps.app.goo.gl/LctZArEPAfcqJ</div> */}

          <div className="font-semibold ">Prescription</div>
          {/* --- BEGIN CAROUSEL --- */}
          <div className="relative w-full max-w-full md:max-w-3xl mx-auto" style={{ minHeight: "9rem" }}>
            {imageUrls.length > 1 && (
              <button
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 shadow-lg p-2 md:p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-red-600 bg-white/80 hover:bg-red-700 hover:text-white transition-colors border border-red-200"
                style={{
                  height: "2.5rem",
                  width: "2.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                }}
                onClick={() => scroll(-getScrollOffset())}
                aria-label="Scroll Left"
              >
                <span className="text-lg md:text-xl">
                  <ArrowBackIosIcon fontSize="inherit" />
                </span>
              </button>
            )}

            <div
              ref={scrollRef}
              className="flex  sm:gap-6 overflow-x-auto py-4 px-8 sm:px-12 scrollbar-hide scroll-smooth"
              style={{ scrollBehavior: "smooth" }}
            >
              {imageUrls.map((url, idx) => (
                <img
                  key={url.id || idx}
                  src={url.image}
                  alt={`${idx + 1}`}
                  className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-cover rounded-xl shadow-md cursor-pointer flex-shrink-0 transition-transform hover:scale-105 border border-gray-200 bg-white"
                  onClick={() => openModal(idx)}
                  loading="lazy"
                  style={{ marginRight: idx === imageUrls.length - 1 ? 0 : undefined }}
                />
              ))}
            </div>

            {imageUrls.length > 1 && (
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 shadow-lg p-2 md:p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-red-600 bg-white/80 hover:bg-red-700 hover:text-white transition-colors border border-red-200"
                style={{
                  height: "2.5rem",
                  width: "2.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                }}
                onClick={() => scroll(getScrollOffset())}
                aria-label="Scroll Right"
              >
                <span className="text-lg md:text-xl">
                  <ArrowForwardIosIcon fontSize="inherit" />
                </span>
              </button>
            )}
          </div>

          {modal.open && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-85"
              onClick={closeModal}
            >
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 bg-red-500 opacity-90 shadow-lg p-2 rounded-full z-10 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                onClick={closeModal}
                aria-label="Close"
              >
                <CloseIcon className="text-white font-bold" />
              </button>

              {/* Previous Button */}
              {modal.index > 0 && (
                <button
                  className="absolute left-6 top-1/2 -translate-y-1/2 z-10 shadow-lg p-3 rounded-full bg-white/80 hover:bg-red-700 hover:text-white border border-red-200"
                  onClick={() => navigate(-1)}
                  aria-label="Previous"
                  style={{
                    height: "3rem",
                    width: "3rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <ArrowBackIosIcon fontSize="inherit" />
                </button>
              )}

              {/* Next Button */}
              {modal.index < imageUrls.length - 1 && (
                <button
                  className="absolute right-6 top-1/2 -translate-y-1/2 z-10 shadow-lg p-3 rounded-full bg-white/80 hover:bg-red-700 hover:text-white border border-red-200"
                  onClick={() => navigate(1)}
                  aria-label="Next"
                  style={{
                    height: "3rem",
                    width: "3rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <ArrowForwardIosIcon fontSize="inherit" />
                </button>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white text-xs font-semibold bg-black/60 rounded-xl py-1 px-4">
                {modal.index + 1} / {imageUrls.length}
              </div>

              {/* Modal Image */}
              <div
                className="relative flex flex-col items-center max-w-[94vw] max-h-[88vh]"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={imageUrls[modal.index]?.image}
                  alt={`Preview ${modal.index + 1}`}
                  className="rounded-xl shadow-xl bg-white max-h-[80vh] max-w-[90vw]"
                />
              </div>
            </div>
          )}

          <style jsx>{`
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {/* --- END CAROUSEL --- */}
        </div>

        {/* Right: Button at bottom-right */}
        <div className="w-1/2 flex flex-col justify-between items-end p-6">
          <button
            className="text-white px-4 py-2 rounded-lg shadow  transition-colors"
            onClick={() => window.open(`https://wa.me/91${orderData?.patient_number}`, '_blank')}

            style={{
              backgroundColor: "var(--color1)",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >

            WhatsApp
          </button>


          <button
            className="text-white px-4 py-2 rounded-lg shadow  transition-colors"
            onClick={() => history.push('/purchaseAdd')}
            style={{
              backgroundColor: "var(--color1)",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >

            Purchase
          </button>


        </div>
      </div>
    </div>
  );
};
export default Cancelled;
