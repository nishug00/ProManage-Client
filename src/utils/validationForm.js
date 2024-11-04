// import { toast } from 'react-toastify';
import toast, { Toaster } from 'react-hot-toast';
// Validation for Login Form
export const validationForLoginForm = (email, password) => {
    const errors = { email: '', password: '' };
  
    // Check if all fields are filled
    if (!email || !password) {
      if (!email) errors.email = "Email is required";
      if (!password) errors.password = "Password is required";
      toast.error("Please fill in all fields");
      return { valid: false, errors };
    }
  
    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    // Validate email format
    if (!emailRegex.test(email)) {
      errors.email = "Please enter a valid email address";
      toast.error("Please enter a valid email address");
      return { valid: false, errors };
    }
  
    return { valid: true, errors }; // If all validations pass
  };
  

// Validation for Register Form
  export const validationForRegisterForm = (username, email, password, confirmPassword) => {
    if (!username || !email || !password || !confirmPassword) {
        toast.error("Please fill in all fields");
        return { valid: false, errorMessages: {} };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    if (!emailRegex.test(email)) {
        toast.error("Please enter a valid email address");
         return { valid: false, errorMessages: { email: "Please enter a valid email address" } };
    }

    if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return { valid: false, errorMessages: { confirmPassword: "Passwords do not match" } };
    }

      if (!passwordRegex.test(password)) {
          toast.error("Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.");
          return { valid: false, errorMessages: { password: "Password must meet complexity requirements." } };
      }

      return { valid: true, errorMessages: {} };
  };

  //validation for add People email
  export const validationForAddPeople = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        toast.error("Please enter a valid email address");
        return { valid: false };
    }
    return { valid: true };
  };
