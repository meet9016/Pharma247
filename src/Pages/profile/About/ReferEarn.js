import { BsLightbulbFill } from "react-icons/bs";
import axios from "axios";
import Header from "../../Header";
import ProfileView from "../ProfileView";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Card,
  CardContent,
  Typography,
  TextField,
} from "@mui/material";
import { useEffect, useState, useRef } from "react";
import Loader from "../../../componets/loader/Loader";
import { toast, ToastContainer } from "react-toastify";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { Link } from "react-router-dom/cjs/react-router-dom";
import Lottie from "lottie-react";
import referAndEarn from "./referAndEarn.json";

const ReferEarn = () => {
  const history = useHistory();
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [logData, setLogData] = useState([]);
  const [referralBalance, setReferralBalance] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [Buttonname, setButtonName] = useState("Share");

  const columns = [
    { id: "name", label: "Name", minWidth: 150 },
    { id: "mobile_number", label: "Mobile Number", minWidth: 150 },
    { id: "registration_date", label: "Registration Date", minWidth: 150 },
    { id: "referral_user_plan", label: "Referral User Plan", minWidth: 150 },
  ];

  {/*<============================================================================= get data  ============================================================================> */ }


  useEffect(() => {
    getReferral();
    getLogs();
  }, []);


  const getLogs = () => {
    setIsLoading(true);
    axios
      .get("referral-logs?", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setLogData(response.data.data);
        setIsLoading(false);
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
        setIsLoading(false);
      });
  };

  let getReferral = () => {
    axios
      .post("about-get", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setReferralBalance(response.data.data.referral_balance);
        setReferralCode(response.data.data.login_user_referral_code);
        setTableData(response.data.data.referral_list);
      })
      .catch((error) => {
        console.error("API Error:", error);
           if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
      });
  };
  {/*<============================================================================= ui  ============================================================================> */ }

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
          <Box sx={{ display: "flex" }}>
            <ProfileView />
            <div
              className="p-8  w-full"
              style={{ width: "100%", minWidth: "50px" }}
            >
              <div className="flex justify-between items-center">
                <h1 className="text-2xl flex items-center primary font-semibold  ">
                  Refer
                  <BsLightbulbFill className="ml-4 secondary  hover-yellow" />
                </h1>
              </div>
              <div className="flex flex-row gap-6 justify-evenly p-4 my-5">
                {/* Transaction History */}
                <Card className="rounded-2xl shadow-lg p-4 w-full max-w-2xl">
                  <CardContent>
                    <Typography
                      variant="h6"
                      className="font-bold primary  my-5"
                    >
                      your Balance is : <span> {referralBalance} rs.</span>
                    </Typography>
                    {logData.map((item) => (
                      <div className="flex items-center justify-between p-3 m-2 bg-gray-100 rounded-lg">
                        <div className="flex items-center gap-2">
                          {/* <LocalAtm className="text-green-500" /> */}
                          <div>
                            <Typography className="font-bold">
                              {item.name}
                              <span> → {item.remark.slice(0, 50)} </span>
                            </Typography>
                            {item.add_amount ? (
                              <Typography className="font-bold primary text-sm ">
                                credit
                              </Typography>
                            ) : (
                              <Typography
                                style={{ color: "var(--color6)" }}
                                className="font-bold text-sm "
                              >
                                debit
                              </Typography>
                            )}
                          </div>
                        </div>
                        {item.add_amount ? (
                          <Typography
                            variant="h6"
                            className="font-bold primary"
                          >
                            {item.add_amount} Rs.
                          </Typography>
                        ) : (
                          <Typography
                            style={{ color: "var(--color6)" }}
                            variant="h6"
                            className="font-bold"
                          >
                            {item.lees_amount} Rs.
                          </Typography>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
                {/* Referral Card */}
                <Card className="rounded-2xl shadow-lg p-6 w-full max-w-2xl">
                  <CardContent className="flex flex-col md:flex-row items-center gap-6">
                    <div className="d-flex gap-2 flex-wrap flex-md-nowrap justify-content-between align-items-center">
                      <Lottie
                        className="w-30 "
                        animationData={referAndEarn}
                        loop={true}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Typography
                        variant="h6"
                        className="font-bold text-gray-800 primary"
                      >
                        Earn 50% For Each Friend You Refer
                      </Typography>

                      <div className="flex items-center gap-2 text-gray-600">
                        {/* <DirectionsBus className="text-purple-600" /> */}
                        <Typography>
                          Share the referral link with your friends
                        </Typography>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        {/* <DirectionsBus className="text-purple-600" /> */}
                        <Typography>
                          You will get 50% on their first plan purchase
                        </Typography>
                      </div>
                      <div className="flex justify-between gap-2 mt-2">
                        <TextField
                          value={referralCode}
                          variant="outlined"
                          size="small"
                          className="w-32"
                          InputProps={{
                            readOnly: true,
                          }}
                        />

                        <Button
                          onClick={async () => {
                            const textToCopy = `https://medical.pharma247.in/Register/${referralCode}`;

                            navigator.clipboard.writeText(textToCopy);
                            setButtonName("copied !");

                            setTimeout(() => {
                              setButtonName("share");
                            }, 5000);
                          }}
                          style={{
                            textTransform: "none",
                            color: "white",
                            background: "var(--color1)",
                            width: "50%",
                          }}
                        >
                          {Buttonname}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div
                className="overflow-x-auto border-t mx-14"
                style={{ overflowX: "auto" }}
              >
                <h2 className="text-xl flex items-center primary font-semibold  my-5 ">
                  
                  Referral History
                </h2>
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
                      <th>NO.</th>
                      {columns.map((column, index) => (
                        <th key={index} style={{ minWidth: column.minWidth }}>
                          {column.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody style={{ background: "#3f621217" }}>
                    {tableData?.map((item, rowIndex) => (
                      <tr key={rowIndex}>
                        <td style={{ borderRadius: "10px 0 0 10px" }}>
                          {rowIndex + 1}
                        </td>
                        {columns.map((column, colIndex) => (
                          <td
                            key={column.id}
                            style={
                              colIndex === columns.length - 1
                                ? { borderRadius: "0 10px 10px 0" }
                                : {}
                            }
                          >
                            {item[column.id]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Box>
        </div>
      )}
    </>
  );
};
export default ReferEarn;
