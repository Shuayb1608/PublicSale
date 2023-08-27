import { Route, Router, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './styles/App.css';
import ProtectedRoute from './sections/ProtectedRoute';
import HomePage from './Pages/Homepage';

function App() {
    const [networkId, setNetworkId] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);

    const getNetworkId = async () => {
        if (window.ethereum) {
            const currentNetworkId = await window.ethereum.request({ method: 'eth_chainId' });
            console.log(currentNetworkId, "CURRENT NETWORK ID");
            setNetworkId(currentNetworkId);
            setIsInitialized(true);  // Mark the app as initialized
        }
    };

    useEffect(() => {
        getNetworkId();

        if (window.ethereum) {
            const handleChainChanged = () => {
                console.log("chainChanged event triggered");
                setTimeout(getNetworkId, 1000);
            };

            window.ethereum.on('chainChanged', handleChainChanged);
            window.ethereum.on('accountsChanged', handleChainChanged);

            return () => {
                if (window.ethereum.removeListener) {
                    window.ethereum.removeListener('chainChanged', handleChainChanged);
                    window.ethereum.removeListener('accountsChanged', handleChainChanged);
                }
            };
        }
    }, []);

    const switchToGoerli = async () => {
        if (window.ethereum) {
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x5' }],
                });
                setTimeout(getNetworkId, 1000);
            } catch (error) {
                if (error.code === 4902) {
                    // Handle Goerli not being available
                } else {
                    console.error('Failed to switch to Goerli:', error);
                }
            }
        } else {
            alert("Please install an Ethereum-compatible browser or extension like MetaMask to use this feature.");
        }
    }

    return (
        <div className='flex flex-col h-screen mb-20'>
            {isInitialized && networkId !== '0x5' && (
                <div className="flex justify-center items-center bg-red-500 text-white p-4">
                    <p className="mr-4">⚠️ You are not on the Goerli testnet.</p>
                    <button 
                        onClick={switchToGoerli} 
                        className="bg-red-600 text-white py-1 px-4 rounded font-medium hover:bg-red-700 active:bg-red-800 transition duration-300"
                    >
                        Switch to Goerli Testnet
                    </button>
                </div>
            )}

            <div className="flex-grow">
                <Routes>
                    <Route path='/' element={<ProtectedRoute />}>
                        <Route path='' element={<HomePage />} />
                    </Route>
                </Routes>
            </div>
        </div>
    );
}

export default App;
