import { Typography } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import BasicInfoFields from "./BasicInfoFields";
import DateFields from "./DateFields";
import OwnershipFields from "./OwnershipFields";
import AssetTypeField from "./AssetTypeField";
import SpecificationFields from "./SpecificationsField";
import FormActions from "./FormActions";

export interface AssetFormProps {
  onSubmit: (payload: {
    brand: string;
    model: string;
    serialNo: string;
    type: string;
    status?: string;
    purchaseDate: string;
    warrantyStartDate?: string | null;
    warrantyExpiryDate?: string | null;
    isAvailable?: boolean;
    ownedBy: string;
    clientName?: string | null;
    assetPic?: File | null;
    specifications: Record<string, string>;
  }) => Promise<void>;
  onClose: () => void;
  initialData?: {
    id?: string;
    brand: string;
    model: string;
    serialNo: string;
    type: string;
    purchaseDate: string | null;
    warrantyStartDate?: string | null;
    warrantyExpiryDate?: string | null;
    ownedBy?: string;
    clientName?: string | null;
    assetPic?: string | null;
    specifications?: Record<string, string>;
  };
}
const AssetForm: React.FC<AssetFormProps> = ({ onSubmit, onClose, initialData }) => {
  const [brand, setBrand] = useState(initialData?.brand || "");
  const [model, setModel] = useState(initialData?.model || "");
  const [serialNo, setSerialNo] = useState(initialData?.serialNo || "");
  const [purchaseDate, setPurchaseDate] = useState<Dayjs | null>(initialData?.purchaseDate ? dayjs(initialData.purchaseDate) : null);
  const [warrantyStartDate, setWarrantyStartDate] = useState<Dayjs | null>(
    initialData?.warrantyStartDate ? dayjs(initialData.warrantyStartDate) : null
  );
  const [warrantyExpiryDate, setWarrantyExpiryDate] = useState<Dayjs | null>(
    initialData?.warrantyExpiryDate ? dayjs(initialData.warrantyExpiryDate) : null
  );
  const [ownedBy, setOwnedBy] = useState("Remotestate");
  const [assetType, setAssetType] = useState(initialData?.type || "");
  const [clientName, setClientName] = useState(initialData?.clientName || "");
  const [specifications, setSpecifications] = useState<Record<string, string>>(
    initialData?.specifications || {}
  );
  const [error, setError] = useState<string | null>(null);

  const handleSpecificationChange = (key: string, value: string) => {
    setSpecifications((prev) => ({ ...prev, [key]: value }));
  };

  const resetSpecifications = () => setSpecifications({});

  const resetForm = () => {
    setBrand(initialData?.brand || "");
    setModel(initialData?.model || "");
    setSerialNo(initialData?.serialNo || "");
    setPurchaseDate(initialData?.purchaseDate ? dayjs(initialData.purchaseDate) : null);
    setWarrantyStartDate(
      initialData?.warrantyStartDate ? dayjs(initialData.warrantyStartDate) : null
    );
    setWarrantyExpiryDate(
      initialData?.warrantyExpiryDate ? dayjs(initialData.warrantyExpiryDate) : null
    );
    setOwnedBy(initialData?.ownedBy || "Remotestate");
    setAssetType(initialData?.type || "");
    setClientName(initialData?.clientName || "");
    setSpecifications(initialData?.specifications || {});
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!brand || !model || !serialNo || !assetType || !purchaseDate) {
      setError("Please fill in all required fields");
      return;
    }

    const payload = {
      brand,
      model,
      serialNo,
      type: assetType,
      purchaseDate: purchaseDate.toISOString(),
      warrantyStartDate: warrantyStartDate
        ? warrantyStartDate.toISOString()
        : null,
      warrantyExpiryDate: warrantyExpiryDate
        ? warrantyExpiryDate.toISOString()
        : null,
      ownedBy,
      clientName: ownedBy === "Client" ? clientName : null,
      assetPic: null,
      specifications,
    };

    try {
      await onSubmit(payload);
      resetForm();
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to create asset");
      } else {
        setError("Failed to create asset");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <BasicInfoFields
        brand={brand}
        model={model}
        serialNo={serialNo}
        setBrand={setBrand}
        setModel={setModel}
        setSerialNo={setSerialNo}
      />
      <DateFields
        purchaseDate={purchaseDate}
        warrantyStartDate={warrantyStartDate}
        warrantyExpiryDate={warrantyExpiryDate}
        setPurchaseDate={setPurchaseDate}
        setWarrantyStartDate={setWarrantyStartDate}
        setWarrantyExpiryDate={setWarrantyExpiryDate}
      />
      <OwnershipFields
        ownedBy={ownedBy}
        clientName={clientName}
        setOwnedBy={setOwnedBy}
        setClientName={setClientName}
      />
      <AssetTypeField
        assetType={assetType}
        setAssetType={setAssetType}
        resetSpecifications={resetSpecifications}
      />
      <SpecificationFields
        assetType={assetType}
        specifications={specifications}
        setSpecification={handleSpecificationChange}
      />
      <FormActions onCancel={onClose} />
    </form>
  );
};

export default AssetForm;
