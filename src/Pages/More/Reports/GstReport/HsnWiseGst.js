import Header from "../../../Header"
import { Button, FormControl, InputAdornment, InputLabel, MenuItem, MenuList, Select, TextField } from "@mui/material"
import { BsLightbulbFill } from "react-icons/bs"
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import axios from "axios";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Loader from "../../../../componets/loader/Loader";
import { useEffect, useState } from "react";
import DatePicker from 'react-datepicker';
import { addDays, format, subDays, subMonths } from 'date-fns';
import { toast, ToastContainer } from "react-toastify";
const HsnWiseGst = () => {
    const history = useHistory()
    const [nonMovingDate, setNonMovingDate] = useState()
    const [monthDate, setMonthDate] = useState(subMonths(new Date(), 1));

    const [isLoading, setIsLoading] = useState(false);
    const token = localStorage.getItem("token")
    const rowsPerPage = 10;
    const [nonMovingItemData, setNonMovingItemData] = useState([])
    const excelIcon = process.env.PUBLIC_URL + '/excel.png';
    const [errors, setErrors] = useState({})
    const [reportType, setReportType] = useState()
    const validateForm = () => {
        const newErrors = {};
        if (!reportType) {
            newErrors.reportType = 'Select any Report Type.';
            toast.dismiss();
            toast.error(newErrors.reportType)
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlefilterData = async () => {
        if (validateForm()) {
            let data = new FormData();
            const params = {
                date: monthDate ? format(monthDate, 'MM-yyyy') : '',
                type: reportType,
            };
            try {
                const response = await axios.post('gst-hsn-report?', data, {
                    params: params,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });

                setIsLoading(false);
                setNonMovingItemData(response.data.data);

                const worksheet = XLSX.utils.json_to_sheet(response.data.data);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');

                const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
                const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
                if (reportType == 0) {
                    saveAs(blob, 'Sale-GST-HSN-Report.xlsx');
                } else if (reportType == 1) {
                    saveAs(blob, 'Sale-Return-GST-HSN-Report.xlsx');
                } else if (reportType == 2) {
                    saveAs(blob, 'Purchase-GST-HSN-Report.xlsx');
                } else if (reportType == 3) {
                    saveAs(blob, 'Purchase-Return-GST-HSN-Report.xlsx');
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
            {isLoading ? <div className="loader-container ">
                <Loader />
            </div> :
                <div>
                    <div className="p-6">
                        <div style={{ display: 'flex', gap: '4px' }}>
                            <div style={{ display: 'flex', gap: '7px', alignItems: 'center', marginBottom: '15px' }}>
                                <span style={{ color: 'var(--color2)', display: 'flex', fontWeight: 700, fontSize: '20px', cursor: "pointer" }} onClick={(() => history.push('/reports'))} > Reports
                                </span>
                                <ArrowForwardIosIcon style={{ fontSize: '18px', color: "var(--color1)" }} />
                                <span className="txt_hdr_rpt" style={{ color: 'var(--color1)', display: 'flex', fontWeight: 700, fontSize: '20px', whiteSpace: "nowrap" }}> HSN Wise GST Report
                                </span>
                                <BsLightbulbFill className=" w-6 h-6 secondary hover-yellow" />
                            </div>
                        </div>
                        <div className="IconNonMoving " style={{ background: "white" }}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <div className="img_gst" >
                                        <img src="../imgpsh_fullsize_anim.png" alt="anim"></img>
                                    </div>
                                </div>
                            </div>
                            <div className="rept_date">
                                <div className="flex flex-col gap-2" style={{ border: '1px solid lightgray', padding: '25px', borderRadius: '6px' }}>
                                    <span className="flex secondary text-lg" >Bill Date:</span>

                                    <DatePicker
                                        className='custom-datepicker mb-4'
                                        selected={monthDate}
                                        onChange={(newDate) => setMonthDate(newDate)}
                                        dateFormat="MM/yyyy"
                                        showMonthYearPicker
                                    />

                                    <span className="flex secondary text-lg" >Report Type</span>
                                    <Select
                                        labelId="demo-select-small-label"
                                        className="mb-5"
                                        id="demo-select-small"
                                        value={reportType}
                                        onChange={(e) => setReportType(e.target.value)}
                                        label="Report Type"

                                    >
                                        <MenuItem value="" disabled>
                                            Select Report Type
                                        </MenuItem>
                                        <MenuItem value="0">Sale</MenuItem>
                                        <MenuItem value="1">Sale Return</MenuItem>
                                        <MenuItem value="2">Purchase</MenuItem>
                                        <MenuItem value="3">Purchase Return</MenuItem>
                                    </Select>

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
                                        onClick={handlefilterData}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>

                                            <img src="/csv-file.png"
                                                className="report-icon absolute mr-10"
                                                alt="csv " />

                                        </div>
                                        Download
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            }
        </>
    )
}
export default HsnWiseGst