import { Box, Button } from "@mui/material";

interface FormActionsProps {
    onCancel: () => void;
  }
  const FormActions: React.FC<FormActionsProps> = ({ onCancel }) => (
    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
      <Button
        type="submit"
        variant="contained"
        sx={{
          backgroundColor: "#666",
          "&:hover": { backgroundColor: "#555" },
        }}
      >
        Submit
      </Button>
      <Button variant="outlined" onClick={onCancel}>
        Cancel
      </Button>
    </Box>
  );
  export default FormActions;