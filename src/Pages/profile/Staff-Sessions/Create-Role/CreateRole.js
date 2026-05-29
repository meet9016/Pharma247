import { Box, Button, TextField } from "@mui/material";
import Header from "../../../Header";
import ProfileView from "../../ProfileView";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Checkbox from '@mui/material/Checkbox';
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import Loader from "../../../../componets/loader/Loader";
import { toast, ToastContainer } from "react-toastify";

const CreateRole = () => {
    const [roleName, setRoleName] = useState('');
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
    const history = useHistory();
    const { id } = useParams();
    const token = localStorage.getItem("token");
    const [permissionList, setPermissionList] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [roleChecked, setRoleChecked] = useState({})

    const [expandedRoles, setExpandedRoles] = useState({});

    useEffect(() => {
        if (id) {
            editRolePermission();
        }
        listOfPermission();
    }, []);


    const toggleRoleVisibility = (role) => {
        setExpandedRoles((prev) => ({
            ...prev,
            [role]: !prev[role], // Toggle the visibility state
        }));
    };

    const editRolePermission = async () => {
        let data = new FormData();
        data.append("id", id);
        const params = {
            id: id
        };
        try {
            const response = await axios.post("role-view", data, {
                params: params,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const responseData = response.data.data;
            setRoleName(responseData.role);


            const roleCheckedState = {};
            Object.entries(responseData.permission).forEach(([category, perms]) => {
                perms.forEach(permission => {
                    roleCheckedState[permission] = true;
                });
            });
            setRoleChecked(roleCheckedState);

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

    const listOfPermission = () => {
        setIsLoading(true)
        axios.get("permission-list", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                setIsLoading(false)
                setPermissionList(response.data.data);

            })
            .catch((error) => {
                setIsLoading(false);
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

    const handleCreateRole = async () => {
        if (id) {
            if (validateForm()) {
                let data = new FormData();
                data.append('id', id);
                data.append("role", roleName);
                data.append('permissions', Object.keys(roleChecked).filter(key => roleChecked[key]).join(','));
                const params = {
                    id: id,
                    role: roleName,
                    permissions: Object.keys(roleChecked).filter(key => roleChecked[key]).join(',')
                }
                try {
                    await axios.post("role-edit", data, {
                        params: params,
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }).then((response) => {

                        toast.dismiss();
                        toast.success(response.data.message, 'success')
                        setTimeout(() => {
                            history.push('/manageStaffRole');
                        }, 3000);
                        if (response.data.status === 401) {
                            history.push('/');
                            localStorage.clear();
                        }
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
            }
        } else {
            if (validateForm()) {
                let data = new FormData();
                data.append("role", roleName);
                data.append('permissions', Object.keys(roleChecked).filter(key => roleChecked[key]).join(','));
                try {
                    await axios.post("role-create", data, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }).then((response) => {

                        toast.dismiss();
                        toast.success(response.data.message, 'success')
                        setTimeout(() => {
                            history.push('/manageStaffRole');
                        }, 3000);
                        if (response.data.status === 401) {
                            history.push('/');
                            localStorage.clear();
                        }
                    });
                } catch (error) {
                       if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
                    console.error("API error:", error);

                }
            }
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!roleName) newErrors.RoleName = 'Role Name is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCheckboxChange = (event, permission) => {
        setRoleChecked((prevRoleChecked) => ({
            ...prevRoleChecked,
            [permission]: event.target.checked,
        }));
    };

    return (
        <>
            <div>
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
                    <Box className="cdd_mn_hdr" sx={{ display: "flex" }}>
                        <ProfileView />
                        <div className="p-6 w-full">
                            <div className="flex justify-between">
                                <div>
                                    <h1 className="text-2xl flex items-center primary font-semibold p-2 mb-5" style={{ marginBottom: "25px" }}>
                                        <ArrowBackIosIcon className="cursor-pointer text-black" onClick={() => history.push('/manageStaffRole')} />
                                        {id ? 'Edit Role' : 'Create Role'}
                                    </h1>
                                </div>
                                <div>
                                    <Button variant="contained" style={{
                                        background: "var(--color1)",
                                        color: "white", textTransform: 'none', marginBottom: "25px"
                                    }} onClick={handleCreateRole}>{id ? 'Update' : 'Create'}</Button>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <div className="flex gap-1">
                                        <span className="primary mb-2 font-semibold">Role Name</span>
                                        <span className="text-red-600 text-xl">*</span>
                                    </div>
                                    <TextField
                                        autoComplete="off" id="standard-basic"
                                        size="small"
                                        sx={{ width: '100%' }}
                                        // label="Enter Your Role Name"
                                        variant="outlined"
                                        value={roleName}
                                        onChange={(e) => setRoleName(e.target.value)}
                                    />
                                    {errors.RoleName && <span style={{ color: 'red', fontSize: '14px' }}>{errors.RoleName}</span>}
                                </div>
                            </div>
                            <div className="mt-4 flex gap-1">
                                <span className="secondary font-bold text-xl">Permission</span>
                                <span className="text-red-600 text-xl">*</span>
                            </div>

                            <div className="mt-2 w-full flex flex-col gap-3">
                                {Object.keys(permissionList).map((role, index) => (
                                    <div key={index} className="border border-gray-300 bg-white rounded-md p-2">
                                        <h2 className="primary text-lg flex items-center gap-3" >
                                            <PlayArrowIcon
                                                className={`primary transform transition-transform duration-300 cursor-pointer ${expandedRoles[role] ? "rotate-90" : ""}`}
                                                onClick={() => toggleRoleVisibility(role)}
                                            />
                                            <div className="flex items-center gap-1">
                                                <span>{role}</span>
                                                <Checkbox
                                                    sx={{
                                                        color: "var(--color2)", // Color for unchecked checkboxes
                                                        '&.Mui-checked': {
                                                            color: "var(--color1)", // Color for checked checkboxes
                                                        },
                                                    }}
                                                    {...label}
                                                    checked={permissionList[role].every(permission => roleChecked[permission])}
                                                    onChange={(event) => {
                                                        const allChecked = event.target.checked;
                                                        const newCheckedState = { ...roleChecked };
                                                        permissionList[role].forEach(permission => {
                                                            newCheckedState[permission] = allChecked;
                                                        });
                                                        setRoleChecked(newCheckedState);
                                                    }}
                                                />

                                            </div>
                                        </h2>
                                        {expandedRoles[role] && (
                                            <div className="pl-10">
                                                {permissionList[role].map((permission, index) => (
                                                    <div key={index} className="flex items-center gap-2">
                                                        <Checkbox
                                                            sx={{
                                                                color: "var(--color2)", // Color for unchecked checkboxes
                                                                '&.Mui-checked': {
                                                                    color: "var(--color1)", // Color for checked checkboxes
                                                                },
                                                            }}
                                                            {...label}
                                                            checked={roleChecked[permission] || false}
                                                            onChange={(event) => handleCheckboxChange(event, permission)}
                                                        />
                                                        <span>{permission}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* <div className="mt-2 w-full">
                                {Object.keys(permissionList).map((role, index) => (
                                    <div key={index}>
                                        <h2 className="primary text-xl">
                                            <PlayArrowIcon className="text-black" />
                                            <span>{role}</span>
                                            <Checkbox 
sx={{
    color: "var(--color2)", // Color for unchecked checkboxes
    '&.Mui-checked': {
      color: "var(--color1)", // Color for checked checkboxes
    },
  }}
                                                {...label}
                                                checked={permissionList[role].every(permission => roleChecked[permission])}
                                                onChange={(event) => {
                                                    const allChecked = event.target.checked;
                                                    const newCheckedState = { ...roleChecked };
                                                    permissionList[role].forEach(permission => {
                                                        newCheckedState[permission] = allChecked;
                                                    });
                                                    setRoleChecked(newCheckedState);
                                                }}
                                            />
                                        </h2>
                                        <div className="flex pl-8  gap-4">
                                            {permissionList[role].map((permission, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <Checkbox 
sx={{
    color: "var(--color2)", // Color for unchecked checkboxes
    '&.Mui-checked': {
      color: "var(--color1)", // Color for checked checkboxes
    },
  }}
                                                        {...label}
                                                        checked={roleChecked[permission] || false}
                                                        onChange={(event) => handleCheckboxChange(event, permission)}
                                                    />
                                                    <span>{permission}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div> */}
                        </div>
                    </Box>
                }
            </div>
        </>
    );
}

export default CreateRole;
