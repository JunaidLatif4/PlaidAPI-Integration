import React from 'react'
import { Switch , Route } from 'react-router-dom'

import Plaid from './Components/PlaidAPI'

const App = () => {
  return (
    <>
    <div className="app_container">

    <Switch>
      <Route to="/" component={Plaid} />
    </Switch>

    </div>
    </>
  )
}

export default App
