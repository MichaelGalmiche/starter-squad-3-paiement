    # Mocks des contrats voisins

    Ces modules simulent les contrats **v0** des squads dont la squad 3 · Paiement dépend, pour développer et tester
    sans attendre leur implémentation. Ils suivent les contrats du Context Nexus en version 0.1.0.

    Quand une voisine publie sa v1 (ou qu'un contrat change pendant le Develop), mettez le mock à jour **avec** la spec :
    demandez à Claude « Aligne le mock <nom> sur la nouvelle version du contrat ».

    | Mock | Contrat simulé |
    |---|---|
    | `offre-api.ts` | API d'offre v0 (squad Offre) |
| `regle-prix.ts` | Règle de prix v0 (squad Prix) |
| `payvel.ts` | PSP fictif PayVel |
