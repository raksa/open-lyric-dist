import { semitones as intervalSemitones } from '@tonaljs/interval';
declare function normalizeChordText(value: any): string;
declare function parseMainKey(keyText: any): {
    raw: string;
    tonic: string;
    chroma: number;
    isMinor: boolean;
    alteration: number;
    keySignature: string;
} | null;
declare function normalizeStructureKeyOption(value: any): string;
declare function transposePitchClass(noteText: any, semitoneOffset: any, targetKeyText: any): string;
declare function transposeChordSymbol(chordText: any, semitoneOffset: any, targetKeyText: any): string;
declare function simplifyChordSymbol(chordText: any): string;
declare function createChordTransposition(sourceKeyText: any, targetKeyText: any): {
    isActive: boolean;
    semitoneOffset: number;
    intervalName: string;
    targetKeyText: string;
};
declare function getAdjacentChromaticKey(keyText: any, stepOffset: any, keyValues: any): any;
declare function createChordDegreeHints(chordKey: any): any[];
declare function createChordDatabaseSearchData(chordKey: any): {
    bassPitchClass: number | null;
    bassRoot: string;
    chordInfo: import("@tonaljs/chord").Chord;
    datasetRoot: string;
    normalizedChordKey: string;
    rawSuffix: string;
    root: string;
    suffixCandidates: any[];
} | null;
declare function describeChordKey(chordKey: any): string;
export { createChordDatabaseSearchData, createChordDegreeHints, createChordTransposition, describeChordKey, getAdjacentChromaticKey, normalizeChordText, normalizeStructureKeyOption, parseMainKey, simplifyChordSymbol, transposeChordSymbol, transposePitchClass, intervalSemitones, };
