from conftest import CONTRACT

RULES=['The scenario occurs while the public building is occupied.','The scenario identifies the state of a designated emergency exit.']
def opened(vm,deploy,owner):
 vm.warp('2035-01-01T00:00:00+00:00');vm.sender=owner;c=deploy(CONTRACT);c.ring('exit-7','Occupied-building exit rule','Every designated emergency exit remains unlocked whenever the public building is occupied.',RULES,600,4);return c
def verdict(vm,matches,contradicts,verdict):
 import json;vm.mock_llm(r'.*Counterexample Bell falsification test.*',json.dumps({'domain_matches':matches,'contradicts':contradicts,'verdict':verdict}))
def test_valid_counterexample_breaks_claim(direct_vm,direct_deploy,direct_alice,direct_bob):
 c=opened(direct_vm,direct_deploy,direct_alice);direct_vm.sender=direct_bob;verdict(direct_vm,[True,True],True,'VALID_COUNTEREXAMPLE');c.challenge('exit-7','At 14:00, while visitors occupied the library, the east designated emergency exit was locked.','This occupied-building observation contradicts the claim for a named emergency exit.');x=c.get_bell('exit-7');assert x['state']=='BROKEN' and x['winning_index']==0
def test_outside_domain_does_not_break(direct_vm,direct_deploy,direct_alice,direct_bob):
 c=opened(direct_vm,direct_deploy,direct_alice);direct_vm.sender=direct_bob;verdict(direct_vm,[False,True],True,'OUTSIDE_DOMAIN');c.challenge('exit-7','During overnight closure, a designated emergency exit was locked while no visitor occupied the building.','The exit was locked, but the described observation occurred outside occupied hours.');assert c.get_bell('exit-7')['state']=='OPEN'
def test_owner_cannot_challenge_and_duplicate_rejected(direct_vm,direct_deploy,direct_alice,direct_bob):
 c=opened(direct_vm,direct_deploy,direct_alice);verdict(direct_vm,[True,True],True,'VALID_COUNTEREXAMPLE')
 with direct_vm.expect_revert('external challenge'):c.challenge('exit-7','At noon the occupied building had a locked designated exit at the east corridor.','The owner must not be able to manufacture the winning counterexample.')
 direct_vm.sender=direct_bob;c.challenge('exit-7','At noon the occupied building had a locked designated exit at the east corridor.','A named locked exit during occupancy directly contradicts the universal claim.')
def test_validator_rejects_forged_verdict(direct_vm,direct_deploy,direct_alice):
 c=opened(direct_vm,direct_deploy,direct_alice);verdict(direct_vm,[True,True],True,'VALID_COUNTEREXAMPLE');b=c.bells['EXIT-7'];r=c._judge(b,'At noon the occupied building had a locked designated east emergency exit.','This is within domain and contradicts the universal statement.');assert direct_vm.run_validator(leader_result=r) is True;f=dict(r);f['verdict']='AMBIGUOUS';assert direct_vm.run_validator(leader_result=f) is False
def test_permissionless_close_after_deadline(direct_vm,direct_deploy,direct_alice,direct_charlie):
 c=opened(direct_vm,direct_deploy,direct_alice);direct_vm.warp('2035-01-01T00:11:00+00:00');direct_vm.sender=direct_charlie;c.close('exit-7');assert c.get_bell('exit-7')['state']=='SURVIVED'
