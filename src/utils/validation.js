// Form validation utilities

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return 'E-posta adresi gereklidir';
  }
  if (!emailRegex.test(email)) {
    return 'Geçerli bir e-posta adresi girin';
  }
  return null;
};

export const validatePhone = (phone) => {
  // Turkish phone number format: 0xxx xxx xx xx or +90xxx xxx xx xx
  const phoneRegex = /^(\+90|0)?[0-9]{10}$/;
  const cleanPhone = phone.replace(/[\s()-]/g, '');

  if (!phone) {
    return 'Telefon numarası gereklidir';
  }
  if (!phoneRegex.test(cleanPhone)) {
    return 'Geçerli bir telefon numarası girin (örn: 0555 123 45 67)';
  }
  return null;
};

export const validateRequired = (value, fieldName = 'Bu alan') => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} gereklidir`;
  }
  return null;
};

export const validateMinLength = (value, minLength, fieldName = 'Bu alan') => {
  if (value && value.length < minLength) {
    return `${fieldName} en az ${minLength} karakter olmalıdır`;
  }
  return null;
};

export const validateMaxLength = (value, maxLength, fieldName = 'Bu alan') => {
  if (value && value.length > maxLength) {
    return `${fieldName} en fazla ${maxLength} karakter olmalıdır`;
  }
  return null;
};

export const validateDate = (date, options = {}) => {
  const { minDate, maxDate, futureOnly = false, pastOnly = false } = options;

  if (!date) {
    return 'Tarih seçimi gereklidir';
  }

  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (futureOnly && selectedDate < today) {
    return 'Geçmiş bir tarih seçilemez';
  }

  if (pastOnly && selectedDate > today) {
    return 'Gelecek bir tarih seçilemez';
  }

  if (minDate && selectedDate < new Date(minDate)) {
    return `Tarih ${new Date(minDate).toLocaleDateString('tr-TR')} tarihinden önce olamaz`;
  }

  if (maxDate && selectedDate > new Date(maxDate)) {
    return `Tarih ${new Date(maxDate).toLocaleDateString('tr-TR')} tarihinden sonra olamaz`;
  }

  return null;
};

export const validateForm = (formData, validationRules) => {
  const errors = {};

  Object.keys(validationRules).forEach(field => {
    const rules = validationRules[field];
    const value = formData[field];

    for (const rule of rules) {
      const error = rule(value);
      if (error) {
        errors[field] = error;
        break; // Stop at first error for this field
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Format phone number for display
export const formatPhoneNumber = (phone) => {
  const cleaned = phone.replace(/[\s()-]/g, '');

  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{4})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4');
  }

  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    return cleaned.replace(/(\d{4})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4');
  }

  return phone;
};

// Sanitize input (prevent XSS)
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;

  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};
