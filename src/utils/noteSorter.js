import noteOrder from '../components/mappings/noteOrderMapping';

export default (keys) => (
  keys
    .sort((note1, note2) => {
      const _pitch1 = note1.match(/(.*)\//)[1];
      const _pitch2 = note2.match(/(.*)\//)[1];
      return noteOrder[_pitch1] - noteOrder[_pitch2];
    })
    .sort((note1, note2) => {
      const octave1 = note1.match(/\d/)[0];
      const octave2 = note2.match(/\d/)[0];
      return octave1 - octave2;
    })
)