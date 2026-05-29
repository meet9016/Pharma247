import { BsLightbulbFill } from "react-icons/bs";
import Header from "../../Header";
import { Box } from "@mui/material";
import ProfileView from "../ProfileView";
import { useEffect, useState } from "react";
import GetAppIcon from "@mui/icons-material/GetApp";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { format, subDays, addYears } from "date-fns";
import { Button } from "@mui/material";
import Loader from "../../../componets/loader/Loader"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const Plans = () => {
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(false);
  const [togglePage, setTogglePage] = useState(true);
  const [plansDetails, setPlansDetails] = useState([]);
  const [tableData, setTableData] = useState([]);
  const history = useHistory();

  /*<============================================================================== Plans column ==============================================================================> */

  const plansColumns = [
    { id: "email", label: "email", minWidth: 150 },
    { id: "description", label: "description", minWidth: 150 },
    { id: "amount", label: "amount", minWidth: 150 },
    { id: "paid_on", label: "paid_on", minWidth: 150 },
    { id: "method", label: "Payment Mode", minWidth: 150 },
    { id: "description", label: "Description", minWidth: 150 },
  ];

  useEffect(() => {
    if (togglePage) {
      getPlan()
    }
  }, [togglePage]);

  /*<=========================================================== get various dynamic plans details  to render table ===========================================================> */

  const getPlan = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post("list-plan?",{}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status == 200) {
        setPlansDetails(response.data.data);
        setIsLoading(false);
      }
      getPurchaseHistory()
    } catch (error) {
         if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
      console.error("API error:", error);
   

    }finally{
    setIsLoading(false);

    }
  };

  /*<====================================================================== Call razorpay API to get payment ======================================================================> */

  const loadRazorpay = async (plan) => {
    try {
      const key = "rzp_test_qp5ViSvdWQsuNd";
      const name = localStorage.getItem("UserName");
      const contact = localStorage.getItem("contact");
      const email = localStorage.getItem("email");

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => {
        if (!key) {
          toast.dismiss();
          toast.error("Payment key not available");
          return;
        }
        // const remainingTime = Math.floor((timer - Date.now()) / 1000);
        const options = {
          key: key, // Use the fetched key
          amount: Number(plan.annual_price) * 100, // Razorpay expects the amount in paise
          currency: "INR",
          name: "pharma 24*7",
          description: plan.name,
          image: "pharmalogo.webp",
          planId: plan.id,

          handler: function (response) {
            submitPlan(response.razorpay_payment_id, plan.annual_price);
          },
          prefill: {
            name: name,
            contact: contact,
            email: email,
          },
          theme: {
            color: "#628a2f",
          },
          modal: {
            // On modal close
            ondismiss: function () {
              rzp.close();
            },
          },
          timeout: 300, // Razorpay expects timeout in seconds
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      };

      // Append the Razorpay script to the document body
      document.body.appendChild(script);
    } catch (error) {
         if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
      toast.dismiss();
      toast.error(
        error.response?.data?.message || "Failed to fetch payment key"
      );
    }
  };

  /*<========================================================= call backend API to store plans Details after getting success response frm razorpay ====================================> */

  const submitPlan = async (PaymentId, amount) => {

    let data = new FormData();
    data.append("payment_id", PaymentId);
    data.append("payment_date", format(new Date(), "yyyy-MM-dd"));
    data.append("expiry_date", format(addYears(new Date(), 1), "yyyy-MM-dd"));
    data.append("user_id", localStorage.getItem("userId"));
    data.append("plan_name", PaymentId);
    data.append("amount", amount);
    data.append("user_name", localStorage.getItem("UserName"));
    data.append("contact", localStorage.getItem("contact"));
    data.append("email", localStorage.getItem("email"));

    try {
      setIsLoading(true);
      const response = await axios.post("payment-details-store?", data, {
        header: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status == 200) {
        getPurchaseHistory();
        setIsLoading(false);
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
      setIsLoading(false);
    }
  };

  /*<====================================================================== get plans purchase history to render table ================================================================> */


  const getPurchaseHistory = async () => {

    try {
      const response = await axios.get("payment-history?", 
        {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    

      if (response.status == 200) {
        setTableData(response.data.data);
        setIsLoading(false);

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
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <ToastContainer

        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {isLoading ? (
        <div className="loader-container ">
          <Loader />
        </div>
      ) : (
        <Box className="cdd_mn_hdr" sx={{ display: "flex" }}>
          <ProfileView />
          <div className="p-8" style={{ width: '100%', minWidth: '50px' }}>
            <div className="flex justify-between items-center">
              <h1
                className="text-2xl flex items-center primary font-semibold  "
                style={{ marginBottom: "25px" }}
              >
                {togglePage ? "Plans" : "history"}
                <BsLightbulbFill className="ml-3 secondary  hover-yellow" />
              </h1>
              <div className="flex ">
                <Button
                  variant="contained"
                  style={{
                    background: "var(--color1)",
                    color: "white",
                    textTransform: "none",
                    marginBottom: "25px",
                  }}
                  onClick={() => { setTogglePage(!togglePage) }}
                >
                  {togglePage ? "SEE HISTORY" : "SEE PLANS"}
                </Button>
              </div>
            </div>
            {!togglePage ? (
              // <div>
              //   <table className="table-cashManage my-5 p-4">
              <div className="firstrow">
                <div className="overflow-x-auto mt-4 border-t pt-4">
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
                        {plansColumns.map((column) => (
                          <th
                            key={column.id}
                            style={{ minWidth: column.minWidth }}
                          >
                            {column.label}
                          </th>
                        ))}
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody style={{ background: "#3f621217" }}>
                      {tableData?.map((item, index) => (
                        <tr key={index}>
                          {plansColumns.map((column) => (
                            <td key={column.id} style={{ borderRadius: "10px 0 0 10px" }}>{item[column.id]}</td>
                          ))}
                          <td style={{ borderRadius: "0 10px 10px 0" }}>
                            <GetAppIcon className="primary" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <section className="py-8">
                <div className="container mx-auto px-4">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl secondary font-bold plans_hdr_txtsss">
                      Select the Best Pricing Plan for Your Pharmacy
                    </h2>
                  </div>
                  <div
                    className=""
                    style={{
                      display: "flex",
                      gap: "20px",
                      justifyContent: "center",
                      marginTop: "20px",
                    }}
                  ></div>
                  <div className="flex justify-around mt-5 gap-6 plns_cds">
                    {/* Replace the existing pricing cards section with this */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto plns_cds">
                      {plansDetails.map((plan) => (
                        <div
                          key={plan.id}
                          className="border rounded-lg shadow-md bg-white p-6 flex flex-col"
                          style={{ minHeight: '400px' }}
                        >
                          {/* Header Section */}
                          <div className="mb-4 pb-4" style={{ borderBottom: '1px solid #e5e7eb' }}>
                            <h5 className="text-xl font-semibold mb-2">{plan.name}</h5>
                            <h2 className="text-xl secondary font-bold">

                            </h2>
                          </div>

                          {/* Features List - Scrollable */}
                          <ul
                            className="text-sm text-gray-600 space-y-2 mb-6 flex-grow"
                            style={{
                              maxHeight: "280px",
                              overflowY: "auto",
                              paddingRight: "8px",
                            }}
                          >
                            {plan.enable_modules.map((feature, index) => (
                              <li key={index} className="py-1">{feature}</li>
                            ))}
                          </ul>

                          {/* Button - Fixed at Bottom */}
                          <div className="mt-auto">
                            <Button
                              fullWidth
                              onClick={() => loadRazorpay(plan)}
                              style={{
                                padding: '10px 16px',
                                border: '1px solid var(--color1)',
                                color: 'var(--color1)',
                                borderRadius: '8px',
                                fontWeight: '500',
                                textTransform: 'none',
                                transition: 'all 0.3s ease'
                              }}
                              className="hover:bg-[var(--color2)] hover:text-white"
                            >
                              Buy @ {plan.annual_price}/-
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
        </Box>
      )}
    </>
  );
};
export default Plans;
