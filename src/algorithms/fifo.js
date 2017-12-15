import Proc from './data';
import _ from 'lodash'

function FIFO(procs) {
  let arr = _.cloneDeep(procs)
  arr.sort(
    (proc, proc2) =>
      proc.temps_arivee > proc2.temps_arivee);
  for (let i=1; i < arr.length; i++) {
    arr[i].temps_arivee = Math.max(arr[i-1].temps_arivee + arr[i-1].duree, arr[i].temps_arivee)
  }

  return arr
}

export {
  FIFO as default
}