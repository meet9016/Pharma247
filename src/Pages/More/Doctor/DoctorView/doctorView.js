import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Header from '../../../Header';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../../../componets/loader/Loader';
import { FaUser } from 'react-icons/fa';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { TablePagination, Typography } from '@mui/material';

const saleColumns = [
    { id: 'bill_no', label: 'Bill NO', minWidth: 150, height: 100 },
    { id: 'bill_date', label: 'Bill Date', minWidth: 150 },
    { id: 'customer_name', label: 'Customer Name', minWidth: 150 },
    { id: 'phone_number', label: 'Mobile No', minWidth: 150 },
    { id: 'qty', label: 'Quantity', minWidth: 150 },
    { id: 'amt', label: 'Bill Amount', minWidth: 150 },
];
const saleReturnColumns = [
    { id: 'bill_no', label: 'Bill NO', minWidth: 150, height: 150 },
    { id: 'bill_date', label: 'Bill Date', minWidth: 150 },
    { id: 'customer_name', label: 'Customer Name', minWidth: 150 },
    { id: 'phone_number', label: 'Mobile No', minWidth: 150 },
    { id: 'qty', label: 'Quantity', minWidth: 150 },
    { id: 'amt', label: 'Amount', minWidth: 150 },

];
const DoctorView = () => {

    const { id } = useParams();
    const history = useHistory();
    const token = localStorage.getItem("token");
    const [isLoading, setIsLoading] = useState(false);
    const [IsDelete, setIsDelete] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [doctorDetails, setDoctorDetails] = useState('')
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    // const [saleAmount, setSaleAmount] = useState(0)
    // const [saleReturnAmount, setSaleReturnAmount] = useState(0)
    const DoctorViewGetbyID = async () => {
        let data = new FormData();
        data.append("id", id)
        setIsLoading(true)
        const params = {
            id: id,
            page: page + 1,
            limit: rowsPerPage
        };
        try {
            await axios.post("doctor-view", data, {
                params: params,
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            ).then((response) => {
                setIsLoading(false)
                setDoctorDetails(response.data.data)

            })
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
    useEffect(() => {
        DoctorViewGetbyID()
    }, [page, rowsPerPage])

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
        setPage(0)
    };

    const deleteClose = () => {
        setIsDelete(false);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    return (

        <>
            <Header />
            {isLoading ? <div className="loader-container ">
                <Loader />
            </div> :
                <div style={{ backgroundColor: 'rgba(153, 153, 153, 0.1)', height: 'calc(99vh - 55px)', padding: "0px 20px 0px" }} >
                    <div >
                        <div className='py-3' style={{ display: 'flex', gap: '5px', alignItems: "center" }} >
                            <span style={{ color: 'var(--color2)', display: 'flex', fontWeight: 700, fontSize: '20px', cursor: "pointer" }} onClick={(() => { history.push('/doctors') })} >Doctors</span>
                            <ArrowForwardIosIcon style={{ fontSize: '20px', color: "var(--color1)" }} />
                            <div className='flex'>
                                <div className='w-8 h-8 rounded-full flex items-center justify-center secondary-bg'>
                                    <FaUser className='text-white w-4 h-4' />
                                </div>
                            </div>
                            <span style={{ color: 'var(--color1)', display: 'flex', fontWeight: 700, fontSize: '18px' }}> {doctorDetails.name}</span>

                        </div>
                    </div>

                    <div style={{
                        backgroundColor: 'rgb(63 98 18 / 11%)',
                        borderRadius: '10px',
                        paddingTop: '0.5%',
                        paddingLeft: '0.6%'
                    }}>
                        <div className="firstrow flex header_main_txt_CV" style={{ background: "none" }}>
                            <div className="detail_main_bg_CV">
                                <span className="heading_othr ">Doctor Name</span>
                                <span className="data_bg">{doctorDetails.name ? doctorDetails.name : '____'}</span>

                            </div>

                            <div className="detail_main_bg_CV">
                                <span className="heading_othr ">Clinic Name</span>
                                <span className="data_bg">{doctorDetails.clinic ? doctorDetails.clinic : '____'}</span>

                            </div>
                            <div className="detail_main_bg_CV">
                                <span className="heading_othr ">Mobile No</span>
                                <span className="data_bg">{doctorDetails.phone_number ? doctorDetails.phone_number : '____'}</span>
                            </div>

                            <div className="detail_main_bg_CV">
                                <span className="heading_othr ">License Number</span>
                                <span className="data_bg">{doctorDetails.license ? doctorDetails.license : '____'}</span>
                            </div>
                            <div className="detail_main_bg_CV">
                                <span className="heading_othr ">Default Doctor</span>
                                <span className="data_bg">{doctorDetails.default_doctor ? doctorDetails.default_doctor : 'No'}</span>
                            </div>
                            <div className="detail_main_bg_CV">
                                <span className="heading_othr ">Address</span>
                                <span className="data_bg">{doctorDetails.address ? doctorDetails.address : '____'}</span>
                            </div>
                        </div>
                    </div>
                    <div className='mt-5' >
                        <Box sx={{ width: '100%', bgcolor: 'background.paper' }} >
                            <div
                                className="cust_tab_val"
                            >
                                <Tabs value={tabValue} onChange={handleChange}
                                    TabIndicatorProps={{
                                        style: {
                                            backgroundColor: "var(--color1)",
                                            color: "var(--color1)",
                                        },
                                    }}>
                                    <Tab label="Sale" sx={{
                                        mx: 2, color: tabValue === 0 ? "var(--color1)" : "var(--color1)",
                                        "&.Mui-selected": {
                                            color: "var(--color1)",
                                        },
                                    }} />
                                    <Tab label="Sales Return" sx={{
                                        mx: 2, color: tabValue === 0 ? "var(--color1)" : "var(--color1)",
                                        "&.Mui-selected": {
                                            color: "var(--color1)",
                                        },
                                    }} />

                                </Tabs>
                                <div className='total_amount_fld'>
                                    {tabValue === 0 && (
                                        <div
                                            className="mx-4 my-2 "
                                            style={{
                                                border: "1px solid var(--color2)",
                                                padding: "10px",
                                                borderRadius: "6px",
                                                backgroundColor: "rgba(63, 98, 18, 0.09)",
                                                width: "fit-content",
                                            }}
                                        >
                                            <Typography
                                                className="total_amount_txt"
                                                style={{
                                                    color: "var(--color1)",
                                                    fontSize: "18px",
                                                    fontWeight: 800,
                                                    whiteSpace: 'noWrap'
                                                }}
                                            >

                                                Total Sale Amount :-
                                                <span style={{ color: "var(--color2)" }}>
                                                    Rs.
                                                    {doctorDetails?.sales?.length > 0 ? doctorDetails?.sales[0]?.total_amount : 0}
                                                </span>
                                            </Typography>
                                        </div>
                                    )}
                                    {tabValue === 1 && (
                                        <div
                                            className="mx-4 my-2 "
                                            style={{
                                                border: "1px solid var(--color2)",
                                                padding: "10px",
                                                borderRadius: "6px",
                                                backgroundColor: "rgba(63, 98, 18, 0.09)",
                                                width: "fit-content",
                                            }}
                                        >
                                            <Typography
                                                className="total_amount_txt"

                                                style={{
                                                    color: "var(--color1)",
                                                    fontSize: "18px",
                                                    fontWeight: 800,
                                                    whiteSpace: 'noWrap'
                                                }}
                                            >

                                                Total Sale Return Amount :-
                                                <span style={{ color: "var(--color2)" }}>
                                                    Rs.
                                                    {doctorDetails?.sales_return?.length > 0 ? doctorDetails?.sales_return[0]?.total_amount : 0}
                                                </span>
                                            </Typography>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {tabValue === 0 && (
                                <div style={{ margin: "25px" }}>
                                    {/* <div className="mx-4 my-2 ">
                                        <Typography style={{ color: 'var(--color1)', fontSize: '18px', fontWeight: 800, marginLeft: '10px' }}> Total Sale Amount :- <span style={{ color: '#628A2F' }}>Rs.{doctorDetails?.sales?.length > 0 ? doctorDetails?.sales[0]?.total_amount : 0} </span></Typography>
                                    </div> */}
                                    <div className="overflow-x-auto mt-4">
                                        <table className="w-full border-collapse custom-table">
                                            <thead>
                                                <tr>
                                                    {saleColumns.map((column) => (
                                                        <th key={column.id} style={{ minWidth: column.minWidth }}>
                                                            {column.label}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {doctorDetails?.sales?.map((item, index) => (
                                                    <tr key={index}>
                                                        {saleColumns.map((column) => (
                                                            <td key={column.id}>
                                                                {item[column.id]}
                                                            </td>
                                                        ))}

                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <TablePagination
                                            rowsPerPageOptions={[5, 10, 12]}
                                            component="div"
                                            count={doctorDetails?.sales?.length || 0}
                                            rowsPerPage={rowsPerPage}
                                            page={page}
                                            onPageChange={handleChangePage}
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                        />
                                    </div>
                                </div>
                            )}

                            {tabValue === 1 && (
                                <div style={{ margin: "25px" }}>
                                    {/* <div className="mx-4 my-2 ">
                                        <Typography style={{ color: 'var(--color1)', fontSize: '18px', fontWeight: 800, marginLeft: '10px' }}> Total Sale Return Amount :- <span style={{ color: '#628A2F' }}>Rs.{doctorDetails?.sales_return?.length > 0 ? doctorDetails?.sales_return[0]?.total_amount : 0} </span></Typography>
                                    </div> */}
                                    <div className="overflow-x-auto mt-4">
                                        <table className="w-full border-collapse custom-table">
                                            <thead>
                                                <tr>
                                                    {saleReturnColumns.map((column) => (
                                                        <th key={column.id} style={{ minWidth: column.minWidth }}>
                                                            {column.label}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {doctorDetails?.sales_return?.map((item, index) => (
                                                    <tr key={index}>
                                                        {saleReturnColumns.map((column) => (
                                                            <td key={column.id}>
                                                                {item[column.id]}
                                                            </td>
                                                        ))}

                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <TablePagination
                                            rowsPerPageOptions={[5, 10, 12]}
                                            component="div"
                                            count={doctorDetails?.sales?.length || 0}
                                            rowsPerPage={rowsPerPage}
                                            page={page}
                                            onPageChange={handleChangePage}
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                        />
                                    </div>
                                </div>
                            )}

                        </Box>
                    </div>
                    <div id="modal" value={IsDelete}
                        className={`fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif] ${IsDelete ? "block" : "hidden"
                            }`}>
                        <div />
                        <div className="w-full max-w-md bg-white shadow-lg rounded-md p-4 relative">
                            <svg xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6 cursor-pointer absolute top-4 right-4 fill-current text-gray-600 hover:text-red-500 "
                                viewBox="0 0 24 24" onClick={deleteClose}>
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z" />
                            </svg>
                            <div className="my-4 text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-12 fill-red-500 inline" viewBox="0 0 24 24">
                                    <path
                                        d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
                                        data-original="#000000" />
                                    <path d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
                                        data-original="#000000" />
                                </svg>
                                <h4 className="text-lg font-semibold mt-6">Are you sure you want to delete it?</h4>
                            </div>
                            <div className="flex gap-5 justify-center">
                                <button type="submit"
                                    className="px-6 py-2.5 w-44 items-center rounded-md text-white text-sm font-semibold border-none outline-none bg-red-500 hover:bg-red-600 active:bg-red-500"
                                >Delete</button>
                                <button type="button"
                                    className="px-6 py-2.5 w-44 rounded-md text-black text-sm font-semibold border-none outline-none bg-gray-200 hover:bg-gray-900 hover:text-white"
                                    onClick={deleteClose}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>}
        </>
    )
}

export default DoctorView;