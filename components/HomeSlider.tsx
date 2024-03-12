"use client"
import Slider from "react-slick"
import { MyButton } from "./MyButton"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

export const HomeSlider = () => {
  const slides = [
    {
      img: "/images/featured/featured_home.jpg",
      lineOne: "Fender",
      lineTwo: "Custom shop",
      linkTitle: "Shop now",
      linkTo: "/shop",
    },
    {
      img: "/images/featured/featured_home_2.jpg",
      lineOne: "B-Stock",
      lineTwo: "Asesome discounts",
      linkTitle: "View offers",
      linkTo: "/shop",
    },
  ]

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  }
  function generateSlides() {
    return slides
      ? slides.map((item, i) => (
          <div key={i}>
            <div
              className="featured_image"
              style={{
                background: `url(${item.img})`,
                height: `100vh`,
              }}
            >
              <div className="featured_action">
                <div className="tag title">{item.lineOne}</div>
                <div className="tag low_title">{item.lineTwo}</div>
                <div>
                  <MyButton
                    type="default"
                    title={item.linkTitle}
                    linkTo={item.linkTo}
                    addStyles={{ margin: "10x 0 0 0" }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))
      : null
  }

  return (
    <div className="featured_container">
      <Slider {...settings}>{generateSlides()}</Slider>
    </div>
  )
}
