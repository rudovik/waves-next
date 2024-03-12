"use client"
import { MyButton } from "components/MyButton"
import { useAuth } from "lib/useAuth"
import { UserHistoryBlock } from "components/UserHistoryBlock"

export default function DashboardPage() {
  const { user } = useAuth()
  // console.log(user.isAuth)

  return (
    user && (
      <div>
        <div className="user_nfo_panel">
          <h1>User information</h1>
          <div>
            <span>{user.name}</span>
            <span>{user.lastname}</span>
            <span>{user.email}</span>
          </div>
          <MyButton
            type="default"
            title="Edit account info"
            linkTo="/user/user_profile"
            addStyles={{}}
          />
        </div>

        {user.history ? (
          <div className="user_nfo_panel">
            <h1>History purchases</h1>
            <div className="user_product_block_wrapper">
              <UserHistoryBlock products={user.history} />
            </div>
          </div>
        ) : null}
      </div>
    )
  )
}
