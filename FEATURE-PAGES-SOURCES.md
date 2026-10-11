# Feature pages: source and release record

Built on 12 October 2026 on `codex/feature-pages-local`. Entry point: `features.html`. The seven feature pages are Milestones, Mini Games, Spin the Wheel, Raffles, Match Prediction, Social Quests and Streaks. The requested “smash prediction” is represented by the archived Match Prediction feature.

## Authority and contribution

The feature dossiers in the Portfolio archive provide historical ClickUp/Paseo context. Current CatTrader UI was inspected for source evidence; two explicitly approved sandbox domain entries were subsequently added. Figma frames establish design intent. Preserved product captures establish their visible historical states. The walkthroughs are deterministic, synthetic explanations, not production replicas or live game actions.

| Feature | Main evidence | Contribution boundary |
| --- | --- | --- |
| Milestones | Original Figma Milestones list; widget Settings/Progress export; CatTrader Community Missions Ver 2 | Product and widget configuration design; documented behavior reconstructed locally |
| Mini Games | Preserved wheel and match screens; source models; CatTrader The Cat Playroom | Shared product/widget system, with individual contributor boundaries on the linked pages |
| Spin the Wheel | Original Figma wheel frame; preserved dashboard/settings/configuration captures; live CatTrader preview | Feature and widget design evidence; synthetic availability/result walkthrough |
| Raffles | Original Figma event frame; archived review specifications and acceptance criteria | Another designer led the feature. Rui reviewed descriptions, goal-progress states, responsive behavior and acceptance criteria |
| Match Prediction | Scheduling and custom-team specifications; preserved match screens; ended CatTrader match | Rui’s scheduling and reusable-team extension; base game was collaborator-led. Design-complete custom-team work is not asserted released |
| Social Quests | Archived TikTok integration specification; CatTrader linked-account and connection-gate screens | Integration product specification. Design completion does not verify implementation or release |
| Streaks | Original Figma lifecycle/settings exports; archived delivery/QA record; rendered CatTrader widget | Rui originated/designed/implemented the widget locally; Wai Yan reviewed code. Recorded production task stage is not a completed final production check |

Relevant archive folders, relative to the parent Portfolio workspace:

- `source-materials/returningai-work-memory-2024-2026/features/`: TikTok integration, custom teams, streaks delivery/QA, raffle review and milestone reminders.
- `source-materials/paseo-design-workspace-2026-09-25/features/` and `source-materials/widgets-2026-09-23/widgets/features/`: feature requirements and configuration authority.
- `widget-handoff-rebuild/SOURCE-MAP.md`: archive-backed widget/source boundaries.
- Read-only `/Users/asni/Desktop/tradingroom`: match scheduling specification and wheel/raffle models.

## Screenshot provenance

Fresh Figma PNG exports were downloaded through the existing Figma export controls without modifying the canvas:

- `milestones-figma.png`: [Milestones list](https://www.figma.com/design/lrl8MSCX0j9J7Fcxe2ZWv4/Milestone?node-id=4202-46825).
- `wheel-figma.png`: [Spin the wheel](https://www.figma.com/design/b79j4izTx2j1tOE0a5N8ky/Mini-Games?node-id=4001-5978).
- `raffles-figma.png`: [Raffles Page](https://www.figma.com/design/96FxVKKt8hH5eshYUldfpd/Raffles?node-id=4002-6307).

Preserved Figma exports were copied for Streaks new/in-progress/earned states and administrator settings. The page links point to the corresponding exact Figma nodes. Milestones widget settings uses the existing `widget-assets/figma-origin/` export. Existing `games-assets/` screenshots are labelled preserved product captures because their exact Figma provenance is not established.

Six `cattrader-*.jpg` assets and seventeen additional `*-staging-*.jpg` assets are fresh product captures. They crop the feature/preview content out of full browser screenshots and exclude identities and account chrome. The new wheel and social-quest details include feature configuration, with no connected social handle exposed. Captures show the viewport portion of scrollable widgets. No game was played, prediction entered, account connected or reward transaction performed.

Missing exact Social Quests Figma screens and newer Match Prediction scheduling/custom-team frames are flagged on their pages. Current ClickUp/Paseo connector access was unavailable; preserved records were used. Missing evidence did not stop the pages. Raffles has no configured current CatTrader event; two crops of the original Figma show ticket history and community goals.

## Official widget integration

Inspected saved CatTrader widgets:

| Widget | Exact ID | Observed mode | Saved domains |
| --- | --- | --- | --- |
| Community Missions Ver 2 | `NmFjNTE0NjkxODk5ODM2MGI3MTQ3M2E2` | Live | CatTrader and `ruitong-portfolio26.vercel.app` |
| The Cat Playroom | `NmFjNDY0NzAwZjZkOTA3MGFmYjkwMDk1` | Development | CatTrader and `ruitong-portfolio26.vercel.app` |
| Your Paw-sitive Streak | `NmFjNDkzODIzMjY2Y2YxN2MwMTI3ZGEy` | Development | CatTrader and `ruitong-portfolio26.vercel.app` |

The saved Playroom contains Purrfect Spin and Cats Cup Match Prediction; it does not include Raffles. The Socials widget group has no saved widget.

`feature-widget-embed.js` uses the observed official loader at `https://sgtr-eks-widgets.genesiv.org/widget-loader.js`. Localhost is outside every saved policy, so no remote loader or identity is sent from this review build. The captured preview remains visible. On a permitted HTTPS origin, the exact widget can be connected using a session-supplied registered sandbox identity. It is not persisted or copied from the Store integration. The integration validates message origin/source and retains the capture on errors/timeouts. Live loading is checked separately on the public alias after deployment; localhost keeps the captured fallback.

On explicit approval, the public portfolio domain was added to The Cat Playroom and Your Paw-sitive Streak and persisted after reload. Development mode and all selected users/roles were retained. No INFINOX, Markemics or other client portal was changed.

## Verification

Browser results and screenshots are saved in the parent workspace under `output/playwright/feature-pages/`.

- Eight routes (collection plus seven features) checked at actual 1440px and 390px browser viewports.
- All eight routes also pass a 768px tablet overflow check. The skip link receives first keyboard focus with a visible outline.
- No document overflow, missing visible images, broken section anchors or JavaScript page errors.
- All local replay states checked, including Enter and Space; mobile navigation remains visible.
- No-JavaScript views retain the explanations, source links and screenshots, and hide inactive replay controls.
- Reduced motion removes transitions and smooth scrolling.
- Coarse-pointer mobile context: all replay controls respond to tap, and all eight routes remain 390px wide.
- All 49 distinct local link targets return HTTP 200. The settled mobile run produced no console errors. Two transient localhost image connection errors occurred during rapid repeated QA navigation; the affected Streaks image subsequently loaded and decoded in the complete-page checks.
- With feature images intentionally blocked, Milestones still exposes its full flow and source links.
- Localhost sends no widget identity or loader because it remains outside the saved policy. Public beta authentication is verified separately at the allowed production origin.

Asset checksums are recorded in `feature-assets/SHA256SUMS`; run verification from that directory.

## Portfolio design review

Verdict: accept for publication after live verification. Rubric score: 16/18 (content-shaped composition 1, authored identity 2, reading rhythm 2, interaction meaning 2, resting clarity 2, responsive equivalence 2, accessibility 1, evidence integrity 2, performance restraint 2).

The authored ideas are feature-specific: staged completion, earned-spin eligibility, current versus future raffle goals, three independent match clocks, provider verification states and the streak lifecycle. Captions and flow descriptions carry the meaning before any interaction. Screens, specifications and delivery records vary the page density.

The highest risk of a generic pattern is the shared case-study hero. Family-wide navigation and material language are intentional; the Mini Games overview, raffle evidence, large match headline and Streaks lifecycle proof vary their proportions. No decorative reveal sequence or continuous animation was added.

Accessibility paths were exercised with keyboard, touch, reduced motion, no JavaScript and image failure. This is not a full assistive-technology certification. Browser zoom/enlarged-text testing is not recorded. All decorative rotations were removed; screenshots and cards remain straight. The source gaps and unavailable localhost live widgets are explicitly disclosed rather than represented as completed integrations.
