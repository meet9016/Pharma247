import { useEffect, useState } from "react";

import Loader from "../../../componets/loader/Loader";
import Header from "../../Header";
import ProfileView from "../ProfileView";
import { Box, Switch, TextField, Button, } from "@mui/material";
import { BsLightbulbFill } from "react-icons/bs";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const ReconciliationManage = () => {
  const token = localStorage.getItem("token");
  const history = useHistory()

  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [toggle, setToggle] = useState(false);


  useEffect(() => {
    getData()
  }, []);

  useEffect(() => {
  }, [toggle]);

  const getData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post("reconciliation-iteam-list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data.data;

      setCount(Number(data.iteam_count));

      // Explicitly convert to boolean
      setToggle(data.iss_audit === true || data.iss_audit === "true" || data.iss_audit === 1);
      if (response.data.status === 401) {
        history.push('/');
        localStorage.clear();
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



  const updateReconciliation = async () => {
    const formData = new FormData();
    formData.append("iss_audit", toggle);
    formData.append("iteam_count", count);

    try {
      setIsLoading(true);
      const response = await axios.post("reconciliation-list", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === 200) {
        toast.dismiss();
        toast.success("Updated successfully");
        getData(); // Refresh data after update
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



  const handleRestart = async () => {
    try {
      const response = await axios.post("reconciliation-restart", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.dismiss();
      toast.success("reconciliation restarted")
      if (response.data.status === 401) {
        history.push('/');
        localStorage.clear();
      }
    } catch (error) {
      console.error("API error while updating:", error);
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
        <div className="loader-container">
          <Loader />
        </div>
      ) : (
        <div>
          <Box className="cdd_mn_hdr" sx={{ display: "flex" }}>
            <ProfileView />
            <div className="p-8 w-full">
              <div className="">
                <div>
                  <h1 className="text-2xl flex items-center primary font-semibold p-2 mr-4">
                    Manage Reconciliation Audit
                    <BsLightbulbFill className="ml-4 secondary hover-yellow" />

                  </h1>
                </div>

              </div>

              <div className="flex flex-col items-start mt-6 p-4 bg-white border border-gray-300 rounded-lg shadow-lg pass_boxx_flds">

                <div className="flex flex-row justify-between items-center w-full mb-4">
                  <span className="text-gray-700 font-medium">Daily Item Counts:</span>
                  <TextField
                    autoComplete="off"
                    id="outlined-number"
                    placeholder="Item Count"
                    value={count}
                    type="number"
                    style={{ width: "50px", marginInline: "5px" }}
                    size="small"
                    className="border border-gray-300 rounded px-2 py-1"
                    onChange={(e) => {
                      const newCount = Number(e.target.value);
                      if (newCount > 24) {
                        toast.dismiss();
                        toast.error("can not set more than 24")
                      } else {
                        setCount(newCount);
                      }
                    }}
                  />
                </div>

                {/* Turn On Reconciliation */}
                <div className="flex flex-row justify-between items-center w-full mb-4">
                  <span className="text-gray-700 font-medium">Turn on reconciliation:</span>
                  <Switch
                    checked={toggle}
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
                    onChange={() => {
                      setToggle(!toggle);
                    }}
                  />


                </div>

                {/* Restart Reconciliation */}
                <div className="flex flex-row justify-between items-center w-full mb-4">
                  <span className="text-gray-700 font-medium">Restart reconciliation:</span>
                  <Button
                    variant="contained"
                    style={{
                      background: "var(--color6)",
                      color: "white",
                    }}
                    className="px-4 py-2 text-sm rounded-lg shadow hover:opacity-90"
                    onClick={handleRestart}
                  >
                    Restart
                  </Button>
                </div>

                {/* Submit Button */}
                <div className="w-full mt-2">
                  <Button
                    variant="contained"
                    style={{
                      background: "var(--color1)",
                      color: "white",
                    }}
                    className="w-full py-2 text-sm font-medium rounded-lg shadow hover:opacity-90"
                    onClick={updateReconciliation}
                  >
                    Submit
                  </Button>
                </div>
              </div>

            </div>

          </Box>

        </div>
      )}
    </>
  );
};

export default ReconciliationManage;
