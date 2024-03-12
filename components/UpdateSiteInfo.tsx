"use client"

import { update, generateData, isFormValid } from "utils/formActions"
import { FormField } from "components/FormField"
import { useState } from "react"
import { useGetSiteDataSuspenseQuery } from "lib/graphql/GetSiteData.graphql"
import { useUpdateSiteInfoMutation } from "lib/graphql/UpdateSiteInfo.graphql"

export const UpdateSiteInfo = () => {
  const {
    data: {
      getSiteData: {
        siteInfo: [{ address, email, hours, phone }],
      },
    },
    refetch: refetchSiteInfo,
  } = useGetSiteDataSuspenseQuery()

  const [updateSiteInfo, { loading, data, error }] = useUpdateSiteInfoMutation()

  const [state, setState] = useState({
    formError: false,
    formSuccess: false,
    formdata: {
      address: {
        element: "input",
        value: address,
        config: {
          label: "Address",
          name: "address_input",
          type: "text",
          placeholder: "Enter the site address",
        },
        validation: {
          required: true,
        },
        valid: true,
        touched: true,
        validationMessage: "",
        showlabel: true,
      },
      hours: {
        element: "input",
        value: hours,
        config: {
          label: "Working hours",
          name: "hours_input",
          type: "text",
          placeholder: "Enter the site working hours",
        },
        validation: {
          required: true,
        },
        valid: true,
        touched: true,
        validationMessage: "",
        showlabel: true,
      },
      phone: {
        element: "input",
        value: phone,
        config: {
          label: "Phone number",
          name: "phone_input",
          type: "text",
          placeholder: "Enter the phone number",
        },
        validation: {
          required: true,
        },
        valid: true,
        touched: true,
        validationMessage: "",
        showlabel: true,
      },
      email: {
        element: "input",
        value: email,
        config: {
          label: "Shop email",
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
        showlabel: true,
      },
    },
  })

  const updateForm = (element) => {
    const newformdata = update(element, state.formdata, "site_info")
    setState({
      formError: false,
      formdata: newformdata,
      formSuccess: false,
    })
  }

  const submitForm = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    let dataToSubmit = generateData(state.formdata, "site_info") as {
      [key: string]: any
    }
    let formIsValid = isFormValid(state.formdata, "site_info")

    if (formIsValid) {
      // console.log(dataToSubmit)

      const {
        data: {
          updateSiteInfo: { success },
        },
      } = await updateSiteInfo({
        variables: {
          name: "site info",
          siteInfoInput: {
            email: dataToSubmit.email,
            address: dataToSubmit.address,
            phone: dataToSubmit.phone,
            hours: dataToSubmit.hours,
          },
        },
      })
      if (success) {
        await refetchSiteInfo()
        setState({ ...state, formSuccess: success })
        setTimeout(() => {
          setState({ ...state, formSuccess: false })
        }, 2000)
      }
    } else {
      setState({ ...state, formError: true })
    }
  }

  return (
    <>
      <h1>Site Info</h1>
      <div>
        <form onSubmit={(event) => submitForm(event)}>
          <FormField
            id={"address"}
            formdata={state.formdata.address}
            change={(element) => updateForm(element)}
          />
          <FormField
            id={"hours"}
            formdata={state.formdata.hours}
            change={(element) => updateForm(element)}
          />
          <FormField
            id={"phone"}
            formdata={state.formdata.phone}
            change={(element) => updateForm(element)}
          />
          <FormField
            id={"email"}
            formdata={state.formdata.email}
            change={(element) => updateForm(element)}
          />
          <div>
            {state.formSuccess ? (
              <div className="form_success">Success</div>
            ) : null}
            {state.formError ? (
              <div className="error_label">Please check your data</div>
            ) : null}
            <button onClick={submitForm} disabled={loading}>
              Update
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
