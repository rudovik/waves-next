"use client"
import { FormField } from "components/FormField"
import { useGetAllBrandsSuspenseQuery } from "lib/graphql/GetAllBrands.graphql"
import { useGetAllWoodsSuspenseQuery } from "lib/graphql/GetAllWoods.graphql"
import { useGetSortedProductsSuspenseQuery } from "lib/graphql/GetSortedProducts.graphql"
import {
  update,
  generateData,
  isFormValid,
  resetFields,
} from "utils/formActions"
import { SortBy } from "__generated__/__types__"
import { useState } from "react"
import { populateOptionFields } from "utils/formActions"
import { useAddProductMutation } from "lib/graphql/AddProduct.graphql"
import { FileUpload } from "components/FileUpload"

export default function AddProduct() {
  const {
    data: { getAllWoods: woods },
    error: woodsError,
  } = useGetAllWoodsSuspenseQuery()
  const {
    data: { getAllBrands: brands },
    error: brandsError,
  } = useGetAllBrandsSuspenseQuery()

  const [state, setState] = useState(initData)

  const [addProductMutation, { data, loading, error }] =
    useAddProductMutation(/*{
    // variables: {
    //    productInput: {available}
    // },
  }*/)

  if (brands) {
    populateOptionFields(state.formdata, brands, "brand")
    // console.log(newForm)
    // setForm({ ...form, formdata: { ...newFormdata } })
  }
  if (woods) {
    populateOptionFields(state.formdata, woods, "wood")
  }

  const updateForm = (element) => {
    const newformdata = update(element, state.formdata, "products")
    // console.log(newformdata)
    setState({
      formError: false,
      formdata: newformdata,
      formSuccess: false,
    })
  }

  function resetFormFields() {
    const newFormdata = resetFields(state.formdata, "products")
    setState({ ...state, formdata: { ...newFormdata }, formSuccess: true })
    setTimeout(() => {
      setState({ ...state, formSuccess: false })
    }, 3000)
  }

  const submitForm = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    let dataToSubmit = generateData(state.formdata, "products") as {
      [key: string]: any
    }
    let formIsValid = isFormValid(state.formdata, "products")
    if (formIsValid) {
      // console.log(dataToSubmit)

      const {
        data: {
          addProduct: { success },
        },
      } = await addProductMutation({
        variables: {
          productInput: {
            available: dataToSubmit.available,
            brand: dataToSubmit.brand,
            description: dataToSubmit.description,
            frets: dataToSubmit.frets,
            name: dataToSubmit.name,
            price: dataToSubmit.price,
            publish: dataToSubmit.publish,
            shipping: dataToSubmit.shipping,
            wood: dataToSubmit.wood,
            images: dataToSubmit.images,
          },
        },
      })
      resetFormFields()
    } else {
      setState({ ...state, formError: true })
    }
  }

  function imagesHandler(images) {
    // console.log(images)
    const newFormdata = {
      ...state.formdata,
    }
    newFormdata["images"].value = [...images]
    newFormdata["images"].valid = true

    // console.log(newFormdata["images"].value)

    setState((oldState) => {
      return { ...oldState, formdata: { ...newFormdata } }
    })
  }

  return (
    <div>
      <h1>Add product</h1>
      <form onSubmit={(event) => submitForm(event)}>
        <FileUpload
          imagesHandler={(images) => imagesHandler(images)}
          reset={state.formSuccess}
        />

        <FormField
          id={"name"}
          formdata={state.formdata.name}
          change={(element) => updateForm(element)}
        />
        <FormField
          id={"description"}
          formdata={state.formdata.description}
          change={(element) => updateForm(element)}
        />

        <FormField
          id={"price"}
          formdata={state.formdata.price}
          change={(element) => updateForm(element)}
        />

        <div className="form_divider"></div>

        <FormField
          id={"brand"}
          formdata={state.formdata.brand}
          change={(element) => updateForm(element)}
        />

        <FormField
          id={"shipping"}
          formdata={state.formdata.shipping}
          change={(element) => updateForm(element)}
        />

        <FormField
          id={"available"}
          formdata={state.formdata.available}
          change={(element) => updateForm(element)}
        />

        <div className="form_divider"></div>

        <FormField
          id={"wood"}
          formdata={state.formdata.wood}
          change={(element) => updateForm(element)}
        />

        <FormField
          id={"frets"}
          formdata={state.formdata.frets}
          change={(element) => updateForm(element)}
        />

        <div className="form_divider"></div>

        <FormField
          id={"publish"}
          formdata={state.formdata.publish}
          change={(element) => updateForm(element)}
        />

        {state.formSuccess ? <div className="form_success">Success</div> : null}

        {state.formError ? (
          <div className="error_label">Please check your data</div>
        ) : null}
        <button onClick={(event) => submitForm(event)} disabled={false}>
          Add product
        </button>
      </form>
    </div>
  )
}

const initData = {
  formError: false,
  formSuccess: false,
  formdata: {
    name: {
      element: "input",
      value: "",
      config: {
        label: "Product name",
        name: "name_input",
        type: "text",
        placeholder: "Enter your name",
      },
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
      validationMessage: "",
      showlabel: true,
    },
    description: {
      element: "textarea",
      value: "",
      config: {
        label: "Product description",
        name: "description_input",
        type: "text",
        placeholder: "Enter your description",
      },
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
      validationMessage: "",
      showlabel: true,
    },
    price: {
      element: "input",
      value: "",
      config: {
        label: "Product price",
        name: "price_input",
        type: "number",
        placeholder: "Enter your price",
      },
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
      validationMessage: "",
      showlabel: true,
    },
    brand: {
      element: "select",
      value: "",
      config: {
        label: "Product Brand",
        name: "brand_input",
        options: [],
      },
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
      validationMessage: "",
      showlabel: true,
    },
    shipping: {
      element: "select",
      value: "",
      config: {
        label: "Shipping",
        name: "shipping_input",
        type: "boolean",
        options: [
          { key: true, value: "Yes" },
          { key: false, value: "No" },
        ],
      },
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
      validationMessage: "",
      showlabel: true,
    },
    available: {
      element: "select",
      value: "",
      config: {
        label: "Available, in stock.",
        name: "available_input",
        type: "boolean",
        options: [
          { key: true, value: "Yes" },
          { key: false, value: "No" },
        ],
      },
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
      validationMessage: "",
      showlabel: true,
    },
    wood: {
      element: "select",
      value: "",
      config: {
        label: "Wood material",
        name: "wood_input",
        options: [],
      },
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
      validationMessage: "",
      showlabel: true,
    },
    frets: {
      element: "select",
      value: "",
      config: {
        label: "Frets",
        name: "frets_input",
        type: "number",
        options: [
          { key: 20, value: 20 },
          { key: 21, value: 21 },
          { key: 22, value: 22 },
          { key: 24, value: 24 },
        ],
      },
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
      validationMessage: "",
      showlabel: true,
    },
    publish: {
      element: "select",
      value: "",
      config: {
        label: "Publish",
        name: "publish_input",
        type: "boolean",
        options: [
          { key: true, value: "Public" },
          { key: false, value: "Hidden" },
        ],
      },
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
      validationMessage: "",
      showlabel: true,
    },
    images: {
      value: [],
      validation: {
        required: false,
      },
      valid: true,
      touched: false,
      validationMessage: "",
      showlabel: false,
    },
  },
}
