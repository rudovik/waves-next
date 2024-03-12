"use client"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import Radio from "@mui/material/Radio"
import Collapse from "@mui/material/Collapse"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleUp } from "@fortawesome/free-solid-svg-icons"
import { faAngleDown } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"
import RadioGroup from "@mui/material/RadioGroup"
import FormControlLabel from "@mui/material/FormControlLabel"

export const RadioCollapse = ({ initState, title, list, filterHandler }) => {
  const [state, setState] = useState({ open: initState, value: 0 })

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

  function handleChange(event) {
    const newValue = parseInt(event.target.value, 10)
    setState((oldState) => {
      return { ...oldState, value: newValue }
    })
    filterHandler(newValue)
  }

  function renderList() {
    return list
      ? list.map((value) => (
          <FormControlLabel
            key={value._id}
            value={value._id}
            control={<Radio />}
            label={value.name}
          />
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
            <RadioGroup
              aria-label="prices"
              name="prices"
              value={state.value}
              onChange={handleChange}
            >
              {renderList()}
            </RadioGroup>
          </List>
        </Collapse>
      </List>
    </div>
  )
}
