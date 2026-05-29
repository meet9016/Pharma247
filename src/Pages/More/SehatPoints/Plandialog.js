import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";


export default function PlanDialog({ showPlans, setShowPlans, plans ,setAddMember }) {
  return (
    <Dialog
      open={showPlans}
      onClose={() =>{ setShowPlans(false) }}
      maxWidth="lg"
      fullWidth
    >
      {/* HEADER */}
      <DialogTitle
        sx={{
          fontSize: 28,
          fontWeight: 700,
          textAlign: "center",
        }}
      >
        Sehat Memebership Plans
        <IconButton
          onClick={() => setShowPlans(false)}
          sx={{ position: "absolute", right: 16, top: 16 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* CONTENT */}
      <DialogContent sx={{ py: 4 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
          }}
        >
          {plans.map((plan) => (
            <div
              key={plan.id}
              style={{
                color: plan.highlight ? "#fff" : "#000",
                borderRadius: "20px",
                padding: "28px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                display: "flex",
                flexDirection: "column",
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "#3f6212",
              }}
            >
              <h3 style={{ marginBottom: 10 }}>{plan.name}</h3>

              <div style={{ fontSize: 42, fontWeight: 800 }}>
                &#8377;{plan.price}
                <span style={{ fontSize: 16 }}> / Year</span>
              </div>

              <p style={{ margin: "20px 0", fontWeight: 600 }}>
                What’s Included :
              </p>

              <ul style={{ paddingLeft: 18, lineHeight: "1.9" }}>
                <li>{plan.medicine_delivery} Free Medicine Deliveries</li>
                <li>{plan.lab_home_visit} Free Lab Home Visits</li>
                <li>{plan.lab_test_discount}% OFF on Lab Tests</li>
                <li>{plan.doctor_consult} Free Doctor Consultations</li>
                <li>Covers {plan.user_covered} Persons</li>
              </ul>

              <Button
                variant="contained"
                fullWidth
                sx={{
                  mt: "auto",
                  borderRadius: "30px",
                  py: 1.4,
                  fontWeight: 600,
                  background: "#3f6212",
                  "&:hover": {
                    backgroundColor: "#3f6212", // keep same color
                    boxShadow: "none",
                  }
                }}
                onClick={()=>{setShowPlans(false) ; setAddMember(true)}}
              >
                {plan.plan_name}
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
