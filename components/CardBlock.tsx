import { Card } from "./Card"

export const CardBlock = ({ title, list }) => {
  const renderCards = (list) =>
    list ? list.map((card, i) => <Card key={i} {...card} />) : null

  return (
    <div className="card_block">
      <div className="container">
        <div className="title">{title ? title : "Title"}</div>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {renderCards(list)}
        </div>
      </div>
    </div>
  )
}
