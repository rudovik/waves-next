import { MyButton } from "./MyButton"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTruck } from "@fortawesome/free-solid-svg-icons"
import { faCheck } from "@fortawesome/free-solid-svg-icons"
import { faTimes } from "@fortawesome/free-solid-svg-icons"

export const ProductInfo = ({ product, addToCart }) => {
  function showProdTags(product) {
    return (
      <div className="product_tags">
        {product.shipping ? (
          <div className="tag">
            <FontAwesomeIcon icon={faTruck} />
            <div className="tag_text">
              <div>Free shipping</div>
              <div>And return</div>
            </div>
          </div>
        ) : null}
        {product.available ? (
          <div className="tag">
            <FontAwesomeIcon icon={faCheck} />
            <div className="tag_text">
              <div>Available</div>
              <div>in store</div>
            </div>
          </div>
        ) : (
          <div className="tag">
            <FontAwesomeIcon icon={faTimes} />
            <div className="tag_text">
              <div>Not Available</div>
              <div>Preorder only</div>
            </div>
          </div>
        )}
      </div>
    )
  }

  function showProdActions(product) {
    return (
      <div className="product_actions">
        <div className="price">$ {product.price}</div>
        <div className="cart">
          <MyButton
            type="add_to_cart_link"
            runAction={() => {
              addToCart(product._id)
            }}
          />
        </div>
      </div>
    )
  }

  function showProdSpecification(product) {
    return (
      <div className="product_specifications">
        <h2>Specs:</h2>
        <div>
          <div className="item">
            <strong>Frets: </strong>
            {product.frets}
          </div>
          <div className="item">
            <strong>Wood: </strong>
            {product.wood.name}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1>
        {product.brand.name} {product.name}
      </h1>
      <p>{product.description}</p>
      {showProdTags(product)}
      {showProdActions(product)}
      {showProdSpecification(product)}
    </div>
  )
}
