(() => {
  const lab = document.querySelector("[data-prd-lab]");
  if (!lab) return;

  const brief = lab.querySelector("[data-brief]");
  const count = lab.querySelector("[data-count]");
  const generate = lab.querySelector("[data-generate]");
  const panel = lab.querySelector(".document-panel");
  const status = lab.querySelector("[data-document-status]");
  const title = lab.querySelector("[data-title]");
  const summary = lab.querySelector("[data-summary]");
  const problem = lab.querySelector("[data-problem]");
  const targets = {
    goals: lab.querySelector("[data-goals]"),
    nonGoals: lab.querySelector("[data-non-goals]"),
    assumptions: lab.querySelector("[data-assumptions]"),
    flows: lab.querySelector("[data-flows]"),
    requirements: lab.querySelector("[data-requirements]"),
    nfr: lab.querySelector("[data-nfr]"),
    criteria: lab.querySelector("[data-criteria]"),
    risks: lab.querySelector("[data-risks]"),
    questions: lab.querySelector("[data-questions]")
  };
  const inputError = lab.querySelector("[data-input-error]");
  const traceLabel = lab.querySelector("[data-trace-label]");
  const traceSource = lab.querySelector("[data-trace-source]");
  const traceReason = lab.querySelector("[data-trace-reason]");

  const examples = {
    analytics: "I want a dashboard where community admins can see active channel users, filter by time range, compare activity, and export a report. I am not sure how “active” should be defined yet.",
    approval: "Create an approval workflow for marketing teams. A requester submits campaign content, an approver can approve it or request changes, and everyone should see the current status. We have not decided whether one or several approvers are required.",
    settings: "Redesign notification settings so members can choose email or in-app alerts by event type. Existing choices must be preserved. I do not know whether push notifications are in scope."
  };

  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;","\"":"&quot;"}[char]));
  const clean = (value) => value.replace(/\s+/g, " ").trim();
  const sentence = (value) => clean(value).split(/(?<=[.!?])\s+/)[0].slice(0, 260);
  const cap = (value) => value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
  const label = (kind) => kind === "question" ? "Needs clarification" : cap(kind);

  function item(kind, textValue, sourceValue, reasonValue) {
    return '<button class="trace-item" type="button" data-provenance="' + kind + '" data-source="' + escapeHtml(sourceValue) + '" data-reason="' + escapeHtml(reasonValue) + '"><span>' + label(kind) + '</span><p>' + escapeHtml(textValue) + "</p></button>";
  }

  function flowItem(steps, sourceValue) {
    const stepMarkup = steps.map((step, index) => '<p><b>' + String(index + 1).padStart(2, "0") + "</b>" + escapeHtml(step) + "</p>").join("<i>→</i>");
    return '<button class="trace-item trace-item--flow" type="button" data-provenance="provided" data-source="' + escapeHtml(sourceValue) + '" data-reason="The supplied actions are ordered into a reviewable flow without choosing unresolved product rules."><span>Provided</span>' + stepMarkup + "</button>";
  }

  function criterionItem(entry, index) {
    return '<button class="trace-item trace-item--criterion" type="button" data-provenance="derived" data-source="' + escapeHtml(entry.source) + '" data-reason="' + escapeHtml(entry.reason) + '"><span>Derived</span><div><strong>AC-' + String(index + 1).padStart(2, "0") + " · " + escapeHtml(entry.title) + '</strong><dl><div><dt>Given</dt><dd>' + escapeHtml(entry.given) + '</dd></div><div><dt>When</dt><dd>' + escapeHtml(entry.when) + '</dd></div><div><dt>Then</dt><dd>' + escapeHtml(entry.then) + "</dd></div></dl></div></button>";
  }

  function inferTitle(text) {
    const match = text.match(/(?:create|build|design|want)\s+(?:an?\s+)?([^,.]{3,70}?)(?:\s+(?:where|that|so|for)\b|[,.])/i);
    if (match) return cap(match[1].replace(/^to\s+/i, "").trim());
    const keyword = ["dashboard","approval workflow","notification settings","settings","report","onboarding","checkout"].find((word) => text.toLowerCase().includes(word));
    return keyword ? cap(keyword) : "Structured product brief";
  }

  function detectScenario(text) {
    const lower = text.toLowerCase();
    if (/dashboard|analytics|activity|compare/.test(lower)) return "analytics";
    if (/approv|request changes|campaign/.test(lower)) return "approval";
    if (/notification|alert|email|push/.test(lower)) return "settings";
    return "generic";
  }

  function suppliedActions(text) {
    const lower = text.toLowerCase();
    const actions = [];
    if (/filter/.test(lower)) actions.push("Apply the supplied filters before reviewing results");
    if (/compare/.test(lower)) actions.push("Compare items against one visible, consistent basis");
    if (/export|download/.test(lower)) actions.push("Export the current view with completion and failure feedback");
    if (/approve/.test(lower)) actions.push("Allow an authorized approver to approve the submitted item");
    if (/request changes|reject/.test(lower)) actions.push("Return the item with a visible reason and next step");
    if (/status/.test(lower)) actions.push("Show the current workflow status to everyone involved");
    if (/email/.test(lower)) actions.push("Let members control email alerts by the supplied event types");
    if (/in-app|in app/.test(lower)) actions.push("Let members control in-app alerts by the supplied event types");
    if (/preserv/.test(lower)) actions.push("Preserve existing choices while the interface changes");
    return actions.slice(0, 5);
  }

  function unresolvedQuestions(text, scenario) {
    const lower = text.toLowerCase();
    const list = [];
    if (/active/.test(lower) && /(not sure|not decided|do not know|don't know)/.test(lower)) list.push(["What event and time threshold define an “active” user?", "active"]);
    if (/approver/.test(lower) && /(not decided|not sure|whether)/.test(lower)) list.push(["Is one approver sufficient, or is sequential or parallel approval required?", "one or several approvers"]);
    if (/push/.test(lower) && /(not.*scope|do not know|don't know)/.test(lower)) list.push(["Are push notifications part of this release?", "push notifications"]);
    if (/export|download/.test(lower)) list.push(["Which export format, fields, and permission rules are required?", "export"]);
    if (scenario === "analytics") list.push(["Which event source and refresh cadence make the comparison trustworthy?", "No data source or freshness requirement was supplied."]);
    if (scenario === "approval") list.push(["Who may submit, approve, reassign, and view each request?", "No role and permission matrix was supplied."]);
    if (scenario === "settings") list.push(["Which event types are available for each notification channel?", "The brief names channels but not the event taxonomy."]);
    if (!/(admin|member|user|customer|requester|approver|team|people|visitor)/.test(lower)) list.push(["Who is the primary user for this workflow?", sentence(text)]);
    if (!/(metric|measure|success|conversion|retention|time saved)/.test(lower)) list.push(["How will the team judge whether this change is useful?", sentence(text)]);
    return list.slice(0, 4);
  }

  function baseDraft(text) {
    const source = clean(text);
    const scenario = detectScenario(source);
    return {
      source,
      scenario,
      title: inferTitle(source),
      goal: sentence(source),
      questions: unresolvedQuestions(source, scenario)
    };
  }

  function scenarioDraft(text) {
    const draft = baseDraft(text);
    const shared = {
      title: draft.title,
      goal: draft.goal,
      questions: draft.questions,
      summary: draft.title + "—a medium-detail first draft that converts the supplied request into scope, flows, delivery checks, risks, and explicit decisions still needed."
    };

    if (draft.scenario === "analytics") return Object.assign(shared, {
      problem: "Community administrators need a consistent way to understand and compare channel activity without reconstructing data across separate views.",
      nonGoals: ["No automated recommendations, alerts, or changes to community activity are included.", "No definition of “active,” data source, or export policy is chosen by this draft."],
      assumptions: ["Activity events and channel access are available to the dashboard.", "The same activity definition can be applied to every compared channel."],
      flow: ["Select a time range", "Review loading or data state", "Compare channels on one basis", "Export the filtered report"],
      requirements: ["FR-01 · Let an administrator select and retain a time range.", "FR-02 · Apply the same visible range and activity definition to every comparison.", "FR-03 · Show loading, empty, partial, unavailable, and retry states without clearing filters.", "FR-04 · Export the currently filtered view and report completion or failure."],
      nfr: ["NFR-01 · Restrict administrative activity data to authorized roles.", "NFR-02 · Keep filters, comparisons, and export operable by keyboard and legible at narrow widths."],
      criteria: [
        {title:"A shared range governs every comparison",given:"Activity data exists for two or more channels",when:"The administrator changes the time range",then:"Every comparison updates to the same range and the selected range remains visible",source:"filter by time range, compare activity",reason:"Two supplied actions become one observable, testable result."},
        {title:"An empty response preserves context",given:"No activity exists for the selected range",when:"The comparison finishes loading",then:"The empty state explains the result and retains the selected range and channels",source:"A filtered comparison requires an empty state.",reason:"This is a safe system-state derivation; its exact copy still requires review."},
        {title:"Export reflects the reviewed state",given:"Filters and comparison scope are visible",when:"The administrator starts an export",then:"The output uses that scope and shows completion or a recoverable failure",source:"export a report",reason:"The supplied action is checked through completion and failure without choosing a file format."}
      ],
      risks: ["Risk · An unresolved activity definition could make comparisons misleading.", "Dependencies · Event source, refresh cadence, role permissions, and export policy."]
    });

    if (draft.scenario === "approval") return Object.assign(shared, {
      problem: "Marketing requesters and approvers need one visible handoff state so campaign content does not disappear into chat or ambiguous review loops.",
      nonGoals: ["No campaign authoring, scheduling, or asset-production tools are included.", "No single, sequential, or parallel approval policy is chosen by this draft."],
      assumptions: ["Requester and approver identities already exist.", "A submitted request has enough context for a reviewer to make a decision."],
      flow: ["Submit campaign content", "Notify the eligible approver", "Approve or request changes", "Show the resulting status to participants"],
      requirements: ["FR-01 · Let a requester submit campaign content with the context required for review.", "FR-02 · Show who owns the next action and the current review status.", "FR-03 · Let an authorized approver approve or request changes with a reason.", "FR-04 · Preserve a readable decision history after every state change."],
      nfr: ["NFR-01 · Prevent people without approval authority from changing the decision state.", "NFR-02 · Keep status, ownership, and failure recovery visible after refresh or navigation."],
      criteria: [
        {title:"A valid submission enters review",given:"A requester supplies the required campaign content",when:"They submit the request",then:"The request enters review, shows its owner, and both participants see the same status",source:"A requester submits campaign content.",reason:"The supplied flow is expressed as an observable transition."},
        {title:"A change request creates a next step",given:"A request is awaiting review",when:"The approver requests changes",then:"The requester sees the reason, the status changes, and the request can be revised without losing history",source:"an approver can request changes",reason:"The requested action needs an explicit recoverable outcome."},
        {title:"Approval closes the active review step",given:"An authorized approver is reviewing a valid request",when:"They approve it",then:"The decision, actor, time, and final status are visible to all participants",source:"an approver can approve it",reason:"The supplied action becomes a verifiable record rather than a transient message."}
      ],
      risks: ["Risk · An unresolved approval model could create conflicting or duplicate decisions.", "Dependencies · Role permissions, notification delivery, required submission fields, and audit retention."]
    });

    if (draft.scenario === "settings") return Object.assign(shared, {
      problem: "Members need to control alert channels by event type without losing preferences they already rely on.",
      nonGoals: ["No push-notification channel is included until scope is confirmed.", "No event taxonomy or delivery policy is redesigned by this interface change."],
      assumptions: ["Existing notification choices can be read and mapped to the new controls.", "Email and in-app channels support the same visible event taxonomy unless documented otherwise."],
      flow: ["Load existing preferences", "Choose an event type", "Change email or in-app delivery", "Save and confirm the preserved state"],
      requirements: ["FR-01 · Load every existing preference before presenting editable controls.", "FR-02 · Let members choose email or in-app delivery by event type.", "FR-03 · Distinguish unsaved changes, saving, saved, and failed states.", "FR-04 · Preserve unaffected choices when one event or channel changes."],
      nfr: ["NFR-01 · Do not send a notification preference change until save succeeds.", "NFR-02 · Group controls with readable labels and complete keyboard focus order."],
      criteria: [
        {title:"Existing choices survive the redesign",given:"A member already has saved notification preferences",when:"They open the redesigned settings",then:"Every supported choice matches the previously saved state",source:"Existing choices must be preserved.",reason:"The explicit constraint becomes a staging verification point."},
        {title:"One change does not rewrite the rest",given:"Several event preferences are visible",when:"The member changes one channel and saves",then:"Only that choice changes and all unaffected preferences remain intact",source:"choose email or in-app alerts by event type",reason:"The requested control model requires additive, isolated updates."},
        {title:"A failed save is recoverable",given:"The member has unsaved changes",when:"Saving fails",then:"The choices remain visible, no success is claimed, and retry is available",source:"Settings changes need understandable system states.",reason:"Failure handling is a safe interface requirement."}
      ],
      risks: ["Risk · A migration mismatch could silently reset existing preferences.", "Dependencies · Existing preference schema, event taxonomy, channel availability, and save API behavior."]
    });

    const actions = suppliedActions(draft.source);
    const genericRequirements = actions.length ? actions : ["Preserve the supplied action and make its resulting state visible"];
    return Object.assign(shared, {
      problem: "The primary user needs the supplied workflow converted into clear, reviewable product behavior.",
      nonGoals: ["No adjacent workflow, automation, or metric is included unless the brief names it.", "No implementation architecture is prescribed by this first draft."],
      assumptions: ["The target user, permissions, and source data still need confirmation."],
      flow: ["Enter the workflow", "Perform the primary action", "Review the resulting state", "Recover or continue"],
      requirements: genericRequirements.map((entry, index) => "FR-" + String(index + 1).padStart(2, "0") + " · " + entry + "."),
      nfr: ["NFR-01 · Preserve user context through loading, empty, success, and failure states.", "NFR-02 · Keep the primary flow keyboard operable and readable on narrow screens."],
      criteria: [
        {title:"The primary action has an observable result",given:"The required information is available",when:"The user performs the primary action",then:"The result is visible, current context is preserved, and failure offers recovery",source:draft.goal,reason:"The supplied request becomes an observable action and outcome."},
        {title:"Missing input remains visible",given:"A required product decision has not been supplied",when:"The draft is reviewed",then:"The decision appears as an open question instead of an invented requirement",source:draft.goal,reason:"The writer protects the grounding boundary."}
      ],
      risks: ["Risk · Missing actors, permissions, or data rules may materially change the flow.", "Dependencies · Product owner confirmation, source availability, and delivery constraints."]
    });
  }

  function render(text) {
    const source = clean(text);
    const draft = scenarioDraft(source);
    title.textContent = draft.title;
    summary.textContent = draft.summary;
    problem.textContent = draft.problem;
    targets.goals.innerHTML = item("provided", draft.goal, draft.goal, "This goal is a concise restatement of the visitor’s own brief; no outcome metric has been invented.");
    targets.nonGoals.innerHTML = draft.nonGoals.map((entry) => item("derived", entry, source, "The draft makes scope boundaries explicit so adjacent capabilities do not enter silently.")).join("");
    targets.assumptions.innerHTML = draft.assumptions.map((entry) => item("question", entry, source, "The brief does not prove this dependency, so it remains a review item rather than a fact.")).join("");
    targets.flows.innerHTML = flowItem(draft.flow, source);
    targets.requirements.innerHTML = draft.requirements.map((entry, index) => item(index < 2 ? "provided" : "derived", entry, source, "This requirement is grounded in the supplied action or a necessary, reviewable system state.")).join("");
    targets.nfr.innerHTML = draft.nfr.map((entry) => item("derived", entry, source, "This quality boundary supports safe delivery without inventing a business policy or technical contract.")).join("");
    targets.criteria.innerHTML = draft.criteria.map(criterionItem).join("");
    targets.risks.innerHTML = draft.risks.map((entry) => item("question", entry, source, "The source does not resolve this delivery dependency, so it remains visible for human review.")).join("");
    targets.questions.innerHTML = draft.questions.length
      ? draft.questions.map(([textValue, sourceValue]) => item("question", textValue, sourceValue, "The brief does not resolve this decision, so the draft keeps it open instead of choosing for the user.")).join("")
      : item("question", "Which constraints, permissions, and success measures should govern the first release?", source, "The brief supplies a direction but not enough evidence to invent delivery constraints or success measures.");

    status.textContent = "Ready for human review";
    inputError.hidden = true;
    inputError.textContent = "";
    panel.setAttribute("aria-busy", "false");
    bindTraceItems();
    resetTrace();
  }

  function resetTrace() {
    traceLabel.textContent = "Select any statement to inspect its source.";
    traceSource.textContent = "Provided facts, safe derivations and unresolved questions stay visibly different.";
    traceReason.textContent = "This trace is the core interaction: the output is useful, but its authority remains inspectable.";
    lab.querySelectorAll(".trace-item").forEach((node) => node.classList.remove("is-selected"));
  }

  function bindTraceItems() {
    lab.querySelectorAll(".trace-item").forEach((node) => {
      node.addEventListener("click", () => {
        lab.querySelectorAll(".trace-item").forEach((itemNode) => itemNode.classList.toggle("is-selected", itemNode === node));
        const kind = node.dataset.provenance;
        traceLabel.textContent = kind === "question" ? "Kept open on purpose" : kind === "provided" ? "Grounded in the brief" : "Safe structural derivation";
        traceSource.textContent = "“" + node.dataset.source + "”";
        traceReason.textContent = node.dataset.reason;
      });
    });
  }

  function updateCount() {
    count.textContent = brief.value.length.toLocaleString() + " / 1,200";
  }

  lab.querySelectorAll("[data-example]").forEach((button) => button.addEventListener("click", () => {
    brief.value = examples[button.dataset.example];
    updateCount();
    brief.focus();
  }));

  lab.querySelectorAll("[data-trace-filter]").forEach((button) => button.addEventListener("click", () => {
    const active = button.getAttribute("aria-pressed") === "true";
    lab.querySelectorAll("[data-trace-filter]").forEach((node) => node.setAttribute("aria-pressed", "false"));
    button.setAttribute("aria-pressed", String(!active));
    lab.dataset.trace = active ? "all" : button.dataset.traceFilter;
  }));

  function generateDraft() {
    const value = clean(brief.value);
    if (value.length < 24) {
      status.textContent = "More context needed";
      inputError.textContent = "Add at least 24 characters so the draft has a product action or goal to structure.";
      inputError.hidden = false;
      brief.setAttribute("aria-invalid", "true");
      brief.focus();
      return;
    }
    brief.removeAttribute("aria-invalid");
    generate.disabled = true;
    panel.setAttribute("aria-busy", "true");
    status.textContent = "Structuring scope, flows, and verification…";
    window.setTimeout(() => {
      render(value);
      generate.disabled = false;
      panel.scrollIntoView({behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start"});
    }, matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 420);
  }

  brief.addEventListener("input", () => {
    updateCount();
    if (brief.hasAttribute("aria-invalid")) {
      brief.removeAttribute("aria-invalid");
      inputError.hidden = true;
      inputError.textContent = "";
    }
  });
  brief.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      generateDraft();
    }
  });
  generate.addEventListener("click", generateDraft);
  updateCount();
  bindTraceItems();
})();

(() => {
  const map = document.querySelector("[data-logic-map]");
  if (!map) return;
  const controls = [...map.querySelectorAll("[data-logic-key]")];
  const details = [...map.querySelectorAll("[data-logic-detail]")];
  const status = map.querySelector("[data-logic-status]");
  const validKeys = new Set(controls.map((control) => control.dataset.logicKey));
  const capLabel = (value) => value.charAt(0).toUpperCase() + value.slice(1);

  function selectLogic(key, moveFocus = false) {
    if (!validKeys.has(key)) return;
    map.dataset.active = key;
    controls.forEach((control) => {
      const selected = control.dataset.logicKey === key;
      control.setAttribute("aria-pressed", String(selected));
      if (selected && moveFocus) control.focus();
    });
    details.forEach((detail) => {
      detail.hidden = detail.dataset.logicDetail !== key;
    });
    if (status) status.textContent = capLabel(key) + " selected";
  }

  map.classList.add("is-enhanced");
  controls.forEach((control, index) => {
    control.addEventListener("click", () => selectLogic(control.dataset.logicKey));
    control.addEventListener("keydown", (event) => {
      if (!["ArrowRight","ArrowDown","ArrowLeft","ArrowUp"].includes(event.key)) return;
      event.preventDefault();
      const direction = ["ArrowRight","ArrowDown"].includes(event.key) ? 1 : -1;
      const next = (index + direction + controls.length) % controls.length;
      selectLogic(controls[next].dataset.logicKey, true);
    });
  });
  selectLogic(map.dataset.active || "source");
})();

(() => {
  const workbench = document.querySelector("[data-version-workbench]");
  if (!workbench) return;
  const controls = [...workbench.querySelectorAll("[data-version-focus]")];
  const scenes = [...workbench.querySelectorAll("[data-version-scene]")];
  const caption = workbench.querySelector("[data-version-caption]");
  const status = workbench.querySelector("[data-version-status]");
  const validKeys = new Set(controls.map((control) => control.dataset.versionFocus));
  const capLabel = (value) => value.charAt(0).toUpperCase() + value.slice(1);

  function selectVersion(key, moveFocus = false) {
    if (!validKeys.has(key)) return;
    workbench.dataset.focus = key;
    controls.forEach((control) => {
      const selected = control.dataset.versionFocus === key;
      control.setAttribute("aria-pressed", String(selected));
      if (selected && moveFocus) control.focus();
    });
    scenes.forEach((scene) => {
      scene.hidden = scene.dataset.versionScene !== key;
    });
    const selectedControl = controls.find((control) => control.dataset.versionFocus === key);
    caption.textContent = selectedControl.dataset.caption;
    if (status) status.textContent = capLabel(key) + " selected";
  }

  workbench.classList.add("is-enhanced");
  controls.forEach((control, index) => {
    control.addEventListener("click", () => selectVersion(control.dataset.versionFocus));
    control.addEventListener("keydown", (event) => {
      if (!["ArrowRight","ArrowDown","ArrowLeft","ArrowUp"].includes(event.key)) return;
      event.preventDefault();
      const direction = ["ArrowRight","ArrowDown"].includes(event.key) ? 1 : -1;
      const next = (index + direction + controls.length) % controls.length;
      selectVersion(controls[next].dataset.versionFocus, true);
    });
  });
  selectVersion(workbench.dataset.focus || "architecture");
})();
