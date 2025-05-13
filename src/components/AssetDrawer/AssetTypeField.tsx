import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

interface AssetTypeFieldProps {
    assetType: string;
    setAssetType: (value: string) => void;
    resetSpecifications: () => void;
  }
  const AssetTypeField: React.FC<AssetTypeFieldProps> = ({
    assetType,
    setAssetType,
    resetSpecifications,
  }) => (
    <FormControl fullWidth sx={{ mb: 2 }}>
      <InputLabel id="asset-type-label" size="small">
        Asset Type
      </InputLabel>
      <Select
        labelId="asset-type-label"
        value={assetType}
        label="Asset Type"
        onChange={(e) => {
          setAssetType(e.target.value);
          resetSpecifications();
        }}
        size="small"
        required
      >
        <MenuItem value="" disabled>
          Choose
        </MenuItem>
        <MenuItem value="laptop">Laptop</MenuItem>
        <MenuItem value="mobile">Mobile</MenuItem>
        <MenuItem value="monitor">Monitor</MenuItem>
        <MenuItem value="pendrive">Pen Drive</MenuItem>
        <MenuItem value="sim">Sim</MenuItem>
        <MenuItem value="accessories">Accessories</MenuItem>
        <MenuItem value="ram">RAM</MenuItem>
        <MenuItem value="hardisk">Hard Disk</MenuItem>
      </Select>
    </FormControl>
  );

  export default AssetTypeField;