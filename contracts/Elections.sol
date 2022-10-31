// SPDX-License-Identifier: MIT
pragma solidity >=0.4.20;

contract Elections{

    struct Election{
        uint id;
        string name;
        address orgad;
        uint no_voters;
        uint no_cands;
        string status;
    }

    struct Voter{
        address ad;
        string vid;
        string app_status;
    }

    struct Candidate{
        address ad;
        string cid;
        string cname;
        string app_status;
    }

    constructor () public {
        addElection("Candidate 1");
    }

    mapping(uint => Election) public num_elections;

    mapping(uint => mapping(uint => Voter)) public resp_voters;

    mapping(uint => mapping(uint =>Candidate)) public resp_cands;

    uint public electionsCount;

    function addElection (string memory _name) public {
        electionsCount ++;
        num_elections[electionsCount] = Election(electionsCount,_name,msg.sender,0,0,"VNS");
    }

    function checkVoter (uint enid, string memory vid) public view returns(uint){
        uint ret=1;
        for(uint i=1;i<=num_elections[enid].no_voters;i++)
        {
            string memory pr=resp_voters[enid][i].vid;
            if(keccak256(abi.encodePacked(pr)) == keccak256(abi.encodePacked((vid)))){
                ret=0;
                break;
            }
        }
        return ret;
    }

    function checkCandidate (uint enid, string memory cid) public view returns(uint){
        uint ret=1;
        for(uint i=1;i<=num_elections[enid].no_cands;i++)
        {
            string memory pr=resp_cands[enid][i].cid;
            if(keccak256(abi.encodePacked(pr)) == keccak256(abi.encodePacked((cid)))){
                ret=0;
                break;
            }
        }
        return ret;
    }

    function addVoter (uint enid, string memory vid) public {
        num_elections[enid].no_voters++;
        resp_voters[enid][num_elections[enid].no_voters]=Voter(msg.sender,vid,"Q");
    }

    function addCandidate (uint enid, string memory cid, string memory cname) public {
        num_elections[enid].no_cands++;
        resp_cands[enid][num_elections[enid].no_cands]=Candidate(msg.sender,cid,cname,"Q");
    }

    function checkApprovedVoter(uint enid, uint vind) public view returns(uint){
        string memory st=resp_voters[enid][vind].app_status;
        if(keccak256(abi.encodePacked(st)) == keccak256(abi.encodePacked("Q")))
            return 1;
        else
            return 0;
    }

    function getVotersAddress(uint enid, uint vind) public view returns(address){
        return resp_voters[enid][vind].ad;
    }

    function getVotersId(uint enid, uint vind) public view returns(string memory){
        return resp_voters[enid][vind].vid;
    }
}