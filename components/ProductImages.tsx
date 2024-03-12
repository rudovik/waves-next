"use client"

import { useState, useEffect } from "react"
import { ImageLightbox } from "./ImageLightbox"

export const ProductImages = ({ product }) => {
  const [state, setState] = useState({
    lightbox: false,
    imagePos: 0,
    lightboxImages: [],
  })

  useEffect(() => {
    if (product.images.length > 1) {
      let lightboxImages = []

      product.images.forEach((item) => {
        lightboxImages.push(item.url)
      })

      setState((oldState) => {
        return { ...oldState, lightboxImages: [...lightboxImages] }
      })
    }
  }, [])

  function renderCardImage(images) {
    if (images.length > 0) {
      return images[0].url
    } else {
      return `/images/image_not_available.png`
    }
  }

  function handleLightbox(pos) {
    if (state.lightboxImages.length > 1) {
      setState((oldState) => {
        return { ...oldState, lightbox: true, imagePos: pos }
      })
    }
  }

  function handleLightboxClose() {
    setState((oldState) => {
      return { ...oldState, lightbox: false }
    })
  }

  function showThumbs() {
    return state.lightboxImages.map((item, i) => {
      return i > 0 ? (
        <div
          key={i}
          onClick={() => handleLightbox(i)}
          className="thumb"
          style={{ background: `url(${item}) no-repeat` }}
        ></div>
      ) : null
    })
  }

  return (
    <div className="prouct_image_container">
      <div className="main_pic">
        <div
          style={{
            background: `url(${renderCardImage(product.images)}) no-repeat`,
          }}
          onClick={() => handleLightbox(0)}
        ></div>
        <div className="main_thumbs">{showThumbs()}</div>
        {state.lightbox ? (
          <ImageLightbox
            id={product._id}
            images={state.lightboxImages}
            open={state.lightbox}
            pos={state.imagePos}
            onClose={() => handleLightboxClose()}
          />
        ) : null}
      </div>
    </div>
  )
}
