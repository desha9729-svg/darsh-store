import { getShippingByGovernorate } from "@/data/egypt-governorates";

export interface ShippingRateRequest {
  governorate: string;
  city?: string;
  totalWeightGrams?: number;
  codAmount: number;
}

export interface ShippingRateResult {
  carrier: string;
  shippingFee: number;
  estimatedDays: string;
}

export interface CreateShipmentPayload {
  orderNumber: string;
  receiver: {
    name: string;
    phone: string;
    secondaryPhone?: string;
    email?: string;
  };
  dropOffAddress: {
    governorate: string;
    city: string;
    street: string;
    building?: string;
    floor?: string;
    apartment?: string;
    notes?: string;
  };
  codAmount: number;
  itemsCount: number;
  description: string;
}

export interface ShipmentResponse {
  carrier: 'bosta' | 'custom';
  shipmentId: string;
  trackingNumber: string;
  trackingUrl: string;
  status: string;
}

export interface IShippingProvider {
  name: string;
  calculateRate(request: ShippingRateRequest): Promise<ShippingRateResult>;
  createShipment(payload: CreateShipmentPayload): Promise<ShipmentResponse>;
  trackShipment(trackingNumber: string): Promise<any>;
}

export class BostaShippingProvider implements IShippingProvider {
  name = "Bosta";

  async calculateRate(request: ShippingRateRequest): Promise<ShippingRateResult> {
    const gov = getShippingByGovernorate(request.governorate);
    return {
      carrier: this.name,
      shippingFee: gov.fee,
      estimatedDays: gov.deliveryDays,
    };
  }

  async createShipment(payload: CreateShipmentPayload): Promise<ShipmentResponse> {
    // Generate clean production mock Bosta tracking identifier
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const trackingNumber = `BST-${payload.orderNumber.replace("DRSH-", "")}-${randomSuffix}`;
    
    return {
      carrier: "bosta",
      shipmentId: `bosta_shp_${Date.now()}`,
      trackingNumber,
      trackingUrl: `https://bosta.co/tracking-shipment/?track=${trackingNumber}`,
      status: "pickup_requested",
    };
  }

  async trackShipment(trackingNumber: string) {
    return {
      trackingNumber,
      carrier: "Bosta",
      status: "in_transit",
      history: [
        { status: "Shipment Created", time: new Date().toISOString() },
        { status: "Picked up by Bosta Courier", time: new Date().toISOString() },
      ],
    };
  }
}

// Global active shipping service instance
export const shippingService: IShippingProvider = new BostaShippingProvider();
