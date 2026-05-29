import Header from "../../Header";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import {
  Box,
  Checkbox,
  TextField,
  Button,
  Typography,
  DialogContentText,
  ListItem,
  ListItemText,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { Link, useHistory, } from 'react-router-dom/cjs/react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import Loader from "../../../componets/loader/Loader";
import { BsLightbulbFill } from "react-icons/bs";
import AddIcon from '@mui/icons-material/Add';
import { Textarea } from "@material-tailwind/react";
import { Label } from "@mui/icons-material";

const Reconciliation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");
  const [data, setData] = useState([]);
  const [itemCount, setIteamCount] = useState(0);
  const [isAudit, setIsAudit] = useState("");
  const [status, setStatus] = useState("");
  const [stockData, setStockData] = useState([]);
  const history = useHistory();

  const [role, setRole] = useState('')


  useEffect(() => {
    getItem()
    setRole(localStorage.getItem('role'))

  }, [])

  const handleExit = () => {
    // Redirect to another page (update the route as necessary)
    history.push('/another-page');
  };

  useEffect(() => {
    // Disable back and forward navigation
    window.history.pushState(null, '', window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href);
    };
    window.addEventListener('popstate', handlePopState);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [])

  const handleData = (value, item) => {
    setStockData((prevData) => {
      const existingItemIndex = prevData.findIndex(
        (dataItem) => dataItem.iteam_id === item.id
      );

      if (existingItemIndex !== -1) {
        const updatedData = [...prevData];
        if (value.trim() === "") {
          updatedData.splice(existingItemIndex, 1);
        } else {
          updatedData[existingItemIndex].stock = value;
        }
        return updatedData;
      } else {

        return value.trim() === ""
          ? prevData
          : [...prevData, { iteam_id: item.id, stock: value }];
      }
    });
  };


  let getItem = async () => {

    setIsLoading(true);
    try {
      const res = await axios
        .post("reconciliation-iteam-list?", {}, {

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setData(response.data.data.data);
          const { iteam_count, iss_audit, status } = (response.data.data);

          setIteamCount(iteam_count)
          setIsAudit(iss_audit)
          setStatus(status)


          if (response.data.data.data.length == 0) {
            toast.dismiss();
            toast.error("No Record Found");
          }
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

  let handleSubmit = async () => {
    if (stockData.length != itemCount) {
      toast.dismiss();
      toast.error("Enter all item's stock");
      return;
    }
    setIsLoading(true);

    let data = new FormData();
    data.append("iteam_data", JSON.stringify(stockData));

    try {
      const response = await axios.post("reconciliation-iteam-store?", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === 200) {
        setStockData([])
        localStorage.setItem('reconciliation', "true")
        history.push("/adminDashboard")
        toast.dismiss();
        toast.success("Data submitted successfully");
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("API error:", error);

      toast.dismiss();
      toast.success("Data submitted successfully");
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
    <div >
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
      <div >
        {isLoading ? (
          <Loader />
        ) : (

          < div style={{ padding: '0px 20px 0px' }}>
            <div className='py-3' style={{ display: 'flex', gap: '4px' }}>
              <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                <span className='primary' style={{ display: 'flex', fontWeight: 700, fontSize: '20px', width: '135px' }} >Reconciliation</span>
                <BsLightbulbFill className="w-6 h-6 secondary hover-yellow " />

              </div>
              <div className="headerList">
                <Button style={{
                  background: "var(--color1)",
                }} variant="contained" size='small' onClick={handleSubmit}  >
                  <AddIcon />Submit</Button>


              </div>
              {/* <div className="headerList">
                  <Button style={{
                    background: "var(--color1)",
                  }} variant="contained" size='small' onClick={handleExit}  >
                    <AddIcon />ecdx</Button>

                    
                </div> */}

            </div>

            {isAudit === "true" && role === "Staff" ? (

              <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 place-content-center align-content-center`}>

                {data.slice(0, itemCount).map((item, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-md flex flex-col text"
                    style={{
                      boxShadow: 'rgb(0 0 0 / 8%) 1px 7px 13px'
                    }}
                  >
                    <div className="flex p-3 gap-4">
                      <div className="imgdiv00 w-24 h-24">
                        <img
                          className="w-full h-full object-cover rounded"
                          src={item.front_photo ? item.front_photo : "/tablet.png"}
                          alt="Item"
                        />
                      </div>
                      <div className="cardcontentdiv w-full flex-1">
                        <h2 className="font-bold mb-2">
                          {item.iteam_name.length > 20 ? `${item.iteam_name.substring(0, 20)}...` : item.iteam_name}
                        </h2>
                        <span className="flex justify-between w-full align-center">
                          <p className="inline text-gray-400 text-sm font-normal">
                            1 pack of {item.weightage ? item.weightage : 0} unit
                          </p>
                          <p className="inline text-gray-600 text-sm font-bold">&#8377; {item.mrp ? item.mrp : 0}</p>
                        </span>
                        <span className="flex justify-between items-center w-full gap-2">
                          <p className="">
                            LOC:<span className="primary"> {item.location}</span>
                          </p>
                          <TextField
                            autoComplete="off"
                            id="outlined-number"
                            placeholder="Add Stock"
                            type="number"
                            style={{ width: '110px', marginBlock: '5px' }}
                            size="small"
                            onChange={(e) => handleData(e.target.value, item)}
                          />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center">
                <Typography variant="h6" gutterBottom>
                  {role === "Owner"
                    ? "Reconciliation is not for Owner"
                    : "Reconciliation is not available"}
                </Typography>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
};
export default Reconciliation;
