import Backdrop from "@mui/material/Backdrop"
import CircularProgress from "@mui/material/CircularProgress"

export const BackdropComponent = () => (
  <Backdrop
    sx={{ color: "#fff", zIndex: 1000 }}
    open={true}
    transitionDuration={10}
  >
    <CircularProgress color="inherit" />
  </Backdrop>
)
