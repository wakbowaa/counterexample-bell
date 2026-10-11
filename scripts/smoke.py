import json
import os
import re
import time
from pathlib import Path

from genlayer_py import create_account, create_client
from genlayer_py.chains import studionet
from genlayer_py.contracts import actions as contract_actions


def calldata_compat(method=None, args=None, kwargs=None):
    result = {}
    if method is not None:
        result["method"] = method
    if args:
        result["args"] = args
    if kwargs:
        result["kwargs"] = kwargs
    return result


contract_actions.make_calldata_object = calldata_compat
ROOT = Path(__file__).parents[1]
ENV_PATH = ROOT.parents[3] / "accounts.env"
ENV = ENV_PATH.read_text(encoding="utf-8") if ENV_PATH.exists() else ""


def key(account_number, environment_name):
    supplied = os.environ.get(environment_name, "").strip()
    if supplied:
        return supplied
    match = re.search(
        rf'^ACCOUNT_{account_number}_GENLAYER_PRIVATE_KEY\s*=\s*"?([^"\r\n]+)',
        ENV,
        re.M,
    )
    if match is None:
        raise RuntimeError(
            f"Set {environment_name}; workspace fallback account {account_number} was not found"
        )
    return match.group(1).strip()


owner = create_account(account_private_key=key(6, "OWNER_PRIVATE_KEY"))
challenger = create_account(account_private_key=key(7, "CHALLENGER_PRIVATE_KEY"))
owner_client = create_client(chain=studionet, account=owner)
challenger_client = create_client(chain=studionet, account=challenger)
address = json.loads((ROOT / "deployment.json").read_text())["contractAddress"]


def write(client, name, args):
    tx = client.write_contract(address=address, function_name=name, args=args)
    print(f"{name}_tx={tx}", flush=True)
    receipt = client.wait_for_transaction_receipt(
        transaction_hash=tx,
        wait_until="finalized",
        retries=180,
        interval=5000,
        full_transaction=True,
    )
    leaders = receipt.get("consensus_data", {}).get("leader_receipt") or []
    leaders = [leaders] if isinstance(leaders, dict) else leaders
    assert receipt.get("result_name") == "MAJORITY_AGREE"
    assert any(item.get("execution_result") == "SUCCESS" for item in leaders)
    return str(tx)


bell_id = f"LIVE-BELL-{int(time.time())}"
transactions = {
    "ring": write(
        owner_client,
        "ring",
        [
            bell_id,
            "Occupied library exit rule",
            "Every designated emergency exit remains unlocked whenever the public library is occupied.",
            [
                "The scenario occurs while the public library is occupied.",
                "The scenario identifies the state of a designated emergency exit.",
            ],
            3600,
            4,
        ],
    )
}
transactions["challenge"] = write(
    challenger_client,
    "challenge",
    [
        bell_id,
        "At 14:00 while visitors occupied the public library, the designated east emergency exit was locked and could not be opened from inside.",
        "This named occupied-hours observation satisfies both frozen domain rules and directly contradicts the universal unlocked-exit claim.",
    ],
)
final = owner_client.read_contract(
    address=address,
    function_name="get_bell",
    args=[bell_id],
)
assert final["state"] == "BROKEN"
assert final["winning_index"] == 0
evidence = {
    "bellId": bell_id,
    "contract": address,
    "transactions": transactions,
    "final": final,
    "disclosure": "The scenario is an explicit demonstration case submitted from the second configured wallet.",
}
(ROOT / "evidence").mkdir(exist_ok=True)
(ROOT / "evidence" / "live-run.json").write_text(
    json.dumps(evidence, indent=2) + "\n",
    encoding="utf-8",
)
print(json.dumps(evidence, indent=2))
