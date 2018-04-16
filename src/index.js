import Wallet from './Wallet';
import Transactions from './Transactions';
import BalanceList from './BalanceList';

//initialize wallet
var wallet = new Wallet('wss://rinkeby.infura.io/_ws');
wallet.init();
//initialize transactions
var transactions = new  Transactions(wallet.web3, wallet.balanceList);
transactions.init();



