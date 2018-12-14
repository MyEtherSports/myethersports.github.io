
var sandboxId = '0123456789';
var url = 'http://localhost:8555/sandbox/' + sandboxId;

var infura_apikey = "FhAWUae3qHwZLqMyk8Ud";
var infura_url = "https://mainnet.infura.io/" + infura_apikey;

const Eth = window.Eth;
const url_provider = new Eth.HttpProvider(url);
const eth = new Eth(url_provider);

const infura_provider = new Eth.HttpProvider(infura_url);

eth.setProvider(infura_provider);

waitForTxToBeMined = async function(txHash) {
  let txReceipt
  while (!txReceipt) {
    try {
      txReceipt = await eth.getTransactionReceipt(txHash)
    } catch (err) {
      return undefined;
    }
  }
  return txReceipt
}

const master_contract_addr = "0x0";

var abi = [{"constant":true,"inputs":[{"name":"_address","type":"address"}],"name":"GetReferralLink","outputs":[{"name":"","type":"bytes8"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"value","type":"uint256"}],"name":"approve","outputs":[{"name":"ok","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"PostInit","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"}],"name":"GetTokenStorage","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"}],"name":"GetColdStorage","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"GetAmountInCirculation","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"}],"name":"HasColdStorage","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"GetFoundationTokenStorage","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"ok","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_new_owner","type":"address"}],"name":"APITransferOwnership","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"GetCreationDate","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_amount_burned","type":"uint256"},{"name":"_amount_refunded","type":"uint256"}],"name":"RefundedNotification","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"INITIAL_SUPPLY","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_daily_amount","type":"uint256"}],"name":"CreateTokenStorage","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"WalletWithdrewCallback","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"AddAngelInvestors","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_ref","type":"bytes8"}],"name":"PlaceOrder","outputs":[],"payable":true,"type":"function"},{"constant":false,"inputs":[{"name":"_code_contract","type":"address"},{"name":"_signature","type":"bytes4"}],"name":"APISuperMajorityCall","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"APIGetRoot","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_order_id","type":"uint256"}],"name":"GetOrderStruct","outputs":[{"name":"value","type":"uint256"},{"name":"dist_period_id","type":"uint256"},{"name":"daily_dist_id","type":"uint256"},{"name":"received_tokens","type":"uint256"},{"name":"processed","type":"bool"},{"name":"owner","type":"address"},{"name":"ref","type":"address"},{"name":"reference_value","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_dist_period_id","type":"uint256"}],"name":"GetDistributionStruct1","outputs":[{"name":"ether_gathered","type":"uint256"},{"name":"tokens_released","type":"uint256"},{"name":"tokens_total","type":"uint256"},{"name":"ended","type":"bool"},{"name":"start_time","type":"uint256"},{"name":"end_time","type":"uint256"},{"name":"days_total","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_wallet","type":"address"},{"name":"_old_owner","type":"address"},{"name":"_to","type":"address"}],"name":"WalletOwnershipChanged","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"who","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"}],"name":"GetVirtualWallet","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_dist_period_id","type":"uint256"}],"name":"GetDistributionStruct2","outputs":[{"name":"descending_amount","type":"uint256"},{"name":"caption","type":"bytes32"},{"name":"amount","type":"uint256"},{"name":"daily_amount","type":"uint256"},{"name":"ref_reserve_percentage","type":"uint256"},{"name":"recent_daily_dist_id","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_dist_period_id","type":"uint256"},{"name":"_daily_dist_id","type":"uint256"}],"name":"GetDailyDistributionStruct1","outputs":[{"name":"day","type":"uint256"},{"name":"start_time","type":"uint256"},{"name":"end_time","type":"uint256"},{"name":"daily_amount","type":"uint256"},{"name":"ref_order_amount","type":"uint256"},{"name":"amount_in_orders","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_wallet","type":"address"},{"name":"func_signature","type":"string"},{"name":"_for","type":"address"}],"name":"_TMP_GetPermissionByName","outputs":[{"name":"","type":"bool"},{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"RequireBurn","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"APIGetType","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_required","type":"bool"}],"name":"SetBurnRequired","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"GetCurrentDistributionPeriod","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_dist_period_id","type":"uint256"}],"name":"GetCurrentDailyDistributionDay","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"APIGetOwner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transfer","outputs":[{"name":"ok","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_max_orders","type":"uint256"}],"name":"ClaimMyTokens","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"GetSuperMajorityWallet","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_ref_link","type":"bytes8"}],"name":"FindOwnerByReferralLink","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"ForceMajeure","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"APIDeposit","outputs":[{"name":"","type":"bool"}],"payable":true,"type":"function"},{"constant":false,"inputs":[{"name":"_wallet","type":"address"},{"name":"_from","type":"address"},{"name":"_new_parent","type":"address"}],"name":"WalletParentChanged","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_new_parent","type":"address"}],"name":"APIChangeParent","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"func_signature","type":"bytes4"},{"name":"_for","type":"address"}],"name":"APIGetPermissionBySig","outputs":[{"name":"","type":"bool"},{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_start_time","type":"uint256"},{"name":"_absolute","type":"bool"},{"name":"_days","type":"uint256"},{"name":"_amount","type":"uint256"},{"name":"_descending_amount","type":"uint256"},{"name":"_caption","type":"bytes32"}],"name":"Distribute","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"_TMP_get_time_shift","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_supermajority","type":"address"}],"name":"SetSuperMajorityAddress","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"func_signature","type":"bytes4"},{"name":"_for","type":"address"},{"name":"_can_execute","type":"bool"},{"name":"_can_write","type":"bool"}],"name":"APISetPermissionBySig","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_dist_period_id","type":"uint256"},{"name":"_daily_dist_id","type":"uint256"}],"name":"GetDailyDistributionStruct2","outputs":[{"name":"ether_gathered","type":"uint256"},{"name":"tokens_released","type":"uint256"},{"name":"tokens_total","type":"uint256"},{"name":"ended","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"}],"name":"HasVirtualWallet","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"GetRefund","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"}],"name":"HasTokenStorage","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_function","type":"string"},{"name":"_for","type":"address"},{"name":"_can_execute","type":"bool"},{"name":"_can_write","type":"bool"}],"name":"APISetPermissionByName","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"Deposit","outputs":[],"payable":true,"type":"function"},{"constant":true,"inputs":[],"name":"GetBurnedTokenAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_function","type":"string"},{"name":"_for","type":"address"}],"name":"APIGetPermissionByName","outputs":[{"name":"","type":"bool"},{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"APIGetParent","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"distribution_period_id","type":"uint256"}],"name":"NewDistributionPeriod","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_dist_period_id","type":"uint256"},{"indexed":false,"name":"_dist_day","type":"uint256"},{"indexed":false,"name":"_order_id","type":"uint256"},{"indexed":false,"name":"_order_value","type":"uint256"}],"name":"BuyOrderCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"amount","type":"uint256"}],"name":"TokensBurned","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_from","type":"address"},{"indexed":false,"name":"_amount_burned","type":"uint256"},{"indexed":false,"name":"_amount_refunded","type":"uint256"}],"name":"RefundedNotificationEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_wallet","type":"address"},{"indexed":false,"name":"_from","type":"address"},{"indexed":false,"name":"_new_parent","type":"address"}],"name":"WalletParentChangedEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_wallet","type":"address"},{"indexed":false,"name":"_old_owner","type":"address"},{"indexed":false,"name":"_to","type":"address"}],"name":"WalletOwnershipChangedEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_from","type":"address"},{"indexed":false,"name":"_to","type":"address"},{"indexed":false,"name":"_amount","type":"uint256"}],"name":"WalletWithdrewEvent","type":"event"}];


var master_contract = undefined;
//var master_contract = eth.contract(abi).at(master_contract_addr);

//master_contract.name().then((result) => {
//  console.info(result);
//});