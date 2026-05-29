import { useEffect, useState } from "react";
import Loader from "../../../../../componets/loader/Loader";
import Header from "../../../../Header";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Select,
  TablePagination,
  Typography,
} from "@mui/material";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { setId } from "@material-tailwind/react/components/Tabs/TabsContext";
const saleColumns = [
  { id: "bill_no", label: "Bill NO", minWidth: 150, height: 100 },
  { id: "bill_date", label: "Bill Date", minWidth: 150 },
  { id: "qty", label: "Quantity", minWidth: 150 },
  { id: "payment_mode", label: "Payment Mode", minWidth: 150 },
  { id: "amt", label: "Bill Amount", minWidth: 150 },
  { id: "roylti_point", label: "Loyalty Points", minWidth: 150 },
];

const saleReturnColumns = [
  { id: "bill_no", label: "Bill NO", minWidth: 150, height: 100 },
  { id: "bill_date", label: "Bill Date", minWidth: 150 },
  { id: "qty", label: "Quantity", minWidth: 150 },
  // { id: 'status', label: 'Status', minWidth: 150 },
  { id: "amt", label: "Bill Amount", minWidth: 150 },
];
const CustomerView = () => {
  const { id } = useParams();
  const [tableData, setTableData] = useState([]);
  const [bankData, setBankData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");
  const history = useHistory();
  const [CustomerDetail, setCustomerdetails] = useState([]);
  const [openStatusDialog, setopenStatusDialog] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [paymentType, setPaymentType] = useState("");
  const [saleId, setSaleId] = useState("");
  const [page, setPage] = useState(0);
  // const initialSaleSearchTerms = saleColumns.map(() => '');
  // const initialsaleReturnSearchTerms = saleReturnColumns.map(() => '');
  // const [searchSaleTerms, setSearchSaleTerms] = useState(initialSaleSearchTerms);
  // const [searchSaleReturnTerms, setSearchSaleReturnTerms] = useState(initialsaleReturnSearchTerms);
  // const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [tabValue, setTabValue] = useState(0);
  // const [currentPage, setCurrentPage] = useState(1);
  // const paginatedData = CustomerDetail.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const totalPages = Math.ceil(CustomerDetail.length / rowsPerPage);
  useEffect(() => {
    CustomerGetByID(id);
    BankList();
  }, [page, rowsPerPage, id]);

  const CustomerGetByID = (id) => {
    let data = new FormData();
    data.append("id", id);
    const params = {
      id: id,
      page: page + 1,
      limit: rowsPerPage,
    };
    setIsLoading(true);
    try {
      axios
        .post("customer-view?", data, {
          params: params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setTableData(response.data.data);
          setIsLoading(false);
        });
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
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const BankList = async () => {
    let data = new FormData();
    try {
      await axios
        .post("bank-list", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setBankData(response.data.data);
          if (response.data.status === 401) {
            history.push("/");
            localStorage.clear();
          }
        });
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

  const viewBill = (item) => {
    if (tabValue === 0) {
      history.push(`/saleView/${item.sales_id}`);
    } else if (tabValue === 1) {
      history.push(`/SaleReturnView/${item.sales_id}`);
    } else {
      // toast.dismiss();
      // toast.error('Route not Found')
    }
  };

  const handleEditOpen = (row) => {
    setopenStatusDialog(true);
    setSaleId(row?.sales_id);
    setPaymentType(row?.payment_id);
  };

  const resetAddDialog = () => {
    setopenStatusDialog(false);
  };

  const updatePaymentMode = async () => {
    let data = new FormData();
    data.append("id", saleId);
    data.append("payment_name", paymentType);

    try {
      await axios
        .post("sales-bill-status", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setopenStatusDialog(false);
          CustomerGetByID(id);
        });
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
  return (
    <>
      <Header />
      {isLoading ? (
        <div className="loader-container ">
          <Loader />
        </div>
      ) : (
        <div className="p-6"
        >
          <div>
            <div
              className="mb-4"
              style={{ display: "flex", gap: "4px", alignItems: "center" }}
            >
              <span
                style={{
                  color: "var(--color2)",
                  display: "flex",
                  alignItems: "center",
                  fontWeight: 700,
                  fontSize: "20px",
                }}
                className="cursor-pointer cust_header_txt_main"
                onClick={() => {
                  history.push("/customer");
                }}
              >
                Customers
              </span>
              <ArrowForwardIosIcon
                className="cust_header_txt"
                style={{
                  fontSize: "20px",
                  color: "var(--color1)",
                }}
              />
              <span
                className="cust_header_txt"
                style={{
                  color: "var(--color1)",
                  display: "flex",
                  alignItems: "center",
                  fontWeight: 700,
                  fontSize: "20px",
                }}
              >
                View
              </span>
              <ArrowForwardIosIcon
                className="cust_header_txt"
                style={{
                  fontSize: "20px",
                  color: "var(--color1)",
                }}
              />
              <span
                className="cust_header_txt"
                style={{
                  color: "var(--color1)",
                  display: "flex",
                  alignItems: "center",
                  fontWeight: 700,
                  fontSize: "20px",
                }}
              >
                {tableData.name}
              </span>
            </div>
          </div>
          <div className="p-3"
            style={{
              backgroundColor: "rgb(63 98 18 / 11%)",
              borderRadius: "10px",
            }}
          >
            <div
              className="header_main_txt_CV mt-2 gap-3 "
              style={{ background: "none" }}
            >
              <div className="detail_main_bg_CV">
                <span className="heading_othr">Customer Name</span>
                <span className="data_bg">
                  {tableData.name ? tableData.name : "____"}
                </span>
              </div>
              <div className="detail_main_bg_CV">
                <span className="heading_othr">Mobile No</span>
                <span className="data_bg">
                  {tableData.phone_number ? tableData.phone_number : "____"}
                </span>
              </div>
              <div className="detail_main_bg_CV">
                <span className="heading_othr">Email ID</span>
                <span
                  className="data_bg"
                  style={{ textTransform: "lowercase" }}
                >
                  {tableData.email ? tableData.email : "____"}
                </span>
              </div>
              <div className="detail_main_bg_CV">
                <span className="heading_othr">Total Amount</span>
                <span className="data_bg">
                  {tableData.balance ? tableData.balance : "____"}
                </span>
              </div>
              <div className="detail_main_bg_CV">
                <span className="heading_othr">Loyalty Points</span>
                <span className="data_bg">
                  {tableData.roylti_point ? tableData.roylti_point : "____"}
                </span>
              </div>
              <div className="detail_main_bg_CV">
                <span className="heading_othr">Area</span>
                <span className="data_bg">
                  {tableData.area ? tableData.area : "____"}
                </span>
              </div>
              <div className="detail_main_bg_CV">
                <span className="heading_othr">City</span>
                <span className="data_bg">
                  {tableData.city ? tableData.city : "____"}
                </span>
              </div>
              <div className="detail_main_bg_CV">
                <span className="heading_othr">Address</span>
                <span className="data_bg">
                  {tableData.address ? tableData.address : "____"}
                </span>
              </div>
              {/*  </div> */}
            </div>
          </div>

          <div className=" ">
            <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
              <div className="cust_tab_val mt-3">
                <Tabs
                  value={tabValue}
                  TabIndicatorProps={{
                    style: {
                      backgroundColor: "var(--color1)",
                      color: "var(--color1)",
                    },
                  }}
                  onChange={handleChange}
                // style={{ marginBottom: "10px" }}
                >
                  <Tab
                    label="Sale"
                    sx={{
                      color: tabValue === 0 ? "var(--color1)" : "var(--color1)",
                      "&.Mui-selected": {
                        color: "var(--color1)",
                      },
                    }}
                  />

                  <Tab
                    label="Sales Return"
                    sx={{
                      color: tabValue === 0 ? "var(--color1)" : "var(--color1)",
                      "&.Mui-selected": {
                        color: "var(--color1)",
                      },
                    }}
                  />
                </Tabs>
                <div className="total_amount_fld">
                  {tabValue === 0 && (
                    <div
                      className=" "
                      style={{
                        border: "1px solid var(--color2)",
                        padding: "5px",
                        borderRadius: "6px",
                        backgroundColor: "rgba(63, 98, 18, 0.09)",
                        width: "fit-content",
                      }}
                    >
                      <Typography
                        className="total_amount_txt"
                        style={{
                          color: "var(--color1)",
                          fontSize: "18px",
                          fontWeight: 800,
                          whiteSpace: "noWrap",
                        }}
                      >
                        Total Sale Amount :-
                        <span style={{ color: "var(--color2)" }}>
                          Rs.
                          {tableData?.sales_amount
                            ? tableData?.sales_amount
                            : 0}
                        </span>
                      </Typography>
                    </div>
                  )}
                  {tabValue === 1 && (
                    <div
                      className="mx-4 my-2 "
                      style={{
                        border: "1px solid var(--color2)",
                        padding: "10px",
                        borderRadius: "6px",
                        backgroundColor: "rgba(63, 98, 18, 0.09)",
                        width: "fit-content",
                      }}
                    >
                      <Typography
                        className="total_amount_txt"
                        style={{
                          color: "var(--color1)",
                          fontSize: "18px",
                          fontWeight: 800,
                          whiteSpace: "noWrap",
                        }}
                      >
                        Total Sale Return Amount :-
                        <span style={{ color: "var(--color2)" }}>
                          Rs.
                          {tableData?.sales_return_amount
                            ? tableData?.sales_return_amount
                            : 0}
                        </span>
                      </Typography>
                    </div>
                  )}
                </div>
              </div>

              {tabValue === 0 && (
                <div>
                  {/* <div className="mx-4 my-2 ">
                    <Typography
                      style={{
                        color: "var(--color1)",
                        fontSize: "18px",
                        fontWeight: 800,
                      }}
                    >
                      
                      Total Sale Amount :-
                      <span style={{ color: "var(--color2)" }}>
                        Rs.
                        {tableData?.sales_amount ? tableData?.sales_amount : 0}
                      </span>
                    </Typography>
                  </div> */}
                  <div className="overflow-x-auto mt-4">
                    <table
                      className="w-full border-collapse custom-table"
                      style={{
                        whiteSpace: "nowrap",
                        borderCollapse: "separate",
                        borderSpacing: "0 6px",
                        overflow: "auto",
                      }}
                    >
                      <thead>
                        <tr>
                          {saleColumns.map((column) => (
                            <th
                              key={column.id}
                              style={{ minWidth: column.minWidth }}
                            >
                              {column.label}
                            </th>
                          ))}
                          {/* <th>Action</th> */}
                        </tr>
                      </thead>
                      <tbody style={{ backgroundColor: "#3f621217" }}>
                        {tableData?.sales?.map((item, index) => (
                          <tr key={index}>
                            {saleColumns.map((column, colIndex) => (
                              <td
                                key={column.id}
                                style={
                                  colIndex === 0 // Check if this is the first column
                                    ? { borderRadius: "10px 0 0 10px" }
                                    : colIndex === saleColumns.length - 1 // Last column for right-side radius
                                      ? { borderRadius: "0 10px 10px 0" }
                                      : {}
                                }
                              >
                                {column.id === "bill_no" ? (
                                  <span
                                    style={{
                                      cursor: "pointer",
                                    }}
                                    onClick={() => viewBill(item)}
                                  >
                                    {item[column.id]}
                                  </span>
                                ) : (
                                  item[column.id]
                                )}
                              </td>
                            ))}
                            {item?.payment_mode == "credit" && (
                              <td>
                                <BorderColorIcon
                                  style={{ color: "var(--color1)" }}
                                  onClick={() => handleEditOpen(item)}
                                />
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 12]}
                      component="div"
                      count={tableData?.sales?.[0]?.count}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </div>
                </div>
              )}

              {tabValue === 1 && (
                <div style={{ margin: "25px" }}>
                  {/* <div className="mx-4 my-2 ">
                    <Typography
                      style={{
                        color: "var(--color1)",
                        fontSize: "18px",
                        fontWeight: 800,
                      }}
                    >
                      
                      Total Sale Return Amount :-
                      <span style={{ color: "var(--color2)" }}>
                        Rs.
                        {tableData?.sales_return_amount
                          ? tableData?.sales_return_amount
                          : 0}
                      </span>
                    </Typography>
                  </div> */}
                  <div className="overflow-x-auto mt-4">
                    <table
                      className="w-full border-collapse custom-table"
                      style={{
                        whiteSpace: "nowrap",
                        borderCollapse: "separate",
                        borderSpacing: "0 6px",
                        overflow: "auto",
                      }}
                    >
                      <thead>
                        <tr>
                          {saleReturnColumns.map((column) => (
                            <th
                              key={column.id}
                              style={{ minWidth: column.minWidth }}
                            >
                              {column.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody style={{ backgroundColor: "#3f621217" }}>
                        {tableData?.sales_return?.map((item, index) => (
                          <tr key={index}>
                            {saleReturnColumns.map((column, colIndex) => (
                              <td
                                key={column.id}
                                style={
                                  colIndex === 0 // Check if this is the first column
                                    ? { borderRadius: "10px 0 0 10px" }
                                    : colIndex === saleReturnColumns.length - 1 // Last column for right-side radius
                                      ? { borderRadius: "0 10px 10px 0" }
                                      : {}
                                }
                              >
                                {item[column.id]}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 12]}
                      component="div"
                      count={tableData?.sales_return?.[0]?.count}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </div>
                </div>
              )}
            </Box>
          </div>
          <Dialog
            open={openStatusDialog}
            sx={{
              "& .MuiDialog-container": {
                "& .MuiPaper-root": {
                  width: "36%",
                  maxWidth: "400px", // Set your width here
                },
              },
            }}
          >
            <div className="flex justify-center items-center h-auto">
              <div className="bg-white rounded-lg p-6 w-full max-w-3xl">
                <div className="flex justify-between items-center">
                  <DialogTitle id="alert-dialog-title" className="primary">
                    Change Payment Mode
                  </DialogTitle>
                  <IconButton
                    aria-label="close"
                    onClick={resetAddDialog}
                    className="text-gray-500"
                  >
                    <CloseIcon />
                  </IconButton>
                </div>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    <div className="flex flex-col gap-5">
                      <Select
                        labelId="dropdown-label"
                        id="dropdown"
                        value={paymentType}
                        sx={{ minWidth: "200px" }}
                        onChange={(e) => {
                          setPaymentType(e.target.value);
                        }}
                        size="small"
                      >
                        <MenuItem value="credit">Credit</MenuItem>
                        <MenuItem value="cash">Cash</MenuItem>
                        {bankData?.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.bank_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    autoFocus
                    variant="contained"
                    className="p-5"
                    color="success"
                    onClick={updatePaymentMode}
                  >
                    Submit
                  </Button>
                  <Button
                    autoFocus
                    variant="contained"
                    onClick={resetAddDialog}
                    color="error"
                  >
                    Cancel
                  </Button>
                </DialogActions>
              </div>
            </div>
          </Dialog>
        </div>
      )}
    </>
  );
};
export default CustomerView;
