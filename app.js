// Ensure that Web3.js is loaded first in the browser
window.addEventListener('load', async () => {
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!');
        
        // Initialize Web3
        const web3 = new Web3(window.ethereum);
        
        // Contract details
        const contractABI = [
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "policyId",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "string",
                        "name": "reason",
                        "type": "string"
                    }
                ],
                "name": "ClaimSubmitted",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "policyId",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "policyHolder",
                        "type": "address"
                    }
                ],
                "name": "PolicyCreated",
                "type": "event"
            },
            {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "policyType",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "coverageAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "premiumAmount",
                        "type": "uint256"
                    }
                ],
                "name": "createPolicy",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "policyId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "reason",
                        "type": "string"
                    }
                ],
                "name": "submitClaim",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ];
        const contractAddress = "0x341b331369010cEA4f92E92F3a5C476D506F3143"; // Your contract address
        
        try {
            // Request access to MetaMask accounts
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log("Connected to MetaMask!");
            
            const accounts = await web3.eth.getAccounts();
            const account = accounts[0];
            console.log("Connected account:", account);
            document.getElementById("account").innerText = `Connected Account: ${account}`;

            // Initialize contract
            const contract = new web3.eth.Contract(contractABI, contractAddress);

            // Handle Create Policy Form submission
            document.getElementById("createPolicyForm").addEventListener("submit", function(e) {
                e.preventDefault();
                const policyType = document.getElementById("policyType").value;
                const coverageAmount = document.getElementById("coverageAmount").value;
                const premiumAmount = document.getElementById("premiumAmount").value;

                contract.methods.createPolicy(policyType, coverageAmount, premiumAmount)
                    .send({ from: account })
                    .then(function(receipt) {
                        document.getElementById("createStatus").innerText = `Policy Created Successfully! User ID: ${account}`;
                    })
                    .catch(function(error) {
                        console.error(error);
                        document.getElementById("createStatus").innerText = "Failed to create policy!";
                    });
            });

            // Handle View Policy Button click
            document.getElementById("viewPolicyButton").addEventListener("click", function() {
                const userId = prompt("Enter your User ID:");
                if (userId === "8926") {
                    document.getElementById("policyTable").style.display = "block";
                    document.getElementById("invalidUserId").style.display = "none";
                } else {
                    document.getElementById("policyTable").style.display = "none";
                    document.getElementById("invalidUserId").style.display = "block";
                }
            });

            // Handle Claim Insurance Button click
            document.getElementById("claimInsuranceButton").addEventListener("click", function() {
                const userId = prompt("Enter your User ID:");
                if (userId === "8926") {
                    document.getElementById("claimDetailsForm").style.display = "block";
                } else {
                    alert("Invalid User ID.");
                }
            });

            // Handle Claim Insurance Form submission
            document.getElementById("claimForm").addEventListener("submit", function(e) {
                e.preventDefault();
                const claimReason = document.getElementById("claimReason").value;
                const claimAmount = document.getElementById("claimAmount").value;
                const claimDate = document.getElementById("claimDate").value;
                const otherDetails = document.getElementById("otherDetails").value;

                contract.methods.submitClaim(1, claimReason) // Submit claim for policyId 1
                    .send({ from: account })
                    .then(function(receipt) {
                        document.getElementById("claimStatus").innerText = "Insurance claim submitted successfully.";
                        document.getElementById("claimDetailsForm").style.display = "none";
                    })
                    .catch(function(error) {
                        console.error(error);
                        document.getElementById("claimStatus").innerText = "Failed to submit claim!";
                    });
            });

        } catch (error) {
            console.error("MetaMask connection error:", error);
            alert("Please install MetaMask and connect your account.");
        }
    } else {
        alert("Please install MetaMask to interact with this application.");
    }
});
