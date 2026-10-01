export interface GovernorateShipping {
  id: string;
  nameEn: string;
  nameAr: string;
  zone: 1 | 2 | 3 | 4;
  fee: number;
  deliveryDays: string;
}

export const EGYPTIAN_GOVERNORATES: GovernorateShipping[] = [
  // Zone 1: Greater Cairo
  { id: 'cairo', nameEn: 'Cairo', nameAr: 'القاهرة', zone: 1, fee: 55, deliveryDays: '1-2 Days' },
  { id: 'giza', nameEn: 'Giza', nameAr: 'الجيزة', zone: 1, fee: 55, deliveryDays: '1-2 Days' },
  { id: 'qalyubia', nameEn: 'Qalyubia', nameAr: 'القليوبية', zone: 1, fee: 60, deliveryDays: '1-2 Days' },

  // Zone 2: Alexandria & Delta
  { id: 'alexandria', nameEn: 'Alexandria', nameAr: 'الإسكندرية', zone: 2, fee: 65, deliveryDays: '2-3 Days' },
  { id: 'kafr_el_sheikh', nameEn: 'Kafr El Sheikh', nameAr: 'كفر الشيخ', zone: 2, fee: 70, deliveryDays: '2-3 Days' },
  { id: 'gharbia', nameEn: 'Gharbia', nameAr: 'الغربية', zone: 2, fee: 70, deliveryDays: '2-3 Days' },
  { id: 'dakahlia', nameEn: 'Dakahlia', nameAr: 'الدقهلية', zone: 2, fee: 70, deliveryDays: '2-3 Days' },
  { id: 'sharkia', nameEn: 'Sharkia', nameAr: 'الشرقية', zone: 2, fee: 70, deliveryDays: '2-3 Days' },
  { id: 'menofia', nameEn: 'Menofia', nameAr: 'المنوفية', zone: 2, fee: 70, deliveryDays: '2-3 Days' },
  { id: 'beheira', nameEn: 'Beheira', nameAr: 'البحيرة', zone: 2, fee: 70, deliveryDays: '2-3 Days' },
  { id: 'damietta', nameEn: 'Damietta', nameAr: 'دمياط', zone: 2, fee: 75, deliveryDays: '2-3 Days' },

  // Zone 3: Canal & Upper Egypt
  { id: 'ismailia', nameEn: 'Ismailia', nameAr: 'الإسماعيلية', zone: 3, fee: 80, deliveryDays: '3-4 Days' },
  { id: 'port_said', nameEn: 'Port Said', nameAr: 'بورسعيد', zone: 3, fee: 80, deliveryDays: '3-4 Days' },
  { id: 'suez', nameEn: 'Suez', nameAr: 'السويس', zone: 3, fee: 80, deliveryDays: '3-4 Days' },
  { id: 'faiyum', nameEn: 'Faiyum', nameAr: 'الفيوم', zone: 3, fee: 85, deliveryDays: '3-4 Days' },
  { id: 'beni_suef', nameEn: 'Beni Suef', nameAr: 'بني سويف', zone: 3, fee: 85, deliveryDays: '3-4 Days' },
  { id: 'minya', nameEn: 'Minya', nameAr: 'المنيا', zone: 3, fee: 90, deliveryDays: '3-5 Days' },
  { id: 'asyut', nameEn: 'Asyut', nameAr: 'أسيوط', zone: 3, fee: 90, deliveryDays: '3-5 Days' },
  { id: 'sohag', nameEn: 'Sohag', nameAr: 'سوهاج', zone: 3, fee: 95, deliveryDays: '3-5 Days' },
  { id: 'qena', nameEn: 'Qena', nameAr: 'قنا', zone: 3, fee: 95, deliveryDays: '3-5 Days' },
  { id: 'luxor', nameEn: 'Luxor', nameAr: 'الأقصر', zone: 3, fee: 100, deliveryDays: '3-5 Days' },
  { id: 'aswan', nameEn: 'Aswan', nameAr: 'أسوان', zone: 3, fee: 100, deliveryDays: '4-5 Days' },

  // Zone 4: Remote / Coastal
  { id: 'red_sea', nameEn: 'Red Sea (Hurghada / El Gouna)', nameAr: 'البحر الأحمر', zone: 4, fee: 110, deliveryDays: '4-6 Days' },
  { id: 'south_sinai', nameEn: 'South Sinai (Sharm El Sheikh)', nameAr: 'جنوب سيناء', zone: 4, fee: 120, deliveryDays: '4-6 Days' },
  { id: 'north_sinai', nameEn: 'North Sinai', nameAr: 'شمال سيناء', zone: 4, fee: 120, deliveryDays: '4-6 Days' },
  { id: 'matrouh', nameEn: 'Matrouh (North Coast)', nameAr: 'مطروح والساحل الشمالي', zone: 4, fee: 110, deliveryDays: '4-6 Days' },
  { id: 'new_valley', nameEn: 'New Valley', nameAr: 'الوادي الجديد', zone: 4, fee: 130, deliveryDays: '5-7 Days' },
];

export function getShippingByGovernorate(govIdOrName: string): GovernorateShipping {
  const found = EGYPTIAN_GOVERNORATES.find(
    (g) =>
      g.id.toLowerCase() === govIdOrName.toLowerCase() ||
      g.nameEn.toLowerCase() === govIdOrName.toLowerCase() ||
      g.nameAr === govIdOrName
  );
  return found || EGYPTIAN_GOVERNORATES[0]; // Defaults to Cairo
}
