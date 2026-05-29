
import CloseIcon from "@mui/icons-material/Close";

import React, { useState, useEffect } from "react";
import Header from "../../Header";
import Loader from "../../../componets/loader/Loader";
import { toast, ToastContainer } from "react-toastify";
import { BsLightbulbFill } from "react-icons/bs";
import { Select, MenuItem, TextField, Button, Dialog, DialogTitle, IconButton, DialogContent, DialogContentText, FormControl, DialogActions } from "@mui/material";
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
        if(customerId ==0){
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
            await axios.get("patient-family-relation-list?", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => {
                    setRelations(prevRelations => [
                        ...prevRelations,
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    const handleChange = (field, value) => {
        let error = "";
        if (field === "email") {
            if (!value) {
                error = "Email is required";
            } else if (!emailRegex.test(value)) {
                error = "Enter a valid email address";
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
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                newErrors.email = "Enter a valid email address";
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
    return (
        <Dialog
            open={addMember}
            onClose={() => setAddMember(false)}
            maxWidth="lg"
            fullWidth
            className="custom-dialog"
        >
            {/* HEADER */}
            <DialogTitle id="alert-dialog-title" className="secondary">
                
                {customerId?"Edit Membership":"Add Membership"}
                <IconButton
                    aria-label="close"
                    onClick={() => setAddMember(false)}
                    className="text-gray-500"
                    sx={{
                        position: "absolute",
                        right: 12,
                        top: 8,
                        color: "#ffffff",
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            {/* CONTENT */}
            <DialogContent sx={{ py: 4 }}>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                        gap: "24px",
                    }}
                >
                    <div
                        className="bg-white rounded-lg mt-4 mb-5 p-4 item_inner_box"
                        style={{
                            border: "1px solid #628a2f73",
                            boxShadow: "rgb(184 202 161 / 7%) 11px 12px 20px"
                        }}
                    >
                        {/* Plan Selection Row */}
                        <div className="flex justify-between gap-5 my-5">
                            <div className="flex flex-col w-full">
                                <label className="label">Select Plan <span className="text-red-600 ">*</span></label>
                                <Select
                                    size="small"
                                    value={formData.planId}
                                    onChange={(e) => handleChange("planId", e.target.value)}
                                    error={!!errors.planId}

                                    displayEmpty
                                >
                                    <MenuItem value="" disabled>Select Plan <span className="text-red-600 ">*</span></MenuItem>
                                    {planList.map(plan => (
                                        <MenuItem key={plan.id} value={plan.id}>
                                            {plan.plan_name} &#8377;{plan.price}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.planId && (
                                    <span className="text-red-600 text-xs">{errors.planId}</span>
                                )}


                            </div>

                            <div className="flex flex-col w-full">
                                <label className="label">Payment Method <span className="text-red-600 ">*</span></label>
                                <Select
                                    size="small"
                                    value={formData.paymentMethod}
                                    onChange={(e) => handleChange("paymentMethod", e.target.value)}
                                    displayEmpty
                                    required
                                    error={!!errors.paymentMethod}


                                >
                                    <MenuItem value="" disabled>Select Payment Method <span className="text-red-600 ">*</span></MenuItem>
                                    {paymentTypes.map(item => (
                                        <MenuItem key={item.id} value={item.type}>
                                            {item.type}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.paymentMethod && (
                                    <span className="text-red-600 text-xs">{errors.paymentMethod}</span>
                                )}

                            </div>

                            <div className="flex flex-col w-full">
                                <label className="label">Email <span className="text-red-600 ">*</span></label>
                                <TextField
                                    size="small"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleChange("email", e.target.value)}
                                    error={!!errors.email}
                                    helperText={errors.email}
                                />

                            </div>
                        </div>

                        {/* Dynamic Contact Forms */}
                        {selectedPlanData && formData.contacts.map((contact, index) => (
                            <React.Fragment key={index}>
                                <h3 className="font-semibold text-[16px]">
                                    Contact {index + 1}
                                    {index === 0 && (
                                        <span className="text-red-600"> *</span>
                                    )}
                                </h3>

                                <div
                                    className="flex justify-between gap-5 mb-6 border p-4 rounded-md"
                                    style={{ borderColor: "var(--color2)" }}
                                >
                                    <div className="flex flex-col w-full">
                                        <label className="label">Contact Name    {index === 0 && (
                                            <span className="text-red-600"> *</span>
                                        )}</label>
                                        <TextField
                                            size="small"
                                            type="text"
                                            value={contact.name}
                                            error={!!errors.contacts?.[index]?.name}
                                            helperText={errors.contacts?.[index]?.name}
                                            disabled={index < disableContacts}
                                            onChange={(e) => {
                                                const value = e.target.value;

                                                // allow only letters & spaces
                                                if (/^[A-Za-z\s]*$/.test(value)) {
                                                    handleContactChange(index, "name", value);
                                                }
                                            }}

                                        />



                                    </div>

                                    <div className="flex flex-col w-full">
                                        <label className="label">Mobile No    {index === 0 && (
                                            <span className="text-red-600"> *</span>
                                        )}</label>
                                        <TextField
                                            size="small"
                                            type="tel"
                                            value={contact.number}
                                            error={!!errors.contacts?.[index]?.number}
                                            helperText={errors.contacts?.[index]?.number}
                                            disabled={index < disableContacts}

                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, "");
                                                if (value.length <= 10) {
                                                    handleContactChange(index, "number", value);
                                                }
                                            }}
                                            inputProps={{
                                                maxLength: 10,
                                                pattern: "[0-9]*"
                                            }}
                                        />

                                    </div>

                                    <div className="flex flex-col w-full">
                                        <label className="label">Relation    {index === 0 && (
                                            <span className="text-red-600"> *</span>
                                        )}</label>
                                        <Select
                                            size="small"
                                            value={contact.relation}
                                            error={!!errors.contacts?.[index]?.relation}
                                            disabled={index < disableContacts}

                                            onChange={(e) => handleContactChange(index, "relation", e.target.value)}
                                            displayEmpty
                                        >
                                            <MenuItem value="" disabled>Select Relation </MenuItem>
                                            {relations.map(item => (
                                                <MenuItem key={item.id} value={item.name}>
                                                    {item.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </div>
                                </div>
                            </React.Fragment>
                        ))}
                        <Button
                            className="self-end"
                            variant="contained"
                            sx={{ backgroundColor: "#3f6212" }}
                            onClick={handleSubmit}
                        >
                            Submit
                        </Button>
                    </div>
                    {/* Submit Button */}

                </div>
            </DialogContent>
        </Dialog>
    );
}
