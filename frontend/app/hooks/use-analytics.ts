import { useAnalytics } from '@/components/analytics-provider';

/**
 * Hook để theo dõi sự kiện analytics từ các component khác
 */
export function useTracker() {
  const { isEnabled, isReady, trackEvent } = useAnalytics();

  /**
   * Theo dõi sự kiện click
   * @param elementId ID hoặc tên của phần tử được click
   * @param additionalData Dữ liệu bổ sung để gửi đi
   */
  const trackClick = (elementId: string, additionalData: Record<string, any> = {}) => {
    trackEvent('click', {
      element_id: elementId,
      ...additionalData
    });
  };

  /**
   * Theo dõi sự kiện form submission
   * @param formName Tên của form
   * @param success Xác định form đã submit thành công hay chưa
   * @param additionalData Dữ liệu bổ sung để gửi đi
   */
  const trackFormSubmit = (formName: string, success: boolean, additionalData: Record<string, any> = {}) => {
    trackEvent('form_submit', {
      form_name: formName,
      success,
      ...additionalData
    });
  };

  /**
   * Theo dõi thời gian người dùng xem phần tử trên trang
   * @param elementId ID hoặc tên của phần tử được xem
   * @param timeInSeconds Thời gian xem (giây)
   */
  const trackViewDuration = (elementId: string, timeInSeconds: number) => {
    trackEvent('view_duration', {
      element_id: elementId,
      time_seconds: timeInSeconds
    });
  };

  /**
   * Theo dõi tương tác với video
   * @param videoId ID của video
   * @param action Hành động: 'play', 'pause', 'complete', etc.
   * @param currentTime Thời gian hiện tại của video (giây)
   */
  const trackVideo = (videoId: string, action: 'play' | 'pause' | 'complete' | 'seek', currentTime: number) => {
    trackEvent('video_interaction', {
      video_id: videoId,
      action,
      current_time: currentTime
    });
  };
  
  /**
   * Theo dõi tìm kiếm
   * @param query Truy vấn tìm kiếm
   * @param resultCount Số lượng kết quả trả về
   */
  const trackSearch = (query: string, resultCount: number) => {
    trackEvent('search', {
      search_query: query,
      result_count: resultCount
    });
  };

  return {
    isEnabled,
    isReady,
    trackEvent,
    trackClick,
    trackFormSubmit,
    trackViewDuration,
    trackVideo,
    trackSearch
  };
}

export default useTracker; 