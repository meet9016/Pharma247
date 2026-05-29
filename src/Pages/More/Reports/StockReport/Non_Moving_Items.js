import Header from "../../../Header";
import {
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  MenuList,
  Select,
  TextField,
} from "@mui/material";
import { BsLightbulbFill } from "react-icons/bs";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import dayjs from "dayjs";
import axios from "axios";
import { saveAs } from "file-saver";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Loader from "../../../../componets/loader/Loader";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
const Non_Moving_items = () => {
  const history = useHistory();
  const [nonMovingDate, setNonMovingDate] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");
  const rowsPerPage = 10;
  const [nonMovingItemData, setNonMovingItemData] = useState([]);
  const excelIcon = process.env.PUBLIC_URL + "/excel.png";
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};
    if (!nonMovingDate) {
      newErrors.nonMovingDate = "Select any Time Duration.";
      toast.dismiss();
      toast.error(newErrors.nonMovingDate);
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlefilterData = async () => {
    if (validateForm()) {
      let data = new FormData();
      const params = {
        days: nonMovingDate,
      };
      try {
        const response = await axios.post("non-moving-items?", data, {
          params: params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setIsLoading(false);
        setNonMovingItemData(response.data.data);

        const items = response.data.data;
        if (items.length === 0) {
          console.warn("No data returned from API");
          return;
        }

        // Extract headers from the first item
        const headers = Object.keys(items[0]);
        // Map data to arrays
        const csvData = items.map((item) =>
          headers.map((header) => item[header])
        );

        // Combine headers and data
        const csv = [
          headers.join(","), // headers row
          ...csvData.map((row) => row.join(",")), // data rows
        ].join("\n");

        // Create a Blob from the CSV string
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

        // Use FileSaver to save the file
        saveAs(blob, "non-moving-items.csv");
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
        <div>
          <div className="p-6"
          >
            <div style={{ display: "flex", gap: "4px" }}>
              <div
                className="report_hdr"
                style={{
                  display: "flex",
                  gap: "7px",
                  alignItems: "center",
                  marginBottom: "15px",
                }}
              >
                <span
                  style={{
                    color: "var(--color2)",
                    display: "flex",
                    fontWeight: 700,
                    fontSize: "20px",
                    cursor: "pointer",
                  }}
                  onClick={() => history.push("/reports")}
                >
                  {" "}
                  Reports
                </span>
                <ArrowForwardIosIcon
                  style={{ fontSize: "18px", color: "var(--color1)" }}
                />
                <span
                  className="report_hdr_txt"
                  style={{
                    color: "var(--color1)",
                    display: "flex",
                    fontWeight: 700,
                    fontSize: "20px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {" "}
                  Non Moving Items Report
                </span>
                <BsLightbulbFill className=" w-6 h-6 secondary hover-yellow" />
              </div>
            </div>
            <div className="IconNonMoving" style={{ background: "white" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div className="img_gst">
                    <img src="../imgpsh_fullsize_anim.png" alt="its a full anim" />
                  </div>
                </div>
              </div>
              <div className="rept_date">
                <div
                  className="flex flex-col gap-2"
                  style={{
                    border: "1px solid lightgray",
                    padding: "25px",
                    borderRadius: "6px",
                  }}
                >
                  <span className="flex  secondary text-lg">
                    Non Moving Time Duration{" "}
                  </span>
                  <TextField
                    autoComplete="off"
                    id="outlined-basic"
                    value={nonMovingDate}
                    sx={{ width: "100%", marginBottom: "1.25rem" }}
                    size="small"
                    onChange={(e) => setNonMovingDate(e.target.value)}
                    variant="outlined"
                    placeholder="Please Enter Days"
                  />
                  <Button
                    variant="contained"
                    className="gap-7 downld_btn_csh mt-5"
                    style={{
                      background: "var(--color1)",
                      color: "white",
                      // paddingLeft: "35px",
                      textTransform: "none",
                      display: "flex",
                    }}
                    onClick={handlefilterData}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <img
                        src="/csv-file.png"
                        className="report-icon absolute mr-10"
                        alt="its a file "
                      />
                    </div>
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Non_Moving_items;
