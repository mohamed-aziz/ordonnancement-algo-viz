class Processus {
    constructor (nom, prioritee=0, temps_arivee=0, duree=0) {
        this.nom = nom;
        this.prioritee = prioritee;
        this.temps_arivee = temps_arivee;
        this.duree = duree;

        this.temps_restant = duree
      } 
}

export {
    Processus as default
}
  