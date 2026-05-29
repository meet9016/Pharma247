import { Box, Button, TextField } from "@mui/material";
import ProfileView from "../ProfileView";
import { BsLightbulbFill } from "react-icons/bs";
import Header from "../../Header";
import "../About/about.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../../../componets/loader/Loader";
import { toast, ToastContainer } from "react-toastify";
import profileImage from "../../../componets/Images/userProfile.png";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const AboutInfo = () => {
  const history = useHistory()

  const [pharmacyName, setPharmacyName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [gstN, setGSTN] = useState("");
  const [panCard, setPanCard] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [emailID, setEmailID] = useState("");
  const [address1, setAddress1] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [selectedProfileFile, setSelectedProfileFile] = useState(null);
  const [frontImgUrl, setFrontImgUrl] = useState(null);
  const [reRender, setreRender] = useState(0);

  useEffect(() => {
    if (reRender < 2) {

      const timeout = setTimeout(() => {
        setreRender(reRender + 1);
      }, 100);

      return () => clearTimeout(timeout);
    }

  }, [reRender]);

  useEffect(() => {
    fetchAboutDetails();
  }, []);

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
        setPharmacyName(data?.name);
        setOwnerName(data?.owner_name);
        setGSTN(data?.gst_pan);
        setPanCard(data?.pan_card);
        setMobileNo(data?.phone_number);
        setEmailID(data?.email);
        setAddress1(data?.address);
        setPincode(data?.zip_code);
        setArea(data?.address_line_two);
        setCity(data?.city);
        setState(data?.state);
        setSelectedProfileFile(data?.pharmacy_logo)
        setFrontImgUrl(data?.pharmacy_logo)
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

  const aboutDetails = async () => {
    let data = new FormData();
    setIsLoading(true);
    data.append("pharmacy_name", pharmacyName);
    data.append("owner_name", ownerName);
    data.append("gst", gstN);
    data.append("pan_card", panCard);
    data.append("phone_number", mobileNo);
    data.append("email", emailID);
    data.append("address", address1);
    data.append("pin_code", pincode);
    data.append("area", area);
    data.append("city", city);
    data.append("state", state);

    data.append("pharmacy_logo", selectedProfileFile);
    try {
      const response = await axios.post("about-pharmacy", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
       toast.dismiss();
toast.success(response.data.message);

      fetchAboutDetails();
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
  const handleProfilePhoto = (event) => {
    setSelectedProfileFile(event.target.files[0]);
    const url = URL.createObjectURL(event.target.files[0]);
    setFrontImgUrl(url);
  };

  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  const mobileRegex = /^[6-9][0-9]{9}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const pincodeRegex = /^[1-9][0-9]{5}$/;

  return (
    <>
      <Header key={reRender} />
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
      {isLoading ? (
        <div className="loader-container ">
          <Loader />
        </div>
      ) : (
        <div>
          <Box sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              sm: "column",
              md: "row"
            }
          }}>
            <ProfileView />

            <div className="flex w-full abt_res_fldd">
              <Box
                className="p-5"
                sx={{ width: "100%", padding: "10px 20px" }}
              >
                <div>
                  <h1
                    className="text-2xl flex items-center  font-semibold justify-start p-2 my-5"
                    style={{ color: "var(--color1)", paddingLeft: '15px' }}
                  >
                    About Pharmacy
                    <BsLightbulbFill className="ml-4 secondary  hover-yellow" />
                  </h1>
                </div>
                <Box className="aboutPharmacy  abt_fld_pf">
                  <TextField
                    autoComplete="off"
                    id="standard-basic"
                    label="Pharmacy Name"
                    variant="outlined"
                    className="aboutTextField"
                    value={pharmacyName}
                    onChange={(e) => {
                      const capitalizedValue = e.target.value
                        .toLowerCase()
                        .replace(/\b\w/g, (char) => char.toUpperCase());
                      setPharmacyName(capitalizedValue)
                    }}
                    InputLabelProps={{}}
                  />
                  <TextField
                    autoComplete="off"
                    id="owner-name"
                    label="Owner Name"
                    variant="outlined"
                    className="aboutTextField"
                    value={ownerName}
                    onChange={(e) => {
                      const lettersOnly = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                      const capitalizedValue = lettersOnly
                        .toLowerCase()
                        .replace(/\b\w/g, (char) => char.toUpperCase());
                      setOwnerName(capitalizedValue);
                    }}
                    InputLabelProps={{}}
                  />
                </Box>
                <Box className="aboutPharmacy abt_fld_pf">
                  <TextField
                    autoComplete="off"
                    id="standard-basic"
                    label="GSTN"
                    variant="outlined"
                    className="aboutTextField"
                    value={gstN}
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase();
                      // Prevent more than 15 characters
                      if (value.length <= 15) {
                        setGSTN(value);
                      }
                    }}
                    error={gstN.length > 0 && !gstRegex.test(gstN)}
                    helperText={
                      gstN.length > 0 && !gstRegex.test(gstN) ? "Invalid GST Number" : ""
                    }
                  />

                  <TextField
                    autoComplete="off"
                    id="standard-basic"
                    label="PAN"
                    variant="outlined"
                    className="aboutTextField"
                    value={panCard}
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase();
                      // Prevent more than 10 characters
                      if (value.length <= 10) {
                        setPanCard(value);
                      }
                    }}
                    error={panCard.length > 0 && !panRegex.test(panCard)}
                    helperText={
                      panCard.length > 0 && !panRegex.test(panCard) ? "Invalid PAN Number" : ""
                    }
                  />
                </Box>
                <Box className="aboutPharmacy abt_fld_pf">
                  <TextField
                    autoComplete="off"
                    id="mobile-input"
                    label="Mobile No."
                    variant="outlined"
                    className="aboutTextField"
                    value={mobileNo}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, ""); // only digits
                      if (value.length <= 10) {
                        setMobileNo(value);
                      }
                    }}
                    error={mobileNo.length > 0 && !mobileRegex.test(mobileNo)}
                    helperText={
                      mobileNo.length > 0 && !mobileRegex.test(mobileNo)
                        ? "Enter valid 10-digit mobile number"
                        : ""
                    }
                  />

                  <TextField
                    autoComplete="off"
                    id="email-input"
                    label="Email ID"
                    variant="outlined"
                    className="aboutTextField"
                    value={emailID}
                    onChange={(e) => setEmailID(e.target.value)}
                    error={emailID.length > 0 && !emailRegex.test(emailID)}
                    helperText={
                      emailID.length > 0 && !emailRegex.test(emailID)
                        ? "Enter valid email address"
                        : ""
                    }
                  />
                </Box>
                <Box className="aboutPharmacy abt_fld_pf">
                  <TextField
                    autoComplete="off"
                    id="standard-basic"
                    label="Address 1"
                    variant="outlined"
                    className="aboutTextField"
                    value={address1}
                    onChange={(e) => {
                      const capitalizedValue = e.target.value
                        .toLowerCase()
                        .replace(/\b\w/g, (char) => char.toUpperCase());
                      setAddress1(capitalizedValue)
                    }}
                    InputLabelProps={{}}
                  />
                  <TextField
                    autoComplete="off"
                    id="pincode-input"
                    label="Pincode"
                    variant="outlined"
                    className="aboutTextField"
                    value={pincode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, ""); // only digits
                      if (value.length <= 6) {
                        setPincode(value);
                      }
                    }}
                    error={pincode.length > 0 && !pincodeRegex.test(pincode)}
                    helperText={
                      pincode.length > 0 && !pincodeRegex.test(pincode)
                        ? "Enter valid 6-digit pincode"
                        : ""
                    }
                  />
                </Box>
                <Box className="aboutPharmacy abt_fld_pf">
                  <TextField
                    autoComplete="off"
                    id="standard-basic"
                    label="Area"
                    variant="outlined"
                    className="aboutTextField"
                    value={area}
                    onChange={(e) => {
                      const capitalizedValue = e.target.value
                        .toLowerCase()
                        .replace(/\b\w/g, (char) => char.toUpperCase());
                      setArea(capitalizedValue)
                    }}
                    InputLabelProps={{}}
                  />
                  <TextField
                    autoComplete="off"
                    id="standard-basic"
                    label="City"
                    variant="outlined"
                    className="aboutTextField"
                    value={city}
                    onChange={(e) => {
                      const capitalizedValue = e.target.value
                        .toLowerCase()
                        .replace(/\b\w/g, (char) => char.toUpperCase());
                      setCity(capitalizedValue)
                    }}
                    InputLabelProps={{}}
                  />
                  <TextField
                    autoComplete="off"
                    id="standard-basic"
                    label="state"
                    variant="outlined"
                    className="aboutTextField"
                    value={state}
                    onChange={(e) => {
                      const capitalizedValue = e.target.value
                        .toLowerCase()
                        .replace(/\b\w/g, (char) => char.toUpperCase());
                      setState(capitalizedValue)
                    }}
                    InputLabelProps={{}}
                  />
                </Box>
                <Box className="aboutPharmacy ">
                  <Button
                    variant="contained"
                    sx={{
                      textTransform: "none",
                      background: "var(--color1)",
                    }}
                    onClick={aboutDetails}
                  >
                    Update
                  </Button>
                </Box>
              </Box>
              <div className="p-4 img_prv_fldd ">
                <div className="profile-upload">
                  <input
                    accept="image/*"
                    style={{ display: "none" }}
                    id="front-photo-file"
                    type="file"
                    onChange={handleProfilePhoto}
                  />
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {selectedProfileFile == null || selectedProfileFile == "" ? (
                      <img src={profileImage} alt="default" style={{ width: "70px" }} />
                    ) : (
                      <img
                        src={frontImgUrl}
                        alt="Uploaded"
                        className="rounded-md"
                        style={{ height: "85px", width: "85px" }}
                      />
                    )}
                  </div>

                  <label htmlFor="front-photo-file" style={{ marginBottom: "10px" }}>
                    <Button
                      variant="contained"
                      component="span"
                      style={{
                        background: "var(--color1)",
                        padding: "5px 12px",
                      }}
                    >
                      Choose Photo
                    </Button>
                  </label>
                </div>
              </div>

            </div>
          </Box>
        </div>
      )}
    </>
  );
};
export default AboutInfo;
