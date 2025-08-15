export const getRelativeTime = (dateString: string): string => {
  const now = new Date();
  
  // Convert UTC time to IST (India Standard Time = UTC+5:30)
  const utcDate = new Date(dateString);
  const istDate = new Date(utcDate.getTime() + (5.5 * 60 * 60 * 1000)); // Add 5.5 hours for IST
  
  const diffInSeconds = Math.floor((now.getTime() - istDate.getTime()) / 1000);

  // Just now (less than 1 minute)
  if (diffInSeconds < 60) {
    return 'just now';
  }

  // Minutes ago
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  // Hours ago
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  // Days ago
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    return 'yesterday';
  }

  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  // Weeks ago
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  }

  // For older dates, show the actual date
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const day = istDate.getDate();
  const month = months[istDate.getMonth()];
  const year = istDate.getFullYear();

  return `${day} ${month} ${year}`;
};

export const getFormattedDateTime = (dateString: string): string => {
  // Convert UTC time to IST (India Standard Time = UTC+5:30)
  const utcDate = new Date(dateString);
  const istDate = new Date(utcDate.getTime() + (5.5 * 60 * 60 * 1000)); // Add 5.5 hours for IST
  
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const day = istDate.getDate();
  const month = months[istDate.getMonth()];
  const year = istDate.getFullYear();
  
  // Format time in 12-hour format with AM/PM
  let hours = istDate.getHours();
  const minutes = istDate.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  
  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  
  return `${day} ${month} ${year}, ${formattedTime}`;
};

export const getDurationBetweenDates = (startDate: string, endDate: string): string => {
  // Convert UTC times to IST
  const utcStartDate = new Date(startDate);
  const utcEndDate = new Date(endDate);
  const istStartDate = new Date(utcStartDate.getTime() + (5.5 * 60 * 60 * 1000));
  const istEndDate = new Date(utcEndDate.getTime() + (5.5 * 60 * 60 * 1000));
  
  const diffInSeconds = Math.floor((istEndDate.getTime() - istStartDate.getTime()) / 1000);
  
  // Less than 1 minute
  if (diffInSeconds < 60) {
    return 'less than 1 minute';
  }
  
  // Minutes
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
  }
  
  // Hours
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''}`;
  }
  
  // Days
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''}`;
  }
  
  // Weeks
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''}`;
  }
  
  // Months
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''}`;
  }
  
  // Years
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''}`;
};
