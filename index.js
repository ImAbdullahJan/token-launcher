const peerFactoryAddress = '0xC0dd4fD0a54d9252e03CA829b512AFF3d0B4DD83';
const swapContractAddress = '0x6f337bA064b0a92538a4AfdCF0e60F50eEAe0D5B';

const peerFactoryAbi = [{"constant":true,"inputs":[{"name":"_locator","type":"bytes32"}],"name":"has","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_swapContract","type":"address"},{"name":"_peerContractOwner","type":"address"}],"name":"createPeer","outputs":[{"name":"peerContractAddress","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"peerContract","type":"address"},{"indexed":false,"name":"swapContract","type":"address"},{"indexed":true,"name":"peerContractOwner","type":"address"}],"name":"CreatePeer","type":"event"}];

const peerContractAbi = [{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"rules","outputs":[{"name":"maxTakerAmount","type":"uint256"},{"name":"priceCoef","type":"uint256"},{"name":"priceExp","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_takerToken","type":"address"},{"name":"_makerToken","type":"address"}],"name":"unsetRule","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_takerParam","type":"uint256"},{"name":"_takerToken","type":"address"},{"name":"_makerToken","type":"address"}],"name":"getMakerSideQuote","outputs":[{"name":"makerParam","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_takerToken","type":"address"},{"name":"_makerToken","type":"address"}],"name":"getMaxQuote","outputs":[{"name":"takerParam","type":"uint256"},{"name":"makerParam","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_makerParam","type":"uint256"},{"name":"_makerToken","type":"address"},{"name":"_takerToken","type":"address"}],"name":"getTakerSideQuote","outputs":[{"name":"takerParam","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"swapContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isOwner","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_takerToken","type":"address"},{"name":"_makerToken","type":"address"},{"name":"_maxTakerAmount","type":"uint256"},{"name":"_priceCoef","type":"uint256"},{"name":"_priceExp","type":"uint256"}],"name":"setRule","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"components":[{"name":"nonce","type":"uint256"},{"name":"expiry","type":"uint256"},{"components":[{"name":"wallet","type":"address"},{"name":"token","type":"address"},{"name":"param","type":"uint256"},{"name":"kind","type":"bytes4"}],"name":"maker","type":"tuple"},{"components":[{"name":"wallet","type":"address"},{"name":"token","type":"address"},{"name":"param","type":"uint256"},{"name":"kind","type":"bytes4"}],"name":"taker","type":"tuple"},{"components":[{"name":"wallet","type":"address"},{"name":"token","type":"address"},{"name":"param","type":"uint256"},{"name":"kind","type":"bytes4"}],"name":"affiliate","type":"tuple"},{"components":[{"name":"signer","type":"address"},{"name":"v","type":"uint8"},{"name":"r","type":"bytes32"},{"name":"s","type":"bytes32"},{"name":"version","type":"bytes1"}],"name":"signature","type":"tuple"}],"name":"_order","type":"tuple"}],"name":"provideOrder","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_swapContract","type":"address"},{"name":"_peerContractOwner","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"takerToken","type":"address"},{"indexed":false,"name":"makerToken","type":"address"},{"indexed":false,"name":"maxTakerAmount","type":"uint256"},{"indexed":false,"name":"priceCoef","type":"uint256"},{"indexed":false,"name":"priceExp","type":"uint256"}],"name":"SetRule","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"takerToken","type":"address"},{"indexed":false,"name":"makerToken","type":"address"}],"name":"UnsetRule","type":"event"}];

// Web3 injection
window.addEventListener('load', async () => {
  console.log('load', Web3.version);

  // Modern dapp browsers...
  if (window.ethereum) {
    console.log('load: ethereum');
    try {
      // Request account access if needed
      await ethereum.enable();
      setStatus('MetaMask Detected!');
      window.web3 = new Web3(ethereum);
      afterLoad();
      // Acccounts now exposed
      //web3.eth.sendTransaction({/* ... */});
    } catch (error) {
      // User denied account access...
    }
  }

  // Legacy dapp browsers...
  else if (window.currentProvider) {
    console.log('load: currentProvider');
    window.web3 = new Web3(currentProvider);
    setStatus('Web3 Detected! and connected with Legacy dapp browser');
    afterLoad();
    // Acccounts always exposed
    //web3.eth.sendTransaction({/* ... */});
  }

  // Non-dapp browsers...
  else {
    setStatus("Non-Ethereum browser detected. You should consider trying MetaMask!");
    console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
  }
});

// Web3 status
function setStatus(message) {
  $('#status').html('<strong>' + message + '</strong>');
};

// Working after Metamask
async function afterLoad() {
  console.log('After Load');

  // userAccount as msg.sender
  var userAccount = '';
  var accounts = await web3.eth.getAccounts().then((account) => {
    // console.log(account[0]);
    userAccount = account[0];
    $('#userAccount').text('Account: ' + userAccount);
  }).catch((e) => {
    console.log(e);
  });
  // console.log(userAccount);

  // Create instance of PeerFactory contract
  var peerFactory = new web3.eth.Contract(peerFactoryAbi, peerFactoryAddress);
  console.log('Contract loaded successfully');

// Launch Token function
  $('#launchToken').click(async function() {
    $("#loader").show();
    peerFactory.methods.createPeer(swapContractAddress, userAccount).send({
      from: userAccount
    }).then((result) => {
      $("#loader").hide();
      $('#txStatus').html('Your transaction is successfully completed.' + '<br>' + "Transactions detail at "+"<a target=\"_blank\" href=\"https:\//rinkeby.etherscan.io\/tx\/" + result.transactionHash+ "\">EtherScan.io</a>");
    }).catch((e) => {
      console.log(e);
    });

  });


  // Listen createPeer event - ownerOnly
  await peerFactory.events.CreatePeer({
    filter: {
      peerContractOwner: userAccount
    },
    fromBlock: 0,
    toBlock: 'latest'
  }, (error, event) => {
    if (event) {
      var peerContractAddress = event.returnValues.peerContract;

      if(event.returnValues.peerContractOwner == userAccount){
        $("#launchToken").hide();
        $("#showIfAlreadyDeploy").text("Your contract is deployed successfully.");

      }

      console.log(peerContractAddress);
      setPeerAddress(peerContractAddress)
    } else {
      console.log(error);
    }
  });

  // Working on peer contract
  function setPeerAddress(_result) {
    peerContractAddress = _result;
    // console.log(peerContractAddress);

    // Create instance of Peer contract
    var peerContract = new web3.eth.Contract(peerContractAbi, peerContractAddress);
    // console.log(peerContract);

// listen Set Rules event
    peerContract.events.SetRule({
      fromBlock: 0,
      toBlock: 'latest'
    }, function(error, events) {
      var lastEvent = events.length - 1;
      var eventTakerToken = events.returnValues.takerToken;

      var eventMakerToken = events.returnValues.makerToken;

      var eventMakerParam = events.returnValues.maxTakerAmount;

      var eventPriceCoef = events.returnValues.priceCoef;

      var eventPriceExp = events.returnValues.priceExp;


      var eventTakerParam = Math.floor((eventMakerParam * eventPriceCoef) / 10 ** eventPriceExp);


      var getRules = peerContract.methods.rules(eventTakerToken, eventMakerToken ).call().then((result) => {
        console.log(result);

      var rulesTakerParam = Math.floor((result.maxTakerAmount * result.priceCoef ) / 10 ** result.priceExp);
        console.log(rulesTakerParam);

          if (rulesTakerParam !== 0) {
            var btn = $("<tr>" + "<td>" + eventMakerToken +"</td>"+ "<td>" + result.maxTakerAmount +"</td>"+"<td>" + eventTakerToken +"</td>"+"<td>" + rulesTakerParam +"</td>" + "</tr>");
            $('#test').append(btn);
          } else {
            // hahahha
          }
      }).catch((e) => {
        console.log(e);
      });
    });

// Listen Unset Rules Event

    peerContract.events.UnsetRule({
      filter: {
        from: userAccount
      }, // Using an array means OR: e.g. 20 or 23
      fromBlock: 0,
      toBlock: 'latest'
    }, function(error, event) {
      console.log(event);
      // console.log(event.returnValues);
      // console.log(event.returnValues.takerToken);
      // console.log(event.returnValues.makerToken);
    });


    var takerToken;
    var makerToken;
    var makerParam;
    var takerParam;
    var makerToken1;
    var priceCoef;
    var priceExp;

    $('#calculation').click(async function() {

// Assigining value to variables
      takerToken = $('#takerTokenAddress').val();
      makerToken = $('#makerTokenAddress').val();
      makerParam = $('#makerTokens').val();
      makerToken1 = $('#makerToken1').val();

      function wholeNumberToExponential(number) {
        const splittedArray = number.toString().split('.');
        if (splittedArray.length > 1) {
          const str_before_dot = splittedArray[0];
          const str_after_dot = splittedArray[1];
          const exponent_length = Number(str_before_dot) >= 0 ? `+${str_after_dot.length}` : `-${str_after_dot.length}`;
          return Number(`${str_before_dot}${str_after_dot}`) + 'e' + exponent_length;
        } else
          return `${number}e+0`;
      }

      var abc = wholeNumberToExponential(makerToken1);
      priceCoef = abc.toString().split('e');
      // alert(priceCoef[0]);
      priceExp = abc.toString().split('+');
      // alert(priceExp[1]);

      takerParam = Math.floor((makerParam * priceCoef[0]) / 10 ** priceExp[1]);
      $("#takerTokens").val(takerParam);
    });


// Call setRule function of peer Contract
$('#set').click(async function() {
  $("#loader").show();
  var setRule = await peerContract.methods.setRule(takerToken, makerToken, makerParam, priceCoef[0], priceExp[1]).send({
    from: userAccount
  }).then((result) => {
    $("#loader").hide();
    $('#txStatus').html('Your transaction is successfully completed.' + '<br>' + "Transactions detail at "+"<a target=\"_blank\" href=\"https:\//rinkeby.etherscan.io\/tx\/" + result.transactionHash+ "\">EtherScan.io</a>");
  }).catch((e) => {
    console.log(e);
  });
});


 // Call unsetRule function of peer Contract
$('#unset').click(async function() {
  var takerTokenUnset = $('#tokenbuy').val();
  var makerTokenUnset = $('#tokenSell').val();
  $("#loader").show();
  var unsetRule = await peerContract.methods.unsetRule(takerTokenUnset, makerTokenUnset).send({
    from: userAccount
  }).then((result) => {
    $("#loader").hide();
    $('#txStatus').html('Your transaction is successfully completed.' + '<br>' + "Transactions detail at "+"<a target=\"_blank\" href=\"https:\//rinkeby.etherscan.io\/tx\/" + result.transactionHash+ "\">EtherScan.io</a>");
  }).catch((e) => {
    console.log(e);
  });
});


// MakerQuote function
$('#makerQuote').click(async function() {

  // var takerToken = $('#tokenbuy').text();
  // var makerToken = $('#tokenSell').text();
  // var makerParam = $('#noOfTokensell').text();
  // var takerParam = $('#noOfTokenbuy').text();
  // console.log(takerToken);
  // console.log(makerToken);
  // console.log(takerParam);

  var makerSideQuote = await peerContract.methods.getMakerSideQuote(takerParam, takerToken, makerToken ).call().then((result) => {
    console.log(result);
    // $('#makerQuoteDetails').text('Seller: Your have to pay ' + result + ' tokens to buy' + takerParam + 'taker coins.');
  }).catch((e) => {
    console.log(e);
  });
});


// TakerQuote function
$('#takerQuote').click(async function() {

  var getTakerSideQuote = await peerContract.methods.getTakerSideQuote(100, "0xdf377dcb2b82c615c5978be3144f3121b4f3fbf2", "0xcc1cbd4f67cceb7c001bd4adf98451237a193ff8", ).call().then((result) => {
    $('#takerQuoteDetails').text('Buyer: Your have to pay ' + result + ' tokens to buy 100 taker coins.');
  }).catch((e) => {
    console.log(e);
  });
});


// MaxQuote function
$('#maxQuote').click(async function() {

  var takerToken = $('#tokenbuy').text();
  var makerToken = $('#tokenSell').text();

  var getMaxQuote = await peerContract.methods.getMaxQuote(takerToken, makerToken).call().then((result) => {
    $('#maxQuoteDetails').text('Maximum Quote: Your have to pay ' + result[0] + " tokens of AST to get " + result[1] + ' tokens of WETH.');
  }).catch((e) => {
    console.log(e);
  });
});





$('#signOrder').click(async function() {

  console.log(userAccount);

  const takerWallet = "0xbdA649A88948c9D27BFd44205e1604Cf8068E1e6";
  const makerWallet = "0xA08bc4F800cBF3f8F2669934047992616CEA4908";
  const ASTAddress = "0xcc1cbd4f67cceb7c001bd4adf98451237a193ff8";
  const WETHAddress = "0xc778417e063141139fce010982780140aa0cd5ab";
  const emptyWallet = "0x0000000000000000000000000000000000000000";

  var makerParam1 = "1";
  var takerParam1 = "1";

  var contractExpiry = "1579783600000";
  var contractNonce = "12345";

  const order = await orderUtils.orders.getOrder({
      expiry: contractExpiry,
      nonce: contractNonce,
      maker: {
        wallet: userAccount,
        token: ASTAddress,
        param: makerParam1
      },
      taker: {
        wallet: emptyWallet,
        token: WETHAddress,
        param: takerParam1
      },
      },
      true
    );

  const signer = userAccount;
  const data = JSON.stringify({
  types: {
      EIP712Domain: [
  { name: 'name', type: 'string' },
  { name: 'version', type: 'string' },
  { name: 'verifyingContract', type: 'address' },
],
Order: [
  { name: 'nonce', type: 'uint256' },
  { name: 'expiry', type: 'uint256' },
  { name: 'maker', type: 'Party' },
  { name: 'taker', type: 'Party' },
  { name: 'affiliate', type: 'Party' },
],
Party: [
  { name: 'wallet', type: 'address' },
  { name: 'token', type: 'address' },
  { name: 'param', type: 'uint256' },
  { name: 'kind', type: 'bytes4' },
]

  },
  primaryType: 'Order',
  domain: {name: 'Swap', version: '2', verifyingContract: swapContractAddress },
  message: order
});

web3.currentProvider.sendAsync({
  method: "eth_signTypedData_v3",
  params: [signer, data],
  from: signer
},  async function(err, result) {
  if (err) {
      return console.error(err);
  }
  const signature = result.result.substring(2);
  const r = "0x" + signature.substring(0, 64);
  const s = "0x" + signature.substring(64, 128);
  const v = parseInt(signature.substring(128, 130), 16);
  // The signature is now comprised of r, s, and v.
console.log(r);
console.log(s);
console.log(v);


  await peerContract.methods.provideOrder({
      expiry: contractExpiry,
      nonce: contractNonce,
      maker: {
        wallet: userAccount,
        token: ASTAddress,
        param: makerParam1,
        kind: "0x277f8169"
      },
      taker: {
        wallet: emptyWallet,
        token: WETHAddress,
        param: takerParam1,
        kind: "0x277f8169"
      },
      affiliate: {
        wallet: "0x0000000000000000000000000000000000000000",
        token: "0x0000000000000000000000000000000000000000",
        param: "0",
        kind: "0x277f8169"
      },
      signature: {
        version: "0x01",
        signer: userAccount,
        r: r,
        s: s,
        v: v
      }
    }).send({
        from: userAccount
      });

  }
);

// async function signature() {
//
//   var result = await orderUtils.signatures.getWeb3Signature(order, signer, swapContractAddress)
//
//   var sigV = result.version;
//   var sigA = result.signer;
//   var sigr = result.r;
//   var sigs = result.s;
//   var sigv = result.v;
//
// await performSwap(sigV, sigA,sigr,sigs,sigv)
//
// async  function performSwap(_version, _signer, r, s, v) {
//     await peerContract.methods.provideOrder({
//         expiry: contractExpiry,
//         nonce: contractNonce,
//         maker: {
//           wallet: userAccount,
//           token: ASTAddress,
//           param: makerParam1,
//           kind: "0x277f8169"
//         },
//         taker: {
//           wallet: emptyWallet,
//           token: WETHAddress,
//           param: takerParam1,
//           kind: "0x277f8169"
//         },
//         affiliate: {
//           wallet: "0x0000000000000000000000000000000000000000",
//           token: "0x0000000000000000000000000000000000000000",
//           param: '0',
//           kind: "0x277f8169"
//         },
//         signature: {
//           version: _version,
//           signer: _signer,
//           r: r,
//           s: s,
//           v: v
//         }
//       }).send({
//           from: userAccount
//         });
//   }
//
//
//
//     };
//
//     signature();

});



$('#orderDone').click(async function() {

    const takerWallet = "0xbdA649A88948c9D27BFd44205e1604Cf8068E1e6";
    const makerWallet = "0xA08bc4F800cBF3f8F2669934047992616CEA4908";
    const ASTAddress = "0xcc1cbd4f67cceb7c001bd4adf98451237a193ff8";
    const WETHAddress = "0xc778417e063141139fce010982780140aa0cd5ab";
    const emptyWallet = "0x0000000000000000000000000000000000000000";

    var makerParam1 = "1";
    var takerParam1 = "1";

    var contractExpiry = "1579783600000";
    var contractNonce = "12345";

    const order = await orderUtils.orders.getOrder({
        expiry: contractExpiry,
        nonce: contractNonce,
        maker: {
          wallet: userAccount,
          token: ASTAddress,
          param: makerParam1
        },
        taker: {
          wallet: emptyWallet,
          token: WETHAddress,
          param: takerParam1
        },
        },
        true
      );

      const signer = userAccount;

      order.signature = await orderUtils.signatures.getWeb3Signature(order, signer, swapContractAddress)

      await peerContract.methods.provideOrder(order).send({ from: userAccount });

});



    }

    erc20TokenDetails();

};


// ERC20 Token details
const erc20Abi = [{
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [{
      "name": "",
      "type": "string"
    }],
    "payable": false,
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{
      "name": "",
      "type": "uint8"
    }],
    "payable": false,
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{
      "name": "_owner",
      "type": "address"
    }],
    "name": "balanceOf",
    "outputs": [{
      "name": "balance",
      "type": "uint256"
    }],
    "payable": false,
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [{
      "name": "",
      "type": "string"
    }],
    "payable": false,
    "type": "function"
  }
];

async function erc20TokenDetails() {
  console.log('ERC-20 Token Details');

  $('#ERC20Check').click(async function() {

    var userAccount = '';
    var accounts = await web3.eth.getAccounts().then((account) => {
      userAccount = account[0];
    }).catch((e) => {
      console.log(e);
    });

    // Get user input
    var tokenAddress = $('#ERC20Address').val();
    console.log(tokenAddress);


    var tokenInstance = new web3.eth.Contract(erc20Abi, tokenAddress);
    console.log(tokenInstance);

    // console.log(userAccount);

    var name = await tokenInstance.methods.name().call();
    var symbol = await tokenInstance.methods.symbol().call();
    var tokenBalance = '';
    await tokenInstance.methods.balanceOf(userAccount).call().then(async (balance) => {
      await tokenInstance.methods.decimals().call().then((decimals) => {
        tokenBalance = balance / (10 ** decimals).toString();
        // console.log(tokenBalance);
      }).catch((e) => {
        tokenBalance = balance.toString()
        // console.log(tokenBalance);
        console.log(e);
      });
    }).catch((e) => {
      console.log(e);
    });
    // console.log(tokenBalance);

    $('#tokenName').text(name);
    $('#tokenSymbol').text(symbol);
    $('#tokenBalance').text(tokenBalance);
    $('#ownerAddress').text(userAccount);


      });

  $('#calculation').click(async function() {
      var makerTokenAddress = $('#makerTokenAddress').val();
      console.log(makerTokenAddress);

      var makerTokenInstance = new web3.eth.Contract(erc20Abi, makerTokenAddress);
      console.log(makerTokenInstance);

      var makerName = await makerTokenInstance.methods.name().call();
      var makerSymbol = await makerTokenInstance.methods.symbol().call();

      console.log(makerName);
      console.log(makerSymbol);
      $('#makerTokenName').text(makerName);
      $('#makerTokenSymbol1').text(makerSymbol);
      $('#makerTokenSymbol2').text(makerSymbol);



      var takerTokenAddress = $('#takerTokenAddress').val();
      console.log(takerTokenAddress);

      var takerTokenInstance = new web3.eth.Contract(erc20Abi, takerTokenAddress);
      console.log(takerTokenInstance);

      var takerName = await takerTokenInstance.methods.name().call();
      var takerSymbol = await takerTokenInstance.methods.symbol().call();

      console.log(takerName);
      console.log(takerSymbol);
      $('#takerTokenName').text(takerName);
      $('#takerTokenSymbol1').text(takerSymbol);
      $('#takerTokenSymbol2').text(takerSymbol);





  });

};
