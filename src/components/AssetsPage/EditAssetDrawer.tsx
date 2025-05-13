import { Box, Drawer } from "@mui/material";
import AssetForm from "../AssetDrawer/AssetForm";
import { editAsset } from "@/lib/api";
import DrawerHeader from "../AssetDrawer/DrawerHeader";
import { Asset } from "@/lib/types";


interface EditAssetDrawerProps {
  open: boolean;
  onClose: () => void;
  assetDetails: Asset | null;
}
export default function EditAssetDrawer({ open, onClose, assetDetails }: EditAssetDrawerProps) {


    const handleSubmit = async (payload: unknown) => {
        if (!assetDetails?.id) {
          throw new Error("Asset ID is missing");
        }
        await editAsset(assetDetails.id, payload);
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
        <DrawerHeader title="Edit Asset" onClose={onClose}/>
        <AssetForm onSubmit={handleSubmit} onClose={onClose} initialData={assetDetails || undefined} />
      </Box>
    </Drawer>
  );
}
