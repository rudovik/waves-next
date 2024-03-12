import LightBox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"

export const ImageLightbox = ({ id, images, open, pos, onClose }) => {
  function getSlides(images) {
    if (images) {
      const slides = []
      images.forEach((element) => {
        slides.push({ src: `${element}` })
      })
      return slides
    }
  }

  return (
    <LightBox
      index={pos}
      open={open}
      close={() => {
        onClose()
      }}
      slides={getSlides(images)}
    />
  )
}
