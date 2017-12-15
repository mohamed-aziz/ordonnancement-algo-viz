import Proc from './data';
import _ from 'lodash'
import Queue from './queue'

function RR(procs, quantum) {
  let arr = _.cloneDeep(procs)
  let q = new Queue()
  let m = new Map()
  let res = new Array()
  
  arr.forEach(element => {
    if (m.has(element.temps_arivee)) {
      let e = m.get(element.temps_arivee)
      if (Array.isArray(e)) {
        e.push(element)
      } else {
        e = [e, element] 
      }
      m.set(element.temps_arivee, e)
    } else {
      m.set(element.temps_arivee, element)
    }
  })

  let time = Math.min(...arr.map(elem => elem.temps_arivee))
  let mz = time
  let spd = 0
  let lt = time
  while (true) {
    if (m.get(time)) {
      let objekt = _.cloneDeep(m.get(time))
      if (Array.isArray(objekt)) {
        for (let elem of objekt) {
          q.enqueue(_.cloneDeep(elem))
          spd ++
        }
      }
      else {
        objekt.time = time
        q.enqueue(objekt)
        spd ++
      }
      q.sort()
    }
    if (q.size && q.peek().temps_restant <= quantum) {
      let objekt = _.cloneDeep(q.dequeue())
      objekt.temps_arivee = lt
      objekt.duree = objekt.temps_restant
      objekt.temps_restant = 0
      res.push(objekt)
      lt = objekt.temps_arivee + objekt.duree
    }
    else if (q.size &&  (time - mz) % quantum === 0) {
      let objekt = _.cloneDeep(q.dequeue())
      objekt.temps_arivee = lt
      objekt.duree = quantum
      res.push(objekt)
      let ob = _.cloneDeep(objekt)
      ob.temps_arivee += quantum
      ob.temps_restant -= quantum
      lt = ob.temps_arivee
      ob.time = time
      q.enqueue(ob)
      q.sort()
    }
    // fk
    q.sort()

    if (spd === arr.length && q.size === 0) {
      break
    }
    time ++
  }

  return res
}

export {
  RR as default
}