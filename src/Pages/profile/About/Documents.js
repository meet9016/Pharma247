
import { BsLightbulbFill } from "react-icons/bs"
import Header from "../../Header"
import ProfileView from "../ProfileView"
import { Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, FormControl, InputLabel, Select, MenuItem } from "@mui/material"
import { useEffect, useState } from "react"
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { MdOutlineCloudUpload } from "react-icons/md";
import DatePicker from 'react-datepicker';
import { addDays, format, subDays, subMonths } from 'date-fns';
import Loader from "../../../componets/loader/Loader"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import { cleanDigitSectionValue } from "@mui/x-date-pickers/internals/hooks/useField/useField.utils"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const Documents = () => {
    const history = useHistory()

    const token = localStorage.getItem("token");
    const [header, setHeader] = useState('');
    const [selectedLicenseName, setSelectedLicenseName] = useState('')
    const [selectedUploadFile, setSelectedUploadFile] = useState(null)
    const [selectedUploadFileTwo, setSelectedUploadFileTwo] = useState(null)
    const [selectedUploadFileThree, setSelectedUploadFileThree] = useState(null)
    const [selectedUploadFileFour, setSelectedUploadFileFour] = useState(null)
    const [licenseNo, setLicenseNo] = useState('')
    const [licenseNoTwo, setLicenseNoTwo] = useState('')
    const [licenseNoThree, setLicenseNoThree] = useState('')
    const [licenseNoFour, setLicenseNoFour] = useState('')
    const [licenseExpiryDate, setLicenseExpiryDate] = useState(new Date())
    const [licenseExpiryDateTwo, setLicenseExpiryDateTwo] = useState(new Date())
    const [licenseExpiryDateThree, setLicenseExpiryDateThree] = useState(new Date())
    const [licenseExpiryDateFour, setLicenseExpiryDateFour] = useState(new Date())
    const [uploadUrl, setUploadUrl] = useState(null)
    const [uploadUrlTwo, setUploadUrlTwo] = useState(null)
    const [uploadUrlThree, setUploadUrlThree] = useState(null)
    const [uploadUrlFour, setUploadUrlFour] = useState(null)
    const [document, setDocument] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [uploadImg, setUploadImg] = useState('')

    const [licenseDetails, setLicenseDetails] = useState(null); // Store all data in a single object for simplicity


    useEffect(() => {
        fetchAboutDetails();
    }, []);

    const fetchAboutDetails = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post("license-list",{}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = response.data.data;
            if (response.data.status == 200) {
                const data = response.data.data;
                setLicenseDetails(data);

                setLicenseNo(data?.license_no);
                setLicenseExpiryDate(data?.license_expiry_date);
                setSelectedUploadFile(data?.license_image);
                setUploadUrl(data?.license_image)
                setLicenseNoTwo(data?.license_no_two);
                setLicenseExpiryDateTwo(data?.license_expiry_date_two);
                setSelectedUploadFileTwo(data?.license_image_two);
                setUploadUrlTwo(data?.license_image_two)
                setLicenseNoThree(data?.license_no_three);
                setLicenseExpiryDateThree(data?.license_expiry_date_three);
                setSelectedUploadFileThree(data?.license_image_three);
                setUploadUrlThree(data?.license_image_three)
                setLicenseNoFour(data?.license_no_four);
                setLicenseExpiryDateFour(data?.license_expiry_date_four);
                setSelectedUploadFileFour(data?.license_image_four);
                setUploadUrlFour(data?.license_image_four)
            }
            // setDocument(data)
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

    const handleUploadFile = (event, setSelectedFile, setUrl) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setUrl(url);
    };
    const documentDetails = async () => {
        let data = new FormData();
        setIsLoading(true);
        // data.append('license_name', selectedLicenseName)
        data.append('license_no', licenseNo)
        data.append('license_image', selectedUploadFile)
        data.append('license_expiry_date', licenseExpiryDate ? format(licenseExpiryDate, 'yyyy-MM-dd') : '')
        data.append('license_no_two', licenseNoTwo)
        data.append('license_expiry_date_two', licenseExpiryDateTwo ? format(licenseExpiryDateTwo, 'yyyy-MM-dd') : '')
        data.append('license_image_two', selectedUploadFileTwo)
        data.append('license_no_three', licenseNoThree)
        data.append('license_expiry_date_three', licenseExpiryDateThree ? format(licenseExpiryDateThree, 'yyyy-MM-dd') : '')
        data.append('license_image_three', selectedUploadFileThree)
        data.append('license_no_four', licenseNoFour)
        data.append('license_expiry_date_four', licenseExpiryDateFour ? format(licenseExpiryDateFour, 'yyyy-MM-dd') : '')
        data.append('license_no_four', licenseNoFour)
        data.append('license_image_four', selectedUploadFileFour)

        try {
            await axios.post("license-store", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((response) => {
                 toast.dismiss();
toast.success(response.data.message)
                fetchAboutDetails();
                setErrors({})
               
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
                <div>
                    <Box className="cdd_mn_hdr" sx={{ display: "flex" }}>
                        <ProfileView />
                        <div className="p-5" style={{ width: "100%" }}>
                            <div className="flex justify-between">
                                <div>
                                    <h1 className="text-2xl flex items-center  font-semibold  p-2 mb-6" style={{ color: "var(--color1)", marginTop: "25px" }}>Documents
                                        <BsLightbulbFill className="ml-4 secondary  hover-yellow" />
                                    </h1>
                                </div>

                            </div>

                            <div className="flex flex-wrap justify-around dc_cdr_ff">
                                <div className="w-2/5 flex-col justify-evenly align-center dc_impt_fldd">
                                    <div>
                                        <span className="primary text-lg font-bold">Drug License No.20</span>
                                    </div>
                                    <div className="bg-white rounded-lg flex flex-wrap justify-between flex-row items-center mt-5 mb-5 p-5 gap-4" style={{
                                        border: '1px solid #628a2f73',
                                        boxShadow: '1px 5px 15px #9b9b9b3b',
                                    }}>
                                        <div className="flex-1">
                                            <div className="mb-4">
                                                <span className=" flex ">License Number</span>
                                                <TextField
                                                    required
                                                    autoComplete="off"
                                                    id="outlined-number"
                                                    sx={{ width: '100%' }}
                                                    size="small"
                                                    type="text"
                                                    value={licenseNo}
                                                    onChange={(e) => setLicenseNo((e.target.value).toUpperCase())}
                                                />
                                            </div>
                                            <div>
                                                <span className="primary flex">License Expiry Date</span>
                                                <DatePicker

                                                    className="custom-datepicker"
                                                    selected={licenseExpiryDate}
                                                    onChange={() => setLicenseExpiryDate()}
                                                    dateFormat="dd/MM/yyyy"
                                                    minDate={new Date()}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-center flex-1" style={{width:'100%'}}>
                                            <label htmlFor="upload-photo-file-one" className="flex flex-col items-center justify-center border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dc_imgs_fldd" style={{ width: "100%", height: "100%", minHeight: "200px", objectFit: "contain" }}>
                                                <input
                                                    accept="image/*"
                                                    style={{ display: 'none' }}
                                                    id="upload-photo-file-one"
                                                    type="file"
                                                    onChange={(event) => handleUploadFile(event, setSelectedUploadFile, setUploadUrl)}
                                                />
                                                {selectedUploadFile == null || selectedUploadFile == ""?(
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <MdOutlineCloudUpload className="w-10 h-10" />
                                                        <span>Drop your image here</span>
                                                        <p className="text-sm text-gray-500 mt-5">Click to upload</p>
                                                    </div>
                                                ) : (
                                                    <img src={uploadUrl} alt="Uploaded  1" className="w-44 h-28 border-dashed rounded-lg" style={{ minWidth: "200px", minHeight: "200px", objectFit: "contain" }} />
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-2/5 flex-col justify-evenly align-center dc_impt_fldd">
                                    <div>
                                        <span className="primary text-lg font-bold">Drug License No.21</span>
                                    </div>
                                    <div className="bg-white rounded-lg flex flex-wrap justify-between flex-row items-center mt-5 mb-5 p-5 gap-4" style={{
                                        border: '1px solid #628a2f73',
                                        boxShadow: '1px 5px 15px #9b9b9b3b',

                                    }}>
                                        <div className="flex-1">
                                            <div className="mb-4">
                                                <span className="primary flex">License Number</span>
                                                <TextField
                                                    autoComplete="off"

                                                    required
                                                    id="outlined-number-two"
                                                    sx={{ width: '100%' }}

                                                    size="small"
                                                    type="text"
                                                    value={licenseNoTwo}
                                                    onChange={(e) => setLicenseNoTwo((e.target.value).toUpperCase())}
                                                />
                                            </div>
                                            <div>
                                                <span className="primary flex">License Expiry Date</span>
                                                <DatePicker
                                                    className="custom-datepicker"
                                                    selected={licenseExpiryDateTwo}
                                                    onChange={(newDate) => setLicenseExpiryDateTwo(newDate)}
                                                    dateFormat="dd/MM/yyyy"
                                                    minDate={new Date()}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-center flex-1" style={{width:'100%'}}>
                                            <label htmlFor="upload-photo-file-two" className="flex flex-col items-center justify-center w-44 h-28 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dc_imgs_fldd" style={{ width: "100%", height: "100%", minHeight: "200px", objectFit: "contain" }}>
                                                <input
                                                    accept="image/*"
                                                    style={{ display: 'none' }}
                                                    id="upload-photo-file-two"
                                                    type="file"
                                                    onChange={(event) => handleUploadFile(event, setSelectedUploadFileTwo, setUploadUrlTwo)}
                                                />
                                                {selectedUploadFileTwo == null || selectedUploadFileTwo == "" ? (
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <MdOutlineCloudUpload className="w-10 h-10" />
                                                        <span>Drop your image here</span>
                                                        <p className="text-sm text-gray-500 mt-5">Click to upload</p>
                                                    </div>
                                                ) : (
                                                    <img src={uploadUrlTwo} alt="Uploaded  2" className="w-44 h-28 border-dashed rounded-lg" style={{ minWidth: "200px", minHeight: "200px", objectFit: "contain" }} />
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-around flex-wrap dc_cdr_ff mt-5">
                                <div className="w-2/5 flex-col justify-evenly align-center dc_impt_fldd">
                                    <div>
                                        <span className="primary text-lg font-bold">FSSAI No. (Optional)</span>
                                    </div>
                                    <div className="bg-white rounded-lg flex flex-wrap justify-between flex-row items-center mt-5 mb-5 p-5 gap-4" style={{
                                        border: '1px solid #628a2f73',
                                        boxShadow: '1px 5px 15px #9b9b9b3b',

                                    }}>
                                        <div className="flex-1">
                                            <div className="mb-4">
                                                <span className="primary flex">License Number</span>
                                                <TextField
                                                    required
                                                    id="outlined-number-three"
                                                    sx={{ width: '100%' }}
                                                    size="small"
                                                    type="text"
                                                    value={licenseNoThree}
                                                    onChange={(e) => setLicenseNoThree((e.target.value).toUpperCase())}
                                                />
                                            </div>
                                            <div>
                                                <span className="primary flex">License Expiry Date</span>
                                                <DatePicker
                                                    className="custom-datepicker"
                                                    selected={licenseExpiryDateThree}
                                                    onChange={(newDate) => setLicenseExpiryDateThree(newDate)}
                                                    dateFormat="dd/MM/yyyy"
                                                    minDate={new Date()}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-center flex-1" style={{width:'100%'}}>
                                            <label htmlFor="upload-photo-file-three" className="flex flex-col items-center justify-center w-44 h-28 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dc_imgs_fldd" style={{ width: "100%", height: "100%", minHeight: "200px", objectFit: "contain" }}>
                                                <input
                                                    accept="image/*"
                                                    style={{ display: 'none' }}
                                                    id="upload-photo-file-three"
                                                    type="file"
                                                    onChange={(event) => handleUploadFile(event, setSelectedUploadFileThree, setUploadUrlThree)}
                                                />
                                                {selectedUploadFileThree == null || selectedUploadFileThree == "" ? (
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <MdOutlineCloudUpload className="w-10 h-10" />
                                                        <span>Drop your image here</span>
                                                        <p className="text-sm text-gray-500 mt-5">Click to upload</p>
                                                    </div>
                                                ) : (
                                                    <img src={uploadUrlThree} alt="Uploaded  3" className="w-44 h-28 border-dashed rounded-lg" style={{ minWidth: "200px", minHeight: "200px", objectFit: "contain" }} />
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-2/5 flex-col justify-evenly align-center dc_impt_fldd">
                                    <div>
                                        <span className="primary text-lg font-bold">GSTN (Optional)</span>
                                    </div>
                                    <div className="bg-white rounded-lg flex flex-wrap justify-between flex-row items-center mt-5 mb-5 p-5 gap-4" style={{
                                        border: '1px solid #628a2f73',
                                        boxShadow: '1px 5px 15px #9b9b9b3b',
                                    }}>
                                        <div className="flex-1">
                                            <div className="mb-4">
                                                <span className="primary flex">License Number</span>
                                                <TextField
                                                    required
                                                    id="outlined-number-four"
                                                    sx={{ width: '100%' }}
                                                    size="small"
                                                    type="text"
                                                    value={licenseNoFour}
                                                    onChange={(e) => setLicenseNoFour((e.target.value).toUpperCase())}
                                                />
                                            </div>
                                            <div>
                                                <span className="primary flex">License Expiry Date</span>
                                                <DatePicker
                                                    className="custom-datepicker"
                                                    selected={licenseExpiryDateFour}
                                                    onChange={(newDate) => setLicenseExpiryDateFour(newDate)}
                                                    dateFormat="dd/MM/yyyy"
                                                    minDate={new Date()}

                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-center flex-1" style={{width:'100%'}}>
                                            <label htmlFor="upload-photo-file-four" className="flex flex-col items-center justify-center w-44 h-28 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dc_imgs_fldd" style={{ width: "100%", height: "100%", minHeight: "200px", objectFit: "contain" }}>
                                                <input
                                                    accept="image/*"
                                                    style={{ display: 'none' }}
                                                    id="upload-photo-file-four"
                                                    type="file"
                                                    onChange={(event) => handleUploadFile(event, setSelectedUploadFileFour, setUploadUrlFour)}
                                                />
                                                {selectedUploadFileFour == null || selectedUploadFileFour == ""? (
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <MdOutlineCloudUpload className="w-10 h-10" />
                                                        <span>Drop your image here</span>
                                                        <p className="text-sm text-gray-500 mt-5">Click to upload</p>
                                                    </div>
                                                ) : (
                                                    <img src={uploadUrlFour} alt="Uploaded  4" className="w-44 h-28 border-dashed rounded-lg" style={{ minWidth: "200px", minHeight: "200px", objectFit: "contain" }} />
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-start mt-5" style={{ paddingLeft: "5%" }}>
                                <div className="self-end">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        style={{ textTransform: 'none', backgroundColor: "var(--color1)" }}
                                        onClick={documentDetails}
                                    >
                                        Update
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Box >

                </div >
            }
        </>
    )
}
export default Documents