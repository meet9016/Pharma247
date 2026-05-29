import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Box,
    Grid,
    Stack,
    Typography,
    Divider,
    Chip,
    Paper,
    Button
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import ScienceIcon from "@mui/icons-material/Science";
import MedicationIcon from '@mui/icons-material/Medication';
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";

export default function MemberView({ viewMember, setViewMember, memberDetails }) {
    return (
        <Dialog
            open={viewMember}
            onClose={() => setViewMember(false)}


            maxWidth="lg"
            fullWidth
            className="custom-dialog"
        >

            {/* HEADER */}
            <DialogTitle id="alert-dialog-title" className="secondary">
                Membership Details

                <IconButton
                    aria-label="close"
                    onClick={() => setViewMember(false)}
                    className="text-gray-500"
                    sx={{
                        position: "absolute",
                        right: 12,
                        top: 8,
                        color: "#ffffff",
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>


            {/* CONTENT */}
            <DialogContent sx={{ p: 3, backgroundColor: "#fafafa" }}>
                <Grid container spacing={3}>
                    {/* LEFT – MEMBER INFORMATION */}
                    <Grid item xs={12} md={6}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                height: "100%",
                                border: "1px solid #e5e7eb",
                                borderRadius: 2,
                                backgroundColor: "#fff",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <Typography
                                variant="subtitle1"
                                fontWeight={700}
                                sx={{ mb: 3, color: "#3f6212", fontSize: "1rem" }}
                            >
                                Member Information
                            </Typography>
                            <Stack spacing={2.5} sx={{ flex: 1 }}>
                                <Box>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ display: "block", mb: 0.5, fontWeight: 600, textTransform: "uppercase", fontSize: "0.7rem" }}
                                    >
                                        Full Name
                                    </Typography>
                                    <Typography variant="body1" fontWeight={500} color="#1f2937">
                                        {memberDetails.name}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ display: "block", mb: 0.5, fontWeight: 600, textTransform: "uppercase", fontSize: "0.7rem" }}
                                    >
                                        Relation
                                    </Typography>
                                    <Chip
                                        label={memberDetails.relation}
                                        size="small"
                                        sx={{
                                            backgroundColor: "#3f6212",
                                            color: "#ffffff",
                                            fontWeight: 600,
                                            height: 26,
                                        }}
                                    />
                                </Box>
                                <Box>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ display: "block", mb: 0.5, fontWeight: 600, textTransform: "uppercase", fontSize: "0.7rem" }}
                                    >
                                        Email Address
                                    </Typography>
                                    <Typography variant="body1" fontWeight={500} color="#1f2937">
                                        {memberDetails.email}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ display: "block", mb: 0.5, fontWeight: 600, textTransform: "uppercase", fontSize: "0.7rem" }}
                                    >
                                        Mobile Number
                                    </Typography>
                                    <Typography variant="body1" fontWeight={500} color="#1f2937">
                                        {memberDetails.number}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ display: "block", mb: 0.5, fontWeight: 600, textTransform: "uppercase", fontSize: "0.7rem" }}
                                    >
                                        Payment Method
                                    </Typography>
                                    <Typography variant="body1" fontWeight={500} color="#1f2937">
                                        {memberDetails.payment_method}
                                    </Typography>
                                </Box>
                            </Stack>
                            {/* <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                                <Button
                                    variant="contained"
                                    sx={{
                                        background: "#3f6212",
                                        color: "white",
                                        textTransform: "none",
                                        fontWeight: 600,
                                        px: 3,
                                        py: 1,
                                        borderRadius: 1.5,
                                        "&:hover": {
                                            background: "#2d4610",
                                        },
                                    }}
                                >
                                    Renew
                                </Button>
                            </Box> */}
                        </Paper>

                    </Grid>


                    {/* RIGHT – PLAN DETAILS & BENEFITS */}
                    <Grid item xs={12} md={6}>
                        <Stack spacing={3} sx={{ height: "100%" }}>
                            {/* Plan Validity */}
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    border: "1px solid #e5e7eb",
                                    borderRadius: 2,
                                    backgroundColor: "#fff",
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight={700} color="#3f6212" sx={{ fontSize: "1rem", mb: 0.5 }}>
                                            Plan Validity
                                        </Typography>
                                        <Typography variant="h6" fontWeight={600} color="#1f2937">
                                            {memberDetails.plan_name}
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            px: 2.5,
                                            py: 1.5,
                                            backgroundColor: "#3f6212",
                                            borderRadius: 1.5,
                                            textAlign: "center",
                                            minWidth: 85,
                                        }}
                                    >
                                        <Typography variant="caption" sx={{ display: "block", fontSize: "0.65rem", color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>
                                            Days Left
                                        </Typography>
                                        <Typography
                                            variant="h4"
                                            fontWeight={700}
                                            color="#ffffff"
                                            sx={{ lineHeight: 1.2, mt: 0.3 }}
                                        >
                                            {memberDetails.remaining_days}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Stack spacing={2}>
                                    <Box sx={{ display: "flex", gap: 2 }}>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                sx={{ display: "block", mb: 0.5, fontWeight: 600, textTransform: "uppercase", fontSize: "0.7rem" }}
                                            >
                                                Start Date
                                            </Typography>
                                            <Typography variant="body1" fontWeight={600} color="#1f2937">
                                                {memberDetails.plan_start_date}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                sx={{ display: "block", mb: 0.5, fontWeight: 600, textTransform: "uppercase", fontSize: "0.7rem" }}
                                            >
                                                End Date
                                            </Typography>
                                            <Typography variant="body1" fontWeight={600} color="#1f2937">
                                                {memberDetails.plan_end_date}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Stack>
                            </Paper>

                            {/* Usage Benefits */}
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    border: "1px solid #e5e7eb",
                                    borderRadius: 2,
                                    backgroundColor: "#fff",
                                }}
                            >
                                <Typography
                                    variant="subtitle1"
                                    fontWeight={700}
                                    sx={{ mb: 2.5, color: "#3f6212", fontSize: "1rem" }}
                                >
                                    Usage Benefits
                                </Typography>
                                <Grid container spacing={2}>
                                    {/* Card 1 */}
                                    <Grid item xs={12} sm={6}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 2,
                                                p: 2,
                                                backgroundColor: "#f9fafb",
                                                borderRadius: 1.5,
                                                border: "1px solid #e5e7eb",
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 44,
                                                    height: 44,
                                                    borderRadius: "50%",
                                                    backgroundColor: "#f0f4e8",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    flexShrink: 0,
                                                }}
                                            >
                                                <LocalHospitalIcon sx={{ fontSize: 22, color: "#3f6212" }} />
                                            </Box>
                                            <Box>
                                                <Typography variant="body1" fontWeight={700} color="#3f6212">
                                                    {memberDetails.medicine_delivery}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.85rem" }}>
                                                    Free Medicine Deliveries
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>

                                    {/* Card 2 */}
                                    <Grid item xs={12} sm={6}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 2,
                                                p: 2,
                                                backgroundColor: "#f9fafb",
                                                borderRadius: 1.5,
                                                border: "1px solid #e5e7eb",
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 44,
                                                    height: 44,
                                                    borderRadius: "50%",
                                                    backgroundColor: "#f0f4e8",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    flexShrink: 0,
                                                }}
                                            >
                                                <ScienceIcon sx={{ fontSize: 22, color: "#3f6212" }} />
                                            </Box>
                                            <Box>
                                                <Typography variant="body1" fontWeight={700} color="#3f6212">
                                                    {memberDetails.lab_test_discount}% OFF
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.85rem" }}>
                                                    On Lab Tests
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>

                                    {/* Card 3 */}
                                    <Grid item xs={12} sm={6}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 2,
                                                p: 2,
                                                backgroundColor: "#f9fafb",
                                                borderRadius: 1.5,
                                                border: "1px solid #e5e7eb",
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 44,
                                                    height: 44,
                                                    borderRadius: "50%",
                                                    backgroundColor: "#f0f4e8",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    flexShrink: 0,
                                                }}
                                            >
                                                <MedicationIcon sx={{ fontSize: 22, color: "#3f6212" }} />
                                            </Box>
                                            <Box>
                                                <Typography variant="body1" fontWeight={700} color="#3f6212">
                                                    {memberDetails.lab_home_visit}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.85rem" }}>
                                                    Lab Home Visits
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>

                                    {/* Card 4 */}
                                    <Grid item xs={12} sm={6}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 2,
                                                p: 2,
                                                backgroundColor: "#f9fafb",
                                                borderRadius: 1.5,
                                                border: "1px solid #e5e7eb",
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 44,
                                                    height: 44,
                                                    borderRadius: "50%",
                                                    backgroundColor: "#f0f4e8",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    flexShrink: 0,
                                                }}
                                            >
                                                <MedicalServicesIcon  sx={{ fontSize: 22, color: "#3f6212" }} />
                                            </Box>
                                            <Box>
                                                <Typography variant="body1" fontWeight={700} color="#3f6212">
                                                    {memberDetails.doctor_consult}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.85rem" }}>
                                                    Doctor Consult
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                </Grid>

                            </Paper>
                        </Stack>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
}