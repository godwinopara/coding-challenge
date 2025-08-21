import * as Yup from "yup"


export const formValidation = Yup.object({
    fullName: Yup.string().matches(/^[A-Za-z\s]+$/, "Full name can only contain letters").required(),
    amount: Yup.number().typeError("Must be a number").positive("Must be positive").required(),
    phoneNumber: Yup.string().matches(/^0[789][01]\d{8}$/, "Please enter a valid Nigerian phone number (e.g., 08012345678)").required(),
    profilePicture: Yup.mixed().required('Profile picture required').test('fileType', 'only jpg, jpeg, png files are allowed', 
        (value) => value && value instanceof File && ['image/jpeg', 'image/jpg', 'image/png'].includes(value.type))
})