import React from 'react'
import AddWallet from './add-wallet'
import WalletList from './wallet-list'

const WalletDashboard = () => {
  return (
    <div>
        <div className='flex justify-between items-center mb-5'>
            <h2 className="text-xl font-semibold mb-4">Wallet Overview</h2>
            <div>
                <AddWallet />
            </div>
        </div>

        <WalletList />
    </div>
  )
}

export default WalletDashboard