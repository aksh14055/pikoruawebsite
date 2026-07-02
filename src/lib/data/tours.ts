// Canonical list of homepage virtual-tour videos (hosted on the PIKORUA Realty
// YouTube channel). Shared by the VirtualTours client component (rendering) and
// the homepage server component (VideoObject JSON-LD for video rich results).
//
// `uploadDate` is the real YouTube publish date (ISO-8601), required by Google
// for VideoObject rich-result eligibility.

export interface VirtualTour {
  id: string;
  title: string;
  subtitle: string;
  location?: string;
  uploadDate: string;
}

export const STATIC_TOURS: VirtualTour[] = [
  { id: "G17NU0mliT4", title: "Off Thaltej - Shilaj Road",  subtitle: "Smart Sized Luxury 4 BHK Apartments",        uploadDate: "2025-08-11" },
  { id: "mAJ7w6keKSM", title: "Vaishno Devi Circle",         subtitle: "Luxury 4 & 5 BHK Community",                  uploadDate: "2025-09-03" },
  { id: "aWqhcmZqBdc", title: "Off Sindhu Bhavan Road",      subtitle: "Smart Sized Luxury 4 & 5 BHK Apartments",     uploadDate: "2025-09-02" },
  { id: "i0k7ewRHgZk", title: "Off Sindhu Bhavan Road",      subtitle: "Ultra Luxury 4 & 5 BHK Residences",           uploadDate: "2025-08-14" },
  { id: "aWjAEc_rAJU", title: "Thaltej Shilaj Road",         subtitle: "Luxury 4 BHK Apartments",                     uploadDate: "2025-08-04" },
  { id: "GwQq098ICLY", title: "Iskon - Ambli Road",          subtitle: "Iconic 4 BHK & Penthouse",                    uploadDate: "2025-07-30" },
  { id: "RVkRTQj4rw0", title: "Iskon - Ambli Road",          subtitle: "Smart Sized Luxury 4 BHK Residences",         uploadDate: "2025-07-30" },
  { id: "Fbd5LFA6m3I", title: "Ambli - Bopal Road",          subtitle: "Ultra Luxury Bungalow Collection",            uploadDate: "2025-07-22" },
  { id: "Mt3tY4SNJ_M", title: "Science City Road",           subtitle: "Iconic 4 & 5 BHK with Panoramic Views",       uploadDate: "2025-07-21" },
  { id: "b2ZzzwdSbmQ", title: "Sindhu Bhavan Road",          subtitle: "Large & Luxury 4 & 5 BHK Apartments",         uploadDate: "2025-07-12" },
];

// Fast lookup of a known upload date by video id — used to attach a valid
// uploadDate to VideoObject schema when the displayed tour set is dynamic.
export const TOUR_UPLOAD_DATES: Record<string, string> = Object.fromEntries(
  STATIC_TOURS.map((t) => [t.id, t.uploadDate]),
);
