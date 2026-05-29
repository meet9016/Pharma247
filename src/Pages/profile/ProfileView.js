
import * as React from 'react';
import Box from '@mui/material/Box';
import { Accordion, AccordionDetails, AccordionSummary, Divider, FormControl, Typography, Switch } from "@mui/material";
import { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import usePermissions, { hasPermission } from '../../componets/permission';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import axios from 'axios';

const ProfileView = () => {

    const [open, setOpen] = useState(false);
    const history = useHistory()
    const permissions = usePermissions();
    const location = useLocation();
    const [whatsappSwitch, seWhatsappSwitch] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const token = localStorage.getItem("token");

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const handleItemClick = (path, name) => {
        history.push(path);
    };
    const hasStaffSessionsPermission = hasPermission(permissions, "staff members view") || hasPermission(permissions, "manage staff roles view");
    useEffect(() => {
        fetchAboutDetails()
    }, [whatsappSwitch])


    const handleWhatsappSwitch = async (newValue) => {
        setIsLoading(true);
        let formData = new FormData()
        formData.append("status", newValue ? "0" : "1")

        try {
            const response = await axios.post("whatsapp-bill-status-check", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = response.data.data;
            if (response.data.status == 200) {
            } else if (response.data.status === 401) {
                history.push('/');
                localStorage.clear();
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
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


    const fetchAboutDetails = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post("about-get", {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = response.data.data;
            if (response.data.status == 200) {
                if (data?.whatsapp_bill_status_check === "1") {

                    seWhatsappSwitch(true)
                } else if (data?.whatsapp_bill_status_check === "0") {
                    seWhatsappSwitch(false)
                }
            } else if (response.data.status === 401) {
                history.push('/');
                localStorage.clear();
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
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

    return (
        <>
            <div>
                <Box
                    className="custom-scroll pb_mn_hdsssss_vv "
                    sx={{
                        width: {
                            xs: '100%',
                            sm: '100%',
                            md: 265,
                            lg: 320,
                            xl: 320,
                        },
                        height: {
                            xs: '100%',
                            sm: '99.9vh',
                            md: '99.9vh',
                            lg: '99.9vh',
                            xl: '99.9vh',
                        },

                        position: 'sticky',
                        top: 0,
                        bgcolor: 'rgba(153, 153, 153, 0.1)',
                        padding: '15px'
                    }}
                    role="presentation"
                    onClick={() => toggleDrawer(false)}
                >
                    <Accordion defaultExpanded>
                        <AccordionSummary sx={{ color: "var(--color1)" }} >
                            <PersonIcon sx={{ mb: 1 }} />
                            <Typography className='pb_list_hedrr' sx={{ paddingX: "20px" }}>Account</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <FormControl sx={{ width: "100%", paddingX: "20px" }}>
                                <ul className='list-text_pb'>
                                    {hasPermission(permissions, "profile details update") && (
                                        <li
                                            className={`font-semibold p-2 cursor-pointer flex justify-between ${location.pathname === '/aboutInfo' ? 'bg-[var(--color2)] text-white rounded-lg' : 'hover:bg-[var(--color2)] hover:text-white rounded-lg'}`}
                                            onClick={() => handleItemClick('/aboutInfo', 'About Pharmacy')}
                                        >
                                            Profile Details
                                        </li>
                                    )}
                                    {hasPermission(permissions, "profile details update") && (
                                        <li
                                            className={`font-semibold p-2 cursor-pointer flex justify-between ${location.pathname === '/documents' ? 'bg-[var(--color2)] text-white rounded-lg' : 'hover:bg-[var(--color2)] hover:text-white rounded-lg'}`}
                                            onClick={() => handleItemClick('/documents', 'Documents')}
                                        >
                                            Documents
                                        </li>
                                    )}
                                    {hasPermission(permissions, "profile plan view") && (
                                        <li
                                            className={`font-semibold p-2 cursor-pointer flex justify-between ${location.pathname === '/plans' ? 'bg-[var(--color2)] text-white rounded-lg' : 'hover:bg-[var(--color2)] hover:text-white rounded-lg'}`}
                                            onClick={() => handleItemClick('/plans', 'Plan')}
                                        >
                                            Plan
                                        </li>
                                    )}
                                    {hasPermission(permissions, "profile plan view") && (
                                        <li
                                            className={`font-semibold p-2 cursor-pointer flex justify-between ${location.pathname === '/referEarn' ? 'bg-[var(--color2)] text-white rounded-lg' : 'hover:bg-[var(--color2)] hover:text-white rounded-lg'}`}
                                            onClick={() => handleItemClick('/referEarn', 'refer&earn')}
                                        >
                                            Refer & Earn
                                        </li>
                                    )}
                                    <li
                                        className={`font-semibold p-2 cursor-pointer flex justify-between ${location.pathname === '/password' ? 'bg-[var(--color2)] text-white rounded-lg' : 'hover:bg-[var(--color2)] hover:text-white rounded-lg'}`}
                                        onClick={() => handleItemClick('/password', 'Password')}
                                    >
                                        Password
                                    </li>
                                </ul>
                            </FormControl>
                        </AccordionDetails>
                    </Accordion>

                    {hasStaffSessionsPermission && (
                        <Accordion defaultExpanded >
                            <AccordionSummary sx={{ color: "var(--color1)" }} >
                                <SupervisorAccountIcon sx={{ mb: 1 }} />
                                <Typography className='pb_list_hedrr' sx={{ paddingX: "20px" }}>Staff & Sessions</Typography>
                            </AccordionSummary>
                            <AccordionDetails  >
                                <FormControl sx={{ width: "100%", paddingX: "20px" }}>
                                    <ul className='list-text_pb'>
                                        {hasPermission(permissions, "staff members view") && (
                                            <li
                                                className={`font-semibold p-2 cursor-pointer flex justify-between ${location.pathname === '/StaffMember' ? 'bg-[var(--color2)] text-white rounded-lg' : 'hover:bg-[var(--color2)] hover:text-white rounded-lg'}`}
                                                onClick={() => handleItemClick('/StaffMember', 'Staff Members')}
                                            >
                                                Staff Members
                                            </li>
                                        )}
                                        {hasPermission(permissions, "manage staff roles view") && (
                                            <li
                                                className={`font-semibold p-2 cursor-pointer flex justify-between ${location.pathname === '/manageStaffRole' ? 'bg-[var(--color2)] text-white rounded-lg' : 'hover:bg-[var(--color2)] hover:text-white rounded-lg'}`}
                                                onClick={() => handleItemClick('/manageStaffRole', 'Manage Staff Roles')}
                                            >
                                                Manage Staff Roles
                                            </li>
                                        )}
                                        {hasPermission(permissions, "staff members view") && (
                                            <li
                                                className={`font-semibold p-2 cursor-pointer flex justify-between ${location.pathname === '/reconciliationManage' ? 'bg-[var(--color2)] text-white rounded-lg' : 'hover:bg-[var(--color2)] hover:text-white rounded-lg'}`}
                                                onClick={() => handleItemClick('/reconciliationManage', 'Reconciliation')}
                                            >
                                                Reconciliation
                                            </li>
                                        )}

                                        <li
                                            className={`font-semibold p-2 cursor-pointer flex justify-between ${location.pathname === '/StaffSessions' ? 'bg-[var(--color2)] text-white rounded-lg' : 'hover:bg-[var(--color2)] hover:text-white rounded-lg'}`}
                                            onClick={() => handleItemClick('/StaffSessions', 'Log Activity')}
                                        >Log Activity
                                        </li>
                                    </ul>
                                    {/* {/ ))} /} */}
                                </FormControl>
                            </AccordionDetails>
                        </Accordion>
                    )}
                    {hasStaffSessionsPermission && (
                        <Accordion defaultExpanded >
                            <AccordionSummary sx={{ color: "var(--color1)" }} >
                                <SupervisorAccountIcon sx={{ mb: 1 }} />
                                <Typography className='pb_list_hedrr' sx={{ paddingX: "20px" }}>Setting</Typography>
                            </AccordionSummary>
                            <AccordionDetails  >
                                <FormControl sx={{ width: "100%", paddingX: "20px" }}>
                                    <ul className='list-text_pb'>

                                        {hasPermission(permissions, "staff members view") && (
                                            <li
                                                className={`font-semibold p-2 cursor-pointer flex justify-between ${location.pathname === '/onlineOrders' ? 'bg-[var(--color2)] text-white rounded-lg' : 'hover:bg-[var(--color2)] hover:text-white rounded-lg'}`}
                                                onClick={() => handleItemClick('/onlineOrders', 'online-orders')}
                                            >
                                                Online Orders
                                            </li>
                                        )}
                                        {hasPermission(permissions, "staff members view") && (
                                            <li
                                                className={'font-semibold items-center p-2 cursor-pointer flex justify-between rounded-lg '}

                                            >
                                                Whatsapp Bill
                                                <Switch
                                                    checked={whatsappSwitch}  // Change from 'value' to 'checked'
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
                                                        seWhatsappSwitch((prev) => {
                                                            handleWhatsappSwitch(prev);
                                                            return !prev;
                                                        });
                                                    }}
                                                />
                                            </li>
                                        )}
                                    </ul>
                                    {/* {/ ))} /} */}
                                </FormControl>
                            </AccordionDetails>
                        </Accordion>
                    )}
                    <Divider />
                </Box>
            </div>
        </>
    )
}

export default ProfileView