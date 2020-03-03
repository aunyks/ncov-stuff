const isRNANucleotide = n => {
  const lowerN = n.toLowerCase()
  return (
    lowerN === 'a' || // adenine
    lowerN === 'u' || // uracil
    lowerN === 'c' || // cytosine
    lowerN === 'g'    // guanine
  )
}

const shortcodeToInitial = {
  START: 'M',
  STOP: 'STOP',
  Phe: 'F',
  Leu: 'L',
  Ile: 'I',
  Met: 'M',
  Val: 'V',
  Ser: 'S',
  Pro: 'P',
  Thr: 'T',
  Ala: 'A',
  His: 'H',
  Gln: 'Q',
  Asn: 'N',
  Lys: 'K',
  Asp: 'D',
  Glu: 'E',
  Cys: 'C',
  Trp: 'W',
  Arg: 'R',
  Gly: 'G',
  Tyr: 'Y'
}

const shortcodeToAminoAcid = {
  START: 'START',
  STOP: 'STOP',
  Phe: 'Phenylalanine',
  Leu: 'Leucine',
  Ile: 'Isoleucine',
  Met: 'Methionine (START)',
  Val: 'Valine',
  Ser: 'Serine',
  Pro: 'Proline',
  Thr: 'Threonine',
  Ala: 'Alanine',
  His: 'Histidine',
  Gln: 'Glutamine',
  Asn: 'Asparagine',
  Lys: 'Lysine',
  Asp: 'Aspartic acid',
  Glu: 'Glutamic acid',
  Cys: 'Cysteine',
  Trp: 'Tryptophan',
  Arg: 'Arginine',
  Gly: 'Glycine',
  Tyr: 'Tyrosine'
}

// A trie representing the
// codon table, which maps codons
// to the amino acids they encode
const codonTrie = {
  u: {
    u: {
      u: 'Phe',
      c: 'Phe',
      a: 'Leu',
      g: 'Leu'
    },
    c: {
      u: 'Ser',
      c: 'Ser',
      a: 'Ser',
      g: 'Ser'
    },
    a: {
      u: 'Tyr',
      c: 'Tyr',
      a: 'STOP',
      g: 'STOP'
    },
    g: {
      u: 'Cys',
      c: 'Cys',
      a: 'STOP',
      g: 'STOP'
    }
  },
  c: {
    u: {
      u: 'Leu',
      c: 'Leu',
      a: 'Leu',
      g: 'Leu'
    },
    c: {
      u: 'Pro',
      c: 'Pro',
      a: 'Pro',
      g: 'Pro'
    },
    a: {
      u: 'His',
      c: 'His',
      a: 'Gln',
      g: 'Gln'
    },
    g: {
      u: 'Arg',
      c: 'Arg',
      a: 'Arg',
      g: 'Arg'
    }
  },
  a: {
    u: {
      u: 'Ile',
      c: 'Ile',
      a: 'Ile',
      // Since afaik nCov primarily
      // infects animals (eukaryotes)
      // and not prokaryotes, this is
      // Met and not fMet
      g: 'Met'
    },
    c: {
      u: 'Thr',
      c: 'Thr',
      a: 'Thr',
      g: 'Thr'
    },
    a: {
      u: 'Asn',
      c: 'Asn',
      a: 'Lys',
      g: 'Lys'
    },
    g: {
      u: 'Ser',
      c: 'Ser',
      a: 'Arg',
      g: 'Arg'
    }
  },
  g: {
    u: {
      u: 'Val',
      c: 'Val',
      a: 'Val',
      g: 'Val'
    },
    c: {
      u: 'Ala',
      c: 'Ala',
      a: 'Ala',
      g: 'Ala'
    },
    a: {
      u: 'Asp',
      c: 'Asp',
      a: 'Glu',
      g: 'Glu'
    },
    g: {
      u: 'Gly',
      c: 'Gly',
      a: 'Gly',
      g: 'Gly'
    }
  }
}

module.exports =
  (codon, format = 'fullName' /* | 'initial' | 'shorthand'*/) => {
    // If we don't have three nucleotides,
    // we don't have a codon
    if (codon.length !== 3) {
      throw new Error('Codons must be three nucleotides in length')
    }
    // If a letter in the codon string
    // doesn't represent
    // a valid RNA nucleotide WE DONT WANT IT
    const nucleotides = codon.split('')
    if (!nucleotides.every(n => isRNANucleotide(n))) {
      throw new Error(`We found an invalid nucleotide in the codon ${codon}`)
    }
    // Make the nucleotides lower case before
    // we look them up in the codon table
    const lowerCaseNucleotides = nucleotides.map(n => n.toLowerCase())
    // Split the codon string into each
    // individual letters representing
    // its nucleotide
    const [n1, n2, n3] = lowerCaseNucleotides
    // search the codon table and return
    // the amino acid that's encoded by 
    // this codon
    const shortcode = codonTrie[n1][n2][n3]
    if (format === 'fullName') {
      return shortcodeToAminoAcid[shortcode]
    } else if (format === 'shortcode') {
      return shortcode
    } else {
      return shortcodeToInitial[shortcode]
    }
  }