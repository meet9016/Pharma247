import { useEffect, useState } from "react";
import Loader from "../../../componets/loader/Loader";
import Header from "../../Header";
import ProfileView from "../ProfileView";
import {
  Box,
  Switch,
  TextField,
  Button,
} from "@mui/material";
import { BsLightbulbFill } from "react-icons/bs";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const ONLINE_ORDER_SETTING_KEYS = [
  "accept_online_orders",
  "delivery_online_orders",
  "pickup_online_orders",
  "minimum_order_amount",
  "order_shipping_price",
  "delivery_estimated_time",
  "order_manager",
  "google_location_link",
  "delivery_start_time",
  "delivery_end_time",
  "delivery_executive",
  "pharmacist_number",
  "pharmacy_whatsapp",
  "email",
];

const normalizeSwitchValue = (value) => (String(value) === "1" ? 1 : 0);

const OnlineOrders = () => {
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(false);

  const [settings, setSettings] = useState({
    accept_online_orders: 0,
    delivery_online_orders: 0,
    pickup_online_orders: 0,
    minimum_order_amount: "",
    order_shipping_price: "",
    delivery_estimated_time: "",
    order_manager: "",
    google_location_link: "",
    delivery_start_time: "",
    delivery_end_time: "",
    delivery_executive: "",
    pharmacist_number: "",
    pharmacy_whatsapp: "",
    email: ""
  });

  useEffect(() => {
    getSettingData();
  }, []);

  const getSettingData = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.post("about-get", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data?.data) {
        setSettings((prev) => ({
          ...ONLINE_ORDER_SETTING_KEYS.reduce((updatedSettings, key) => {
            updatedSettings[key] = data.data[key] ?? prev[key];
            return updatedSettings;
          }, {}),
          accept_online_orders: normalizeSwitchValue(data.data.accept_online_orders),
          delivery_online_orders: normalizeSwitchValue(data.data.delivery_online_orders),
          pickup_online_orders: normalizeSwitchValue(data.data.pickup_online_orders),
        }));
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
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async () => {
    const formData = new FormData();
    ONLINE_ORDER_SETTING_KEYS.forEach((key) => {
      formData.append(key, settings[key] ?? "");
    });

    try {
      setIsLoading(true);
      const response = await axios.post("chemist-store-details", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.status === 200) {
        toast.dismiss();
        toast.success("Updated successfully");
        getSettingData();
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <ToastContainer position="top-right" autoClose={5000} />
      {isLoading ? (
        <div className="loader-container">
          <Loader />
        </div>
      ) : (


        <div>
          <Box className="cdd_mn_hdr" sx={{ display: "flex" }}>
            <ProfileView />
            <div className="p-8 w-full">
              <h1 className="text-2xl flex items-center primary font-semibold p-2 mr-4">
                Online Order Setting
                <BsLightbulbFill className="ml-4 secondary hover-yellow" />
              </h1>
              {/* <div className="flex flex-row justify-between">
                <div className="flex flex-col items-start mt-6 p-4 bg-white border border-gray-300 rounded-lg shadow-lg pass_boxx_flds">
                  <div className="flex flex-row justify-between items-center w-full mb-4">
                    <span className="text-gray-700 font-medium">Accept Online Orders :</span>
                    <Switch
                      checked={settings.accept_online_orders === 1}
                      sx={{
                        "& .MuiSwitch-track": {
                          backgroundColor: "lightgray",
                        },
                        "&.Mui-checked .MuiSwitch-track": {
                          backgroundColor: "var(--color1) !important",
                        },
                        "& .MuiSwitch-thumb": {
                          backgroundColor: "var(--color1)",
                        },
                        "&.Mui-checked .MuiSwitch-thumb": {
                          backgroundColor: "var(--color1)",
                        },
                      }}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          accept_online_orders: e.target.checked ? 1 : 0,
                        }))
                      }
                    />
                  </div>

                  <div className="flex flex-row justify-between items-center w-full mb-4">
                    <span className="text-gray-700 font-medium">Home Delivery Online Orders :</span>
                    <Switch
                      sx={{
                        "& .MuiSwitch-track": {
                          backgroundColor: "lightgray",
                        },
                        "&.Mui-checked .MuiSwitch-track": {
                          backgroundColor: "var(--color1) !important",
                        },
                        "& .MuiSwitch-thumb": {
                          backgroundColor: "var(--color1)",
                        },
                        "&.Mui-checked .MuiSwitch-thumb": {
                          backgroundColor: "var(--color1)",
                        },
                      }}
                      checked={settings.delivery_online_orders === 1}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          delivery_online_orders: e.target.checked ? 1 : 0,
                        }))
                      }
                    />
                  </div>

                  <div className="flex flex-row justify-between items-center w-full mb-4">
                    <span className="text-gray-700 font-medium">Store Pickup Online Orders :</span>
                    <Switch
                      sx={{
                        "& .MuiSwitch-track": {
                          backgroundColor: "lightgray",
                        },
                        "&.Mui-checked .MuiSwitch-track": {
                          backgroundColor: "var(--color1) !important",
                        },
                        "& .MuiSwitch-thumb": {
                          backgroundColor: "var(--color1)",
                        },
                        "&.Mui-checked .MuiSwitch-thumb": {
                          backgroundColor: "var(--color1)",
                        },
                      }}
                      checked={settings.pickup_online_orders === 1}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          pickup_online_orders: e.target.checked ? 1 : 0,
                        }))
                      }
                    />
                  </div>

                  <div className="flex flex-row justify-between items-center w-full mb-4">
                    <span className="text-gray-700 font-medium">Minimum Order Amount:</span>
                    <TextField
                      value={settings.minimum_order_amount}
                      type="number"
                      placeholder="Minimum Order Amount"
                      size="small"
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          minimum_order_amount: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="flex flex-row justify-between items-center w-full mb-4">
                    <span className="text-gray-700 font-medium">Delivery Charges:</span>
                    <TextField
                      value={settings.order_shipping_price}
                      type="number"
                      placeholder="Delivery Charges"
                      size="small"
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          order_shipping_price: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="flex flex-row justify-between items-center w-full mb-4">
                    <span className="text-gray-700 font-medium">Estimated Delivery Time (mins):</span>
                    <TextField
                      value={settings.delivery_estimated_time}
                      type="number"
                      placeholder="Estimated Delivery Time"
                      size="small"
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          delivery_estimated_time: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="flex flex-col items-start mt-6 p-4 bg-white border border-gray-300 rounded-lg shadow-lg pass_boxx_flds">
                  <div className="flex flex-row justify-between items-center w-full mb-4">
                    <span className="text-gray-700 font-medium">Pharmacy WhatsApp:</span>
                    <TextField
                      value={settings.pharmacy_whatsapp}
                      size="small"
                      placeholder="Pharmacy WhatsApp"
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          pharmacy_whatsapp: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="flex flex-row justify-between items-center w-full mb-4">
                    <span className="text-gray-700 font-medium">Pharmacy Email:</span>
                    <TextField
                      value={settings.email}
                      size="small"
                      placeholder="Pharmacy Email"
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="flex flex-row justify-between items-center w-full mb-4">
                    <span className="text-gray-700 font-medium">Delivery Executive:</span>
                    <TextField
                      value={settings.delivery_executive}
                      size="small"
                      placeholder="Delivery Executive"
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          delivery_executive: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="flex flex-row justify-between items-center w-full mb-4">
                    <span className="text-gray-700 font-medium">Order Manager:</span>
                    <TextField
                      value={settings.order_manager}
                      size="small"
                      placeholder="Order Manager"
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          order_manager: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="flex flex-row justify-between items-center w-full mb-4">
                    <span className="text-gray-700 font-medium">Delivery Hours From:</span>
                    <TextField
                      value={settings.delivery_start_time}
                      size="small"
                      placeholder="Delivery Hours"
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          delivery_start_time: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="flex flex-row justify-between items-center w-full mb-4">
                    <span className="text-gray-700 font-medium">Delivery Hours To:</span>
                    <TextField
                      value={settings.delivery_end_time}
                      size="small"
                      placeholder="Delivery Hours"
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          delivery_end_time: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div> */}








              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">

                {/* Order Settings */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Order Settings
                    </h3>
                    <p className="text-sm text-gray-500">
                      Configure order and delivery preferences
                    </p>
                  </div>

                  <div className="p-6 space-y-5">

                    <div className="flex justify-between items-center p-4 rounded-xl bg-gray-50">
                      <div>
                        <h4 className="font-medium">Accept Online Orders</h4>
                        <p className="text-xs text-gray-500">
                          Enable customers to place orders online
                        </p>
                      </div>

                      <Switch
                        checked={settings.accept_online_orders === 1}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            accept_online_orders: e.target.checked ? 1 : 0,
                          }))
                        }
                      />
                    </div>

                    <div className="flex justify-between items-center p-4 rounded-xl bg-gray-50">
                      <div>
                        <h4 className="font-medium">Home Delivery</h4>
                        <p className="text-xs text-gray-500">
                          Allow home delivery orders
                        </p>
                      </div>

                      <Switch
                        checked={settings.delivery_online_orders === 1}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            delivery_online_orders: e.target.checked ? 1 : 0,
                          }))
                        }
                      />
                    </div>

                    <div className="flex justify-between items-center p-4 rounded-xl bg-gray-50">
                      <div>
                        <h4 className="font-medium">Store Pickup</h4>
                        <p className="text-xs text-gray-500">
                          Allow pickup from store
                        </p>
                      </div>

                      <Switch
                        checked={settings.pickup_online_orders === 1}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            pickup_online_orders: e.target.checked ? 1 : 0,
                          }))
                        }
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 pt-2">

                      <TextField
                        fullWidth
                        label="Minimum Order Amount"
                        value={settings.minimum_order_amount}
                        type="number"
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            minimum_order_amount: e.target.value,
                          }))
                        }
                      />

                      <TextField
                        fullWidth
                        label="Delivery Charges"
                        value={settings.order_shipping_price}
                        type="number"
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            order_shipping_price: e.target.value,
                          }))
                        }
                      />

                      <TextField
                        fullWidth
                        label="Estimated Delivery Time (mins)"
                        value={settings.delivery_estimated_time}
                        type="number"
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            delivery_estimated_time: e.target.value,
                          }))
                        }
                      />

                    </div>
                  </div>
                </div>

                {/* Contact Settings */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Contact & Delivery Details
                    </h3>
                    <p className="text-sm text-gray-500">
                      Manage communication and delivery information
                    </p>
                  </div>

                  <div className="p-6 grid gap-4">

                    <TextField
                      fullWidth
                      label="Pharmacy WhatsApp"
                      value={settings.pharmacy_whatsapp}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          pharmacy_whatsapp: e.target.value,
                        }))
                      }
                    />

                    <TextField
                      fullWidth
                      label="Pharmacy Email"
                      value={settings.email}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                    />

                    <TextField
                      fullWidth
                      label="Delivery Executive"
                      value={settings.delivery_executive}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          delivery_executive: e.target.value,
                        }))
                      }
                    />

                    <TextField
                      fullWidth
                      label="Order Manager"
                      value={settings.order_manager}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          order_manager: e.target.value,
                        }))
                      }
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <TextField
                        fullWidth
                        label="Delivery Start Time"
                        value={settings.delivery_start_time}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            delivery_start_time: e.target.value,
                          }))
                        }
                      />

                      <TextField
                        fullWidth
                        label="Delivery End Time"
                        value={settings.delivery_end_time}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            delivery_end_time: e.target.value,
                          }))
                        }
                      />
                    </div>

                  </div>
                </div>

              </div>







              <div className="w-full flex">
                <Button
                  variant="contained"
                  style={{
                    background: "var(--color1)",
                    color: "white",
                    width: "150px",
                    marginTop: "50px",
                  }}
                  onClick={updateSettings}
                >
                  Update
                </Button>
              </div>
            </div>
          </Box>
        </div>


      )}
    </>
  );
};

export default OnlineOrders;
