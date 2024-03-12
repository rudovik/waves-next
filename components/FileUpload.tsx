"use client"

import Dropzone from "react-dropzone"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons"
import CircularProgress from "@mui/material/CircularProgress"
import { useEffect, useState } from "react"
import { useRemoveImageMutation } from "lib/graphql/RemoveImage.graphql"

export const FileUpload = ({ imagesHandler, reset }) => {
  const [state, setState] = useState({ uploading: false, uploadedFiles: [] })
  const [uploading, setUploading] = useState(false)
  const [files, setFiles] = useState([])

  const [removeImageMutation, { data, loading: imageRemoving, error }] =
    useRemoveImageMutation()

  useEffect(() => {
    if (files.length > 0) {
      // console.log(files)
      imagesHandler([...files])
    }
  }, [files])

  useEffect(() => {
    if (reset) {
      setFiles([])
    }
  }, [reset])

  async function onDrop(receivedFiles: File[]) {
    // console.log(files)
    // setState({ ...state, uploading: true })
    setUploading(true)
    let formdata = new FormData()
    formdata.append("file", receivedFiles[0])
    const file = receivedFiles[0]

    const response = await fetch("	http://localhost:3000/api/graphql", {
      method: "POST",
      body: formdata,
      headers: {
        "Apollo-Require-Preflight": "true",
      },
    })

    const { url, public_id, success } = await response.json()

    if (success) {
      setUploading(false)
      setFiles([...files, { public_id, url }])
    }
  }
  function showUploadedImages() {
    return files.map((item) => (
      <div
        className="dropzone_box"
        key={item.public_id}
        onClick={() => onRemove(item.public_id)}
      >
        <div
          className="wrap"
          style={{ background: `url(${item.url}) no-repeat` }}
        ></div>
      </div>
    ))
  }

  async function onRemove(public_id) {
    const {
      data: {
        removeImage: { success },
      },
    } = await removeImageMutation({
      variables: {
        publicId: public_id,
      },
    })

    const images = files.filter((item) => {
      return item.public_id !== public_id
    })

    setFiles([...images])
  }

  // if (reset) {
  //   setState((oldState) => {
  //     return { ...oldState, uploadedFiles: [] }
  //   })
  // }

  // console.log(state.uploadedFiles)

  return (
    <section>
      <div className="dropzone clear">
        <Dropzone onDrop={(files) => onDrop(files)} multiple={false}>
          {({ getRootProps, getInputProps }) => (
            <div className="dropzone_box">
              <div className="wrap" {...getRootProps()}>
                <input {...getInputProps()} />
                <FontAwesomeIcon icon={faPlusCircle} />
              </div>
            </div>
          )}
        </Dropzone>
        {showUploadedImages()}
        {uploading || imageRemoving ? (
          <div
            className="dropzone_box"
            style={{ textAlign: "center", paddingTop: "60px" }}
          >
            <CircularProgress style={{ color: "#00bcd4" }} thickness={7} />
          </div>
        ) : null}
      </div>
    </section>
  )
}
