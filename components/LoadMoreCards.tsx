import { ShopCardBlock } from "./ShopCardBlock"

export const LoadMoreCards = ({ grid, limit, size, products, loadMore }) => {
  // console.log(size)
  return (
    <div>
      <div>
        <ShopCardBlock grid={grid} list={products} />
      </div>
      {size > 0 && size >= limit ? (
        <div className="load_more_container">
          <span onClick={() => loadMore()}>Load More</span>
        </div>
      ) : null}
    </div>
  )
}
