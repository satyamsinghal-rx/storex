import { Box, IconButton, Typography } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";


interface DrawerHeaderProps {
  title: string;
  onClose: () => void;
}
const DrawerHeader: React.FC<DrawerHeaderProps> = ({title, onClose }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      mb: 2,
    }}
  >
    <Typography variant="h6">{title}</Typography>
    <IconButton onClick={onClose}>
      <CloseIcon />
    </IconButton>
  </Box>
);

export default DrawerHeader;