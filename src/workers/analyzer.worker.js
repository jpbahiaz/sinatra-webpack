// WORKEEEERRRR YEAAAH
import { Analyzer } from '../services/analyzer.service'

self.addEventListener('message', function(e){
    const sequence = e.data.sequence;
    const table = e.data.table;
    let pattern;
    let textPattern;
    if(e.data.pattern) textPattern = e.data.pattern.replace(/\s/g);

    switch(e.data.state){
        case 'translate':
            this.self.postMessage({
                result: Analyzer.sequenceTranslate(sequence, table),
                state: e.data.state,
                sequenceId: e.data.sequenceId,
                identifier: e.data.identifier,
                source: e.data.source
            });
            break;

        case 'reverseComplement':
            this.self.postMessage({
                result: Analyzer.reverseComplement(sequence),
                state: e.data.state,
                sequenceId: e.data.sequenceId,
                identifier: e.data.identifier,
                source: e.data.source
            });
            break;

        case 'searchDna':
            pattern = new RegExp(Analyzer.buildPattern(textPattern), 'gi');

            this.self.postMessage({
                result: Array.from(e.data.sequence.matchAll(pattern)),
                state: e.data.state,
                sequenceId: e.data.sequenceId,
                identifier: e.data.identifier,
                source: e.data.source
            });
            break;

        case 'searchProtein':
            pattern = new RegExp(Analyzer.buildPattern(textPattern), 'gi');

            this.self.postMessage({
                result: Array.from(e.data.sequence.matchAll(pattern)),
                state: e.data.state,
                sequenceId: e.data.sequenceId,
                identifier: e.data.identifier,
                source: e.data.source
            });
            break;

        case 'searchProteinDna':
            let frames = Analyzer.sequenceTranslate(sequence, table);
            pattern = new RegExp(Analyzer.buildPattern(textPattern), 'gi');
            let result = {}
            result.length = 0;
            
            for(let frame in frames){
                let match = Array.from(frames[frame].matchAll(pattern));
                if(match.length){
                    result[frame] = match;
                    result.length++;
                }
            }
            this.self.postMessage({
                result: result,
                state: e.data.state,
                sequenceId: e.data.sequenceId,
                identifier: e.data.identifier,
                source: e.data.source
            });
            break;

        default:
            break; 
    }
});

/**
>teste
tttgggaaatttagaggaggattaggagatagatagat
t2ag2-3a

>teste
aaatcgtgtgctgctagctgctagct
KS

c6c5cc5c8c

--> Realçar somente as letras delimitadas no padrão
--> Mostrar nos resultados o ultimo submetido
 */