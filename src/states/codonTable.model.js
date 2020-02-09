export const spreadCodonTable = {
    'GCT': 'A',
    'GCC': 'A',
    'GCA': 'A',
    'GCG': 'A',

    'CGT': 'R', 
    'CGC': 'R', 
    'CGA': 'R', 
    'CGG': 'R', 
    'AGA': 'R', 
    'AGG': 'R',

    'AAT': 'N', 
    'AAC': 'N',

    'GAT': 'D', 
    'GAC': 'D',

    'TGT': 'C', 
    'TGC': 'C',

    'CAA': 'Q', 
    'CAG': 'Q',

    'GAA': 'E', 
    'GAG': 'E',

    'GGT': 'G', 
    'GGC': 'G', 
    'GGA': 'G', 
    'GGG': 'G',

    'CAT': 'H', 
    'CAC': 'H',

    'ATT': 'I', 
    'ATC': 'I', 
    'ATA': 'I',

    'TTA': 'L', 
    'TTG': 'L', 
    'CTT': 'L', 
    'CTC': 'L', 
    'CTA': 'L', 
    'CTG': 'L',

    'AAA': 'K', 
    'AAG': 'K',

    'ATG': 'M',

    'TTT': 'F', 
    'TTC': 'F',

    'CCT': 'P', 
    'CCC': 'P', 
    'CCA': 'P', 
    'CCG': 'P',

    'TCT': 'S', 
    'TCC': 'S', 
    'TCA': 'S', 
    'TCG': 'S', 
    'AGT': 'S', 
    'AGC': 'S',

    'ACT': 'T', 
    'ACC': 'T', 
    'ACA': 'T', 
    'ACG': 'T',

    'TGG': 'W',

    'TAT': 'Y', 
    'TAC': 'Y',

    'GTT': 'V', 
    'GTC': 'V', 
    'GTA': 'V', 
    'GTG': 'V',

    'TAA': '-', 
    'TGA': '-', 
    'TAG': '-'
}

export const codonTable = {
    'A': ['GCT', 'GCC', 'GCA', 'GCG'],
    'R': ['CGT', 'CGC', 'CGA', 'CGG', 'AGA', 'AGG'],
    'N': ['AAT', 'AAC'],
    'D': ['GAT', 'GAC'],
    'C': ['TGT', 'TGC'],
    'Q': ['CAA', 'CAG'],
    'E': ['GAA', 'GAG'],
    'G': ['GGT', 'GGC', 'GGA', 'GGG'],
    'H': ['CAT', 'CAC'],
    'I': ['ATT', 'ATC', 'ATA'],
    'L': ['TTA', 'TTG', 'CTT', 'CTC', 'CTA', 'CTG'],
    'K': ['AAA', 'AAG'],
    'M': ['ATG'],
    'F': ['TTT', 'TTC'],
    'P': ['CCT', 'CCC', 'CCA', 'CCG'],
    'S': ['TCT', 'TCC', 'TCA', 'TCG', 'AGT', 'AGC'],
    'T': ['ACT', 'ACC', 'ACA', 'ACG'],
    'W': ['TGG'],
    'Y': ['TAT', 'TAC'],
    'V': ['GTT', 'GTC', 'GTA', 'GTG'],
    'stop': ['TAA', 'TGA', 'TAG']
}