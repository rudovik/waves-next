"use client"

import {
  update,
  generateData,
  isFormValid,
  resetFields,
} from "utils/formActions"
import { FormField } from "./FormField"
import { useState } from "react"
import { useGetAllBrandsSuspenseQuery } from "lib/graphql/GetAllBrands.graphql"
import { Brand } from "models/Brand"
import { Suspense } from "react"
import { useAddBrandMutation } from "lib/graphql/AddBrand.graphql"

export const ManageBrands = () => {
  const {
    refetch,
    data: { getAllBrands: brands },
    error: brandsError,
  } = useGetAllBrandsSuspenseQuery()
  const [addBrandMutation, { loading, data, error }] = useAddBrandMutation()

  const [state, setState] = useState(initState)

  function showCategoryItems(brands: Brand[]) {
    // console.log(brands)
    return brands
      ? brands.map((item, i) => (
          <div className="category_item" key={`${item._id}`}>
            {item.name}
          </div>
        ))
      : null
  }

  const updateForm = (element) => {
    const newformdata = update(element, state.formdata, "brands")
    // console.log(newformdata)
    setState({
      formError: false,
      formdata: newformdata,
      formSuccess: false,
    })
  }

  const submitForm = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    let dataToSubmit = generateData(state.formdata, "brands") as {
      [key: string]: any
    }
    let formIsValid = isFormValid(state.formdata, "brands")
    if (formIsValid) {
      // console.log(dataToSubmit)
      const {
        data: {
          addBrand: { success },
        },
      } = await addBrandMutation({
        variables: {
          name: dataToSubmit.name,
        },
      })
      await refetch()

      const newFormdata = resetFields(state.formdata, "brands")
      setState({ ...state, formdata: { ...newFormdata }, formSuccess: true })
    } else {
      setState({ ...state, formError: true })
    }
  }

  return (
    <div className="admin_category_wrapper">
      <h1>Brands</h1>
      <div className="admin_two_column">
        <div className="left">
          {/* <Suspense fallback={"Loading..."}> */}
          <div className="brands_container">{showCategoryItems(brands)}</div>
          {/* </Suspense> */}
        </div>
        <div className="right">
          <form onSubmit={(event) => submitForm(event)}>
            <FormField
              id={"name"}
              formdata={state.formdata.name}
              change={(element) => updateForm(element)}
            />

            {state.formError ? (
              <div className="error_label">Please check your data</div>
            ) : null}
            <button onClick={(event) => submitForm(event)} disabled={false}>
              Add brand
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

const initState = {
  formError: false,
  formSuccess: false,
  formdata: {
    name: {
      element: "input",
      value: "",
      config: {
        name: "name_input",
        type: "text",
        placeholder: "Enter the brand",
      },
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
      validationMessage: "",
    },
  },
}
