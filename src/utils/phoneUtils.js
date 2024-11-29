export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  // Remove any non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Remove leading zero if present and add +254
  if (cleaned.startsWith('0')) {
    return '+254' + cleaned.substring(1);
  }
  
  // If number already starts with 254, add + sign
  if (cleaned.startsWith('254')) {
    return '+' + cleaned;
  }
  
  // If it's just a 9-digit number, assume it's a Kenyan number without prefix
  if (cleaned.length === 9) {
    return '+254' + cleaned;
  }
  
  // Return original number with + if no other rules match
  return '+' + cleaned;
};
