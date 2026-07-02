import "./LoginSignup.css";
import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TextField } from "@mui/material";
import axios from "axios";
import {

  IconButton,
  InputAdornment,

} from "@mui/material";
import loginlogo from '../../assets/loginlogo.png';
import { encryptData } from "../cryptoUtils";

const LoginSignup = () => {
  // const loginlogo = process.env.PUBLIC_URL + "/loginlogo.PNG";

  const history = useHistory();
  const location = useLocation();
  const [showOTP, setShowOTP] = useState(false);
  const [active, setActive] = useState(false);
  const [step, setStep] = useState("login");
  const { referralCode } = useParams();
  const [userID, setUserID] = useState();
  const [errors, setErrors] = useState({});
  const [showPasswordIcon, setShowPasswordIcon] = useState(false);
  const [timer, setTimer] = useState(30);
  const [resendEnabled, setResendEnabled] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimeout, setResendTimeout] = useState(null);
  const [countdown, setCountdown] = useState(0); // Countdown timer value

  const [registerData, setRegisterData] = useState({
    pharmacy_name: "",
    mobile_number: "",
    email: "",
    zip_code: "",
    referral_code: referralCode || "",
    type: 0,

  });
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");

  const inputRefs = useRef([]);
  const [role, setRole] = useState("");

  const NewUser = location.state?.NewUser; // Access the passed state


  // const handleClickPassword = () => setShowPasswordIcon((show) => !show);
  {/*<======================================================================= navigate based on user role   ==============================================================> */ }

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role == "Owner") {
      history.push("/adminDashboard");
    } else if (role == "Staff") {
      history.push("/reconciliation");
    }
  }, []);
  {/*<========================================================================== get referral code  =================================================================> */ }
  useEffect(() => {
    const previousId = document.body.id;
    document.body.id = "login-body";

    return () => {
      document.body.id = previousId || ""; // restore previous or clear it
    };
  }, []);

  {/*<========================================================================== get referral code  =================================================================> */ }

  useEffect(() => {
    if (referralCode) {
      setRegisterData((prev) => ({ ...prev, referral_code: referralCode }));
    }
  }, [referralCode]);

  useEffect(() => {
    setErrors({});
    if (!active) {
      setRegisterData({
        pharmacy_name: "",
        mobile_number: "",
        email: "",
        zip_code: "",
        referral_code: referralCode || "",
        type: 0,
      });
      setOtp("");
      setPassword("");
      setShowOTP(false);
    } else {
      setMobile("");
      setEmail("");
      if (step === "register") {
        setOtp("");
        setPassword("");
      }
    }
    // toast.dismiss();
  }, [step, active, referralCode]);
  {/*<=========================================================================== resend  code  ====================================================================> */ }

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else {
      setResendEnabled(true);
    }
  }, [timer]);

  useEffect(() => {
    if (resendTimeout !== null) {
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown === 1) {
            clearInterval(resendTimeout);
            setResendTimeout(null);
            setResendDisabled(false);
          }
          return prevCountdown - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [resendTimeout]);

  {/*<=============================================================================== handle enter  ======================================================================> */ }

  const handleKeyDown = (event, index) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission

      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus(); // Move to next input
      }
    }
  };
  {/*<=========================================================================== update register data  =================================================================> */ }

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setRegisterData({ ...registerData, [e.target.id]: e.target.value });
    setErrors((prev) => ({
      ...prev,
      [id]: "",
    }));
  };

  {/*<=============================================================================== verify OTP =====================================================================> */ }

  const handleValidation = async (e) => {
    e.preventDefault(); // 
    const newErrors = {};


    // Regex
    const pharmacyRegex = /^[A-Za-z0-9\s.&()-]{3,100}$/;
    const mobileRegex = /^[6-9]\d{9}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
    const zipRegex = /^[0-9]{6}$/;
    const referralRegex = /^[A-Za-z0-9_-]{3,50}$/;



    // Pharmacy Name
    if (!registerData.pharmacy_name.trim()) {
      newErrors.pharmacy_name = "Pharmacy Name is required";
    } else if (!pharmacyRegex.test(registerData.pharmacy_name.trim())) {
      newErrors.pharmacy_name =
        "Enter a valid Pharmacy Name";
    }

    // Mobile Number
    if (!registerData.mobile_number) {
      newErrors.mobile_number = "Mobile Number is required";
    } else if (!mobileRegex.test(registerData.mobile_number)) {
      newErrors.mobile_number =
        "Enter a valid 10-digit Mobile Number";
    }

    // Email
    if (!registerData.email.trim()) {
      newErrors.email = "Email Address is required";
    } else if (!emailRegex.test(registerData.email.trim())) {
      newErrors.email = "Enter valid Email Address";
    }

    // ZIP Code
    if (!registerData.zip_code.trim()) {
      newErrors.zip_code = "ZIP Code is required";
    } else if (!zipRegex.test(registerData.zip_code.trim())) {
      newErrors.zip_code = "ZIP Code must be 6 digits";
    }




    // if (!registerData.referral_code.trim()) {
    //   newErrors.referral_code = "Referral Code is required";
    // } else if (!referralRegex.test(registerData.referral_code.trim())) {
    //   newErrors.referral_code =
    //     "Referral Code must be 3-20 characters";
    // }



    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    if (isValid) {
      submitRegisterData(e);
    }
    return;
  };


  {/*<========================================================================== submit Register data ====================================================================> */ }

  const submitRegisterData = async (e) => {
    e.preventDefault(); // ✅ Prevent page reload

    try {
      let data = new FormData();
      data.append("pharmacy_name", registerData.pharmacy_name);
      data.append("mobile_number", registerData.mobile_number);
      data.append("email", registerData.email);
      data.append("zip_code", registerData.zip_code);
      data.append("referral_code", registerData.referral_code);
      // data.append("coupon_code", registerData.referral_code);
      data.append("type", registerData.type);
      const response = await axios.post("resgiter", data);
      if (response.data.status === 200) {
        toast.success(response.data.message);
        setUserID(response.data.data.id);
        setStep("otp");
        setPassword("");

      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred. Please try again later.");
        console.error("API error:", error);
      }
    }
  };
  {/*<=============================================================================== register OTP validation ======================================================================> */ }
  // const validationOTP = () => {
  //   const newErrors = {};

  //   if (!otp) {
  //     newErrors.otp = "OTP is required";
  //     toast.dismiss();
  //     toast.error(newErrors.otp);
  //   }

  //   if (!password) {
  //     newErrors.password = "Password is required";
  //     toast.dismiss();
  //     toast.error(newErrors.password);
  //   } else if (password.length < 8) {
  //     newErrors.password = "Password must be at least 8 characters";
  //     toast.dismiss();
  //     toast.error(newErrors.password);
  //   } else if (!/[A-Z]/.test(password)) {
  //     newErrors.password =
  //       "Password must contain at least one uppercase letter";
  //     toast.dismiss();
  //     toast.error(newErrors.password);
  //   } else if (!/[a-z]/.test(password)) {
  //     newErrors.password =
  //       "Password must contain at least one lowercase letter";
  //     toast.dismiss();
  //     toast.error(newErrors.password);
  //   } else if (!/[0-9]/.test(password)) {
  //     newErrors.password = "Password must contain at least one digit";
  //     toast.dismiss();
  //     toast.error(newErrors.password);
  //   } else if (!/[!@#$%^&*]/.test(password)) {
  //     newErrors.password =
  //       "Password must contain at least one special character";
  //     toast.dismiss();
  //     toast.error(newErrors.password);
  //   }
  //   setErrors(newErrors);
  //   const isValid = Object.keys(newErrors).length === 0;
  //   if (isValid) {
  //     handleSubmitOtp();
  //   }
  //   return;
  // };
  const validationOTP = (e) => {
    if (e) e.preventDefault();

    const newErrors = {};

    if (!otp.trim()) {
      newErrors.otp = "OTP is required";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = "Password must contain at least one uppercase letter";
    } else if (!/[a-z]/.test(password)) {
      newErrors.password = "Password must contain at least one lowercase letter";
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = "Password must contain at least one digit";
    } else if (!/[!@#$%^&*]/.test(password)) {
      newErrors.password = "Password must contain at least one special character";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      handleSubmitOtp();
    }
  };


  {/*<========================================================================== submit OTP and password ===================================================================> */ }

  const handleSubmitOtp = async (e) => {
    const data = new FormData();
    data.append("type", 1);
    data.append("otp", otp);
    data.append("user_id", userID);
    data.append("password", password);

    try {
      const response = await axios.post("resgiter", data);

      if (response.data.status === 200 && response.data.message) {
        toast.success(response.data.message);
        localStorage.setItem("userId", userID);
        setPassword("");
        setOtp("")
        setActive(false);
        setStep("login");
        history.push("/", { NewUser: "NewUser" });
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
      console.error("API error:", error);
    }
  };

  {/*<=============================================================================== handle login ===================================================================> */ }



  const userPermission = async (token) => {
    let data = new FormData();
    try {
      await axios.post("user-permission", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          const permission = response.data.data;
          const encryptedPermission = encryptData(permission);
          localStorage.setItem("permissions", encryptedPermission);
        });
    } catch (error) {
      console.error("API error:", error?.response?.status);
      if (error?.response?.status === 401) {

      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const newErrors = {};

    //  Regex rules
    const mobileRegex = /^[0-9]{10}$/;
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$%^&*-]).{8,}$/;

    //  Mobile validation
    if (!mobile) {
      newErrors.mobile = "Mobile number is required";
    } else if (!mobileRegex.test(mobile)) {
      newErrors.mobile = "Mobile must be exactly 10 digits";
    }

    //  Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(password)) {
      newErrors.password =
        "Password must be 8+ chars with A-Z, a-z, 0-9 & special char";
    }

    setErrors(newErrors);

    const isValid = Object.keys(newErrors).length === 0;
    if (isValid) {
      const LoginData = new FormData();
      LoginData.append("mobile_number", mobile);
      LoginData.append("password", password);

      try {
        const response = await axios.post("login", LoginData);

        if (response.data.status === 200) {
          const { token, id, name, role, iss_audit, status, phone_number, email, } = response.data.data;
          localStorage.setItem("token", token);
          localStorage.setItem("contact", phone_number);
          localStorage.setItem("userId", id);
          localStorage.setItem("UserName", name);
          localStorage.setItem("role", role);
          localStorage.setItem("email", email);

          toast.success(response.data.message);

          await userPermission(token)

          setRole(role);

          if (role === "Owner") {
            if (NewUser) {
              setTimeout(() => {
                history.push("/adminDashboard");
              }, 3000);
            } else {
              setTimeout(() => {
                history.push("/adminDashboard");
              }, 3000);
            }
          } else if (
            role === "Staff" &&
            iss_audit === "true" &&
            status === false
          ) {
            if (NewUser) {
              setTimeout(() => {
                history.push("/adminDashboard");
              }, 3000);
            } else {
              setTimeout(() => {
                history.push("/reconciliation");
              }, 3000);
            }
          } else {
            history.push("/adminDashboard");
          }
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          toast.error(error.response.data.message);
        }
        console.error("API error:", error);
      }
    }


  };

  {/*<========================================================================= handle forget details ===================================================================> */ }


  const handleForgotDetails = async (event) => {
    event.preventDefault(); // Prevent form submission
    const newErrors = {};

    if (!mobile) {
      newErrors.mobile = "mobile No is required";
      toast.dismiss();
    } else if (!/^\d{10}$/.test(mobile)) {
      newErrors.mobile = "Mobile number must be 10 digits";
      toast.dismiss();
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    if (isValid) {
      const userData = new FormData();
      userData.append("mobile_number", mobile);
      userData.append("email", email);
      userData.append("type", 0);
      userData.append("userId", localStorage.getItem("useId"));
      try {
        const response = await axios.post("forget-password", userData);
        localStorage.setItem("userId", response.data.data.user_id);
        if (response.data.status === 200) {
          toast.success(response.data.message);
          setShowOTP(true);
          setTimer(30);
          setResendEnabled(false);
          setPassword("");
          setEmail("");
          // Mobile number remains filled and step remains "forget"
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          toast.error(error.response.data.message);
        }
        console.error("API error:", error);
      }
    }
  };

  {/*<========================================================================= handle OTP & password ===================================================================> */ }

  const handleUpdatePassword = async (event) => {
    event.preventDefault();
    const errors = {};
    if (!otp) errors.otp = "OTP is required";
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(password)) {
      errors.password = "Password must contain at least one uppercase letter";
    } else if (!/[a-z]/.test(password)) {
      errors.password = "Password must contain at least one lowercase letter";
    } else if (!/[0-9]/.test(password)) {
      errors.password = "Password must contain at least one digit";
    } else if (!/[!@#$%^&*]/.test(password)) {
      errors.password = "Password must contain at least one special character";
    }
    setErrors(errors);
    const isValid = Object.keys(errors).length === 0;
    if (isValid) {
      const userData = new FormData();
      userData.append("otp", otp);
      userData.append("password", password);
      userData.append("type", 1);
      userData.append("user_id", localStorage.getItem("userId"));

      try {
        const response = await axios.post("forget-password", userData);
        if (response.data.status === 200) {
          toast.success(response.data.message);
          setShowOTP(false);
          setPassword("");
          setOtp("");
          setStep("login");
          history.push("/");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          toast.error(error.response.data.message);
        }
        console.error("API error:", error);
      }
    }

  };

  {/*<=============================================================================== password rules ======================================================================> */ }
  // Password rules UI component
  const PasswordRules = ({ password }) => {
    if (!password || password.length === 0) return null; // show only after typing

    const rules = [
      { label: "At least 8 characters", test: (pwd) => pwd.length >= 8 },
      { label: "One uppercase letter", test: (pwd) => /[A-Z]/.test(pwd) },
      { label: "One lowercase letter", test: (pwd) => /[a-z]/.test(pwd) },
      { label: "One number", test: (pwd) => /[0-9]/.test(pwd) },
      { label: "One special character (!@#$%^&*)", test: (pwd) => /[!@#$%^&*]/.test(pwd) },
    ];

    return (
      <ul
        style={{
          marginTop: "6px",
          marginBottom: "0",
          paddingLeft: "0",
          fontSize: "13px",
          textAlign: "left", // left align
        }}
      >
        {rules.map((rule, i) => {
          const valid = rule.test(password);
          return (
            <li
              key={i}
              style={{
                color: valid ? "green" : "red",
                listStyle: "none",
                marginBottom: "2px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span>{valid ? "✔" : "✖"}</span>
              <span>{rule.label}</span>
            </li>
          );
        })}
      </ul>
    );
  };



  {/*<============================================================================== resend otp =====================================================================> */ }

  const handleResendOtp = () => {
    setTimer(30);
    setResendEnabled(false);
    handleOtpsend();
  };

  const handleOtpsend = async () => {
    const data = new FormData();
    data.append("mobile_number", mobile);
    try {
      const response = await axios.post("otp-resend", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.data.status == 200) {
        toast.success(response.data.message);   // ✅ THIS IS REQUIRED







        setOtpSent(true);
        setResendDisabled(true);
        setCountdown(60);
        setResendTimeout(setInterval(() => { }, 1000));
      } else {
        console.error("Failed to resend OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  return (
    <>
      {/*<============================================================================  ui  ===================================================================> */}

      <div id="#login-body" >
        <ToastContainer
          position="top-right"
          autoClose={8000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        <div className={`container ${active ? "active" : ""}`}>
          {/*<=============================================================================== register ui ======================================================================> */}

          <div className="form-box register" style={{ visibility: active ? "visible" : "hidden" }}>
            {step === "register" && (

              <form id="registerForm" onSubmit={(e) => handleValidation(e)} noValidate>
                {/* <h1>Welcome !</h1> */}
                <div className="input-box">
                  <TextField
                    size="small"
                    type="text"
                    id="pharmacy_name"
                    label={errors.pharmacy_name ? "" : "Pharmacy Name"}
                    placeholder="Pharmacy Name"
                    required
                    value={registerData.pharmacy_name}
                    inputRef={(el) => (inputRefs.current[0] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 0)}
                    onChange={handleInputChange}
                    autoFocus
                    error={!!errors.pharmacy_name}
                  />
                  {errors.pharmacy_name && (
                    <div
                      style={{
                        color: "red",
                        fontSize: "12px",
                        marginTop: "4px",

                        textAlign: "start"
                      }}
                    >
                      {errors.pharmacy_name}
                    </div>
                  )}
                  <i className='bx bxs-store'></i>
                </div>
                <div className="input-box">
                  <TextField
                    size="small"
                    type="tel"
                    id="mobile_number"
                    placeholder="Mobile Number"
                    label={errors.mobile_number ? "" : "Mobile Number"}
                    error={!!errors.mobile_number}
                    required
                    value={registerData.mobile_number}
                    inputRef={(el) => (inputRefs.current[1] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 1)}
                    onChange={(e) => {
                      const cleaned = e.target.value.replace(/\D/g, "");
                      if (cleaned.length <= 10) {
                        e.target.value = cleaned;
                        handleInputChange(e);
                      }
                    }}
                    inputProps={{
                      maxLength: 10,
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                    }}
                  />
                  {errors.mobile_number && (
                    <div
                      style={{
                        color: "red",
                        fontSize: "12px",
                        marginTop: "4px",

                        textAlign: "start"
                      }}
                    >
                      {errors.mobile_number}
                    </div>
                  )}
                  <i className='bx bxs-phone'></i>
                </div>
                <div className="input-box">
                  <TextField
                    size="small"
                    type="email"
                    id="email"
                    placeholder="Email"
                    label={errors.email ? "" : "Email"}
                    error={!!errors.email}
                    required
                    value={registerData.email}
                    inputRef={(el) => (inputRefs.current[2] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 2)}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\s/g, ""); // remove spaces
                      // Basic email format check
                      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || value === "";
                      e.target.value = value;
                      handleInputChange(e); // update always
                    }}
                    inputProps={{
                      inputMode: "email", // brings email keyboard on mobile
                    }}
                  />
                  {errors.email && (
                    <div
                      style={{
                        color: "red",
                        fontSize: "12px",
                        marginTop: "4px",

                        textAlign: "start"
                      }}
                    >
                      {errors.email}
                    </div>
                  )}
                  <i className='bx bxs-envelope'></i>
                </div>
                <div className="input-box">
                  <TextField
                    size="small"
                    type="text"
                    id="zip_code"
                    placeholder="ZIP Code"
                    label={errors.zip_code ? "" : "ZIP Code"}
                    error={!!errors.zip_code}
                    required
                    value={registerData.zip_code}
                    inputProps={{
                      maxLength: 6,
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                    }}
                    inputRef={(el) => (inputRefs.current[3] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 3)}
                    // onChange={handleInputChange}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");

                      if (value.length <= 6) {
                        setRegisterData((prev) => ({
                          ...prev,
                          zip_code: value,
                        }));

                        setErrors((prev) => ({
                          ...prev,
                          zip_code: "",
                        }));
                      }
                    }}
                  />
                  {errors.zip_code && (
                    <div
                      style={{
                        color: "red",
                        fontSize: "12px",
                        marginTop: "4px",

                        textAlign: "start"
                      }}
                    >
                      {errors.zip_code}
                    </div>
                  )}
                  <i className='bx bxs-map'></i>
                </div>
                <div className="input-box">
                  <TextField
                    size="small"
                    type="text"
                    id="referral_code"
                    label={errors.referral_code ? "" : "Referral Code"}
                    // error={!!errors.referral_code}
                    placeholder="Referral Code"
                    value={registerData.referral_code}
                    inputRef={(el) => (inputRefs.current[4] = el)}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 6 }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleValidation(e);
                    }} />
                  {errors.referral_code && (
                    <div
                      style={{
                        color: "red",
                        fontSize: "12px",
                        marginTop: "4px",

                        textAlign: "start"
                      }}
                    >
                      {errors.referral_code}
                    </div>
                  )}
                  <i className='bx bxs-gift'></i>
                </div>
                <button type="submit" className="btn">Register</button>
              </form>

            )}
            {/*<==================================================================================== OTP UI =======================================================================> */}

            {step === "otp" && (
              <form id="otpPasswordForm" onSubmit={validationOTP} noValidate>

                {/* <div
                  onClick={() => setStep("register")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    marginBottom: "10px",
                    justifyContent: "flex-start",
                    width: "100%"
                  }}
                >
                  <span style={{ fontSize: "14px", fontWeight: "500", color: "#333" }}>
                    ← Back
                  </span>
                </div> */}
                <div
                  onClick={() => setStep("register")}
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    width: "100%",
                    marginBottom: "10px",
                  }}
                >
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "6px 14px",
                      backgroundColor: "#f3f7e8",
                      color: "#3f6212",
                      borderRadius: "6px",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer",
                      border: "1px solid #d9e6b8",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#e9f2d2";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#f3f7e8";
                    }}
                  >
                    ← Back
                  </div>
                </div>

                <div className="input-box">
                  <TextField
                    type="text" id="otp"
                    placeholder="Enter OTP"
                    required
                    value={otp}
                    error={!!errors.otp}
                    inputRef={(el) => (inputRefs.current[5] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 5)}

                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (value.length <= 6) {
                        setOtp(value);

                        setErrors((prev) => ({
                          ...prev,
                          otp: "",
                        }));
                      }
                    }}
                  />

                  {errors.otp && (
                    <div
                      style={{
                        color: "red",
                        fontSize: "12px",
                        marginTop: "4px",
                        textAlign: "start",
                      }}
                    >
                      {errors.otp}
                    </div>
                  )}
                  <i className='bx bxs-lock'></i>
                </div>

                <div className="input-box">
                  <TextField
                    type={showPasswordIcon ? "text" : "password"}
                    id="password"
                    placeholder="Set Password"
                    required
                    error={!!errors.password}
                    fullWidth
                    value={password}
                    inputRef={(el) => (inputRefs.current[6] = el)}
                    // onChange={(e) => setPassword(e.target.value)}
                    onChange={(e) => {
                      setPassword(e.target.value);

                      setErrors((prev) => ({
                        ...prev,
                        password: "",
                      }));
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") validationOTP();
                    }}
                    InputProps={{
                      sx: {
                        backgroundColor: 'white',
                        borderRadius: '4px',
                      },
                      endAdornment: (
                        <InputAdornment position="end" sx={{ pr: '8px' }}>
                          <IconButton
                            onClick={() => setShowPasswordIcon((prev) => !prev)}
                            edge="end"
                            size="small"

                            style={{
                              position: "absolute",
                              right: "10px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              padding: 4,
                              zIndex: 2,
                            }}
                          >
                            {showPasswordIcon ? (
                              <VisibilityOff fontSize="small" />
                            ) : (
                              <Visibility fontSize="small" />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  {errors.password && (
                    <div
                      style={{
                        color: "red",
                        fontSize: "12px",
                        marginTop: "4px",
                        textAlign: "start",
                      }}
                    >
                      {errors.password}
                    </div>
                  )}

                  {/* <PasswordRules password={password} /> */}
                  <i className='bx bxs-key'></i>
                  <div className="forgot-link">
                    <p
                      style={{
                        color: resendEnabled ? "" : "gray",
                        fontWeight: 500,
                        cursor: "pointer",
                      }}
                      onClick={resendEnabled ? handleResendOtp : null}
                    >
                      {resendEnabled
                        ? "Resend OTP "
                        : `Re-send otp in ${timer}s`}
                    </p>
                  </div>
                </div>
                <button type="submit" className="btn">Submit</button>
              </form>
            )}


          </div>

          {/*<============================================================================ Logn UI & Forget UI ===================================================================> */}

          <div className="form-box login" style={{ visibility: active ? "hidden" : "visible" }}>

            {!active && step === "login" && (
              <form id="loginForm" onSubmit={(e) => handleLogin(e)} noValidate>
                <div className="input-box">
                  <TextField
                    type="tel"
                    id="login-mobile"
                    label={errors.mobile ? "" : "Mobile No"}
                    placeholder="Mobile No"
                    required
                    fullWidth
                    size="small"
                    variant="outlined"
                    value={mobile}
                    inputRef={(el) => (inputRefs.current[8] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 8)}
                    error={!!errors.mobile}
                    autoComplete="tel"
                    InputLabelProps={{
                      shrink: !!mobile,
                    }}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (value.length <= 10) {
                        setMobile(value);

                        setErrors((prev) => ({
                          ...prev,
                          mobile: "",
                        }));
                      }
                    }}
                    inputProps={{
                      maxLength: 10,
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                    }}
                    InputProps={{
                      sx: {
                        backgroundColor: "white",
                        borderRadius: "4px",
                      },
                    }}
                  />
                  {errors.mobile && (
                    <div style={{ color: "red", fontSize: "12px", marginTop: "4px", textAlign: "justify" }}>
                      {errors.mobile}
                    </div>
                  )}
                  <i className='bx bxs-user'></i>
                </div>

                <div className="input-box">
                  <TextField
                    type={showPasswordIcon ? "text" : "password"}
                    id="login-password"
                    placeholder="Password"
                    required
                    label={errors.password ? "" : "Password"}
                    error={!!errors.password}
                    fullWidth
                    size="small"
                    variant="outlined"
                    inputRef={(el) => (inputRefs.current[9] = el)}
                    autoComplete="current-password"
                    InputLabelProps={{
                      shrink: !!password,
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleLogin(e);
                    }}
                    onChange={(e) => {
                      setPassword(e.target.value);

                      setErrors((prev) => ({
                        ...prev,
                        password: "",
                      }));
                    }}
                    InputProps={{
                      sx: {
                        backgroundColor: 'white',
                        borderRadius: '4px',
                      },
                      endAdornment: (
                        <InputAdornment position="end" sx={{ pr: '8px' }}>
                          <IconButton
                            onClick={() => setShowPasswordIcon((prev) => !prev)}
                            edge="end"
                            size="small"

                            style={{
                              position: "absolute",
                              right: "10px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              padding: 4,
                              zIndex: 2,
                            }}
                          >
                            {showPasswordIcon ? (
                              <VisibilityOff fontSize="small" />
                            ) : (
                              <Visibility fontSize="small" />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  {errors.password && (
                    <div style={{ color: "red", fontSize: "12px", marginTop: "4px", textAlign: "justify", }}>
                      {errors.password}
                    </div>
                  )}
                  <i className='bx bxs-lock-alt'></i>
                </div>

                <div className="forgot-link " style={{ cursor: 'pointer' }}>
                  <p onClick={() => setStep('forget')}>Forgot Password?</p>

                </div>
                <button type="submit" className="btn">Login</button>
              </form>
            )}

            {/*<=========================================================================== Forget password ======================================================================> */}

            {!active && step === "forget" && (
              <form id="loginForm" onSubmit={(e) => {
                if (showOTP) {
                  handleUpdatePassword(e);
                } else {
                  handleForgotDetails(e);
                }
              }} noValidate >

                {/* <div
                  onClick={() => {
                    if (showOTP) {
                      setShowOTP(false);
                      setOtp("");
                      setPassword("");
                      setErrors({});
                    } else {
                      setStep("login");
                    }
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    marginBottom: "15px",
                    width: "100%",
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#333",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    ← Back
                  </span>
                </div> */}


                <div
                  onClick={() => {
                    if (showOTP) {
                      setShowOTP(false);
                      setOtp("");
                      setPassword("");
                      setErrors({});
                    } else {
                      setStep("login");
                    }
                  }}
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    width: "100%",
                    marginBottom: "15px",
                  }}
                >
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "6px 14px",
                      backgroundColor: "#f3f7e8",
                      color: "#3f6212",
                      borderRadius: "6px",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer",
                      border: "1px solid #d9e6b8",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#e9f2d2";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#f3f7e8";
                    }}
                  >
                    ← Back
                  </div>
                </div>



                <div className="input-box">
                  <TextField
                    type="number"
                    placeholder="Mobile No"
                    required
                    fullWidth
                    label={errors.mobile ? "" : "Mobile No"}
                    error={!!errors.mobile}
                    size="small"
                    variant="outlined"
                    inputRef={(el) => (inputRefs.current[8] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 8)}
                    value={mobile}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (showOTP) {
                          handleUpdatePassword(e);
                        } else {
                          handleForgotDetails(e);
                        }
                      }
                    }}
                    onChange={(e) => {
                      setMobile(e.target.value);
                      setShowOTP(false);
                      setOtp("");
                      setPassword("");

                      setErrors((prev) => ({
                        ...prev,
                        mobile: "",
                      }));
                    }}
                    InputLabelProps={{
                      shrink: !!mobile,
                    }}
                    InputProps={{
                      sx: {
                        backgroundColor: 'white',
                        borderRadius: '4px',
                      },
                    }}
                  />
                  {errors.mobile && (
                    <div style={{ color: "red", fontSize: "12px", marginTop: "4px", textAlign: "justify", }}>
                      {errors.mobile}
                    </div>
                  )}
                </div>

                {showOTP && (
                  <>
                    <div className="input-box" style={{ marginTop: "15px" }}>
                      <TextField
                        type="text"
                        id="otp"
                        placeholder="Enter OTP"
                        label={errors.otp ? "" : "Enter OTP"}
                        error={!!errors.otp}
                        required
                        value={otp}
                        inputRef={(el) => (inputRefs.current[5] = el)}
                        InputLabelProps={{
                          shrink: !!otp,
                          sx: {
                            top: "50%",
                            transform: "translate(14px, -50%) scale(1)",
                            "&.MuiInputLabel-shrink": {
                              top: 0,
                              transform: "translate(14px, -9px) scale(0.75)",
                            },
                          },
                        }}
                        onKeyDown={(e) => handleKeyDown(e, 5)}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          if (value.length <= 6) {
                            setOtp(value);
                            setErrors((prev) => ({
                              ...prev,
                              otp: "",
                            }));
                          }
                        }}
                      />
                      {errors.otp && (
                        <div
                          style={{
                            color: "red",
                            fontSize: "12px",
                            marginTop: "4px",
                            textAlign: "start",
                          }}
                        >
                          {errors.otp}
                        </div>
                      )}
                      <i className='bx bxs-lock' style={{ top: "30%" }}></i>
                    </div>

                    <div className="input-box" style={{ marginTop: "15px" }}>
                      <TextField
                        type={showPasswordIcon ? "text" : "password"}
                        id="password"
                        placeholder="Set Password"
                        label={errors.password ? "" : "Set Password"}
                        error={!!errors.password}
                        required
                        fullWidth
                        InputLabelProps={{
                          shrink: !!password,
                          sx: {
                            top: "50%",
                            transform: "translate(14px, -50%) scale(1)",
                            "&.MuiInputLabel-shrink": {
                              top: 0,
                              transform: "translate(14px, -9px) scale(0.75)",
                            },
                          },
                        }}
                        value={password}
                        inputRef={(el) => (inputRefs.current[6] = el)}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setErrors((prev) => ({
                            ...prev,
                            password: "",
                          }));
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") handleUpdatePassword(event);
                        }}
                        InputProps={{
                          sx: {
                            backgroundColor: 'white',
                            borderRadius: '4px',
                          },
                          endAdornment: (
                            <InputAdornment position="end" sx={{ pr: '8px' }}>
                              <IconButton
                                onClick={() => setShowPasswordIcon((prev) => !prev)}
                                edge="end"
                                size="small"
                                style={{
                                  position: "absolute",
                                  right: "10px",
                                  top: "50%",
                                  transform: "translateY(-50%)",
                                  padding: 4,
                                  zIndex: 2,
                                }}
                              >
                                {showPasswordIcon ? (
                                  <VisibilityOff fontSize="small" />
                                ) : (
                                  <Visibility fontSize="small" />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                      {errors.password && (
                        <div
                          style={{
                            color: "red",
                            fontSize: "12px",
                            marginTop: "4px",
                            textAlign: "start",
                          }}
                        >
                          {errors.password}
                        </div>
                      )}
                      <i className='bx bxs-key' style={{ top: "30%" }}></i>
                    </div>

                    <div className="forgot-link">
                      <p
                        style={{
                          color: resendEnabled ? "" : "gray",
                          fontWeight: 500,
                          cursor: "pointer",
                        }}
                        onClick={resendEnabled ? handleResendOtp : null}
                      >
                        {resendEnabled
                          ? "Resend OTP"
                          : `Re-send otp in ${timer}s`}
                      </p>
                    </div>
                  </>
                )}

                {!showOTP && (
                  <div className="forgot-link">
                    <p onClick={() => setStep('login')} style={{ cursor: 'pointer' }}>Already have an account? Login</p>
                  </div>
                )}

                <button type="submit" className="btn">
                  {showOTP ? "Submit" : "Verify"}
                </button>
              </form>
            )}

          </div>

          {/*<============================================================================= Toggle box ====================================================================> */}

          <div className="toggle-box">
            <div className="toggle-panel toggle-left">
              <div className="header-logo1">
                <a href='index.html'>
                  <img src={loginlogo} alt="logo" width="150px" />
                </a>
              </div>
              <p style={{ color: "#fff" }}>Don't have an account?</p>
              <button className="btn register-btn" onClick={() => { setActive(true); setStep("register") }}>Register</button>
            </div>

            <div className="toggle-panel toggle-right">
              <div className="header-logo1">
                <a href='index.html'>
                  <img src={loginlogo} alt="logo" width="150px" />
                </a>
              </div>
              <p>Already have an account?</p>
              <button className="btn login-btn" onClick={() => { setActive(false); setStep("login") }}>Login</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginSignup;
