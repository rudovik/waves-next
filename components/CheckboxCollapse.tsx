"use client"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import Checkbox from "@mui/material/Checkbox"
import Collapse from "@mui/material/Collapse"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleUp } from "@fortawesome/free-solid-svg-icons"
import { faAngleDown } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction"

export const CheckboxCollapse = ({ initState, title, list, filterHandler }) => {
  const [state, setState] = useState({ open: initState, checked: [] })

  function handleClick() {
    setState({ ...state, open: !state.open })
  }

  function handleAngle() {
    return state.open ? (
      <FontAwesomeIcon icon={faAngleUp} style={{ height: "1em" }} />
    ) : (
      <FontAwesomeIcon icon={faAngleDown} style={{ height: "1em" }} />
    )
  }

  function handleToggle(id) {
    const { checked } = state
    const newChecked = [...checked]
    const currentIndex = newChecked.indexOf(id)

    if (currentIndex === -1) {
      newChecked.push(id)
    } else {
      newChecked.splice(currentIndex, 1)
    }

    filterHandler([...newChecked])
    setState((oldState) => {
      return { ...oldState, checked: [...newChecked] }
    })
  }

  function renderList() {
    return list
      ? list.map((value) => (
          <ListItem key={value._id} style={{ padding: "10px 0" }}>
            <ListItemText primary={value.name} />
            <ListItemSecondaryAction>
              <Checkbox
                color="primary"
                onChange={() => handleToggle(value._id)}
                checked={state.checked.indexOf(value._id) !== -1}
              />
            </ListItemSecondaryAction>
          </ListItem>
        ))
      : null
  }

  return (
    <div className="collapse_items_wrapper">
      <List style={{ borderBottom: "1px solid #dbdbdb" }}>
        <ListItem onClick={handleClick} style={{ padding: "10px 23px 10px 0" }}>
          <ListItemText primary={title} className="collapse_title" />
          {handleAngle()}
        </ListItem>
        <Collapse in={state.open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {renderList()}
          </List>
        </Collapse>
      </List>
    </div>
  )
}
