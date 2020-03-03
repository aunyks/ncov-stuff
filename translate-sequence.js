const { join } = require('path')
const { readFileSync } = require('fs')
const lookup = require('./translate-codons')

// which part of the genome are we reading?
const START_INDEX = 29558
const END_INDEX = 29674

const sequence = readFileSync(join('.', 'nih-seq.txt'), { encoding: 'utf8' })
  // cDNA to mRNA
  .split('t').join('u')

//console.log(`The sequence is ${sequence.length} characters in length`)

// The indices are based on values found in the NIH
// report (https://www.ncbi.nlm.nih.gov/nuccore/MN908947.3)
// which are 1-index (as opposed to 0-indexing typical in computing)
const getGeneSequence = (startIndex, endIndex) => {
  return sequence.substring(startIndex - 1, endIndex)
}

// group the sequence into threes
const sequenceAcids = seq => {
  const acids = []
  for (let i = 0; i <= seq.length - 3; i += 3) {
    const codon = seq.substring(i, i + 3)
    acids.push(codon)
  }
  return acids
}

// print the look up the codons we've found
// in our codon table and print the amino
// acids in the order we find them
console.log(
  sequenceAcids(getGeneSequence(START_INDEX, END_INDEX))
    .map(codon => lookup(codon, 'initial'))
    .join('')
    // Remove STOPs, for demonstration
    .split('STOP').join('')
)