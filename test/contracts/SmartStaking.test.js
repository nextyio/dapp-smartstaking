// const expectEvent = require('../helpers/expectEvent');
// const expectThrow = require('../helpers/expectThrow');
const assertRevert = require('../helpers/assertRevert');

const SmartStaking = artifacts.require('SmartStaking');

require('chai')
    .use(require('chai-as-promised'))
    .should();

contract('SmartStaking', function (accounts) {
    let contract;

    const [
      owner,
      recipient,
      anyone,
    ] = accounts;

    beforeEach(async function () {
        contract = await SmartStaking.new({ from: owner });
    });

    describe('ownership', function () {
        it('should have an owner', async function () {
          let owner_ = await contract.owner();
          assert.isTrue(owner_ !== 0);
        });
        
        it('changes owner after transfer', async function () {
          await contract.transferOwnership(anyone);
          let owner_ = await contract.owner();
        
          assert.isTrue(owner_ === anyone);
        });
    
        it('should prevent non-owners from transfering', async function () {
          const owner_ = await contract.owner.call();
          assert.isTrue(owner_ !== recipient);
          await assertRevert(contract.transferOwnership(recipient, { from: anyone }));
        });
    
        it('should guard ownership against stuck state', async function () {
          let originalOwner = await contract.owner();
          await assertRevert(contract.transferOwnership(null, { from: originalOwner }));
        });
    });    
});
