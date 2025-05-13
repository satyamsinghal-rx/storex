import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from "@mui/material";

interface OwnershipFieldsProps {
    ownedBy: string;
    clientName: string;
    setOwnedBy: (value: string) => void;
    setClientName: (value: string) => void;
  }
  const OwnershipFields: React.FC<OwnershipFieldsProps> = ({
    ownedBy,
    clientName,
    setOwnedBy,
    setClientName,
  }) => (
    <>
      <FormControl component="fieldset" sx={{ mb: 2, mt: 2 }}>
        <FormLabel component="legend">Owned By</FormLabel>
        <RadioGroup
          row
          value={ownedBy}
          onChange={(e) => setOwnedBy(e.target.value)}
        >
          <FormControlLabel
            value="Remotestate"
            control={<Radio />}
            label="Remotestate"
          />
          <FormControlLabel value="Client" control={<Radio />} label="Client" />
        </RadioGroup>
      </FormControl>
      {ownedBy === "Client" && (
        <TextField
          label="Client Name"
          placeholder="Enter Client Name"
          fullWidth
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          sx={{ mb: 2 }}
          size="small"
        />
      )}
    </>
  );

  export default OwnershipFields;