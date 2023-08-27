import { _public, BCKGov } from "../contract/index";
const Web3 = require("web3");
const { default: Swal } = require("sweetalert2");

const web3 = new Web3(Web3.givenProvider);
const BckGovAbi = require('../contract/bckEth.json');
const publicSaleAbi = require('../contract/publicsale.json');

// Existing Functions
export async function Govabi() {
    return BckGovAbi.abi;
}

export async function publicAbi() {
    return publicSaleAbi.abi;
}

export async function getAccount() {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    return accounts[0];
}

// Updated function to get the public sale contract
async function getPublicSaleContract() {
    const abi = await publicAbi();
    const publicSaleContract = new web3.eth.Contract(abi, _public);
    return publicSaleContract;
}

// Function to buy tokens
export async function buyTokens(numberOfTokens) {
    const contract = await getPublicSaleContract();
    const account = await getAccount();
    const price = await contract.methods.price().call();
    console.log(price, "price")
    const value = Number(numberOfTokens) * Number(price);
    console.log(value, "value");
    
    await contract.methods.buyTokens(numberOfTokens).send({ from: account, value: value }).on('error', (error) => {
        console.error("Transaction failed with error: ", JSON.stringify(error, null, 2));
        Swal.fire('Error', `Transaction failed: ${error.message}`, 'error');
    });

}

// Function to get the maximum number of tokens the user can buy
export async function getMaxTokens() {
    const contract = await getPublicSaleContract();
    const account = await getAccount();
    const price = await contract.methods.price().call();
    const balanceWei = await web3.eth.getBalance(account);
    

    
    const maxTokens = balanceWei / price;
   
    
    return maxTokens;
}

// Function to get the remaining ETH needed to reach the goal of 150 ETH
export async function getRemainingEthGoal() {
    const contractAddress = _public;  // Replace with your contract's address
    const contractBalanceWei = await web3.eth.getBalance(contractAddress);
    const contractBalanceEth = web3.utils.fromWei(contractBalanceWei, 'ether');
    
    const remainingEth = 150 - parseFloat(contractBalanceEth);
    return remainingEth > 0 ? remainingEth : 0;
}

// Function to get the latest sale details
export async function getLatestSale() {
    const contract = await getPublicSaleContract();  // Assuming you have a function to get the contract

    return new Promise((resolve, reject) => {
        contract.events.Sold({fromBlock: 'latest'}, (error, event) => {
            if (error) return reject(error);
            
            const {buyer, amount} = event.returnValues;
            resolve({buyer, amount});
        });
    });
}

export default {
    buyTokens,
    getMaxTokens,
    getRemainingEthGoal,
    getLatestSale
   }