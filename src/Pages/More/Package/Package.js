import React, { useEffect, useState } from "react";
import Header from "../../Header";
import axios from "axios";
import { Box, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, ListItemText, MenuItem, Select } from '@mui/material';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Loader from "../../../componets/loader/Loader";
import { toast, ToastContainer } from "react-toastify";
import { Button, InputAdornment, OutlinedInput, TextField } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { BsLightbulbFill } from "react-icons/bs";
import { TablePagination } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import BorderColorIcon from '@mui/icons-material/BorderColor';

import DeleteIcon from '@mui/icons-material/Delete';
const Package = () => {
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [deletePackageId, setDeletePackageId] = useState(null);
  const [IsDelete, setIsDelete] = useState(false);
  const [header, setHeader] = useState('');
  const [buttonLabel, setButtonLabel] = useState('');
  const [packageName, setPackageName] = useState('');
  const [units, setUnits] = useState('');
  const [openAddPopUp, setOpenAddPopUp] = useState(false);
  const [errors, setErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [packageID, setPackageID] = useState(null);
  // const rowsPerPage = 10;
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const history = useHistory();
  const [id, setId] = useState("");
  const [unitList, setUnitList] = useState([]);
  const startIndex = (currentPage - 1) * rowsPerPage + 1;

  const packageColumns = [
    { id: 'packging_name', label: 'Package Name', minWidth: 100 },
    // { id: 'unit', label: 'Unit', minWidth: 100 },
  ];
  const [packageAllData, setPackageAllData] = useState([]);
  const [page, setPage] = useState(0);



  const PackageList = () => {
    setIsLoading(true);
    const params = {
      // id: id,
      page: page + 1,
      limit: rowsPerPage
    };
    axios.get("list-package", {
      params: params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        setIsLoading(false);
        setPackageAllData(response.data.data);
        if (response.data.status === 401) {
          history.push('/');
          localStorage.clear();
        }      
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

  useEffect(() => {
    PackageList();
  }, [page, rowsPerPage])


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };



  const deleteOpen = (PackageId) => {
    setDeletePackageId(PackageId);
    setIsDelete(true);
  };

  const deleteClose = () => {
    setIsDelete(false);
  };

  const handleDelete = async () => {
    if (!deletePackageId) return;
    await PackageDelete(deletePackageId);
    setIsDelete(false);
  };


  const handleEditOpen = (row) => {
    setOpenAddPopUp(true);
    setPackageID(row.id);
    setIsEditMode(true);
    setHeader('Edit Package');
    setButtonLabel('Update')
    setPackageName(row.packging_name);
    const unitNames = row.unit.map(unit => unit.name);
    setUnitList(unitNames);
  }

  const handleAddUnit = () => {
    if (units.trim() && !unitList.includes(units.trim())) {
      setUnitList([...unitList, units.trim()]);
      setUnits('');
    }
    //(unitList);
  };

  const handleRemoveUnit = (unitToRemove) => {
    setUnitList(unitList.filter(unit => unit !== unitToRemove));
  };

  const PackageDelete = async (id) => {
    let data = new FormData();
    data.append("id", id);
    try {
      const response = await axios.post("delete-package",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      PackageList();
      if (response.data.status === 401) {
        history.push('/');
        localStorage.clear();
      }
    } catch (error) {
      alert("404 error");
      console.error("Error deleting item:", error);
         if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
    }
  };

  const getUnitNames = (unit) => {
    return unit.map(unit => unit.name).join(', ');
  };

  const handelAddOpen = () => {
    setOpenAddPopUp(true);
    setHeader('Add Package');
    setButtonLabel('Save')
  }

  const resetAddDialog = () => {
    setPackageName('');
    // setUnits('');
    // setUnitList([])
    setErrors({});
    setOpenAddPopUp(false);
  }

  const validData = () => {
    if (isEditMode == false) {
      //  Add Package 
      const newErrors = {};
      if (!packageName) {
        newErrors.packageName = 'Package Name is required';
        toast.dismiss();
toast.error(newErrors.packageName)
      }
      // else if (!unitList) {
      //   newErrors.unitList = 'Unit is required';
      //   toast.dismiss();
// toast.error(newErrors.unitList)
      // }
      setErrors(newErrors);
      const isValid = Object.keys(newErrors).length === 0;
      if (isValid) {
        AddPackage();
      }
      return isValid;
    }
    else {
      // Edit Package
      const newErrors = {};
      if (!packageName) {
        newErrors.packageName = 'Package Name is required';
        toast.dismiss();
toast.error(newErrors.packageName)
      }
      // else if (!unitList) {
      //   newErrors.units = 'Unit is required';
      //   toast.dismiss();
// toast.error(newErrors.unitList)
      // }
      setErrors(newErrors);
      const isValid = Object.keys(newErrors).length === 0;
      if (isValid) {
        EditPackage();
      }
      return isValid;
    }
  };

  const EditPackage = async () => {
    let data = new FormData();
    data.append('id', packageID);
    data.append('packging_name', packageName);
    // data.append('unit', unitList);
    // unitList.forEach((unit, index) => {
    //   data.append(`unit[${index}]`, unit);
    // });
    try {
      await axios.post("update-package", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      ).then((response) => {
        PackageList();
        setOpenAddPopUp(false);
         toast.dismiss();
toast.success(response.data.message);
        setPackageName('');
        setUnits();
        setUnitList([]);
        setIsEditMode(false)
        if (response.data.status === 401) {
          history.push('/');
          localStorage.clear();
        }
      })
    } catch (error) {
      if (error.response.data.status == 400) {

        toast.dismiss();
toast.error(error.response.data.message)

      }
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

  const AddPackage = async () => {
    let data = new FormData();
    data.append('packging_name', packageName);
    // data.append('unit', unitList);
    // unitList.forEach((unit, index) => {
    //   data.append(`unit[${index}]`, unit);
    // });

    try {
      await axios.post("create-package", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      ).then((response) => {
        PackageList();
        setOpenAddPopUp(false);
        setPackageName('');
        // setUnits('');
        // setUnitList([]);
         toast.dismiss();
toast.success(response.data.message);
        if (response.data.status === 401) {
          history.push('/');
          localStorage.clear();
        }
      })
    } catch (error) {
      setIsLoading(false);
      if (error.response.data.status == 400) {
        toast.dismiss();
toast.error(error.response.data.message)
      }
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

    <div >
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
      <div >
        {isLoading ? (
          <Loader />
        ) : (
          <div>
            < div style={{ background: "rgba(153, 153, 153, 0.1)", height: 'calc(99vh - 55px)', padding: '0px 20px 0px' }}>
              <div className='py-3' style={{ display: 'flex', gap: '4px' }}>
                <div style={{ display: 'flex', gap: '7px', alignItems: 'center' }}>
                  <span className='primary' style={{ display: 'flex', fontWeight: 700, fontSize: '20px', width: '80px' }} >Package</span>
                  <BsLightbulbFill className="w-6 h-6 secondary hover-yellow " />
                </div>
                <div className="headerList">
                  <Button variant="contained" size="small" onClick={handelAddOpen}> <AddIcon />Add Package</Button>
                </div>
              </div>
              <div className="bg-white">
                <table className="custom-table">
                  <thead>

                    <tr>
                      <th>SR No.</th>
                      {packageColumns.map((column) => (
                        <th key={column.id} style={{ minWidth: column.minWidth }}>
                          {column.label}
                        </th>
                      ))}
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>

                    {packageAllData.length === 0 ? (
                      <tr>
                        <td colSpan={packageColumns.length + 2} style={{ textAlign: 'center', color: 'gray' ,borderRadius: "10px 10px 10px 10px" }}>
                          No data found
                        </td>
                      </tr>
                    ) :
                      (packageAllData?.map((item, index) => (
                        <tr key={index}>
                          <td>
                            {startIndex + index}
                          </td>
                          {packageColumns.map((column) => (
                            <td key={column.id}>
                              {item[column.id]}
                              {/* {column.id === 'unit' ? getUnitNames(item.unit) : item[column.id]} */}
                            </td>
                          ))}

                          <td>
                            {/* <div className="flex gap-4"> */}
                            < BorderColorIcon color="primary" onClick={() => handleEditOpen(item)} />
                            <DeleteIcon className="delete-icon" onClick={() => deleteOpen(item.id)} />
                            {/* </div> */}
                          </td>
                        </tr>
                      )))
                    }
                  </tbody>
                </table>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 12]}
                  component="div"
                  count={packageAllData[0]?.count}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </div>
            </div>
            {/* Add & Edit Package Dialog  */}
            <Dialog open={openAddPopUp}
              sx={{
                "& .MuiDialog-container": {
                  "& .MuiPaper-root": {
                    width: "50%",
                    maxWidth: "500px",  // Set your width here
                  },
                },
              }}>
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
                  <div className="flex" style={{ flexDirection: 'column', gap: '19px' }}>
                    <div className="flex gap-10">
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span className="label primary">Package Name</span>
                        <TextField
                 autoComplete="off"
                          id="outlined-multiline-static"
                          size="small"
                          placeholder="Package Name"
                          value={packageName}
                          onChange={(e) => { setPackageName(e.target.value) }}
                          style={{ minWidth: 450 }}

                          variant="outlined"
                        />
                      </div>
                    </div>

                    {/* <div className="flex gap-10">
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span className="label primary">Unit</span>
                        <TextField
                 autoComplete="off"
                          id="outlined-multiline-static"
                          size="small"
                          value={units}
                          placeholder="Type Unit and Press Enter"
                          onChange={(e) => setUnits(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddUnit();
                            }
                          }}
                          style={{ minWidth: 450 }}
                          variant="outlined"
                        />
                        <Box style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                          {unitList.map((unit, index) => (
                            <Chip
                              key={index}
                              label={unit}
                              onDelete={() => handleRemoveUnit(unit)}
                            />
                          ))}
                        </Box>
                      </div>
                    </div> */}
                  </div>
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button autoFocus variant="contained" className="p-5" color="success"
                  onClick={validData}
                >
                  {buttonLabel}
                </Button>
                <Button autoFocus variant="contained" onClick={resetAddDialog} color="error"  >
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>

          </div>
        )}
      </div>
      {/* Delete PopUp */}
      <div id="modal" value={IsDelete}
        className={`fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif] ${IsDelete ? "block" : "hidden"
          }`}>
        <div />
        <div className="w-full max-w-md bg-white shadow-lg rounded-md p-4 relative">
          <svg xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 cursor-pointer absolute top-4 right-4 fill-current text-gray-600 hover:text-red-500 "
            viewBox="0 0 24 24" onClick={deleteClose}>
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
              onClick={handleDelete}
            >Delete</button>
            <button type="button"
              className="px-6 py-2.5 w-44 rounded-md text-black text-sm font-semibold border-none outline-none bg-gray-200 hover:bg-gray-900 hover:text-white"
              onClick={deleteClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div >
  );
};

export default Package;
