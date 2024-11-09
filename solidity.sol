// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract InsuranceContract {
    struct Policy {
        string policyType;
        uint256 coverageAmount;
        uint256 premiumAmount;
        bool isActive;
    }

    mapping(uint256 => Policy) public policies;
    mapping(address => uint256) public userPolicies; // Mapping from address to Policy ID

    event PolicyCreated(uint256 policyId, address policyHolder);
    event ClaimSubmitted(uint256 policyId, string reason, uint256 claimAmount, string message);

    uint256 public policyCounter;

    // Create a new policy
    function createPolicy(
        string memory _policyType,
        uint256 _coverageAmount,
        uint256 _premiumAmount
    ) public {
        policyCounter++;
        policies[policyCounter] = Policy({
            policyType: _policyType,
            coverageAmount: _coverageAmount,
            premiumAmount: _premiumAmount,
            isActive: true
        });
        userPolicies[msg.sender] = policyCounter;
        emit PolicyCreated(policyCounter, msg.sender);
    }

    // Submit a claim for a policy
    function submitClaim(
        uint256 _policyId,
        string memory _reason,
        uint256 _claimAmount
    ) public returns (string memory) {
        require(policies[_policyId].isActive, "Policy is inactive.");
        require(policies[_policyId].coverageAmount >= _claimAmount, "Claim amount exceeds coverage.");
        require(userPolicies[msg.sender] == _policyId, "Unauthorized claim submission.");

        emit ClaimSubmitted(_policyId, _reason, _claimAmount, "Claim Verification Process Started");

        // Claim verification (for simplicity, we assume the claim is verified if the amount is under coverage)
        if (_claimAmount <= policies[_policyId].coverageAmount) {
            return "Insurance claim has been verified successfully.";
        } else {
            return "Insurance value cannot be found.";
        }
    }
}