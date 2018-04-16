import _ from 'underscore';
import { checkValidTransaction, checkValidExchange } from './Validators';
import { defaultAddress } from './data/ContractData';
"use strict";
export default class {
    constructor(web3, balanceList) {
        this.web3 = web3;
        this.balanceList = balanceList;
    }
    init() {
        /**
        * Action listeners
        */
        //send
        $('#sendButton').on('click', () => {
            this.send();
        });
        $('#sellButton').on('click', () => {
            this.sellToken($('#exchangeContractList input:radio:checked').val(), $('#tokenAmount').val());
        });
        $('#buyButton').on('click', () => {
            this.buyToken($('#exchangeContractList input:radio:checked').val(), $('#tokenAmount').val());
        });
        this.getExchangePrice(defaultAddress);
    }
    /**
    * @desc action on send button
    */
    send() {
        let addressTo = $('#addressTo').val();
        let amount = $('#amount').val();
        let token = $('#transactionContractList input:radio:checked').val();
        let inputStatus = checkValidTransaction(this.web3.eth.defaultAccount, addressTo, amount);
        if (inputStatus == 'ok') {
            let amountWei = this.web3.utils.toWei(amount, 'ether');
            if (token == 'eth') {
                this.sendEth(addressTo, amountWei);
            } else {
                this.sendToken(token, addressTo, amountWei);
            }
        } else {
            this.transactionStatusHandler('transactionAlertMessage', inputStatus, "danger");
        }
    }
    /**
    * @desc send ETH to specified address
    */
    sendEth(addressTo, amountWei) {
        return this.web3.eth.sendTransaction({
            from: this.web3.eth.defaultAccount,
            to: addressTo,
            gas: '21000',
            value: amountWei
        })
            .on('transactionHash', (transactionHash) => {
                let message = "Your TX has been broadcast to the network. Your transaction hash: " + transactionHash;
                this.transactionStatusHandler('transactionAlertMessage', message, "warning");
            })
            .then((reciept) => {
                let message = "Transaction successfully sent";
                this.transactionStatusHandler('transactionAlertMessage', message, "success");
            }).catch((error) => {
                console.log(error)
                this.transactionStatusHandler('transactionAlertMessage', error, "danger");
            });
    }
    /**
    * @desc send selected Token to specified address
    */
    sendToken(token, addressTo, amount) {
        let contract = _.where(this.balanceList.contracts, { _address: token });
        contract[0].methods.transfer(addressTo, amount).send({ from: this.web3.eth.defaultAccount, gas: '210000' })
            .on('error', (error) => {
                console.log(error)
                this.transactionStatusHandler('transactionAlertMessage', error, "danger");
            })
            .on('transactionHash', (transactionHash) => {
                let message = "Your TX has been broadcast to the network. Your transaction hash: " + transactionHash;
                this.transactionStatusHandler('transactionAlertMessage', message, "warning");
            })
            .then((reciept) => {
                let message = "Transaction successfully sent";
                this.transactionStatusHandler('transactionAlertMessage', message, "success");

            });
    }
    /**
    * @desc get current exchange Prices for 1 ETH
    */
    getExchangePrice(token) {
        let contract = _.where(this.balanceList.contracts, { _address: token });
        contract[0].methods.getSellPrice().call({}, (error, result) => {
            $('#exchangePriceToken').val(result + ' Token');
        });
    }
    /**
    * @desc Sell selected token and get ETH
    */
    sellToken(token, amount) {
        let contract = _.where(this.balanceList.contracts, { _address: token });
        let inputStatus = checkValidExchange(amount, token);
        if (inputStatus == 'ok') {
            contract[0].methods.sell(this.web3.utils.toWei(amount, 'ether')).send({ from: this.web3.eth.defaultAccount, gas: '210000' })
                .on('error', (error) => {
                    console.log(error)
                    this.transactionStatusHandler('buySellAlertMessage', error, "danger");
                })
                .on('transactionHash', (transactionHash) => {
                    let message = "Your TX has been broadcast to the network. Your transaction hash: " + transactionHash;
                    this.transactionStatusHandler('buySellAlertMessage', message, "warning");
                })
                .then((reciept) => {
                    let message = "Transaction successfully sent";
                    this.transactionStatusHandler('buySellAlertMessage', message, "success");

                });
        } else {
            this.transactionStatusHandler(inputStatus, "danger");
        }
    }
    /**
    * @desc buy selected Token for ETH
    */
    buyToken(token, amount) {
        let contract = _.where(this.balanceList.contracts, { _address: token });
        let inputStatus = checkValidExchange(amount, token);
        if (inputStatus == 'ok') {
            contract[0].methods.buy().send({ from: this.web3.eth.defaultAccount, value: this.web3.utils.toWei(amount, 'ether'), gas: '210000' })
                .on('error', (error) => {
                    console.log(error)
                    this.transactionStatusHandler(error, "danger");
                })
                .on('transactionHash', (transactionHash) => {
                    let message = "Your TX has been broadcast to the network. Your transaction hash: " + transactionHash;
                    this.transactionStatusHandler('buySellAlertMessage', message, "warning");
                })
                .then((reciept) => {
                    let message = "Transaction successfully sent";
                    this.transactionStatusHandler('buySellAlertMessage', message, "success");
                });
        } else {
            this.transactionStatusHandler('buySellAlertMessage', inputStatus, "danger");
        }
    }
    /**
    * @desc change status message in alert box
    */
    transactionStatusHandler(alertDom, message, type) {
        let messageType = 'alert alert-' + type;
        $("#" + alertDom).attr('class', messageType);
        $('#' + alertDom).text(message);
    }
};