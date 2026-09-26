export type CountryCode = "SA" | "EG" | "KW" | "AE" | "QA";

export type PartnerType = "jewelry" | "bullion" | "exchange" | "souk" | "chain" | "agent";

export type PartnerStatus =
  | "prospect"
  | "invited"
  | "pending"
  | "approved"
  | "suspended";

export type Fulfillment = "pickup" | "delivery";

export type TransferStatus =
  | "paid"
  | "notified"
  | "verified"
  | "ready"
  | "out_for_delivery"
  | "completed"
  | "cancelled"
  | "refunded";

export type MetalType = "gold" | "silver";

export interface PartnerLocation {
  id: string;
  partnerId: string;
  name: string;
  country: CountryCode;
  city: string;
  type: PartnerType;
  address: string;
  lat: number | null;
  lng: number | null;
  website: string;
  email: string;
  phone: string;
  hours: string;
  services: Array<"pickup" | "delivery" | "gold" | "silver" | "buyback">;
  languages: string[];
  status: PartnerStatus;
  verified: boolean;
  rating: number;
  yearsActive: number;
  sourceUrl: string;
  notes: string;
}

export interface CrossBorderTransfer {
  id: string;
  metal: MetalType;
  grams: number;
  fulfillment: Fulfillment;
  originCountry: CountryCode;
  destinationCountry: CountryCode;
  locationId: string;
  locationName: string;
  recipientName: string;
  recipientPhone: string;
  recipientEmail: string;
  recipientIdType: string;
  relationship: string;
  feeBreakdown: {
    metalCost: number;
    serviceFee: number;
    partnerFee: number;
    fxSpread: number;
    total: number;
    currency: string;
  };
  status: TransferStatus;
  statusHistory: Array<{ status: TransferStatus; at: string }>;
  /** Practice code shown after mock OTP — not a live redemption secret. */
  practiceCode: string;
  corridorLive: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface PartnerApplication {
  id: string;
  businessName: string;
  registrationNumber: string;
  country: CountryCode;
  city: string;
  businessType: PartnerType;
  yearsOperating: string;
  hasVault: boolean;
  hasInsurance: boolean;
  monthlyVolume: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  message: string;
  status: "submitted" | "under_review" | "approved" | "rejected" | "more_info";
  createdAt: string;
}

export interface CommissionRule {
  id: string;
  country: CountryCode | "*";
  partnerType: PartnerType | "*";
  customerFeePct: number;
  partnerFlat: number;
  partnerSharePct: number;
  updatedAt: string;
}

export type CorridorKey = `${CountryCode}-${CountryCode}`;

export interface GoldServiceState {
  locations: PartnerLocation[];
  transfers: CrossBorderTransfer[];
  applications: PartnerApplication[];
  commissionRules: CommissionRule[];
  /** Per-corridor live settlement — always false until licensed. */
  crossBorderLive: Record<string, boolean>;
  reserveLive: boolean;
  partnerSession: boolean;
}