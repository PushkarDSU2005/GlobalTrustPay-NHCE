import fs from 'fs';
import solc from 'solc';

const contractPath = './contracts/EscrowContract.sol';
const source = fs.readFileSync(contractPath, 'utf8');

const input = {
  language: 'Solidity',
  sources: {
    'EscrowContract.sol': {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['abi', 'evm.bytecode.object'],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

if (output.errors) {
  output.errors.forEach((err) => console.error(err.formattedMessage));
} else {
  const contract = output.contracts['EscrowContract.sol'].EscrowContract;
  
  if (!fs.existsSync('./src/contracts')) {
    fs.mkdirSync('./src/contracts');
  }

  fs.writeFileSync('./src/contracts/EscrowContract.json', JSON.stringify({
    abi: contract.abi,
    bytecode: contract.evm.bytecode.object
  }, null, 2));

  console.log('Contract compiled successfully! ABI and Bytecode saved to src/contracts/EscrowContract.json');
}
