import { TextField } from "@mui/material";

interface BasicInfoFieldsProps {
    brand: string;
    model: string;
    serialNo: string;
    setBrand: (value: string) => void;
    setModel: (value: string) => void;
    setSerialNo: (value: string) => void;
  }
  const BasicInfoFields: React.FC<BasicInfoFieldsProps> = ({
    brand,
    model,
    serialNo,
    setBrand,
    setModel,
    setSerialNo,
  }) => (
    <>
      <TextField
        label="Brand"
        placeholder="Enter Brand"
        fullWidth
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
        sx={{ mb: 2 }}
        size="small"
        required
      />
      <TextField
        label="Model"
        placeholder="Enter Model"
        fullWidth
        value={model}
        onChange={(e) => setModel(e.target.value)}
        sx={{ mb: 2 }}
        size="small"
        required
      />
      <TextField
        label="Serial No"
        placeholder="Enter Serial No"
        fullWidth
        value={serialNo}
        onChange={(e) => setSerialNo(e.target.value)}
        sx={{ mb: 2 }}
        size="small"
        required
      />
    </>
  );

  export default BasicInfoFields;