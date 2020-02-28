const { join } = require('path')
const { readFileSync } = require('fs')
const lookup = require('./codon-table')

const sequence = readFileSync(join('.', 'nih-seq.txt'), { encoding: 'utf8' })
  // convert DNA to mRNA
  // a -> u
  // c -> g
  // t -> a
  // g -> c
  .split('t').join('x')
  .split('a').join('w')
  .split('c').join('y')
  .split('g').join('z')
  .split('x').join('a')
  .split('w').join('u')
  .split('y').join('g')
  .split('z').join('c')

console.log(sequence.substring(0, 10))
console.log(
  `The sequence is ${sequence.length} characters in length`
)

// The indices are based on values found in the NIH
// report (https://www.ncbi.nlm.nih.gov/nuccore/MN908947.3)
// which are 1-index (as opposed to 0-indexing typical in computing)
const getGeneSequence = (startIndex, endIndex) => {
  return sequence.substring(startIndex - 1, endIndex)
}

// group the sequence into threes
const sequenceAcids = seq => {
  const acids = []
  for (let i = 0; i < seq.length - 3; i++) {
    const codon = seq.substring(i, i + 3)
    acids.push(codon)
  }
  return acids
}

// print the look up the codons we've found
// in our codon table and print the amino
// acids in the order we find them
console.log(
  sequenceAcids(getGeneSequence(266, 21555))
    .map(codon => lookup(codon))
    .join(', ')
)