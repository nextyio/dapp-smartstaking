// const expectEvent = require('../helpers/expectEvent');
// const expectThrow = require('../helpers/expectThrow');
const assertRevert = require('../helpers/assertRevert');
const ether = require('../helpers/ether');

const SmartStaking = artifacts.require('SmartStaking');

require('chai')
    .use(require('chai-as-promised'))
    .should();

contract('SmartStaking', function (accounts) {

    const [
      owner,
      recipient,
      anyone,
    ] = accounts;

    beforeEach(async function () {
        this.contract = await SmartStaking.new({ from: owner });
    });

    describe('ownership', function () {
        it('should have an owner', async function () {
          let owner_ = await this.contract.owner();
          assert.isTrue(owner_ !== 0);
        });
        
        it('changes owner after transfer', async function () {
          await this.contract.transferOwnership(anyone);
          let owner_ = await this.contract.owner();
        
          assert.isTrue(owner_ === anyone);
        });
    
        it('should prevent non-owners from transfering', async function () {
          const owner_ = await this.contract.owner.call();
          assert.isTrue(owner_ !== recipient);
          await assertRevert(this.contract.transferOwnership(recipient, { from: anyone }));
        });
    
        it('should guard ownership against stuck state', async function () {
          let originalOwner = await this.contract.owner();
          await assertRevert(this.contract.transferOwnership(null, { from: originalOwner }));
        });
    })

    describe('admin', function () {
        describe('non-admin cannot set/update packages information', function () {
            it('package1 information', async function () {
                await assertRevert(this.contract.setupPackage1(15, { from: anyone }));
            });

            it('package2 information', async function () {
                await assertRevert(this.contract.setupPackage2(25, { from: anyone }));
            });
            
            it('package3 information', async function () {
                await assertRevert(this.contract.setupPackage3(35, { from: anyone }));
            });
            
            it('package4 information', async function () {
                await assertRevert(this.contract.setupPackage4(45, { from: anyone }));
            });
        });

        describe('owner can set/update each package information', function () {
            it('package1 information', async function () {
                await this.contract.setupPackage1(15, { from: owner });
            });

            it('package2 information', async function () {
                await this.contract.setupPackage2(25, { from: owner });
            });

            it('package3 information', async function () {
                await this.contract.setupPackage3(35, { from: owner });
            });

            it('package4 information', async function () {
                await this.contract.setupPackage4(45, { from: owner });
            });
        });
    });

    describe('reward pool', function () {
        const value = ether(42);
        it('should accept payments', async function () {
            await this.contract.send(value).should.be.fulfilled;
        });

        it('should forward funds to wallet', async function () {
            await this.contract.sendTransaction({ value, from: owner }).should.be.fulfilled;
        });
    });
});
