export interface ITransport {
  _id?: string;
  title: string;
  vehicleModel: string;
  duration: string;
  capacity: number;
  price: number;
  pickup: string;
  destination: string;
  features: string[];
  images: string[];
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ITransportResponse {
  success: boolean;
  message: string;
  data: ITransport;
}

export interface ITransportsResponse {
  success: boolean;
  message: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  data: ITransport[];
}
