// Helper functions for Qualtrics

var $experiment = (function() {
  const _techniques = ['tui', 'button'];
  const _complexities = ['low', 'med', 'high'];
  const _dateSelectTypes = ['calendar', 'dropdown'];
  const _trials = {
    low: [
      {instruction: 'Task - search for a one-way ticket for yourself', task: 'Singapore to New York; Next Mon', result: ''},
      {instruction: 'Task - search for a one-way ticket for yourself', task: 'Bangkok to Cleveland; Next Tue', result: ''},
      {instruction: 'Task - search for a one-way ticket for yourself', task: 'London to Tokyo(NRT); In 2 days time', result: ''},
    ],
    med: [
      {instruction: 'Task - search for a one-way ticket for your family', task: 'Denver to Ho Chi Minh; Next Tue; 2 adults, 3 children', result: ''},
      {instruction: 'Task - search for a one-way ticket for your family', task: 'Bangkok to Cleveland; Dec 15 2019; 3 adults, 1 child', result: ''},
      {instruction: 'Task - search for a one-way ticket for your family', task: 'Perth to Taipei; Nov 30 2019; 2 adults, 4 children', result: ''},
    ],
    high: [
      {instruction: 'Task - search for a luxury roundtrip for your family', task: 'Miami to Hanoi; next Mon to Thu; 4 adults, 3 children; Business class only', result: ''},
      {instruction: 'Task - search for a normal roundtrip for your family', task: 'Paris to Sydney; Dec 25 2019 to Jan 25 2020; 2 adults, 2 children; Economy class only', result: ''},
      {instruction: 'Task - search for a luxury roundtrip for your family', task: 'Jakarta(HLP) to Busan; Dec 8 2019 for 10 days; 3 adults, 4 children; Business class only', result: ''},
    ],
    dummy: [
      {instruction: 'Task - search for a one-way ticket for yourself', task: 'Singapore to Los Angeles; Dec 2 2019', result: ''},
      {instruction: 'Task - search for a one-way ticket for yourself', task: 'Singapore to Los Angeles; Dec 2 2019', result: ''},
      {instruction: 'Task - search for a roundtrip for yourself', task: 'Singapore to Los Angeles; Dec 2 2019 to Dec 9 2019', result: ''}
    ]
  };
  const _dummySteps = {
    1:{
      id: 1,
      technique: 'button',
      complexity: 'med',
      dateSelectType: 'calendar',
      trials: [_trials.dummy[0]]
    },
    2:{
      id: 2,
      technique: 'button',
      complexity: 'med',
      dateSelectType:'dropdown',
      trials: [_trials.dummy[1]]
    },
    3:{
      id: 3,
      technique: 'tui',
      complexity: 'med',
      dateSelectType: 'calendar',
      trials: [_trials.dummy[2]]
    }
  }

  function getStepIdsForTextUI(arrangementId) {
    return findStepsForTechnique(arrangementId, _techniques[0]);
  }

  function getStepIdsForButtonUI(arrangementId) {
    return findStepsForTechnique(arrangementId, _techniques[1]);
  }

  function getDateSelectForId(i) {
    return _dateSelectTypes[i - 1];
  }

  function getStepForId(arrangementId, i) {
    const a = getArrangementForId(arrangementId);
    const technique = a.techniques[Math.floor((i - 1) / a.complexities.length)];
    const complexity = a.complexities[(i - 1) % a.complexities.length];

    return {
      id: i,
      technique,
      complexity
    };
  }

  function getArrangementForId(i) {
    const techniqueSeq = generateFullCounterBalance([..._techniques]);
    const complexitySeq = generateFullCounterBalance([..._complexities]);

    const techniques = techniqueSeq[Math.floor((i - 1) / complexitySeq.length)]; // 0, 1
    const complexities = complexitySeq[(i - 1) % complexitySeq.length]; // 0 - 5

    return {
      id: i,
      techniques,
      complexities
    };
  }

  function findStepsForTechnique(arrangementId, technique) {
    const a = getArrangementForId(arrangementId);
    const results = [];
    for (let i = 1; i <= 6; i++) {
      if (
        a.techniques[Math.floor((i - 1) / a.complexities.length)] === technique
      ) {
        results.push(i);
      }
    }
    return results.join(',');
  }

  function generateFullCounterBalance(items) {
    const results = [];
    for (const sequence of heapPermutation(items, items.length)) {
      results.push(sequence);
    }
    return results;
  }

  function* heapPermutation(a, size) {
    if (size === 1) {
      yield [...a];
      return;
    }

    for (let i = 0; i < size; i++) {
      yield* heapPermutation(a, size - 1);
      if (size % 2 === 1) {
        [a[0], a[size - 1]] = [a[size - 1], a[0]];
      } else {
        [a[i], a[size - 1]] = [a[size - 1], a[i]];
      }
    }
  }

  return {
    getStepForId,
    getDateSelectForId,
    getArrangementForId,
    getStepIdsForTextUI,
    getStepIdsForButtonUI,
    trials: _trials,
    dummySteps: _dummySteps
  };
})();

// Sample code for printing all sequences
// for (let i = 1; i <= 12; i++) {
//   const a = $experiment.getArrangementForId(i);
//   for (let j = 1; j <= 6; j++) {
//     const s = $experiment.getStepForId(i,j);
//     console.log([i, j, s.technique, s.complexity].join('\t'));
//   }
  
// }
