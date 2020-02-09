// Analyzer Service

export const Analyzer = (function(){
    function codonToAminoacid(codon, table){
        // switch(codon.toUpperCase()){
        //     case 'GCT':
        //     case 'GCC':
        //     case 'GCA':
        //     case 'GCG':
        //         return 'A'
        //     case 'CGT': 
        //     case 'CGC': 
        //     case 'CGA': 
        //     case 'CGG': 
        //     case 'AGA': 
        //     case 'AGG':
        //         return 'R'
        //     case 'AAT': 
        //     case 'AAC':
        //         return 'N'
        //     case 'GAT': 
        //     case 'GAC':
        //         return 'D'
        //     case 'TGT': 
        //     case 'TGC':
        //         return 'C'
        //     case 'CAA': 
        //     case 'CAG':
        //         return 'Q'
        //     case 'GAA': 
        //     case 'GAG':
        //         return 'E'
        //     case 'GGT': 
        //     case 'GGC': 
        //     case 'GGA': 
        //     case 'GGG':
        //         return 'G'
        //     case 'CAT': 
        //     case 'CAC':
        //         return 'H'
        //     case 'ATT': 
        //     case 'ATC': 
        //     case 'ATA':
        //         return 'I'
        //     case 'TTA': 
        //     case 'TTG': 
        //     case 'CTT': 
        //     case 'CTC': 
        //     case 'CTA': 
        //     case 'CTG':
        //         return 'L'
        //     case 'AAA': 
        //     case 'AAG':
        //         return 'K'
        //     case 'ATG':
        //         return 'M'
        //     case 'TTT': 
        //     case 'TTC':
        //         return 'F'
        //     case 'CCT': 
        //     case 'CCC': 
        //     case 'CCA': 
        //     case 'CCG':
        //         return 'P'
        //     case 'TCT': 
        //     case 'TCC': 
        //     case 'TCA': 
        //     case 'TCG': 
        //     case 'AGT': 
        //     case 'AGC':
        //         return 'S'
        //     case 'ACT': 
        //     case 'ACC': 
        //     case 'ACA': 
        //     case 'ACG':
        //         return 'T'
        //     case 'TGG':
        //         return 'W'            
        //     case 'TAT': 
        //     case 'TAC':
        //         return 'Y'
        //     case 'GTT': 
        //     case 'GTC': 
        //     case 'GTA': 
        //     case 'GTG':
        //         return 'V'
        //     case 'TAA': 
        //     case 'TGA': 
        //     case 'TAG':
        //         return '-'
        //     default:
        //         return 'X'
        // }
        for(let aminoacid in table){
            if(table[aminoacid].indexOf(codon.toUpperCase()) !== -1){
                return aminoacid === 'stop' ? '-' : aminoacid;
            }
        }
        return 'X'
    }

    function nucleotidReverse(nucleotid){
        switch(nucleotid.toUpperCase()){
        case 'A':
            return 'T'
        case 'T':
            return 'A'
        case 'G':
            return 'C'
        case 'C':
            return 'G'
        default:
            return nucleotid.toUpperCase()
        }
    }

    function reverseComplement(sequence){
        const nucleotids = Array.from(sequence).reverse();
        return nucleotids.reduce((result, nucleotid) => result + nucleotidReverse(nucleotid), '');
    }

    function sequenceTranslate(dnaSequence, table){
        const result = {}
        //## Contig
        result["5'3'Frame1"] = dnaSequence.match(/\w{3}/g).reduce((res, codon) => res + codonToAminoacid(codon, table), '');  //# 5'3'Frame1
        result["5'3'Frame2"] = dnaSequence.slice(1).match(/\w{3}/g).reduce((res, codon) => res + codonToAminoacid(codon, table), ''); //# 5'3'Frame2
        result["5'3'Frame3"] = dnaSequence.slice(2).match(/\w{3}/g).reduce((res, codon) => res + codonToAminoacid(codon, table), ''); //# 5'3'Frame3

        //## Contig Reverse Complement
        let reverse_complement = reverseComplement(dnaSequence);

        result["3'5'Frame1"] = reverse_complement.match(/\w{3}/g).reduce((res, codon) => res + codonToAminoacid(codon, table), ''); //# 3'5'Frame1
        result["3'5'Frame2"] = reverse_complement.slice(1).match(/\w{3}/g).reduce((res, codon) => res + codonToAminoacid(codon, table), ''); //# 3'5'Frame2
        result["3'5'Frame3"] = reverse_complement.slice(2).match(/\w{3}/g).reduce((res, codon) => res + codonToAminoacid(codon, table), ''); //# 3'5'Frame3

        return result
    }

    // Read file as text and call function callback passing iterator with the sequences
    function readFastaFile(file, callback){
        const fileReader = new FileReader();

        fileReader.onload = function(){
            const text = fileReader.result;
            const sequencesIt = matchSequences(text);

            callback(sequencesIt);
        }
        fileReader.readAsText(file);
    }

    // Match sequences and return iterator
    function matchSequences(string){
        return string.matchAll(/>(?<id>.*)\s+(?<sequence>.*)/g);
    }

    function buildPattern(pattern){
        let res = '';
        let letterReg = /(?<aminoacid>\w)/;
        let letterNumberReg = /(?<aminoacid>\w)(?<number>\d+)/;
        let letterRangeReg = /(?<aminoacid>\w)(?<init>\d+)-(?<end>\d+)/;
    
        let letterMatch = pattern.match(letterReg);
        let letterNumberMatch = pattern.match(letterNumberReg);
        let letterRangeMatch = pattern.match(letterRangeReg);
    
    
        while(letterMatch || letterNumberMatch || letterNumberMatch){
            if(letterRangeMatch && letterRangeMatch.index === 0){
                res += `${letterRangeMatch.groups.aminoacid}.{${letterRangeMatch.groups.init},${letterRangeMatch.groups.end}}`;
                pattern = pattern.replace(letterRangeMatch[0], "");
            }else if(letterNumberMatch && letterNumberMatch.index === 0){
                res += `${letterNumberMatch.groups.aminoacid}.{${letterNumberMatch.groups.number}}`;
                pattern = pattern.replace(letterNumberMatch[0], "");
            } else if(letterMatch && letterMatch.index === 0){
                res += `${letterMatch.groups.aminoacid}`;
                pattern = pattern.replace(letterMatch[0], "");
            }else{
                // Can't match anything
            }
    
            letterMatch = pattern.match(letterReg);
            letterNumberMatch = pattern.match(letterNumberReg);
            letterRangeMatch = pattern.match(letterRangeReg);
        }
    
        return res;
    }

    return {
        reverseComplement: reverseComplement,
        sequenceTranslate: sequenceTranslate,
        readFastaFile: readFastaFile,
        matchSequences: matchSequences,
        buildPattern: buildPattern
    }
})();