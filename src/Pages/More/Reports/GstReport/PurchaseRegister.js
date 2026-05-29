import Header from "../../../Header"
import { BsLightbulbFill } from "react-icons/bs"
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import { FaSearch } from "react-icons/fa";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { Button, FormControl, InputAdornment, InputLabel, MenuItem, MenuList, Select, TextField } from "@mui/material"
import { Option } from "@material-tailwind/react";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
const PurchaseRegister = () => {
    const history = useHistory()
    const [startDate, setStartDate] = useState(dayjs());
    const [reportType, setReportType] = useState()
    const [purchaseType, setPurchaseType] = useState()
    const csvIcon = process.env.PUBLIC_URL + '/csv.png';
    const PurchaseRegisterColumns = [
        { id: 'itemname', label: 'Item Name', minWidth: 100 },
        { id: 'category', label: 'Category', minWidth: 100 },
        { id: 'unit', label: 'Unit', minWidth: 100 },
        { id: 'manu', label: 'Manu.', minWidth: 100 },
        { id: 'sale', label: 'Sale', minWidth: 100 },
        { id: 'stock', label: 'Stock', minWidth: 100 },
        { id: 'mrp', label: 'MRP', minWidth: 100 },
        { id: 'saleamt', label: 'Sale Amt.', minWidth: 100 },
        { id: 'purchase', label: 'Purchase', minWidth: 100 },
        { id: 'netgst', label: 'Net GST', minWidth: 100 },
        { id: 'profit', label: 'Profit(%)', minWidth: 100 },
    ];
    const [tableData, setTabledata] = useState([
        { id: "itemname", itemname: "dolo", category: "item", unit: 10, manu: "smart", sale: "10", stock: "50", mrp: "500", saleamt: "Rs.44.00", purchase: "Rs.445.00", netgst: "Rs.4.45", profit: "Rs.446(21)" },
        { id: "itemname", itemname: "dolo", category: "item", unit: 10, manu: "smart", sale: "10", stock: "50", mrp: "500", saleamt: "Rs.44.00", purchase: "Rs.445.00", netgst: "Rs.4.45", profit: "Rs.446(21)" },
        { id: "itemname", itemname: "dolo", category: "item", unit: 10, manu: "smart", sale: "10", stock: "50", mrp: "500", saleamt: "Rs.44.00", purchase: "Rs.445.00", netgst: "Rs.4.45", profit: "Rs.446(21)" },
        { id: "itemname", itemname: "dolo", category: "item", unit: 10, manu: "smart", sale: "10", stock: "50", mrp: "500", saleamt: "Rs.44.00", purchase: "Rs.445.00", netgst: "Rs.4.45", profit: "Rs.446(21)" },
        { id: "itemname", itemname: "dolo", category: "item", unit: 10, manu: "smart", sale: "10", stock: "50", mrp: "500", saleamt: "Rs.44.00", purchase: "Rs.445.00", netgst: "Rs.4.45", profit: "Rs.446(21)" },
        { id: "itemname", itemname: "dolo", category: "item", unit: 10, manu: "smart", sale: "10", stock: "50", mrp: "500", saleamt: "Rs.44.00", purchase: "Rs.445.00", netgst: "Rs.4.45", profit: "Rs.446(21)" },
        { id: "itemname", itemname: "dolo", category: "item", unit: 10, manu: "smart", sale: "10", stock: "50", mrp: "500", saleamt: "Rs.44.00", purchase: "Rs.445.00", netgst: "Rs.4.45", profit: "Rs.446(21)" },
        { id: "itemname", itemname: "dolo", category: "item", unit: 10, manu: "smart", sale: "10", stock: "50", mrp: "500", saleamt: "Rs.44.00", purchase: "Rs.445.00", netgst: "Rs.4.45", profit: "Rs.446(21)" },
        { id: "itemname", itemname: "dolo", category: "item", unit: 10, manu: "smart", sale: "10", stock: "50", mrp: "500", saleamt: "Rs.44.00", purchase: "Rs.445.00", netgst: "Rs.4.45", profit: "Rs.446(21)" },
        { id: "itemname", itemname: "dolo", category: "item", unit: 10, manu: "smart", sale: "10", stock: "50", mrp: "500", saleamt: "Rs.44.00", purchase: "Rs.445.00", netgst: "Rs.4.45", profit: "Rs.446(21)" },
        { id: "itemname", itemname: "dolo", category: "item", unit: 10, manu: "smart", sale: "10", stock: "50", mrp: "500", saleamt: "Rs.44.00", purchase: "Rs.445.00", netgst: "Rs.4.45", profit: "Rs.446(21)" },
        { id: "itemname", itemname: "dolo", category: "item", unit: 10, manu: "smart", sale: "10", stock: "50", mrp: "500", saleamt: "Rs.44.00", purchase: "Rs.445.00", netgst: "Rs.4.45", profit: "Rs.446(21)" },
        { id: "itemname", itemname: "dolo", category: "item", unit: 10, manu: "smart", sale: "10", stock: "50", mrp: "500", saleamt: "Rs.44.00", purchase: "Rs.445.00", netgst: "Rs.4.45", profit: "Rs.446(21)" },
        { id: "itemname", itemname: "dolo", category: "item", unit: 10, manu: "smart", sale: "10", stock: "50", mrp: "500", saleamt: "Rs.44.00", purchase: "Rs.445.00", netgst: "Rs.4.45", profit: "Rs.446(21)" },
    ])
    return (
        <>
            <div>
                <Header />
                <div style={{ background: "rgba(153, 153, 153, 0.1)", height: 'calc(99vh - 55px)', padding: '20px 20px 0px' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                        <div style={{ display: 'flex', gap: '7px', alignItems: 'center', }}>
                            <span style={{ color: 'var(--color2)', display: 'flex', fontWeight: 700, fontSize: '20px', cursor: "pointer" }} onClick={(() => history.push('/reports'))} > Reports
                            </span>
                            <ArrowForwardIosIcon style={{ fontSize: '18px', color: "var(--color1)" }} />
                            <span style={{ color: 'var(--color1)', display: 'flex', fontWeight: 700, fontSize: '20px', minWidth: "200px" }}>  GST Purchase Register
                            </span>
                            <BsLightbulbFill className=" w-6 h-6 secondary hover-yellow" />
                        </div>
                        <div className="headerList" style={{ marginBottom: "10px" }}>
                            <Button variant="contained"
                                className="gap-7 downld_btn_csh" style={{
                                    background: "var(--color1)",
                                    color: "white",
                                    // paddingLeft: "35px",
                                    textTransform: "none",
                                    display: "flex",
                                }} >
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <img src={csvIcon} className="report-icon absolute mr-10" alt="csv " />
                                </div>
                                Download</Button>
                        </div>
                    </div>
                    <div className="bg-white ">
                        <div className="manageExpenseRow" style={{
                            padding: ' 20px 24px', borderBottom: "2px solid rgb(0 0 0 / 0.1)"
                        }}>
                            <div className="flex gap-5" >
                                <div >
                                    {/* <span className="title py-2" >Start Date</span> */}
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            views={['month', 'year']}
                                            sx={{ maxWidth: "150px" }}
                                            value={startDate}
                                            onChange={(newDate) => setStartDate(newDate)}
                                            renderInput={(params) => <TextField
                                                autoComplete="off" {...params} />}
                                        />
                                    </LocalizationProvider>
                                </div>

                                <div>
                                    <FormControl sx={{ minWidth: 250 }} size="small">
                                        <InputLabel id="demo-select-small-label">Report Type</InputLabel>
                                        <Select
                                            labelId="demo-select-small-label"
                                            id="demo-select-small"
                                            value={reportType}
                                            onChange={(e) => setReportType(e.target.value)}
                                            label="Report Type"

                                        >

                                            <MenuItem value="" disabled>
                                                Select Report Type
                                            </MenuItem>
                                            <MenuItem value="0">Purchase</MenuItem>
                                            <MenuItem value="1">Purchase Return</MenuItem>
                                        </Select>
                                    </FormControl>

                                </div>
                                <div>
                                    <div className="detail" >
                                        <FormControl sx={{ minWidth: 250 }} size="small">
                                            <InputLabel id="demo-select-small-label">Purchase Type</InputLabel>
                                            <Select
                                                labelId="demo-select-small-label"
                                                id="demo-select-small"
                                                value={purchaseType}
                                                onChange={(e) => setPurchaseType(e.target.value)}
                                                label="Purchase Type"

                                            >
                                                <MenuItem value="" disabled>
                                                    Select Purchase Type
                                                </MenuItem>
                                                <MenuItem value="0">With GST</MenuItem>
                                                <MenuItem value="1">Without GST</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </div>
                                </div>
                                <div>
                                    <Button variant="contained">
                                        Go
                                    </Button>
                                </div>

                            </div>
                            <div>
                                <div className="flex gap-5 ml-auto">
                                    <span className="primary text-xl">Total</span>
                                    <p className="secondary text-xl">Rs.639.75</p>
                                </div>
                            </div>
                        </div>
                        {tableData.length > 0 ?
                            <div>
                                <div>
                                    <table className="table-cashManage">
                                        <thead>
                                            <tr>
                                                {PurchaseRegisterColumns.map((column) => (
                                                    <th key={column.id} style={{ minWidth: column.minWidth }}>
                                                        {column.label}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tableData?.map((item, index) => (
                                                <tr key={index} >
                                                    {PurchaseRegisterColumns.map((column) => (
                                                        <td key={column.id}>
                                                            {item[column.id]}
                                                        </td>
                                                    ))}

                                                </tr>
                                            ))}

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            :
                            <div>
                                <div className="SearchIcon">
                                    <div>
                                        <FaSearch className="IconSize" />
                                    </div>
                                    <p className="text-gray-500 font-semibold">Apply filter to get records.</p>
                                </div>
                            </div>

                        }
                    </div>

                </div>
            </div>
        </>
    )
}
export default PurchaseRegister