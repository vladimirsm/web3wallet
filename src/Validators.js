import Web3 from 'web3';
"use strict";
    /**
    * @desc validation before send
    * @return status message
    */
export function checkValidTransaction(from, to, amount) {
    if (!Web3.utils.isAddress(from)) {
        return 'Please login.';
    }
    if (!Web3.utils.isAddress(to)) {
        return 'Entered address in not valid.'
    }
    if (amount.length > 0 && amount.indexOf(',') > -1) {
        return 'Wrong amount format. Use dot instead of comma.'
    }
    if (amount == '0') {
        return 'Amount should be > 0'
    }
    return 'ok';
}
    /**
    * @desc validation before exchange
    * @returnstatus message
    */
export function checkValidExchange(amount, asset) {
    if (!amount || amount == '0') {
        return 'Amount should be > 0'
    }
    if (amount.length > 1 && amount.indexOf(',') > -1) {
        return 'Wrong amount format. Use dot instead of comma.'
    }
    if (!asset) {
        return 'Select Asset contract'
    }
    return 'ok';
}