
import CloseIcon from "@mui/icons-material/Close";
import useSubmitShortcut from "../../../hooks/useSubmitShortcut";

import React, { useState, useEffect } from "react";
import Header from "../../Header";
import Loader from "../../../componets/loader/Loader";
import { toast, ToastContainer } from "react-toastify";
import { BsLightbulbFill } from "react-icons/bs";
import { Select, MenuItem, TextField, Button, Dialog, DialogTitle, IconButton, DialogContent, DialogContentText, FormControl, DialogActions, Autocomplete } from "@mui/material";
import axios from "axios";
import PlanDialog from "./Plandialog";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
;

export default function AddMemberDialog({ addMember, setAddMember, customerId }) {
    const history = useHistory();


    const [token, setToken] = useState(localStorage.getItem("token"));
    const [isLoading, setIsLoading] = useState(false);
    const [planList, setPlanList] = useState([])
    const [relations, setRelations] = useState([{
        "id": 0,
        "name": "Self"
    },])
    const [formData, setFormData] = useState({
        planId: "",
        paymentMethod: "",
        email: "",
        contacts: []
    });

    const paymentTypes = [
        { id: 1, type: "Cash" },

        { id: 3, type: "UPI" },
    ];

    const [errors, setErrors] = useState({
        planId: "",
        paymentMethod: "",
        email: "",
        contacts: []
    });

    const [disableContacts, setDisableContacts] = useState(Number)
    /*<======================================================================== Fetch data from API ====================================================================> */

    useEffect(() => {
        getPlanList()
        relationList()
        fetchMembersDetails()
    }, []);


    const fetchMembersDetails = async () => {
        if (customerId == 0) {
            return
        }

        const data = new FormData();
        data.append("customer_id", customerId)
        try {
            await axios.post("sehat-membership-customer-detail?", data, {

                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => {

                    setFormData({
                        planId: response.data.data.plan_id,
                        paymentMethod: response.data.data.payment_method,
                        email: response.data.data.email,
                        contacts: response.data.data.customers
                    })
                    setDisableContacts(Number(response.data.data.customers.length))

                });
        } catch (error) {
            console.error("API error:", error?.response?.status);
            if (error?.response?.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("userId");
                localStorage.removeItem("role");
                localStorage.clear();
                history.push("/");
            }
        }
    };




    /*<======================================================================== fetch plan list ====================================================================> */

    const getPlanList = async () => {

        try {
            await axios.get("sehat-membership-plan-list?", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => {
                    setPlanList(response.data.data);
                });
        } catch (error) {
            console.error("API error:", error?.response?.status);
            if (error?.response?.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("userId");
                localStorage.removeItem("role");
                localStorage.clear();
                history.push("/");
            }
        }
    };

    /*<======================================================================== fetch Relations list ====================================================================> */

    const relationList = async () => {
        try {
            await axios.get("patient-family-relation-list", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => {
                    setRelations([
                        { id: 0, name: "Self" },
                        ...response.data.data
                    ]);
                });
        } catch (error) {
            console.error("API error:", error?.response?.status);
            if (error?.response?.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("userId");
                localStorage.removeItem("role");
                localStorage.clear();
                history.push("/");
            }
        }
    };

    /*<======================================================================== Change plan ====================================================================> */

    const selectedPlanData = planList.find(
        plan => String(plan.id) === String(formData.planId)
    );

    // Sync contacts when plan OR plan list is ready (edit + create)
    useEffect(() => {
        if (!selectedPlanData) return;

        setFormData(prev => {
            const currentContacts = prev.contacts || [];
            const requiredLength = selectedPlanData.user_covered;

            // If contacts already exist (edit mode), preserve them
            if (currentContacts.length > 0) {
                if (currentContacts.length === requiredLength) {
                    return prev;
                }

                if (currentContacts.length > requiredLength) {
                    return {
                        ...prev,
                        contacts: currentContacts.slice(0, requiredLength),
                    };
                }

                return {
                    ...prev,
                    contacts: [
                        ...currentContacts,
                        ...Array.from(
                            { length: requiredLength - currentContacts.length },
                            () => ({ name: "", number: "", relation: "" })
                        ),
                    ],
                };
            }

            // Create mode: initialize empty contacts
            return {
                ...prev,
                contacts: Array.from(
                    { length: requiredLength },
                    () => ({ name: "", number: "", relation: "" })
                ),
            };
        });
    }, [formData.planId, planList]);


    // Handlers

    const emailRegex =
        /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com)$/i;

    const handleChange = (field, value) => {
        let error = "";
        // if (field === "email") {
        //     if (!value) {
        //         error = "Email is required";
        //     } else if (!emailRegex.test(value)) {
        //         error = "Enter a valid email address";
        //     }
        // }
        if (field === "email") {
            const email = value.trim();

            if (!email) {
                error = "Email is required";
            } else if (!emailRegex.test(email)) {
                error = "Please enter a valid email address";
            }
        }

        setFormData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: error }));

    };


    /*<==================================================================== handle contact form =============================================================== => */

    const handleContactChange = (index, field, value) => {
        const updatedContacts = [...formData.contacts];
        updatedContacts[index][field] = value;
        setFormData(prev => ({ ...prev, contacts: updatedContacts }));
    };

    /*<========================================================================== Validation ======================================================================> */
    const validateForm = () => {
        let isValid = true;

        const contactErrors = [];
        const newErrors = {
            planId: "",
            paymentMethod: "",
            email: "",
            contacts: []
        };

        // ---- Plan Validation ----
        if (!formData.planId) {
            newErrors.planId = "Plan is required";
            isValid = false;
        }

        // ---- Payment Method Validation ----
        if (!formData.paymentMethod) {
            newErrors.paymentMethod = "Payment method is required";
            isValid = false;
        }

        // ---- Email Validation ----
        if (!formData.email) {
            newErrors.email = "Email is required";
            isValid = false;
        } else {

            // if (!emailRegex.test(formData.email)) {
            //     newErrors.email = "Enter a valid email address";
            //     isValid = false;
            // }
            if (!emailRegex.test(formData.email.trim())) {
                newErrors.email = "Please enter a valid email address";
                isValid = false;
            }
        }

        // ---- Contacts Validation ----
        formData.contacts.forEach((contact, index) => {
            const err = {};

            const hasAnyValue =
                contact.name.trim() ||
                contact.number.trim() ||
                contact.relation;
            if (index === 0) {
                if (!contact.name.trim()) {
                    err.name = "Name is required";
                    isValid = false;
                }

                if (!contact.relation) {
                    err.relation = "Relation is required";
                    isValid = false;
                }

                if (!contact.number) {
                    err.number = "Number number is required";
                    isValid = false;
                } else if (contact.number.length !== 10) {
                    err.number = "Number number must be 10 digits";
                    isValid = false;
                }
            }


            contactErrors[index] = err;
        });

        newErrors.contacts = contactErrors;
        setErrors(newErrors);

        return isValid;
    };

    /*<========================================================================= handle submit =====================================================================> */

    const handleSubmit = async () => {

        if (!validateForm()) {
            return;
        }

        const data = new FormData();

        let API = "sehat-membership-plan-create";

        if (disableContacts <= 0) {
            API = "sehat-membership-plan-create"

        } else {
            API = "sehat-membership-customer-update"
            data.append("customer_id", customerId);
        }
        data.append("plan_id", String(formData.planId));
        data.append("payment_method", formData.paymentMethod);
        data.append("email", formData.email);
        data.append("customers", JSON.stringify(formData.contacts));

        try {
            await axios.post(API, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => {
                    toast.dismiss();
                    toast.success(response.data.message);
                    setFormData({
                        planId: "",
                        paymentMethod: "",
                        email: "",
                        contacts: []
                    });
                    setAddMember(false)
                });
        } catch (error) {
            console.error("API error:", error);
            toast.dismiss();
            toast.error(error.response.data.message);
            if (error?.response?.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("userId");
                localStorage.removeItem("role");
                localStorage.clear();
                history.push("/");
            }

        }

    };

    useSubmitShortcut(handleSubmit, addMember);

    return (
        <Dialog
            open={addMember}
            onClose={() => setAddMember(false)}
            maxWidth="md"
            fullWidth
            className="custom-dialog"
            PaperProps={{
                sx: {
                    borderRadius: "16px",
                    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.12)",
                    overflow: "hidden",
                }
            }}
        >
            {/* HEADER */}
            <DialogTitle
                id="alert-dialog-title"
                sx={{
                    background: "#1F3109 !important",
                    color: "#ffffff !important",
                    position: "relative",
                    py: 2.2,
                    px: 3,
                    fontWeight: 600,
                    fontSize: "1.15rem",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                }}
            >
                <span>{customerId ? "Edit Membership" : "Add Membership"}</span>
                <IconButton
                    aria-label="close"
                    onClick={() => setAddMember(false)}
                    sx={{
                        position: "absolute",
                        right: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "rgba(255, 255, 255, 0.85)",
                        padding: "8.5px 12px !important",
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            {/* CONTENT */}
            <DialogContent sx={{ p: 3, backgroundColor: "#fafbfa" }}>
                <div
                    style={{
                        backgroundColor: "#ffffff",
                        border: "1px solid rgba(98, 138, 47, 0.15)",
                        borderRadius: "12px",
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.02)",
                        padding: "24px",
                        marginTop: "16px"
                    }}
                >
                    {/* Plan Selection Row */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "24px" }}>
                        <div className="flex flex-col w-full">
                            <label className="label" style={{ fontWeight: 600, marginBottom: "6px", color: "#374151" }}>Select Plan <span className="text-red-600">*</span></label>
                            <Autocomplete
                                id="plan-autocomplete"
                                options={planList}
                                size="small"
                                value={planList.find(plan => String(plan.id) === String(formData.planId)) || null}
                                onChange={(e, newValue) => handleChange("planId", newValue ? newValue.id : "")}
                                getOptionLabel={(option) => option.plan_name ? `${option.plan_name} ₹${option.price}` : ""}
                                renderInput={(params) => (
                                    <TextField
                                        autoComplete="off"
                                        {...params}
                                        placeholder="Select Plan"
                                        error={!!errors.planId}
                                    />
                                )}
                            />
                            {errors.planId && (
                                <div style={{ color: "red", fontSize: "12px", marginTop: "4px", textAlign: "justify" }}>{errors.planId}</div>
                            )}
                        </div>

                        <div className="flex flex-col w-full">
                            <label className="label" style={{ fontWeight: 600, marginBottom: "6px", color: "#374151" }}>Payment Method <span className="text-red-600">*</span></label>
                            <Autocomplete
                                id="payment-method-autocomplete"
                                options={paymentTypes}
                                size="small"
                                value={paymentTypes.find(item => item.type === formData.paymentMethod) || null}
                                onChange={(e, newValue) => handleChange("paymentMethod", newValue ? newValue.type : "")}
                                getOptionLabel={(option) => option.type || ""}
                                renderInput={(params) => (
                                    <TextField
                                        autoComplete="off"
                                        {...params}
                                        placeholder="Select Payment Method"
                                        error={!!errors.paymentMethod}
                                    />
                                )}
                            />
                            {errors.paymentMethod && (
                                <div style={{ color: "red", fontSize: "12px", marginTop: "4px", textAlign: "justify" }}>{errors.paymentMethod}</div>
                            )}
                        </div>

                        <div className="flex flex-col w-full">
                            <label className="label" style={{ fontWeight: 600, marginBottom: "6px", color: "#374151" }}>Email <span className="text-red-600">*</span></label>
                            <TextField
                                size="small"
                                type="email"
                                value={formData.email}
                                placeholder="Email"
                                onChange={(e) => handleChange("email", e.target.value)}
                                error={!!errors.email}
                                sx={{
                                    "& .MuiOutlinedInput-input": {
                                        padding: "8.5px 12px !important",
                                    },
                                }}
                            />
                            {errors.email && (
                                <div style={{ color: "red", fontSize: "12px", marginTop: "4px", textAlign: "justify" }}>{errors.email}</div>
                            )}
                        </div>
                    </div>

                    {/* Dynamic Contact Forms */}
                    {selectedPlanData && formData.contacts.map((contact, index) => (
                        <React.Fragment key={index}>
                            <h3 style={{ fontWeight: 600, fontSize: "15px", color: "#1f2937", marginBottom: "8px", marginTop: index > 0 ? "20px" : "0px" }}>
                                Contact {index + 1}
                                {index === 0 && (
                                    <span className="text-red-600"> *</span>
                                )}
                            </h3>

                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                                    gap: "20px",
                                    border: "1px solid rgba(98, 138, 47, 0.15)",
                                    borderLeft: "4px solid #3f6212",
                                    padding: "20px",
                                    borderRadius: "10px",
                                    backgroundColor: "#fafcf8",
                                    marginBottom: "16px",
                                    boxShadow: "0 2px 8px rgba(98, 138, 47, 0.02)"
                                }}
                            >
                                <div className="flex flex-col w-full">
                                    <label className="label" style={{ fontWeight: 500, marginBottom: "6px", color: "#4b5563" }}>
                                        Contact Name {index === 0 && <span className="text-red-600"> *</span>}
                                    </label>
                                    <TextField
                                        size="small"
                                        type="text"
                                        value={contact.name}
                                        placeholder="Contact Name"
                                        error={!!errors.contacts?.[index]?.name}
                                        helperText={errors.contacts?.[index]?.name}
                                        disabled={index < disableContacts}
                                        onChange={(e) => {
                                            const value = e.target.value;

                                            if (/^[A-Za-z\s]*$/.test(value)) {
                                                handleContactChange(index, "name", value);

                                                setErrors((prev) => {
                                                    const updatedContacts = [...(prev.contacts || [])];

                                                    updatedContacts[index] = {
                                                        ...updatedContacts[index],
                                                        name: "",
                                                    };

                                                    return {
                                                        ...prev,
                                                        contacts: updatedContacts,
                                                    };
                                                });
                                            }
                                        }}
                                    />
                                </div>

                                <div className="flex flex-col w-full">
                                    <label className="label" style={{ fontWeight: 500, marginBottom: "6px", color: "#4b5563" }}>
                                        Mobile No {index === 0 && <span className="text-red-600"> *</span>}
                                    </label>
                                    <TextField
                                        size="small"
                                        type="tel"
                                        value={contact.number}
                                        placeholder="Mobile Number"
                                        error={!!errors.contacts?.[index]?.number}
                                        helperText={errors.contacts?.[index]?.number}
                                        disabled={index < disableContacts}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, "");

                                            if (value.length <= 10) {
                                                handleContactChange(index, "number", value);

                                                setErrors((prev) => {
                                                    const updatedContacts = [...(prev.contacts || [])];

                                                    updatedContacts[index] = {
                                                        ...updatedContacts[index],
                                                        number: "",
                                                    };

                                                    return {
                                                        ...prev,
                                                        contacts: updatedContacts,
                                                    };
                                                });
                                            }
                                        }}
                                        inputProps={{
                                            maxLength: 10,
                                            pattern: "[0-9]*"
                                        }}
                                    />
                                </div>

                                <div className="flex flex-col w-full">
                                    <label className="label" style={{ fontWeight: 500, marginBottom: "6px", color: "#4b5563" }}>
                                        Relation {index === 0 && <span className="text-red-600"> *</span>}
                                    </label>
                                    <Autocomplete
                                        size="small"
                                        options={relations || []}
                                        getOptionLabel={(option) => option.name || ""}
                                        value={
                                            relations.find((item) => item.name === contact.relation) || null
                                        }
                                        disabled={index < disableContacts}
                                        onChange={(event, newValue) => {
                                            handleContactChange(
                                                index,
                                                "relation",
                                                newValue ? newValue.name : ""
                                            );
                                            setErrors((prev) => {
                                                const updatedContacts = [...(prev.contacts || [])];

                                                updatedContacts[index] = {
                                                    ...updatedContacts[index],
                                                    relation: "",
                                                };

                                                return {
                                                    ...prev,
                                                    contacts: updatedContacts,
                                                };
                                            });
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="Select Relation"
                                                error={!!errors.contacts?.[index]?.relation}
                                                helperText={errors.contacts?.[index]?.relation}
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        </React.Fragment>
                    ))}

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>

                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: "#3f6212",

                                px: 4,
                                py: 1,
                                textTransform: "none",
                                fontWeight: 600,
                                boxShadow: "0 4px 12px rgba(63, 98, 18, 0.15)",
                                "&:hover": {
                                    backgroundColor: "#314d0e",
                                    boxShadow: "0 6px 16px rgba(63, 98, 18, 0.25)",
                                }
                            }}
                            onClick={handleSubmit}
                        >
                            Save
                        </Button>

                        <Button
                            variant="outlined"
                            onClick={() => setAddMember(false)}


                            style={{

                                borderColor: "#9ca3af !important",
                                background: "#dbdce0ff",       // Light Gray
                                color: "#4b5563",            // Dark Gray Text
                                border: "1px solid #d1d5db", // Gray Border
                                boxShadow: "none",
                                textTransform: "none",
                            }}
                            sx={{
                                "&:hover": {
                                    background: "#e5e7eb",     // Slightly Darker Gray
                                    borderColor: "#9ca3af !important",
                                    boxShadow: "none",
                                },
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
