"use client"

import { FormField } from "components/FormField"
import { useState } from "react"
import { update, generateData, isFormValid } from "utils/formActions"
import { useRegisterMutation } from "lib/graphql/Register.graphql"
import { useRouter } from "next/navigation"
import Dialog from "@mui/material/Dialog"

export const Register = () => {
  const [state, setState] = useState(defaultState)
  const [registerUser, { loading, data, error }] = useRegisterMutation()
  const router = useRouter()

  const updateForm = (element) => {
    const newformdata = update(element, state.formdata, "register")
    setState({
      formError: false,
      formdata: newformdata,
      formSuccess: false,
    })
  }

  const submitForm = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    let dataToSubmit = generateData(state.formdata, "register") as {
      [key: string]: any
    }
    let formIsValid = isFormValid(state.formdata, "register")

    if (formIsValid) {
      // console.log(dataToSubmit)
      const data = await registerUser({
        variables: {
          input: {
            email: dataToSubmit.email,
            password: dataToSubmit.password,
            name: dataToSubmit.name,
            lastname: dataToSubmit.lastname,
          },
        },
      })
      if (!loading && data) {
        setState({ ...state, formError: false, formSuccess: true })
        setTimeout(() => {
          router.push("/register_login")
        }, 3000)
      }
    } else {
      setState({ ...state, formError: true })
    }
  }

  return (
    <div className="page_wrapper">
      <div className="container">
        <div className="register_login_container">
          <div className="left">
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
              <h2>Verify Password</h2>
              <div className="form_block_two">
                <div className="block">
                  <FormField
                    id={"password"}
                    formdata={state.formdata.password}
                    change={(element) => updateForm(element)}
                  />
                </div>
                <div className="block">
                  <FormField
                    id={"confirmPassword"}
                    formdata={state.formdata.confirmPassword}
                    change={(element) => updateForm(element)}
                  />
                </div>
              </div>
              <div>
                {state.formError ? (
                  <div className="error_label">Please check your data</div>
                ) : null}
                <button onClick={submitForm} disabled={false}>
                  Create an account
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Dialog open={state.formSuccess}>
        <div className="dialog_alert">
          <div>Congratulations!!!</div>
          <div>You will be redirected to the LOGIN in a couple seconds...</div>
        </div>
      </Dialog>
    </div>
  )
}

const defaultState = {
  formError: false,
  formSuccess: false,
  formdata: {
    name: {
      element: "input",
      value: "",
      config: {
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
    },
    lastname: {
      element: "input",
      value: "",
      config: {
        lastname: "lastname_input",
        type: "text",
        placeholder: "Enter your lastname",
      },
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
      validationMessage: "",
    },
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
    confirmPassword: {
      element: "input",
      value: "",
      config: {
        name: "confirm_password_input",
        type: "password",
        placeholder: "Confirm your password",
      },
      validation: {
        required: true,
        confirm: "password",
      },
      valid: false,
      touched: false,
      validationMessage: "",
    },
  },
}
