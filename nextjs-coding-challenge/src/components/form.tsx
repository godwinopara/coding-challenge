import { ChangeEvent, useRef } from "react";
import InputField from "@/components/input-field";
import { useFormik } from "formik";
import { formValidation } from "@/validations/form-validation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { FaHashtag } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import FormError from "../features/form/form-error";
import FormImageUpload from "@/features/form/form-image-upload";

export interface IFormState {
  fullName: string;
  amount: string;
  phoneNumber: string;
  profilePicture: File | null;
}

export interface IFormProps {
  submitForm: (formState: IFormState) => void; // Function to handle form submission
}

export default function Form({ submitForm }: IFormProps) {
  // Create a reference to access the hidden file input element
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Set up form management with Formik
  const formik = useFormik({
    // Initial empty values for all form fields
    initialValues: {
      fullName: "",
      amount: "",
      phoneNumber: "",
      profilePicture: null,
    },
    // Apply validation rules from external validation schema
    validationSchema: formValidation,
    // Handle form submission
    onSubmit: (values, { resetForm }) => {
      // Add current date to the form data
      const records = { ...values, date: new Date() };
      submitForm(records);
      // Clear all form fields after successful submission
      resetForm();
      formik.setFieldValue("profilePicture", null);
    },
  });

  // Handle file selection when user picks an image
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    // Update the profilePicture field in formik state
    formik.setFieldValue("profilePicture", file);
  };

  return (
    <form
      className="bg-card border border-black rounded-xl p-5 shadow-lg space-y-4 backdrop-blur-sm"
      onSubmit={formik.handleSubmit}
    >
      {/* ========== Full Name Input Field =============== */}
      <div>
        <InputField
          id="fullName"
          label="Full Name"
          type="text"
          icon={<FaUser />}
          className="pl-10"
          value={formik.values.fullName}
          onChange={formik.handleChange} // Update formik state on input
          onBlur={formik.handleBlur} //Track when field loses focus for validation
        />

        {/* Show error message if field was touched and has validation error */}

        {formik.touched.fullName && formik.errors.fullName && (
          <FormError error={formik.errors.fullName} />
        )}
      </div>

      {/* ============== Amount Input Field ============== */}
      <div>
        <InputField
          id="amount"
          label="Amount"
          type="number"
          icon={<FaHashtag />}
          className="pl-10"
          value={formik.values.amount}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />

        {/* Show error message if field was touched and has validation error */}
        {formik.touched.amount && formik.errors.amount && (
          <FormError error={formik.errors.amount} />
        )}
      </div>

      {/* ============== Phone Number Input Field ============= */}
      <div className="relative">
        <InputField
          id="phoneNumber"
          label="Phone Number"
          type="tel"
          icon="🇳🇬"
          className="pl-10"
          value={formik.values.phoneNumber}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {/* Show error message if field was touched and has validation error */}
        {formik.touched.phoneNumber && formik.errors.phoneNumber && (
          <FormError error={formik.errors.phoneNumber} />
        )}
      </div>

      {/* ===============  Profile Picture ============== */}
      <div>
        {/* Hidden file input - not visible to user */}
        <Input
          type="file"
          accept=".png,.jpg,.jpeg"
          hidden
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        <div className="space-y-2">
          <label className="block text-sm text-center font-semibold text-foreground mb-3">
            Profile Picture
          </label>
          <input
            type="file"
            accept=".png,.jpg,.jpeg"
            hidden
            ref={fileInputRef}
            onChange={handleFileChange}
          />

          {/* Clickable area that triggers file selection */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative group cursor-pointer"
          >
            {/* Component to display uploaded image or upload placeholder */}
            <FormImageUpload file={formik.values.profilePicture} />
          </div>

          {/* Show error message if field was touched and has validation error */}
          {formik.touched.profilePicture && formik.errors.profilePicture && (
            <FormError error={formik.errors.profilePicture} />
          )}
        </div>
      </div>
      
      {/* Submit Button */}
      <Button
        className="w-full bg-white border border-black cursor-pointer text-primary rounded-lg px-6 py-3 font-semibold text-sm hover:bg-white/90 transform hover:scale-[1.02] active:scale-[0.98] shadow-md disabled:cursor-not-allowed"
        type="submit"
      >
        Submit
      </Button>
    </form>
  );
}
