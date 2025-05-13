import { Box, TextField, Typography } from "@mui/material";

interface SpecificationFieldsProps {
  assetType: string;
  specifications: Record<string, string>;
  setSpecification: (key: string, value: string) => void;
}

const specFieldsConfig: Record<string, { label: string; key: string; placeholder: string }[]> = {
  laptop: [
    { label: "Processor", key: "processor", placeholder: "Enter Processor" },
    { label: "RAM", key: "ram", placeholder: "Enter RAM (e.g., 16GB)" },
    {
      label: "Storage",
      key: "storage",
      placeholder: "Enter Storage (e.g., 512GB SSD)",
    },
    { label: "Series", key: "series", placeholder: "Enter Series" },
    { label: "Operating system", key: "operating system", placeholder: "Enter operating system" },
    { label: "Screen Resolution", key: "screen Resolution", placeholder: "Enter Screen Resolution" }


  ],
  mobile: [
    { label: "OS", key: "os", placeholder: "Enter OS Type (e.g., Android 13)" },
    {
      label: "IMEI 1",
      key: "imei1",
      placeholder: "Enter IMEI 1",
    },
    {
      label: "IMEI 2",
      key: "imei2",
      placeholder: "Enter IMEI 2",
    },
    { label: "RAM", key: "ram", placeholder: "Enter RAM (e.g., 16GB)" }

  ],
  monitor: [
    { label: "Size", key: "size", placeholder: "Enter Size (e.g., 24 inches)" },
    {
      label: "Resolution",
      key: "resolution",
      placeholder: "Enter Resolution (e.g., 1920x1080)",
    },
  ],
  pendrive: [
    {
      label: "Storage",
      key: "storage",
      placeholder: "Enter Storage (e.g., 64GB)",
    },
  ],
  sim: [
    {
      label: "SimNo",
      key: "simno",
      placeholder: "Enter Sim No",
    },
    { label: "Phone No", key: "phone", placeholder: "Enter Phone Number" },
  ],
  accessories: [
    { label: "Type", key: "type", placeholder: "Enter Type (e.g., Mouse)" },
  ],
  ram: [
    {
      label: "Capacity",
      key: "capacity",
      placeholder: "Enter Capacity (e.g., 8GB)",
    },
    {
      label: "Speed",
      key: "speed",
      placeholder: "Enter Speed (e.g., 3200MHz)",
    },
  ],
  hardisk: [
    {
      label: "Storage",
      key: "storage",
      placeholder: "Enter Storage (e.g., 1TB)",
    },
  ],
};

const SpecificationFields: React.FC<SpecificationFieldsProps> = ({
  assetType,
  specifications,
  setSpecification,
}) => {
  const specFields = specFieldsConfig[assetType] || [];
  if (specFields.length === 0) return null;

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Specifications
      </Typography>
      {specFields.map((field) => (
        <TextField
          key={field.key}
          label={field.label}
          placeholder={field.placeholder}
          fullWidth
          value={specifications[field.key] || ""}
          onChange={(e) => setSpecification(field.key, e.target.value)}
          sx={{ mb: 2 }}
          size="small"
        />
      ))}
    </Box>
  );
};

export default SpecificationFields;
