import { Box, Drawer } from "@mui/material";
import AssetForm from "../AssetDrawer/AssetForm";
import { addAsset } from "@/lib/api";
import DrawerHeader from "../AssetDrawer/DrawerHeader";


interface AddAssetDrawerProps {
  open: boolean;
  onClose: () => void;
}
export default function AddAssetDrawer({ open, onClose }: AddAssetDrawerProps) {
  const handleSubmit = async (payload: unknown) => {
    await addAsset(payload);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        width: 500,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 500,
          boxSizing: "border-box",
        },
      }}
    >
      <Box sx={{ width: 450, padding: 2, overflowY: "auto" }}>
        <Drawer onClose={onClose} />
        <DrawerHeader title="Create New Asset" onClose={onClose}/>
        <AssetForm onSubmit={handleSubmit} onClose={onClose} />
      </Box>
    </Drawer>
  );
}
