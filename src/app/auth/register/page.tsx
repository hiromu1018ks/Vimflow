import { useState } from "react";

interface PasswordValidation {
  length : boolean;
  uppercase : boolean;
  lowercase : boolean;
  number : boolean;
}

export default function RegisterPage() {
  const [ formData, setFormData ] = useState({
    name : "",
    email : "",
    password : "",
    confirmPassword : ""
  });
  const [ isLoading, setIsLoading ] = useState(false);
  const [ showPassword, setShowPassword ] = useState(false);
  const [ showConfirmPassword, setShowConfirmPassword ] = useState(false);
  const [ error, setError ] = useState("");
  const [ success, setSuccess ] = useState(false);

  const validatedPassword = (password : string) : PasswordValidation => {
    return {
      length : password.length >= 8,
      uppercase : /[A-Z]/.test(password),
      lowercase : /[a-z]/.test(password),
      number : /\d/.test(password)
    };
  };

  const passwordValidation = validatedPassword(formData.password);
  const isPasswordValid = Object.values(passwordValidation).every(Boolean);
  const isPasswordMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== "";

}