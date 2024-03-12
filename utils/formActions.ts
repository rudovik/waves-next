export const validate = (element, formdata = []) => {
  let error = [true, ""]

  if (element.validation.email) {
    const valid = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(element.value)
    const message = `${!valid ? "Must be a valid email" : ""}`
    error = !valid ? [valid, message] : error
  }

  if (element.validation.required) {
    const valid = element.value.trim() !== ""
    const message = `${!valid ? "This field is required" : ""}`
    error = !valid ? [valid, message] : error
  }

  if (element.validation.confirm) {
    const valid =
      element.value.trim() === formdata[element.validation.confirm].value
    const message = `${!valid ? "Passwords do not match" : ""}`
    error = !valid ? [valid, message] : error
  }

  return error
}

export const update = (element, formdata, formName) => {
  const newFormdata = {
    ...formdata,
  }
  const newElement = {
    ...newFormdata[element.id],
  }

  if (newElement.config.type === "number") {
    newElement.value = parseInt(element.event.target.value, 10)
  } else if (newElement.config.type === "boolean") {
    const curValue = element.event.target.value
    curValue === "true" ? (newElement.value = true) : (newElement.value = false)
  } else {
    newElement.value = element.event.target.value
  }

  const valueToCheck = newElement.value + ""

  if (element.blur) {
    let validData = validate({ ...newElement, value: valueToCheck }, formdata)
    newElement.valid = validData[0]
    newElement.validationMessage = validData[1]
  }

  newElement.touched = element.blur
  newFormdata[element.id] = newElement

  return newFormdata
}

export const generateData = (formdata, formName) => {
  let dataToSubmit = {}

  for (let key in formdata) {
    if (key !== "confirmPassword") dataToSubmit[key] = formdata[key].value
  }

  return dataToSubmit
}

export const isFormValid = (formdata, formName) => {
  let formIsValid = true

  for (let key in formdata) {
    formIsValid = formdata[key].valid && formIsValid
  }

  return formIsValid
}

export const populateOptionFields = (formdata, arrayData = [], field) => {
  // console.log(formdata, arrayData, field)
  const newArray = []
  const newFormdata = { ...formdata }

  arrayData.forEach((item) => {
    newArray.push({ key: item._id, value: item.name })
  })

  newFormdata[field].config.options = [...newArray]
  // console.log(newFormdata)
  return { ...newFormdata }
}

export const resetFields = (formdata, formname) => {
  const newFormdata = { ...formdata }

  for (let key in newFormdata) {
    if (key === "images") {
      newFormdata[key].value = []
    } else {
      newFormdata[key].value = ""
    }
    newFormdata[key].valid = false
    newFormdata[key].touched = false
    newFormdata[key].validationMessage = ""
  }

  return newFormdata
}

export const populateField = (formdata, fields) => {
  for (let key in formdata) {
    formdata[key].value = fields[key]
    formdata[key].valid = true
    formdata[key].touched = true
    formdata[key].validationMessage = ""
  }
  return formdata
}
