"use client"
import { useAuth } from "lib/useAuth"
import Link from "next/link"
import CircularProgress from "@mui/material/CircularProgress"
import { monoton } from "app/fonts"

export const Header = () => {
  const {
    user,
    logout: { logout, loading },
  } = useAuth()

  // console.log(user)

  function defaultLink(item, i) {
    return (
      <Link href={item.linkTo} key={i}>
        {item.name}
      </Link>
    )
  }

  function logoutLink(item, i) {
    // let loading = true
    return (
      <div
        className="log_out_link"
        key={i}
        onClick={async (event) => {
          await logout()
          if (loading) {
            event.preventDefault()
          }
        }}
      >
        {loading ? (
          <CircularProgress
            color="inherit"
            size="1em"
            sx={{ paddingLeft: "1.23em", paddingRight: "1.23em" }}
          />
        ) : (
          item.name
        )}
      </div>
    )
  }

  function cartLink(item, i) {
    return (
      <div className="cart_link" key={i}>
        <span>{user ? user.cart.length : 0}</span>
        <Link href={item.linkTo}>{item.name}</Link>
      </div>
    )
  }

  // console.log(user)
  function showLinks(type) {
    // return "Links"
    let list = []

    type.forEach((item) => {
      if (!user || !user.isAuth) {
        if (item.isAuth == false || item.isAuth === null) list.push(item)
      } else {
        if (item.isAuth === user.isAuth || item.isAuth === null) list.push(item)
      }
    })

    return list.map((item, i) => {
      if (item.cartLink) {
        return cartLink(item, i)
      } else if (item.logoutLink) {
        return logoutLink(item, i)
      }
      return defaultLink(item, i)
    })
  }

  return (
    <header className="bck_b_light">
      <div className="container">
        <div className="left">
          <div className={`logo  + ${monoton.className}`}>WAVES</div>
        </div>
        <div className="right">
          <div className="top">{showLinks(links.user)}</div>
          <div className="bottom">{showLinks(links.page)}</div>
        </div>
      </div>
    </header>
  )
}

const links = {
  page: [
    { name: "Home", linkTo: "/", isAuth: null },
    { name: "Guitars", linkTo: "/shop", isAuth: null },
  ],
  user: [
    {
      name: "My Cart",
      linkTo: "/user/cart",
      isAuth: true,
      cartLink: true,
    },
    {
      name: "My Account",
      linkTo: "/user/dashboard",
      isAuth: true,
    },
    {
      name: "Log in",
      linkTo: "/register_login",
      isAuth: false,
    },
    {
      name: "Log out",
      linkTo: "/user/logout",
      isAuth: true,
      logoutLink: true,
    },
  ],
}
