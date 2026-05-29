import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import Header from "../../Header";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import { FaEdit, FaSlack, FaTrash } from "react-icons/fa";
import Loader from "../../../componets/loader/Loader";
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { toast, ToastContainer } from "react-toastify";
import { BsLightbulbFill } from "react-icons/bs";
import AddIcon from '@mui/icons-material/Add';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, TextField } from "@mui/material";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, ListItemText, MenuItem, Select } from '@mui/material';
import { TablePagination } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

const Catagory = () => {
  const history = useHistory()

  const token = localStorage.getItem("token");
  const categoryColumns = [
    { id: 'category_name', label: 'Category Name', minWidth: 100 },
  ];
  const [categoryData, setCategoryData] = useState([])
  const [openAddPopUp, setOpenAddPopUp] = useState(false);
  const [header, setHeader] = useState('');
  const [buttonLabel, setButtonLabel] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [categoryID, setCategoryID] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const handelAddOpen = () => {
    setOpenAddPopUp(true);
    setHeader('Add Category');
    setButtonLabel('Save')
  }

  const handleEditOpen = (row) => {
    setOpenAddPopUp(true);
    setCategoryID(row.id);
    setIsEditMode(true);
    setHeader('Edit Category');
    setButtonLabel('Update')
    setCategoryName(row.category_name);
  }
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const resetAddDialog = () => {
    setCategoryName('');
    setErrors({});
    setOpenAddPopUp(false);
  }


  useEffect(() => {
    categoryList();
  }, [page, rowsPerPage]);

  const categoryList = () => {
    const params = {
      page: page + 1,
      limit: rowsPerPage,
    }
    axios
      .get("list-itemcategory", {
        params: params
      })
      .then((response) => {
        
        setCategoryData(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("API error:", error);

        setIsLoading(false);
           if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
      });
  };

  const validData = () => {
    if (isEditMode == false) {
      //  Add Package 
      const newErrors = {};
      if (!categoryName) {
        newErrors.categoryName = 'Category Name is required';
        toast.dismiss();
toast.error(newErrors.categoryName)
      }
      setErrors(newErrors);
      const isValid = Object.keys(newErrors).length === 0;
      if (isValid) {
        AddCategory();
      }
      return isValid;
    }
    else {
      // Edit Package
      const newErrors = {};
      if (!categoryName) {
        newErrors.categoryName = 'Category Name is required';
        toast.dismiss();
toast.error(newErrors.categoryName)
      }
      setErrors(newErrors);
      const isValid = Object.keys(newErrors).length === 0;
      if (isValid) {
        EditCategory();
      }
      return isValid;
    }
  };
  const AddCategory = async () => {
    let data = new FormData();
    data.append('category_name', categoryName);

    try {
      await axios.post("create-itemcategory", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      ).then((response) => {
        categoryList();
        setOpenAddPopUp(false);
        setCategoryName('');
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
  const EditCategory = async () => {
    let data = new FormData();
    data.append('id', categoryID);
    data.append('category_name', categoryName);
    try {
      await axios.post("update-itemcategory", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      ).then((response) => {
      
        categoryList();
        setOpenAddPopUp(false);
         toast.dismiss();
toast.success(response.data.message);
        setCategoryName('');
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

  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [IsDelete, setIsDelete] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * rowsPerPage + 1;

  const catagoryDelete = async (id) => {
    let data = new FormData();
    data.append("id", id);
    try {
      await axios.post("delete-itemcategory",
        data,
        {
          headers: {
            // Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      ).then((response) => {
        setIsLoading(true)
        categoryList();
         toast.dismiss();
toast.success(response.data.message);
        if (response.data.status === 401) {
          history.push('/');
          localStorage.clear();
        }
      })
    } catch (error) {
      // alert("404 error");
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


  const deleteOpen = (categoryId) => {
    setDeleteCategoryId(categoryId);
    setIsDelete(true);
  };

  const deleteClose = () => {
    setIsDelete(false);
  };


  const handleDelete = async () => {
    if (!deleteCategoryId) return;
    await catagoryDelete(deleteCategoryId);
    setIsDelete(false);
  };

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

          < div style={{ background: "rgba(153, 153, 153, 0.1)", height: 'calc(99vh - 55px)', padding: '0px 20px 0px' }}>
            <div className='py-3' style={{ display: 'flex', gap: '4px' }}>
              <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                <span className='primary' style={{ display: 'flex', fontWeight: 700, fontSize: '20px', width: '90px' }} >Category</span>
                <BsLightbulbFill className="w-6 h-6 secondary hover-yellow " />
              </div>
              <div className="headerList">
                {/* <Button variant="contained" size='small' onClick={handelAddOpen} > <AddIcon />Add Category</Button> */}
              </div>
            </div>
            <div className="bg-white">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>SR No.</th>
                    {categoryColumns.map((column) => (
                      <th key={column.id} style={{ minWidth: column.minWidth }}>
                        {column.label}
                      </th>
                    ))}
                    {/* <th>Action</th> */}
                  </tr>
                </thead>
                <tbody>

                  {categoryData.length === 0 ? (
                    <tr>
                      <td colSpan={categoryColumns.length + 2} style={{ textAlign: 'center', color: 'gray' ,borderRadius: "10px 10px 10px 10px" }} >
                        No data found
                      </td>
                    </tr>
                  ) :
                    (categoryData?.map((item, index) => (
                      <tr key={index}>
                        <td>
                          {startIndex + index}
                        </td>
                        {categoryColumns.map((column) => (
                          <td key={column.id}>
                            {item[column.id]}
                          </td>
                        ))}

                        {/* <td>
                          <div className="px-2">
                            < BorderColorIcon color="primary" onClick={() => handleEditOpen(item)} />
                            <DeleteIcon className="delete-icon" onClick={() => deleteOpen(item.id)} />
                          </div>
                        </td> */}
                      </tr>
                    )))
                  }
                </tbody>
              </table>
              {/* <TablePagination
                rowsPerPageOptions={[5, 10, 12]}
                component="div"
                count={categoryData[0]?.count}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              /> */}
            </div>
          </div>
        )}
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
                    <span className="label primary">Category Name</span>
                    <TextField
                 autoComplete="off"
                      id="outlined-multiline-static"
                      size="small"
                      placeholder="Category Name"
                      value={categoryName}
                      onChange={(e) => { setCategoryName(e.target.value) }}
                      style={{ minWidth: 450 }}

                      variant="outlined"
                    />
                  </div>
                </div>
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
    </div>
  );
};
export default Catagory;
