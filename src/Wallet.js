//import $ from 'jquery';
import Web3 from 'web3';
import Contract from './Contract';
import BalanceList from './BalanceList';
import { binaryData, JSONstructure } from './data/ContractData';
"use strict";
export default class {
    constructor(web3Provider) {
        this.web3Provider = web3Provider;
        this.balanceList;
        this.contract;
    }

    init() {
        /**
        * Action listeners
        */
        //login
        $('#login').on('click', () => {
            this.login();
        });
        //generate new keyPainr
        $('#generateButton').on('click', () => {
            this.generateKeyPair();
        });
        //deploy contract
        $('#deployContract').on('click', () => {
            let binaryData = $('#contractByteCode').val();
            let jsonData = JSON.parse($('#contractJSONInterface').val());
            this.contract.deployContract(binaryData, jsonData);
        });
        $('form').keypress(function(event) { 
            return event.keyCode != 13;
        }); 

        //initialize web3 connection
        let httpProvider = new Web3.providers.WebsocketProvider(this.web3Provider);
        this.web3 = new Web3(httpProvider);
        //initialize contracts
        this.balanceList = new BalanceList(this.web3);
        this.balanceList.loadDefaultContract();
        this.contract = new Contract(this.web3, this.balanceList);

        //load default contract data
        $('#contractByteCode').val(binaryData);
        $('#contractJSONInterface').val(JSON.stringify(JSONstructure));
    }
    /**
    * @desc get balance of a default account
    * @param string $msg - 
    */
    getBalance() {
        let balance = this.web3.eth.getBalance(this.web3.eth.defaultAccount).then(balance => {
            $('#displayEthBalance').val(this.web3.utils.fromWei(balance, 'ether'));
        });;
    }
    /**
    * @desc subscribe to block changes in Ethereum network
    * @return EventEmitter - data or failure
    */
    subscribeGetHeaderChanges() {
        return this.web3.eth
            .subscribe("newBlockHeaders")
            .on("data", data => {
             
                this.balanceList.refreshContractTable(); //refresh table with balances
                this.getBalance(); //update balance
            })
            .on("error", console.error);
    }
    /**
    * @desc action on login
    */
    login() {
        //set the default account 
        let privateKey = $('#inputPrivateKey').val();
        this.web3.eth.defaultAccount = this.web3.eth.accounts.privateKeyToAccount(privateKey).address;
        this.web3.eth.accounts.wallet.add(privateKey);
        $('#currentUser').text(this.web3.eth.defaultAccount);
        this.getBalance(); //load balance for current user
        this.balanceList.refreshContractTable();
        //subscribe to block changes(updates on new block)
        if (this.activeSubscription === undefined) {
            this.activeSubscription = this.subscribeGetHeaderChanges();
        }
    }
    /**
    * @desc generates new Public
    */
    generateKeyPair() {
        let account = this.web3.eth.accounts.create();
        $('#outputPublicKey').val(account.address);
        $('#outputPrivateKey').val(account.privateKey);

    }
};