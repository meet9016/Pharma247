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

const ReportsMain = () => {
  const [open, setOpen] = useState(false);
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

  const toggleFavorite = (report) => {
    const newFavorites = favorites.includes(report.name)
      ? favorites.filter((item) => item !== report.name)
      : [...favorites, report.name];
    updateFavorites(newFavorites);
  };

  return (
    <div>
      <Header />
      <Box className="flex flex-wrap">
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
          {hasPermission(permissions, "report accounting") && (
            <Accordion className="customreportasccordion">
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
                  {/* <img src={AccouaccountingIcon} className="reportMain-icon absolute mr-10" alt="Accounting Icon"></img> */}
                  <Box
                    component="img"
                    src={AccouaccountingIcon}
                    alt="Accounting "
                    sx={{
                      position: "absolute",
                      left: 0,
                      width: {
                        xs: "30px",
                        sm: "35px",
                      },
                      height: {
                        xs: "36px",
                        sm: "41px",
                      },
                    }}
                    className="reportMain-icon"
                  />
                  Accounting Reports
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormControl sx={{ width: "100%", paddingX: "20px" }}>
                  {accountingReport.map((report) => (
                    <ul className="hover-report" key={report.name}>
                      <li
                        onClick={() => history.push(report.path)}
                        className="font-semibold p-2 cursor-pointer flex justify-between"
                      >
                        <div
                          style={{ paddingLeft: "23px", whiteSpace: "noWrap" }}
                          sx={{
                            fontSize: {
                              xs: "15px",
                              sm: "16px",
                            },
                          }}
                        >
                          {report.name}
                        </div>
                        <span
                          className="heart-icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(report);
                          }}
                        >
                          {favorites.includes(report.name) ? (
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
          )}

          {hasPermission(permissions, "report stock") && (
            <Accordion className="customreportasccordion">
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
                  {/* <img src={StockIcon} className="reportMain-icon absolute mr-10" alt="Stock Icon"></img> */}
                  <Box
                    component="img"
                    src={StockIcon}
                    alt="Stock "
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
                    className="reportMain-icon"
                  />
                  Stock Reports
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormControl sx={{ width: "100%", paddingX: "20px" }}>
                  {stockReports.map((report) => (
                    <ul className="hover-report" key={report.name}>
                      <li
                        onClick={() => history.push(report.path)}
                        className="font-semibold p-2 cursor-pointer flex justify-between"
                      >
                        <div
                          style={{ paddingLeft: "23px", whiteSpace: "noWrap" }}
                        >
                          {report.name}
                        </div>
                        <span
                          className="heart-icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(report);
                          }}
                        >
                          {favorites.includes(report.name) ? (
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
          )}

          {hasPermission(permissions, "report margin") && (
            <Accordion className="customreportasccordion">
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
                  {/* <img src={MarginIcon} className="reportMain-icon absolute mr-10" alt="Margin Icon"></img> */}
                  <Box
                    component="img"
                    src={MarginIcon}
                    alt="Margin "
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
                    className="reportMain-icon"
                  />
                  Margin Reports
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormControl sx={{ width: "100%", paddingX: "20px" }}>
                  {marginReports.map((report) => (
                    <ul className="hover-report" key={report.name}>
                      <li
                        onClick={() => history.push(report.path)}
                        className="font-semibold p-2 cursor-pointer flex justify-between"
                      >
                        <div
                          style={{ paddingLeft: "23px", whiteSpace: "noWrap" }}
                          sx={{
                            fontSize: {
                              xs: "15px",
                              sm: "16px",
                            },
                          }}
                        >
                          {report.name}
                        </div>
                        <span
                          className="heart-icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(report);
                          }}
                        >
                          {favorites.includes(report.name) ? (
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
          )}
          {hasPermission(permissions, "report entelligent") && (
            <Accordion className="customreportasccordion">
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
                    textTransform: "none",
                    fontWeight: "500",
                    position: "relative",
                    paddingLeft: "50px",
                  }}
                >
                  {/* <img src={ENtelligentIcon} className="reportMain-icon absolute mr-10" alt="eNtelligent Icon"></img> */}
                  <Box
                    component="img"
                    src={ENtelligentIcon}
                    alt="eNtelligent Icon"
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
                    className="reportMain-icon"
                  />
                  Sales Insights
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormControl sx={{ width: "100%", paddingX: "20px" }}>
                  {eNtelligentReports.map((report) => (
                    <ul className="hover-report" key={report.name}>
                      <li
                        onClick={() => history.push(report.path)}
                        className="font-semibold p-2 cursor-pointer flex justify-between"
                      >
                        <div
                          style={{ paddingLeft: "23px", whiteSpace: "noWrap" }}
                          sx={{
                            fontSize: {
                              xs: "15px",
                              sm: "16px",
                            },
                          }}
                        >
                          {report.name}
                        </div>
                        <span
                          className="heart-icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(report);
                          }}
                        >
                          {favorites.includes(report.name) ? (
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
          )}

          {hasPermission(permissions, "report gst") && (
            <Accordion className="customreportasccordion">
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
                  {/* <img src={GSTIcon} className="reportMain-icon absolute mr-10" alt="GST Icon" /> */}
                  <Box
                    component="img"
                    src={GSTIcon}
                    alt="GST Icon"
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
                    className="reportMain-icon"
                  />
                  GST Reports
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormControl sx={{ width: "100%", paddingX: "20px" }}>
                  <div>
                    {gstReports.map((report) => (
                      <ul className="hover-report" key={report}>
                        <li
                          onClick={() => history.push(report.path)}
                          className="font-semibold p-2 cursor-pointer flex justify-between"
                        >
                          <div
                            style={{
                              paddingLeft: "23px",
                              whiteSpace: "noWrap",
                            }}
                            sx={{
                              fontSize: {
                                xs: "15px",
                                sm: "16px",
                              },
                            }}
                          >
                            {report.name}
                          </div>
                          <span
                            className="heart-icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(report);
                            }}
                          >
                            {favorites.includes(report.name) ? (
                              <FavoriteIcon />
                            ) : (
                              <FavoriteBorderIcon />
                            )}
                          </span>
                        </li>
                      </ul>
                    ))}
                  </div>
                </FormControl>
              </AccordionDetails>
            </Accordion>
          )}

          {hasPermission(permissions, "report others") && (
            <Accordion className="customreportasccordion">
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography
                  sx={{
                    my: 0,
                    fontSize: {
                      xs: "15px",
                      sm: "17px",
                      md: "19px",
                    },
                    whiteSpace: "noWrap",
                    fontWeight: "500",
                    position: "relative",
                    paddingLeft: "50px",
                  }}
                >
                  {/* <img src={OtherIcon}className="reportMain-icon absolute mr-10" alt="Other Icon"></img> */}
                  <Box
                    component="img"
                    src={OtherIcon}
                    alt="Other "
                    sx={{
                      position: "absolute",
                      left: 0,
                      width: {
                        xs: "30px",
                        sm: "35px",
                      },
                      height: {
                        xs: "30px",
                        sm: "39px",
                      },
                    }}
                    className="reportMain-icon"
                  />
                  MIS reports
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormControl sx={{ width: "100%", paddingX: "20px" }}>
                  {othersReports.map((report) => (
                    <ul className="hover-report" key={report.name}>
                      <li
                        onClick={() => history.push(report.path)}
                        className="font-semibold p-2 cursor-pointer flex justify-between"
                      >
                        <div
                          style={{ paddingLeft: "23px", whiteSpace: "noWrap" }}
                          sx={{
                            fontSize: {
                              xs: "15px",
                              sm: "16px",
                            },
                          }}
                        >
                          {report.name}
                        </div>
                        <span
                          className="heart-icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(report);
                          }}
                        >
                          {favorites.includes(report.name) ? (
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
          )}

          {/* <Divider /> */}
        </Box>
        <Box sx={{ flex: 1, overflow: "auto", padding: "16px" }}>
          <div className="p-2" style={{ width: "100%" }}>
            {favorites.length > 0 ? (
              <>
                <h1 className="text-2xl mb-8 primary font-semibold">
                  Favourite Reports
                </h1>

                <ul className="flex flex-wrap gap-4 p-8">
                  {favorites.map((favorite) => {
                    const report = combinedReports.find(
                      (r) => r.name === favorite
                    );
                    return (
                      <li
                        key={favorite}
                        className="font-semibold report_main_card"
                      >
                        <div
                          className="custom-box-report"
                          onClick={() => history.push(report.path)}
                        >
                          <img
                            src={report?.icon}
                            className="w-1/2"
                            alt="Report "
                          />
                          <span className="font-semibold text-sm">
                            {favorite}
                          </span>
                        </div>
                      </li>
                    );
                  })}
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
