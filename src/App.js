import './App.css';
import Dashboard from './Pages/Dashboard';
import Adminprotected from './protected/AdminProtect';
import Package from './Pages/More/Package/Package';
import Protected from './protected/Protected';
// import Purchasereturn from './Pages/Purchase/Purchasereturn';
import SaleView from './Pages/Sale/SaleBill/saleView/SaleView';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation
} from "react-router-dom/cjs/react-router-dom.min";
// import AddPurchaseReturn from './Pages/Purchase/AddPurchaseReturn';
import Catagory from './Pages/More/Catagory/Catagory';
import Itemmaster from './Pages/ItemMaster/Itemmaster';
import PurchaseView from './Pages/Purchase/PurchaseBill/Purchase-View/Purchase_View';
import DistributerView from './Pages/More/Distributor/Distributer-View/DistributerView';
import PurchaseList from './Pages/Purchase/PurchaseBill/PurchaseBillList/PurchaseList';
import EditPurchaseBill from './Pages/Purchase/PurchaseBill/Edit-PurchaseBill/EditPurchaseBill';
import ReturnList from './Pages/Purchase/ReturnBill/ReturnList/ReturnList';
import ReturnView from './Pages/Purchase/ReturnBill/ReturnBill-View/ReturnBill-View';
import AddReturnbill from './Pages/Purchase/ReturnBill/Add-ReturnBill/AddReturnbill';
import SalereturnList from './Pages/Sale/saleReturnBill/ReturnList/SalereturnList';

import InventoryView from './Pages/Inventory/InventoryView/InventoryView';
import InventoryList from './Pages/Inventory/InventoryList/inventoryList';
import AddPurchaseBill from './Pages/Purchase/PurchaseBill/Add-PurchaseBill/AddPurchasebill';
import EditReturnBill from './Pages/Purchase/ReturnBill/Edit-ReturnBill/EditReturnBill';
import PaymentList from './Pages/Purchase/Payment/PaymentList/paymentList';
import AddDistributer from './Pages/More/Distributor/AddDistributer/AddDistributer';
import DistributerList from './Pages/More/Distributor/DistriubutorList/DistributorList';
import ProfileView from './Pages/profile/ProfileView';
import CustomerList from './Pages/More/Customer/CustomerList/CustomerList';
import DoctorList from './Pages/More/Doctor/DoctorList/doctorList';
import DoctorView from './Pages/More/Doctor/DoctorView/doctorView';
import Salelist from './Pages/Sale/SaleBill/SaleList/Salelist';
import Addsale from './Pages/Sale/SaleBill/AddSale/Addsale';
import EditSaleBill from './Pages/Sale/SaleBill/Edit-SaleBill/EditSaleBill';
import CustomerView from './Pages/More/Customer/CustomerList/CustomerView/CustomerView';
import SaleReturnView from './Pages/Sale/saleReturnBill/ReturnView/SaleReturnView';
import Salereturn from './Pages/Sale/saleReturnBill/AddReturn/AddSaleReturnbill';
import EditSaleReturn from './Pages/Sale/saleReturnBill/EditReturn/EditSaleReturn';
import ReportsMain from './Pages/More/Reports/ReportsMain';
import OrderList from './Pages/OrderList/OrderList';
import CashManage from './Pages/More/CashManagement/CashManage';
import ManageExpense from './Pages/More/ManageExpense/manageExpenseList';
import BankAccount from './Pages/More/BankAccounts/BankAccount';
import ItemWiseMargin from './Pages/More/Reports/MarginReport/ItemWiseMargin';
import BillItemWiseMargin from './Pages/More/Reports/MarginReport/BillItemWiseMargin';
import PurchaseRegister from './Pages/More/Reports/GstReport/PurchaseRegister';
import AdjustStock from './Pages/More/AdjustStock/AdjustStock';
import SalesBill from './Pages/More/Reports/GstReport/SalesBill';
import PurchaseBillReport from './Pages/More/Reports/GstReport/PurchaseBill_Report';
import DayWiseSummary from './Pages/More/Reports/GstReport/DayWiseSummary';
import PurchasePaymentSummary from './Pages/More/Reports/AccountingReports/Purchase_Payment_summary';
import DoctorItemWise from './Pages/More/Reports/Others/DoctorItemWise';
import CompanyItemWise from './Pages/More/Reports/Others/CompanyItemWise';
import StaffWiseActivity from './Pages/More/Reports/Others/Staff_Wise_Activity';
import SaleSummary from './Pages/More/Reports/Others/SaleSummary';
import Inventory_Reconciliation from './Pages/More/Reports/StockReport/Inventory_Reconciliation';
import Expiring_Items from './Pages/More/Reports/StockReport/Expiring_Items';

import Item_Batch_wiseStock from './Pages/More/Reports/StockReport/Item_Batch_wiseStock';
import Non_Moving_items from './Pages/More/Reports/StockReport/Non_Moving_Items';
import Stock_AdjustMent_Report from './Pages/More/Reports/StockReport/Stock_AdjustMent_Report';
import Purchase_Return_Report from './Pages/More/Reports/StockReport/Purchase_Return_Report';
import Monthly_sales_Overview from './Pages/More/Reports/eNteligentReport/Monthly_sales_Overview';
import Top_Selling_Items from './Pages/More/Reports/eNteligentReport/Top_Selling_Items';
import Top_Customers from './Pages/More/Reports/eNteligentReport/Top_Customers';
import Top_Distributor from './Pages/More/Reports/eNteligentReport/Top_Distributors';
import HsnWiseGst from './Pages/More/Reports/GstReport/HsnWiseGst';
import Gstr1 from './Pages/More/Reports/GstReport/Gstr1';
import Gstr_3B from './Pages/More/Reports/GstReport/Gstr_3B';
import AboutInfo from './Pages/profile/About/AboutInfo';
import Documents from './Pages/profile/About/Documents';
import ReferEarn from './Pages/profile/About/ReferEarn';
import Plans from './Pages/profile/About/Plans';
import Password from './Pages/profile/About/Password';
import StaffMember from './Pages/profile/Staff-Sessions/StaffMember';
import ManageStaffRole from './Pages/profile/Staff-Sessions/ManageStaffRole';
import CreateRole from './Pages/profile/Staff-Sessions/Create-Role/CreateRole';
import ErrorPage from './componets/ErrorPage/errorPage';
import { ProtectedComponent, ProtectedRoute } from './componets/permission';
import Company from './Pages/More/Company/Company';
import DrugGroup from './Pages/More/DrugGroup/DrugGroup';
import LogActivity from './Pages/profile/Staff-Sessions/LogActivity';
import Gstr2 from './Pages/More/Reports/GstReport/Gstr2';
import Reconciliation from './Pages/More/Reconciliation/reconciliation';
import ReconciliationManage from './Pages/profile/Staff-Sessions/ReconciliationManage';
import LoyaltyPoint from './Pages/More/LoyaltyPoint/LoyaltyPoint';

import CssBaseline from '@mui/material/CssBaseline'; // Reset default styles
// import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@material-tailwind/react';
import theme from './theme';
import { useEffect } from 'react';
import OnlineOrders from './Pages/profile/Settings/OnlineOrders';
import LoginSignup from './componets/Login/LoginSignup';
import OnlineDashboard from './OnlineOrders/OnlineDashboard';
import DrugGroupView from './Pages/More/DrugGroup/DrugGroupView/DrugGroupView';
import TrialEnd from './componets/Login/TrialEnd';
import SehatMembersList from './Pages/More/SehatPoints/SehatMembersList';
import SehatView from './Pages/More/SehatPoints/SehatView';

function TitleUpdater() {
  const location = useLocation();

  useEffect(() => {
    const pathName = location.pathname;
    let title = "";

    const segments = pathName.split('/').filter(Boolean);

    let targetSegment = segments.length > 0 ? segments[0] : "Login";
    targetSegment = targetSegment.replace(/%20|_|-/g, ' ');
    targetSegment = decodeURIComponent(targetSegment);
    targetSegment = targetSegment.replace(/([a-z])([A-Z])/g, '$1 $2');
    title = targetSegment.split(' ').map(word => word ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : '').join(' ');

    document.title = `${title}`;
  }, [location]);

  return null;
}

function App() {
  const goFullScreen = () => {
    const elem = document.documentElement;

    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen(); // Safari
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen(); // IE11
    }
  };

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
    /* ================================
          CUSTOM DIALOG SCOPED STYLES
       ================================ */
    .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline {
      border-color: #3f6212;
    }
    .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
      border-color: #3f6212;
    }
    .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: #3f6212 !important;
    }
    .MuiInputBase-root.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: #3f6212;
      border-width: 2px;
    }

    .MuiInputLabel-root {
      color: #3f6212;
    }
    .MuiInputLabel-root.Mui-focused {
      color: #3f6212 !important;
    }

    /* Underline (Standard TextFields) */
    .MuiInput-underline:before {
      border-bottom: 2px solid #3f6212;
    }
    .MuiInput-underline:hover:not(.Mui-disabled):before {
      border-bottom: 2px solid #3f6212;
    }
    .MuiInput-underline:after {
      border-bottom: 2px solid #3f6212;
    }

    /* Buttons */
    .custom-dialog .MuiButton-root:hover {
      background-color: #3f6212;
    }

    /* Radio checked */
    .custom-dialog .MuiRadio-root.Mui-checked {
      color: var(--color1) !important;
    }

    /* Switch checked */
    .custom-dialog .MuiSwitch-switchBase.Mui-checked+.MuiSwitch-track {
      background-color: var(--COLOR_UI_PHARMACY) !important;
    }

    /* Tabs indicator */
    .custom-dialog .MuiTabs-indicator {
      background-color: var(--color2) !important;
    }

    /* ================================
              DIALOG BASE
       ================================ */
    .custom-dialog .MuiDialog-container {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
    }
    .custom-dialog .MuiDialog-paper {
      border-radius: 8px !important;
    }
    .custom-dialog .MuiDialogTitle-root {
      background-color: var(--COLOR_UI_PHARMACY) !important;
      color: white !important;
      font-weight: 600 !important;
      padding: 12px 16px !important;
    }
    .custom-dialog .MuiDialogActions-root {
      justify-content: flex-end !important;
      padding: 16px 24px !important;
    }

    /* ================================
        SHARED: Stock Adjustment / Expense Dialogs
       ================================ */
    .custom-dialog.modal_991 .MuiDialog-paper {
      width: 800px !important;
      max-width: 95% !important;
    }
    .custom-dialog.modal_991 .MuiButton-contained {
      background: var(--COLOR_UI_PHARMACY) !important;
      color: white !important;
      box-shadow: none !important;
    }
    .custom-dialog.modal_991 .MuiButton-contained:hover {
      background: #2e520d !important;
    }
    .custom-dialog.modal_991 .MuiButton-contained.MuiButton-colorError {
      background: #F31C1C !important;
    }

    /* Inputs inside dialog */
    .custom-dialog.modal_991 .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline {
      border-color: rgba(0,0,0,0.3);
    }
    .custom-dialog.modal_991 .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
      border-color: var(--color1);
    }
    .custom-dialog.modal_991 .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: var(--color1);
    }
    .custom-dialog.modal_991 .MuiInputLabel-root.Mui-focused {
      color: var(--color1) !important;
    }

    /* Payment button */
    .custom-dialog .payment_btn_divv {
      text-transform: none !important;
      background: var(--color1) !important;
      color: white !important;
      box-shadow: none !important;
    }
    .custom-dialog .payment_btn_divv:hover {
      background: var(--color1) !important;
      opacity: 0.9 !important;
    }

    /* Autocomplete */
    .custom-dialog .custom-autocomplete .MuiInputBase-root {
      height: 20px !important;
      font-size: 1.10rem !important;
    }
    .custom-dialog .custom-autocomplete .MuiAutocomplete-inputRoot {
      padding: 10px 14px !important;      
    }

    /* ================================
        CUSTOM BILL FORM STYLES
       ================================ */
    .custom-dialog .detail.custommedia .MuiOutlinedInput-root {
      width: 250px !important;
    }
    .custom-dialog .detail.custommedia .MuiInputBase-root {
      height: 40px !important;
      font-size: 1rem !important;
    }
    .custom-dialog .detail.custommedia .MuiAutocomplete-root {
      width: 100% !important;
    }
    .custom-dialog .detail.custommedia .MuiAutocomplete-inputRoot {
      padding: 10px 14px !important;
    }

    /* ================================
        PENDING ORDERS DIALOG (PlaceOrder)
       ================================ */

    /* Force the dialog paper to a consistent width */
    .custom-dialog.pending-orders-dialog .MuiDialog-paper {
      width: 480px !important;
      max-width: 95vw !important;
      border-radius: 8px !important;
    }

    /* Item Name Select — outlined border */
    .custom-dialog.pending-orders-dialog .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline {
      border-color: var(--COLOR_UI_PHARMACY) !important;
    }
    .custom-dialog.pending-orders-dialog .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
      border-color: var(--COLOR_UI_PHARMACY) !important;
    }
    .custom-dialog.pending-orders-dialog .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: var(--COLOR_UI_PHARMACY) !important;
      border-width: 2px !important;
    }

    /* Label color */
    .custom-dialog.pending-orders-dialog .MuiInputLabel-root {
      color: var(--COLOR_UI_PHARMACY) !important;
    }
    .custom-dialog.pending-orders-dialog .MuiInputLabel-root.Mui-focused {
      color: var(--COLOR_UI_PHARMACY) !important;
    }

    /* Select full width */
    .custom-dialog.pending-orders-dialog .MuiFormControl-root {
      width: 100% !important;
    }

    /* DialogContent padding consistency */
    .custom-dialog.pending-orders-dialog .MuiDialogContent-root {
      padding: 20px 24px !important;
    }

    /* Action buttons */
    .custom-dialog.pending-orders-dialog .MuiDialogActions-root {
      padding: 16px 24px !important;
    }
    .custom-dialog.pending-orders-dialog .MuiButton-contained {
      text-transform: none !important;
      box-shadow: none !important;
    }
      /* ================================
          ADD DISTRIBUTOR DIALOG
       ================================ */
    .add-distributor-dialog .MuiDialog-paper {
      border-radius: 8px !important;
      width: 700px !important;
      max-width: 95% !important;
    }
    .add-distributor-dialog .MuiDialogTitle-root {
     background-color: var(--COLOR_UI_PHARMACY) !important;
      color: white !important;
    }
    .add-distributor-dialog .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline {
      border-color: #3f6212 !important;
    }
    .add-distributor-dialog .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: #3f6212 !important;
    }
    .add-distributor-dialog .MuiInputLabel-root.Mui-focused {
      color: #3f6212 !important;
    }
    .add-distributor-dialog .MuiButton-contained {
      background: #3f6212 !important;
      color: white !important;
    }

    /* ================================
          ADD ITEM DIALOG
       ================================ */
    .add-item-dialog .MuiDialog-paper {
      border-radius: 8px !important;
      width: 700px !important;
      max-width: 95% !important;
    }
    .add-item-dialog .MuiDialogTitle-root {
      background-color: var(--COLOR_UI_PHARMACY) !important;
      color: white !important;
    }
    .add-item-dialog .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline {
      border-color: var(--COLOR_UI_PHARMACY) !important;
    }
    .add-item-dialog .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
      border-color: var(--COLOR_UI_PHARMACY) !important;
    }
      .add-item-dialog .MuiOutlinedInput-root:focus .MuiOutlinedInput-notchedOutline {
      border-color: var(--COLOR_UI_PHARMACY) !important;
    }
       /* ================================
          ADD COMPANY DIALOG
       ================================ */
    .add-company-dialog .MuiDialog-paper {
      border-radius: 8px !important;
      width: 700px !important;
      max-width: 95% !important;
    }

    .add-company-dialog .MuiDialogTitle-root {
      background-color: var(--COLOR_UI_PHARMACY) !important;
      color: white !important;
      font-weight: 600 !important;
    }

    .add-company-dialog .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline {
      border-color: #3f6212 !important;
    }

    .add-company-dialog .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: #3f6212 !important;
      border-width: 2px !important;
    }

    .add-company-dialog .MuiInputLabel-root.Mui-focused {
      color: #3f6212 !important;
    }

    .add-company-dialog .MuiButton-contained {
      background: var(--COLOR_UI_PHARMACY) !important;
      color: white !important;
      box-shadow: none !important;
    }

    .add-company-dialog .MuiButton-contained:hover {
      background: #2e520d !important;
    }

    .add-company-dialog .MuiButton-root[style*="F31C1C"] {
      background: #F31C1C !important;
      color: white !important;
    }
  `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="App">

      <ThemeProvider theme={theme}>
        <CssBaseline />

        <Router>
          <TitleUpdater />
          <Switch>
            <Route path='/TrialEnd'>
              <TrialEnd />
            </Route>
            {/* <Route path='/trial-ends'>
              <SubscriptionModal />
            </Route> */}

            <Route exact path='/'>
              <LoginSignup />
            </Route>
            <Route path='/Register/:referralCode'>
              <LoginSignup />
            </Route>
            <Route path='/Register'>
              <LoginSignup />
            </Route>
            <Route path='/login/:referralCode'>
              <LoginSignup />
            </Route>
            <Route path='/login'>
              <LoginSignup />
            </Route>
            <Route path='/adminDashboard'>
              <Protected>
                <Dashboard />
              </Protected>
              <Adminprotected />
            </Route>
            <Route path='/onlineDashboard'>
              <Protected>
                <OnlineDashboard />
              </Protected>
              <Adminprotected />
            </Route>
            <Route path='/itemMaster'>
              <Protected>
                <Itemmaster />
              </Protected>
            </Route>
            <Route path='/inventory'>
              <Protected>
                <InventoryList />
              </Protected>
            </Route>
            <Route path='/inventoryView/:id'>
              <Protected>
                <InventoryView />
              </Protected>
            </Route>
            <Route path='/catagory'>
              <Protected>
                <Catagory />
              </Protected>
            </Route>
            <Route path='/package'>
              <Protected>
                <Package />
              </Protected>
            </Route>
            <Route path='/customer'>
              <Protected>
                <CustomerList />
              </Protected>
            </Route>
            <Route path='/customerView/:id'>
              <Protected>
                <CustomerView />
              </Protected>
            </Route>
            <Route path='/doctors'>
              <Protected>
                <DoctorList />
              </Protected>
            </Route>
            <Route path='/doctor/:id'>
              <Protected>
                <DoctorView />
              </Protected>
            </Route>
            <Route path='/addDistributer'>
              <Protected>
                <AddDistributer />
              </Protected>
            </Route>
            <Route path='/DistributorList'>
              <Protected>
                <DistributerList />
              </Protected>
            </Route>
            <Route path='/reconciliation'>
              <Protected>
                <Reconciliation />
              </Protected>
            </Route>
            <Route path='/sehatPoints'>
              <Protected>
                <SehatMembersList />
              </Protected>
            </Route>

            <Route path='/SehatView'>
              <Protected>
                <SehatView />
              </Protected>
            </Route>
            <Route path='/loyaltyPoints'>
              <Protected>
                <LoyaltyPoint />
              </Protected>
            </Route>
            <Route path='/reports'>
              <ReportsMain />
            </Route>
            <Route path='/DistributerView/:id'>
              <Protected>
                <DistributerView />
              </Protected>
            </Route>
            <Route path='/paymentList'>
              <Protected>
                <PaymentList />
              </Protected>
            </Route>
            <Route path='/purchase'>
              <Protected>
                <PurchaseList />
              </Protected>
            </Route>
            <Route path='/purchaseView/:id'>
              <Protected>
                <PurchaseView />
              </Protected>
            </Route>
            <Route path='/purchaseEdit/:id/:randomNumber'>
              <Protected>
                <EditPurchaseBill />
              </Protected>
            </Route>
            <Route path='/purchaseReturn'>
              <Protected>
                <ReturnList />
              </Protected>
            </Route>
            <Route path='/PurchaseReturnView:id'>
              <Protected>
                <ReturnView />
              </Protected>
            </Route>
            <Route path='/PurchaseReturnEdit/:id'>
              <Protected>
                <EditReturnBill />
              </Protected>
            </Route>
            <Route path='/purchaseAdd'>
              <Protected>
                <AddPurchaseBill />
              </Protected>
            </Route>
            <Route path='/PurchaseReturnAdd'>
              <Protected>
                <AddReturnbill />
              </Protected>
            </Route>
            {/* <Route path='/purchase/purchasereturn'>
              <Purchasereturn />
            </Route> */}
            {/* <Route path='/purchase/addPurchaseReturn'>
              <Protected>
                <AddPurchaseReturn />
              </Protected>
            </Route> */}
            <Route path='/sale'>
              <Salelist />
            </Route>
            <Route path='/saleAdd'>
              <Addsale />
            </Route>
            <Route path='/saleView/:id'>
              <SaleView />
            </Route>
            <Route path='/saleEdit/:id/:randomNumber'>
              <EditSaleBill />
            </Route>
            <Route path='/saleReturn'>
              <SalereturnList />
            </Route>
            <Route path='/saleReturnAdd'>
              <Salereturn />
            </Route>
            <Route path='/SaleReturnView/:id'>
              <SaleReturnView />
            </Route>
            <Route path='/SaleReturnEdit/:id'>
              <EditSaleReturn />
            </Route>
            <Route path='/OrderList'>
              <OrderList />
            </Route>
            <Route path='/CashManagement'>
              <CashManage />
            </Route>

            <Route path='/expenseManage'>
              <Protected>
                <ManageExpense />
              </Protected>
            </Route>
            <Route path='/BankAccountDetails'>
              <Protected>
                <BankAccount />
              </Protected>
            </Route>
            <Route path='/itemWise'>
              <Protected>
                <ItemWiseMargin />
              </Protected>
            </Route>
            <Route path='/bill-item-wise-margin'>
              <Protected>
                <BillItemWiseMargin />
              </Protected>
            </Route>
            <Route path='/gst-purchase-register'>
              <Protected>
                <PurchaseRegister />
              </Protected>
            </Route>
            <Route path='/gst-purchase-bills'>
              <Protected>
                <PurchaseBillReport />
              </Protected>
            </Route>

      
            <Route path='/gst-sales-bills'>
              <Protected>
                <SalesBill />
              </Protected>
            </Route>
            <Route path='/gst-hsn-wise'>
              <Protected>
                <HsnWiseGst />
              </Protected>
            </Route>
            <Route path='/gst-GSTR1'>
              <Protected>
                <Gstr1 />
              </Protected>
            </Route>
            <Route path='/gst-GSTR2'>
              <Protected>
                <Gstr2 />
              </Protected>
            </Route>
            <Route path='/gst-GSTR-3B'>
              <Protected>
                <Gstr_3B />
              </Protected>
            </Route>
            <Route path='/day-wise-summary'>
              <Protected>
                <DayWiseSummary />
              </Protected>
            </Route>
            <Route path='/account-purchase-payment-summary'>
              <Protected>
                <PurchasePaymentSummary />
              </Protected>
            </Route>
            <Route path='/others-item-doctor-wise'>
              <Protected>
                <DoctorItemWise />
              </Protected>
            </Route>
            <Route path='/others-company-items-analysis'>
              <Protected>
                <CompanyItemWise />
              </Protected>
            </Route>
            <Route path='/others-staff-wise-activity-summary'>
              <Protected>
                <StaffWiseActivity />
              </Protected>
            </Route>
            <Route path='/others-sales-summary-report'>
              <Protected>
                <SaleSummary />
              </Protected>
            </Route>
            <Route path='/stock-purchase-return-report'>
              <Protected>
                <Purchase_Return_Report />
              </Protected>
            </Route>
            <Route path='/stock-inventory-reconciliation'>
              <Protected>
                <Inventory_Reconciliation />
              </Protected>
            </Route>
               <Route path='/stock-expiring-items'>
              <Protected>
                <Expiring_Items />
              </Protected>
            </Route>
            <Route path='/stock-item-batchwise'>
              <Protected>
                <Item_Batch_wiseStock />
              </Protected>
            </Route>
            <Route path='/stock-non-moving'>
              <Protected>
                <Non_Moving_items />
              </Protected>
            </Route>
            <Route path='/stock-stock-adjustment'>
              <Protected>
                <Stock_AdjustMent_Report />
              </Protected>
            </Route>
            <Route path='/monthly-sales-overview'>
              <Protected>
                <Monthly_sales_Overview />
              </Protected>
            </Route>
            <Route path='/top-selling-items'>
              <Protected>
                <Top_Selling_Items />
              </Protected>
            </Route>
            <Route path='/top-customers'>
              <Protected>
                <Top_Customers />
              </Protected>
            </Route>
            <Route path='/top-distributors'>
              <Protected>
                <Top_Distributor />
              </Protected>
            </Route>
            <Route path='/aboutInfo'>
              <Protected>
                <AboutInfo />
              </Protected>
            </Route>
            <Route path='/documents'>
              <Protected>
                <Documents />
              </Protected>
            </Route>
            <Route path='/plans'>
              <Protected>
                <Plans />
              </Protected>
            </Route>
            <Route path='/referEarn'>
              <Protected>
                <ReferEarn />
              </Protected>
            </Route>
            <Route path='/password'>
              <Protected>
                <Password />
              </Protected>
            </Route>
            <Route path='/StaffMember'>
              <Protected>
                <StaffMember />
              </Protected>
            </Route>
            <Route path='/manageStaffRole'>
              <Protected>
                <ManageStaffRole />
              </Protected>
            </Route>
            <Route path='/reconciliationManage'>
              <Protected>
                <ReconciliationManage />
              </Protected>
            </Route>
            <Route path='/onlineOrders'>
              <Protected>
                <OnlineOrders />
              </Protected>
            </Route>
            <Route path='/RolesAdd'>
              <Protected>
                <CreateRole />
              </Protected>
            </Route>
            <Route path='/RolesEdit/:id'>
              <Protected>
                <CreateRole />
              </Protected>
            </Route>
            <Route path='/errorPage'>
              <ErrorPage />
            </Route>
            <Route path='/company'>
              <Company />
            </Route>
            <Route path='/drugGroup'>
              <DrugGroup />
            </Route>
            <Route path='/drugGroupView/:id'>
              <DrugGroupView />
            </Route>
            <Route path='/adjustStock'>
              <Protected>
                <AdjustStock />
              </Protected>
            </Route>
            <Route path='/StaffSessions'>
              <LogActivity />
            </Route>
            <Route path='*'>
              <ErrorPage />
            </Route>
            {/* <Route path='/mehul'>
            <AddPurchaseReturn />
          </Route> */}
          </Switch>
        </Router>
      </ThemeProvider>
    </div>
  );
}

export default App;