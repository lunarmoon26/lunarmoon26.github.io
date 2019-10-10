// Helper functions for Qualtrics

var $experiment = (function() {
  const _techniques = ['tui', 'button'];
  const _complexities = ['low', 'med', 'high'];
  const _dateSelectTypes = ['calendar', 'dropdown'];

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
    getStepIdsForButtonUI
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
