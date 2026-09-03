export interface CodolioProfileData {
  username: string;
  profileUrl: string;
  isLiveAvailable: boolean;
  message: string;
  badge: string;
}

export const VERIFIED_CODOLIO_DATA: CodolioProfileData = {
  username: "codesbysayam",
  profileUrl: "https://codolio.com/profile/codesbysayam",
  isLiveAvailable: false,
  message: "Live statistics unavailable",
  badge: "Verified Developer Node"
};

export async function fetchCodolioProfile(): Promise<CodolioProfileData> {
  try {
    const res = await fetch("/api/codolio/profile");
    if (res.ok) {
      const data = await res.json();
      return data;
    }
    return VERIFIED_CODOLIO_DATA;
  } catch {
    return VERIFIED_CODOLIO_DATA;
  }
}
