export const ProductBlock = ({ products, type, removeItem }) => {
  const renderCartImage = (images) => {
    if (images.length > 0) {
      return images[0].url
    } else {
      return "/images/image_not_available.png"
    }
  }

  const renderItems = () =>
    products.map((product) => (
      <div className="user_product_block" key={product.productId._id}>
        <div className="item">
          <div
            className="image"
            style={{
              background: `url(${renderCartImage(
                product.productId.images
              )}) no-repeat`,
            }}
          ></div>
        </div>
        <div className="item">
          <h4>Product name</h4>
          <div>{product.productId.brand.name}</div>
        </div>
        <div className="item">
          <h4>Quantity</h4>
          <div>{product.quantity}</div>
        </div>
        <div className="item">
          <h4>Price</h4>
          <div>$ {product.productId.price}</div>
        </div>
        <div className="item btn">
          <div
            className="cart_remove_btn"
            onClick={() => removeItem(product.productId._id)}
          >
            Remove
          </div>
        </div>
      </div>
    ))

  return <div>{renderItems()}</div>
}
