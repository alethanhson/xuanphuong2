import { FALLBACK_HERO_SLIDES } from '../constants';

/**
 * Loại dữ liệu cho slide trong hero section
 */
export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  buttonText?: string;
  buttonLink?: string;
  cta?: {
    primary?: {
      text: string;
      link: string;
    };
    secondary?: {
      text: string;
      link: string;
    };
  };
}

/**
 * Cài đặt của hero section
 */
interface HeroSectionSettings {
  slides: HeroSlide[];
}

/**
 * Service quản lý cài đặt website
 */
export class WebsiteSettingsService {
  /**
   * Lấy cài đặt cho hero section
   */
  static async getHeroSectionSettings() {
    try {
      // TODO: Thay thế bằng API call thực tế khi có backend
      // const response = await fetch('/api/settings/hero-section');
      // const data = await response.json();
      
      // Giả lập độ trễ API
      await new Promise(resolve => setTimeout(resolve, 200));

      return {
        data: {
          slides: FALLBACK_HERO_SLIDES
        },
        error: null
      };
    } catch (error) {
      console.error('Error fetching hero section settings:', error);
      return {
        data: {
          slides: FALLBACK_HERO_SLIDES
        },
        error
      };
    }
  }
  
  /**
   * Lấy cài đặt chung của website
   */
  static async getGeneralSettings() {
    // Giả lập kết nối API
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return {
      data: {
        siteName: 'Tân Tiến Vinh',
        siteDescription: 'Giải pháp CNC toàn diện cho ngành gỗ và kim loại tại Việt Nam',
        contactEmail: 'contact@tantienvinh.com',
        contactPhone: '0909 123 456',
        address: '123 Đường Lê Văn Lương, Quận 7, TP. Hồ Chí Minh',
        socialLinks: {
          facebook: 'https://facebook.com/tantienvinh',
          youtube: 'https://youtube.com/tantienvinh',
          zalo: 'https://zalo.me/tantienvinh'
        }
      },
      error: null
    };
  }
} 