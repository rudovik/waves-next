import { MyButton } from "components/MyButton"
import Login from "components/Login"

export default function RegisterLogin() {
  return (
    <div className="page_wrapper">
      <div className="container">
        <div className="register_login_container">
          <div className="left">
            <h1>New Customers</h1>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iste
              commodi, quibusdam consequuntur dolores illum neque similique quo
              fugit. Ipsam aliquid magnam culpa qui alias aspernatur id, quae
              cumque animi dolores sunt dolorem eaque, voluptatum dignissimos
              cupiditate doloremque iure. Praesentium, maxime!
            </p>
            <MyButton
              type="default"
              title="Create an account"
              linkTo="/register"
              addStyles={{
                margin: "10px 0 0 0",
              }}
            />
          </div>
          <div className="right">
            <h2>Registered customers</h2>
            <p>If you have an account please log in.</p>
            <Login />
          </div>
        </div>
      </div>
    </div>
  )
}
