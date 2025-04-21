import React from 'react'
import TopLeftUser from './TopLeftUser'
import DrawerContent from './DrawerContent'

const UserLogo = () => {
  return (
    <div>
      <div className="drawer">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <label htmlFor="my-drawer">
            <TopLeftUser />
          </label>
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
         <DrawerContent />
        </div>
      </div>

    </div>
  )
}

export default UserLogo