import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faShoppingBag } from "@fortawesome/free-solid-svg-icons"

interface ButtonProps {
  title?: string
  type: string
  linkTo?: string
  addStyles?: object
  altClass?: string
  runAction?: () => void
}

export const MyButton: React.FunctionComponent<ButtonProps> = ({
  type,
  title,
  linkTo,
  addStyles,
  altClass,
  runAction,
}) => {
  const buttons = () => {
    let template = null
    switch (type) {
      case "default":
        template = (
          <Link
            className={altClass ? altClass : "link_default"}
            href={linkTo}
            {...addStyles}
          >
            {title}
          </Link>
        )
        break
      case "bag_link":
        template = (
          <div
            className="bag_link"
            onClick={() => {
              runAction()
            }}
          >
            <FontAwesomeIcon icon={faShoppingBag} />
          </div>
        )
        break
      case "add_to_cart_link":
        template = (
          <div className="add_to_cart_link" onClick={() => runAction()}>
            <FontAwesomeIcon icon={faShoppingBag} />
            Add to cart
          </div>
        )
        break
      default:
        template = null
    }

    return template
  }

  return <div className="my_link">{buttons()}</div>
}
