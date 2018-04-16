import { binaryData, JSONstructure } from './data/ContractData';
import BalanceList from './BalanceList';
import Web3 from 'web3';
"use strict";
export default class {

    constructor(web3, balanceList) {
        this.web3 = web3;
        this.balanceList = balanceList;
    }
    /**
    * @desc Create contract instance and deploy it into blockchain
    */
    deployContract(binary, jsonData) {
        if (this.web3.eth.defaultAccount) {
            var myContract = new this.web3.eth.Contract(jsonData);
            myContract.deploy({
                data: binary
            })
                .send({
                    from: this.web3.eth.defaultAccount,
                    gas: 4700000
                }, function (error, transactionHash) { })
                .on('error', (error) => {
                    console.log(error)
                    this.statusHandler(error, "danger");
                })
                .on('transactionHash', (transactionHash) => {
                    let message = "Your TX has been broadcast to the network. Your transaction hash: " + transactionHash + " Please wait until your contract will be mined into blockchain, it may take a few minutes. Once contract is deployed it will appear in your contracts table(balance tab)"
                    this.statusHandler(message, "warning")
                })
                .on('receipt', function (confirmationNumber, receipt) { })
                .then((newContractInstance) => {
                    let message = "Your contract was deployed. Addres: " + newContractInstance.options.address;
                    this.statusHandler(message, "success");
                    //initialize list of balances
                    this.balanceList.addContract(newContractInstance);

                });
        } else {
            //login error
            this.statusHandler("You need to login at first!", "danger")

        }
    }
    /**
    * @desc add to Contract list array
    */
    addToContractList(contractInstance) {
        this.contracts.push(contractInstance);
    }
    /**
    * @desc change status message in alert box
    */
    statusHandler(message, type) {
        let messageType = 'alert alert-' + type;
        $("#alertMessage").attr('class', messageType);
        $('#alertMessage').text(message);
    }
};