(() => {
  const replay = {
    wheel: {
      locked:{result:'Complete a mission to earn a spin.',detail:'The action explains why the wheel is unavailable.',count:'0',history:'No local result'},
      ready:{result:'A spin is available.',detail:'The qualifying mission is complete. Availability is distinct from a prize result.',count:'1',history:'No local result'},
      result:{result:'The example result is recorded.',detail:'A completed spin leaves a visible prize, multiplier and reward trail. This illustration records 10 example points.',count:'0',history:'Example · 10 points'}
    },
    raffles:{
      progress:{result:'Current goal in progress',detail:'600 of 1,000 example tickets. 400 remain before this goal unlocks.',percent:'60%',next:'Locked · 2,000 tickets',progress:60},
      next:{result:'Current tier unlocked; next goal still locked',detail:'1,200 example tickets: the 1,000-ticket goal is complete. The next 2,000-ticket goal is at 60%, not 100%.',percent:'100%',next:'Next goal · 60% · 800 tickets remain',progress:100},
      complete:{result:'All configured example goals are unlocked',detail:'2,000 example tickets meet the final threshold. Reaching a community goal is separate from winning the draw.',percent:'100%',next:'All example goals complete',progress:100},
      none:{result:'No platform reward is configured',detail:'The event can explain its prize context without fabricating XP or currency rewards.',percent:'—',next:'No platform reward',progress:0}
    },
    match:{
      before:{time:'Illustrated time / 09:00',result:'Prediction begins in 1 hour.',detail:'Details remain visible; submission is unavailable before prediction start.',action:'View details'},
      open:{time:'Illustrated time / 12:00',result:'The prediction window is open.',detail:'Submissions follow the normal flow until 19:00. Kickoff remains visible at 20:00.',action:'Prediction available'},
      locked:{time:'Illustrated time / 19:30',result:'Predictions have closed. The match has not started.',detail:'New submissions and edits are unavailable after prediction end, even though kickoff is still ahead.',action:'View recorded prediction'},
      kickoff:{time:'Illustrated time / 20:00',result:'The match begins; predictions remain closed.',detail:'Kickoff is match context. It does not reopen the submission window or determine the earlier start.',action:'Await match result'}
    },
    social:{
      disconnected:{badge:'Connection required',result:'Connect before you verify.',detail:'The quest can explain the action, but the provider connection is missing.',action:'Connect account'},
      pending:{badge:'Verification pending',result:'The action is being checked.',detail:'A pending check is not a completed quest. Feedback should preserve the member’s context while the provider responds.',action:'Await verification'},
      verified:{badge:'Action verified',result:'Completion can reconcile with the reward.',detail:'The specified flow guards against duplicate rewards if the same completion is verified again.',action:'Show reconciled outcome'},
      expired:{badge:'Connection expired',result:'Reconnect, then retry the check.',detail:'An expired connection explains why verification cannot continue. It is different from failing the quest condition.',action:'Reconnect account'},
      nomatch:{badge:'No matching action',result:'Explain what did not match.',detail:'The member can review the action, hashtag or campaign-window requirement and retry. This is not a provider outage.',action:'Review requirement'}
    },
    streaks:{
      new:{result:'The requirement is visible before any progress.',detail:'New streak: the member can inspect actions and timeframe without an activity history.',image:'feature-assets/streaks-new.png',caption:'Original Figma / new streak'},
      progress:{result:'Partial completion has a visible next action.',detail:'In progress: action completion and timeframe progress explain where the member is now.',image:'feature-assets/streaks-in-progress.png',caption:'Original Figma / streak in progress'},
      earned:{result:'Completion stays connected to its history.',detail:'Earned streak: completed actions and the recorded activity trail explain the result.',image:'feature-assets/streaks-earned.png',caption:'Original Figma / earned streak'}
    },
    family:{
      wheel:{mechanic:'Participation / earned spin',result:'Earn the action before playing.',entry:'A spin from a qualifying mission',time:'Spin availability and optional expiry',after:'A result recorded in spin history'},
      raffle:{mechanic:'Participation / tickets and shared goals',result:'Keep personal and community progress distinct.',entry:'A ticket entry under the configured event rules',time:'Event timing, recurring missions and draw lifecycle',after:'Personal ticket history and event outcome'},
      match:{mechanic:'Participation / prediction window',result:'Separate the submission window from the match.',entry:'A prediction while submissions are open',time:'Prediction start, prediction end and kickoff',after:'A settled or voided match record'}
    }
  };
  document.querySelectorAll('[data-instrument]').forEach(instrument => {
    const type = instrument.dataset.instrument;
    const controls = [...instrument.querySelectorAll('[data-state]')];
    controls.forEach(button => button.addEventListener('click', () => {
      controls.forEach(control => control.setAttribute('aria-pressed',String(control===button)));
      const state=button.dataset.state;
      if(type==='milestones') {
        const done=Number(state);
        instrument.querySelector('[data-result]').textContent=`${done} of 3 stages complete`;
        instrument.querySelector('[data-detail]').textContent=done===3?'All example conditions are complete. The outcome remains connected to the three requirements.':done===1?'The first requirement is complete. The remaining stage conditions stay visible.':'Each condition remains visible before the member starts.';
        instrument.querySelector('progress').value=done;
        instrument.querySelectorAll('[data-stage]').forEach(stage=>{
          const complete=Number(stage.dataset.stage)<=done;
          stage.dataset.complete=String(complete);
          stage.querySelector('small').textContent=complete?'Complete':Number(stage.dataset.stage)===done+1?'Current requirement':'Requirement to complete';
        });
        return;
      }
      const data=replay[type]?.[state];
      if(!data) return;
      Object.entries(data).forEach(([key,value])=>{
        const target=instrument.querySelector(`[data-${key}]`);
        if(target) target.textContent=value;
      });
      if(type==='raffles') {
        const ring=instrument.querySelector('.goal-ring');
        ring.style.setProperty('--progress',`${data.progress}%`);
        ring.setAttribute('aria-label',data.percent==='—'?'No platform reward configured':`Illustrated current goal progress: ${data.percent}`);
      }
      if(type==='streaks') {
        const img=instrument.querySelector('[data-streak-image]');
        img.src=data.image; img.alt=data.caption;
        instrument.querySelector('[data-streak-caption]').textContent=data.caption;
      }
    }));
    // Buttons remain ordinary buttons: Tab reaches every state; Enter/Space and tap replay it.
  });
})();
