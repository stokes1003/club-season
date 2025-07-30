export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function getEmailValidationMessage(email: string): string | null {
  if (!email) {
    return "Email is required";
  }

  if (!isValidEmail(email)) {
    return "Please enter a valid email address";
  }

  return null;
}

export interface PasswordValidation {
  isValid: boolean;
  errors: string[];
  strength: "weak" | "medium" | "strong";
}

export function validatePassword(password: string): PasswordValidation {
  const errors: string[] = [];

  if (!password) {
    return {
      isValid: false,
      errors: ["Password is required"],
      strength: "weak",
    };
  }

  if (password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  // Optional: Check for at least one letter and one number
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);

  if (!hasLetter) {
    errors.push("Password must contain at least one letter");
  }

  if (!hasNumber) {
    errors.push("Password must contain at least one number");
  }

  // Calculate strength (more lenient)
  let strength: "weak" | "medium" | "strong" = "weak";
  const hasLength = password.length >= 6;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const criteriaMet = [
    hasLength,
    hasLetter,
    hasNumber,
    hasUpper,
    hasLower,
    hasSpecial,
  ].filter(Boolean).length;

  if (criteriaMet >= 4) {
    strength = "strong";
  } else if (criteriaMet >= 2) {
    strength = "medium";
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength,
  };
}

export function getPasswordStrengthColor(
  strength: "weak" | "medium" | "strong"
): string {
  switch (strength) {
    case "weak":
      return "#ff4444";
    case "medium":
      return "#ffaa00";
    case "strong":
      return "#00aa44";
    default:
      return "#666666";
  }
}

export function getPasswordStrengthText(
  strength: "weak" | "medium" | "strong"
): string {
  switch (strength) {
    case "weak":
      return "Weak";
    case "medium":
      return "Medium";
    case "strong":
      return "Strong";
    default:
      return "";
  }
}
