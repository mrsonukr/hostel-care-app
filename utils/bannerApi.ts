// Banner API service
export interface Banner {
  id: number;
  img_url: string;
  link: string | null;
  hostel: string;
  created_at: string;
  uploaded_by: number;
  uploaded_by_name: string;
  uploaded_by_email: string;
}

export interface BannerResponse {
  message: string;
  hostel: string;
  banners: Banner[];
  count: number;
}

const BANNER_API_BASE_URL = 'https://admin.mssonutech.workers.dev';

export const fetchBanners = async (hostelName: string): Promise<BannerResponse> => {
  try {
    const response = await fetch(`${BANNER_API_BASE_URL}/banners/${hostelName}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch banners: ${response.status}`);
    }
    
    const data: BannerResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching banners:', error);
    throw error;
  }
};

export const openBannerLink = (link: string | null) => {
  if (!link || link.trim() === '') {
    console.log('No link available for this banner');
    return;
  }
  
  // Clean the link - remove @ symbol if present
  const cleanLink = link.replace(/^@/, '');
  
  // Open the link in browser
  // Note: In React Native, you would use Linking.openURL(cleanLink)
  // For now, we'll just log it
  console.log('Opening banner link:', cleanLink);
  
  // In a real implementation, you would use:
  // import { Linking } from 'react-native';
  // Linking.openURL(cleanLink);
};
