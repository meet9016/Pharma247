import React, { useState, useRef, useEffect } from "react";
import { Transition } from "@headlessui/react";
import { FaPlusCircle, FaUserAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { FaBell } from "react-icons/fa";
import { IoCaretDown } from "react-icons/io5";
import { LuLogOut } from "react-icons/lu";
import { FaPowerOff } from "react-icons/fa";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { IconButton, } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { MdWatchLater } from "react-icons/md";
import usePermissions, { hasPermission } from "../componets/permission";
import { toast, ToastContainer } from "react-toastify";
import Search from "./Search";
import { Typography } from "@mui/material";
import { encryptData } from "../componets/cryptoUtils";

const Header = () => {
  const history = useHistory();
  const permissions = usePermissions();
  const [isOpen, setIsOpen] = useState(false);

  const [IsLogout, setIsLogout] = useState(false);
  const [IsClear, setIsClear] = useState(false);
  const dropdownRef = useRef(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [searchPage, setSearchPage] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [notificationsList, setNotificationsList] = useState([],);
  const hoverTimeoutRef = useRef(null);

  /*<=============================================================================== get permissions  ======================================================================> */

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
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
    }
  };

  useEffect(() => {
    // fetchNotification();
  }, []);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    // userPermission(token)

  }, [token]);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);


  const fetchNotification = () => {
    axios
      .get("chemist_notification_list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setNotificationsList(response.data.data);
      })
      .catch((error) => {
        console.error("API Error:", error);
        if (error.response.status == 401) {
          setIsClear(true)
        }
      });
  };

  /*<=============================================================================== logout  ======================================================================> */

  const handleLogout = async () => {
    let data = new FormData();

    try {
      await axios
        .post("log-out", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          localStorage.removeItem("role");
          localStorage.clear();

          history.push("/");
        });

    } catch (error) {
       if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.clear();
        history.push("/");
      }
      console.error("API error:", error);
      setIsClear(true);
    }
  };

  const LogoutOpen = () => {
    setIsLogout(true);
  };

  const LogoutClose = () => {
    setIsLogout(false);
  };

  /*<=============================================================================== toggleDropdown  ======================================================================> */

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const toggleDrawerNotifications = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setNotifications(open);
  };

  /*<==================================================================================== UI  ===========================================================================> */

  return (
    <div>
      <div
        id="modal"
        value={IsLogout}
        className={`fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif] ${IsLogout ? "block" : "hidden"
          }`}
      >
        <div />

        <div className="w-full max-w-md bg-white shadow-lg rounded-md p-4 relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 cursor-pointer absolute top-4 right-4 fill-current text-gray-600 hover:text-black "
            viewBox="0 0 24 24"
            onClick={LogoutClose}
          >
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z" />
          </svg>
          <div className="my-4 logout-icon">
            <FaPowerOff className=" h-10 w-12 text-red-500" />
            <h4 className="text-lg font-semibold mt-6 text-center normal-case">
              Are you sure you want to Logout?
            </h4>
          </div>
          <div className="flex gap-5 justify-center">
            <button
              type="button"
              className="px-6 py-2.5 w-44 rounded-md text-black text-sm font-semibold border-none outline-none bg-gray-200 hover:bg-gray-400 hover:text-black"
              onClick={LogoutClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 w-44 items-center rounded-md text-white text-sm font-semibold border-none outline-none bg-red-500 hover:bg-red-600 active:bg-red-500"
              onClick={handleLogout}
            >
              Logout !
            </button>
          </div>
        </div>
      </div>

      {/*<==================================================================================== UI  ===========================================================================> */}

      <div
        id="modal"
        value={IsClear}
        className={`fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif] ${IsClear ? "block" : "hidden"
          }`}
      >
        <div />
        <div className="w-full max-w-md bg-white shadow-lg rounded-md p-4 relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 cursor-pointer absolute top-4 right-4 fill-current text-gray-600 hover:text-black "
            viewBox="0 0 24 24"
            onClick={() => setIsClear(false)}
          >
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z" />
          </svg>
          <div className="my-4 logout-icon">
            <FaPowerOff className=" h-10 w-12 text-red-500" />
            <h4 className="text-lg font-semibold mt-6 text-center normal-case">
              Login session expired, please logout !
            </h4>
          </div>
          <div className="flex gap-5 justify-center">
            <button
              type="button"
              className="px-6 py-2.5 w-44 rounded-md text-black text-sm font-semibold border-none outline-none bg-gray-200 hover:bg-gray-400 hover:text-black"
              onClick={() => setIsClear(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 w-44 items-center rounded-md text-white text-sm font-semibold border-none outline-none bg-red-500 hover:bg-red-600 active:bg-red-500"
              onClick={() => {
                localStorage.clear();
                history.push("/");
              }}
            >
              Logout !
            </button>
          </div>
        </div>
      </div>
      <nav className="text-sm shadow ">
        <div className="logomenu flex h-14">
          <div className="flex-shrink-0 pr-5 pl-5  sm:flex-wrap">
            <Link to="/adminDashboard">
              <img
                className="h-14 w-28"
                src="../../../pharmalogo.webp"
                alt="Workflow"
              />
            </Link>
          </div>
          {/*<==================================================================================== menu  ===========================================================================> */}

          <div className="w-full mx-auto flex items-center justify-between bg shadow">
            <div className="flex items-center h-12">
              <div className="flex items-center z-10">
                <div className="hidden xl:block ">
                  <div className="ml-10 flex items-baseline space-x-4 ">
                    {/* <TextField value={checkedper} onChange={handleCheck} /> */}
                    {hasPermission(permissions, "Item master view") && (
                      <div>
                        <Link to="/itemMaster">
                          <button
                            className="text-white font-medium letterspace0_5 py-2 px-4 transition-all  primhover hover:rounded-md inline-flex items-center"
                            data-toggle="dropdown"
                          >
                            <span className="mr-1">Item master</span>
                            {/* <FaPlusCircle className="fill-current h-3 w-3 ml-1" /> */}
                          </button>
                        </Link>
                      </div>
                    )}
                    <div>
                      <Link to="/inventory">
                        <button
                          className="text-white font-medium letterspace0_5 py-2 px-4 transition-all  primhover hover:rounded-md  primhover inline-flex items-center"
                          data-toggle="dropdown"
                        >
                          <span href="" className="mr-1">
                            Inventory
                          </span>
                          {/* <FaPlusCircle className="fill-current h-3 w-3 ml-1" /> */}
                        </button>
                      </Link>
                    </div>
                    <div className="dropdown relative ">
                      <button
                        className="text-white font-medium letterspace0_5 py-2 px-4    primhover hover:rounded-md primhover  inline-flex items-center"
                        data-toggle="dropdown"
                      >
                        <span className="mr-1 ">Purchase</span>
                        <FaPlusCircle className="fill-current h-3 w-3 ml-1" />
                      </button>
                      <ul className="dropdown-menu absolute hidden text-gray-700 pt-3 shadow-lg w-48  ">
                        <li className="block flex items-center border-b bg-white hover:bg-[var(--color2)]  hover:text-white">
                          {hasPermission(permissions, "purchase bill view") && (
                            <div className="w-36 border-r">
                              <Link to="/purchase">
                                <span
                                  className="bg-white hover:bg-[var(--color2)]   transition-all py-2 px-4 block whitespace-no-wrap text-black hover:text-white flex"
                                  href=""
                                >
                                  Purchase
                                </span>
                              </Link>
                            </div>
                          )}
                          {/* {permissions.some(permission => permission["purchase bill create"]) && */}
                          {hasPermission(
                            permissions,
                            "purchase bill create"
                          ) && (
                              <div className="">
                                <Link to="/purchaseAdd">
                                  <FaPlusCircle className="fill-current h-3 w-3 ml-4" />
                                </Link>
                              </div>
                            )}
                        </li>
                        <li className="block flex items-center border-b bg-white hover:bg-[var(--color2)]  hover:text-white">
                          {hasPermission(
                            permissions,
                            "purchase return bill view"
                          ) && (
                              <div className="w-36 border-r">
                                <Link to="/purchaseReturn">
                                  <span
                                    className="bg-white hover:bg-[var(--color2)]   transition-all py-2 px-4 block whitespace-no-wrap text-black hover:text-white flex"
                                    href=""
                                  >
                                    Returns
                                  </span>
                                </Link>
                              </div>
                            )}
                          {/* {permissions.some(permission => permission["purchase bill create"]) && */}
                          {hasPermission(
                            permissions,
                            "purchase return bill create"
                          ) && (
                              <div className="">
                                <Link to="/PurchaseReturnAdd">
                                  <FaPlusCircle className="fill-current h-3 w-3 ml-4" />
                                </Link>
                              </div>
                            )}
                        </li>

                        {hasPermission(
                          permissions,
                          "purchase payment view"
                        ) && (
                            <li className="block">
                              <Link to="/paymentList">
                                <span
                                  className="bg-white   hover:bg-[var(--color2)]   transition-all  py-2 px-4 pr-15 block whitespace-no-wrap text-black  hover:text-white flex"
                                  href=""
                                >
                                  Payment
                                </span>
                              </Link>
                            </li>
                          )}
                      </ul>
                    </div>
                    <div className="dropdown relative">
                      <button
                        className="text-white font-medium letterspace0_5 py-2 px-4 transition-all  primhover hover:rounded-md inline-flex items-center"
                        data-toggle="dropdown"
                      >
                        <span className="mr-1">Sales</span>
                        <FaPlusCircle className="fill-current h-3 w-3 ml-1" />
                      </button>
                      <ul className="dropdown-menu absolute hidden text-gray-700 pt-3 shadow-lg w-48">
                        <li className="block flex items-center bg-white border-b-2 hover:bg-[var(--color2)]   hover:text-white">
                          {hasPermission(permissions, "sale bill view") && (
                            <div className="w-36 border-r-2">
                              <Link to="/sale">
                                <span
                                  className="bg-white hover:bg-[var(--color2)]   transition-all py-2 px-4 block whitespace-no-wrap text-black hover:text-white flex"
                                  href=""
                                >
                                  Sales
                                </span>
                              </Link>
                            </div>
                          )}
                          {hasPermission(permissions, "sale bill create") && (
                            <div className="">
                              <Link to="/saleAdd">
                                <FaPlusCircle className="fill-current h-3 w-3 ml-4" />
                              </Link>
                            </div>
                          )}
                        </li>

                        <li className="block flex items-center border-b-2 hover:bg-[var(--color2)]  bg-white  hover:text-white z-10">
                          {hasPermission(
                            permissions,
                            "sale return bill view"
                          ) && (
                              <div className="w-36 border-r-2">
                                <Link to="/saleReturn">
                                  <span
                                    className="bg-white hover:bg-[var(--color2)]   transition-all py-2 px-4 block whitespace-no-wrap text-black hover:text-white flex"
                                    href=""
                                  >
                                    Return
                                  </span>
                                </Link>
                              </div>
                            )}
                          {hasPermission(
                            permissions,
                            "sale return bill create"
                          ) && (
                              <div>
                                <Link to="/saleReturnAdd">
                                  <FaPlusCircle className="fill-current h-3 w-3 ml-4 " />
                                </Link>
                              </div>
                            )}
                        </li>
                      </ul>
                    </div>
                    <div>
                      <Link to="/OrderList">
                        <span
                          href=""
                          className="text-white font-medium letterspace0_5 py-2  primhover  px-4 transition-all  hover:rounded-md inline-flex items-center"
                        >
                          Order List
                        </span>
                      </Link>
                    </div>
                    {/*<==================================================================================== more  ===========================================================================> */}

                    {/* {permissions.some(permission => permission["adjust stock create"]) && */}
                    <div className="dropdown relative">
                      <button
                        className="text-white font-medium letterspace0_5 py-2 px-4 transition-all  primhover hover:rounded-md inline-flex items-center"
                        data-toggle="dropdown"
                      >
                        <span className="mr-1">Mores</span>
                        <FaChevronDown className="fill-current h-4 w-4 ml-1" />
                      </button>
                      <ul className="dropdown-menu absolute hidden text-gray-700 pt-3 shadow-lg w-48">
                        {hasPermission(permissions, "distributor view") && (
                          <li className="block border-b-2">
                            <Link to="/DistributorList">
                              <div>
                                <span
                                  className="bg-white hover:bg-[var(--color2)]   transition-all py-2 px-4 block whitespace-no-wrap  text-black  hover:text-white flex"
                                  href=""
                                >
                                  Distributor
                                </span>
                              </div>
                            </Link>
                          </li>
                        )}

                        <li>
                          <Link to="/company">
                            <li className="block border-b-2">
                              <span
                                className="bg-white hover:bg-[var(--color2)]   transition-all py-2 px-4 block whitespace-no-wrap  text-black  hover:text-white flex"
                                href=""
                              >
                                Company
                              </span>
                            </li>
                          </Link>
                        </li>
                        <li>
                          <Link to="/drugGroup">
                            <li className="block border-b-2">
                              <span
                                className="bg-white hover:bg-[var(--color2)]   transition-all py-2 px-4 block whitespace-no-wrap  text-black  hover:text-white flex"
                                href=""
                              >
                                Drug Group
                              </span>
                            </li>
                          </Link>
                        </li>
                        {hasPermission(permissions, "customer view") && (
                          <Link to="/customer">
                            <li className="block border-b-2">
                              <span
                                className="bg-white hover:bg-[var(--color2)]   transition-all py-2 px-4 block whitespace-no-wrap  text-black  hover:text-white flex"
                                href=""
                              >
                                Customers
                              </span>
                            </li>
                          </Link>
                        )}
                        {hasPermission(permissions, "doctor view") && (
                          <Link to="/doctors">
                            <li className="block border-b-2">
                              <span
                                className="bg-white hover:bg-[var(--color2)]   transition-all py-2 px-4 block whitespace-no-wrap  text-black  hover:text-white flex"
                                href=""
                              >
                                Doctors
                              </span>
                            </li>
                          </Link>
                        )}

                        {hasPermission(permissions, "adjust stock create") && (
                          <li className="block border-b-2">
                            <Link to="/adjustStock">
                              <span
                                className="bg-white hover:bg-[var(--color2)]   transition-all py-2 px-4 block whitespace-no-wrap  text-black  hover:text-white flex"
                                href=""
                              >
                                Adjust stock
                              </span>
                            </Link>
                          </li>
                        )}
                        {hasPermission(permissions, "bank account view") && (
                          <li className="block border-b-2">
                            <Link to="/BankAccountDetails">
                              <span
                                className="bg-white hover:bg-[var(--color2)]   transition-all py-2 px-4 block whitespace-no-wrap  text-black  hover:text-white flex"
                                href=""
                              >
                                Bank Accounts
                              </span>
                            </Link>
                          </li>
                        )}
                        {hasPermission(permissions, "cash management view") && (
                          <li className="block border-b-2">
                            <Link to="/CashManagement">
                              <span
                                className="bg-white hover:bg-[var(--color2)]   transition-all py-2 px-4 block whitespace-no-wrap  text-black  hover:text-white flex"
                                href=""
                              >
                                Cash Management
                              </span>
                            </Link>
                          </li>
                        )}

                        <li className="block border-b-2">
                          <Link to="/reconciliation">
                            <span
                              className="bg-white hover:bg-[var(--color2)]   transition-all py-2 px-4 block whitespace-no-wrap  text-black  hover:text-white flex"
                              href=""
                            >
                              Reconciliation
                            </span>
                          </Link>
                        </li>
                        <li className="block border-b-2">
                          <Link to="/loyaltyPoints">
                            <span
                              className="bg-white hover:bg-[var(--color2)]   transition-all py-2 px-4 block whitespace-no-wrap  text-black  hover:text-white flex"
                              href=""
                            >
                              Loyalty Point
                            </span>
                          </Link>
                        </li>
                        <li className="block border-b-2">
                          <Link to="/sehatPoints">
                            <span
                              className="bg-white hover:bg-[var(--color2)]   transition-all py-2 px-4 block whitespace-no-wrap  text-black  hover:text-white flex"
                              href=""
                            >Sehat Point
                            </span>
                          </Link>
                        </li>
                        <Link to="/reports">
                          <li className="block border-b-2">
                            <span
                              className="bg-white hover:bg-[var(--color2)]   transition-all py-2 px-4 block whitespace-no-wrap  text-black  hover:text-white flex"
                              href=""
                            >
                              Reports
                            </span>
                          </li>
                        </Link>
                        {hasPermission(permissions, "manage expense view") && (
                          <Link to="/expenseManage">
                            <li className="block">
                              <span
                                className="bg-white hover:bg-[var(--color2)]   transition-all py-2 px-4 block whitespace-no-wrap  text-black hover:text-white flex"
                                href=""
                              >
                                Manage Expenses
                              </span>
                            </li>
                          </Link>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/*<============================================================================= order dashboard  ====================================================================> */}


            {/*<==================================================================================== search  ===========================================================================> */}

            <div className="flex items-center justify-end cursor-pointer flex-end">
              <div>
                <div className="text-white mr-4 bg-transparent mr-2">

                  <div>
                    <Link to="/onlineDashboard">
                      <span
                        href=""
                        className="text-white font-semibold py-2  primhover secondary-bg rounded-md   px-4 transition-all  hover:rounded-md inline-flex items-center"
                      >
                        Online Orders
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="hidden xl:flex">
                <div>
                  <div className="text-white mr-4 bg-transparent mr-2">
                    <IoSearch
                      onClick={() => setSearchPage(!searchPage)}
                      style={{ fontSize: "1.5rem" }}
                    />
                    {searchPage && (
                      <Search
                        searchPage={searchPage}
                        setSearchPage={setSearchPage}
                      />
                    )}
                  </div>
                </div>

                {/*<============================================================================= notification  ====================================================================> */}

                <div>
                  <Tooltip title="View Notification">
                    <div
                      className="cart bg-transparent text-white mr-4"
                      onClick={toggleDrawerNotifications(true)}
                    >
                      <FaBell
                        style={{ fontSize: "1.5rem" }}
                        className="bell-hover-animation"
                      />
                    </div>
                  </Tooltip>

                  <Drawer
                    anchor="right"
                    open={notifications}
                    onClose={toggleDrawerNotifications(false)}
                  >

                    {
                      <Box
                        sx={{ width: 400 }}
                        role="presentation"
                        onClick={toggleDrawerNotifications(false)}
                        onKeyDown={toggleDrawerNotifications(false)}
                      >
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          borderBottom="1px solid #628a2f"
                        >
                          <h1 className="text-2xl p-2 primary">
                            Notifications
                          </h1>
                          <div
                            className="flex gap-2"
                            style={{ alignItems: "center" }}
                          >
                            <div>

                            </div>
                            <IconButton
                              onClick={toggleDrawerNotifications(false)}
                              className="close-button"
                            >
                              <CloseIcon className="primary" />
                            </IconButton>
                          </div>
                        </Box>
                        <List sx={{ p: 1 }}>
                          {notificationsList.map((notification) => (
                            <ListItem key={notification.id} disablePadding sx={{ mb: 1 }}>
                              <ListItemButton
                                sx={{
                                  alignItems: "start",
                                  backgroundColor: "#f9f9f9",
                                  borderRadius: 2,
                                  px: 2,
                                  py: 1.5,
                                  boxShadow: 1,
                                  "&:hover": {
                                    backgroundColor: "#eef6e9",
                                    boxShadow: 3,
                                  },
                                }}
                              >
                                <Box>
                                  <Typography variant="body1" className="text-black font-medium" gutterBottom>
                                    {notification.description}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    className="text-gray-500 flex items-center"
                                  >
                                    <MdWatchLater className="mr-1" /> {notification.date}
                                  </Typography>
                                </Box>
                              </ListItemButton>
                            </ListItem>
                          ))}
                        </List>


                        <Divider />
                      </Box>
                    }
                  </Drawer>
                </div>
              </div>
              {/*<==================================================================================== profile  ===========================================================================> */}

              <div className="hidden xl:flex">
                <div>
                  <div
                    className="relative z-10"
                    ref={dropdownRef}
                    onMouseEnter={() => {
                      clearTimeout(hoverTimeoutRef.current);
                      setIsOpen(true);
                    }}
                    onMouseLeave={() => {
                      hoverTimeoutRef.current = setTimeout(() => {
                        setIsOpen(false);
                      }, 200);
                    }}
                  >
                    <div className="flex mr-8 cursor-pointer">

                      <FaUserAlt
                        className="text-white"
                        style={{ fontSize: "1.2rem" }}
                      />
                      <IoCaretDown className="text-white ml-1 mt-1" />
                    </div>
                    {isOpen && (
                      <div className="absolute right-0 top-8 mt-2 w-48 bg-white shadow-lg user-icon mr-4 z-50">
                        <ul className="transition-all">
                          <Link to="/aboutInfo">
                            <li
                              style={{}}
                              className="px-4 py-2 cursor-pointer text-base font-medium flex gap-2 hover:text-[white] hover:bg-[var(--color2)]"
                            >
                              <FaUserAlt style={{ fontSize: "1.2rem" }} />
                              Profile
                            </li>
                          </Link>
                          {token && (
                            <li
                              onClick={LogoutOpen}
                              className="px-4 py-2 cursor-pointer text-base font-medium flex gap-2 hover:text-[white] hover:bg-[var(--color2)]"
                            >
                              <LuLogOut style={{ fontSize: "1.2rem" }} />
                              Logout
                            </li>
                          )}

                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="mr-2 xl:hidden flex">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="bg-transparent inline-flex items-center justify-center p-2 text-white item-3"
              >
                <span className="sr-only">Open main menu</span>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  type="button"
                  className="bg-transparent inline-flex items-center justify-center p-2 text-white"
                >
                  <span className="sr-only">Toggle menu</span>
                  {!isOpen ? (
                    <svg
                      className={`block h-8 w-8 transition duration-300 ease-in-out ${isOpen ? "rotate-90" : "rotate-0"
                        }`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                        className="transition duration-300 ease-in-out"
                      />
                    </svg>
                  ) : (
                    <svg
                      className={`block h-8 w-8 transition duration-300 ease-in-out ${isOpen ? "rotate-90" : "rotate-0"
                        }`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                        className="transition duration-300 ease-in-out"
                      />
                    </svg>
                  )}
                </button>
              </button>
            </div>
          </div>
        </div>
        {/*<==================================================================================== main menu  ===========================================================================> */}

        <Transition
          show={isOpen}
          enter="transition ease-out duration-100 transform"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-75 transform"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          {(ref) => (
            <div className="xl:hidden w-auto " id="mobile-menu">
              <div ref={ref} className="px-2 pt-4 pb-3 space-y-1 sm:px-3 bg">
                {hasPermission(permissions, "Item master view") && (
                  <div>
                    <button
                      style={{ borderBottom: "1px solid rgb(0 0 0 / 40%)" }}
                      className="text-white font-semibold py-2  w-full px-4 transition-all  primhover hover:rounded-md inline-flex items-center"
                      data-toggle="dropdown"
                    >
                      <Link to="/itemMaster">
                        <span href="" className="mr-1">
                          Item master
                        </span>
                      </Link>
                      <FaPlusCircle className="fill-current h-3 w-3 ml-1" />
                    </button>
                  </div>
                )}
                <div>
                  <button
                    style={{ borderBottom: "1px solid rgb(0 0 0 / 40%)" }}
                    className="text-white font-semibold  w-full py-2 px-4 transition-all  primhover hover:rounded-md inline-flex items-center"
                    data-toggle="dropdown"
                  >
                    <Link to="/inventory">
                      <span href="" className="mr-1">
                        Inventory
                      </span>
                    </Link>
                    <FaPlusCircle className="fill-current h-3 w-3 ml-1" />
                  </button>
                </div>
                <div className="dropdown relative ">
                  <button
                    style={{ borderBottom: "1px solid rgb(0 0 0 / 40%)" }}
                    className="text-white font-semibold py-2  w-full  px-4 transition-all  primhover hover:rounded-md inline-flex items-center"
                    data-toggle="dropdown"
                  >
                    <span className="mr-1">Purchase</span>
                    <FaChevronDown className="fill-current h-4 w-4" />
                  </button>
                  <ul className="dropdown-menu hidden text-black pt-3 shadow-lg  right-0 ">
                    <li className="block flex items-center bg-slate-300 border-b border-black justify-evenly">
                      {hasPermission(permissions, "purchase bill view") && (
                        <div className="w-11/12 border-r border-black">
                          <Link to="/purchase">
                            <span
                              className="bg-slate-300 transition-all py-2  px-4 block  text-black text-black flex"
                              href=""
                            >
                              Purchase
                            </span>
                          </Link>
                        </div>
                      )}
                      {hasPermission(permissions, "purchase bill create") && (
                        <div className="">
                          <Link to="/purchaseAdd">
                            <FaPlusCircle className="fill-current h-3 w-3" />
                          </Link>
                        </div>
                      )}
                    </li>
                    <li className="block flex items-center border-b border-black bg-slate-300 transition-all  text-black justify-evenly">
                      {hasPermission(
                        permissions,
                        "purchase return bill view"
                      ) && (
                          <div className="w-11/12 border-r border-black">
                            <Link to="/purchaseReturn">
                              <span
                                className="bg-slate-300  py-2 px-4 pr-12 block  text-black flex"
                                href=""
                              >
                                Returns
                              </span>
                            </Link>
                          </div>
                        )}
                      {hasPermission(
                        permissions,
                        "purchase return bill create"
                      ) && (
                          <div>
                            <Link to="/PurchaseReturnAdd">
                              <FaPlusCircle className="fill-current h-3 w-3 text-black" />
                            </Link>
                          </div>
                        )}
                    </li>
                    {hasPermission(permissions, "purchase payment view") && (
                      <li className="block">
                        <div className="bg-slate-300 transition-all  py-2 px-4 pr-15 block whitespace-no-wrap text-black flex justify-center">
                          <Link to="/paymentList">
                            <span>Payment</span>
                          </Link>
                        </div>
                      </li>
                    )}
                  </ul>
                </div>
                <div className="dropdown relative">
                  <button
                    style={{ borderBottom: "1px solid rgb(0 0 0 / 40%)" }}
                    className="text-white font-semibold py-2  w-full px-4 transition-all  primhover hover:rounded-md inline-flex items-center"
                    data-toggle="dropdown"
                  >
                    <span className="mr-1">Sales</span>
                    <FaChevronDown className="fill-current h-4 w-4" />
                  </button>
                  <ul className="dropdown-menu hidden text-black pt-3 shadow-lg  right-0">
                    <li className="block flex items-center bg-slate-300 border-b border-black justify-evenly">
                      {hasPermission(permissions, "sale bill view") && (
                        <div className="w-11/12 border-r border-black ">
                          <Link to="/sale">
                            <span
                              className="bg-slate-300  py-2 px-4 pr-12 block whitespace-no-wrap  text-black flex"
                              href=""
                            >
                              Sales
                            </span>
                          </Link>
                        </div>
                      )}
                      {hasPermission(permissions, "sale bill create") && (
                        <div className="">
                          <Link to="/saleAdd">
                            <FaPlusCircle className="fill-current h-3 w-3 " />
                          </Link>
                        </div>
                      )}
                    </li>

                    <li className="block flex items-center  bg-slate-300 transition-all  text-black  justify-evenly">
                      {hasPermission(permissions, "sale return bill view") && (
                        <div className="w-11/12 border-r border-black ">
                          <Link to="/saleReturn">
                            <span
                              className="bg-slate-300  py-2 px-4 pr-12 block whitespace-no-wrap  text-black flex"
                              href=""
                            >
                              Return
                            </span>
                          </Link>
                        </div>
                      )}
                      {hasPermission(
                        permissions,
                        "sale return bill create"
                      ) && (
                          <div>
                            <Link to="/saleReturnAdd">
                              <FaPlusCircle className="fill-current h-3 w-3 " />
                            </Link>
                          </div>
                        )}
                    </li>
                  </ul>
                </div>
                <div>
                  <Link to="/OrderList">
                    <span
                      style={{ borderBottom: "1px solid rgb(0 0 0 / 40%)" }}
                      href=""
                      className="text-white font-semibold w-full  py-2  primhover  px-4 transition-all  hover:rounded-md inline-flex items-center"
                    >
                      Order List
                    </span>
                  </Link>
                </div>
                {hasPermission(permissions, "adjust stock create") && (
                  <div>
                    <Link to="/adjustStock">
                      <span
                        style={{ borderBottom: "1px solid rgb(0 0 0 / 40%)" }}
                        href=""
                        className="text-white font-semibold  w-full  py-2  primhover  px-4 transition-all  hover:rounded-md inline-flex items-center"
                      >
                        Adjust Stock
                      </span>
                    </Link>
                  </div>
                )}

                <div className="dropdown relative">
                  <button
                    style={{ borderBottom: "1px solid rgb(0 0 0 / 40%)" }}
                    className="text-white font-semibold   w-full  py-2 px-4 transition-all  primhover hover:rounded-md inline-flex items-center"
                    data-toggle="dropdown"
                  >
                    <span className="mr-1">Mores</span>
                    <FaChevronDown className="fill-current h-4 w-4 ml-1" />
                  </button>
                  <ul className="dropdown-menu hidden text-black pt-3 shadow-lg  right-0">
                    {hasPermission(permissions, "distributor view") && (
                      <li className="block border-b border-black">
                        <Link to="/DistributorList">
                          <div>
                            <span
                              className="bg-slate-300  py-2 px-4 pr-12 block whitespace-no-wrap  text-black flex"
                              href=""
                            >
                              Distributor
                            </span>
                          </div>
                        </Link>
                      </li>
                    )}

                    <li>
                      <Link to="/company">
                        <li className="block border-b border-black">
                          <span
                            className="bg-slate-300  py-2 px-4 pr-12 block whitespace-no-wrap  text-black flex"
                            href=""
                          >
                            Company
                          </span>
                        </li>
                      </Link>
                    </li>
                    <li>
                      <Link to="/drugGroup">
                        <li className="block border-b border-black">
                          <span
                            className="bg-slate-300  py-2 px-4 pr-12 block whitespace-no-wrap  text-black flex"
                            href=""
                          >
                            Drug Group
                          </span>
                        </li>
                      </Link>
                    </li>
                    {hasPermission(permissions, "customer view") && (
                      <Link to="/customer">
                        <li className="block border-b border-black">
                          <span
                            className="bg-slate-300  py-2 px-4 pr-12 block whitespace-no-wrap  text-black flex"
                            href=""
                          >
                            Customers
                          </span>
                        </li>
                      </Link>
                    )}
                    {hasPermission(permissions, "doctor view") && (
                      <Link to="/doctors">
                        <li className="block border-b border-black">
                          <span
                            className="bg-slate-300  py-2 px-4 pr-12 block whitespace-no-wrap  text-black flex"
                            href=""
                          >
                            Doctors
                          </span>
                        </li>
                      </Link>
                    )}
                    {hasPermission(permissions, "bank account view") && (
                      <li className="block border-b border-black">
                        <Link to="/BankAccountDetails">
                          <span
                            className="bg-slate-300  py-2 px-4 pr-12 block whitespace-no-wrap  text-black flex"
                            href=""
                          >
                            Bank Accounts
                          </span>
                        </Link>
                      </li>
                    )}
                    {hasPermission(permissions, "cash management view") && (
                      <li className="block border-b border-black">
                        <Link to="/CashManagement">
                          <span
                            className="bg-slate-300  py-2 px-4 pr-12 block whitespace-no-wrap  text-black flex"
                            href=""
                          >
                            Cash Management
                          </span>
                        </Link>
                      </li>
                    )}

                    <li className="block border-b border-black">
                      <Link to="/reconciliation">
                        <span
                          className="bg-slate-300  py-2 px-4 pr-12 block whitespace-no-wrap  text-black flex"
                          href=""
                        >
                          Reconciliation
                        </span>
                      </Link>
                    </li>
                    <li className="block border-b border-black">
                      <Link to="/loyaltyPoints">
                        <span
                          className="bg-slate-300  py-2 px-4 pr-12 block whitespace-no-wrap  text-black flex"
                          href=""
                        >Loyalty Point
                        </span>
                      </Link>
                    </li>
                    <li className="block border-b border-black">
                      <Link to="/sehatPoints">
                        <span
                          className="bg-slate-300  py-2 px-4 pr-12 block whitespace-no-wrap  text-black flex"
                          href=""
                        >Sehat Point
                        </span>
                      </Link>
                    </li>
                    <Link to="/reports">
                      <li className="block border-b border-black">
                        <span
                          className="bg-slate-300  py-2 px-4 pr-12 block whitespace-no-wrap  text-black flex"
                          href=""
                        >
                          Reports
                        </span>
                      </li>
                    </Link>

                    {hasPermission(permissions, "manage expense view") && (
                      <Link to="/expenseManage">
                        <li className="block">
                          <span
                            className="bg-slate-300  py-2 px-4 pr-12 block whitespace-no-wrap  text-black flex"
                            href=""
                          >
                            Manage Expenses
                          </span>
                        </li>
                      </Link>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </Transition>
      </nav>
    </div>
  );
};

export default Header;
