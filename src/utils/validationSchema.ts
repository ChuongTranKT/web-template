import * as Yup from "yup"

// Danh sách các trường bắt buộc và tuỳ chọn
const requiredFields = [
  "company_name",
  "logo",
  "slogan",
  "description",
  "address",
  "phone",
  "map",
]

const optionalFields = ["history", "open_time", "vision", "email"]

const urlFields = [
  "facebook_link",
  "twitter_link",
  "instagram_link",
  "linkedin_link",
]

const ConfigValidationSchema = Yup.object({
  ...requiredFields.reduce(
    (acc, field) => ({
      ...acc,
      [field]: Yup.string().required(`${field.replace("_", " ")} là bắt buộc`),
    }),
    {}
  ),
  ...optionalFields.reduce(
    (acc, field) => ({
      ...acc,
      [field]: Yup.string().optional(),
    }),
    {}
  ),
  ...urlFields.reduce(
    (acc, field) => ({
      ...acc,
      [field]: Yup.string()
        .url(`${field.replace("_", " ")} phải là URL hợp lệ`)
        .optional(),
    }),
    {}
  ),
  phone: Yup.string()
    .matches(/^(\+?\d{1,4}|\d{1,4})?\s?\d{9,12}$/, "Số điện thoại không hợp lệ")
    .required("Số điện thoại là bắt buộc"),
})

export default ConfigValidationSchema
