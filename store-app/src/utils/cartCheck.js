// Utility functions for card and expiry validation
export function luhnCheck(cardNumber = "") {
  const digits = String(cardNumber).replace(/\D/g, "");
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = parseInt(digits.charAt(i), 10);
    if (shouldDouble) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

export function validateExpiryMonthYear(month, year) {
  if (!month || !year) return "Ay ve yıl seçilmeli";
  const mm = parseInt(month, 10);
  const yy = parseInt(year, 10);
  if (isNaN(mm) || mm < 1 || mm > 12) return "Geçersiz ay";
  if (isNaN(yy) || yy < 1900) return "Geçersiz yıl";

  const now = new Date();
  const expiry = new Date(yy, mm - 1, 1);
  // move to end of month
  expiry.setMonth(expiry.getMonth() + 1);
  expiry.setDate(0);
  // if expiry end of month is before today -> expired
  if (expiry < now) return "Kartın son kullanma tarihi geçmiş";
  return true;
}

export function monthsOptions() {
  // start from next month relative to current date
  const now = new Date();
  const start = now.getMonth() + 1; // 0-based -> next month (1..12)
  return Array.from({ length: 12 }, (_, i) => {
    const m = ((start + i - 1) % 12) + 1; // 1..12 cyclic
    const label = String(m).padStart(2, "0");
    return { value: label, label };
  });
}

export function yearsOptions(range = 12) {
  const y = new Date().getFullYear();
  return Array.from({ length: range }, (_, i) => ({
    value: String(y + i),
    label: String(y + i),
  }));
}
