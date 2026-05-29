import "./LoginSignup.css";
import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { TextField } from "@mui/material";
import axios from "axios";
import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  OutlinedInput,
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
    setRegisterData({ ...registerData, [e.target.id]: e.target.value });
  };

  {/*<=============================================================================== verify OTP =====================================================================> */ }

  const handleValidation = async (e) => {
    e.preventDefault(); // 
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!registerData.pharmacy_name) {
      newErrors.pharmacy_name = "pharmacy Name is required";
      toast.dismiss();
      toast.error("Pharmacy Name is required");
    }
    if (!registerData.mobile_number) {
      newErrors.mobile_number = "mobile No is required";
      toast.dismiss();
      toast.error("Mobile Number is required");
    } else if (!/^\d{10}$/.test(registerData.mobile_number)) {
      newErrors.mobile_number = "Mobile number must 10 numbers";;
      toast.dismiss();
      toast.error("Mobile number must 10 numbers");
    }

    if (!registerData.email) {
      newErrors.email = "Email Id is required";
      toast.dismiss();
      toast.error("Email Id is required");
    } else if (!emailRegex.test(registerData.email)) {
      newErrors.email = "Enter a valid email address";
      toast.dismiss();
      toast.error("Enter a valid email address");
    }

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
      data.append("coupon_code", registerData.referral_code);
      data.append("type", registerData.type);
      const response = await axios.post("resgiter", data);
      if (response.data.status === 200) {
        toast.dismiss();
        toast.success(response.data.message);
        setUserID(response.data.data.id);
        setStep("otp");
        setPassword("");

      } else {
        toast.dismiss();
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.dismiss();
        toast.error(error.response.data.message);
      } else {
        toast.dismiss();
        toast.error("An unexpected error occurred. Please try again later.");
        console.error("API error:", error);
      }
    }
  };
  {/*<=============================================================================== register OTP validation ======================================================================> */ }
  const validationOTP = () => {
    const newErrors = {};

    if (!otp) {
      newErrors.otp = "OTP is required";
      toast.dismiss();
      toast.error(newErrors.otp);
    }

    if (!password) {
      newErrors.password = "Password is required";
      toast.dismiss();
      toast.error(newErrors.password);
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      toast.dismiss();
      toast.error(newErrors.password);
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter";
      toast.dismiss();
      toast.error(newErrors.password);
    } else if (!/[a-z]/.test(password)) {
      newErrors.password =
        "Password must contain at least one lowercase letter";
      toast.dismiss();
      toast.error(newErrors.password);
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = "Password must contain at least one digit";
      toast.dismiss();
      toast.error(newErrors.password);
    } else if (!/[!@#$%^&*]/.test(password)) {
      newErrors.password =
        "Password must contain at least one special character";
      toast.dismiss();
      toast.error(newErrors.password);
    }
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    if (isValid) {
      handleSubmitOtp();
    }
    return;
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
        toast.dismiss();
        toast.success(response.data.message);
        localStorage.setItem("userId", userID);
        setPassword("");
        setOtp("")
        setTimeout(() => {
          history.push("/", { NewUser: "NewUser" });
        }, 3000);
      } else {
        toast.dismiss();
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      toast.dismiss();
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
    if (!mobile) {
      newErrors.mobile = "Mobile Number is required";
      toast.dismiss();
      toast.error("Mobile Number is required");
    }
    if (!password) {
      newErrors.password = "Password is required";
      toast.dismiss();
      toast.error("Password is required");
    } else if (!/^\d{10}$/.test(mobile)) {
      newErrors.mobileNumber = "Mobile Number must be 10 digits";
      toast.dismiss();
      toast.error("Mobile Number must be 10 digits");
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

          toast.dismiss();
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
          toast.dismiss();
          toast.error(response.data.message);
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          toast.dismiss();
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!mobile) {
      newErrors.mobile = "mobile No is required";
      toast.dismiss();
      toast.error("Mobile Number is required");
    } else if (!/^\d{10}$/.test(mobile)) {
      newErrors.mobile = "Mobile number must be 10 digits";
      toast.dismiss();
      toast.error("Mobile number must be 10 digits");
    }
    if (!email) {
      newErrors.email = "Email Id is required";
      toast.dismiss();
      toast.error("Email Id is required");
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Enter a valid email address";
      toast.dismiss();
      toast.error("Enter a valid email address");
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
          toast.dismiss();
          toast.success(response.data.message);
          setShowOTP(true);
          setPassword("");
          setEmail("");
          setMobile("");
          setStep("ForgetOTP");
        } else {
          toast.dismiss();
          toast.error(response.data.message);
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          toast.dismiss();
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
      toast.dismiss();
      toast.error(errors.password);
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
      toast.dismiss();
      toast.error(errors.password);
    } else if (!/[A-Z]/.test(password)) {
      errors.password = "Password must contain at least one uppercase letter";
      toast.dismiss();
      toast.error(errors.password);
    } else if (!/[a-z]/.test(password)) {
      errors.password = "Password must contain at least one lowercase letter";
      toast.dismiss();
      toast.error(errors.password);
    } else if (!/[0-9]/.test(password)) {
      errors.password = "Password must contain at least one digit";
      toast.dismiss();
      toast.error(errors.password);
    } else if (!/[!@#$%^&*]/.test(password)) {
      errors.password = "Password must contain at least one special character";
      toast.dismiss();
      toast.error(errors.password);
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
          toast.dismiss();
          toast.success(response.data.message);
          setShowOTP(true);
          setTimeout(() => {
            history.push("/");
          }, 3000);
        } else {
          toast.dismiss();
          toast.error(response.data.message);
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          toast.dismiss();
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
          autoClose={5000}
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
              <form id="registerForm" onSubmit={(e) => handleValidation(e)}>
                {/* <h1>Welcome !</h1> */}
                <div className="input-box">
                  <TextField
                    size="small"
                    type="text"
                    id="pharmacy_name"
                    placeholder="Pharmacy Name"
                    required

                    value={registerData.pharmacy_name}
                    inputRef={(el) => (inputRefs.current[0] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 0)}
                    onChange={handleInputChange}
                    autoFocus />

                  <i className='bx bxs-store'></i>
                </div>
                <div className="input-box">
                  <TextField
                    type="tel"
                    id="mobile_number"
                    placeholder="Mobile Number"
                    required
                    value={registerData.mobile_number}
                    inputRef={(el) => (inputRefs.current[1] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 1)}
                    onChange={(e) => {
                      const cleaned = e.target.value.replace(/\D/g, ""); // keep only digits
                      if (cleaned.length <= 10) {
                        e.target.value = cleaned; // update input value before passing
                        handleInputChange(e);     // pass original event
                      }
                    }}
                    inputProps={{
                      maxLength: 10,
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                    }}
                  />

                  <i className='bx bxs-phone'></i>
                </div>
                <div className="input-box">
                  <TextField
                    type="email"
                    id="email"
                    placeholder="Email"
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
                  <i className='bx bxs-envelope'></i>
                </div>
                <div className="input-box">
                  <TextField
                    type="text"
                    id="zip_code"
                    placeholder="ZIP Code"
                    required
                    value={registerData.zip_code}
                    inputRef={(el) => (inputRefs.current[3] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 3)}
                    onChange={handleInputChange} />
                  <i className='bx bxs-map'></i>
                </div>
                <div className="input-box">
                  <TextField
                    type="text"
                    id="referral_code"
                    placeholder="Referral Code (Optional)"
                    value={registerData.referral_code}
                    inputRef={(el) => (inputRefs.current[4] = el)}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleValidation(e);
                    }} />
                  <i className='bx bxs-gift'></i>
                </div>
                <button type="submit" className="btn">Register</button>
              </form>
            )}
            {/*<==================================================================================== OTP UI =======================================================================> */}

            {step === "otp" && (
              <form id="otpPasswordForm" onSubmit={validationOTP}>

                <div className="input-box">
                  <TextField
                    type="text" id="otp"
                    placeholder="Enter OTP"
                    required
                    value={otp}
                    inputRef={(el) => (inputRefs.current[5] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 5)}
                    onChange={(e) => setOtp(e.target.value)} />
                  <i className='bx bxs-lock'></i>
                </div>

                <div className="input-box">
                  <TextField
                    type={showPasswordIcon ? "text" : "password"}
                    id="password"
                    placeholder="Set Password"
                    required
                    fullWidth
                    value={password}
                    inputRef={(el) => (inputRefs.current[6] = el)}
                    onChange={(e) => setPassword(e.target.value)}
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
                  <PasswordRules password={password} />
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
                        ? "Resend OTP"
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
              <form id="loginForm" onSubmit={(e) => handleLogin(e)}>
                {/* <h1>Welcome !</h1> */}
                <div className="input-box">
                  <TextField
                    type="number"
                    id="login-mobile"
                    placeholder="Mobile No"
                    required
                    fullWidth
                    size="small"
                    variant="outlined"
                    value={mobile}
                    inputRef={(el) => (inputRefs.current[8] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 8)}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, ""); // remove non-digits
                      if (value.length <= 10) {
                        setMobile(value);
                      }
                    }}
                    inputProps={{
                      maxLength: 10, // prevent more than 10 digits
                      inputMode: "numeric", // brings up numeric keypad on mobile
                      pattern: "[0-9]*",
                    }}
                    InputProps={{
                      sx: {
                        backgroundColor: "white",
                        borderRadius: "4px",
                      },
                    }}
                  />
                  <i className='bx bxs-user'></i>
                </div>

                <div className="input-box">
                  <TextField
                    type={showPasswordIcon ? "text" : "password"}
                    id="login-password"
                    placeholder="Password"
                    required
                    fullWidth
                    size="small"
                    variant="outlined"
                    inputRef={(el) => (inputRefs.current[9] = el)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleLogin(e);
                    }}
                    onChange={(e) => setPassword(e.target.value)}
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
                  <i className='bx bxs-lock-alt'></i>
                </div>

                <div className="forgot-link">
                  <p onClick={() => setStep('forget')}>Forgot Password?</p>

                </div>
                <button type="submit" className="btn">Login</button>
              </form>)}

            {/*<=========================================================================== Forget password ======================================================================> */}

            {!active && step === "forget" && (
              <form id="loginForm" onSubmit={(e) => handleForgotDetails(e)}>
                {/* <h1>Welcome !</h1> */}
                <div className="input-box">
                  <TextField
                    type="number"
                    placeholder="Mobile No"
                    required
                    fullWidth
                    size="small"
                    variant="outlined"
                    inputRef={(el) => (inputRefs.current[8] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 8)}
                    onChange={(e) => setMobile(e.target.value)}
                    InputProps={{
                      sx: {
                        backgroundColor: 'white',
                        borderRadius: '4px',
                      },
                    }}
                  />

                </div>
                <div className="input-box">
                  <TextField
                    type="email"
                    placeholder="Email ID"
                    required
                    fullWidth
                    size="small"
                    variant="outlined"
                    inputRef={(el) => (inputRefs.current[9] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 9)}
                    onChange={(e) => setEmail(e.target.value)}
                    InputProps={{
                      sx: {
                        backgroundColor: 'white',
                        borderRadius: '4px',
                      },
                    }}
                  />
                </div>
                <div className="forgot-link">
                  <p onClick={() => setStep('login')}>Already have an account? Login</p>
                </div>
                <button onClick={handleForgotDetails} className="btn">Verify</button>
              </form>)}

            {/*<=========================================================================== OTP verifiaction ==================================================================> */}

            {step === "ForgetOTP" && (
              <form id="otpPasswordForm" >

                <div className="input-box">
                  <TextField
                    type="text" id="otp"
                    placeholder="Enter OTP"
                    required
                    value={otp}
                    inputRef={(el) => (inputRefs.current[5] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 5)}
                    onChange={(e) => setOtp(e.target.value)} />
                  <i className='bx bxs-lock'></i>
                </div>

                <div className="input-box">
                  <TextField
                    type={showPasswordIcon ? "text" : "password"}
                    id="password"
                    placeholder="Set Password"
                    required
                    fullWidth

                    value={password}
                    inputRef={(el) => (inputRefs.current[6] = el)}
                    onChange={(e) => setPassword(e.target.value)}
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
                  <PasswordRules password={password} />
                  <i className='bx bxs-key'></i>
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
                      ? "Re-send otp"
                      : `Re-send otp in ${timer}s`}
                  </p>

                </div>
                <button onClick={(event) => handleUpdatePassword(event)} className="btn">Submit</button>
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
              <p>Don't have an account?</p>
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
