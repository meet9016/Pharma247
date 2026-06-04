import React, { useState, useRef, useEffect } from "react";

import { TextField, Autocomplete } from "@mui/material";

import axios from "axios";

import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Header from "../../../Header";
import { toast, ToastContainer } from "react-toastify";
import ReplyAllIcon from "@mui/icons-material/ReplyAll";

const AddDistributer = () => {
  // const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();
  const [error, setError] = useState(null);

  const [GSTNumber, setGSTNumber] = useState("");
  const [distributorName, setDistributorName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileno, setMobileno] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [state, setState] = useState("");
  const [address, setAddress] = useState("");
  const [area, setArea] = useState("");
  const [pincode, setPincode] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [foodLicence, setFoodLicence] = useState("");
  const [durgLicence, setDurgLicence] = useState("");
  const [dueDays, setDueDays] = useState("15");
  const [distributorList, setDistributorList] = useState([]);
  const [distributorId, setDistributorId] = useState("");

  // const [isEditMode, setIsEditMode] = useState('');
  /*<================================================================================ Input ref on keydown enter  =======================================================================> */

  const inputRefs = useRef([]);

  const handleKeyDown = (event, index) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission

      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus(); // Move to next input
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleSubmit();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  /*<================================================================================ Search distributor  =======================================================================> */


  const listDistributor = (searchPayload = {}) => {
    const token = localStorage.getItem("token");

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    if (Object.keys(searchPayload).length > 0) {
      axios
        .post("list-distributer", searchPayload, { headers })
        .then((response) => {
          const list = response.data.data?.distributor || response.data.data || [];
          setDistributorList(list);
        })
        .catch((error) => {
          console.error("Search failed", error);
             if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
        });
    } else {
      axios
        .post("list-distributer", {}, { headers })
        .then((response) => {
          const list = response.data.data?.distributor || response.data.data || [];
          localStorage.setItem("distributor", JSON.stringify(list));
          setDistributorList(list);
        })
        .catch((error) => {
          console.error("Fetch failed", error);
             if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
        });
    }
  };
  /*<================================================================================ form submit  =======================================================================> */

  const handleSubmit = () => {
    const newErrors = {};
    if (!distributorName) {
      newErrors.distributorName = "Distributor is required";
      toast.dismiss();
      toast.error("Distributor is required");
    }
    if (!GSTNumber) {
      newErrors.GSTNumber = "GST Number is required";
      toast.dismiss();
      toast.error("GST Number is required");
    }

    if (!mobileno) {
      newErrors.mobileno = "Mobile No is required";
      toast.dismiss();
      toast.error("Mobile No is required");
    } else if (!/^\d{10}$/.test(mobileno)) {
      newErrors.mobileno = "Mobile number must be 10 digits";
      toast.dismiss();
      toast.error("Mobile number must be 10 digits");
    }

    setError(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    if (isValid) {
      AddDistributor();
    }
  };

  const AddDistributor = async () => {
    const token = localStorage.getItem("token");
    const data = new FormData();
    data.append("gst_number", GSTNumber);
    // data.append("distributor_name", distributorName);
    data.append("email", email);
    data.append("mobile_no", mobileno);
    data.append("whatsapp", whatsapp);
    data.append("state", state);
    data.append("address", address);
    data.append("area", area);
    data.append("pincode", pincode);
    data.append("bank_name", bankName);
    data.append("account_no", accountNo);
    data.append("ifsc_code", ifsc);
    data.append("food_licence_no", foodLicence);
    data.append("distributor_durg_distributor", durgLicence);
    data.append("payment_due_days", dueDays);
    if (distributorId) {
      data.append("distributor_id", distributorId);
      data.append("distributor_name", "");
    } else {
      data.append("distributor_id", "");
      data.append("distributor_name", distributorName);
    }


    
    try {
      await axios
        .post("create-distributer", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          toast.dismiss();
          toast.success(response.data.message);

           setGSTNumber("");
           setDistributorName("");
           setDistributorId("");
           setEmail("");
           setMobileno("");
           setWhatsapp("");
           setState("");
           setAddress("");
           setArea("");
           setPincode("");
           setBankName("");
           setAccountNo("");
           setIfsc("");
           setFoodLicence("");
           setDurgLicence("");
           setDueDays("");
           setTimeout(() => {
             history.push("/DistributorList");
           }, 1000);
         });
    } catch (error) {
      if (error.response.data.status == 400) {
        toast.dismiss();
        toast.error(error.response.data.message);
      }
         if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
    }
  };

  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  const mobileRegex = /^[6-9][0-9]{9}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  const accountRegex = /^[0-9]{9,18}$/;

  /*<================================================================================ UI  =======================================================================> */

  return (
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
      <div>
        <div>
          <div className=" rounded-md shadow-md paddin12-8 md:p-12 lg:px-16 h-full">
            <div className="flex justify-between add_dist_pg px-4 py-3 ">
              <h1 className="text-2xl font-bold primary add_dst_hdr_txt">
                Add New Distributor
              </h1>
              <h1
                className="text-xl font-bold primary cursor-pointer add_dist_dst_lst"
                onClick={() => history.push("/DistributorList")}
              >
                <ReplyAllIcon className="mb-2 mr-2" />
                Distributor List
              </h1>
            </div>
            <div className="px-4 mb-4">
              <div
                className="row border-b border-dashed "
                style={{ borderColor: "var(--color2)" }}
              ></div>
            </div>
            <div className="px-4">
              <div className="grid grid-cols-1 gap-3 mb-6 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2">
                <div>
                  <label
                    className="block  text-gray-700 font-bold mb-2"
                    htmlFor="gst_number"
                  >
                    Distributor GST/IN Number<span className="text-red-600">*</span>
                  </label>

                  <div className="flex w-full">
                    <TextField
                      variant="outlined"
                      autoComplete="off"
                      sx={{
                        ".MuiInputBase-input": {
                          padding: "10px 12px",
                        },
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "4px 0 0 4px",
                        },
                      }}
                      className="appearance-none border rounded-l-lg flex-1 leading-tight focus:outline-none focus:shadow-outline uppercase"
                      name="gst_number"
                      type="text"
                      autoFocus
                      value={GSTNumber}
                      placeholder="Distributor GST/IN Number"
                      inputRef={(el) => (inputRefs.current[0] = el)}
                      onKeyDown={(e) => handleKeyDown(e, 0)}
                      onChange={(e) => {
                        const raw = e.target.value
                          .toUpperCase()
                          .replace(/[^A-Z0-9]/g, "")
                          .slice(0, 15); // max 15 characters

                        setGSTNumber(raw);
                      }}
                      error={GSTNumber.length > 0 && !gstRegex.test(GSTNumber)}
                      helperText={
                        GSTNumber.length > 0 && !gstRegex.test(GSTNumber)
                          ? "Invalid GST Number"
                          : ""
                      }
                    />

                    <div
                      className="cursor-pointer h-full p-[11px] text-sm font-medium text-white hover:secondary-bg focus:ring-4 primary-bg flex items-center justify-center"
                      style={{ borderRadius: "0px 4px 4px 0px", minWidth: "80px" }}
                    >
                      <span>Change</span>
                      <span className="sr-only">Search</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label
                    className="block text-gray-700 font-bold mb-2"
                    htmlFor="distributor_name"
                  >
                    Distributor Name <span className="text-red-600">*</span>
                  </label>
                  <Autocomplete
                    freeSolo
                    options={distributorList.map(
                      (option) => option.distributor_name || option.name || ""
                    )}
                    inputValue={distributorName}
                    onInputChange={(event, newInputValue) => {
                      // Allow only alphabets and spaces
                      const filteredValue = newInputValue.replace(/[^A-Z\s]/gi, "").toUpperCase();
                      setDistributorName(filteredValue);
                      const found = distributorList.find(
                        (option) => (option.distributor_name || option.name || "").toUpperCase() === filteredValue.toUpperCase()
                      );
                      if (found) {
                        setDistributorId(found.id);
                      } else {
                        setDistributorId("");
                      }
                      listDistributor({ search: filteredValue }); // call API with search
                    }}
                    onChange={(event, selectedValue) => {
                      const found = distributorList.find(
                        (option) => (option.distributor_name || option.name || "").toUpperCase() === (selectedValue || "").toUpperCase()
                      );
                      if (found) {
                        setDistributorName(found.distributor_name || found.name || "");
                        setGSTNumber(found.gst || "");
                        setMobileno(found.phone_number || "");
                        setAddress(found.address || "");
                        setArea(found.area || "");
                        setPincode(found.pincode || "");
                        setState(found.state || "");
                        setDistributorId(found.id);
                      } else {
                        setDistributorId("");
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        autoComplete="off"
                        placeholder="Distributor Name"
                        inputRef={(el) => (inputRefs.current[1] = el)}
                        onKeyDown={(e) => handleKeyDown(e, 1)}
                        sx={{
                          ".MuiInputBase-input": {
                            padding: "10px 12px",
                            height: "10px",
                          },
                        }}
                        className="appearance-none border rounded-lg w-full leading-tight focus:outline-none focus:shadow-outline uppercase"
                      // label="Distributor Name *"
                      />
                    )}
                  />


                </div>
                <div>
                  <label
                    className="block text-gray-700 font-bold mb-2"
                    htmlFor="mobile_no"
                  >
                    Mobile No. <span className="text-red-600">*</span>
                  </label>
                  <TextField
                    variant="outlined"
                    autoComplete="off"
                    sx={{
                      ".MuiInputBase-input": {
                        padding: "10px 12px",
                      },
                    }}
                    inputRef={(el) => (inputRefs.current[2] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 2)}
                    className="appearance-none border rounded-lg w-full leading-tight focus:outline-none focus:shadow-outline"
                    name="mobile_no"
                    type="text" // change to text to avoid issues with leading 0
                    value={mobileno}
                    placeholder="Mobile Number"
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 10); // only digits, max 10
                      setMobileno(value);
                    }}
                    error={mobileno.length > 0 && !mobileRegex.test(mobileno)}
                    helperText={
                      mobileno.length > 0 && !mobileRegex.test(mobileno)
                        ? "Enter a valid 10-digit mobile number starting with 6-9"
                        : ""
                    }
                  />
                </div>
                <div>
                  <label
                    className="block text-gray-700 font-bold mb-2"
                    htmlFor="email"
                  >
                    Email ID
                  </label>
                  <TextField
                    variant="outlined"
                    autoComplete="off"
                    sx={{
                      ".MuiInputBase-input": {
                        padding: "10px 12px",
                      },
                    }}
                    inputRef={(el) => (inputRefs.current[3] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 3)}
                    className="appearance-none border rounded-lg lowercase w-full leading-tight focus:outline-none focus:shadow-outline"
                    name="email"
                    type="text" // use text to handle validation manually
                    value={email}
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    error={email.length > 0 && !emailRegex.test(email)}
                    helperText={
                      email.length > 0 && !emailRegex.test(email)
                        ? "Enter a valid email address"
                        : ""
                    }
                  />
                </div>
                <div>
                  <label
                    className="block text-gray-700 font-bold mb-2"
                    htmlFor="whatsapp"
                  >
                    Whatsapp No.
                  </label>
                  <TextField
                    variant="outlined"
                    autoComplete="off"
                    sx={{
                      ".MuiInputBase-input": {
                        padding: "10px 12px",
                      },
                    }}
                    className="appearance-none border rounded-lg w-full leading-tight focus:outline-none focus:shadow-outline"
                    name="whatsapp"
                    type="text" // use text to handle leading 0 safely
                    value={whatsapp}
                    placeholder="Whatsapp Number"
                    inputRef={(el) => (inputRefs.current[4] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 4)}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 10); // only digits, max 10
                      setWhatsapp(value);
                    }}
                    error={whatsapp.length > 0 && !mobileRegex.test(whatsapp)}
                    helperText={
                      whatsapp.length > 0 && !mobileRegex.test(whatsapp)
                        ? "Enter a valid 10-digit number starting with 6-9"
                        : ""
                    }
                  />
                </div>
                <div>
                  <label
                    className="block text-gray-700 font-bold mb-2"
                    htmlFor="state"
                  >
                    state
                  </label>
                  <TextField
                    variant="outlined"
                    autoComplete="off"
                    sx={{
                      ".MuiInputBase-input": {
                        padding: "10px 12px",
                      },
                    }}
                    className="appearance-none border rounded-lg w-full  leading-tight focus:outline-none focus:shadow-outline"
                    name="state"
                    type="text"
                    value={state}
                    placeholder="State"
                    inputRef={(el) => (inputRefs.current[5] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 5)}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^a-zA-Z]/g, "");
                      const formattedValue =
                        value.charAt(0).toUpperCase() +
                        value.slice(1).toLowerCase();
                      setState(formattedValue);
                    }}
                  />
                </div>
                <div>
                  <label
                    className="block text-gray-700 font-bold mb-2"
                    htmlFor="address"
                  >
                    Address
                  </label>
                  <TextField
                    variant="outlined"
                    autoComplete="off"
                    sx={{
                      ".MuiInputBase-input": {
                        padding: "10px 12px",
                      },
                    }}
                    className="appearance-none border rounded-lg w-full  leading-tight focus:outline-none focus:shadow-outline"
                    name="address"
                    type="text"
                    value={address}
                    placeholder="Address"
                    inputRef={(el) => (inputRefs.current[6] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 6)}
                    onChange={(e) => {
                      const value = e.target.value;
                      const formattedValue =
                        value.charAt(0).toUpperCase() +
                        value.slice(1).toLowerCase();
                      setAddress(formattedValue);
                    }}
                  />
                </div>
                <div>
                  <label
                    className="block text-gray-700 font-bold mb-2"
                    htmlFor="area"
                  >
                    Area
                  </label>
                  <TextField
                    variant="outlined"
                    autoComplete="off"
                    sx={{
                      ".MuiInputBase-input": {
                        padding: "10px 12px",
                      },
                    }}
                    inputRef={(el) => (inputRefs.current[7] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 7)}
                    className="appearance-none border rounded-lg w-full  leading-tight focus:outline-none focus:shadow-outline"
                    name="area"
                    type="text"
                    value={area}
                    placeholder="Area"
                    onChange={(e) => {
                      const value = e.target.value;
                      const formattedValue =
                        value.charAt(0).toUpperCase() +
                        value.slice(1).toLowerCase();
                      setArea(formattedValue);
                    }}
                  />
                </div>
                <div>
                  <label
                    className="block text-gray-700 font-bold mb-2"
                    htmlFor="pincode"
                  >
                    Pincode
                  </label>
                  <TextField
                    variant="outlined"
                    inputRef={(el) => (inputRefs.current[8] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 8)}
                    autoComplete="off"
                    sx={{
                      ".MuiInputBase-input": {
                        padding: "10px 12px",
                      },
                    }}
                    className="appearance-none border rounded-lg w-full leading-tight focus:outline-none focus:shadow-outline"
                    name="pincode"
                    type="text" // use text to handle leading 0 safely
                    value={pincode}
                    placeholder="Pincode"
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 6); // only digits, max 6
                      setPincode(value);
                    }}
                    error={pincode.length > 0 && !pincodeRegex.test(pincode)}
                    helperText={
                      pincode.length > 0 && !pincodeRegex.test(pincode)
                        ? "Enter a valid 6-digit pincode"
                        : ""
                    }
                  />
                  <div name="pincode" />
                </div>
                <div>
                  <label
                    className="block text-gray-700 font-bold mb-2"
                    htmlFor="distributor_durg_distributor"
                  >
                    Distributor Drug License No.
                  </label>
                  <TextField
                    variant="outlined"
                    inputRef={(el) => (inputRefs.current[9] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 9)}
                    autoComplete="off"
                    sx={{
                      ".MuiInputBase-input": {
                        padding: "10px 12px",
                      },
                    }}
                    className="appearance-none border rounded-lg w-full leading-tight focus:outline-none focus:shadow-outline uppercase"
                    name="distributor_durg_distributor"
                    type="text"
                    value={durgLicence}
                    placeholder="Distributor Drug License Number"
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase();
                      setDurgLicence(value);
                    }}
                  />
                  <div name="distributor_durg_distributor" />
                </div>
                <div>
                  <label
                    className="block text-gray-700 font-bold mb-2"
                    htmlFor="food_licence_no"
                  >
                    Food Licence No.
                  </label>
                  <TextField
                    variant="outlined"
                    inputRef={(el) => (inputRefs.current[10] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 10)}
                    autoComplete="off"
                    sx={{
                      ".MuiInputBase-input": {
                        padding: "10px 12px",
                      },
                    }}
                    className="appearance-none border rounded-lg w-full leading-tight focus:outline-none focus:shadow-outline"
                    name="food_licence_no"
                    type="text"
                    value={foodLicence}
                    placeholder="Food Licence Number"
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase();
                      setFoodLicence(value);
                    }}
                  />
                  <div name="food_licence_no" />
                </div>
                <div>
                  <label
                    className="block text-gray-700 font-bold mb-2"
                    htmlFor="payment_due_days"
                  >
                    Credit Due Days
                  </label>
                  <TextField
                    variant="outlined"
                    autoComplete="off"
                    sx={{
                      ".MuiInputBase-input": {
                        padding: "10px 12px",
                      },
                    }}
                    inputRef={(el) => (inputRefs.current[11] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 11)}
                    className="appearance-none border rounded-lg w-full  leading-tight focus:outline-none focus:shadow-outline"
                    name="payment_due_days"
                    type="number"
                    value={dueDays}
                    placeholder="Credit Due Days"
                    onChange={(e) => setDueDays(e.target.value)}
                  />
                  <div name="payment_due_days" />
                </div>
              </div>
              {/* <div className="grid grid-cols-1 gap-3 mb-6 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2"></div> */}
              {/* <div className="grid grid-cols-1 gap-3 mb-6 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2"></div> */}
              {/* <div className="grid grid-cols-1 gap-3 mb-6 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2"></div> */}
              <div
                className="border-b border-dashed mt-8"
                style={{ borderColor: "var(--color1)" }}
              ></div>
              <div>
                <h1 className="text-2xl font-bold primary py-3">
                  Add Bank Details
                </h1>
                <div className=" mb-4">
                  <div
                    className="row border-b border-dashed "
                    style={{ borderColor: "var(--color2)" }}
                  ></div>
                </div>
                <div>
                  <div className="grid grid-cols-1 gap-3 mb-6 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2">
                    <div>
                      <label
                        className="block text-gray-700 font-bold mb-2"
                        htmlFor="bank_name"
                      >
                        Bank Name
                      </label>

                      <div className="relative w-full">
                        <TextField
                          variant="outlined"
                          inputRef={(el) => (inputRefs.current[12] = el)}
                          onKeyDown={(e) => handleKeyDown(e, 12)}
                          autoComplete="off"
                          sx={{
                            ".MuiInputBase-input": {
                              padding: "10px 12px",
                            },
                          }}
                          className="appearance-none border rounded-lg w-full leading-tight focus:outline-none focus:shadow-outline"
                          name="bank_name"
                          type="text"
                          value={bankName}
                          placeholder="Bank Name"
                          onChange={(e) => {
                            const uppercasedValue = e.target.value
                              .toUpperCase()
                              .replace(/[^A-Z]/g, "");
                            setBankName(uppercasedValue);
                          }}
                        />

                        <div
                          className="absolute top-0 end-0 h-full p-3.5  px-4 text-sm font-medium text-white hover:secondary-bg focus:ring-4 primary-bg  cursor-pointer"
                          style={{ borderRadius: "0px 4px 4px 0px" }}
                        >
                          <svg
                            className="w-4 h-4"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 20"
                          >
                            <path
                              stroke="currentColor"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                            />
                          </svg>
                        </div>
                      </div>
                      <div name="bank_name" />
                    </div>
                    <div>
                      <label
                        className="block text-gray-700 font-bold mb-2"
                        htmlFor="account_no"
                      >
                        Account No.
                      </label>
                      <TextField
                        variant="outlined"
                        inputRef={(el) => (inputRefs.current[13] = el)}
                        onKeyDown={(e) => handleKeyDown(e, 13)}
                        autoComplete="off"
                        sx={{
                          ".MuiInputBase-input": {
                            padding: "10px 12px",
                          },
                        }}
                        className="appearance-none border rounded-lg w-full leading-tight focus:outline-none focus:shadow-outline"
                        name="account_no"
                        type="text" // use text to handle long numbers safely
                        value={accountNo}
                        placeholder="Account Number"
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, ""); // only digits
                          setAccountNo(value);
                        }}
                        error={accountNo.length > 0 && !accountRegex.test(accountNo)}
                        helperText={
                          accountNo.length > 0 && !accountRegex.test(accountNo)
                            ? "Enter a valid bank account number (9-18 digits)"
                            : ""
                        }
                      />
                      <div name="account_no" />
                    </div>
                    <div>
                      <label
                        className="block text-gray-700 font-bold mb-2"
                        htmlFor="ifsc_code"
                      >
                        IFSC Code
                      </label>
                      <TextField
                        variant="outlined"
                        inputRef={(el) => (inputRefs.current[14] = el)}
                        onKeyDown={(e) => handleKeyDown(e, 14)}
                        autoComplete="off"
                        sx={{
                          ".MuiInputBase-input": {
                            padding: "10px 12px",
                          },
                        }}
                        className="appearance-none border rounded-lg w-full leading-tight focus:outline-none focus:shadow-outline uppercase"
                        name="ifsc_code"
                        type="text"
                        value={ifsc}
                        placeholder="IFSC Code"
                        onChange={(e) => {
                          const value = e.target.value
                            .toUpperCase()
                            .replace(/[^A-Z0-9]/g, "")
                            .slice(0, 11); // max 11 characters
                          setIfsc(value);
                        }}
                        error={ifsc.length > 0 && !ifscRegex.test(ifsc)}
                        helperText={
                          ifsc.length > 0 && !ifscRegex.test(ifsc)
                            ? "Enter a valid 11-character IFSC code"
                            : ""
                        }
                      />
                      <div name="ifsc_code" />
                    </div>
                  </div>
                  <div className="text-end my-8">
                    <button
                      type="submit"
                      className="py-2 min-w-16 px-5 h-10 text-white rounded-md primary-bg ml-2"
                      onClick={handleSubmit}
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      className="py-2 min-w-16 px-5 h-10 text-white rounded-md bg-red-600 ml-2"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDistributer;
