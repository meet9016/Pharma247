import { useEffect, useState } from "react";
import Header from "../../Header"
import ProfileView from "../ProfileView"
import { BsLightbulbFill } from "react-icons/bs"
import AddIcon from '@mui/icons-material/Add';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import { Box, Button, Dialog, DialogContent, DialogContentText, DialogTitle, IconButton, Tooltip } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";
import Loader from "../../../componets/loader/Loader";
import { FaCheckCircle } from "react-icons/fa";

const ManageStaffRole = () => {
    const history = useHistory()
    const [openAddPopUp, setOpenAddPopUp] = useState(false);
    const [header, setHeader] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const token = localStorage.getItem("token");
    const [openAddPopUpDeactive, setOpenAddPopUpDeactive] = useState(false);
    const ManageStaffRole = [

        { id: 'role', label: 'Role', minWidth: 100 },
        { id: 'status', label: 'Status', minWidth: 100 },
    ];
    const [manageStaffRoleData, setManageStaffRoleData] = useState([])
    const [roleHistory, setRoleHistory] = useState([]);
    const [id, setId] = useState('');

    const resetAddDialog = () => {
        setOpenAddPopUp(false);
    }
    const resetAddDialogDeactive = () => {
        setOpenAddPopUpDeactive(false)
    }
    const handleDeactive = (id) => {
        setOpenAddPopUpDeactive(true)
        setId(id);
    }

    const handleDeactiveRole = () => {
        let data = new FormData();
        const params = {
            id: id,
        }
        axios.post("role-status?", data, {
            params: params,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                setIsLoading(false)
                setOpenAddPopUpDeactive(false)
                listOfRolePermission();
                // setManageStaffRoleData(response.data.data);

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
            });
    }
    useEffect(() => {
        listOfRolePermission();
    }, []);

    const listOfRolePermission = () => {
        setIsLoading(true)
        axios
            .get("role-list", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                setIsLoading(false)
                setManageStaffRoleData(response.data.data);
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
            });
    };
    const handelAddOpen = (id) => {
        setOpenAddPopUp(true);
        setHeader('Roles');
        viewRoleHistory(id)
    }
    const viewRoleHistory = async (manageId) => {

        let data = new FormData();
        const params = {
            id: manageId,
        }
        try {
            await axios.post("role-view", data, {
                params: params,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            ).then((response) => {
                setRoleHistory(response.data.data)

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

    return (
        <>
            <Header />
            {isLoading ? <div className="loader-container ">
                <Loader />
            </div> :
                <div>
                    <Box className="cdd_mn_hdr" sx={{ display: "flex" }}>
                        <ProfileView />
                        <div className="p-8" style={{ width: '100%', minWidth: '50px' }}>
                            <div className="flex justify-between items-center">
                                <div>
                                    <h1 className="text-2xl flex items-center primary font-semibold  p-2 mb-5 mng_role_stf_txt" style={{ marginBottom: "25px" }} >Manage Staff Roles
                                        <BsLightbulbFill className="ml-4 secondary  hover-yellow" />
                                    </h1>
                                </div>

                                <div className="flex gap-6">
                                    <Button variant="contained"
                                        style={{
                                            background: "var(--color1)",
                                            color: "white", textTransform: 'none', marginBottom: "25px"
                                        }}
                                        onClick={(() => history.push('/RolesAdd'))}>
                                        <AddIcon className="mr-2" />Create Role</Button>
                                </div>
                            </div>
                            <div className="overflow-x-auto mt-4 border-t pt-4">
                                {/* <table className="table-cashManage p-4"> */}
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
                                            <th>No</th>
                                            {ManageStaffRole.map((column) => (
                                                <th key={column.id} style={{ minWidth: column.minWidth }}>
                                                    {column.label}
                                                </th>
                                            ))}
                                            <th>Action</th>
                                        </tr>
                                    </thead>

                                    {/* <tbody style={{ background: "#3f621217" }}>  
                                            { manageStaffRoleData?.map((item, index) => {
                                                const displayStatus = item.status === "1" ? "Active" : item.status === "0" ? "Inactive" : item.status;
                                                return (
                                                    <tr key={index}>
                                                        <td style={{ borderRadius: "10px 0 0 10px" }}>{index + 1}</td>
                                                        {ManageStaffRole.map((column) => {
                                                            const value = column.id === "status" ? displayStatus : item[column.id];
                                                            const statusClass =
                                                                column.id === "status" && value === "Active"
                                                                    ? "orderStatus"
                                                                    : column.id === "status" && value === "Inactive"
                                                                        ? "dueStatus"
                                                                        : "text-black";

                                                            return (
                                                                <td key={column.id} className="text-lg">
                                                                    <span className={`text ${column.id === "status" ? statusClass : ""}`}>
                                                                        {value}
                                                                    </span>
                                                                </td>
                                                            );
                                                        })}
                                                        <td style={{ borderRadius: "0 10px 10px 0" }}>
                                                            <div className="flex justify-center items-center">
                                                                <VisibilityIcon className="primary mr-3" onClick={() => handelAddOpen(item.id)} />
                                                                <BorderColorIcon
                                                                    style={{ color: "var(--color1)" }}
                                                                    className="primary mr-3"
                                                                    onClick={() => history.push(`/RolesEdit/${item.id}`)}
                                                                />
                                                                <Tooltip title={displayStatus === "Active" ? "Deactivate" : "Activate"}>
                                                                    {displayStatus === "Active" ? (
                                                                        <DoNotDisturbIcon
                                                                            className="text-red-600 mr-3"
                                                                            onClick={() => handleDeactive(item.id)}
                                                                        />
                                                                    ) : (
                                                                        <FaCheckCircle
                                                                            className="text-blue-600 mr-3"
                                                                            size={24}
                                                                            onClick={() => handleDeactive(item.id)}
                                                                        />
                                                                    )}
                                                                </Tooltip>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                    </tbody> */}



                                    <tbody style={{ background: "#3f621217" }}>
                                        {manageStaffRoleData?.length > 0 ? (
                                            manageStaffRoleData.map((item, index) => {
                                                const displayStatus = item.status === "1" ? "Active" : item.status === "0" ? "Inactive" : item.status;
                                                return (
                                                    <tr key={index}>
                                                        <td style={{ borderRadius: "10px 0 0 10px" }}>{index + 1}</td>
                                                        {ManageStaffRole.map((column) => {
                                                            const value = column.id === "status" ? displayStatus : item[column.id];
                                                            const statusClass =
                                                                column.id === "status" && value === "Active"
                                                                    ? "orderStatus"
                                                                    : column.id === "status" && value === "Inactive"
                                                                        ? "dueStatus"
                                                                        : "text-black";

                                                            return (
                                                                <td key={column.id} className="text-lg">
                                                                    <span className={`text ${column.id === "status" ? statusClass : ""}`}>
                                                                        {value}
                                                                    </span>
                                                                </td>
                                                            );
                                                        })}
                                                        <td style={{ borderRadius: "0 10px 10px 0" }}>
                                                            <div className="flex justify-center items-center">
                                                                <VisibilityIcon className="primary mr-3" onClick={() => handelAddOpen(item.id)} />
                                                                <BorderColorIcon
                                                                    style={{ color: "var(--color1)" }}
                                                                    className="primary mr-3"
                                                                    onClick={() => history.push(`/RolesEdit/${item.id}`)}
                                                                />
                                                                <Tooltip title={displayStatus === "Active" ? "Deactivate" : "Activate"}>
                                                                    {displayStatus === "Active" ? (
                                                                        <DoNotDisturbIcon
                                                                            className="text-red-600 mr-3"
                                                                            onClick={() => handleDeactive(item.id)}
                                                                        />
                                                                    ) : (
                                                                        <FaCheckCircle
                                                                            className="text-blue-600 mr-3"
                                                                            size={24}
                                                                            onClick={() => handleDeactive(item.id)}
                                                                        />
                                                                    )}
                                                                </Tooltip>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={ManageStaffRole.length + 2}
                                                    style={{
                                                        textAlign: "center",
                                                        padding: "20px",
                                                        fontWeight: "600",
                                                    }}
                                                >
                                                    No Data Found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>

                                </table>
                            </div>
                        </div>
                    </Box>

















                    {/* <Dialog open={openAddPopUp} sx={{ '& .MuiDialog-paper': { maxWidth: '1000px', width: '50%' } }} >
                        <DialogTitle id="alert-dialog-title" className="secondary">
                            {header}
                        </DialogTitle>
                        <IconButton
                            aria-label="close"
                            onClick={resetAddDialog}
                            sx={{ position: 'absolute', right: 8, top: 8, color: "#ffffff" }}
                        >
                            <CloseIcon />
                        </IconButton>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                <div className="bg-white p-4 rounded-lg shadow-md">
                                    <div className="flex items-center w-full">
                                        <div className="w-1/5 flex justify-between">
                                            <span className="font-semibold text-black">Role</span>
                                            <span className="mx-2 font-bold text-xl">:-</span>
                                        </div>
                                        <div className="w-4/5">
                                            <span className="font-semibold text-black ml-4">{roleHistory?.role}</span>
                                        </div>
                                    </div>

                                    <div className="w-full">
                                        <div className="flex gap-4">
                                            <div className="w-1/5 ">
                                                <div className="flex items-center justify-between h-48">
                                                    <span className="font-semibold text-black">Permissions</span>
                                                    <span className="mx-2 font-bold text-xl ">:-</span>
                                                </div>
                                            </div>
                                            <div className="w-4/5 space-x-2">
                                                {roleHistory?.permission.map((role, index) => (
                                                    <span key={index} className="inline-block bg-blue-500 text-white px-3 py-1 rounded-full gap-2 mt-4">
                                                        {role.roleName}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </DialogContentText>
                        </DialogContent>
                    </Dialog> */}





                    <Dialog
                        open={openAddPopUp}
                        sx={{
                            "& .MuiDialog-paper": {
                                maxWidth: "900px",
                                width: "90%",
                                borderRadius: "16px",
                                overflow: "hidden",
                                boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
                            },
                        }}
                    >
                        {/* Header */}
                        <DialogTitle
                            id="alert-dialog-title"
                            sx={{
                                background: "#3F6212",
                                color: "#fff",
                                fontWeight: 700,
                                fontSize: "20px",
                                py: 2,
                                px: 3,
                            }}
                        >
                            {header}
                        </DialogTitle>

                        <IconButton
                            aria-label="close"
                            onClick={resetAddDialog}
                            sx={{
                                position: "absolute",
                                right: 12,
                                top: 12,
                                color: "#ffffff",
                                backgroundColor: "rgba(255,255,255,0.15)",
                                "&:hover": {
                                    backgroundColor: "rgba(255,255,255,0.25)",
                                },
                            }}
                        >
                            <CloseIcon />
                        </IconButton>

                        <DialogContent sx={{ p: 3, backgroundColor: "#F9FAFB" }}>
                            <DialogContentText
                                id="alert-dialog-description"
                                component="div"
                            >
                                <div
                                    style={{
                                        background: "#fff",
                                        borderRadius: "14px",
                                        padding: "24px",
                                        border: "1px solid #E5E7EB",
                                    }}
                                >
                                    {/* Role Section */}
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            paddingBottom: "20px",
                                            marginBottom: "20px",
                                            borderBottom: "1px solid #E5E7EB",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: "180px",
                                                fontWeight: 600,
                                                color: "#374151",
                                            }}
                                        >
                                            Role
                                        </div>

                                        <div
                                            style={{
                                                flex: 1,
                                            }}
                                        >
                                            <span
                                                style={{
                                                    background: "#ECFDF5",
                                                    color: "#3F6212",
                                                    padding: "8px 16px",
                                                    borderRadius: "999px",
                                                    fontWeight: 600,
                                                    display: "inline-block",
                                                }}
                                            >
                                                {roleHistory?.role}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Permission Section */}
                                    <div>
                                        <div
                                            style={{
                                                fontWeight: 600,
                                                color: "#374151",
                                                marginBottom: "16px",
                                            }}
                                        >
                                            Permissions
                                        </div>

                                        <div
                                            style={{
                                                display: "flex",
                                                flexWrap: "wrap",
                                                gap: "10px",
                                                minHeight: "60px",
                                                alignItems: "flex-start",
                                            }}
                                        >
                                            {/* Dynamic permissions here */}
                                            {/*
                        {roleHistory?.permission?.map((role, index) => (
                            <span
                                key={index}
                                style={{
                                    background: "#F0FDF4",
                                    color: "#3F6212",
                                    border: "1px solid #BBF7D0",
                                    padding: "8px 14px",
                                    borderRadius: "999px",
                                    fontSize: "14px",
                                    fontWeight: 500,
                                }}
                            >
                                {role.roleName}
                            </span>
                        ))}
                        */}
                                        </div>
                                    </div>
                                </div>
                            </DialogContentText>
                        </DialogContent>
                    </Dialog>













                    {/* <Dialog open={openAddPopUpDeactive} sx={{ '& .MuiDialog-paper': { maxWidth: '500px', width: '50%' } }} >
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                <div className="text-center">
                                    <div className="text-center">
                                        <span className='text-2xl text-gray-500'>Are You Sure?</span>
                                    </div>
                                    <div className="flex gap-6 mt-5 justify-center">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleDeactiveRole}
                                        >
                                            Yes
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            onClick={resetAddDialogDeactive}
                                        >
                                            No
                                        </Button>
                                    </div>
                                </div>
                            </DialogContentText>
                        </DialogContent>
                    </Dialog> */}





                    <Dialog
                        open={openAddPopUpDeactive}
                        onClose={resetAddDialogDeactive}
                        sx={{
                            "& .MuiDialog-paper": {
                                maxWidth: "420px",
                                width: "100%",
                                borderRadius: "16px",
                                overflow: "hidden",
                                boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                            },
                        }}
                    >
                        <DialogContent sx={{ p: 0 }}>
                            <div
                                style={{
                                    padding: "32px 24px",
                                    textAlign: "center",
                                }}
                            >
                                {/* Icon */}
                                <div
                                    style={{
                                        width: "70px",
                                        height: "70px",
                                        margin: "0 auto 20px",
                                        borderRadius: "50%",
                                        background: "#FEF2F2",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: "34px",
                                            color: "#e61829",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        !
                                    </span>
                                </div>

                                {/* Title */}
                                <h2
                                    style={{
                                        margin: 0,
                                        fontSize: "24px",
                                        fontWeight: 700,
                                        color: "#111827",
                                    }}
                                >
                                    Are You Sure?
                                </h2>

                                {/* Description */}
                                <p
                                    style={{
                                        marginTop: "10px",
                                        color: "#6B7280",
                                        fontSize: "15px",
                                        lineHeight: "22px",
                                    }}
                                >
                                    Do you really want to deactivate this role?
                                </p>

                                {/* Buttons */}
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        gap: "12px",
                                        marginTop: "28px",
                                    }}
                                >
                                    <Button
                                        variant="outlined"
                                        onClick={resetAddDialogDeactive}
                                        sx={{
                                            minWidth: "110px",
                                            borderRadius: "10px",
                                            textTransform: "none",
                                            fontWeight: 600,
                                            borderColor: "#3F6212",
                                            color: "#3F6212",
                                            "&:hover": {
                                                borderColor: "#3F6212",
                                                backgroundColor: "rgba(63, 98, 18, 0.08)",
                                            },
                                        }}
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        variant="contained"
                                        onClick={handleDeactiveRole}
                                        sx={{
                                            minWidth: "110px",
                                            borderRadius: "10px",
                                            textTransform: "none",
                                            fontWeight: 600,
                                            boxShadow: "none",
                                            backgroundColor: "#3F6212",
                                            "&:hover": {
                                                backgroundColor: "#365314",
                                                boxShadow: "none",
                                            },
                                        }}
                                    >
                                        Yes, Deactivate
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>










                </div>
            }
        </>
    )
}
export default ManageStaffRole