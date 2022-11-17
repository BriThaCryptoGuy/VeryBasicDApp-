var userAddress; 

var contractAddress = "Insert Contract Address Between These Quotes";

var gas_price;

var abi; //Add ABI to make functional 

async function connectWallet() {

    if(window.ethereum) {

        var accounts = await ethereum.request({method: 'eth_requestAccounts'});
        userAddress = accounts[0];
        window.web3 = new Web3(window.ethereum);
        window.contract = new web3.eth.Contract(abi, contractAddress);
        document.getElementById('connect').innerHTML = "Mint";
        document.getElementById('connect').onclick = () => {claim()};
        get_gas_price();

        currentChainId = await web3.eth.net.getId();
                
        if (currentChainId != 137) {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: Web3.utils.toHex(137) }],
            });
        }
        
    } 

}

async function claim() {

    let mint_amount = 1; // If more than one desired pull from dom 

    document.getElementById('connect').innerHTML = "Minting";
    try{
        await window.contract.methods.mint(mint_amount)
        .send({ "from": userAddress, gasPrice: gas_price })
        .then( () => {
            document.getElementById('connect').innerHTML = "Minted";
        });
    } catch(e) {
        if (e.code == 4001) {
            document.getElementById("connect").innerHTML = "Rejected Transaction";
        } else {
            document.getElementById("connect").innerHTML = "Error";
            console.log(e);
        }         
    }
}

async function get_gas_price() {

    gas_price = await web3.eth.getGasPrice();

}