"use client"

import { useState } from "react"
import { FormField } from "./FormField"
import { update, generateData, isFormValid } from "utils/formActions"
import { useLoginMutation } from "lib/graphql/Login.graphql"
import { useRouter } from "next/navigation"
import { useAuth } from "lib/useAuth"

export default function Login() {
  const [state, setState] = useState(defaultState)
  // const [loginMutation, { data, loading, error }] = useLoginMutation()
  const router = useRouter()
  const {
    login: { login, loading },
  } = useAuth()

  const submitForm = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    let dataToSubmit: { email: string; password: string } = generateData(
      state.formdata,
      "login"
    ) as { email: string; password: string }
    let formIsValid = isFormValid(state.formdata, "login")

    if (formIsValid) {
      // console.log(dataToSubmit)

      await login(dataToSubmit.email, dataToSubmit.password)
      // await loginMutation({
      //   variables: {
      //     input: { email: dataToSubmit.email, password: dataToSubmit.password },
      //   },
      // })
    } else {
      setState({ ...state, formError: true })
    }
  }

  const updateForm = (element) => {
    const newformdata = update(element, state.formdata, "login")
    setState({
      formError: false,
      formdata: newformdata,
      formSuccess: "",
    })
  }

  return (
    <div className="signin_wrapper">
      <form onSubmit={(event) => submitForm(event)}>
        <FormField
          id={"email"}
          formdata={state.formdata.email}
          change={(element) => updateForm(element)}
        />

        <FormField
          id={"password"}
          formdata={state.formdata.password}
          change={(element) => updateForm(element)}
        />

        {state.formError ? (
          <div className="error_label">Please check your data</div>
        ) : null}
        <button onClick={submitForm} disabled={loading}>
          Log In
        </button>
      </form>
    </div>
  )
}

const defaultState = {
  formError: false,
  formSuccess: "",
  formdata: {
    email: {
      element: "input",
      value: "",
      config: {
        name: "email_input",
        type: "email",
        placeholder: "Enter your email",
      },
      validation: {
        required: true,
        email: true,
      },
      valid: false,
      touched: false,
      validationMessage: "",
    },
    password: {
      element: "input",
      value: "",
      config: {
        name: "password_input",
        type: "password",
        placeholder: "Enter your password",
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
