export type FashnCategory = "tops" | "bottoms" | "one-pieces";

export interface GarmentOption {
  label:    string;
  category: FashnCategory;
}

export const GARMENT_OPTIONS: GarmentOption[] = [
  { label: "Top / Jacket",    category: "tops"       },
  { label: "Dress / Full Outfit", category: "one-pieces" },
  { label: "Trousers / Skirt",   category: "bottoms"  },
];

export interface PinnedProduct {
  id:               string;
  name:             string;
  price:            number;
  currency:         string;
  imageUrl?:        string;
  xPosition:        number;
  yPosition:        number;
  externalSource?:  string;
  isInternational?: boolean;
}

export interface CreatorModel {
  id:                string;
  name:              string;
  gender:            string;
  canonicalImageUrl: string | null;
  status:            "generating" | "selecting" | "active" | "failed";
}
