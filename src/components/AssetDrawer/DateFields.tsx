import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Dayjs } from "dayjs";
import { Box } from "@mui/material";
import CalendarIcon from "@mui/icons-material/CalendarToday";

interface DateFieldsProps {
    purchaseDate: Dayjs | null;
    warrantyStartDate: Dayjs | null;
    warrantyExpiryDate: Dayjs | null;
    setPurchaseDate: (value: Dayjs | null) => void;
    setWarrantyStartDate: (value: Dayjs | null) => void;
    setWarrantyExpiryDate: (value: Dayjs | null) => void;
  }
  const DateFields: React.FC<DateFieldsProps> = ({
    purchaseDate,
    warrantyExpiryDate,
    setPurchaseDate,
    setWarrantyExpiryDate,
  }) => (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <DatePicker
          label="Purchased Date"
          value={purchaseDate}
          onChange={setPurchaseDate}
          slots={{ openPickerIcon: CalendarIcon }}
          slotProps={{
            textField: {
              size: "small",
              placeholder: "Pick a date",
              sx: { width: "50%" },
              required: true,
            },
          }}
        />
        <DatePicker
          label="Warranty Expiry Date"
          value={warrantyExpiryDate}
          onChange={setWarrantyExpiryDate}
          slots={{ openPickerIcon: CalendarIcon }}
          slotProps={{
            textField: {
              size: "small",
              placeholder: "Pick a date",
              sx: { width: "50%" },
            },
          }}
        />
      </Box>
    </LocalizationProvider>
  );

  export default DateFields;