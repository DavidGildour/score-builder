const treble = ['G/5', 'F/5', 'E/5', 'D/5', 'C/5', 'B/4', 'A/4', 'G/4', 'F/4', 'E/4', 'D/4'];
const bass = ['B/3', 'A/3', 'G/3', 'F/3', 'E/3', 'D/3', 'C/3', 'B/2', 'A/2', 'G/2', 'F/2'];
const alto = ['A/4', 'G/4', 'F/4', 'E/4', 'D/4', 'C/4', 'B/3', 'A/3', 'G/3', 'F/3', 'E/3'];
const tenor = ['F/4', 'E/4', 'D/4', 'C/4', 'B/3', 'A/3', 'G/3', 'F/3', 'E/3', 'D/3', 'C/3'];
const soprano = ['E/5', 'D/5', 'C/5', 'B/4', 'A/4', 'G/4', 'F/4', 'E/4', 'D/4', 'C/4', 'B/3'];
const mezzosoprano = ['C/5', 'B/4', 'A/4', 'G/4', 'F/4', 'E/4', 'D/4', 'C/4', 'B/3', 'A/3', 'G/3'];
const baritone = ['D/4', 'C/4', 'B/3', 'A/3', 'G/3', 'F/3', 'E/3', 'D/3', 'C/3', 'B/3', 'A/3'];
const subbass = ['G/3', 'F/3', 'E/3', 'D/3', 'C/3', 'B/2', 'A/2', 'G/2', 'F/2', 'E/2', 'D/2'];
const french = ['B/5', 'A/5', 'G/5', 'F/5', 'E/5', 'D/5', 'C/5', 'B/4', 'A/4', 'G/4', 'F/4'];

export const clefMapping = {
    treble: treble,
    bass: bass,
    alto: alto,
    tenor: tenor,
    percussion: treble,
    soprano: soprano,
    'mezzo-soprano': mezzosoprano,
    'baritone-c': baritone,
    'baritone-f': baritone,
    subbass: subbass,
    french: french,
}
