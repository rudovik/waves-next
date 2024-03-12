"use client"

import {
  update,
  generateData,
  isFormValid,
  resetFields,
} from "utils/formActions"
import { FormField } from "./FormField"
import { useState } from "react"
import { useGetAllWoodsSuspenseQuery } from "lib/graphql/GetAllWoods.graphql"
import { Wood } from "models/Wood"
import { Suspense } from "react"
import { useAddWoodMutation } from "lib/graphql/AddWood.graphql"

export const ManageWoods = () => {
  const [state, setState] = useState(initState)
  const {
    refetch,
    data: { getAllWoods: woods },
    error: brandsError,
  } = useGetAllWoodsSuspenseQuery()
  const [addWoodMutation, { loading, data, error }] = useAddWoodMutation()

  function showCategoryItems(woods: Wood[]) {
    // console.log(brands)
    return woods
      ? woods.map((item, i) => (
          <div className="category_item" key={`${item._id}`}>
            {item.name}
          </div>
        ))
      : null
  }

  const updateForm = (element) => {
    const newformdata = update(element, state.formdata, "woods")
    // console.log(newformdata)
    setState({
      formError: false,
      formdata: newformdata,
      formSuccess: false,
    })
  }

  const submitForm = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    let dataToSubmit = generateData(state.formdata, "woods") as {
      [key: string]: any
    }
    let formIsValid = isFormValid(state.formdata, "woods")
    if (formIsValid) {
      // console.log(dataToSubmit)
      const {
        data: {
          addWood: { success },
        },
      } = await addWoodMutation({
        variables: {
          name: dataToSubmit.name,
        },
      })
      await refetch()

      const newFormdata = resetFields(state.formdata, "woods")
      setState({ ...state, formdata: { ...newFormdata }, formSuccess: true })
    } else {
      setState({ ...state, formError: true })
    }
  }

  return (
    <div className="admin_category_wrapper">
      <h1>Woods</h1>
      <div className="admin_two_column">
        <div className="left">
          {/* <Suspense fallback={"Loading..."}> */}
          <div className="brands_container">{showCategoryItems(woods)}</div>
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
              Add wood
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
        placeholder: "Enter the wood",
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
