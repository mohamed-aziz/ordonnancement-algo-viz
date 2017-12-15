import Proc from './data';
import Queue from './queue'
import _ from 'lodash'

function SRT(procs) {
  let arr = _.cloneDeep(procs)
  let m = new Map()
  let q = new Queue()
  let time = Math.min(...arr.map(elem => elem.temps_arivee))
  let spd = 0
  let ls = time
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
  let pr = null
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
      q.sort1()
      if (pr === null) {
        // choose
        pr = _.cloneDeep(q.dequeue())
        pr.temps_arivee = time
      } else {
        // requisition
        if (q.size && q.peek().temps_restant < pr.temps_restant - (time - ls)) {
            let ob = _.cloneDeep(pr)
            pr = _.cloneDeep(q.dequeue())
            pr.temps_arivee = time
            ob.duree = time - ls
            console.log(ob.nom, ob.duree, time, ls)
            ob.temps_restant -= ob.duree
            res.push(ob)
            if (ob.temps_restant > 0) {
                q.enqueue(ob)
                q.sort1()
            }
            ls = time
        }
      }
    }
    if (pr !== null && pr.temps_restant === (time - ls)) {
    console.log(ls, time)
    q.printelems()
      console.log(pr)
      res.push(pr)
      if (q.size) {
        pr = _.cloneDeep(q.dequeue())
        pr.temps_arivee = time
      } else if (spd === arr.length) break
      ls = time
    }

    q.sort1()
    time ++
  }
  
  return res
}

export {
  SRT as default
}