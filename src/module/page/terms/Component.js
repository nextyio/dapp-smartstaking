import React from 'react';
import LoggedInPage from '../LoggedInPage';
import Footer from '@/module/layout/Footer/Container'
import { Link } from 'react-router-dom'

import './style.scss'

import { Breadcrumb, Icon } from 'antd'

export default class extends LoggedInPage {

    ord_renderContent () {
        return (
            <div className="">
                <div className="ebp-header-divider">

                </div>
                <div className="ebp-page">
                    <h3 className="text-center">Terms & Conditions</h3>
                    <p><strong>Terms and Conditions</strong></p>
                    <p><strong><em>1 &ndash; Terms and definitions</em></strong></p>
                    <p>These terms define the terms of use of Nexty&rsquo;s smart contract and tokens on the decentralized distributed Nexty blockchain.</p>
                    <p>The nature and use of smart contracts and tokens.</p>
                    <p>Nexty&rsquo;s smart contract (the &ldquo;smart contract&rdquo; or &ldquo;software&rdquo;) is the software deployed and running on the decentralized distributed Nexty blockchain (the &ldquo;platform&rdquo;).</p>
                    <p>A third-party platform is a resource that allows transferring tokens to its users.</p>
                    <p>Originally, this software was developed and deployed by Nexty (the &ldquo;Company&rdquo; or &ldquo;We&rdquo;, or &ldquo;Us&rdquo;, or &ldquo;Our&rdquo;).</p>
                    <p>Nexty coins (the &ldquo;NTY&rdquo;) are part of the Software and ensure its interaction with the Network.</p>
                    <p>By using a smart contract, including its tokens, You expressly acknowledge and represent that You (the &ldquo;User&rdquo; or &ldquo;You&rdquo;, or &ldquo;Your&rdquo;) have carefully reviewed and accepted this Agreement between You as a User and the Company.</p>
                    <p>The offer is a public offer.</p>
                    <p>THE SOFTWARE, INCLUDING NTY, IS PROVIDED &ldquo;AS IS&rdquo; WITHOUT ANY WARRANTY, EITHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO WARRANTIES&nbsp; OF&nbsp; MERCHANTABILITY,&nbsp; FITNESS&nbsp; FOR&nbsp; A&nbsp; PARTICULAR&nbsp; PURPOSE&nbsp; AND NONINFRINGEMENT.</p>
                    <p>UNDER NO CIRCUMSTANCES&nbsp; THE&nbsp; AUTHORS&nbsp; OR AUTHORS&rsquo; PARTNERS WILL BE LIABLE FOR ANY CLAIMS, LOSSES OR OTHER LIABILITIES FOR DAMAGES, IN CONTRACT OR IN TORT, ARISING IN CONNECTION WITH THE SOFTWARE OR TOKENS, OR THEIR USE OR OTHER DUTIES IN THE SOFTWARE OR TOKENS.</p>
                    <p>On the terms and conditions set forth herein You agree with the terms and conditions, join the Nexty&rsquo;s SmartStaking program, and We agree to provide this service.</p>
                    <p>You are responsible for determining which period of staking You are going to use and how much NTY is deposited.</p>
                    <p>You are also responsible for withholding, collecting, reporting and transferring the correct taxes to the appropriate tax authorities.</p>
                    <ol start="2">
                    <li><strong><em> Rights and transparency</em></strong></li>
                    </ol>
                    <p>NTY is not a financial surrogate or money.</p>
                    <p>Code of the software is open and published on https://github.com/nextyio/dapp-smartstaking.</p>
                    <p>Due to the nature of the Network code of the working software, it can not be changed after deployment.</p>
                    <p>We do not guarantee that the Site meets Your requirements, that access to the Site will be provided continuously, quickly, securely and without errors.</p>
                    <p>Software and hardware errors, both on Our and on Your side, which led to that You were unable to get access to the Site, its software and tokens, shall be events of force majeure and the basis for releasing Us from liability for non-fulfillment of obligations.</p>
                    <p>We reserve the right to use all results of intellectual activity.</p>
                    <p>You are not entitled to use any results of intellectual activity without Our prior written consent.</p>
                    <ol start="3">
                    <li><strong><em> Responsibility</em></strong></li>
                    </ol>
                    <p>Access to third-party content can be provided to You on certain conditions and with unambiguous consent of third parties.</p>
                    <p>You use third-party content at Your own risk.</p>
                    <p>We are not responsible for any costs or damages incurred by You when using such content.</p>
                    <p>We do not guarantee the correctness or accuracy of the information provided by third parties.</p>
                    <p>However, we reserve the right to restrict access to third-party content through the Site.</p>
                    <p>You shall take reasonable and appropriate measures to ensure safe and confidential access to any device related to Account Data,&nbsp; access&nbsp; to&nbsp; email&nbsp; related&nbsp; to&nbsp; Account&nbsp; Data,&nbsp; and&nbsp; email&nbsp; related&nbsp; to the electronic purse You use on our Site.</p>
                    <p>We take necessary and sufficient legal, organizational and technical measures to protect the information&nbsp; provided&nbsp; by&nbsp; You&nbsp; from&nbsp; unauthorized&nbsp; or &nbsp;accidental&nbsp; access,&nbsp; destruction,&nbsp; modification, blocking, copying, distribution, as well as from other illegal actions of third parties with it.</p>
                    <p>Intentional attacks on the Site shall exclude our responsibility.</p>
                    <ol start="4">
                    <li><strong><em> Amendments</em></strong></li>
                    </ol>
                    <p>We have the right to unilaterally change the terms and conditions of the Agreement.</p>
                    <p>We will notify You of any change in T&amp;C by publishing a new version of this Agreement on the Site.</p>
                    <ol start="5">
                    <li><strong><em> Dispute resolution</em></strong></li>
                    </ol>
                    <p>Any dispute arising out of or related to this Agreement is personal to you and the Company and will be resolved solely through individual arbitration.</p>
                </div>
            </div>
        )
    }

    ord_renderBreadcrumb() {
        return (
            <Breadcrumb style={{ 'marginLeft': '16px', 'marginTop': '16px', float: 'right' }}>
                <Breadcrumb.Item><Link to="/dashboard"><Icon type="home" /> Home</Link></Breadcrumb.Item>
                <Breadcrumb.Item> Terms & Conditions</Breadcrumb.Item>
            </Breadcrumb>
        );
    }
}
