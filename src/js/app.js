//import '../css/bootstrap.min.css'
App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: async function() {
    return App.initWeb3();
  },

  initWeb3: async function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Elections.json", function(election) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Elections = TruffleContract(election);
      // Connect provider to interact with contract
      App.contracts.Elections.setProvider(App.web3Provider);

      return App.render();
    });
  },

  render: function(){
    var home = $("#home");
    var v_home = $("#v-home");
    var org_home=$("#org-home");
    var org_new=$("#org-new");
    var apply_vote=$("#apply-vote");
    var c_home=$("#c-home");
    var apply_contest=$("#apply-contest");
    var org_approvals=$("#org-approvals");
    var org_approvals_list=$("#org-approvals-list");
    org_approvals_list.hide();
    org_approvals.hide();
    apply_contest.hide();
    c_home.hide();
    apply_vote.hide();
    v_home.hide();
    org_home.hide();
    org_new.hide();
    home.show();
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
      }
    });
  },

  voter: function(){
    var home = $("#home");
    var v_home = $("#v-home");
    var org_home=$("#org-home");
    var org_new=$("#org-new");
    var apply_vote=$("#apply-vote");
    var c_home=$("#c-home");
    var apply_contest=$("#apply-contest");
    var org_approvals=$("#org-approvals");
    var org_approvals_list=$("#org-approvals-list");
    org_approvals_list.hide();
    org_approvals.hide();
    apply_contest.hide();
    c_home.hide();
    apply_vote.hide();
    home.hide();
    org_home.hide();
    org_new.hide();
    v_home.show();
  },

  applyToVote: function(erm){
    var home = $("#home");
    var v_home = $("#v-home");
    var org_home=$("#org-home");
    var org_new=$("#org-new");
    var apply_vote=$("#apply-vote");
    var c_home=$("#c-home");
    var apply_contest=$("#apply-contest");
    var org_approvals=$("#org-approvals");
    var org_approvals_list=$("#org-approvals-list");
    org_approvals_list.hide();
    org_approvals.hide();
    apply_contest.hide();
    c_home.hide();
    apply_vote.show();
    home.hide();
    v_home.hide();
    org_new.hide();
    org_home.hide();
    document.getElementById('vapplyename').value = "";
    document.getElementById('vid').value = "";
    var nuner=$("#nuner_appvote");
    if(erm===0)
      nuner.hide();
    else
      nuner.show();
  },

  voteApplic: async function(){
    var eid=document.getElementById("vapplyename").value;
    var vid=document.getElementById("vid").value;
    var elun=0
    var enid=0;
    await App.contracts.Elections.deployed().then(async function(instance){
      electionsInstance=instance;
      var ec=await electionsInstance.electionsCount();
      return ec;
    }).then(async function(electionsCount){
      for(var i=1;i<=electionsCount;i++)
      {
          await electionsInstance.num_elections(i).then(function(election){
              var ename=election[1];
              if(ename===eid){
                  elun=1;
                  enid=election[0];
              }
          });
          if(elun===1)
            break;
      }
    });
    if(elun===1)
    {
      await App.contracts.Elections.deployed().then(async function(instance){
          elun=await instance.checkVoter(Number(enid),vid,{ from: App.account });
      });
      if(elun==1){
      await App.contracts.Elections.deployed().then(async function(instance){
        await instance.addVoter(Number(enid),vid, { from: App.account });
      });
      return App.voter();
    }
    else{
      return App.applyToVote(1);
    }
    }
    else
      return App.applyToVote(1);
  },

  candidate: function(){
    var home = $("#home");
    var v_home = $("#v-home");
    var org_home=$("#org-home");
    var org_new=$("#org-new");
    var apply_vote=$("#apply-vote");
    var c_home=$("#c-home");
    var apply_contest=$("#apply-contest");
    var org_approvals=$("#org-approvals");
    var org_approvals_list=$("#org-approvals-list");
    org_approvals_list.hide();
    org_approvals.hide();
    apply_contest.hide();
    c_home.show();
    apply_vote.hide();
    home.hide();
    v_home.hide();
    org_new.hide();
    org_home.hide();
  },

  applyToContest: function(erm){
    var home = $("#home");
    var v_home = $("#v-home");
    var org_home=$("#org-home");
    var org_new=$("#org-new");
    var apply_vote=$("#apply-vote");
    var c_home=$("#c-home");
    var apply_contest=$("#apply-contest");
    var org_approvals=$("#org-approvals");
    var org_approvals_list=$("#org-approvals-list");
    org_approvals_list.hide();
    org_approvals.hide();
    apply_contest.show();
    c_home.hide();
    apply_vote.hide();
    home.hide();
    v_home.hide();
    org_new.hide();
    org_home.hide();
    document.getElementById('capplyename').value = "";
    document.getElementById('cid').value = "";
    document.getElementById('cname').value="";
    var nuner=$("#nuner_appcand");
    if(erm===0)
      nuner.hide();
    else
      nuner.show();
  },

  contestApplic:async function(){
    var eid=document.getElementById("capplyename").value;
    var cid=document.getElementById("cid").value;
    var cname=document.getElementById("cname").value;
    var elun=0
    var enid=0;
    await App.contracts.Elections.deployed().then(async function(instance){
      electionsInstance=instance;
      var ec=await electionsInstance.electionsCount();
      return ec;
    }).then(async function(electionsCount){
      for(var i=1;i<=electionsCount;i++)
      {
          await electionsInstance.num_elections(i).then(function(election){
              var ename=election[1];
              if(ename===eid){
                  elun=1;
                  enid=election[0];
              }
          });
          if(elun===1)
            break;
      }
    });
    if(elun===1)
    {
      await App.contracts.Elections.deployed().then(async function(instance){
          elun=await instance.checkCandidate(Number(enid),cid,{ from: App.account });
      });
      if(elun==1){
      await App.contracts.Elections.deployed().then(async function(instance){
        await instance.addCandidate(Number(enid),cid,cname, { from: App.account });
      });
      return App.candidate();
    }
    else{
      return App.applyToContest(1);
    }
    }
    else
      return App.applyToContest(1);
  },

  organizer: function(){
    var home = $("#home");
    var v_home = $("#v-home");
    var org_home=$("#org-home");
    var org_new=$("#org-new");
    var apply_vote=$("#apply-vote");
    var c_home=$("#c-home");
    var org_approvals=$("#org-approvals");
    var org_approvals_list=$("#org-approvals-list");
    org_approvals_list.hide();
    org_approvals.hide();
    c_home.hide();
    apply_vote.hide();
    home.hide();
    v_home.hide();
    org_new.hide();
    org_home.show();
  },

  org_new: function(erm){
    var home = $("#home");
    var v_home = $("#v-home");
    var org_home=$("#org-home");
    var org_new=$("#org-new");
    var nuner=$("#nuner");
    var apply_vote=$("#apply-vote");
    var c_home=$("#c-home");
    var org_approvals=$("#org-approvals");
    var org_approvals_list=$("#org-approvals-list");
    org_approvals_list.hide();
    org_approvals.hide();
    c_home.hide();
    apply_vote.hide();
    home.hide();
    v_home.hide();
    org_new.show();
    document.getElementById('ename').value = "";
    org_home.hide();
    if(erm===0)
      nuner.hide();
    else
      nuner.show();
  },

  org_new_submit: async function(){
    var electionsInstance;
    var nuner=document.getElementById("nuner");
    let elun=1;
    var entext=document.getElementById("ename").value;
    await App.contracts.Elections.deployed().then(async function(instance){
      electionsInstance=instance;
      var ec=await electionsInstance.electionsCount();
      return ec;
    }).then(async function(electionsCount){
      for(var i=1;i<=electionsCount;i++)
      {
          await electionsInstance.num_elections(i).then(function(election){
              var ename=election[1];
              if(ename===entext){
                  elun=0;
              }
          });
          if(elun===0){
            break;
          }
      }
    });
    if(elun===1){
      await App.contracts.Elections.deployed().then(async function(instance){
        await instance.addElection(entext, { from: App.account });
      });
      return App.organizer();
    }
    else{
      return App.org_new(1);
    }
  },

  orgApprovals:async function(seek){
    var home = $("#home");
    var v_home = $("#v-home");
    var org_home=$("#org-home");
    var org_new=$("#org-new");
    var apply_vote=$("#apply-vote");
    var c_home=$("#c-home");
    var org_approvals=$("#org-approvals");
    var org_approvals_list=$("#org-approvals-list");
    org_approvals_list.hide();
    org_approvals.show();
    c_home.hide();
    apply_vote.hide();
    home.hide();
    v_home.hide();
    org_new.hide();
    org_home.hide();
    var etable=$("#elections_table");
    etable.empty();
    await App.contracts.Elections.deployed().then(async function(instance){
      electionsInstance=instance;
      var ec=await electionsInstance.electionsCount();
      return ec;
    }).then(async function(electionsCount){
      for(var i=2;i<=electionsCount;i++)
      {
          await electionsInstance.num_elections(i).then(function(election){
              var eorg=election[2];
              var eid=election[0];
              if(eorg==App.account){
                  var row="<tr><td>" + election[1] + "</td><td><button type="+"button"+" id="+"elsel"+eid+" class="+"btn btn-outline-dark btn-sm mx-1"+">"+"Select"+"</button></td></tr>";
                  etable.append(row);
                  var elsel=document.getElementById("elsel"+eid);
                  elsel.setAttribute("class","btn btn-outline-dark btn-sm mx-1");
                  elsel.onclick=async function(){
                    var home = $("#home");
                    var v_home = $("#v-home");
                    var org_home=$("#org-home");
                    var org_new=$("#org-new");
                    var apply_vote=$("#apply-vote");
                    var c_home=$("#c-home");
                    var apply_contest=$("#apply-contest");
                    var org_approvals=$("#org-approvals");
                    var org_approvals_list=$("#org-approvals-list");
                    org_approvals_list.show();
                    org_approvals.hide();
                    apply_contest.hide();
                    c_home.hide();
                    apply_vote.hide();
                    home.hide();
                    org_home.hide();
                    org_new.hide();
                    v_home.hide();
                    var listable=$("#list_table");
                    listable.empty();
                    if(seek==1)
                    {
                      var nv=election[3];
                      for(var j=1;j<=nv;j++)
                      {
                        var st=await electionsInstance.checkApprovedVoter(Number(eid),Number(j));
                        if(st==1)
                        {
                          var vad=await electionsInstance.getVotersAddress(Number(eid),Number(j));
                          var vid=await electionsInstance.getVotersId(Number(eid),Number(j));
                          var list_row="<tr><td>" + vad + "</td><td>"+vid+"</td><td><button type="+"button"+" id="+"v_approve"+j+" class="+"btn btn-outline-dark btn-sm mx-1"+">"+"Approve"+"</button></td><td><button type="+"button"+" id="+"v_reject"+j+" class="+"btn btn-outline-dark btn-sm mx-1"+">"+"Reject"+"</button></td></tr>";
                          listable.append(list_row);
                          var vapp=document.getElementById("v_approve"+j);
                          var vrej=document.getElementById("v_reject"+j);
                          vapp.setAttribute("class","btn btn-outline-dark btn-sm mx-1");
                          vrej.setAttribute("class","btn btn-outline-dark btn-sm mx-1");
                        }
                      }
                    }
                    else{
                      var nc=election[4];
                    }
                  };
              }
          });
      }
    });
  },
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
