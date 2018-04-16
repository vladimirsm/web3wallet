import { JSONstructure, defaultAddress } from './data/ContractData';
"use strict";
export default class {

    constructor(web3) {
        this.web3 = web3;
        this.contracts = [];
    }
    /**
    * @desc add Contract to the UI lists
    */
    addContract(contractInstance) {
        this.contracts.push(contractInstance);
        contractInstance.methods.balanceOf(this.web3.eth.defaultAccount).call({ from: this.web3.eth.defaultAccount }, (error, result) => {
            let tableRow = '<tr><td>' + contractInstance.options.address + '</td><td>' + this.web3.utils.fromWei(result, 'ether') + '</td></tr>';
            let radioButton = '<div class="form-check"><input class="form-check-input" type="radio" name="gridRadios" value="' + contractInstance.options.address + '" ><label class="form-check-label" for="gridRadios1">'
                + contractInstance.options.address +
                '</label></div>';
            $("#contractTable").find('tbody')
                .append(tableRow);
            $("#transactionContractList")
                .append(radioButton);
            $("#exchangeContractList")
                .append(radioButton);
        });
    }
    /**
    * @desc loads default contract, which is saved in ContractData
    */
    loadDefaultContract() {
        if (this.contracts.length == 0) {
            var myContract = new this.web3.eth.Contract(JSONstructure, defaultAddress);
            this.addContract(myContract);
        }

    }
    /**
    * @desc update tables
        Asynchronous loop
        execute promises one by one to get the list of balances
    */
    async refreshContractTable() {
        let htmlTable = "";
        for (const contract of this.contracts) {
            let address = contract.options.address;
            await contract.methods.balanceOf(this.web3.eth.defaultAccount).call({ from: this.web3.eth.defaultAccount }, (error, result) => {
                htmlTable += '<tr><td>' + address + '</td><td>' + this.web3.utils.fromWei(result, 'ether') + '</td></tr>';
            });
        }
        $('#contractTable tbody tr').empty();
        $("#contractTable").find('tbody')
            .append(htmlTable);
    }

};