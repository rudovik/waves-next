"use client"
import Link from "next/link"
import { useAuth } from "lib/useAuth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      return router.push("/register_login")
    }
  }, [user])

  const generateLinks = (links: linksArray) => {
    return links.map((item, i) => (
      <Link href={item.linkTo} key={i}>
        {item.name}
      </Link>
    ))
  }

  return user && user.isAuth ? (
    <div className="container">
      <div className="user_container">
        <div className="user_left_nav">
          <h2>My account</h2>
          <div className="links">{generateLinks(links)}</div>
          {user && user.isAdmin ? (
            <div>
              <h2>Admin</h2>
              <div className="links">{generateLinks(adminLinks)}</div>
            </div>
          ) : null}
        </div>
        <div className="user_right">{children}</div>
      </div>
    </div>
  ) : null
}

type linksArray = { name: string; linkTo: string }[]

const links: linksArray = [
  { name: "My account", linkTo: "/user/dashboard" },
  { name: "User information", linkTo: "/user/user_profile" },
  { name: "My cart", linkTo: "/user/cart" },
]

const adminLinks = [
  { name: "Site info", linkTo: "/admin/manage_site" },
  { name: "Add product", linkTo: "/admin/add_product" },
  { name: "Manage categories", linkTo: "/admin/manage_categories" },
]
