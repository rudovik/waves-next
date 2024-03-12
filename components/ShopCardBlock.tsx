import { Card } from "./Card"

export const ShopCardBlock = ({ list, grid }) => {
  const renderCards = (list) =>
    list
      ? list.map((card) => <Card key={card._id} {...card} grid={grid} />)
      : null

  return (
    <div className="card_block_shop">
      <div>
        <div>
          {list ? (
            list.length === 0 ? (
              <div className="no_result">Sorry, no results</div>
            ) : null
          ) : null}
          {renderCards(list)}
        </div>
      </div>
    </div>
  )
}
