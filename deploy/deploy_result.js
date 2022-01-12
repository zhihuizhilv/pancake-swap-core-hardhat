const os = require("os");
const fs = require("fs");
const hre = require("hardhat");
const {ethers} = require("ethers");
const resultFileName = `${hre.config.paths.root}/deploy_results/deploy.${hre.network.name}.json`
let data = {
    abi: {},
    deployedContract: {}
};
console.log("define result data");
exports.getData = () => {
    return data
};

exports.load = async function () {
    if (fs.existsSync(resultFileName))
        try {
            data = JSON.parse(fs.readFileSync(resultFileName, {encoding: "UTF-8"}));
            if (!data.abi || !data.deployedContract)
                throw new Error("result file content error");
            console.log("Deploy result load done");
        } catch (e) {
            console.log("Deploy result load error", e);
            throw e;
        }
}

exports.save = async function () {
    fs.writeFileSync(resultFileName, JSON.stringify(data, null, 2), {encoding: "UTF-8"});
    console.log("Deploy result: save " + resultFileName);
}

exports.writeTokens = function (tokens) {
    for (let symbol in tokens) {
        let tokenInfo = tokens[symbol];
        let opts = {};
        let _symbol = symbol;
        if (tokenInfo.length == 4) {
            _symbol = "LP-" + tokenInfo[2] + "-" + tokenInfo[3];
            opts.token0 = tokenInfo[2];
            opts.token1 = tokenInfo[3];
        }
        exports.writeToken(tokenInfo[0], _symbol, tokenInfo[1], opts)
    }
}

exports.writeToken = function (address, symbol, decimals, opts) {
    exports.writeDeployedContract("Token-" + symbol, ethers.utils.getAddress(address), "ERC20", {
        symbol: symbol,
        decimals: decimals, ...opts
    })
}

/**
 * 添加合约的ABI
 * @param name 合约名称, 唯一 (如 StakingEIP20)
 * @param abi 合约ABI
 */
exports.writeAbi = function (name, abi) {
    if (abi.interface && abi.interface.format)
        abi = abi.interface.format("json")
    try {
        data.abi[name] = JSON.parse(abi);
    } catch (e) {
        console.error("Parse abi error : " + name + "," + abi);
    }
    console.log("Deploy result: write abi " + name);
}

/**
 * 添加已创建的合约
 * @param name 名称(如 StakingEIP20_HT_USDT 要求唯一，表示)
 * @param address 地址
 * @param contractName 对应 ABI 中的合约名称
 * @param options 合约的静态参数
 */
exports.writeDeployedContract = function (name, address, contractName, options) {
    for (let key in options) {
        if (ethers.utils.isAddress(options[key]))
            options[key] = ethers.utils.getAddress(options[key]);
    }
    data.deployedContract[name] = {address: ethers.utils.getAddress(address), contractName: contractName, ...options}
    console.log("Deploy result: write deployed contract " + name + "," + address + "," + contractName);
}
