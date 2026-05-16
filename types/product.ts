export type ProductSource = "internal" | "external";

export interface LookProduct {
  id:                string;
  name:              string;
  price:             number;
  currency:          "NGN" | "USD" | "GBP";
  imageUrl:          string | null;
  xPosition:         number; // 0-100 percentage from left
  yPosition:         number; // 0-100 percentage from top
  productType:       ProductSource;
  internalProductId?: string | null;
  externalUrl?:      string | null;
  externalSource:    string | null;
  isInternational:   boolean;
}
