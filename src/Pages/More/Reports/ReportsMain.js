import Header from "../../Header";
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  FormControl,
  Divider,
} from "@mui/material";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { BsLightbulbFill } from "react-icons/bs";
import { useState, useEffect } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import usePermissions, { hasPermission } from "../../../componets/permission";
import axios from "axios";

const ReportsMain = () => {
  const [open, setOpen] = useState(false);












  const [reportTitles, setReportTitles] = useState([]);
  const token = localStorage.getItem("token");
  const getReportTitles = () => {
    axios
      .get("report-titles", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setReportTitles(response.data.data);
      })
      .catch((error) => {
        if (error?.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          localStorage.removeItem("role");
          localStorage.clear();
          history.push("/");
        }

        console.log(error);
      });
  };

  useEffect(() => {
    getReportTitles();

    getFavoriteReports();
  }, []);


  const updateFavoriteStatus = (subTitle) => {

    const isFavorite = subTitle.status;

    const status = isFavorite ? 0 : 1;

    axios
      .post(
        `report-sub-titles-add-data?sub_title_id=${subTitle.id}&status=${status}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        if (response.data.status === 200) {
          getReportTitles();
          getFavoriteReports();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };


  const [favoriteReports, setFavoriteReports] = useState([]);

  const getFavoriteReports = () => {
    axios
      .get("report-sub-titles-get-data", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setFavoriteReports(response.data.data || []);
      })
      .catch((error) => {
        console.log(error);
      });
  };


















  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  const history = useHistory();
  const permissions = usePermissions();

  const GSTIcon = `${process.env.PUBLIC_URL}/gsticon.png`;
  const MarginIcon = `${process.env.PUBLIC_URL}/marginIcon.png`;
  const StockIcon = `${process.env.PUBLIC_URL}/stockIcon.png`;
  const OtherIcon = `${process.env.PUBLIC_URL}/othersIcon1.png`;
  const ENtelligentIcon = `${process.env.PUBLIC_URL}/entelligentIcon1.png`;
  const AccouaccountingIcon = `${process.env.PUBLIC_URL}/accountingIcon1.png`;

  const [favorites, setFavorites] = useState([]);














  const gstReports = [
    // { name: 'Purchase Register', path: '/gst-purchase-register', icon: GSTIcon },
    {
      name: "Purchase Bills",
      path: "/gst-purchase-bills",
      icon: GSTIcon,
    },
    // { name: 'Sales Register', path: '/gst-sales-register', icon: GSTIcon },
    { name: "Sales Bill", path: "/gst-sales-bills", icon: GSTIcon },
    {
      name: "Day wise Summary",
      path: "/day-wise-summary",
      icon: GSTIcon,
    },
    { name: "GSTR-1", path: "/gst-GSTR1", icon: GSTIcon },
    { name: "GSTR-2", path: "/gst-GSTR2", icon: GSTIcon },
    { name: "GSTR-3B", path: "/gst-GSTR-3B", icon: GSTIcon },

    { name: "HSN wise GST", path: "/gst-hsn-wise", icon: GSTIcon },
    // { name: 'Composition GST Report', path: '/margin-report/itemWise', icon: GSTIcon },
  ];
  const stockReports = [
    {
      name: "Purchase Return Report",
      path: "/stock-purchase-return-report",
      icon: StockIcon,
    },
    {
      name: "Non-Moving Items",
      path: "/stock-non-moving",
      icon: StockIcon,
    },
    {
      name: "Item-Batch wise Stock",
      path: "/stock-item-batchwise",
      icon: StockIcon,
    },
    {
      name: "Stock Adjustment",
      path: "/stock-stock-adjustment",
      icon: StockIcon,
    },
    {
      name: "Inventory Reconciliation",
      path: "/stock-inventory-reconciliation",
      icon: StockIcon,
    },
    {
      name: "Expiring Items",
      path: "/stock-expiring-items",
      icon: StockIcon,
    },
  ];

  const othersReports = [
    {
      name: "Doctor - Item Summary",
      path: "/others-item-doctor-wise",
      icon: OtherIcon,
    },
    {
      name: "Company Items Analysis",
      path: "/others-company-items-analysis",
      icon: OtherIcon,
    },
    {
      name: "Staff Wise Activity Summary",
      path: "/others-staff-wise-activity-summary",
      icon: OtherIcon,
    },
    {
      name: "Sales Summary Report",
      path: "/others-sales-summary-report",
      icon: OtherIcon,
    },
  ];

  const eNtelligentReports = [
    {
      name: "Monthly Sales Overview",
      path: "/monthly-sales-overview",
      icon: ENtelligentIcon,
    },
    {
      name: "Top Selling Items",
      path: "/top-selling-items",
      icon: ENtelligentIcon,
    },
    {
      name: "Top Customers",
      path: "/top-customers",
      icon: ENtelligentIcon,
    },
    {
      name: "Top Distributors",
      path: "/top-distributors",
      icon: ENtelligentIcon,
    },
  ];

  const accountingReport = [
    {
      name: "Purchase Payment Summary",
      path: "/account-purchase-payment-summary",
      icon: AccouaccountingIcon,
    },
  ];

  const marginReports = [
    {
      name: "Item wise Margin",
      path: "/itemWise",
      icon: MarginIcon,
    },
    {
      name: "Bill-Item wise Margin",
      path: "/bill-item-wise-margin",
      icon: MarginIcon,
    },
  ];



  const combinedReports = [
    ...gstReports,
    ...marginReports,
    ...accountingReport,
    ...stockReports,
    ...eNtelligentReports,
    ...othersReports,
  ];



  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // Function to update both state and local storage
  const updateFavorites = (newFavorites) => {
    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  // const toggleFavorite = (report) => {
  //   const newFavorites = favorites.includes(report.name)
  //     ? favorites.filter((item) => item !== report.name)
  //     : [...favorites, report.name];
  //   updateFavorites(newFavorites);
  // };
  const toggleFavorite = (report) => {
    const reportName = report.sub_title_name || report.name;

    const newFavorites = favorites.includes(reportName)
      ? favorites.filter((item) => item !== reportName)
      : [...favorites, reportName];

    updateFavorites(newFavorites);
  };







  return (
    <div
      style={{
        height: "100vh",
        overflow: "hidden",
      }}>
      <Header />

      <Box className="flex flex-wrap"
        sx={{
          height: "calc(100vh - 64px)",
          overflow: "hidden",
        }}
      >
        <Box
          className="custom-scroll"
          sx={{
            width: {
              xs: "100%",
              sm: "100%",
              md: "38%",
              lg: "30%",
              xl: "22%",
            },
            height: {
              xs: "fit-content",
              sm: "fit-content",
              md: "calc(99.9vh - 0px)",
            },
            position: {
              xs: "static",
              md: "sticky",
            },
            top: {
              xs: "unset",
              md: "0%",
            },
            overflowY: "auto",
            overflowX: "hidden",
            padding: "24px",
          }}
          role="presentation"
          onClick={() => toggleDrawer(false)}
        >
          <Box>
            <h1 className="text-2xl flex items-center justify-start font-semibold mb-4 primary">
              Reports
              <BsLightbulbFill className="ml-4 secondary hover-yellow" />
            </h1>
          </Box>














          {reportTitles.map((report) => (
            <Accordion
              key={report.id}
              className="customreportasccordion"
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography
                  sx={{
                    my: 0,
                    fontSize: {
                      xs: "15px",
                      sm: "17px",
                      md: "18px",
                    },
                    whiteSpace: "noWrap",
                    fontWeight: "500",
                    position: "relative",
                    paddingLeft: "50px",
                  }}
                >
                  <Box
                    component="img"
                    src={report.icon}
                    alt={report.title}
                    sx={{
                      position: "absolute",
                      left: 0,
                      width: {
                        xs: "30px",
                        sm: "35px",
                      },
                      height: {
                        xs: "30px",
                        sm: "35px",
                      },
                    }}
                  />

                  {report.title}
                </Typography>
              </AccordionSummary>

              <AccordionDetails>
                <FormControl
                  sx={{
                    width: "100%",
                    paddingX: "20px",
                  }}
                >
                  {report.sub_titles?.map((subTitle) => (
                    <ul
                      className="hover-report"
                      key={subTitle.id}
                    >
                      <li
                        className="font-semibold p-2 cursor-pointer flex justify-between"
                      >
                        <div
                          style={{
                            paddingLeft: "23px",
                            whiteSpace: "noWrap",
                          }}
                        >
                          {subTitle.sub_title_name}
                        </div>

                        <span
                          className="heart-icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateFavoriteStatus(subTitle);
                          }}
                        >
                          {/* {favorites.includes(
                            subTitle.sub_title_name
                          ) ? (
                            <FavoriteIcon />
                          ) : (
                            <FavoriteBorderIcon />
                          )} */}
                          {subTitle.status ? (
                            <FavoriteIcon />
                          ) : (
                            <FavoriteBorderIcon />
                          )}
                        </span>
                      </li>
                    </ul>
                  ))}
                </FormControl>
              </AccordionDetails>
            </Accordion>
          ))}

          {/* <Divider /> */}
        </Box>
        <Box sx={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          height: "calc(100vh - 64px)",
          padding: "16px",
        }}>
          <div className="p-2" style={{ width: "100%" }}>
            {favoriteReports.length > 0 ? (
              <>
                <h1 className="text-2xl mb-8 primary font-semibold">
                  Favourite Reports
                </h1>

                <ul className="flex flex-wrap gap-4 p-0">
                  {favoriteReports.map((favorite) => (
                    <li
                      key={favorite.id}
                      className="font-semibold report_main_card"
                    >
                      <div className="custom-box-report" onClick={() => history.push(`/${favorite.path}`)}>
                        <img
                          src={favorite.icon}
                          className="w-1/2"
                          alt="Report"
                        />

                        <span className="font-semibold text-sm">
                          {favorite.sub_title_name}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <>
                <p
                  className="text-7xl w-full tracking-wide font-bold  my-20"
                  style={{ color: "rgba(17, 17, 17, .1)" }}
                >
                  Favorite Reports & Save Time
                </p>
                <p
                  className="mt-4 text-xl tracking-wide gap-2"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <FavoriteIcon className="text-red-500" />
                  Mark reports as favorites to access them faster.
                </p>
              </>
            )}
          </div>
        </Box>
      </Box>

    </div>
  );
};

export default ReportsMain;
