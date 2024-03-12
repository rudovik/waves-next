"use client"

import { FormField } from "./FormField"
import { update, generateData, isFormValid } from "utils/formActions"
import { useState, useEffect } from "react"
import { useAuth } from "lib/useAuth"
import { useUpdateProfileMutation } from "lib/graphql/UpdateProfile.graphql"

export const UpdatePersonalInfo = () => {
  const { user, refetchAuth } = useAuth()
  const [state, setState] = useState({
    formError: false,
    formSuccess: false,
    formdata: {
      name: {
        element: "input",
        value: user.name,
        config: {
          name: "name_input",
          type: "text",
          placeholder: "Enter your name",
        },
        validation: {
          required: true,
        },
        valid: true,
        touched: true,
        validationMessage: "",
      },
      lastname: {
        element: "input",
        value: user.lastname,
        config: {
          lastname: "lastname_input",
          type: "text",
          placeholder: "Enter your lastname",
        },
        validation: {
          required: true,
        },
        valid: true,
        touched: true,
        validationMessage: "",
      },
      email: {
        element: "input",
        value: user.email,
        config: {
          name: "email_input",
          type: "email",
          placeholder: "Enter your email",
        },
        validation: {
          required: true,
          email: true,
        },
        valid: true,
        touched: true,
        validationMessage: "",
      },
    },
  })
  const [updateProfile, { loading }] = useUpdateProfileMutation()

  // useEffect(() => {
  //   user && populateField(state.formdata, user)
  // }, [])

  // if (typeof window === "undefined") {
  //   user && populateField(state.formdata, user)
  // }

  const updateForm = (element) => {
    const newformdata = update(element, state.formdata, "update_ user")
    // console.log(newformdata)
    setState({
      formError: false,
      formdata: newformdata,
      formSuccess: false,
    })
  }

  const submitForm = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    let dataToSubmit = generateData(state.formdata, "update_user") as {
      [key: string]: any
    }
    let formIsValid = isFormValid(state.formdata, "update_user")

    if (formIsValid) {
      // console.log(dataToSubmit)
      const {
        data: {
          updateProfile: { success },
        },
      } = await updateProfile({
        variables: {
          profileInput: {
            email: dataToSubmit.email,
            name: dataToSubmit.name,
            lastname: dataToSubmit.lastname,
          },
        },
      })

      if (success) {
        await refetchAuth()
        setState((oldState) => {
          setTimeout(() => {
            setState((oldState) => {
              return { ...oldState, formSuccess: false }
            })
          }, 2000)
          return { ...oldState, formSuccess: success }
        })
      }
    } else {
      setState({ ...state, formError: true })
    }
  }

  return (
    <div>
      <form onSubmit={(event) => submitForm(event)}>
        <h2>Personal information</h2>
        <div className="form_block_two">
          <div className="block">
            <FormField
              id={"name"}
              formdata={state.formdata.name}
              change={(element) => updateForm(element)}
            />
          </div>
          <div className="block">
            <FormField
              id={"lastname"}
              formdata={state.formdata.lastname}
              change={(element) => updateForm(element)}
            />
          </div>
        </div>
        <div>
          <FormField
            id={"email"}
            formdata={state.formdata.email}
            change={(element) => updateForm(element)}
          />
        </div>
        <div>
          {state.formSuccess ? (
            <div className="form_success">Success</div>
          ) : null}
          {state.formError ? (
            <div className="error_label">Please check your data</div>
          ) : null}
          <button onClick={submitForm} disabled={loading}>
            Update personal info
          </button>
        </div>
      </form>
    </div>
  )
}
