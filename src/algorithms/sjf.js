import Proc from './data';


function SJF(procs) {
  let arr = _.cloneDeep(procs)
  arr.sort(
    (proc, proc2) =>
      proc.duree > proc2.duree);
  for (let i=1; i < arr.length; i++) {
    arr[i].temps_arivee = Math.max(arr[i-1].temps_arivee + arr[i-1].duree, arr[i].temps_arivee)
  }

  return arr
}

export {
  SJF as default
}