(async () => {
  const DATA = {
    account: "wakbowaa",
    contributionType: "Intelligent Contract",
    projectName: "Counterexample Bell",
    primaryTag: "Dispute Resolution",
    oneLiner:
      "Ring a public bell on a universal claim; one valid, in-domain counterexample breaks it, while ambiguity and out-of-domain cases remain on record.",
    description:
      "Ring the bell on a universal claim before others rely on it. The owner freezes the claim, two to eight domain rules, a deadline, and a challenge cap. Another wallet submits a concrete scenario and argument. GenLayer validators agree on every domain-membership boolean and whether the scenario contradicts the claim. Only an all-in-domain contradiction marks the bell BROKEN; outside-domain and ambiguous challenges remain recorded without defeating it. The owner cannot challenge their own bell or erase one after public participation. If the window ends without a valid counterexample, anyone can close it as SURVIVED. That state is a bounded falsification receipt, not proof of eternal truth. The repository includes adversarial direct tests, an exact deployed-source hash, a finalized StudioNet deployment, and a live two-wallet challenge that reached BROKEN.",
    demoUrl: "",
    steps: [
      {
        heading: "Clone the reviewed source",
        instruction:
          "Clone https://github.com/wakbowaa/counterexample-bell and enter the repository. Use Python 3.12 or newer. The reviewed contract is contracts/contract.py.",
      },
      {
        heading: "Run the local checks",
        instruction:
          "Install genlayer-py, genlayer-test, and pytest. Run python -m pytest -q, then run genvm-lint contracts/contract.py. Confirm that all 5 direct tests pass and lint reports success.",
      },
      {
        heading: "Match source to deployment",
        instruction:
          "Open deployment.json and contracts/contract.py. Compute the contract file SHA-256 and confirm it equals 592c0e8c9625b973511816e786b8b49fdb7ec25cef8a5bdf886ab1617b4239d6. Confirm the deployed address is 0x8A076bE666aF7ABf1502B7a4D2E8D155F7699068.",
      },
      {
        heading: "Prepare two wallets",
        instruction:
          "Fund two StudioNet wallets. Set OWNER_PRIVATE_KEY for the bell owner and CHALLENGER_PRIVATE_KEY for the challenger. The two wallets demonstrate separate authorization roles; they are not presented as independent third-party authorities.",
      },
      {
        heading: "Run a fresh falsification",
        instruction:
          "Run python scripts/smoke.py. If the wallet tooling prompts, approve the ring transaction with the owner wallet and the challenge transaction with the challenger wallet. The script broadcasts each write and then waits for finalized MAJORITY_AGREE; broadcast or submission alone is not acceptance or finalization.",
      },
      {
        heading: "Inspect the final receipt",
        instruction:
          "Open the transaction links printed by the script or evidence/live-run.json. Confirm both writes finalized successfully. Read get_bell for the generated ID and confirm state BROKEN, winning_index 0, domain_matches [true, true], contradicts true, and verdict VALID_COUNTEREXAMPLE.",
      },
    ],
    expected:
      "After the first write is finalized, get_bell returns OPEN with the frozen claim, domain rules, and deadline. After the second wallet's finalized challenge, the same bell returns BROKEN, winning_index 0, domain_matches [true, true], contradicts true, and verdict VALID_COUNTEREXAMPLE. Both Explorer receipts show MAJORITY_AGREE and successful leader execution. Broadcast or submission alone is not treated as finalization.",
    contract:
      "https://explorer-studio.genlayer.com/address/0x8A076bE666aF7ABf1502B7a4D2E8D155F7699068",
    website:
      "https://explorer-studio.genlayer.com/address/0x8A076bE666aF7ABf1502B7a4D2E8D155F7699068",
    github: "https://github.com/wakbowaa/counterexample-bell",
    evidence: [
      "https://github.com/wakbowaa/counterexample-bell",
      "https://explorer-studio.genlayer.com/tx/0xc7f006f1f6267f94a759e111f8bdb250ca6d22a7c75d264b3eaf1ced32c9f5cc",
      "https://explorer-studio.genlayer.com/tx/0x1961c94324a512d7200312cc5d3fac80789e6fd177858f13c06be55c351a2b3c",
      "https://explorer-studio.genlayer.com/tx/0x796d75dd0712e65682c93147de4efff9382f47c2d3dcfb808824dc6d00af0ac5",
    ],
  };

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const normalized = (value) =>
    String(value || "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  const visible = (element) =>
    Boolean(
      element &&
        element.getClientRects().length &&
        getComputedStyle(element).visibility !== "hidden"
    );

  const form = document.querySelector("form");
  if (!form) throw new Error("GenLayer contribution form was not found.");
  if (!normalized(document.body.innerText).includes(DATA.account)) {
    throw new Error(`Open the Portal with the ${DATA.account} account first.`);
  }

  const typeInput = [...form.querySelectorAll("input")].find((input) =>
    normalized(input.placeholder).includes("search contribution type")
  );
  if (
    !typeInput ||
    normalized(typeInput.value) !== normalized(DATA.contributionType)
  ) {
    throw new Error(
      `Select Builder > ${DATA.contributionType} first, then run this script again.`
    );
  }

  const setValue = (element, value) => {
    if (!element) throw new Error("A required form control was not found.");
    const prototype =
      element instanceof HTMLTextAreaElement
        ? HTMLTextAreaElement.prototype
        : element instanceof HTMLSelectElement
          ? HTMLSelectElement.prototype
          : HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(prototype, "value").set;
    setter.call(element, value);
    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
    element.dispatchEvent(new Event("blur", { bubbles: true }));
  };

  const section = (title) =>
    [...form.querySelectorAll("section")].find(
      (item) => normalized(item.querySelector("h2")?.textContent) === normalized(title)
    );
  const buttonByText = (root, text) =>
    [...root.querySelectorAll("button")].find(
      (button) => visible(button) && normalized(button.textContent) === normalized(text)
    );

  const identity = section("Make it recognizable");
  const projectName = [...identity.querySelectorAll('input[type="text"]')].find(
    visible
  );
  setValue(projectName, DATA.projectName);
  const primaryTag = [...identity.querySelectorAll("select")].find((select) =>
    [...select.options].some(
      (option) => normalized(option.textContent) === normalized(DATA.primaryTag)
    )
  );
  const primaryOption = [...primaryTag.options].find(
    (option) => normalized(option.textContent) === normalized(DATA.primaryTag)
  );
  setValue(primaryTag, primaryOption.value);
  await wait(300);

  setValue(section("One-liner").querySelector("input"), DATA.oneLiner);
  setValue(section("Description").querySelector("textarea"), DATA.description);
  const demoInput = section("Show it in action").querySelector("input");
  setValue(demoInput, DATA.demoUrl);

  const pathSection = section("Write the exact path");
  while (pathSection.querySelectorAll(".step-row").length < DATA.steps.length) {
    const addStep = buttonByText(pathSection, "+ Add another step");
    if (!addStep) throw new Error("Add another step button was not found.");
    addStep.click();
    await wait(180);
  }
  const stepRows = [...pathSection.querySelectorAll(".step-row")];
  DATA.steps.forEach((step, index) => {
    setValue(stepRows[index].querySelector("input"), step.heading);
    setValue(stepRows[index].querySelector("textarea"), step.instruction);
  });

  const verification = section("Prove the path works");
  setValue(verification.querySelector("textarea"), DATA.expected);
  const contractInput = [...verification.querySelectorAll('input[type="url"]')].find(
    visible
  );
  setValue(contractInput, DATA.contract);

  const projectLinks = section("Send people to it");
  const linkInputs = [...projectLinks.querySelectorAll('input[type="url"]')].filter(
    visible
  );
  if (linkInputs.length < 2) throw new Error("Website and GitHub fields were not found.");
  setValue(linkInputs[0], DATA.website);
  setValue(linkInputs[1], DATA.github);

  const evidenceHeading = [...form.querySelectorAll("h2")].find(
    (heading) => normalized(heading.textContent) === "evidence & supporting information"
  );
  if (!evidenceHeading) throw new Error("Evidence section was not found.");
  let evidenceRoot = evidenceHeading.parentElement;
  while (
    evidenceRoot &&
    evidenceRoot !== form &&
    ![...evidenceRoot.querySelectorAll("button")].some(
      (button) => normalized(button.textContent) === "add evidence"
    )
  ) {
    evidenceRoot = evidenceRoot.parentElement;
  }
  if (!evidenceRoot || evidenceRoot === form) {
    throw new Error("Evidence controls were not found.");
  }

  const evidenceFields = () =>
    [...evidenceRoot.querySelectorAll('input[type="url"]')].filter(visible);
  const addEvidence = () => buttonByText(evidenceRoot, "Add Evidence");
  while (evidenceFields().length < DATA.evidence.length) {
    const button = addEvidence();
    if (!button) throw new Error("Add Evidence button was not found.");
    button.click();
    await wait(350);
  }
  for (let index = 0; index < DATA.evidence.length; index += 1) {
    setValue(evidenceFields()[index], DATA.evidence[index]);
    await wait(650);
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
  console.table({
    account: DATA.account,
    contributionType: DATA.contributionType,
    projectName: DATA.projectName,
    primaryTag: DATA.primaryTag,
    oneLinerCharacters: DATA.oneLiner.length,
    descriptionCharacters: DATA.description.length,
    verificationCharacters: DATA.expected.length,
    exactPathSteps: DATA.steps.length,
    evidenceItems: DATA.evidence.length,
    website: DATA.website,
    github: DATA.github,
  });
  console.log(
    "Counterexample Bell is filled. Review every field, complete the CAPTCHA yourself, then press Submit Contribution manually."
  );
})();
