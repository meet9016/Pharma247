import Header from "../../../Header"
import React, { useState, useRef, useEffect } from 'react';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import DeleteIcon from '@mui/icons-material/Delete';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Autocomplete from '@mui/material/Autocomplete';
import { Button, Checkbox, CircularProgress, Input, InputAdornment, ListItemText, TextField } from "@mui/material";
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import ListItem from '@mui/material/ListItem';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { MenuItem, Select } from '@mui/material';
import { BsLightbulbFill } from "react-icons/bs";
import BorderColorIcon from '@mui/icons-material/BorderColor';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import SearchIcon from "@mui/icons-material/Search";
import { Prompt } from "react-router-dom/cjs/react-router-dom";

// import '../../../purchaseReturnBill/Add-ReturnBill/AddReturnbill.css'
import { VscDebugStepBack } from "react-icons/vsc";
import { IoMdClose } from "react-icons/io";
import { FaCaretUp } from "react-icons/fa6";
import { Modal } from "flowbite-react";
import SaveIcon from '@mui/icons-material/Save';
import SaveAsIcon from '@mui/icons-material/SaveAs';
const Salereturn = () => {
    const token = localStorage.getItem("token")

    const [item, setItem] = useState('')
    const [billNo, setbillNo] = useState('')
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const options = ['Option 1', 'Option 2', 'Option 3'];
    const history = useHistory();
    const paymentOptions = [
        { id: 1, label: 'Cash' },
        { id: 3, label: 'UPI' },]
    const [customer, setCustomer] = useState(null);
    const [isVisible, setIsVisible] = useState(true);
    const [address, setAddress] = useState('');
    const [billing, setBilling] = useState('')
    const [doctor, setDoctor] = useState('')
    const [selectedOption, setSelectedOption] = useState(1);
    const [paymentType, setPaymentType] = useState('cash');
    const [error, setError] = useState({});
    const [expiryDate, setExpiryDate] = useState('');
    const [mrp, setMRP] = useState('');
    const [searchItemID, setSearchItemID] = useState(null);
    const [qty, setQty] = useState('');
    const [tempQty, setTempQty] = useState('')
    const [gst, setGst] = useState('');
    const [batch, setBatch] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [customerDetails, setCustomerDetails] = useState([])
    const [doctorData, setDoctorData] = useState([])
    const [ItemSaleList, setItemSaleList] = useState({ sales_item: [] });
    const [order, setOrder] = useState('');
    const [loc, setLoc] = useState('')
    const [randomNumber, setRandomNumber] = useState(null);
    const [base, setBase] = useState('')
    // const tableRef = useRef(null);
    const [unit, setUnit] = useState('')
    const [isEditMode, setIsEditMode] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalMargin, setTotalMargin] = useState(0)
    const [totalNetRate, setTotalNetRate] = useState(0);
    const [marginNetProfit, setMarginNetProfit] = useState(0);
    const [itemAmount, setItemAmount] = useState(null);
    const [selectedEditItemId, setSelectedEditItemId] = useState(null);
    const [IsDelete, setIsDelete] = useState(false);
    let defaultDate = new Date();
    const [cgst, setCgst] = useState('');
    const [sgst, setSgst] = useState('');
    const [searchItem, setSearchItem] = useState('');
    const [itemList, setItemList] = useState([]);
    defaultDate.setDate(defaultDate.getDate() + 3);
    const [tableData, setTableData] = useState([]);
    const [totalGst, setTotalGst] = useState(0);
    const [totalBase, setTotalBase] = useState(0);
    const [givenAmt, setGivenAmt] = useState(null);
    const [otherAmt, setOtherAmt] = useState('');
    const [roundOff, setRoundOff] = useState(0);
    const [netAmount, setNetAmount] = useState(0);
    const [finalDiscount, setFinalDiscount] = useState(0);
    const [dueAmount, setDueAmount] = useState(null);
    const [startDate, setStartDate] = useState(dayjs().subtract(3, 'month'));
    const [endDate, setEndDate] = useState(dayjs());
    const [saleItemId, setSaleItemId] = useState('');
    const [selectedEditItem, setSelectedEditItem] = useState(null);
    const [bankData, setBankData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [search, setSearch] = useState('');
    const [searchDoctor, setSearchDoctor] = useState('');
    const [selectedItem, setSelectedItem] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [unsavedItems, setUnsavedItems] = useState(false);
    const [nextPath, setNextPath] = useState("");
    const [errors, setErrors] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };
    /*<============================================================================ Input ref on keydown enter ===================================================================> */

    const [selectedIndex, setSelectedIndex] = useState(-1); // Index of selected row
    const tableRef = useRef(null); // Reference for table container
    const [isAutocompleteDisabled, setAutocompleteDisabled] = useState(true);

    const inputRefs = useRef([]);

    useEffect(() => {
        if (inputRefs?.current[0]) {
            inputRefs?.current[0]?.focus();
        }
    }, [inputRefs]);



    /*<============================================================ disable autocomplete to focus when tableref is focused  ===================================================> */



    const handleKeyPress = (e) => {
        if (!tableData?.sales_item?.length) return;

        const isInputFocused = document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA";
        if (isInputFocused) return;

        e.preventDefault(); // Prevent default scrolling behavior

        if (e.key === "ArrowDown") {
            setSelectedIndex((prev) => Math.min(prev + 1, tableData.sales_item.length - 1));
        } else if (e.key === "ArrowUp") {
            setSelectedIndex((prev) => Math.max(prev - 1, 0));
        } else if (e.key === "Enter" && selectedIndex !== -1) {
            const selectedRow = tableData.sales_item[selectedIndex];
            if (!selectedRow) return;
            handleEditClick(selectedRow);
        }
    };

    // New function specifically for arrow key navigation that works even when input is focused
    const handleArrowNavigation = (e) => {
        if (!tableData?.sales_item?.length) return;

        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault(); // Prevent default scrolling behavior

            if (e.key === "ArrowDown") {
                setSelectedIndex((prev) => Math.min(prev + 1, tableData.sales_item.length - 1));
            } else if (e.key === "ArrowUp") {
                setSelectedIndex((prev) => Math.max(prev - 1, 0));
            }
        }
        else if (e.key === "Enter" && selectedIndex !== -1) {
            const selectedRow = tableData.sales_item[selectedIndex];
            if (!selectedRow) return;
            handleEditClick(selectedRow);
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", handleKeyPress);
        return () => document.removeEventListener("keydown", handleKeyPress);
    }, [tableData, selectedIndex]);

    useEffect(() => {
        if (searchDoctor) {
            const ListOfDoctor = async () => {
                const params = {
                    search: searchDoctor
                };
                setIsLoading(true);
                try {
                    const response = await axios.post(
                        "doctor-list?",

                        {
                            params: params,
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    setDoctorData(response.data.data);
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

            const delayDebounceFn = setTimeout(() => {
                ListOfDoctor();
            }, 500);

            return () => clearTimeout(delayDebounceFn);
        } else {
            setDoctorData([]);
        }
    }, [searchDoctor]);

    useEffect(() => {
        // ListOfDoctor();
        const RandomNumber = localStorage.getItem('RandomNumber')
        setRandomNumber(RandomNumber)

        BankList();
        const handleClickOutside = (event) => {
            if (tableRef.current && !tableRef.current.contains(event.target)) {
                setIsVisible(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const customerRef = useRef(customer);

    useEffect(() => {
        customerRef.current = customer;
    }, [customer]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            const isAltCombo = event.altKey || event.getModifierState("AltGraph");
            if (!isAltCombo || event.repeat) return;

            const key = event.key.toLowerCase();
            if (key !== "s" && key !== "m") return;

            event.preventDefault();

            if (key === "s") {
                if (isSubmitting) return;

                if (!customer || !customer.id) {
                    toast.dismiss();
                    toast.error('Please select customer');
                    setError({ customer: "Please select customer" });
                    return;
                }

                handleSubmit(); // direct call
            }

            if (key === "m") {
                removeItem();
                setSelectedEditItemId(null);
                setSelectedIndex(-1);
                setSearchItem("");
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);

    }, [
        customer,
        tableData,
        isSubmitting,

        netAmount,
        totalAmount,
        totalBase,
        totalGst,
        roundOff,
        totalMargin,
        totalNetRate,
        marginNetProfit,
        otherAmt,
        finalDiscount
    ]);


    useEffect(() => {
        const totalAmount = (qty / unit);
        const total = parseFloat(base) * totalAmount;
        if (total) {
            setItemAmount(total.toFixed(2));
        } else {
            setItemAmount(0);
        }
    }, [base, qty]);

    useEffect(() => {
        if (totalAmount < -otherAmt) {
            setOtherAmt('');
        }
        const finalAmount = Number(totalAmount) + Number(otherAmt || 0);
        const decimalPart = Number((finalAmount % 1).toFixed(2));
        const roundedDecimal = decimalPart;
        if (decimalPart < 0.50) {
            setRoundOff(-roundedDecimal);
            setNetAmount(Math.floor(finalAmount));
        } else {
            setRoundOff(1 - roundedDecimal);
            setNetAmount(Math.ceil(finalAmount));

        }
    }, [totalAmount, otherAmt]);

    const handleCustomerOption = (event, newValue) => {
        setCustomer(newValue);
    };

    const BankList = async () => {
        try {
            await axios.post('bank-list', {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            ).then((response) => {
                setBankData(response.data.data);
                if (response.data.status === 401) {
                    history.push('/');
                    localStorage.clear();
                }
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

    const ListOfDoctor = async () => {

        setIsLoading(true);
        try {
            await axios.post("doctor-list", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            ).then((response) => {
                setDoctorData(response.data.data)
                setIsLoading(false);
            })
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

    useEffect(() => {
        if (selectedEditItem) {
            setUnit(selectedEditItem.unit);
            setSearchItemID(selectedEditItem.item_id)
            setBatch(selectedEditItem.batch);
            setExpiryDate(selectedEditItem.exp);
            setMRP(selectedEditItem.mrp);
            setQty(selectedEditItem.qty);
            setBase(selectedEditItem.base);
            setGst(selectedEditItem.gst);
            setLoc(selectedEditItem.location);
            setOrder(selectedEditItem.order);
            setItemAmount(selectedEditItem.net_rate);
        }
    }, [selectedEditItem]);

    useEffect(() => {
        if (searchQuery) {
            const customerAllData = async () => {
                const params = {
                    search: searchQuery
                };
                setIsLoading(true);
                try {
                    const response = await axios.post(
                        "list-customer?",
                        {
                            params: params,
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    setCustomerDetails(response.data.data);
                    setIsLoading(false);
                    if (response.data.status === 401) {
                        history.push('/');
                        localStorage.clear();
                    }
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

            const delayDebounceFn = setTimeout(() => {
                customerAllData();
            }, 500);

            return () => clearTimeout(delayDebounceFn);
        } else {
            setCustomerDetails([]);
        }
    }, [searchQuery, token]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        getSaleItemList(value);
    };

    const handleChecked = async (itemId, checked) => {
        setUnsavedItems(true);
        let data = new FormData();
        data.append("id", itemId ? itemId : '');
        data.append("type", 0);

        try {
            const response = await axios.post("sales-return-iteam-select", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data) {
                setSelectedItem((prevSelected) => {
                    if (checked) {
                        return [...prevSelected, itemId];
                    } else {
                        return prevSelected.filter((id) => id !== itemId);
                    }
                });
                // const allSelected = returnItemList?.item_list.every(item => item.iss_check) || false;
                // setSelectAll(allSelected);
                validfilter()

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
    };

    const validfilter = () => {
        setUnsavedItems(true)
        const newErrors = {};
        // if (!customer || !customer.id) {
        //     newErrors.customer = 'Customer is required'; toast.dismiss();
        //     toast.error('Customer is required');
        // }
        if (!startDate) {
            newErrors.startDate = 'startDate is required'; toast.dismiss();
            toast.error('Start Date is required');
        }
        if (!endDate) {
            newErrors.endDate = 'endDate is required'; toast.dismiss();
            toast.error('End Date is required');
        }

        // setErrors(newErrors);
        const isValid = Object.keys(newErrors).length === 0;
        if (isValid) {
            getSaleItemList();

        }
    }

    const getSaleItemList = async (value) => {

        let data = new FormData();
        data.append('customer_id', (customer && customer.id) ? customer.id : '');
        data.append('start_date', startDate.format('YYYY-MM-DD') ? startDate.format('YYYY-MM-DD') : '');
        data.append('end_date', endDate.format('YYYY-MM-DD') ? endDate.format('YYYY-MM-DD') : '');
        data.append('search', value ? value : '');
        const params = {
            customer_id: (customer && customer.id) ? customer.id : '',
            start_date: startDate ? startDate : '',
            end_date: endDate ? endDate : ''
        }
        setIsLoading(true);
        try {
            await axios.post("sales-return-iteam-list", data, {
                // params: params,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            ).then((response) => {
                setTableData(response.data.data)
                setTotalBase(response.data.data.total_base)
                setTotalGst(response.data.data.total_gst)
                setSgst(response.data.data.sgst)
                setCgst(response.data.data.cgst)
                setTotalAmount(response.data.data.sales_amount)
                setTotalMargin(response.data.data.total_margin)
                setTotalNetRate(response.data.data.total_net_rate)
                setMarginNetProfit(response.data.data.margin_net_profit)
                setIsLoading(false);
                setTimeout(() => {
                    inputRefs?.current[5]?.focus();
                }, 0);
            })
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

    const editReturnItem = async () => {
        const newErrors = {};
        setUnsavedItems(true);

        if (Number(tempQty) < Number(qty)) {
            newErrors.greatqty = 'Quantity should not be greater than purchase quantity ';
            toast.dismiss();
            toast.error('Quantity should not be greater than purchase quantity ')
            return
        }

        setErrors(newErrors);
        const isValid = Object.keys(newErrors).length === 0;
        if (isValid) {
            let data = new FormData();
            data.append("id", selectedEditItemId ? selectedEditItemId : '')
            data.append('item_id', searchItemID ? searchItemID : '')
            data.append("qty", qty ? qty : '')
            data.append("exp", expiryDate ? expiryDate : '')
            data.append('gst', gst ? gst : '')
            data.append("mrp", mrp ? mrp : '')
            data.append("unit", unit);
            data.append("unit", unit ? unit : '')
            data.append("batch", batch ? batch : '')
            data.append('location', loc ? loc : '')
            data.append("base", base ? base : '')
            data.append('amt', itemAmount ? itemAmount : '')
            data.append('net_rate', itemAmount ? itemAmount : '')
            data.append("total_gst", totalGst || '')

            // data.append("order", order)
            const params = {
                id: selectedEditItemId || ''
            };
            try {
                await axios.post("sales-return-edit-iteam?", data, {
                    params: params,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }).then((response) => {
                    getSaleItemList();
                    setSearchItem(null)
                    setUnit('')
                    setBatch('')
                    setExpiryDate('');
                    setMRP('')
                    setQty(0)
                    setBase('')
                    setGst('')
                    setLoc('')
                })
            }
            catch (e) {
                   if (e?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
            }
        }
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const currentIndex = inputRefs.current.findIndex(ref => ref === event.target);

            // Check if we're on the last input field (qty field at index 12)
            if (currentIndex === 12) {
                // Call editReturnItem and don't move focus or highlight row
                editReturnItem();
                setSelectedIndex(-1); // Clear any row highlighting
                setIsEditMode(false); // Turn off edit mode
                event.target.blur(); // Remove focus from the qty field

                // Clear all form fields
                removeItem();
                setSelectedEditItemId(null);

                return; // Exit early to prevent focus change
            }

            if (currentIndex !== -1) {
                for (let i = currentIndex + 1; i < inputRefs.current.length; i++) {
                    const nextRef = inputRefs.current[i];
                    if (nextRef && !nextRef.disabled) {
                        // Handle DatePicker refs differently
                        if (nextRef.input) {
                            nextRef.input.focus();
                        } else if (typeof nextRef.focus === 'function') {
                            nextRef.focus();
                        }
                        break;
                    }
                }
            }
        }
    };

    const handleSubmit = () => {
        if (isSubmitting) {
            toast.warning("Please wait, request in progress...");
            return;
        }

        const newErrors = {};
        if (!customer || !customer.id) {
            newErrors.customer = 'Please select customer';
            toast.dismiss();
            toast.error('Please select customer');
            setError(newErrors);
            return;
        }
        if (!tableData || !Array.isArray(tableData.sales_item) || tableData.sales_item.length === 0) {

            newErrors.sales_item = 'Please add at least one item';
            toast.dismiss();
            toast.error('Please add at least one item');
            setError(newErrors);
            return;
        }
        setError({});
        submitSaleReturnData();
    }

    const submitSaleReturnData = async () => {
        if (isSubmitting) {
            toast.warning("Please wait, request in progress...");
            return;
        }

        setIsSubmitting(true);
        const hasUncheckedItems = tableData?.sales_item.every(item => item.iss_check === false)
        if (hasUncheckedItems) {
            toast.dismiss();
            toast.error('Please select at least one item');;

        } else {
            let data = new FormData();
            data.append("bill_no", localStorage.getItem('SaleRetunBillNo') ? localStorage.getItem('SaleRetunBillNo') : '');
            data.append("bill_date", (selectedDate ? selectedDate.format('YYYY-MM-DD') : ''));
            data.append("customer_id", (customer && customer.id) ? customer.id : '');
            data.append("customer_address", address ? address : '');
            data.append("doctor_id", (doctor && doctor.id) ? doctor.id : '');
            data.append('payment_name', paymentType ? paymentType : '');
            data.append('mrp_total', totalAmount ? totalAmount : '');
            data.append('total_discount', finalDiscount ? finalDiscount : '');
            data.append('other_amount', otherAmt ? otherAmt : '');
            data.append('net_amount', netAmount ? netAmount : '');
            data.append('total_base', totalBase ? totalBase : '');
            data.append('total_gst', totalGst ? totalGst : '');
            data.append('round_off', roundOff ? roundOff : '');
            data.append('net_amount', netAmount ? netAmount : '');
            data.append('margin', totalMargin ? totalMargin : '');
            data.append('net_rate', totalNetRate ? totalNetRate : '');
            data.append('margin_net_profit', marginNetProfit)

            data.append('igst', '0');
            data.append('cgst', '0');
            data.append('sgst', '0');
            data.append('product_list', JSON.stringify(tableData.sales_item) ? JSON.stringify(tableData.sales_item) : '');
            data.append("draft_save", "1");
            data.append("start_date", startDate.format('YYYY-MM-DD'))
            data.append("end_date", endDate.format('YYYY-MM-DD'))

            try {
                await axios.post("sales-return-create", data, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
                ).then((response) => {
                    toast.dismiss();
                    toast.success(response.data.message);
                    setUnsavedItems(false);

                    setTimeout(() => {

                        setIsSubmitting(false);
                        history.push('/saleReturn');
                    }, 2000);
                })
            } catch (error) {
                console.error("API error:", error);
                setIsSubmitting(false);
   if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
            }
        }

    }

    const handleDoctorOption = (event, newValue) => {
        setDoctor(newValue);
        setUnsavedItems(true)
    };

    const deleteOpen = (Id) => {
        setIsDelete(true);
        setSaleItemId(Id);

    };

    const handleDeleteItem = async (saleItemId) => {
        if (!saleItemId) return;
        let data = new FormData();
        data.append("id", saleItemId ? saleItemId : '');
        const params = {
            id: saleItemId,
        };
        try {
            await axios.post("sales-return-delete-iteam?", data, {
                params: params,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
            ).then((response) => {
                getSaleItemList();
                setIsDelete(false);
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

    const removeItem = () => {
        setUnit('');
        setBatch('');
        setSearchItem(' ')
        setExpiryDate('');
        setMRP('');
        setBase('');
        setGst('');
        setQty(0)
        setOrder('')
        setLoc('');
        setItemAmount(0);
        if (isNaN(itemAmount)) {
            setItemAmount(0);
        }
        setIsEditMode(false);
        setTimeout(() => {
            inputRefs?.current[5]?.focus();
        }, 0);
    }

    const handleEditClick = (item) => {
        // const existingItem = uniqueId.find((obj) => obj.id === item.id);
        // if (!existingItem) {
        //     setUniqueId((prevUniqueIds) => [...prevUniqueIds, { id: item.id, qty: item.total_stock}]);
        //     setTempQty(item.total_stock);
        // } else {
        //     setTempQty(existingItem.total_stock);
        // }
        inputRefs.current[10].focus();
        setTempQty(item.total_stock);

        setSelectedEditItem(item);
        setIsEditMode(true);
        setSelectedEditItemId(item.id);
        setSearchItem(item.iteam_name)
    };

    const handleQty = (value) => {
        const newQty = Number(value);
        if (newQty > tempQty) {
            setQty(tempQty);
            toast.dismiss();
            toast.error(`Quantity exceeds the allowed limit. Max available: ${tempQty}`);
        } else if (newQty < 0) {
            setQty(tempQty);
            toast.dismiss();
            toast.error(`Quantity should not be less than 0`);
        } else {
            setQty(newQty)
        }
    }



    useEffect(() => {
        const savedState = localStorage.getItem("unsavedItems");
        if (savedState === "false") {
            setUnsavedItems(true);
        }

        return () => {
            localStorage.setItem("unsavedItems", unsavedItems.toString());
        };
    }, [unsavedItems]);

    const handleNavigation = (path) => {
        setOpenModal(true);
        setNextPath(path);
    };

    const handleClearHistory = async () => {
        const randomNumber = Number(localStorage.getItem("RandomNumber"));
        let data = new FormData();
        data.append('customer_id', (customer && customer.id) ? customer.id : '');
        data.append('start_date', startDate.format('YYYY-MM-DD') ? endDate.format('YYYY-MM-DD') : '');
        data.append('end_date', endDate.format('YYYY-MM-DD') ? endDate.format('YYYY-MM-DD') : '');

        try {
            const response = await axios.post("sales-return-delete-history", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setUnsavedItems(false);
                localStorage.setItem("unsavedItems", unsavedItems.toString());
                getSaleItemList();

            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setUnsavedItems(false);
                localStorage.setItem("unsavedItems", unsavedItems.toString());

            } else {
                if (error.response && error.response.status === 401) {
                    setUnsavedItems(false);
                    localStorage.setItem("unsavedItems", unsavedItems.toString());

                } else {
                    console.error("Error deleting items:", error);
                }
            }
        }
    };

    const handleLeavePage = async () => {
        const randomNumber = Number(localStorage.getItem("RandomNumber"));
        let data = new FormData();
        data.append('customer_id', (customer && customer.id) ? customer.id : '');
        data.append('start_date', startDate.format('YYYY-MM-DD') ? endDate.format('YYYY-MM-DD') : '');
        data.append('end_date', endDate.format('YYYY-MM-DD') ? endDate.format('YYYY-MM-DD') : '');

        try {
            const response = await axios.post("sales-return-delete-history", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setUnsavedItems(false);
                setOpenModal(false);
                localStorage.setItem("unsavedItems", unsavedItems.toString());
                setTimeout(() => {
                    history.push(nextPath);
                }, 0);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setUnsavedItems(false);
                setOpenModal(false);
                localStorage.setItem("unsavedItems", unsavedItems.toString());
                setTimeout(() => {
                    history.push(nextPath);
                }, 0);

            } else {
                if (error.response && error.response.status === 401) {
                    setUnsavedItems(false);
                    setOpenModal(false);
                    localStorage.setItem("unsavedItems", unsavedItems.toString());
                    setTimeout(() => {
                        history.push(nextPath);
                    }, 0);
                } else {
                    console.error("Error deleting items:", error);
                }
            }
        }
    };


    {/*<================================================================ ui   =====================================================> */ }


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

            <div className="p-6"
                style={{
                    height: "calc(-125px + 100vh)",
                    overflow: "auto",
                }}>

                {/*<================================================================ header   =====================================================> */}


                <div className="flex flex-wrap items-center justify-between gap-2 row border-b border-dashed pb-4 border-[var(--color1)]" >

                    <div className="flex items-center gap-2">
                        <span className="text-[var(--color2)] font-bold text-[20px] cursor-pointer"
                            onClick={() => { history.push('/saleReturn') }} >Sales Return</span>

                        <span className="w-6 h-6">
                            <ArrowForwardIosIcon
                                fontSize="small"
                                className="text-[var(--color1)]"
                            />
                        </span>

                        <span className="text-[var(--color1)] font-bold text-[20px]">New</span>

                        <BsLightbulbFill className="w-6 h-6 text-[var(--color2)] hover-yellow" onClick={() => setShowModal(true)} />
                    </div>

                    <div className="flex items-center gap-2">
                        <Select
                            labelId="dropdown-label"
                            id="dropdown"
                            className="payment_divv"
                            value={paymentType}
                            sx={{ minWidth: '150px' }}
                            onChange={(e) => { setPaymentType(e.target.value) }}
                            size="small"
                        >
                            <MenuItem value="cash">Cash</MenuItem>
                            <MenuItem value="credit">Credit</MenuItem>
                            {bankData?.map(option => (
                                <MenuItem key={option.id} value={option.id}>{option.bank_name}</MenuItem>
                            ))}
                        </Select>
                        <Button variant="contained" className="payment_btn_divv" sx={{ textTransform: 'none', background: "var(--color1)" }} onClick={() => handleSubmit()}> Submit</Button>

                    </div>
                </div>
                {/*<=========================================================== Top detail   ==========================================================> */}


                <div className=" flex gap-4  mt-4">
                    <div className="flex flex-row gap-4 overflow-x-auto w-full items-end">
                        <div >
                            <span className="title mb-2" >Bill No <span className="text-red-600">*</span></span>
                            <TextField
                                autoComplete="off"
                                id="outlined-number"
                                type='number'
                                size="small"
                                sx={{
                                    width: "100%",
                                    minWidth: "200px",
                                    minHeight: "40px",
                                    "@media (max-width:600px)": { minWidth: "200px" },
                                }}
                                value={localStorage.getItem('SaleRetunBillNo')}
                                disabled
                            />
                        </div>

                        <div >
                            <span className="title mb-2 flex  items-center gap-2">Customer Mobile / Name <span className="text-red-600">*</span></span>
                            <Autocomplete
                                value={customer}
                                onChange={handleCustomerOption}
                                inputValue={searchQuery}
                                onInputChange={(event, newInputValue) => {
                                    setSearchQuery(newInputValue);
                                    // setUnsavedItems(true);
                                }}
                                autoFocus
                                options={customerDetails}
                                getOptionLabel={(option) => option.name ? `${option.name} [${option.phone_number}]` : option.phone_number || ''}
                                isOptionEqualToValue={(option, value) => option.phone_number === value.phone_number}
                                loading={isLoading}
                                sx={{
                                    width: "100%",
                                    minWidth: "350px",
                                    minHeight: "40px",

                                    "@media (max-width:600px)": { minWidth: "250px" },
                                }}
                                freeSolo
                                size="small"
                                renderOption={(props, option) => (
                                    <ListItem {...props}>
                                        <ListItemText
                                            primary={`${option.name} `}
                                            secondary={`Mobile No: ${option.phone_number}`}
                                        />
                                    </ListItem>
                                )}
                                renderInput={(params) => (
                                    <TextField
                                        autoComplete="off"
                                        {...params}
                                        variant="outlined"
                                        placeholder="Search by Mobile, Name"
                                        inputRef={el => inputRefs.current[0] = el}
                                        onKeyDown={handleKeyDown}
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <>
                                                    {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                                    {params.InputProps.endAdornment}
                                                </>
                                            ),

                                            style: { textTransform: "uppercase" },

                                        }}

                                    />
                                )}
                            />

                        </div>

                        <div >
                            <span className="title mb-2 flex  items-center gap-2">Doctor </span>
                            <Autocomplete
                                value={doctor}
                                onChange={handleDoctorOption}
                                inputValue={searchDoctor}
                                onInputChange={(event, newInputValue) => {
                                    setSearchDoctor(newInputValue);
                                    // setUnsavedItems(true);

                                }}
                                options={doctorData}
                                getOptionLabel={(option) => option.name ? `${option.name} [${option.clinic}]` : option.clinic || ''}
                                isOptionEqualToValue={(option, value) => option.clinic === value.clinic}
                                loading={isLoading}
                                sx={{
                                    width: "100%",
                                    minWidth: "350px",
                                    minHeight: "40px",

                                    "@media (max-width:600px)": { minWidth: "250px" },
                                }}
                                renderOption={(props, option) => (
                                    <ListItem {...props}>
                                        <ListItemText
                                            primary={`${option.name} `}
                                            secondary={`Mobile No: ${option.clinic}`}
                                        />
                                    </ListItem>
                                )}
                                renderInput={(params) => (
                                    <TextField
                                        autoComplete="off"
                                        {...params}
                                        variant="outlined"
                                        placeholder="Search by DR. Name, Clinic Name"
                                        inputRef={el => inputRefs.current[1] = el}
                                        onKeyDown={handleKeyDown}
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <>
                                                    {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                                    {params.InputProps.endAdornment}
                                                </>
                                            ),

                                            style: { textTransform: "uppercase" },
                                        }}
                                        sx={{
                                            '& .MuiInputBase-input::placeholder': {
                                                fontSize: '1rem',
                                                color: 'black',
                                            },
                                        }}
                                    />
                                )}
                            />
                        </div>


                        <div >
                            <span className="title mb-2">Start Date <span className="text-red-600">*</span></span>
                            <DatePicker
                                className="custom-datepicker"
                                selected={startDate ? startDate.toDate() : null}
                                onChange={(newDate) => {
                                    setStartDate(dayjs(newDate));
                                    setUnsavedItems(true);
                                }}
                                dateFormat="dd/MM/yyyy"
                                ref={(el) => (inputRefs.current[2] = el)}
                                onKeyDown={(e) => handleKeyDown(e, 2)}
                            />
                        </div>

                        <div>
                            <span className="title mb-2" >End Date</span>
                            <DatePicker
                                className="custom-datepicker"
                                selected={endDate ? endDate.toDate() : null}
                                onChange={(newDate) => {
                                    setEndDate(dayjs(newDate));
                                    setUnsavedItems(true);
                                }}
                                dateFormat="dd/MM/yyyy"
                                ref={(el) => (inputRefs.current[3] = el)}
                                onKeyDown={(e) => handleKeyDown(e, 3)}
                            />
                        </div>

                        <div>
                            <Button
                                variant="contained"
                                className="gap-2 sale_dates_divv_btn filter_btn_add"
                                size="small"
                                style={{
                                    // minHeight: '41px',
                                    alignItems: "center",
                                    height: '40px',
                                    // marginTop: "7px",
                                    background: "var(--color1)"
                                }}
                                ref={el => inputRefs.current[4] = el}
                                onKeyDown={()=>{
                                     handleClearHistory();
                                    validfilter();
                                }}

                                onClick={() => {
                                    handleClearHistory();
                                    validfilter();
                                }}
                            >
                                <FilterAltIcon size='large' style={{ color: "white", fontSize: '20px' }} /> Filter
                            </Button>
                        </div>

                    </div>
                </div>

                {/*<=========================================================== Item Table   ==========================================================> */}

                <div className="table-container">
                    <table className="w-full border-collapse item-table" tabIndex={0} ref={tableRef}>
                        <thead>
                            <tr>
                                <th>
                                    <div className="flex justify-center items-center gap-2">
                                        Search Item Name<span className="text-red-600">*</span>
                                    </div>
                                </th>
                                <th>Unit<span className="text-red-600">*</span></th>
                                <th>Batch<span className="text-red-600">*</span></th>
                                <th>Expiry<span className="text-red-600">*</span></th>
                                <th>MRP<span className="text-red-600">*</span></th>
                                <th>Base<span className="text-red-600">*</span></th>
                                <th>GST%<span className="text-red-600">*</span></th>
                                <th>QTY<span className="text-red-600">*</span></th>
                                <th>Loc.</th>
                                <th>Amount</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr className="input-row">
                                <td className="p-0">
                                    {isEditMode ? (
                                        <div style={{ fontSize: 15, fontWeight: 600, minWidth: 366, padding: 0, display: 'flex', alignItems: 'flex-end' }}>
                                            <DeleteIcon className="delete-icon mr-2" onClick={removeItem} />
                                            {searchItem?.slice(0, 30)}{searchItem?.length > 30 ? '...' : ''}
                                        </div>
                                    ) : (
                                        <TextField
                                            autoComplete="off"
                                            id="outlined-basic"
                                            size="small"
                                            fullWidth
                                            sx={{
                                                minWidth: 400,
                                                width: "100%",
                                            }}

                                            value={search}
                                            onChange={handleInputChange}
                                            variant="outlined"
                                            placeholder="Please search any items.."
                                            inputRef={el => inputRefs.current[5] = el}
                                            onKeyDown={e => {
                                                if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter") {
                                                    handleArrowNavigation(e);
                                                }
                                            }}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="start">
                                                        <svg width="20" height="20" fill="gray"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></svg>
                                                    </InputAdornment>
                                                ),
                                                type: "search",
                                            }}
                                        />
                                    )}
                                </td>
                                <td>
                                    <TextField
                                        autoComplete="off"
                                        id="outlined-number"
                                        disabled
                                        type="number"
                                        inputRef={el => inputRefs.current[6] = el}
                                        onKeyDown={handleKeyDown}
                                        size="small"
                                        value={unit}
                                        sx={{
                                            minWidth: "40px",
                                            width: "100%",
                                            '& .MuiInputBase-input': {
                                                textAlign: 'center',
                                            },
                                        }}
                                        onChange={(e) => { setUnit(e.target.value) }}
                                    />
                                </td>
                                <td>
                                    <TextField
                                        autoComplete="off"
                                        id="outlined-number"
                                        type="string"
                                        sx={{
                                            minWidth: "100px",
                                            width: "100%",
                                            '& .MuiInputBase-input': {
                                                textAlign: 'center',
                                            },
                                        }}
                                        size="small"
                                        disabled
                                        value={batch}
                                        inputRef={el => inputRefs.current[7] = el}
                                        onKeyDown={handleKeyDown}
                                    />
                                </td>
                                <td>
                                    <TextField
                                        autoComplete="off"
                                        id="outlined-number"
                                        disabled
                                        size="small"
                                        sx={{
                                            minWidth: "65px",
                                            width: "100%",
                                            '& .MuiInputBase-input': {
                                                textAlign: 'center',
                                            },
                                        }}
                                        inputRef={el => inputRefs.current[8] = el}
                                        onKeyDown={handleKeyDown}
                                        value={expiryDate}
                                        placeholder="MM/YY"
                                    />
                                </td>
                                <td>
                                    <TextField
                                        autoComplete="off"
                                        disabled
                                        id="outlined-number"
                                        type="number"
                                        sx={{
                                            minWidth: "65px",
                                            width: "100%",
                                            '& .MuiInputBase-input': {
                                                textAlign: 'center',
                                            },
                                        }}
                                        size="small"
                                        inputRef={el => inputRefs.current[9] = el}
                                        onKeyDown={handleKeyDown}
                                        value={mrp}
                                        onChange={(e) => { setMRP(e.target.value) }}
                                    />
                                </td>
                                <td>
                                    <TextField
                                        autoComplete="off"
                                        id="outlined-number"
                                        type="number"
                                        sx={{
                                            minWidth: "65px",
                                            width: "100%",
                                            '& .MuiInputBase-input': {
                                                textAlign: 'center',
                                            },
                                        }}
                                        size="small"
                                        inputRef={el => inputRefs.current[10] = el}
                                        onKeyDown={handleKeyDown}
                                        value={base}
                                        onChange={(e) => { setBase(e.target.value) }}
                                    />
                                </td>
                                <td>
                                    <TextField
                                        autoComplete="off"
                                        id="outlined-number"
                                        type="number"
                                        disabled
                                        size="small"
                                        inputRef={el => inputRefs.current[11] = el}
                                        onKeyDown={handleKeyDown}
                                        sx={{
                                            minWidth: "40px",
                                            width: "100%",
                                            '& .MuiInputBase-input': {
                                                textAlign: 'center',
                                            },
                                        }}
                                        value={gst}
                                        onChange={(e) => { setGst(e.target.value) }}
                                    />
                                </td>
                                <td>
                                    <TextField
                                        autoComplete="off"
                                        id="outlined-number"
                                        type="number"
                                        sx={{
                                            minWidth: "65px",
                                            width: "100%",
                                            '& .MuiInputBase-input': {
                                                textAlign: 'center',
                                            },
                                        }}
                                        size="small"
                                        inputRef={el => inputRefs.current[12] = el}
                                        onKeyDown={handleKeyDown}
                                        value={qty}
                                        onChange={(e) => { handleQty(e.target.value) }}
                                    />
                                </td>
                                <td>
                                    <TextField
                                        autoComplete="off"
                                        id="outlined-number"
                                        size="small"
                                        inputRef={el => inputRefs.current[13] = el}
                                        onKeyDown={handleKeyDown}
                                        disabled
                                        sx={{
                                            minWidth: "65px",
                                            width: "100%",
                                            '& .MuiInputBase-input': {
                                                textAlign: 'center',
                                            },
                                        }}
                                        value={loc}
                                        onChange={(e) => { setLoc(e.target.value) }}
                                    />
                                </td>
                                <td className="total">
                                    <span className="font-bold">{itemAmount}</span>
                                </td>
                            </tr>

                            {/* Data rows */}
                            {tableData?.sales_item?.length > 0 && (
                                tableData.sales_item.map((item, index) => (
                                    <tr
                                        key={item.id}
                                        onClick={(event) => {
                                            handleEditClick(item);
                                            setSelectedIndex(index);
                                        }}
                                        className={`item-List cursor-pointer ${index === selectedIndex ? "highlighted-row" : ""}`}
                                        style={{ borderBottom: index !== ItemSaleList.sales_item.length - 1 ? '1px solid #e0e0e0' : 'none', }}>
                                        <td style={{ display: "flex", gap: "5px", textAlign: "left", verticalAlign: "left" }}>
                                            <div>
                                                <Checkbox
                                                    sx={{
                                                        color: "var(--color2)",
                                                        '&.Mui-checked': { color: "var(--color1)" },
                                                        margin: 0,
                                                        padding: 0
                                                    }}
                                                    checked={item?.iss_check}
                                                    onClick={(event) => event.stopPropagation()}
                                                    onChange={(event) => handleChecked(item.id, event.target.checked)}
                                                />
                                                <BorderColorIcon
                                                    style={{ color: "var(--color1)" }}
                                                    className="cursor-pointer" />
                                            </div>
                                            <span style={{ alignSelf: "center" }}>
                                                {item.iteam_name || "-----"}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: "center", verticalAlign: "middle" }}>{item.unit}</td>
                                        <td style={{ textAlign: "center", verticalAlign: "middle" }}>{item.batch}</td>
                                        <td style={{ textAlign: "center", verticalAlign: "middle" }}>{item.exp}</td>
                                        <td style={{ textAlign: "center", verticalAlign: "middle" }}>{item.mrp}</td>
                                        <td style={{ textAlign: "center", verticalAlign: "middle" }}>{item.base}</td>
                                        <td style={{ textAlign: "center", verticalAlign: "middle" }}>{item.gst}</td>
                                        <td style={{ textAlign: "center", verticalAlign: "middle" }}>{item.qty}</td>
                                        <td style={{ textAlign: "center", verticalAlign: "middle" }}>{item.location}</td>
                                        <td className="total" style={{ fontWeight: "bold", textAlign: "center", verticalAlign: "middle" }}>{item.net_rate}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/*<============================================== total and other details  =============================================> */}

                <div className="sale_filtr_add"
                    style={{
                        background: "var(--color1)",
                        color: "white",
                        display: "flex",
                        justifyContent: "space-between",
                        position: "fixed",
                        width: "100%",
                        bottom: "0",
                        overflow: "auto",
                        left: "0",
                    }}>
                    <div className="" style={{
                        display: "flex",
                        gap: "40px",
                        whiteSpace: "nowrap",
                        left: "0",
                        padding: "20px",
                    }}>
                        <div className="gap-2 invoice_total_fld" style={{ display: 'flex' }}>
                            <label className="font-bold">Total GST : </label>

                            <span style={{ fontWeight: 600 }}>{totalGst || 0}</span>
                        </div>
                        <div className="gap-2 invoice_total_fld" style={{ display: 'flex' }}>
                            <label className="font-bold">Total Base : </label>
                            <span style={{ fontWeight: 600 }}>{totalBase}</span>
                        </div>
                        <div className="gap-2 invoice_total_fld" style={{ display: 'flex' }}>
                            <label className="font-bold">Profit : </label>
                            <span style={{ fontWeight: 600 }}>&#8377; {marginNetProfit} ({Number(totalMargin).toFixed(2)} %) </span>
                        </div>
                        <div className="gap-2 invoice_total_fld" style={{ display: 'flex' }}>
                            <label className="font-bold">Total Net Rate : </label>
                            <span style={{ fontWeight: 600 }}>&#8377; {totalNetRate} </span>
                        </div>
                    </div>

                    <div style={{ padding: '0 20px', whiteSpace: 'noWrap' }}>
                        <div className="gap-2" onClick={toggleModal} style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                            <label className="font-bold">Net Amount : </label>
                            <span className="gap-1" style={{ fontWeight: 800, fontSize: "22px", whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }}>{!netAmount ? 0 : netAmount}
                                <FaCaretUp />
                            </span>
                        </div>

                        <Modal
                            show={isModalOpen}
                            onClose={toggleModal}
                            size="lg"
                            position="bottom-center"
                            className="modal_amount"
                        // style={{ width: "50%" }}
                        >
                            <div style={{ backgroundColor: 'var(--COLOR_UI_PHARMACY)', color: 'white', padding: '20px', fontSize: 'larger', display: "flex", justifyContent: "space-between" }}>
                                <h2 style={{ textTransform: "uppercase" }}>invoice total</h2>
                                <IoMdClose onClick={toggleModal} cursor={"pointer"} size={30} />

                            </div>
                            <div
                                style={{
                                    background: "white",
                                    padding: "20px",
                                    width: "100%",
                                    maxWidth: "600px",
                                    margin: "0 auto",
                                    lineHeight: "2.5rem"
                                }}
                            >

                                <div className="" style={{ display: 'flex', justifyContent: "space-between" }}>
                                    <label className="font-bold">Total Amount : </label>
                                    <span style={{ fontWeight: 600 }}>{totalAmount}</span>
                                </div>

                                <div className="" style={{ display: 'flex', justifyContent: "space-between", paddingBottom: '5px' }}>
                                    <label className="font-bold">Other Amount : </label>
                                    <Input
                                        value={otherAmt}
                                        onKeyDown={(e) => {
                                            const value = e.target.value;
                                            const isMinusKey = e.key === '-';

                                            // Allow Backspace and numeric keys
                                            if (!/[0-9.-]/.test(e.key) && e.key !== 'Backspace') {
                                                e.preventDefault();
                                            }

                                            // Allow only one '-' at the beginning of the input value
                                            if (isMinusKey && value.includes('-')) {
                                                e.preventDefault();
                                            }
                                        }}
                                        onChange={(e) => {
                                            setUnsavedItems(true);
                                            const x = e.target.value
                                            const y = (x)

                                            if (-y >= totalAmount) {
                                                setOtherAmt((-totalAmount))
                                            } else {
                                                setOtherAmt(y)
                                            }
                                        }}
                                        size="small"
                                        style={{
                                            width: "70px",
                                            background: "none",
                                            // borderBottom: "1px solid gray",
                                            justifyItems: "end",
                                            outline: "none",

                                        }} sx={{
                                            '& .MuiInputBase-root': {
                                                height: '35px',
                                            },
                                            "& .MuiInputBase-input": { textAlign: "end" }

                                        }} />
                                </div>

                                <div className="" style={{ display: 'flex', justifyContent: "space-between", paddingBottom: '5px', borderTop: '1px solid var(--toastify-spinner-color-empty-area)', paddingTop: '5px' }}>
                                    <label className="font-bold">Round Off : </label>
                                    <span >{!roundOff ? 0 : roundOff.toFixed(2)}</span>
                                </div>

                                <div className="" style={{ display: "flex", alignItems: "center", cursor: "pointer", justifyContent: "space-between", borderTop: '2px solid var(--COLOR_UI_PHARMACY)', paddingTop: '5px' }}>
                                    <label className="font-bold">Net Amount: </label>
                                    <span style={{ fontWeight: 800, fontSize: "22px", color: "var(--COLOR_UI_PHARMACY)" }}>{netAmount}</span>
                                </div>
                            </div>
                        </Modal>
                    </div>
                </div>

                {/*<============================================== Delete PopUP  =============================================> */}

                <div id="modal" value={IsDelete}
                    className={`fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif] ${IsDelete ? "block" : "hidden"
                        }`}>
                    <div />
                    <div className="w-full max-w-md bg-white shadow-lg rounded-md p-4 relative">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6 cursor-pointer absolute top-4 right-4 fill-current text-gray-600 hover:text-red-500 "
                            viewBox="0 0 24 24" onClick={() => setIsDelete(false)}>
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
                                onClick={() => handleDeleteItem(saleItemId)}>Delete</button>
                            <button type="button"
                                className="px-6 py-2.5 w-44 rounded-md text-black text-sm font-semibold border-none outline-none bg-gray-200 hover:bg-gray-900 hover:text-white"
                                onClick={() => setIsDelete(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
                <Prompt
                    when={unsavedItems}
                    message={(location) => {
                        handleNavigation(location.pathname);
                        return false;
                    }}
                />
                <div
                    id="modal"
                    value={openModal}
                    className={`fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif] ${openModal ? "block" : "hidden"}`}
                >
                    <div />
                    <div className="w-full max-w-md bg-white shadow-lg rounded-md p-4 relative">
                        <div className="my-4 logout-icon">
                            <VscDebugStepBack className=" h-12 w-14" style={{ color: "#628A2F" }} />
                            <h4 className="text-lg font-semibold mt-6 text-center" style={{ textTransform: "none" }}>Are you sure you want to leave this page ?</h4>
                        </div>
                        <div className="flex gap-5 justify-center">
                            <button
                                type="submit"
                                className="px-6 py-2.5 w-44 items-center rounded-md text-white text-sm font-semibold border-none outline-none primary-bg hover:primary-bg active:primary-bg"
                                onClick={handleLeavePage}
                            >
                                Yes
                            </button>
                            <button
                                type="button"
                                className="px-6 py-2.5 w-44 rounded-md text-black text-sm font-semibold border-none outline-none bg-gray-200 hover:bg-gray-400 hover:text-black"
                                onClick={() => setOpenModal(false)}

                            >

                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
export default Salereturn