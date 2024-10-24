export type OpeningHourType = {
  opening_datetime: string;
  closing_datetime: string;
  is_closed: boolean;
};

export type OrderTimeType = {
  [date: string]: string;
};

export type LocationModel = {
  dining_choices: number[];
  gglocation_id: number;
  gglocation_type: number;
  name: string;
  is_available: boolean;
  phone: string;
  address_1: string;
  address_2: string;
  postcode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  processing_time: number;
  delivery_processing_time: 45;
  cutoff_time: 45;
  scheduled_delivery_cutoff_time: number;
  interval_increment_time: number;
  opening_hours: OpeningHourType[];
  schedule_order_time: OrderTimeType;
  schedule_order_cutoff_time: OrderTimeType;
  scheduled_delivery_order_time: OrderTimeType;
  scheduled_delivery_order_cutoff_time: OrderTimeType;
  images: {
    banner: number | null;
    logo: number | null;
  };
};

export type LocationAPIResponse = {
  stores: LocationModel[];
  partners: LocationModel[];
  meta: {
    ts: string;
  };
};
